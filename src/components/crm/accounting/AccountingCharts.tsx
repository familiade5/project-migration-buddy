import { useMemo } from 'react';
import { CrmProperty } from '@/types/crm';
import { formatCurrency } from '@/lib/formatCurrency';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

interface AccountingChartsProps {
  properties: CrmProperty[];
}

const STAGE_COLORS: Record<string, string> = {
  novo_imovel: '#94a3b8',
  em_anuncio: '#60a5fa',
  proposta_recebida: '#a78bfa',
  proposta_aceita: '#f472b6',
  documentacao_enviada: '#fb923c',
  registro_em_andamento: '#facc15',
  registro_concluido: '#4ade80',
  aguardando_pagamento: '#2dd4bf',
  pago: '#22c55e',
  comissao_liberada: '#10b981',
};

const STAGE_LABELS: Record<string, string> = {
  novo_imovel: 'Novo',
  em_anuncio: 'Anúncio',
  proposta_recebida: 'Proposta',
  proposta_aceita: 'Aceita',
  documentacao_enviada: 'Docs',
  registro_em_andamento: 'Registro',
  registro_concluido: 'Concluído',
  aguardando_pagamento: 'Aguardando',
  pago: 'Pago',
  comissao_liberada: 'Liberada',
};

export function AccountingCharts({ properties }: AccountingChartsProps) {
  // Monthly revenue data (last 6 months)
  const monthlyData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      
      const monthProperties = properties.filter(p => {
        const date = new Date(p.stage_entered_at);
        return isWithinInterval(date, { start, end }) && 
               (p.current_stage === 'pago' || p.current_stage === 'comissao_liberada');
      });

      const revenue = monthProperties.reduce((sum, p) => sum + (p.commission_value || 0), 0);
      const sales = monthProperties.reduce((sum, p) => sum + (p.sale_value || 0), 0);
      
      months.push({
        month: format(monthDate, 'MMM', { locale: ptBR }),
        fullMonth: format(monthDate, 'MMMM yyyy', { locale: ptBR }),
        receita: revenue,
        vendas: sales,
        count: monthProperties.length,
      });
    }
    return months;
  }, [properties]);

  // Stage distribution
  const stageDistribution = useMemo(() => {
    const distribution: Record<string, { count: number; value: number }> = {};
    
    properties.forEach(p => {
      if (!distribution[p.current_stage]) {
        distribution[p.current_stage] = { count: 0, value: 0 };
      }
      distribution[p.current_stage].count++;
      distribution[p.current_stage].value += p.commission_value || 0;
    });

    return Object.entries(distribution).map(([stage, data]) => ({
      name: STAGE_LABELS[stage] || stage,
      value: data.count,
      revenue: data.value,
      color: STAGE_COLORS[stage] || '#94a3b8',
    }));
  }, [properties]);

  // Property type distribution
  const typeDistribution = useMemo(() => {
    const types: Record<string, number> = {};
    properties.forEach(p => {
      const type = p.property_type || 'outro';
      types[type] = (types[type] || 0) + 1;
    });

    const typeLabels: Record<string, string> = {
      casa: 'Casas',
      apartamento: 'Apartamentos',
      terreno: 'Terrenos',
      comercial: 'Comercial',
      rural: 'Rural',
      outro: 'Outros',
    };

    const typeColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#22c55e', '#64748b'];

    return Object.entries(types).map(([type, count], index) => ({
      name: typeLabels[type] || type,
      value: count,
      color: typeColors[index % typeColors.length],
    }));
  }, [properties]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900 capitalize">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs text-gray-600">
              {entry.name}: {entry.name.includes('vendas') || entry.name.includes('receita') 
                ? formatCurrency(entry.value) 
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Revenue Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Receita Mensal</h4>
            <p className="text-[10px] text-gray-500">Últimos 6 meses</p>
          </div>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="receita" 
                name="Receita"
                stroke="#22c55e" 
                strokeWidth={2}
                fill="url(#colorReceita)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales vs Commission Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Vendas vs Comissões</h4>
            <p className="text-[10px] text-gray-500">Comparativo mensal</p>
          </div>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '11px' }}
                iconType="circle"
              />
              <Bar dataKey="vendas" name="Vendas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="receita" name="Comissões" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stage Distribution Pie */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <PieChartIcon className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Distribuição por Etapa</h4>
            <p className="text-[10px] text-gray-500">Imóveis por fase do funil</p>
          </div>
        </div>
        <div className="h-[200px] flex items-center">
          <ResponsiveContainer width="50%" height="100%">
            <PieChart>
              <Pie
                data={stageDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {stageDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-1">
            {stageDistribution.slice(0, 6).map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: item.color }} 
                />
                <span className="text-gray-600 truncate">{item.name}</span>
                <span className="text-gray-900 font-medium ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Property Type Distribution */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
            <PieChartIcon className="w-4 h-4 text-pink-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Tipos de Imóveis</h4>
            <p className="text-[10px] text-gray-500">Distribuição por categoria</p>
          </div>
        </div>
        <div className="h-[200px] flex items-center">
          <ResponsiveContainer width="50%" height="100%">
            <PieChart>
              <Pie
                data={typeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {typeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-1">
            {typeDistribution.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: item.color }} 
                />
                <span className="text-gray-600 truncate">{item.name}</span>
                <span className="text-gray-900 font-medium ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
