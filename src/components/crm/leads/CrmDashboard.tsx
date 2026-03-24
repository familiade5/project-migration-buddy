import { useMemo } from 'react';
import { CrmLead } from '@/types/leads';
import { useProposals } from '@/hooks/useProposals';
import { Users, TrendingUp, CheckCircle, Clock, Target, AlertTriangle, Award, BarChart3 } from 'lucide-react';

interface CrmDashboardProps {
  leads: CrmLead[];
}

const MetricCard = ({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: string | number; sub?: string; color: string;
}) => (
  <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3 shadow-sm">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}20` }}>
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

export function CrmDashboard({ leads }: CrmDashboardProps) {
  const { proposals } = useProposals();

  const stats = useMemo(() => {
    const total = leads.length;
    const qualificados = leads.filter(l => l.sdr_stage === 'qualificado').length;
    const naoQualificados = leads.filter(l => l.sdr_stage === 'nao_qualificado').length;
    const emVendas = leads.filter(l => l.sales_stage && l.sales_stage !== 'perdido').length;
    const fechados = leads.filter(l => l.sales_stage === 'fechado').length;
    const perdidos = leads.filter(l => l.sales_stage === 'perdido').length;
    const atencao = leads.filter(l => {
      const days = Math.floor((Date.now() - new Date(l.ultima_interacao_at || l.data_entrada).getTime()) / (1000 * 60 * 60 * 24));
      return days >= 3 && l.sdr_stage !== 'nao_qualificado' && l.sales_stage !== 'perdido' && l.sales_stage !== 'fechado';
    }).length;

    const taxaConversao = total > 0 ? Math.round((qualificados / total) * 100) : 0;
    const taxaFechamento = emVendas + fechados > 0 ? Math.round((fechados / (emVendas + fechados)) * 100) : 0;

    // By SDR
    const bySdr: Record<string, number> = {};
    leads.forEach(l => {
      const name = l.sdr_responsavel_nome || 'Sem SDR';
      bySdr[name] = (bySdr[name] || 0) + 1;
    });

    // By origem
    const byOrigem: Record<string, number> = {};
    leads.forEach(l => {
      const o = l.origem_lead || 'Desconhecida';
      byOrigem[o] = (byOrigem[o] || 0) + 1;
    });

    // By corretor (sales)
    const byCorretor: Record<string, { total: number; fechados: number }> = {};
    leads.filter(l => l.sales_responsavel_nome).forEach(l => {
      const name = l.sales_responsavel_nome!;
      if (!byCorretor[name]) byCorretor[name] = { total: 0, fechados: 0 };
      byCorretor[name].total++;
      if (l.sales_stage === 'fechado') byCorretor[name].fechados++;
    });

    return { total, qualificados, naoQualificados, emVendas, fechados, perdidos, atencao, taxaConversao, taxaFechamento, bySdr, byOrigem, byCorretor };
  }, [leads]);

  const topSdr = Object.entries(stats.bySdr).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topOrigem = Object.entries(stats.byOrigem).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topCorretor = Object.entries(stats.byCorretor).sort((a, b) => b[1].fechados - a[1].fechados).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard icon={Users} label="Total de Leads" value={stats.total} color="#6366f1" />
        <MetricCard icon={Target} label="Qualificados" value={stats.qualificados} sub={`${stats.taxaConversao}% de conversão`} color="#10b981" />
        <MetricCard icon={TrendingUp} label="Em Vendas" value={stats.emVendas} color="#3b82f6" />
        <MetricCard icon={CheckCircle} label="Vendas Fechadas" value={stats.fechados} sub={`${stats.taxaFechamento}% fechamento`} color="#059669" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard icon={AlertTriangle} label="Precisam Atenção" value={stats.atencao} sub="Sem atualização +3d" color="#f59e0b" />
        <MetricCard icon={Clock} label="Não Qualificados" value={stats.naoQualificados} color="#ef4444" />
        <MetricCard icon={BarChart3} label="Propostas Pós-Venda" value={proposals.length} color="#8b5cf6" />
        <MetricCard icon={Award} label="Taxa de Fechamento" value={`${stats.taxaFechamento}%`} color="#ec4899" />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* By SDR */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" /> Leads por SDR
          </h3>
          <div className="space-y-2">
            {topSdr.map(([name, count]) => (
              <div key={name} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 truncate">{name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
            {topSdr.length === 0 && <p className="text-xs text-gray-400">Sem dados</p>}
          </div>
        </div>

        {/* By origem */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" /> Origem dos Leads
          </h3>
          <div className="space-y-2">
            {topOrigem.map(([name, count]) => (
              <div key={name} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 truncate">{name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
            {topOrigem.length === 0 && <p className="text-xs text-gray-400">Sem dados</p>}
          </div>
        </div>

        {/* By corretor */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" /> Performance Corretores
          </h3>
          <div className="space-y-2">
            {topCorretor.map(([name, data]) => (
              <div key={name} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 truncate">{name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400">{data.fechados}/{data.total}</span>
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${data.total > 0 ? (data.fechados / data.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {topCorretor.length === 0 && <p className="text-xs text-gray-400">Sem dados ainda</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
