import { useEffect, useMemo, useState } from 'react';
import { CxDeal, CxStage, CX_REJECTION_CONFIG, cxDaysIdle, cxDaysUntil, cxStageCfg } from '@/types/cxCrm';
import { AlertTriangle, CalendarClock, HardHat, Hourglass, ListChecks, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const BRAND = '#1a3a6b';
const IDLE_DAYS = 7;

type Filter = 'credito' | 'operacional' | 'vencidos' | 'proximos' | 'parados' | 'todos';

type OpenTask = { deal_id: string; title: string; due_at: string | null; priority: string };

interface Props {
  deals: CxDeal[];
  stages: CxStage[];
  clientName: (id: string) => string;
  onOpen: (deal: CxDeal) => void;
  onNewAnalysis?: (deal: CxDeal) => void;
}

export function CxMonitoringList({ deals, stages, clientName, onOpen, onNewAnalysis }: Props) {
  const [filter, setFilter] = useState<Filter>('credito');
  const [tasks, setTasks] = useState<OpenTask[]>([]);
  const active = useMemo(() => deals.filter((d) => d.stage !== 'concluido'), [deals]);

  useEffect(() => {
    supabase.from('cx_tasks').select('deal_id,title,due_at,priority').in('status', ['aberta','em_andamento']).then(({ data }) => setTasks((data || []) as OpenTask[]));
  }, [deals]);

  const groups = useMemo(() => {
    const credit = active.filter((d) => d.stage === 'pendencia');
    const operationalIds = new Set(tasks.map((t) => t.deal_id));
    const operational = active.filter((d) => d.stage === 'pendencia_engenharia' || operationalIds.has(d.id));
    const venc = active.filter((d) => (cxDaysUntil(d.next_review_at) ?? 99) <= 0);
    const prox = active.filter((d) => {
      const n = cxDaysUntil(d.next_review_at);
      return n !== null && n > 0 && n <= 7;
    });
    const par = active.filter((d) => cxDaysIdle(d) >= IDLE_DAYS);
    return { credito: credit, operacional: operational, vencidos: venc, proximos: prox, parados: par, todos: active };
  }, [active, tasks]);

  const list = [...groups[filter]].sort((a, b) =>
    (a.next_review_at || '9999').localeCompare(b.next_review_at || '9999'),
  );

  const tabs: { key: Filter; label: string; icon: any; tone: string }[] = [
    { key: 'credito', label: 'Acompanhamento de crédito', icon: ListChecks, tone: 'text-red-600 bg-red-50' },
    { key: 'operacional', label: 'Pendências operacionais', icon: HardHat, tone: 'text-orange-600 bg-orange-50' },
    { key: 'vencidos', label: 'Vencidos / hoje', icon: AlertTriangle, tone: 'text-amber-600 bg-amber-50' },
    { key: 'proximos', label: 'Próximos 7 dias', icon: CalendarClock, tone: 'text-sky-600 bg-sky-50' },
    { key: 'parados', label: `Parados ${IDLE_DAYS}+ dias`, icon: Hourglass, tone: 'text-slate-600 bg-slate-100' },
    { key: 'todos', label: 'Todos ativos', icon: ListChecks, tone: 'text-[#1a3a6b] bg-blue-50' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
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
                    {tasks.find((t) => t.deal_id === d.id)?.title || d.pendencies || d.rejection_notes || d.title || 'Sem descrição'}
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
