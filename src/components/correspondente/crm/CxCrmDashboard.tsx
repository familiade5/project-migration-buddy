import { useMemo } from 'react';
import { CxDeal, CxStage, cxCurrency, cxDaysUntil } from '@/types/cxCrm';
import { CxClient } from '@/types/correspondente';
import { AlertTriangle, CheckCircle2, Layers, TrendingUp, Users } from 'lucide-react';

const BRAND = '#1a3a6b';

interface Props {
  deals: CxDeal[];
  stages: CxStage[];
  clients: CxClient[];
  onOpenStage: () => void;
}

export function CxCrmDashboard({ deals, stages, clients, onOpenStage }: Props) {
  const stats = useMemo(() => {
    const approved = deals.filter((d) => d.stage === 'aprovado' || d.stage === 'contrato');
    const rejected = deals.filter((d) => d.stage === 'reprovado');
    const conditioned = deals.filter((d) => d.stage === 'condicionado');
    const pipeline = deals
      .filter((d) => d.stage !== 'reprovado')
      .reduce((s, d) => s + (d.financing_value || 0), 0);
    const dueReview = deals.filter((d) => {
      const days = cxDaysUntil(d.next_review_at);
      return days !== null && days <= 0;
    });
    const closedCount = approved.length + rejected.length;
    const rate = closedCount > 0 ? Math.round((approved.length / closedCount) * 100) : 0;
    return { approved, rejected, conditioned, pipeline, dueReview, rate };
  }, [deals]);

  const byStage = useMemo(() => {
    const max = Math.max(1, ...stages.map((s) => deals.filter((d) => d.stage === s.key).length));
    return stages.map((s) => ({
      stage: s,
      count: deals.filter((d) => d.stage === s.key).length,
      pct: (deals.filter((d) => d.stage === s.key).length / max) * 100,
    }));
  }, [deals, stages]);

  const cards = [
    { label: 'Casos ativos', value: deals.filter((d) => d.stage !== 'reprovado').length, icon: Layers, tone: 'text-[#1a3a6b] bg-blue-50' },
    { label: 'Clientes', value: clients.length, icon: Users, tone: 'text-slate-700 bg-slate-100' },
    { label: 'Aprovados', value: stats.approved.length, icon: CheckCircle2, tone: 'text-emerald-600 bg-emerald-50' },
    { label: 'Taxa de aprovação', value: `${stats.rate}%`, icon: TrendingUp, tone: 'text-indigo-600 bg-indigo-50' },
    { label: 'Reavaliações vencidas', value: stats.dueReview.length, icon: AlertTriangle, tone: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${c.tone}`}>
              <c.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{c.value}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold" style={{ color: BRAND }}>Funil de financiamentos</h3>
            <button onClick={onOpenStage} className="text-xs font-semibold text-[#1a3a6b] hover:underline">
              Ver quadro completo
            </button>
          </div>
          <div className="space-y-2.5">
            {byStage.map(({ stage, count, pct }) => {
              const cfg = stage;
              return (
                <div key={stage.key} className="flex items-center gap-3">
                  <span className="w-36 text-xs font-semibold text-slate-600 truncate">{cfg.label}</span>
                  <div className="flex-1 h-6 rounded-lg bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-lg transition-all"
                      style={{ width: `${Math.max(pct, count > 0 ? 8 : 0)}%`, backgroundColor: cfg.color }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs font-bold text-slate-700">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Volume em análise</p>
            <p className="text-2xl font-bold" style={{ color: BRAND }}>{cxCurrency(stats.pipeline)}</p>
          </div>
          <div className="h-px bg-slate-100" />
          <div className="space-y-2 text-sm">
            <Row label="Condicionados" value={stats.conditioned.length} tone="text-amber-600" />
            <Row label="Reprovados por rating" value={stats.rejected.filter((d) => d.rejection_reason === 'rating').length} tone="text-red-600" />
            <Row label="Reprovados por capacidade" value={stats.rejected.filter((d) => d.rejection_reason === 'capacidade').length} tone="text-red-600" />
            <Row label="Em contrato/assinatura" value={deals.filter((d) => d.stage === 'contrato').length} tone="text-[#1a3a6b]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>
      <span className={`font-bold ${tone}`}>{value}</span>
    </div>
  );
}
