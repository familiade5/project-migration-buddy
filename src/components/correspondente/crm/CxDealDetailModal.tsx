import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  CxDeal,
  CxDealStage,
  CxRejectionReason,
  CxStage,
  CX_REJECTION_CONFIG,
  cxCurrency,
  CX_BANKS,
  cxDaysUntil,
  cxStageCfg,
} from '@/types/cxCrm';
import { useCxDealDetail } from '@/hooks/useCxDeals';
import { CalendarClock, FileText, History, Loader2, Pencil, Sparkles, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const BRAND = '#1a3a6b';
const BTN = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900';
const POPOVER = 'bg-white text-slate-900 border-slate-200';
const ITEM = 'text-slate-700 focus:bg-slate-100 focus:text-slate-900';
const FIELD = 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400';

interface Props {
  deal: CxDeal | null;
  stages: CxStage[];
  clientName: string;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<CxDeal>) => Promise<boolean>;
  onMove: (id: string, from: CxDealStage, to: CxDealStage) => void;
  onDelete: (id: string) => void;
  onEdit: (deal: CxDeal) => void;
  onOpenClient: (clientId: string) => void;
}

function fmtDate(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('pt-BR');
}

export function CxDealDetailModal({
  deal,
  stages,
  clientName,
  onClose,
  onUpdate,
  onMove,
  onDelete,
  onEdit,
  onOpenClient,
}: Props) {
  const { history, checks, addCheck, refetch } = useCxDealDetail(deal?.id ?? null);
  const [check, setCheck] = useState({ rating: '', margin_value: '', approved_value: '', result: '', notes: '' });
  const [review, setReview] = useState({ next_review_at: '', review_interval_days: '30' });
  const [fin, setFin] = useState<FinForm>(emptyFin);
  const [finDirty, setFinDirty] = useState(false);
  const [finLoading, setFinLoading] = useState(false);
  const finFileRef = useRef<HTMLInputElement>(null);

  const extractFinancing = async (file: File) => {
    setFinLoading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result).split(',')[1] || '');
        r.onerror = () => reject(new Error('Não foi possível ler o arquivo'));
        r.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke('extract-financing-data', {
        body: { fileBase64: base64, mimeType: file.type || 'image/jpeg' },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const d = (data?.data ?? {}) as Record<string, unknown>;
      const keys: (keyof FinForm)[] = [
        'bank', 'property_value', 'financing_value', 'down_payment', 'fgts_value',
        'subsidy_value', 'monthly_income', 'installment_value', 'rating',
        'margin_value', 'approved_value', 'pendencies', 'notes',
      ];
      let filled = 0;
      setFin((prev) => {
        const next = { ...prev };
        keys.forEach((k) => {
          const v = d[k];
          if (v !== null && v !== undefined && String(v).trim() !== '') {
            next[k] = String(v);
            filled += 1;
          }
        });
        return next;
      });

      if (filled === 0) {
        toast.error('Não encontramos dados de financiamento neste documento.');
      } else {
        setFinDirty(true);
        toast.success(`${filled} campo(s) preenchido(s). Confira e salve.`);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Falha ao ler o documento');
    } finally {
      setFinLoading(false);
    }
  };

  const resetFin = (d: CxDeal) => {
    setFin(finFromDeal(d));
    setFinDirty(false);
  };

  const setFinField = (key: keyof FinForm, value: string) => {
    setFin((p) => ({ ...p, [key]: value }));
    setFinDirty(true);
  };

  useEffect(() => {
    if (!deal) return;
    setReview({
      next_review_at: deal.next_review_at || '',
      review_interval_days: String(deal.review_interval_days ?? 30),
    });
    setCheck({ rating: '', margin_value: '', approved_value: '', result: '', notes: '' });
    resetFin(deal);
  }, [deal?.id]);

  if (!deal) return null;

  const cfg = cxStageCfg(stages, deal.stage);
  const days = cxDaysUntil(deal.next_review_at);
  const isRejected = deal.stage === 'reprovado';

  const saveFin = async () => {
    const ok = await onUpdate(deal.id, {
      bank: fin.bank || null,
      property_value: num(fin.property_value),
      financing_value: num(fin.financing_value),
      down_payment: num(fin.down_payment),
      fgts_value: num(fin.fgts_value),
      subsidy_value: num(fin.subsidy_value),
      monthly_income: num(fin.monthly_income),
      installment_value: num(fin.installment_value),
      rating: fin.rating.trim() || null,
      margin_value: num(fin.margin_value),
      approved_value: num(fin.approved_value),
      responsible_name: fin.responsible_name.trim() || null,
      pendencies: fin.pendencies.trim() || null,
      notes: fin.notes.trim() || null,
    });
    if (ok) setFinDirty(false);
  };

  const saveReview = async () => {
    await onUpdate(deal.id, {
      next_review_at: review.next_review_at || null,
      review_interval_days: Number(review.review_interval_days) || 30,
    });
  };

  const submitCheck = async () => {
    const ok = await addCheck({
      rating: check.rating.trim() || null,
      margin_value: check.margin_value ? Number(check.margin_value) : null,
      approved_value: check.approved_value ? Number(check.approved_value) : null,
      result: check.result || null,
      notes: check.notes.trim() || null,
    });
    if (!ok) return;
    const patch: Partial<CxDeal> = {
      rating: check.rating.trim() || deal.rating,
      margin_value: check.margin_value ? Number(check.margin_value) : deal.margin_value,
      approved_value: check.approved_value ? Number(check.approved_value) : deal.approved_value,
    };
    const interval = Number(review.review_interval_days) || 30;
    const next = new Date();
    next.setDate(next.getDate() + interval);
    patch.next_review_at = next.toISOString().slice(0, 10);
    await onUpdate(deal.id, patch);
    setReview((p) => ({ ...p, next_review_at: patch.next_review_at as string }));
    setCheck({ rating: '', margin_value: '', approved_value: '', result: '', notes: '' });
    refetch();
  };

  const money = (v: number | null) => (v == null ? '—' : cxCurrency(v));

  return (
    <Dialog open={!!deal} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl bg-white text-slate-900 max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2" style={{ color: BRAND }}>
            {clientName}
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: cfg.bg, color: cfg.color }}
            >
              {cfg.label}
            </span>
            {isRejected && deal.rejection_reason && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                {CX_REJECTION_CONFIG[deal.rejection_reason].short}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className={BTN} onClick={() => onEdit(deal)}>
            <Pencil className="w-3.5 h-3.5 mr-1.5" /> Editar
          </Button>
          <Button size="sm" variant="outline" className={BTN} onClick={() => onOpenClient(deal.client_id)}>
            <FileText className="w-3.5 h-3.5 mr-1.5" /> Documentos do cliente
          </Button>
          <input
            ref={finFileRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = '';
              if (f) extractFinancing(f);
            }}
          />
          <Button
            size="sm"
            variant="outline"
            className={BTN}
            disabled={finLoading}
            onClick={() => finFileRef.current?.click()}
          >
            {finLoading ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            )}
            {finLoading ? 'Lendo documento…' : 'Preencher com documento (IA)'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="ml-auto bg-white border-slate-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => {
              onDelete(deal.id);
              onClose();
            }}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Excluir
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="rounded-2xl border border-slate-200 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400">Etapa</h4>
            <Select value={deal.stage} onValueChange={(v) => onMove(deal.id, deal.stage, v as CxDealStage)}>
              <SelectTrigger className={FIELD}><SelectValue /></SelectTrigger>
              <SelectContent className={POPOVER}>
                {stages.map((s) => (
                  <SelectItem key={s.key} value={s.key} className={ITEM}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isRejected && (
              <div className="space-y-2">
                <Label className="text-slate-600">Motivo da reprovação</Label>
                <Select
                  value={deal.rejection_reason || ''}
                  onValueChange={(v) => onUpdate(deal.id, { rejection_reason: v as CxRejectionReason })}
                >
                  <SelectTrigger className={FIELD}><SelectValue placeholder="Selecione o motivo" /></SelectTrigger>
                  <SelectContent className={POPOVER}>
                    {(Object.keys(CX_REJECTION_CONFIG) as CxRejectionReason[]).map((r) => (
                      <SelectItem key={r} value={r} className={ITEM}>{CX_REJECTION_CONFIG[r].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  defaultValue={deal.rejection_notes || ''}
                  onBlur={(e) => onUpdate(deal.id, { rejection_notes: e.target.value || null })}
                  rows={2}
                  placeholder="Detalhes da devolutiva do banco…"
                  className={FIELD}
                />
              </div>
            )}

            <div className="text-xs text-slate-500">Nesta etapa desde {fmtDate(deal.stage_entered_at)}</div>
          </section>

          <section className="rounded-2xl border border-slate-200 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400 flex items-center gap-1.5">
              <CalendarClock className="w-3.5 h-3.5" /> Monitoramento
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-slate-600 text-xs">Próxima reavaliação</Label>
                <Input
                  type="date"
                  value={review.next_review_at}
                  onChange={(e) => setReview((p) => ({ ...p, next_review_at: e.target.value }))}
                  className={FIELD}
                />
              </div>
              <div>
                <Label className="text-slate-600 text-xs">Intervalo (dias)</Label>
                <Input
                  type="number"
                  value={review.review_interval_days}
                  onChange={(e) => setReview((p) => ({ ...p, review_interval_days: e.target.value }))}
                  className={FIELD}
                />
              </div>
            </div>
            {days !== null && (
              <p className={`text-xs font-semibold ${days < 0 ? 'text-red-600' : days <= 3 ? 'text-amber-600' : 'text-slate-500'}`}>
                {days < 0 ? `Atrasado há ${Math.abs(days)} dia(s)` : days === 0 ? 'Reavaliar hoje' : `Faltam ${days} dia(s)`}
              </p>
            )}
            <Button size="sm" className="text-white" style={{ backgroundColor: BRAND }} onClick={saveReview}>
              Salvar monitoramento
            </Button>
          </section>
        </div>

        <section className="rounded-2xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400">Dados do financiamento</h4>
            {finDirty && <span className="text-[11px] font-semibold text-amber-600">Alterações não salvas</span>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Banco</Label>
              <Select value={fin.bank} onValueChange={(v) => setFinField('bank', v)}>
                <SelectTrigger className={FIELD}><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent className={POPOVER}>
                  {CX_BANKS.map((b) => (
                    <SelectItem key={b} value={b} className={ITEM}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <NumField label="Valor do imóvel" value={fin.property_value} onChange={(v) => setFinField('property_value', v)} />
            <NumField label="Financiado" value={fin.financing_value} onChange={(v) => setFinField('financing_value', v)} />
            <NumField label="Entrada" value={fin.down_payment} onChange={(v) => setFinField('down_payment', v)} />
            <NumField label="FGTS" value={fin.fgts_value} onChange={(v) => setFinField('fgts_value', v)} />
            <NumField label="Subsídio" value={fin.subsidy_value} onChange={(v) => setFinField('subsidy_value', v)} />
            <NumField label="Renda" value={fin.monthly_income} onChange={(v) => setFinField('monthly_income', v)} />
            <NumField label="Parcela" value={fin.installment_value} onChange={(v) => setFinField('installment_value', v)} />
            <TxtField label="Rating" value={fin.rating} onChange={(v) => setFinField('rating', v)} />
            <NumField label="Margem" value={fin.margin_value} onChange={(v) => setFinField('margin_value', v)} />
            <NumField label="Valor aprovado" value={fin.approved_value} onChange={(v) => setFinField('approved_value', v)} />
            <TxtField label="Responsável" value={fin.responsible_name} onChange={(v) => setFinField('responsible_name', v)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Pendências</Label>
              <Textarea rows={2} value={fin.pendencies} onChange={(e) => setFinField('pendencies', e.target.value)} className={FIELD} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Observações</Label>
              <Textarea rows={2} value={fin.notes} onChange={(e) => setFinField('notes', e.target.value)} className={FIELD} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="text-white" style={{ backgroundColor: BRAND }} onClick={saveFin} disabled={!finDirty}>
              Salvar dados do financiamento
            </Button>
            {finDirty && (
              <Button size="sm" variant="outline" className={BTN} onClick={() => resetFin(deal)}>
                Descartar
              </Button>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 p-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400">Nova consulta de rating / margem</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Input placeholder="Rating" value={check.rating} onChange={(e) => setCheck((p) => ({ ...p, rating: e.target.value }))} className={FIELD} />
            <Input type="number" placeholder="Margem (R$)" value={check.margin_value} onChange={(e) => setCheck((p) => ({ ...p, margin_value: e.target.value }))} className={FIELD} />
            <Input type="number" placeholder="Valor aprovado (R$)" value={check.approved_value} onChange={(e) => setCheck((p) => ({ ...p, approved_value: e.target.value }))} className={FIELD} />
            <Select value={check.result} onValueChange={(v) => setCheck((p) => ({ ...p, result: v }))}>
              <SelectTrigger className={FIELD}><SelectValue placeholder="Resultado" /></SelectTrigger>
              <SelectContent className={POPOVER}>
                <SelectItem value="liberado" className={ITEM}>Liberado</SelectItem>
                <SelectItem value="parcial" className={ITEM}>Parcialmente liberado</SelectItem>
                <SelectItem value="sem_margem" className={ITEM}>Sem margem</SelectItem>
                <SelectItem value="sem_rating" className={ITEM}>Sem rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea rows={2} placeholder="Observações da consulta…" value={check.notes} onChange={(e) => setCheck((p) => ({ ...p, notes: e.target.value }))} className={FIELD} />
          <Button size="sm" className="text-white" style={{ backgroundColor: BRAND }} onClick={submitCheck}>
            Registrar consulta e reagendar
          </Button>

          {checks.length > 0 && (
            <ul className="space-y-2 pt-2">
              {checks.map((c) => (
                <li key={c.id} className="text-xs bg-slate-50 rounded-xl p-2.5">
                  <div className="flex justify-between gap-2">
                    <span className="font-semibold text-slate-700">
                      {fmtDate(c.checked_at)} — {c.result || 'consulta'}
                    </span>
                    <span className="text-slate-500">{c.created_by_name || ''}</span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    Rating: {c.rating || '—'} · Margem: {money(c.margin_value)} · Aprovado: {money(c.approved_value)}
                  </p>
                  {c.notes && <p className="text-slate-500 mt-0.5">{c.notes}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" /> Histórico
          </h4>
          <ul className="space-y-1.5">
            {history.map((h) => (
              <li key={h.id} className="text-xs text-slate-600">
                <span className="text-slate-400">{fmtDate(h.created_at)}</span>{' '}
                {h.from_stage ? `${cxStageCfg(stages, h.from_stage).label} → ` : ''}
                <strong>{cxStageCfg(stages, h.to_stage).label}</strong>
                {h.moved_by_name ? ` · ${h.moved_by_name}` : ''}
              </li>
            ))}
            {history.length === 0 && <li className="text-xs text-slate-400">Sem movimentações registradas.</li>}
          </ul>
        </section>
      </DialogContent>
    </Dialog>
  );
}

interface FinForm {
  bank: string;
  property_value: string;
  financing_value: string;
  down_payment: string;
  fgts_value: string;
  subsidy_value: string;
  monthly_income: string;
  installment_value: string;
  rating: string;
  margin_value: string;
  approved_value: string;
  responsible_name: string;
  pendencies: string;
  notes: string;
}

const emptyFin: FinForm = {
  bank: '', property_value: '', financing_value: '', down_payment: '', fgts_value: '',
  subsidy_value: '', monthly_income: '', installment_value: '', rating: '',
  margin_value: '', approved_value: '', responsible_name: '', pendencies: '', notes: '',
};

const s = (v: unknown) => (v === null || v === undefined ? '' : String(v));

function finFromDeal(d: CxDeal): FinForm {
  return {
    bank: s(d.bank),
    property_value: s(d.property_value),
    financing_value: s(d.financing_value),
    down_payment: s(d.down_payment),
    fgts_value: s(d.fgts_value),
    subsidy_value: s(d.subsidy_value),
    monthly_income: s(d.monthly_income),
    installment_value: s(d.installment_value),
    rating: s(d.rating),
    margin_value: s(d.margin_value),
    approved_value: s(d.approved_value),
    responsible_name: s(d.responsible_name),
    pendencies: s(d.pendencies),
    notes: s(d.notes),
  };
}

function num(v: string): number | null {
  const t = v.replace(/\./g, '').replace(',', '.').trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isNaN(n) ? null : n;
}

function NumField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <Label className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</Label>
      <Input
        inputMode="decimal"
        placeholder="R$ 0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={FIELD}
      />
    </div>
  );
}

function TxtField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <Label className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className={FIELD} />
    </div>
  );
}
