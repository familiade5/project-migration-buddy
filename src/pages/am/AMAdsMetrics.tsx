import { useEffect, useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AMLayout } from '@/components/layout/AMLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Loader2, RefreshCw, TrendingUp, MousePointerClick, MessageCircle,
  Users, DollarSign, Eye, Target, Zap, Search, ArrowUpDown, BarChart3,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const MASTER_EMAIL = 'neto@vendadiretahoje.com.br';
const AM_ORANGE = '#F47920';
const AM_BLUE = '#1B5EA6';
const GREEN = '#10B981';

const PRESETS = [
  { value: 'today', label: 'Hoje' },
  { value: 'yesterday', label: 'Ontem' },
  { value: 'last_7d', label: '7 dias' },
  { value: 'last_30d', label: '30 dias' },
  { value: 'this_month', label: 'Este mês' },
  { value: 'last_month', label: 'Mês passado' },
];

interface KPIs {
  spend: number; impressions: number; reach: number; clicks: number;
  cpm: number; cpc: number; ctr: number; leads: number; messages: number;
  cpl: number; cpMsg: number; dateStart: string; dateStop: string;
}
interface SeriesPoint {
  date: string; spend: number; impressions: number; reach: number;
  clicks: number; leads: number; messages: number;
}
interface Campaign {
  id: string; name: string; status: string; objective: string | null;
  spend: number; impressions: number; reach: number; clicks: number;
  cpm: number; cpc: number; ctr: number; leads: number; messages: number;
  cpl: number; cpMsg: number;
}

const fmtBRL = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtNum = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
const fmtInt = (n: number) => Math.round(n).toLocaleString('pt-BR');

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  ACTIVE:               { bg: '#DCFCE7', color: '#166534', label: 'Ativa' },
  PAUSED:               { bg: '#FEF3C7', color: '#92400E', label: 'Pausada' },
  DELETED:              { bg: '#FEE2E2', color: '#991B1B', label: 'Excluída' },
  ARCHIVED:             { bg: '#F3F4F6', color: '#6B7280', label: 'Arquivada' },
  CAMPAIGN_PAUSED:      { bg: '#FEF3C7', color: '#92400E', label: 'Pausada' },
  ADSET_PAUSED:         { bg: '#FEF3C7', color: '#92400E', label: 'Conjunto pausado' },
  IN_PROCESS:           { bg: '#DBEAFE', color: '#1E40AF', label: 'Processando' },
  WITH_ISSUES:          { bg: '#FEE2E2', color: '#991B1B', label: 'Com problemas' },
};

type SortKey = 'spend' | 'leads' | 'cpl' | 'messages' | 'ctr' | 'clicks' | 'impressions';

