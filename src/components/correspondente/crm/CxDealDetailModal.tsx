import { useEffect, useState } from 'react';
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
  cxDaysUntil,
  cxStageCfg,
} from '@/types/cxCrm';
import { useCxDealDetail } from '@/hooks/useCxDeals';
import { CalendarClock, FileText, History, Pencil, Trash2 } from 'lucide-react';

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

  useEffect(() => {
    if (!deal) return;
    setReview({
      next_review_at: deal.next_review_at || '',
      review_interval_days: String(deal.review_interval_days ?? 30),
    });
    setCheck({ rating: '', margin_value: '', approved_value: '', result: '', notes: '' });
  }, [deal?.id]);

  if (!deal) return null;

  const cfg = cxStageCfg(stages, deal.stage);
  const days = cxDaysUntil(deal.next_review_at);
  const isRejected = deal.stage === 'reprovado';

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

        <section className="rounded-2xl border border-slate-200 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Dados do financiamento</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <Info label="Banco" value={deal.bank || '—'} />
            <Info label="Valor do imóvel" value={money(deal.property_value)} />
            <Info label="Financiado" value={money(deal.financing_value)} />
            <Info label="Entrada" value={money(deal.down_payment)} />
            <Info label="FGTS" value={money(deal.fgts_value)} />
            <Info label="Subsídio" value={money(deal.subsidy_value)} />
            <Info label="Renda" value={money(deal.monthly_income)} />
            <Info label="Parcela" value={money(deal.installment_value)} />
            <Info label="Rating" value={deal.rating || '—'} />
            <Info label="Margem" value={money(deal.margin_value)} />
            <Info label="Valor aprovado" value={money(deal.approved_value)} />
            <Info label="Responsável" value={deal.responsible_name || '—'} />
          </div>
          {deal.pendencies && (
            <p className="mt-3 text-sm text-amber-700 bg-amber-50 rounded-xl p-3">
              <strong>Pendências:</strong> {deal.pendencies}
            </p>
          )}
          {deal.notes && <p className="mt-3 text-sm text-slate-600 whitespace-pre-wrap">{deal.notes}</p>}
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}
