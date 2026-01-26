import { formatCurrency } from '@/lib/formatCurrency';
import { RentalMetrics } from '@/hooks/useRentalMetrics';
import { 
  Building2, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Users,
  Percent
} from 'lucide-react';

interface RentalDashboardMetricsProps {
  metrics: RentalMetrics;
}

export function RentalDashboardMetrics({ metrics }: RentalDashboardMetricsProps) {
  const cards = [
    {
      label: 'Contratos Ativos',
      value: metrics.activeContracts.toString(),
      subtitle: `${metrics.endingSoonContracts} vencendo`,
      icon: Building2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Receita Mensal Esperada',
      value: formatCurrency(metrics.expectedMonthlyRevenue),
      subtitle: `Taxa: ${formatCurrency(metrics.expectedManagementFees)}`,
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Recebido Este Mês',
      value: formatCurrency(metrics.totalReceivedThisMonth),
      subtitle: `Pendente: ${formatCurrency(metrics.totalPendingThisMonth)}`,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Inadimplência',
      value: formatCurrency(metrics.totalOverdue),
      subtitle: `${metrics.overdueCount} parcelas em atraso`,
      icon: AlertTriangle,
      color: metrics.overdueCount > 0 ? 'text-red-400' : 'text-gray-400',
      bgColor: metrics.overdueCount > 0 ? 'bg-red-500/10' : 'bg-gray-500/10',
    },
    {
      label: 'Taxa de Inadimplência',
      value: `${metrics.delinquencyRate.toFixed(1)}%`,
      subtitle: 'Do total de parcelas',
      icon: Percent,
      color: metrics.delinquencyRate > 10 ? 'text-orange-400' : 'text-gray-400',
      bgColor: 'bg-gray-500/10',
    },
    {
      label: 'Recebido no Ano',
      value: formatCurrency(metrics.totalReceivedThisYear),
      subtitle: new Date().getFullYear().toString(),
      icon: Calendar,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              {card.label}
            </span>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </div>
          <div className="space-y-1">
            <p className={`text-xl font-bold ${card.color}`}>
              {card.value}
            </p>
            <p className="text-xs text-gray-500">{card.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
