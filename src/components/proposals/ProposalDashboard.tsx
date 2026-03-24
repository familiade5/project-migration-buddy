import { useMemo } from 'react';
import { Proposal, STAGE_CONFIG, STAGE_ORDER } from '@/types/proposals';
import { differenceInDays } from 'date-fns';
import { CheckCircle2, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

interface ProposalDashboardProps {
  proposals: Proposal[];
  checklistSummaries: Record<string, { total: number; conforme: number; pendente: number }>;
}

export function ProposalDashboard({ proposals, checklistSummaries }: ProposalDashboardProps) {
  const metrics = useMemo(() => {
    const total = proposals.length;
    const concluidas = proposals.filter(p => p.stage === 'concluido').length;
    const pendentes = proposals.filter(p => {
      const s = checklistSummaries[p.id];
      return s && s.pendente > 0;
    }).length;
    const paradas = proposals.filter(p => differenceInDays(new Date(), new Date(p.stage_entered_at)) > 7).length;
    const byStage = STAGE_ORDER.map(stage => ({
      stage,
      label: STAGE_CONFIG[stage].label,
      count: proposals.filter(p => p.stage === stage).length,
      color: STAGE_CONFIG[stage].color,
      bgColor: STAGE_CONFIG[stage].bgColor,
      borderColor: STAGE_CONFIG[stage].borderColor,
    }));
    return { total, concluidas, pendentes, paradas, byStage };
  }, [proposals, checklistSummaries]);

  const cards = [
    {
      label: 'Total de Propostas',
      value: metrics.total,
      icon: <TrendingUp className="w-5 h-5" />,
      color: '#6366f1',
      bg: '#eef2ff',
    },
    {
      label: 'Pendências',
      value: metrics.pendentes,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: '#ef4444',
      bg: '#fef2f2',
    },
    {
      label: 'Paradas (+7 dias)',
      value: metrics.paradas,
      icon: <Clock className="w-5 h-5" />,
      color: '#f59e0b',
      bg: '#fffbeb',
    },
    {
      label: 'Concluídas',
      value: metrics.concluidas,
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: '#10b981',
      bg: '#ecfdf5',
    },
  ];

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(card => (
          <div
            key={card.label}
            className="rounded-xl p-4 border"
            style={{ backgroundColor: card.bg, borderColor: card.color + '33' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span style={{ color: card.color }}>{card.icon}</span>
              <span className="text-3xl font-bold" style={{ color: card.color }}>{card.value}</span>
            </div>
            <p className="text-xs text-gray-600 font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Stage distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Distribuição por Etapa</p>
        <div className="space-y-2">
          {metrics.byStage.map(({ stage, label, count, color, bgColor, borderColor }) => (
            <div key={stage} className="flex items-center gap-3">
              <div
                className="text-[11px] font-medium px-2 py-0.5 rounded-full w-32 text-center flex-shrink-0"
                style={{ color, backgroundColor: bgColor, border: `1px solid ${borderColor}` }}
              >
                {label}
              </div>
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: metrics.total > 0 ? `${(count / metrics.total) * 100}%` : '0%',
                    backgroundColor: color,
                  }}
                />
              </div>
              <span className="text-xs text-gray-500 w-6 text-right flex-shrink-0">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
