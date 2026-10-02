import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SiteLayout } from '@/components/site/SiteLayout';
import { PropertyCard } from '@/components/site/PropertyCard';
import { SiteProperty, SITE_GREEN, fetchAll, siteTable, stateName, countdownLabel } from '@/lib/vdhSite';

type Fin = 'all' | 'fin' | 'cash';
type Sort = 'discount' | 'price_asc' | 'price_desc' | 'new';
const PER_PAGE = 24;

const chip = (active: boolean) =>
  active ? { backgroundColor: SITE_GREEN, color: '#fff', borderColor: SITE_GREEN } : { backgroundColor: '#fff', color: '#334155', borderColor: '#e2e8f0' };

export default function SiteCity() {
  const { uf = '', city = '' } = useParams();
  const cityName = decodeURIComponent(city);
  const [items, setItems] = useState<SiteProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [fin, setFin] = useState<Fin>('all');
  const [beds, setBeds] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [type, setType] = useState('all');
  const [sort, setSort] = useState<Sort>('discount');
  const [onlyDispute, setOnlyDispute] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchAll<SiteProperty>((a, b) => siteTable().select('*').eq('uf', uf.toUpperCase()).eq('city', cityName).range(a, b))
      .then(setItems).catch(() => setItems([])).finally(() => setLoading(false));
  }, [uf, cityName]);

  const types = useMemo(() => [...new Set(items.map((i) => i.property_type || 'Imóvel'))].sort(), [items]);

  const list = useMemo(() => {
    const l = items.filter((p) =>
      (fin === 'all' || (fin === 'fin' ? p.accepts_financing : !p.accepts_financing)) &&
      (!beds || p.bedrooms >= beds) &&
      (!maxPrice || p.price <= maxPrice) &&
      (type === 'all' || p.property_type === type) &&
      (!onlyDispute || !!countdownLabel(p.countdown_ends_at))
    );
    const sorters: Record<Sort, (a: SiteProperty, b: SiteProperty) => number> = {
      discount: (a, b) => b.discount - a.discount,
      price_asc: (a, b) => a.price - b.price,
      price_desc: (a, b) => b.price - a.price,
      new: (a, b) => b.first_seen_at.localeCompare(a.first_seen_at),
    };
    return l.sort((a, b) => (a.status === 'sold' ? 1 : 0) - (b.status === 'sold' ? 1 : 0) || sorters[sort](a, b));
  }, [items, fin, beds, maxPrice, type, sort, onlyDispute]);

  const finCount = items.filter((i) => i.accepts_financing && i.status === 'active').length;

  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); }, [uf, cityName, fin, beds, maxPrice, type, sort, onlyDispute]);
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const safePage = Math.min(page, pages);
  const goTo = (n: number) => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const pageNums: number[] = [];
  for (let n = 1; n <= pages; n++) {
    if (n === 1 || n === pages || Math.abs(n - safePage) <= 1) pageNums.push(n);
    else if (pageNums[pageNums.length - 1] !== 0) pageNums.push(0);
  }

  return (
    <SiteLayout title={`Imóveis Caixa em ${cityName} - ${uf.toUpperCase()}`} description={`${items.length} imóveis da Caixa em ${cityName}, ${stateName(uf)}. Veja os que aceitam financiamento.`}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link to="/imoveis" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"><ArrowLeft className="w-4 h-4" /> Trocar cidade</Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 text-slate-900">Imóveis Caixa em {cityName}</h1>
        <p className="text-slate-500 text-sm">{stateName(uf)} · {items.filter((i) => i.status === 'active').length} disponíveis · {finCount} aceitam financiamento</p>

        <div className="mt-5 flex flex-wrap gap-2 items-center">
          {([['all', 'Todos'], ['fin', 'Aceita financiamento'], ['cash', 'Somente à vista']] as [Fin, string][]).map(([k, l]) => (
            <button key={k} onClick={() => setFin(k)} className="px-3 py-1.5 rounded-full border text-sm font-medium" style={chip(fin === k)}>{l}</button>
          ))}
          <button onClick={() => setOnlyDispute(!onlyDispute)} className="px-3 py-1.5 rounded-full border text-sm font-medium" style={chip(onlyDispute)}>⏱ Em disputa</button>
          <select value={beds} onChange={(e) => setBeds(Number(e.target.value))} className="h-9 px-3 rounded-full border border-slate-200 bg-white text-slate-700 text-sm">
            <option value={0}>Quartos</option><option value={1}>1+</option><option value={2}>2+</option><option value={3}>3+</option>
          </select>
          <select value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="h-9 px-3 rounded-full border border-slate-200 bg-white text-slate-700 text-sm">
            <option value={0}>Preço até</option>
            {[80000, 120000, 160000, 200000, 300000, 500000].map((v) => <option key={v} value={v}>{v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</option>)}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className="h-9 px-3 rounded-full border border-slate-200 bg-white text-slate-700 text-sm">
            <option value="all">Tipo</option>{types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-9 px-3 rounded-full border border-slate-200 bg-white text-slate-700 text-sm ml-auto">
            <option value="discount">Maior desconto</option><option value="price_asc">Menor preço</option><option value="price_desc">Maior preço</option><option value="new">Mais recentes</option>
          </select>
        </div>

        {loading ? (
          <p className="text-slate-500 py-16 text-center">Carregando imóveis…</p>
        ) : list.length === 0 ? (
          <p className="text-slate-500 py-16 text-center">Nenhum imóvel com esses filtros.</p>
        ) : (
          <>
            <p className="text-xs text-slate-500 mt-5">Mostrando {(safePage - 1) * PER_PAGE + 1}–{Math.min(safePage * PER_PAGE, list.length)} de {list.length} imóveis</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
              {list.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE).map((p) => <PropertyCard key={p.code} p={p} />)}
            </div>
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
                <button disabled={safePage === 1} onClick={() => goTo(safePage - 1)} className="px-4 py-2 rounded-full border text-sm font-medium disabled:opacity-40" style={chip(false)}>‹ Anterior</button>
                {pageNums.map((n, i) => n === 0
                  ? <span key={`e${i}`} className="px-1 text-slate-400">…</span>
                  : <button key={n} onClick={() => goTo(n)} className="w-10 h-10 rounded-full border text-sm font-medium" style={chip(n === safePage)}>{n}</button>)}
                <button disabled={safePage === pages} onClick={() => goTo(safePage + 1)} className="px-4 py-2 rounded-full border text-sm font-medium disabled:opacity-40" style={chip(false)}>Próxima ›</button>
              </div>
            )}
          </>
        )}
      </div>
    </SiteLayout>
  );
}
