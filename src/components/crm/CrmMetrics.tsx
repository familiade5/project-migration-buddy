import { CrmProperty, STAGE_ORDER, STAGE_CONFIG } from '@/types/crm';
import { formatCurrency } from '@/lib/formatCurrency';
import { TrendingUp, Clock, DollarSign, Home } from 'lucide-react';
import { useMemo } from 'react';
import { differenceInDays } from 'date-fns';

interface CrmMetricsProps {
  properties: CrmProperty[];
}

export function CrmMetrics({ properties }: CrmMetricsProps) {
  const metrics = useMemo(() => {
    const totalProperties = properties.length;
    const totalValue = properties.reduce((sum, p) => sum + (p.sale_value || 0), 0);
    
    // Comissões pendentes: apenas imóveis na etapa "pago" (venda concluída, comissão ainda não liberada)
    const pendingCommission = properties
      .filter((p) => p.current_stage === 'pago')
      .reduce((sum, p) => sum + (p.commission_value || 0), 0);

    // Comissões liberadas: imóveis na etapa final
    const releasedCommission = properties
      .filter((p) => p.current_stage === 'comissao_liberada')
      .reduce((sum, p) => sum + (p.commission_value || 0), 0);

    // Calculate average days per stage for completed properties
    const completedProperties = properties.filter(
      (p) => p.current_stage === 'pago' || p.current_stage === 'comissao_liberada'
    );
    const avgDaysTotal = completedProperties.length > 0
      ? Math.round(
          completedProperties.reduce(
            (sum, p) => sum + differenceInDays(new Date(), new Date(p.created_at)),
            0
          ) / completedProperties.length
        )
      : 0;

    // Count by stage
    const byStage: Record<string, number> = {};
    STAGE_ORDER.forEach((stage) => {
      byStage[stage] = properties.filter((p) => p.current_stage === stage).length;
    });

    return {
      totalProperties,
      totalValue,
      pendingCommission,
      avgDaysTotal,
      byStage,
    };
  }, [properties]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {/* Total Properties */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100">
            <Home className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-wider">Imóveis</p>
            <p className="text-xl font-semibold text-gray-900">{metrics.totalProperties}</p>
          </div>
        </div>
      </div>

      {/* Total Value */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100">
            <TrendingUp className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-wider">Valor Total</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(metrics.totalValue)}
            </p>
          </div>
        </div>
      </div>

      {/* Pending Commission */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100">
            <DollarSign className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-wider">Comissões Pendentes</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(metrics.pendingCommission)}
            </p>
          </div>
        </div>
      </div>

      {/* Average Days */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100">
            <Clock className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-wider">Tempo Médio</p>
            <p className="text-xl font-semibold text-gray-900">
              {metrics.avgDaysTotal > 0 ? `${metrics.avgDaysTotal}d` : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Stage breakdown - compact bar */}
      <div className="col-span-2 lg:col-span-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-3">
          Distribuição por Etapa
        </p>
        <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-gray-200">
          {STAGE_ORDER.map((stage) => {
            const count = metrics.byStage[stage] || 0;
            const percentage = metrics.totalProperties > 0 
              ? (count / metrics.totalProperties) * 100 
              : 0;
            
            if (percentage === 0) return null;

            return (
              <div
                key={stage}
                className="h-full transition-all duration-300"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: STAGE_CONFIG[stage].color,
                }}
                title={`${STAGE_CONFIG[stage].label}: ${count}`}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {STAGE_ORDER.map((stage) => {
            const count = metrics.byStage[stage] || 0;
            if (count === 0) return null;

            return (
              <div key={stage} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: STAGE_CONFIG[stage].color }}
                />
                <span className="text-[10px] text-gray-600">
                  {STAGE_CONFIG[stage].label}: {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
