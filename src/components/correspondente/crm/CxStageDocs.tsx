import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle2, FileText, FileUp, Loader2, Sparkles } from 'lucide-react';
import { fileToBase64, openCxFile, saveCxFile } from '@/lib/cxDocFiles';
import { CxDeal } from '@/types/cxCrm';

export interface StageDoc {
  id: string;
  file_name: string;
  file_path: string;
  doc_type: string;
  stage: string | null;
  created_at: string;
}

export function useDealDocs(dealId: string) {
  const [docs, setDocs] = useState<StageDoc[]>([]);
  const refetch = useCallback(async () => {
    const { data } = await supabase
      .from('cx_documents')
      .select('id, file_name, file_path, doc_type, stage, created_at')
      .eq('deal_id' as never, dealId)
      .order('created_at', { ascending: false });
    setDocs((data || []) as unknown as StageDoc[]);
  }, [dealId]);
  useEffect(() => {
    refetch();
  }, [refetch]);
  return { docs, refetch };
}

const NUM_KEYS = ['property_value', 'financing_value', 'down_payment', 'fgts_value', 'subsidy_value', 'monthly_income', 'installment_value', 'margin_value', 'approved_value'];

interface SlotProps {
  deal: CxDeal;
  stage: string;
  docType: string;
  label: string;
  hint?: string;
  docs: StageDoc[];
  onSaved: () => void;
  /** Lê os dados do financiamento e grava no caso. */
  autofill?: boolean;
  onUpdate?: (id: string, patch: Partial<CxDeal>) => Promise<boolean>;
}

export function CxStageDocSlot({ deal, stage, docType, label, hint, docs, onSaved, autofill, onUpdate }: SlotProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const mine = docs.filter((d) => d.doc_type === docType);

  const handle = async (file: File) => {
    setBusy(true);
    try {
      let extracted: Record<string, unknown> | null = null;
      if (autofill) {
        const base64 = await fileToBase64(file);
        const { data, error } = await supabase.functions.invoke('extract-financing-data', {
          body: { fileBase64: base64, mimeType: file.type || 'image/jpeg' },
        });
        if (!error && !data?.error) extracted = (data?.data ?? null) as Record<string, unknown> | null;
      }
      await saveCxFile({ clientId: deal.client_id, file, docType, extracted, dealId: deal.id, stage });
      if (extracted && onUpdate) {
        const patch: Record<string, unknown> = {};
        Object.entries(extracted).forEach(([k, v]) => {
          if (v === null || v === undefined || String(v).trim() === '') return;
          if (NUM_KEYS.includes(k)) {
            const n = typeof v === 'number' ? v : Number(String(v).replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3})/g, '').replace(',', '.'));
            if (Number.isFinite(n) && n > 0) patch[k] = n;
          } else if (['bank', 'rating', 'pendencies', 'notes'].includes(k)) {
            patch[k] = String(v);
          }
        });
        if (Object.keys(patch).length) {
          await onUpdate(deal.id, patch as Partial<CxDeal>);
          toast.success(`${label} anexado`, { description: `${Object.keys(patch).length} dado(s) do financiamento preenchidos.` });
        } else {
          toast.success(`${label} anexado`, { description: 'Nenhum dado de financiamento encontrado para preencher.' });
        }
      } else {
        toast.success(`${label} anexado`);
      }
      onSaved();
    } catch (e) {
      toast.error('Falha ao anexar', { description: e instanceof Error ? e.message : undefined });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`rounded-lg border p-3 ${mine.length ? 'border-emerald-200 bg-emerald-50/50' : 'border-dashed border-slate-300 bg-slate-50'}`}>
      <input
        ref={ref}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = '';
          if (f) handle(f);
        }}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            {mine.length ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5 text-slate-400" />}
            {label}
            {autofill && <Sparkles className="w-3 h-3 text-amber-500" />}
          </p>
          {hint && <p className="text-[11px] text-slate-500">{hint}</p>}
        </div>
        <Button size="sm" variant="outline" disabled={busy} onClick={() => ref.current?.click()} className="h-8 text-xs bg-white border-slate-200 text-slate-700 hover:bg-slate-100">
          {busy ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <FileUp className="w-3.5 h-3.5 mr-1.5" />}
          {busy ? (autofill ? 'Lendo…' : 'Enviando…') : mine.length ? 'Anexar outro' : 'Anexar'}
        </Button>
      </div>
      {mine.length > 0 && (
        <ul className="mt-2 space-y-1">
          {mine.map((d) => (
            <li key={d.id}>
              <button
                onClick={() => openCxFile(d.file_path).catch((e) => toast.error(e.message))}
                className="text-[11px] text-[#1a3a6b] hover:underline truncate max-w-full text-left"
              >
                {d.file_name} · {new Date(d.created_at).toLocaleDateString('pt-BR')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
