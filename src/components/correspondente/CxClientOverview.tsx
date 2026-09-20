import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CopyField } from '@/components/correspondente/CopyField';
import { CxClient, CxDocument } from '@/types/correspondente';
import { consolidateProfile, CX_PROFILE_LABELS, CxProfileData } from '@/lib/cxProfile';
import { IdCard, Loader2, RefreshCw, Sparkles, Wallet } from 'lucide-react';

const BRAND = '#1a3a6b';

const money = (v?: number | null) =>
  v == null ? '' : v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

interface Props {
  client: CxClient;
  documents: CxDocument[];
  onFillFromDocuments: (profile: CxProfileData) => Promise<void>;
}

export function CxClientOverview({ client, documents, onFillFromDocuments }: Props) {
  const [saving, setSaving] = useState(false);

  const fromDocs = useMemo(() => consolidateProfile(documents), [documents]);

  const rows = CX_PROFILE_LABELS.map(({ key, label }) => {
    const saved = (client as unknown as Record<string, unknown>)[key];
    const value = key === 'full_name' ? client.full_name : (saved as string | null) || (fromDocs[key] as string) || '';
    const suggested = !saved && !!fromDocs[key] && key !== 'full_name';
    return { key, label, value: value ? String(value) : '', suggested };
  }).filter((r) => r.value);

  const income = client.monthly_income ?? fromDocs.monthly_income ?? null;
  const missing = CX_PROFILE_LABELS.filter(
    ({ key }) => !((client as unknown as Record<string, unknown>)[key] || fromDocs[key]),
  );

  const hasSuggestions = rows.some((r) => r.suggested) || (!client.monthly_income && fromDocs.monthly_income != null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <IdCard className="w-4 h-4" style={{ color: BRAND }} />
          Ficha do cliente
        </h3>
        {hasSuggestions && (
          <Button
            size="sm"
            className="text-white hover:opacity-90"
            style={{ backgroundColor: BRAND }}
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              await onFillFromDocuments(fromDocs);
              setSaving(false);
            }}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Preencher com os documentos
          </Button>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center">
          <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-600 font-medium">Ainda sem dados pessoais</p>
          <p className="text-xs text-slate-400 mt-1">Envie um documento para preencher a ficha automaticamente.</p>
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <div key={r.key} className="relative">
              <CopyField label={r.label} value={r.value} />
              {r.suggested && (
                <span className="absolute top-1.5 right-9 text-[9px] font-bold uppercase tracking-wide text-blue-600 bg-blue-50 rounded px-1.5 py-0.5">
                  dos documentos
                </span>
              )}
            </div>
          ))}
          {income != null && <CopyField label="Renda mensal" value={money(income)} />}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Wallet className="w-3.5 h-3.5 text-slate-400" />
          {documents.length} documento(s) anexado(s)
        </span>
        {missing.length > 0 && (
          <span className="text-amber-600">
            Falta: {missing.map((m) => m.label).join(', ')}
          </span>
        )}
      </div>
    </div>
  );
}
