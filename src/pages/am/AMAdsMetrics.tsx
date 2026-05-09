import { useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AMLayout } from '@/components/layout/AMLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, RefreshCw, TrendingUp, MousePointerClick, MessageCircle, Users, DollarSign, Eye, Target, Zap } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const MASTER_EMAIL = 'neto@vendadiretahoje.com.br';
const AM_ORANGE = '#F47920';
const AM_BLUE = '#1B5EA6';

const PRESETS = [
  { value: 'today', label: 'Hoje' },
  { value: 'yesterday', label: 'Ontem' },
  { value: 'last_7d', label: 'Últimos 7 dias' },
  { value: 'last_30d', label: 'Últimos 30 dias' },
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

const fmtBRL = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtNum = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
const fmtInt = (n: number) => Math.round(n).toLocaleString('pt-BR');

export default function AMAdsMetrics() {
  const { user, isLoading: authLoading } = useAuth();
  const [preset, setPreset] = useState('last_7d');
  const [loading, setLoading] = useState(false);
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [series, setSeries] = useState<SeriesPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('am-ads-insights', {
        body: undefined,
        method: 'GET' as any,
      });
      // functions.invoke does not pass query string; fallback to fetch
      let payload: any = data;
      if (!payload || error) {
        const sessionRes = await supabase.auth.getSession();
        const token = sessionRes.data.session?.access_token;
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/am-ads-insights?preset=${preset}`;
        const r = await fetch(url, { headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } });
        payload = await r.json();
        if (!r.ok) throw new Error(payload?.error?.message || payload?.error || 'Erro ao buscar métricas');
      }
      setKpis(payload.kpis);
      setSeries(payload.series || []);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || String(e));
      toast.error('Erro ao carregar métricas: ' + (e?.message || e));
    } finally {
      setLoading(false);
    }
  }, [preset]);

  // re-fetch when preset changes
  useEffect(() => {
    if (user?.email === MASTER_EMAIL) {
      // direct fetch with preset
      (async () => {
        setLoading(true);
        setError(null);
        try {
          const sessionRes = await supabase.auth.getSession();
          const token = sessionRes.data.session?.access_token;
          const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/am-ads-insights?preset=${preset}`;
          const r = await fetch(url, { headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } });
          const payload = await r.json();
          if (!r.ok) throw new Error(payload?.error?.message || payload?.error || JSON.stringify(payload));
          setKpis(payload.kpis);
          setSeries(payload.series || []);
        } catch (e: any) {
          console.error(e);
          setError(e?.message || String(e));
          toast.error('Erro: ' + (e?.message || e));
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [preset, user?.email]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: AM_ORANGE }} />
      </div>
    );
  }
  if (!user || user.email !== MASTER_EMAIL) return <Navigate to="/apartamentos-manaus" replace />;

  const chartData = series.map((p) => ({
    ...p,
    label: (() => { try { return format(parseISO(p.date), 'dd/MM', { locale: ptBR }); } catch { return p.date; } })(),
  }));

  return (
    <AMLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#111827' }}>Métricas de Anúncios</h1>
            <p className="text-sm text-gray-500 mt-1">
              Apartamentos Manaus · Meta Ads {kpis?.dateStart && `· ${kpis.dateStart} → ${kpis.dateStop}`}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESETS.map((p) => (
              <Button
                key={p.value}
                variant={preset === p.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreset(p.value)}
                style={preset === p.value ? { backgroundColor: AM_ORANGE, borderColor: AM_ORANGE } : {}}
              >
                {p.label}
              </Button>
            ))}
            <Button size="sm" variant="outline" onClick={load} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </header>

        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <p className="text-sm text-red-700 font-medium">Erro ao buscar dados</p>
            <p className="text-xs text-red-600 mt-1 break-all">{error}</p>
            <p className="text-xs text-gray-600 mt-2">Verifique se o token tem permissão <code>ads_read</code> e se o ID da conta está no formato <code>act_...</code>.</p>
          </Card>
        )}

        {loading && !kpis && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: AM_ORANGE }} />
          </div>
        )}

        {kpis && (
          <>
            {/* KPI grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <KpiCard icon={DollarSign} label="Investimento" value={fmtBRL(kpis.spend)} color={AM_ORANGE} />
              <KpiCard icon={Target} label="Leads" value={fmtInt(kpis.leads)} color={AM_BLUE} />
              <KpiCard icon={MessageCircle} label="Mensagens" value={fmtInt(kpis.messages)} color="#10B981" />
              <KpiCard icon={Zap} label="CPL" value={kpis.leads ? fmtBRL(kpis.cpl) : '—'} color={AM_ORANGE} />
              <KpiCard icon={Eye} label="Impressões" value={fmtInt(kpis.impressions)} color={AM_BLUE} />
              <KpiCard icon={Users} label="Alcance" value={fmtInt(kpis.reach)} color={AM_BLUE} />
              <KpiCard icon={MousePointerClick} label="Cliques" value={fmtInt(kpis.clicks)} color={AM_BLUE} />
              <KpiCard icon={TrendingUp} label="CTR" value={`${fmtNum(kpis.ctr)}%`} color="#10B981" />
              <KpiCard icon={DollarSign} label="CPC" value={fmtBRL(kpis.cpc)} color="#6B7280" />
              <KpiCard icon={DollarSign} label="CPM" value={fmtBRL(kpis.cpm)} color="#6B7280" />
              <KpiCard icon={MessageCircle} label="Custo / Mensagem" value={kpis.messages ? fmtBRL(kpis.cpMsg) : '—'} color="#10B981" />
            </div>

            {/* Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Gasto vs Leads vs Mensagens</h2>
                <span className="text-xs text-gray-500">Diário</span>
              </div>
              {chartData.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-12">Sem dados no período selecionado.</p>
              ) : (
                <div style={{ width: '100%', height: 360 }}>
                  <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(v: any, name: string) => name === 'Gasto' ? fmtBRL(Number(v)) : fmtInt(Number(v))}
                      />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="spend" name="Gasto" stroke={AM_ORANGE} strokeWidth={2} dot={false} />
                      <Line yAxisId="right" type="monotone" dataKey="leads" name="Leads" stroke={AM_BLUE} strokeWidth={2} dot={false} />
                      <Line yAxisId="right" type="monotone" dataKey="messages" name="Mensagens" stroke="#10B981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </AMLayout>
  );
}

function KpiCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <Card className="p-4 bg-white border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#111827' }}>{value}</p>
        </div>
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
    </Card>
  );
}