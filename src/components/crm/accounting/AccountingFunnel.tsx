import { useMemo } from 'react';
import { formatCurrency } from '@/lib/formatCurrency';
import { Building2, Users, TrendingDown } from 'lucide-react';

interface BrokerData {
  name: string;
  userId: string | null;
  totalSales: number;
  totalCommission: number;
  propertiesCount: number;
}

interface AccountingFunnelProps {
  agencyTotal: number;
  brokerData: BrokerData[];
}

export function AccountingFunnel({ agencyTotal, brokerData }: AccountingFunnelProps) {
  const sortedBrokers = useMemo(() => {
    return [...brokerData].sort((a, b) => b.totalCommission - a.totalCommission).slice(0, 5);
  }, [brokerData]);

  const maxCommission = sortedBrokers[0]?.totalCommission || 1;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <TrendingDown className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Funil de Receitas</h3>
          <p className="text-xs text-gray-400">Distribuição de comissões</p>
        </div>
      </div>

      {/* Agency Total - Top of Funnel */}
      <div className="relative mb-4">
        <div 
          className="relative mx-auto bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 rounded-t-xl py-6 px-8 text-center shadow-lg"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)',
            transform: 'perspective(500px) rotateX(5deg)',
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Building2 className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wider opacity-90">
              Receita Imobiliária
            </span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(agencyTotal)}</p>
        </div>
        <div 
          className="absolute inset-x-0 -bottom-2 h-4 mx-auto bg-emerald-600/50 rounded-b-lg blur-sm"
          style={{ width: '90%' }}
        />
      </div>

      {/* Broker Segments */}
      <div className="space-y-2 mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            Top Corretores por Comissão
          </span>
        </div>

        {sortedBrokers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Nenhuma comissão registrada no período</p>
          </div>
        ) : (
          sortedBrokers.map((broker, index) => {
            const widthPercentage = 95 - (index * 12);
            const opacity = 1 - (index * 0.15);
            const colors = [
              'from-blue-500 via-blue-400 to-blue-500',
              'from-indigo-500 via-indigo-400 to-indigo-500',
              'from-purple-500 via-purple-400 to-purple-500',
              'from-pink-500 via-pink-400 to-pink-500',
              'from-rose-500 via-rose-400 to-rose-500',
            ];

            return (
              <div key={broker.userId || broker.name} className="relative">
                <div 
                  className={`relative mx-auto bg-gradient-to-r ${colors[index]} py-3 px-6 text-center transition-all duration-300 hover:scale-[1.02] cursor-default`}
                  style={{
                    width: `${widthPercentage}%`,
                    clipPath: 'polygon(2% 0, 98% 0, 100% 100%, 0% 100%)',
                    opacity,
                    transform: `perspective(500px) rotateX(${3 - index}deg)`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                        {index + 1}º
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-sm truncate max-w-[120px]">
                          {broker.name}
                        </p>
                        <p className="text-[10px] opacity-75">
                          {broker.propertiesCount} {broker.propertiesCount === 1 ? 'imóvel' : 'imóveis'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(broker.totalCommission)}</p>
                      <p className="text-[10px] opacity-75">
                        {((broker.totalCommission / agencyTotal) * 100).toFixed(1)}% do total
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom indicator */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Total distribuído a corretores:</span>
          <span className="font-semibold text-white">
            {formatCurrency(sortedBrokers.reduce((sum, b) => sum + b.totalCommission, 0))}
          </span>
        </div>
      </div>
    </div>
  );
}
