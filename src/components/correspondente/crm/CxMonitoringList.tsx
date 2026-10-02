import { useMemo, useState } from 'react';
import { CxDeal, CxStage, CX_REJECTION_CONFIG, cxDaysIdle, cxDaysUntil, cxStageCfg } from '@/types/cxCrm';
import { AlertTriangle, CalendarClock, Hourglass, ListChecks, RotateCcw } from 'lucide-react';

const BRAND = '#1a3a6b';
const IDLE_DAYS = 7;

type Filter = 'pendencias' | 'vencidos' | 'proximos' | 'parados' | 'todos';

interface Props {
  deals: CxDeal[];
  stages: CxStage[];
  clientName: (id: string) => string;
  onOpen: (deal: CxDeal) => void;
  onNewAnalysis?: (deal: CxDeal) => void;
}

export function CxMonitoringList({ deals, stages, clientName, onOpen, onNewAnalysis }: Props) {
  const [filter, setFilter] = useState<Filter>('pendencias');
  const active = useMemo(() => deals.filter((d) => d.stage !== 'concluido'), [deals]);

  const groups = useMemo(() => {
    const pend = active.filter((d) => d.stage === 'pendencia');
    const venc = active.filter((d) => (cxDaysUntil(d.next_review_at) ?? 99) <= 0);
    const prox = active.filter((d) => {
      const n = cxDaysUntil(d.next_review_at);
      return n !== null && n > 0 && n <= 7;
    });
    const par = active.filter((d) => cxDaysIdle(d) >= IDLE_DAYS);
    return { pendencias: pend, vencidos: venc, proximos: prox, parados: par, todos: active };
  }, [active]);

  const list = [...groups[filter]].sort((a, b) =>
    (a.next_review_at || '9999').localeCompare(b.next_review_at || '9999'),
  );

  const tabs: { key: Filter; label: string; icon: any; tone: string }[] = [
    { key: 'pendencias', label: 'Em pendência', icon: ListChecks, tone: 'text-red-600 bg-red-50' },
    { key: 'vencidos', label: 'Vencidos / hoje', icon: AlertTriangle, tone: 'text-amber-600 bg-amber-50' },
    { key: 'proximos', label: 'Próximos 7 dias', icon: CalendarClock, tone: 'text-sky-600 bg-sky-50' },
    { key: 'parados', label: `Parados ${IDLE_DAYS}+ dias`, icon: Hourglass, tone: 'text-slate-600 bg-slate-100' },
    { key: 'todos', label: 'Todos ativos', icon: ListChecks, tone: 'text-[#1a3a6b] bg-blue-50' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`text-left bg-white rounded-2xl border p-4 shadow-sm transition-all ${
              filter === t.key ? 'border-[#1a3a6b] ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${t.tone}`}>
              <t.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{groups[t.key].length}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{t.label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <h3 className="text-sm font-bold" style={{ color: BRAND }}>{tabs.find((t) => t.key === filter)!.label}</h3>
          <p className="text-xs text-slate-500">Clique em "Abrir caso" para resolver. Pendências resolvidas voltam para nova análise.</p>
        </div>
        <div className="divide-y divide-slate-100">
          {list.map((d) => {
            const days = cxDaysUntil(d.next_review_at);
            const idle = cxDaysIdle(d);
            const cfg = cxStageCfg(stages, d.stage);
            return (
              <div key={d.id} className="px-5 py-3 flex flex-wrap items-center gap-3 hover:bg-slate-50">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 truncate">{clientName(d.client_id)}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {d.pendencies || d.rejection_notes || d.title || 'Sem descrição'}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                  {cfg.short}
                </span>
                {d.rejection_reason && d.stage === 'pendencia' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                    {CX_REJECTION_CONFIG[d.rejection_reason].short}
                  </span>
                )}
                <span className="text-xs text-slate-400 w-24 text-right">{idle}d na etapa</span>
                <span
                  className={`text-xs font-semibold w-28 text-right ${
                    days === null ? 'text-slate-400' : days < 0 ? 'text-red-600' : days <= 3 ? 'text-amber-600' : 'text-slate-500'
                  }`}
                >
                  {days === null ? 'Sem prazo' : days < 0 ? `Vencido ${Math.abs(days)}d` : days === 0 ? 'Vence hoje' : `Em ${days} dia(s)`}
                </span>
                {d.stage === 'pendencia' && onNewAnalysis && (
                  <button
                    onClick={() => onNewAnalysis(d)}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Nova análise
                  </button>
                )}
                <button
                  onClick={() => onOpen(d)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white hover:opacity-90"
                  style={{ backgroundColor: BRAND }}
                >
                  Abrir caso
                </button>
              </div>
            );
          })}
          {list.length === 0 && <p className="px-5 py-10 text-center text-sm text-slate-400">Nada por aqui.</p>}
        </div>
      </div>
    </div>
  );
}