export default function AMAdsMetrics() {
  const { user, isLoading: authLoading } = useAuth();
  const [preset, setPreset] = useState('last_7d');
  const [loading, setLoading] = useState(false);
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [series, setSeries] = useState<SeriesPoint[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('spend');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');

  useEffect(() => {
    if (user?.email !== MASTER_EMAIL) return;
    (async () => {
      setLoading(true); setError(null);
      try {
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/am-ads-insights?preset=${preset}`;
        const r = await fetch(url, {
          headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        });
        const payload = await r.json();
        if (!r.ok) throw new Error(payload?.error?.message || JSON.stringify(payload));
        setKpis(payload.kpis); setSeries(payload.series || []); setCampaigns(payload.campaigns || []);
      } catch (e: any) {
        setError(e?.message || String(e));
        toast.error('Erro ao carregar métricas');
      } finally { setLoading(false); }
    })();
  }, [preset, user?.email]);

  const filteredCampaigns = useMemo(() => {
    let list = campaigns;
    if (search.trim()) list = list.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
    list = [...list].sort((a, b) => {
      const va = a[sortKey] as number; const vb = b[sortKey] as number;
      return sortDir === 'desc' ? vb - va : va - vb;
    });
    return list;
  }, [campaigns, search, sortKey, sortDir]);

  const chartData = series.map((p) => ({
    ...p,
    label: (() => { try { return format(parseISO(p.date), 'dd/MM', { locale: ptBR }); } catch { return p.date; } })(),
  }));

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    else { setSortKey(k); setSortDir('desc'); }
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" style={{ color: AM_ORANGE }} /></div>;
  }
  if (!user || user.email !== MASTER_EMAIL) return <Navigate to="/apartamentos-manaus" replace />;

  return (
    <AMLayout>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: AM_ORANGE }}>
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Painel de Anúncios</h1>
              <p className="text-sm text-gray-500">
                Apartamentos Manaus · Meta Ads
                {kpis?.dateStart && ` · ${format(parseISO(kpis.dateStart), 'dd/MM', { locale: ptBR })} → ${format(parseISO(kpis.dateStop), 'dd/MM/yyyy', { locale: ptBR })}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100">
              {PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPreset(p.value)}
                  className="text-xs font-medium px-3 py-1.5 rounded-md transition-all"
                  style={preset === p.value
                    ? { backgroundColor: '#fff', color: AM_ORANGE, boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }
                    : { color: '#6B7280' }}
                >{p.label}</button>
              ))}
            </div>
            <Button size="sm" variant="outline" onClick={() => setPreset((p) => p)} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <p className="text-sm text-red-700 font-semibold">Erro ao buscar dados</p>
            <p className="text-xs text-red-600 mt-1 break-all">{error}</p>
          </Card>
        )}

        {loading && !kpis && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: AM_ORANGE }} />
          </div>
        )}

        {kpis && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-white border border-gray-200 p-1 h-auto">
              <TabsTrigger value="overview" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 px-5 py-2">
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="campaigns" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 px-5 py-2">
                Por Campanha <span className="ml-2 text-xs opacity-70">({campaigns.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* OVERVIEW */}
            <TabsContent value="overview" className="space-y-6 mt-0">
              {/* KPI hero row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <HeroKpi icon={DollarSign} label="Investimento" value={fmtBRL(kpis.spend)} color={AM_ORANGE} highlight />
                <HeroKpi icon={Target} label="Leads gerados" value={fmtInt(kpis.leads)} color={AM_BLUE} />
                <HeroKpi icon={MessageCircle} label="Mensagens" value={fmtInt(kpis.messages)} color={GREEN} />
                <HeroKpi icon={Zap} label="Custo por Lead" value={kpis.leads ? fmtBRL(kpis.cpl) : '—'} color="#8B5CF6" />
              </div>

              {/* Chart */}
              <Card className="p-6 bg-white border border-gray-200">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">Performance ao longo do tempo</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Investimento vs. Resultados (diário)</p>
                  </div>
                </div>
                {chartData.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-12">Sem dados no período.</p>
                ) : (
                  <div style={{ width: '100%', height: 320 }}>
                    <ResponsiveContainer>
                      <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gSpend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={AM_ORANGE} stopOpacity={0.35} />
                            <stop offset="100%" stopColor={AM_ORANGE} stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={AM_BLUE} stopOpacity={0.35} />
                            <stop offset="100%" stopColor={AM_BLUE} stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gMsg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={GREEN} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }}
                          formatter={(v: any, name: string) => name === 'Gasto' ? fmtBRL(Number(v)) : fmtInt(Number(v))}
                        />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Area yAxisId="left" type="monotone" dataKey="spend" name="Gasto" stroke={AM_ORANGE} strokeWidth={2.5} fill="url(#gSpend)" />
                        <Area yAxisId="right" type="monotone" dataKey="leads" name="Leads" stroke={AM_BLUE} strokeWidth={2.5} fill="url(#gLeads)" />
                        <Area yAxisId="right" type="monotone" dataKey="messages" name="Mensagens" stroke={GREEN} strokeWidth={2.5} fill="url(#gMsg)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>

              {/* Secondary KPIs */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Entrega e custos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <MiniKpi icon={Eye} label="Impressões" value={fmtInt(kpis.impressions)} />
                  <MiniKpi icon={Users} label="Alcance" value={fmtInt(kpis.reach)} />
                  <MiniKpi icon={MousePointerClick} label="Cliques" value={fmtInt(kpis.clicks)} />
                  <MiniKpi icon={TrendingUp} label="CTR" value={`${fmtNum(kpis.ctr)}%`} />
                  <MiniKpi icon={DollarSign} label="CPC" value={fmtBRL(kpis.cpc)} />
                  <MiniKpi icon={DollarSign} label="CPM" value={fmtBRL(kpis.cpm)} />
                </div>
              </div>
            </TabsContent>

            {/* CAMPAIGNS */}
            <TabsContent value="campaigns" className="space-y-4 mt-0">
              <Card className="p-4 bg-white border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Buscar campanha..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 h-9 text-sm"
                    />
                  </div>
                  <span className="text-xs text-gray-500">{filteredCampaigns.length} campanha(s)</span>
                </div>

                {filteredCampaigns.length === 0 ? (
                  <div className="py-12 text-center text-sm text-gray-500">
                    {campaigns.length === 0 ? 'Nenhuma campanha encontrada no período.' : 'Nenhum resultado para a busca.'}
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                          <th className="text-left font-semibold py-3 px-4">Campanha</th>
                          <SortHead label="Investido" k="spend" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                          <SortHead label="Leads" k="leads" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                          <SortHead label="CPL" k="cpl" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                          <SortHead label="Msgs" k="messages" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                          <SortHead label="Cliques" k="clicks" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                          <SortHead label="CTR" k="ctr" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                          <SortHead label="Impressões" k="impressions" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCampaigns.map((c) => {
                          const st = STATUS_STYLES[c.status] || { bg: '#F3F4F6', color: '#6B7280', label: c.status };
                          const pctOfTotal = kpis.spend > 0 ? (c.spend / kpis.spend) * 100 : 0;
                          return (
                            <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex flex-col gap-1.5 max-w-[280px]">
                                  <span className="font-medium text-gray-900 text-sm leading-tight" title={c.name}>{c.name}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wide"
                                          style={{ backgroundColor: st.bg, color: st.color }}>
                                      {st.label}
                                    </span>
                                    {c.objective && (
                                      <span className="text-[10px] text-gray-400 uppercase tracking-wide">{c.objective}</span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="font-semibold text-gray-900">{fmtBRL(c.spend)}</div>
                                <div className="text-[10px] text-gray-400">{fmtNum(pctOfTotal)}% do total</div>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <span className="font-semibold" style={{ color: c.leads > 0 ? AM_BLUE : '#9CA3AF' }}>{fmtInt(c.leads)}</span>
                              </td>
                              <td className="py-3 px-4 text-right text-gray-700">{c.leads > 0 ? fmtBRL(c.cpl) : '—'}</td>
                              <td className="py-3 px-4 text-right">
                                <span className="font-semibold" style={{ color: c.messages > 0 ? GREEN : '#9CA3AF' }}>{fmtInt(c.messages)}</span>
                              </td>
                              <td className="py-3 px-4 text-right text-gray-700">{fmtInt(c.clicks)}</td>
                              <td className="py-3 px-4 text-right text-gray-700">{fmtNum(c.ctr)}%</td>
                              <td className="py-3 px-4 text-right text-gray-700">{fmtInt(c.impressions)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50 font-semibold text-sm">
                          <td className="py-3 px-4 text-gray-900">Total</td>
                          <td className="py-3 px-4 text-right text-gray-900">{fmtBRL(kpis.spend)}</td>
                          <td className="py-3 px-4 text-right" style={{ color: AM_BLUE }}>{fmtInt(kpis.leads)}</td>
                          <td className="py-3 px-4 text-right text-gray-900">{kpis.leads ? fmtBRL(kpis.cpl) : '—'}</td>
                          <td className="py-3 px-4 text-right" style={{ color: GREEN }}>{fmtInt(kpis.messages)}</td>
                          <td className="py-3 px-4 text-right text-gray-900">{fmtInt(kpis.clicks)}</td>
                          <td className="py-3 px-4 text-right text-gray-900">{fmtNum(kpis.ctr)}%</td>
                          <td className="py-3 px-4 text-right text-gray-900">{fmtInt(kpis.impressions)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AMLayout>
  );
}

function HeroKpi({ icon: Icon, label, value, color, highlight }: { icon: any; label: string; value: string; color: string; highlight?: boolean }) {
  return (
    <Card className="p-5 bg-white border border-gray-200 relative overflow-hidden">
      {highlight && <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: color }} />}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium">{label}</p>
          <p className="text-3xl font-bold mt-2 tracking-tight" style={{ color: '#0F172A' }}>{value}</p>
        </div>
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
    </Card>
  );
}

function MiniKpi({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <Card className="p-3.5 bg-white border border-gray-200">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">{label}</span>
      </div>
      <p className="text-lg font-bold" style={{ color: '#0F172A' }}>{value}</p>
    </Card>
  );
}

function SortHead({ label, k, sortKey, sortDir, onClick }: { label: string; k: SortKey; sortKey: SortKey; sortDir: 'asc' | 'desc'; onClick: (k: SortKey) => void }) {
  const active = sortKey === k;
  return (
    <th className="text-right font-semibold py-3 px-4">
      <button onClick={() => onClick(k)} className={`inline-flex items-center gap-1 hover:text-gray-900 transition-colors ${active ? 'text-orange-600' : ''}`}>
        {label}
        <ArrowUpDown className="w-3 h-3 opacity-50" />
        {active && <span className="text-[10px]">{sortDir === 'desc' ? '↓' : '↑'}</span>}
      </button>
    </th>
  );
}