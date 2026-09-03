import { useMemo, useState } from 'react';
import { CxProperty, CX_PROPERTY_STATUS_INFO } from '@/types/correspondente';
import { useCxProperties } from '@/hooks/useCxProperties';
import { useCxDocuments } from '@/hooks/useCxClients';
import { CxDocumentWorkspace } from './CxDocumentWorkspace';
import { CxSearchSelect } from './CxSearchSelect';
import { CopyField } from './CopyField';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Building2, ChevronDown, ChevronUp, Loader2, Link2, Unlink } from 'lucide-react';

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
  const { properties, isLoading, updateProperty } = useCxProperties();
  const [openId, setOpenId] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);

  const linked = useMemo(
    () => properties.filter((p) => p.client_id === clientId),
    [properties, clientId],
  );

  const available = useMemo(
    () => properties.filter((p) => p.client_id !== clientId),
    [properties, clientId],
  );

  const handleLink = async (propertyId: string | null) => {
    if (!propertyId) return;
    setLinking(true);
    const ok = await updateProperty(propertyId, { client_id: clientId });
    setLinking(false);
    if (ok) toast.success('Imóvel vinculado ao cliente');
  };

  return (
    <div className="space-y-3">
      {/* Vincular narrativa existente */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-2">
          <Link2 className="w-3.5 h-3.5" /> Vincular narrativa de um imóvel
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <CxSearchSelect
              value={null}
              onChange={handleLink}
              placeholder="Buscar imóvel pelo nome…"
              searchPlaceholder="Buscar imóvel pelo nome, endereço ou matrícula…"
              emptyText="Nenhum imóvel disponível"
              options={available.map((p) => ({
                value: p.id,
                label: p.name,
                hint: p.address || p.registration_number || undefined,
              }))}
            />
          </div>
          {linking && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
        </div>
      </div>

      {isLoading ? (
        <div className="py-6 flex justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        </div>
      ) : linked.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center">
          <Building2 className="w-9 h-9 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600">Nenhum imóvel vinculado</p>
          <p className="text-xs text-slate-400 mt-1">
            Use a busca acima para vincular a narrativa de um imóvel já checado.
          </p>
        </div>
      ) : (
        linked.map((p) => {
          const st = CX_PROPERTY_STATUS_INFO(p.status);
          const open = openId === p.id;
          return (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <button
                  onClick={() => setOpenId(open ? null : p.id)}
                  className="flex-1 flex items-center gap-3 text-left min-w-0"
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-red-600 flex-shrink-0"
                  title="Desvincular imóvel"
                  onClick={async () => {
                    const ok = await updateProperty(p.id, { client_id: null });
                    if (ok) toast.success('Imóvel desvinculado');
                  }}
                >
                  <Unlink className="w-4 h-4" />
                </Button>
              </div>
              {open && <PropertyNarrative property={p} />}
            </div>
          );
        })
      )}
    </div>
  );
}
