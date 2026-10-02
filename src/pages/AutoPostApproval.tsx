import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAutoPostQueue, AutoPostQueueItem } from '@/hooks/useAutoPostQueue';
import { AutoPostApprovalDialog } from '@/components/auto-post/AutoPostApprovalDialog';
import { Loader2, Inbox, CheckCircle2, XCircle, Clock, RefreshCw, Filter, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import noPhotoImg from '@/assets/imagem-nao-fornecida.jpg';

// Foto oficial "Imagem não fornecida" usada no post quando a Caixa não tem foto (5x para a OLX)
const NO_PHOTO_URL = 'https://kubdwbzahemthstrxrxh.supabase.co/storage/v1/object/public/exported-creatives/placeholders%2Fimagem-nao-fornecida.jpg';
const usePlaceholderPhoto = async (item: { id: string; photos?: string[] | null }) => {
  const photos = Array(5).fill(NO_PHOTO_URL);
  item.photos = photos;
  await supabase.from('auto_post_queue').update({ photos }).eq('id', item.id);
};

const BRAND_BLUE = '#1a3a6b';
const BRAND_GOLD = '#c9a84c';

const statusTabs = [
  { key: 'pending', label: 'Pendentes', icon: Clock, color: '#f59e0b' },
  { key: 'approved', label: 'Aprovados', icon: CheckCircle2, color: '#22c55e' },
  { key: 'published', label: 'Publicados', icon: CheckCircle2, color: BRAND_BLUE },
  { key: 'rejected', label: 'Rejeitados', icon: XCircle, color: '#ef4444' },
];

const STATES = [
  { value: 'all', label: 'Todos os estados' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'CE', label: 'Ceará' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'SC', label: 'Santa Catarina' },
];

const isFinancingProperty = (item: AutoPostQueueItem) => {
  const pd = item.property_data as any;
  return pd?.acceptsFinancing === true || pd?.acceptsFinancing === 'true';
};

const matchesStateFilter = (item: AutoPostQueueItem, stateFilter: string) => {
  if (stateFilter === 'all') return true;

  const pd = item.property_data as any;
  const itemState = (pd?.state || '').trim();
  const stateLabel = STATES.find((state) => state.value === stateFilter)?.label?.toLowerCase();
  const stateUF = itemState.length === 2 ? itemState.toUpperCase() : '';

  return stateUF === stateFilter || stateLabel === itemState.toLowerCase();
};

const AutoPostApproval = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [financingFilter, setFinancingFilter] = useState<'all' | 'financing' | 'cash' | 'countdown'>('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<AutoPostQueueItem | null>(null);
  const [isScraping, setIsScraping] = useState(false);
  const { data: items, isLoading, refetch } = useAutoPostQueue(activeTab);

  const [cityFilter, setCityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const dayKey = (iso: string) => new Date(iso).toLocaleDateString('pt-BR');
  const todayKey = new Date().toLocaleDateString('pt-BR');

  const onlyState = useMemo(() => (items || []).filter((i) => matchesStateFilter(i, stateFilter)), [items, stateFilter]);
  const cityOptions = useMemo(() => {
    const m = new Map<string, number>();
    onlyState.forEach((i) => { const c = ((i.property_data as any)?.city || '').trim(); if (c) m.set(c, (m.get(c) || 0) + 1); });
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'));
  }, [onlyState]);
  const onlyCity = useMemo(() => cityFilter === 'all' ? onlyState : onlyState.filter((i) => ((i.property_data as any)?.city || '').trim() === cityFilter), [onlyState, cityFilter]);
  const dateOptions = useMemo(() => {
    const m = new Map<string, { n: number; t: number }>();
    onlyCity.forEach((i) => { const k = dayKey(i.created_at); const t = new Date(i.created_at).getTime(); const cur = m.get(k); m.set(k, { n: (cur?.n || 0) + 1, t: Math.max(cur?.t || 0, t) }); });
    return [...m.entries()].sort((a, b) => b[1].t - a[1].t);
  }, [onlyCity]);
  const stateFilteredItems = useMemo(() => dateFilter === 'all' ? onlyCity : onlyCity.filter((i) => dayKey(i.created_at) === dateFilter), [onlyCity, dateFilter]);

  const countdownLabel = (item: AutoPostQueueItem) => {
    const end = (item.property_data as any)?.countdownEndsAt;
    if (!end) return '';
    const ms = new Date(end).getTime() - Date.now();
    if (ms <= 0) return '';
    const h = Math.floor(ms / 3600_000);
    const d = Math.floor(h / 24);
    return d > 0 ? `${d} dia${d > 1 ? 's' : ''} e ${h % 24}h` : `${h}h`;
  };

  const filteredItems = useMemo(() => {
    return stateFilteredItems.filter((item) => {
      const isFinancing = isFinancingProperty(item);
      if (financingFilter === 'financing' && !isFinancing) return false;
      if (financingFilter === 'cash' && isFinancing) return false;
      if (financingFilter === 'countdown' && !countdownLabel(item)) return false;
      return true;
    });
  }, [stateFilteredItems, financingFilter]);

  const visibleCount = filteredItems.length;
  const stateScopedCount = stateFilteredItems.length;

  const [importCity, setImportCity] = useState('Horizonte');
  const [importState, setImportState] = useState('CE');
  const [isImporting, setIsImporting] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const handleImportCity = async () => {
    if (importCity.trim().length < 2) { toast.error('Informe a cidade'); return; }
    setIsImporting(true);
    try {
      const data = await importOneCity(importCity.trim(), importState);
      toast.success(
        `${data.city}: ${data.new_properties} novos (${data.financing} com financiamento, ${data.cash} à vista). ${data.already_existing} já existiam.`
      );
      setActiveTab('pending');
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao importar');
    } finally {
      setIsImporting(false);
    }
  };

  const importOneCity = async (city: string, state: string) => {
    const { data, error } = await supabase.functions.invoke('import-caixa-city', {
      body: { city, state },
    });
    if (error) {
      const ctx = (error as any)?.context;
      const msg = ctx?.json ? (await ctx.json().catch(() => null))?.error : null;
      throw new Error(msg || error.message);
    }
    if (!data?.success) throw new Error(data?.error || 'Falha na importação');
    return data;
  };

  const CRECI_STATES = STATES.filter((st) => st.value !== 'all');
  const CE_DEFAULT = ['Eusébio', 'Caucaia', 'Maracanaú', 'Pacatuba', 'Fortaleza', 'Pacajus', 'Maranguape', 'Aquiraz', 'Cascavel'];
  const [regionState, setRegionState] = useState('');
  const [regionCities, setRegionCities] = useState<{ name: string; count: number }[]>([]);
  const [regionSel, setRegionSel] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [regionProgress, setRegionProgress] = useState('');
  const [failedCities, setFailedCities] = useState<string[]>([]);

  const loadRegionCities = async (uf: string) => {
    setRegionState(uf); setRegionCities([]); setRegionSel([]); setLoadingCities(true);
    try {
      const { data, error } = await supabase.functions.invoke('import-caixa-city', { body: { state: uf, action: 'list_cities' } });
      if (error || !data?.success) throw new Error(data?.error || 'Não foi possível carregar as cidades');
      setRegionCities(data.cities);
      if (uf === 'CE') {
        const n = (x: string) => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
        setRegionSel(data.cities.filter((c: any) => CE_DEFAULT.some((d) => n(d) === n(c.name))).map((c: any) => c.name));
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao carregar cidades');
    } finally { setLoadingCities(false); }
  };

  const runImport = async (cities: string[]) => {
    if (!cities.length) { toast.error('Escolha ao menos uma cidade'); return; }
    setIsImporting(true);
    const empty: string[] = [];
    const failed: string[] = [];
    let totalNew = 0, withClock = 0;
    try {
      for (let i = 0; i < cities.length; i++) {
        const city = cities[i];
        setRegionProgress(`${i + 1}/${cities.length}: ${city}`);
        try {
          const data = await importOneCity(city, regionState);
          totalNew += data.new_properties || 0;
          withClock += data.with_countdown || 0;
          if ((data.new_properties || 0) === 0 && (data.already_existing || 0) === 0) empty.push(city);
        } catch {
          failed.push(city);
        }
      }
      setFailedCities(failed);
      const parts = [`${totalNew} novos imóveis extraídos${withClock ? ` (${withClock} em contagem regressiva)` : ''}.`];
      if (empty.length) parts.push(`Sem imóveis na Caixa hoje: ${empty.join(', ')}.`);
      if (failed.length) parts.push(`Falhou em: ${failed.join(', ')} — use o botão "Tentar de novo as que falharam".`);
      if (totalNew > 0) { toast.success(parts.join(' '), { duration: 8000 }); setActiveTab('pending'); refetch(); }
      else if (failed.length === 0) toast.info(parts.join(' '), { duration: 8000 });
      else toast.error(parts.join(' '), { duration: 8000 });
    } finally {
      setIsImporting(false); setRegionProgress('');
    }
  };

  const handleImportRegion = () => runImport(regionSel);

  const [refreshingClock, setRefreshingClock] = useState(false);
  const handleRefreshCountdowns = async () => {
    setRefreshingClock(true);
    let found = 0, checked = 0;
    try {
      const ufs = stateFilter !== 'all' ? [stateFilter] : STATES.filter((x) => x.value !== 'all').map((x) => x.value);
      for (const uf of ufs) {
        const { data } = await supabase.functions.invoke('import-caixa-city', {
          body: { action: 'refresh_countdowns', state: uf, city: cityFilter !== 'all' ? cityFilter : '' },
        });
        found += data?.with_countdown || 0; checked += data?.checked || 0;
      }
      toast.success(`${checked} imóveis com financiamento conferidos: ${found} em contagem regressiva.`);
      refetch();
    } catch { toast.error('Não foi possível atualizar os cronômetros'); }
    finally { setRefreshingClock(false); }
  };

  const handleQuickReject = async (item: AutoPostQueueItem) => {
    setApprovingId(item.id);
    const { error } = await supabase.from('auto_post_queue').update({ status: 'rejected' }).eq('id', item.id);
    setApprovingId(null);
    if (error) { toast.error('Não foi possível rejeitar'); return; }
    toast.success('Post rejeitado');
    refetch();
  };

  const handleMarkPosted = async (item: AutoPostQueueItem) => {
    setApprovingId(item.id);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from('auto_post_queue')
      .update({ status: 'published', approved_by_user_id: u.user?.id, published_at: new Date().toISOString() })
      .eq('id', item.id);
    setApprovingId(null);
    if (error) { toast.error('Não foi possível marcar como postado'); return; }
    toast.success('Post movido para Publicados');
    refetch();
  };

  const handleQuickApprove = async (item: AutoPostQueueItem) => {
    setApprovingId(item.id);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from('auto_post_queue')
      .update({ status: 'approved', approved_by_user_id: u.user?.id })
      .eq('id', item.id);
    setApprovingId(null);
    if (error) { toast.error('Não foi possível aprovar'); return; }
    toast.success('Post aprovado');
    refetch();
  };

  const handleScrapeNow = async () => {
    setIsScraping(true);
    try {
      const selectedState = stateFilter !== 'all' ? stateFilter : undefined;
      const { data, error } = await supabase.functions.invoke('scrape-caixa-properties', {
        body: selectedState ? { state: selectedState } : {},
      });
      if (error) throw error;

      const statesUsed = Array.isArray(data?.states_used) ? data.states_used : [];
      const stateLabel = selectedState
        ? STATES.find((state) => state.value === selectedState)?.label || selectedState
        : statesUsed.length === 1
          ? STATES.find((state) => state.value === statesUsed[0])?.label || statesUsed[0]
          : 'estados ativos';

      toast.success(
        `Busca concluída em ${stateLabel}: ${data?.new_properties || 0} novos, ${data?.skipped_existing || 0} já existentes`
      );
      refetch();
    } catch (err) {
      toast.error('Erro ao executar scraping');
      console.error(err);
    } finally {
      setIsScraping(false);
    }
  };

  const formatCurrency = (val: string) => val || 'N/A';

  const financingCount = useMemo(() => {
    let financing = 0, cash = 0;
    for (const item of stateFilteredItems) {
      if (isFinancingProperty(item)) financing++; else cash++;
    }
    return { financing, cash };
  }, [stateFilteredItems]);

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: BRAND_BLUE }}>
              Aprovação de Posts
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Revise e aprove imóveis capturados automaticamente antes de publicar
            </p>
          </div>
          <Button
            onClick={handleScrapeNow}
            disabled={isScraping}
            className="text-white gap-2"
            style={{ backgroundColor: BRAND_GOLD }}
          >
            {isScraping ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {isScraping ? 'Buscando...' : 'Buscar Imóveis'}
          </Button>
        </div>

        {/* Importar por cidade (lista oficial da Caixa) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
          <p className="text-sm font-semibold mb-1" style={{ color: BRAND_BLUE }}>Extrair imóveis da Caixa por cidade</p>
          <p className="text-xs text-gray-500 mb-3">Somente Venda Direta e Venda Online. Os posts entram em "Pendentes", separados por financiamento e à vista.</p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={importCity}
              onChange={(e) => setImportCity(e.target.value)}
              placeholder="Cidade"
              maxLength={80}
              className="h-9 px-3 rounded-md border border-gray-200 bg-white text-sm text-gray-800 w-56"
            />
            <input
              value={importState}
              onChange={(e) => setImportState(e.target.value.toUpperCase().slice(0, 2))}
              placeholder="UF"
              className="h-9 px-3 rounded-md border border-gray-200 bg-white text-sm text-gray-800 w-16 uppercase"
            />
            <Button onClick={handleImportCity} disabled={isImporting} className="text-white gap-2 h-9" style={{ backgroundColor: BRAND_BLUE }}>
              {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {isImporting ? 'Extraindo...' : 'Extrair posts'}
            </Button>
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4">
            <p className="text-sm font-semibold mb-1" style={{ color: BRAND_GOLD }}>Extrair região (várias cidades)</p>
            <p className="text-xs text-gray-500 mb-3">Escolha o estado (só estados com CRECI) e marque as cidades.</p>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Select value={regionState} onValueChange={loadRegionCities}>
                <SelectTrigger className="w-[220px] h-9 text-sm" style={{ backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#374151' }}>
                  <SelectValue placeholder="Escolha o estado" />
                </SelectTrigger>
                <SelectContent>
                  {CRECI_STATES.map((st) => <SelectItem key={st.value} value={st.value}>{st.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {regionCities.length > 0 && (
                <>
                  <button type="button" className="text-xs underline text-gray-600" onClick={() => setRegionSel(regionCities.map((c) => c.name))}>Marcar todas</button>
                  <button type="button" className="text-xs underline text-gray-600" onClick={() => setRegionSel([])}>Limpar</button>
                </>
              )}
              <Button onClick={handleImportRegion} disabled={isImporting || !regionSel.length} className="text-white gap-2 h-9" style={{ backgroundColor: BRAND_GOLD }}>
                {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {isImporting && regionProgress ? `Extraindo ${regionProgress}` : `Extrair ${regionSel.length} cidade(s)`}
              </Button>
              {failedCities.length > 0 && !isImporting && (
                <Button variant="outline" onClick={() => runImport(failedCities)} className="gap-2 h-9 border-red-300 text-red-700 hover:bg-red-50">
                  Tentar de novo as que falharam ({failedCities.length})
                </Button>
              )}
            </div>
            {loadingCities && <p className="text-xs text-gray-500 flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" />Carregando cidades da Caixa...</p>}
            {regionCities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {regionCities.map((c) => {
                  const on = regionSel.includes(c.name);
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setRegionSel(on ? regionSel.filter((x) => x !== c.name) : [...regionSel, c.name])}
                      className="px-2.5 py-1 rounded-full text-xs border"
                      style={on ? { backgroundColor: BRAND_BLUE, color: '#fff', borderColor: BRAND_BLUE } : { backgroundColor: '#fff', color: '#374151', borderColor: '#e5e7eb' }}
                    >
                      {c.name} ({c.count})
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 mb-4 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap"
              style={
                activeTab === tab.key
                  ? { backgroundColor: tab.color, color: 'white' }
                  : { color: '#6B7280' }
              }
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {items && activeTab === tab.key && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={activeTab === tab.key
                    ? { backgroundColor: 'rgba(255,255,255,0.3)', color: 'white' }
                    : { backgroundColor: '#e5e7eb', color: '#6b7280' }
                  }>
                  {stateScopedCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Financing sub-tabs */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setFinancingFilter('all')}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
              style={financingFilter === 'all'
                ? { backgroundColor: BRAND_BLUE, color: 'white' }
                : { color: '#6b7280' }
              }
            >
              Todos ({stateScopedCount})
            </button>
            <button
              onClick={() => setFinancingFilter('financing')}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
              style={financingFilter === 'financing'
                ? { backgroundColor: '#22c55e', color: 'white' }
                : { color: '#6b7280' }
              }
            >
              💰 Financiamento ({financingCount.financing})
            </button>
            <button
              onClick={() => setFinancingFilter('cash')}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
              style={financingFilter === 'cash'
                ? { backgroundColor: '#f97316', color: 'white' }
                : { color: '#6b7280' }
              }
            >
              💵 À Vista ({financingCount.cash})
            </button>
            <button
              onClick={() => setFinancingFilter('countdown')}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
              style={financingFilter === 'countdown' ? { backgroundColor: '#dc2626', color: 'white' } : { color: '#6b7280' }}
            >
              ⏱ Em contagem ({stateFilteredItems.filter((i) => countdownLabel(i)).length})
            </button>
          </div>

          {/* State filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <Select value={stateFilter} onValueChange={(v) => { setStateFilter(v); setCityFilter('all'); setDateFilter('all'); }}>
              <SelectTrigger className="w-[180px] h-8 text-xs" style={{ backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#374151' }}>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                {STATES.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={cityFilter} onValueChange={(v) => { setCityFilter(v); setDateFilter('all'); }}>
              <SelectTrigger className="w-[190px] h-8 text-xs" style={{ backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#374151' }}>
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as cidades</SelectItem>
                {cityOptions.map(([c, n]) => <SelectItem key={c} value={c}>{c} ({n})</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[200px] h-8 text-xs" style={{ backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#374151' }}>
                <SelectValue placeholder="Adicionados em" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as datas</SelectItem>
                {dateOptions.map(([d, v]) => <SelectItem key={d} value={d}>{d === todayKey ? `Hoje (${d})` : d} — {v.n} novos</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Inbox className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium">Nenhum item {activeTab === 'pending' ? 'pendente' : ''}</p>
            <p className="text-sm">
              {activeTab === 'pending'
                ? 'Clique em "Buscar Imóveis" para capturar novos imóveis'
                : 'Nenhum item nesta categoria'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const pd = item.property_data as any;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  {/* Photo */}
                  <div className="h-40 bg-gray-100 overflow-hidden">
                    <img
                      src={item.photos?.[0] || NO_PHOTO_URL}
                      alt="Foto do imóvel"
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => { const img = e.target as HTMLImageElement; if (img.src.includes('imagem-nao-fornecida')) return; img.src = noPhotoImg; usePlaceholderPhoto(item); }}
                    />
                  </div>

                  <div className="p-4 space-y-2">
                    {/* Type + Location */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {pd?.propertyName || `${pd?.type || 'Imóvel'} - ${pd?.neighborhood || pd?.city || ''}`}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {pd?.city}, {pd?.state}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap"
                          style={
                            item.status === 'pending'
                              ? { backgroundColor: '#fef3c7', color: '#92400e' }
                              : item.status === 'approved'
                              ? { backgroundColor: '#d1fae5', color: '#065f46' }
                              : item.status === 'published'
                              ? { backgroundColor: '#dbeafe', color: '#1e40af' }
                              : { backgroundColor: '#fee2e2', color: '#991b1b' }
                          }
                        >
                          {item.status === 'pending' ? 'Pendente' : item.status === 'approved' ? 'Aprovado' : item.status === 'published' ? 'Publicado' : 'Rejeitado'}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                          style={pd?.acceptsFinancing
                            ? { backgroundColor: '#dcfce7', color: '#166534' }
                            : { backgroundColor: '#ffedd5', color: '#9a3412' }
                          }
                        >
                          {pd?.acceptsFinancing ? '💰 Financiamento' : '💵 À Vista'}
                        </span>
                      </div>
                    </div>

                    {/* Prices */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-gray-500">Avaliação: <strong className="text-gray-700">{formatCurrency(pd?.evaluationValue)}</strong></span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-gray-500">Mínimo: <strong style={{ color: '#22c55e' }}>{formatCurrency(pd?.minimumValue)}</strong></span>
                      {pd?.discount && <span className="text-red-500 font-bold">-{pd.discount}%</span>}
                    </div>

                    {/* Features */}
                    <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                      {pd?.bedrooms && pd.bedrooms !== '0' && <span>🛏️ {pd.bedrooms}</span>}
                      {pd?.bathrooms && pd.bathrooms !== '0' && <span>🚿 {pd.bathrooms}</span>}
                      {pd?.garageSpaces && pd.garageSpaces !== '0' && <span>🚗 {pd.garageSpaces}</span>}
                      {pd?.area && <span>📐 {pd.area}m²</span>}
                    </div>

                    {/* Date */}
                    <p className="text-[10px] text-gray-400 pt-1 flex items-center gap-1.5">
                      {dayKey(item.created_at) === todayKey && (
                        <span className="px-1.5 py-0.5 rounded font-bold text-white" style={{ backgroundColor: BRAND_GOLD }}>NOVO HOJE</span>
                      )}
                      Adicionado em {new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {countdownLabel(item) && (
                      <p className="text-xs font-semibold flex items-center gap-1.5 px-2 py-1 rounded-md w-fit" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
                        <Timer className="w-3.5 h-3.5" /> Cronômetro Caixa: {countdownLabel(item)}
                      </p>
                    )}
                    {item.status === 'pending' && (
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          disabled={approvingId === item.id}
                          onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                          className="flex-1 h-8 text-white gap-1.5"
                          style={{ backgroundColor: '#22c55e' }}
                        >
                          {approvingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          disabled={approvingId === item.id}
                          onClick={(e) => { e.stopPropagation(); handleQuickReject(item); }}
                          className="flex-1 h-8 text-white gap-1.5"
                          style={{ backgroundColor: '#ef4444' }}
                        >
                          <XCircle className="w-4 h-4" />
                          Rejeitar
                        </Button>
                        <Button
                          size="sm"
                          disabled={approvingId === item.id}
                          onClick={(e) => { e.stopPropagation(); handleMarkPosted(item); }}
                          className="flex-1 h-8 text-white gap-1.5"
                          style={{ backgroundColor: BRAND_BLUE }}
                          title="Já publiquei manualmente no Instagram"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Já postado
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Approval Dialog */}
        {selectedItem && (
          <AutoPostApprovalDialog
            item={selectedItem}
            open={!!selectedItem}
            onOpenChange={(open) => { if (!open) setSelectedItem(null); }}
            onActionComplete={() => { setSelectedItem(null); refetch(); }}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default AutoPostApproval;
