import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CxProperty, CX_PROPERTY_STATUS_INFO } from '@/types/correspondente';
import { useCxDocuments } from '@/hooks/useCxClients';
import { CxDocumentWorkspace } from './CxDocumentWorkspace';
import { CopyField } from './CopyField';
import { Building2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

const BRAND = '#1a3a6b';

function PropertyNarrative({ property }: { property: CxProperty }) {
  const { documents, openDocument, downloadDocument, deleteDocument, retryExtraction, updateExtraction } =
    useCxDocuments(null, property.id);

  return (
    <div className="p-4 border-t border-slate-100 space-y-4 bg-slate-50/60">
      <div className="grid gap-2 sm:grid-cols-2">
        <CopyField label="Nome do imóvel" value={property.name} />
        {property.registration_number && (
          <CopyField label="Matrícula" value={property.registration_number} />
        )}
        {property.notary_office && <CopyField label="Cartório" value={property.notary_office} />}
        {property.address && <CopyField label="Endereço" value={property.address} />}
      </div>

      {documents.length === 0 ? (
        <p className="text-xs text-slate-500">
          Nenhum documento de narrativa enviado para este imóvel ainda.
        </p>
      ) : (
        <CxDocumentWorkspace
          documents={documents}
          onOpen={openDocument}
          onDownload={downloadDocument}
          onDelete={deleteDocument}
          onRetry={retryExtraction}
          onUpdateExtraction={updateExtraction}
        />
      )}
    </div>
  );
}

export function CxClientProperties({ clientId }: { clientId: string }) {
  const [properties, setProperties] = useState<CxProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    supabase
      .from('cx_properties')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (!active) return;
        setProperties((data || []) as unknown as CxProperty[]);
        setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [clientId]);

  if (isLoading) {
    return (
      <div className="py-6 flex justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center">
        <Building2 className="w-9 h-9 text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-600">Nenhum imóvel vinculado</p>
        <p className="text-xs text-slate-400 mt-1">
          Em “Checagem de Narrativas”, escolha este cliente no campo “Cliente vinculado”.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {properties.map((p) => {
        const st = CX_PROPERTY_STATUS_INFO(p.status);
        const open = openId === p.id;
        return (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setOpenId(open ? null : p.id)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
            >
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: BRAND }}
              >
                <Building2 className="w-5 h-5" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-slate-900 truncate">{p.name}</span>
                <span className="block text-xs text-slate-500 truncate">
                  {p.address || p.registration_number || 'Sem endereço informado'}
                </span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${st.color} ${st.bg}`}
              >
                {st.label}
              </span>
              {open ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>
            {open && <PropertyNarrative property={p} />}
          </div>
        );
      })}
    </div>
  );
}
