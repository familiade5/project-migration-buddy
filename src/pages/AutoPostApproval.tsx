import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAutoPostQueue, AutoPostQueueItem } from '@/hooks/useAutoPostQueue';
import { AutoPostApprovalDialog } from '@/components/auto-post/AutoPostApprovalDialog';
import { Loader2, Inbox, CheckCircle2, XCircle, Clock, RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const [financingFilter, setFinancingFilter] = useState<'all' | 'financing' | 'cash'>('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<AutoPostQueueItem | null>(null);
  const [isScraping, setIsScraping] = useState(false);
  const { data: items, isLoading, refetch } = useAutoPostQueue(activeTab);

  const stateFilteredItems = useMemo(() => {
    if (!items) return [];
    return items.filter((item) => matchesStateFilter(item, stateFilter));
  }, [items, stateFilter]);

  const filteredItems = useMemo(() => {
    return stateFilteredItems.filter((item) => {
      const isFinancing = isFinancingProperty(item);
      if (financingFilter === 'financing' && !isFinancing) return false;
      if (financingFilter === 'cash' && isFinancing) return false;
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

  const CE_CITIES = ['Eusébio', 'Caucaia', 'Maracanaú', 'Pacatuba', 'Fortaleza', 'Pacajus', 'Maranguape', 'Aquiraz', 'Cascavel'];

  const handleImportCeCities = async () => {
    setIsImporting(true);
    const empty: string[] = [];
    const failed: string[] = [];
    let totalNew = 0;
    try {
      for (const city of CE_CITIES) {
        try {
          const data = await importOneCity(city, 'CE');
          totalNew += data.new_properties || 0;
          if ((data.new_properties || 0) === 0 && (data.already_existing || 0) === 0) empty.push(city);
        } catch {
          failed.push(city);
        }
      }
      const parts = [`${totalNew} novos imóveis extraídos.`];
      if (empty.length) parts.push(`Sem imóveis na Caixa hoje: ${empty.join(', ')}.`);
      if (failed.length) parts.push(`Falhou em: ${failed.join(', ')} — tente de novo.`);
      if (totalNew > 0) { toast.success(parts.join(' '), { duration: 8000 }); setActiveTab('pending'); refetch(); }
      else if (failed.length === 0) toast.info(parts.join(' '), { duration: 8000 });
      else toast.error(parts.join(' '), { duration: 8000 });
    } finally {
      setIsImporting(false);
    }
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
          </div>

          {/* State filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-[180px] h-8 text-xs" style={{ backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#374151' }}>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                {STATES.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
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
                  {item.photos && item.photos.length > 0 && (
                    <div className="h-40 bg-gray-100 overflow-hidden">
                      <img
                        src={item.photos[0]}
                        alt="Foto do imóvel"
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  )}

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
                    <p className="text-[10px] text-gray-300 pt-1">
                      {new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {item.status === 'pending' && (
                      <Button
                        size="sm"
                        disabled={approvingId === item.id}
                        onClick={(e) => { e.stopPropagation(); handleQuickApprove(item); }}
                        className="w-full mt-2 h-8 text-white gap-1.5"
                        style={{ backgroundColor: '#22c55e' }}
                      >
                        {approvingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Aprovar
                      </Button>
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
