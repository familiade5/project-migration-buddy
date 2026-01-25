import { useState, useMemo } from 'react';
import { CrmProperty } from '@/types/crm';
import { formatCurrency } from '@/lib/formatCurrency';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle2,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AccountingSectionProps {
  properties: CrmProperty[];
  isEmbedded?: boolean;
}

interface CommissionRecord {
  id: string;
  property_id: string;
  user_name: string;
  percentage: number;
  value: number | null;
  is_paid: boolean;
  paid_at: string | null;
  created_at: string;
}

type PeriodFilter = 'all' | 'current_month' | 'last_month' | 'last_3_months' | 'last_6_months';

const PERIOD_LABELS: Record<PeriodFilter, string> = {
  all: 'Todo período',
  current_month: 'Este mês',
  last_month: 'Mês passado',
  last_3_months: 'Últimos 3 meses',
  last_6_months: 'Últimos 6 meses',
};

export function AccountingSection({ properties, isEmbedded = false }: AccountingSectionProps) {
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');

  // Fetch all commissions
  const { data: commissions = [] } = useQuery({
    queryKey: ['crm-commissions-accounting'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_property_commissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CommissionRecord[];
    },
  });

  const getDateRange = (period: PeriodFilter) => {
    const now = new Date();
    switch (period) {
      case 'current_month':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'last_month':
        const lastMonth = subMonths(now, 1);
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
      case 'last_3_months':
        return { start: startOfMonth(subMonths(now, 2)), end: endOfMonth(now) };
      case 'last_6_months':
        return { start: startOfMonth(subMonths(now, 5)), end: endOfMonth(now) };
      default:
        return null;
    }
  };

  const metrics = useMemo(() => {
    const dateRange = getDateRange(periodFilter);

    // Filter commissions by period
    const filteredCommissions = dateRange
      ? commissions.filter((c) => {
          const date = new Date(c.paid_at || c.created_at);
          return date >= dateRange.start && date <= dateRange.end;
        })
      : commissions;

    // Calculate from properties (based on stage)
    const filterByPeriod = (prop: CrmProperty) => {
      if (!dateRange) return true;
      const date = new Date(prop.stage_entered_at);
      return date >= dateRange.start && date <= dateRange.end;
    };

    // Total earnings (properties that reached "pago" or "comissao_liberada")
    const completedProperties = properties.filter(
      (p) => (p.current_stage === 'pago' || p.current_stage === 'comissao_liberada') && filterByPeriod(p)
    );
    const totalEarnings = completedProperties.reduce(
      (sum, p) => sum + (p.commission_value || 0), 
      0
    );

    // Pending commissions (properties in "aguardando_pagamento" or "registro_em_andamento" or "registro_concluido")
    const pendingProperties = properties.filter(
      (p) => ['aguardando_pagamento', 'registro_em_andamento', 'registro_concluido'].includes(p.current_stage) && filterByPeriod(p)
    );
    const pendingCommissions = pendingProperties.reduce(
      (sum, p) => sum + (p.commission_value || 0), 
      0
    );

    // Paid commissions (from commissions table)
    const paidCommissions = filteredCommissions
      .filter((c) => c.is_paid)
      .reduce((sum, c) => sum + (c.value || 0), 0);

    // Unpaid commissions (from commissions table)
    const unpaidCommissions = filteredCommissions
      .filter((c) => !c.is_paid)
      .reduce((sum, c) => sum + (c.value || 0), 0);

    // Properties in "pago" stage - commission earned but waiting to be released
    const awaitingRelease = properties
      .filter((p) => p.current_stage === 'pago' && filterByPeriod(p))
      .reduce((sum, p) => sum + (p.commission_value || 0), 0);

    // Released commissions
    const releasedCommissions = properties
      .filter((p) => p.current_stage === 'comissao_liberada' && filterByPeriod(p))
      .reduce((sum, p) => sum + (p.commission_value || 0), 0);

    return {
      totalEarnings,
      pendingCommissions,
      paidCommissions,
      unpaidCommissions,
      awaitingRelease,
      releasedCommissions,
      completedCount: completedProperties.length,
      pendingCount: pendingProperties.length,
    };
  }, [properties, commissions, periodFilter]);

  return (
    <div className={isEmbedded ? '' : 'bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6'}>
      <div className="flex items-center justify-between mb-4">
        {!isEmbedded && (
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-700" />
            <h3 className="text-sm font-semibold text-gray-900">Contabilidade</h3>
          </div>
        )}
        
        <Select value={periodFilter} onValueChange={(v) => setPeriodFilter(v as PeriodFilter)}>
          <SelectTrigger className="w-[160px] h-8 text-xs bg-white border-gray-200">
            <Calendar className="w-3 h-3 mr-1.5 text-gray-400" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            {Object.entries(PERIOD_LABELS).map(([key, label]) => (
              <SelectItem 
                key={key} 
                value={key}
                className="text-gray-700 text-xs focus:bg-gray-100"
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isEmbedded && <div className="h-px bg-gray-200 mb-4" />}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Earnings */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
              Ganhos Totais
            </span>
          </div>
          <p className="text-lg font-bold text-emerald-700">
            {formatCurrency(metrics.totalEarnings)}
          </p>
          <p className="text-[10px] text-gray-500">
            {metrics.completedCount} {metrics.completedCount === 1 ? 'imóvel' : 'imóveis'}
          </p>
        </div>

        {/* Pending Commissions (awaiting registration) */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
              Aguardando Registro
            </span>
          </div>
          <p className="text-lg font-bold text-amber-700">
            {formatCurrency(metrics.pendingCommissions)}
          </p>
          <p className="text-[10px] text-gray-500">
            {metrics.pendingCount} {metrics.pendingCount === 1 ? 'imóvel' : 'imóveis'}
          </p>
        </div>

        {/* Awaiting Release */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
              Aguard. Liberação
            </span>
          </div>
          <p className="text-lg font-bold text-blue-700">
            {formatCurrency(metrics.awaitingRelease)}
          </p>
          <p className="text-[10px] text-gray-500">
            Pago, não liberado
          </p>
        </div>

        {/* Released/Paid Commissions */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
              Comissões Liberadas
            </span>
          </div>
          <p className="text-lg font-bold text-emerald-700">
            {formatCurrency(metrics.releasedCommissions)}
          </p>
          <p className="text-[10px] text-gray-500">
            Totalmente liberado
          </p>
        </div>
      </div>

      {/* Broker payments summary */}
      {(metrics.paidCommissions > 0 || metrics.unpaidCommissions > 0) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
            Pagamentos a Corretores
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-gray-700">
                Pago: <strong>{formatCurrency(metrics.paidCommissions)}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs text-gray-700">
                A pagar: <strong>{formatCurrency(metrics.unpaidCommissions)}</strong>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
