import { useMemo } from 'react';
import { CrmProperty } from '@/types/crm';
import { formatCurrency } from '@/lib/formatCurrency';
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface AccountingBrokerRankingProps {
  properties: CrmProperty[];
}

interface CommissionRecord {
  id: string;
  property_id: string;
  user_name: string;
  user_id: string | null;
  percentage: number;
  value: number | null;
  is_paid: boolean;
}

export function AccountingBrokerRanking({ properties }: AccountingBrokerRankingProps) {
  // Fetch all commissions
  const { data: commissions = [] } = useQuery({
    queryKey: ['crm-commissions-ranking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_property_commissions')
        .select('*');
      if (error) throw error;
      return data as CommissionRecord[];
    },
  });

  // Fetch profiles for broker names
  const { data: profiles = [] } = useQuery({
    queryKey: ['profiles-for-ranking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name');
      if (error) throw error;
      return data;
    },
  });

  const brokerStats = useMemo(() => {
    const stats: Record<string, {
      name: string;
      userId: string | null;
      totalSales: number;
      totalCommission: number;
      paidCommission: number;
      pendingCommission: number;
      propertiesCount: number;
      avgCommission: number;
    }> = {};

    // Calculate from commissions
    commissions.forEach(c => {
      const key = c.user_id || c.user_name;
      if (!stats[key]) {
        const profile = profiles.find(p => p.id === c.user_id);
        stats[key] = {
          name: profile?.full_name || c.user_name,
          userId: c.user_id,
          totalSales: 0,
          totalCommission: 0,
          paidCommission: 0,
          pendingCommission: 0,
          propertiesCount: 0,
          avgCommission: 0,
        };
      }
      stats[key].totalCommission += c.value || 0;
      if (c.is_paid) {
        stats[key].paidCommission += c.value || 0;
      } else {
        stats[key].pendingCommission += c.value || 0;
      }
    });

    // Calculate properties and sales from responsible user
    properties.forEach(p => {
      if (p.responsible_user_id) {
        const profile = profiles.find(pr => pr.id === p.responsible_user_id);
        const key = p.responsible_user_id;
        
        if (!stats[key]) {
          stats[key] = {
            name: profile?.full_name || 'Desconhecido',
            userId: p.responsible_user_id,
            totalSales: 0,
            totalCommission: 0,
            paidCommission: 0,
            pendingCommission: 0,
            propertiesCount: 0,
            avgCommission: 0,
          };
        }
        
        if (p.current_stage === 'pago' || p.current_stage === 'comissao_liberada') {
          stats[key].totalSales += p.sale_value || 0;
          stats[key].propertiesCount++;
        }
      }
    });

    // Calculate averages
    Object.values(stats).forEach(s => {
      if (s.propertiesCount > 0) {
        s.avgCommission = s.totalCommission / s.propertiesCount;
      }
    });

    return Object.values(stats)
      .filter(s => s.totalCommission > 0 || s.propertiesCount > 0)
      .sort((a, b) => b.totalCommission - a.totalCommission);
  }, [commissions, properties, profiles]);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-700" />;
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-500">
            {index + 1}º
          </span>
        );
    }
  };

  const getPerformanceIndicator = (avgCommission: number, overallAvg: number) => {
    if (avgCommission > overallAvg * 1.2) {
      return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    } else if (avgCommission < overallAvg * 0.8) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const overallAvg = brokerStats.length > 0
    ? brokerStats.reduce((sum, b) => sum + b.avgCommission, 0) / brokerStats.length
    : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Ranking de Corretores</h3>
            <p className="text-xs text-gray-500">Performance por comissões geradas</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                Posição
              </th>
              <th className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                Corretor
              </th>
              <th className="text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                Vendas
              </th>
              <th className="text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                Imóveis
              </th>
              <th className="text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                Comissão Total
              </th>
              <th className="text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                Pago
              </th>
              <th className="text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                Pendente
              </th>
              <th className="text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                Performance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {brokerStats.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-500 text-sm">
                  Nenhum corretor com comissões registradas
                </td>
              </tr>
            ) : (
              brokerStats.map((broker, index) => (
                <tr 
                  key={broker.userId || broker.name} 
                  className={`hover:bg-gray-50 transition-colors ${index < 3 ? 'bg-gradient-to-r from-amber-50/50 to-transparent' : ''}`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(index)}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-sm font-medium text-gray-600">
                        {broker.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{broker.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(broker.totalSales)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm text-gray-600">{broker.propertiesCount}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-bold text-emerald-600">
                      {formatCurrency(broker.totalCommission)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm text-emerald-600">
                      {formatCurrency(broker.paidCommission)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm text-amber-600">
                      {formatCurrency(broker.pendingCommission)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center">
                      {getPerformanceIndicator(broker.avgCommission, overallAvg)}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {brokerStats.length > 0 && (
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              {brokerStats.length} {brokerStats.length === 1 ? 'corretor' : 'corretores'} no ranking
            </span>
            <span className="text-gray-500">
              Média por imóvel: <strong className="text-gray-900">{formatCurrency(overallAvg)}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
