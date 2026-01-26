import { RentalMetrics } from '@/hooks/useRentalMetrics';
import { formatCurrency } from '@/lib/formatCurrency';
import { User, AlertTriangle, DollarSign, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RentalManagerOverviewProps {
  metrics: RentalMetrics;
}

export function RentalManagerOverview({ metrics }: RentalManagerOverviewProps) {
  const responsibleList = Object.values(metrics.byResponsible).sort(
    (a, b) => b.overdueValue - a.overdueValue
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5" />
          Visão Gerencial por Responsável
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Controle de inadimplência e valores por membro da equipe
        </p>
      </div>

      {responsibleList.length === 0 ? (
        <div className="p-8 text-center">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum responsável atribuído</p>
          <p className="text-sm text-gray-400 mt-1">
            Atribua responsáveis aos contratos para ver métricas
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {responsibleList.map((item) => (
            <div key={item.userId} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    item.overdueCount > 0 ? "bg-red-100" : "bg-gray-100"
                  )}>
                    <User className={cn(
                      "w-5 h-5",
                      item.overdueCount > 0 ? "text-red-600" : "text-gray-500"
                    )} />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{item.userName}</p>
                    <p className="text-sm text-gray-500">
                      {item.contractCount} {item.contractCount === 1 ? 'contrato' : 'contratos'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500">Carteira</span>
                  </div>
                  <p className="text-gray-900 font-medium">{formatCurrency(item.totalValue)}</p>
                </div>
                
                <div className={cn(
                  "rounded-lg p-3 border",
                  item.overdueCount > 0 ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"
                )}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className={cn(
                      "w-3 h-3",
                      item.overdueCount > 0 ? "text-red-600" : "text-gray-500"
                    )} />
                    <span className={cn(
                      "text-xs",
                      item.overdueCount > 0 ? "text-red-700" : "text-gray-500"
                    )}>
                      Em Atraso
                    </span>
                  </div>
                  <p className={cn(
                    "font-medium",
                    item.overdueCount > 0 ? "text-red-600" : "text-gray-900"
                  )}>
                    {item.overdueCount} parcelas
                  </p>
                </div>

                <div className={cn(
                  "rounded-lg p-3 border",
                  item.overdueValue > 0 ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"
                )}>
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className={cn(
                      "w-3 h-3",
                      item.overdueValue > 0 ? "text-red-600" : "text-gray-500"
                    )} />
                    <span className={cn(
                      "text-xs",
                      item.overdueValue > 0 ? "text-red-700" : "text-gray-500"
                    )}>
                      Valor
                    </span>
                  </div>
                  <p className={cn(
                    "font-medium",
                    item.overdueValue > 0 ? "text-red-600" : "text-gray-900"
                  )}>
                    {formatCurrency(item.overdueValue)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
