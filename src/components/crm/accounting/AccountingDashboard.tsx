import { useState, useMemo } from 'react';
import { CrmProperty } from '@/types/crm';
import { formatCurrency } from '@/lib/formatCurrency';
import { AccountingFunnel } from './AccountingFunnel';
import { AccountingCharts } from './AccountingCharts';
import { AccountingBrokerRanking } from './AccountingBrokerRanking';
import { AccountingExport } from './AccountingExport';
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
import {
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  Calendar,
  Building2,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface AccountingDashboardProps {
  properties: CrmProperty[];
}

type PeriodFilter = 'all' | 'current_month' | 'last_month' | 'last_3_months' | 'last_6_months' | 'last_12_months';

const PERIOD_LABELS: Record<PeriodFilter, string> = {
  all: 'Todo período',
  current_month: 'Este mês',
  last_month: 'Mês passado',
  last_3_months: 'Últimos 3 meses',
  last_6_months: 'Últimos 6 meses',
  last_12_months: 'Últimos 12 meses',
};

interface CommissionRecord {
  id: string;
  property_id: string;
  user_name: string;
  user_id: string | null;
  percentage: number;
  value: number | null;
  is_paid: boolean;
}

export function AccountingDashboard({ properties }: AccountingDashboardProps) {
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');

  // Fetch all commissions
  const { data: commissions = [] } = useQuery({
    queryKey: ['crm-commissions-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_property_commissions')
        .select('*');
      if (error) throw error;
      return data as CommissionRecord[];
    },
  });

  // Fetch profiles
  const { data: profiles = [] } = useQuery({
    queryKey: ['profiles-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name');
      if (error) throw error;
      return data;
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
      case 'last_12_months':
        return { start: startOfMonth(subMonths(now, 11)), end: endOfMonth(now) };
      default:
        return null;
    }
  };

  const filteredProperties = useMemo(() => {
    const dateRange = getDateRange(periodFilter);
    if (!dateRange) return properties;

    return properties.filter(p => {
      const date = new Date(p.stage_entered_at);
      return date >= dateRange.start && date <= dateRange.end;
    });
  }, [properties, periodFilter]);

  const metrics = useMemo(() => {
    // Total sales value
    const totalSalesValue = filteredProperties.reduce(
      (sum, p) => sum + (p.sale_value || 0),
      0
    );

    // Completed properties (pago or comissao_liberada)
    const completedProperties = filteredProperties.filter(
      p => p.current_stage === 'pago' || p.current_stage === 'comissao_liberada'
    );
    const totalEarnings = completedProperties.reduce(
      (sum, p) => sum + (p.commission_value || 0),
      0
    );

    // Pending commissions
    const pendingProperties = filteredProperties.filter(
      p => ['aguardando_pagamento', 'registro_em_andamento', 'registro_concluido'].includes(p.current_stage)
    );
    const pendingCommissions = pendingProperties.reduce(
      (sum, p) => sum + (p.commission_value || 0),
      0
    );

    // Released vs awaiting
    const awaitingRelease = filteredProperties
      .filter(p => p.current_stage === 'pago')
      .reduce((sum, p) => sum + (p.commission_value || 0), 0);

    const releasedCommissions = filteredProperties
      .filter(p => p.current_stage === 'comissao_liberada')
      .reduce((sum, p) => sum + (p.commission_value || 0), 0);

    // Broker payments
    const paidToBrokers = commissions
      .filter(c => c.is_paid)
      .reduce((sum, c) => sum + (c.value || 0), 0);
    
    const unpaidToBrokers = commissions
      .filter(c => !c.is_paid)
      .reduce((sum, c) => sum + (c.value || 0), 0);

    // Average commission rate
    const avgCommissionRate = completedProperties.length > 0
      ? completedProperties.reduce((sum, p) => sum + (p.commission_percentage || 0), 0) / completedProperties.length
      : 0;

    // Net revenue (after broker payments)
    const netRevenue = totalEarnings - paidToBrokers;

    return {
      totalSalesValue,
      totalEarnings,
      pendingCommissions,
      awaitingRelease,
      releasedCommissions,
      paidToBrokers,
      unpaidToBrokers,
      avgCommissionRate,
      netRevenue,
      completedCount: completedProperties.length,
      pendingCount: pendingProperties.length,
      totalCount: filteredProperties.length,
    };
  }, [filteredProperties, commissions]);

  // Broker data for funnel
  const brokerData = useMemo(() => {
    const brokerMap: Record<string, {
      name: string;
      userId: string | null;
      totalSales: number;
      totalCommission: number;
      propertiesCount: number;
    }> = {};

    commissions.forEach(c => {
      const key = c.user_id || c.user_name;
      const profile = profiles.find(p => p.id === c.user_id);
      
      if (!brokerMap[key]) {
        brokerMap[key] = {
          name: profile?.full_name || c.user_name,
          userId: c.user_id,
          totalSales: 0,
          totalCommission: 0,
          propertiesCount: 0,
        };
      }
      brokerMap[key].totalCommission += c.value || 0;
    });

    filteredProperties.forEach(p => {
      if (p.responsible_user_id && (p.current_stage === 'pago' || p.current_stage === 'comissao_liberada')) {
        const profile = profiles.find(pr => pr.id === p.responsible_user_id);
        const key = p.responsible_user_id;
        
        if (!brokerMap[key]) {
          brokerMap[key] = {
            name: profile?.full_name || 'Desconhecido',
            userId: p.responsible_user_id,
            totalSales: 0,
            totalCommission: 0,
            propertiesCount: 0,
          };
        }
        brokerMap[key].totalSales += p.sale_value || 0;
        brokerMap[key].propertiesCount++;
      }
    });

    return Object.values(brokerMap);
  }, [commissions, filteredProperties, profiles]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Dashboard Contábil</h2>
            <p className="text-sm text-gray-500">Visão completa das finanças</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={periodFilter} onValueChange={(v) => setPeriodFilter(v as PeriodFilter)}>
            <SelectTrigger className="w-[180px] bg-white border-gray-200 text-gray-700">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              {Object.entries(PERIOD_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key} className="text-gray-700">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <AccountingExport 
            properties={filteredProperties} 
            periodLabel={PERIOD_LABELS[periodFilter]} 
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Total Sales */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 opacity-80" />
            <span className="text-[10px] uppercase tracking-wider opacity-80">
              Volume de Vendas
            </span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(metrics.totalSalesValue)}</p>
          <p className="text-[10px] opacity-70 mt-1">
            {metrics.totalCount} imóveis no período
          </p>
        </div>

        {/* Gross Revenue */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 opacity-80" />
            <span className="text-[10px] uppercase tracking-wider opacity-80">
              Receita Bruta
            </span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(metrics.totalEarnings)}</p>
          <p className="text-[10px] opacity-70 mt-1">
            {metrics.completedCount} vendas concluídas
          </p>
        </div>

        {/* Pending */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 opacity-80" />
            <span className="text-[10px] uppercase tracking-wider opacity-80">
              Em Processamento
            </span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(metrics.pendingCommissions)}</p>
          <p className="text-[10px] opacity-70 mt-1">
            {metrics.pendingCount} aguardando
          </p>
        </div>

        {/* Net Revenue */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 opacity-80" />
            <span className="text-[10px] uppercase tracking-wider opacity-80">
              Receita Líquida
            </span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(metrics.netRevenue)}</p>
          <p className="text-[10px] opacity-70 mt-1">
            Após pagamentos a corretores
          </p>
        </div>

        {/* Average Commission */}
        <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-4 h-4 opacity-80" />
            <span className="text-[10px] uppercase tracking-wider opacity-80">
              Taxa Média
            </span>
          </div>
          <p className="text-2xl font-bold">
            {(metrics.avgCommissionRate * 100).toFixed(2)}%
          </p>
          <p className="text-[10px] opacity-70 mt-1">
            Comissão sobre vendas
          </p>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Liberadas</p>
              <p className="text-lg font-bold text-emerald-600">{formatCurrency(metrics.releasedCommissions)}</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Aguard. Liberação</p>
              <p className="text-lg font-bold text-blue-600">{formatCurrency(metrics.awaitingRelease)}</p>
            </div>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Pago a Corretores</p>
              <p className="text-lg font-bold text-gray-700">{formatCurrency(metrics.paidToBrokers)}</p>
            </div>
            <ArrowDownRight className="w-5 h-5 text-gray-500" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">A Pagar Corretores</p>
              <p className="text-lg font-bold text-amber-600">{formatCurrency(metrics.unpaidToBrokers)}</p>
            </div>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel */}
        <div className="lg:col-span-1">
          <AccountingFunnel 
            agencyTotal={metrics.totalEarnings} 
            brokerData={brokerData} 
          />
        </div>

        {/* Charts */}
        <div className="lg:col-span-2">
          <AccountingCharts properties={filteredProperties} />
        </div>
      </div>

      {/* Broker Ranking */}
      <AccountingBrokerRanking properties={filteredProperties} />
    </div>
  );
}
