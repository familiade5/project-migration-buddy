import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileCheck2, MapPin, MessageCircle, Search, ShieldCheck } from 'lucide-react';
import { SiteLayout } from '@/components/site/SiteLayout';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/vdh-site-hero.jpg';
import { SITE_STATES, fetchAll, siteTable } from '@/lib/vdhSite';

export default function SiteHome() {
  const navigate = useNavigate();
  const [uf, setUf] = useState('CE');
  const [rows, setRows] = useState<{ city: string; accepts_financing: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchAll<{ city: string; accepts_financing: boolean }>((a, b) =>
      siteTable().select('city, accepts_financing').eq('uf', uf).eq('status', 'active').range(a, b)
    ).then(setRows).catch(() => setRows([])).finally(() => setLoading(false));
  }, [uf]);

  const cities = useMemo(() => {
    const m = new Map<string, { total: number; fin: number }>();
    rows.forEach((r) => {
      const c = m.get(r.city) || { total: 0, fin: 0 };
      c.total++; if (r.accepts_financing) c.fin++;
      m.set(r.city, c);
    });
    return [...m.entries()].map(([name, v]) => ({ name, ...v }))
      .filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => b.total - a.total);
  }, [rows, q]);

  useEffect(() => { setSelectedCity(''); setQ(''); }, [uf]);

  const goToCity = () => {
    const city = selectedCity || cities[0]?.name;
    if (city) navigate(`/imoveis/${uf}/${encodeURIComponent(city)}`);
  };

  return (
    <SiteLayout description="Imóveis da Caixa com até 90% de desconto, atualizados todos os dias. Veja os que aceitam financiamento e faça sua pré-análise de crédito.">
      <section className="relative min-h-[610px] overflow-hidden bg-foreground">
        <img src={heroImage} alt="Casa contemporânea com jardim" width={1920} height={1080} className="absolute inset-0 size-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/85 to-foreground/20" />
        <div className="relative mx-auto flex min-h-[610px] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6">
          <div className="flex items-center gap-3 text-xs font-bold uppercase text-primary-foreground/80">
            <span className="size-2 rounded-full bg-accent" /> Imóveis Caixa atualizados diariamente
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.05] text-primary-foreground sm:text-6xl lg:text-7xl">Sua nova conquista começa <span className="text-accent">aqui e agora.</span></h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-primary-foreground/80 sm:text-lg">Encontre oportunidades em seis estados, compare condições e solicite uma pré-análise com acompanhamento especializado.</p>

          <div className="mt-9 grid w-full max-w-5xl gap-3 rounded-2xl border border-primary-foreground/15 bg-foreground/90 p-3 shadow-2xl md:grid-cols-[0.8fr_1.2fr_auto]">
            <label className="rounded-xl px-4 py-3 transition-colors focus-within:bg-primary-foreground/5">
              <span className="block text-[11px] font-bold uppercase text-accent">Estado</span>
              <select value={uf} onChange={(e) => setUf(e.target.value)} className="mt-1 w-full bg-transparent text-base font-semibold text-primary-foreground outline-none">
                {SITE_STATES.map((s) => <option key={s.uf} value={s.uf} className="text-foreground">{s.name}</option>)}
              </select>
            </label>
            <label className="rounded-xl border-primary-foreground/15 px-4 py-3 transition-colors focus-within:bg-primary-foreground/5 md:border-l">
              <span className="block text-[11px] font-bold uppercase text-accent">Cidade</span>
              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={loading || cities.length === 0} className="mt-1 w-full bg-transparent text-base font-semibold text-primary-foreground outline-none disabled:opacity-60">
                <option value="" className="text-foreground">{loading ? 'Carregando…' : 'Escolha uma cidade'}</option>
                {cities.map((c) => <option key={c.name} value={c.name} className="text-foreground">{c.name} ({c.total})</option>)}
              </select>
            </label>
            <Button onClick={goToCity} disabled={loading || cities.length === 0} className="h-full min-h-14 rounded-xl bg-accent px-7 font-bold text-accent-foreground hover:bg-accent/90"><Search /> Encontrar imóveis</Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-9 gap-y-3 text-sm font-semibold text-primary-foreground/80"><span>6 estados atendidos</span><span>Lista oficial da Caixa</span><span>Pré-análise personalizada</span></div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold uppercase text-primary">Explore por localização</p><h2 className="mt-2 text-3xl font-extrabold text-foreground">Oportunidades em {SITE_STATES.find((s) => s.uf === uf)?.name}</h2><p className="mt-2 text-muted-foreground">Escolha uma cidade para ver os imóveis disponíveis agora.</p></div>
          <div className="flex flex-wrap gap-2">{SITE_STATES.map((s) => <Button key={s.uf} onClick={() => setUf(s.uf)} variant={uf === s.uf ? 'default' : 'outline'} size="sm" className="rounded-full">{s.uf}</Button>)}</div>
        </div>
        <div className="mt-7 rounded-lg border border-border bg-card p-4 sm:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar cidade"
              className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Carregando cidades…</p>
          ) : cities.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Nenhum imóvel disponível agora nesse estado.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {cities.map((c) => (
                <button
                  key={c.name}
                  onClick={() => navigate(`/imoveis/${uf}/${encodeURIComponent(c.name)}`)}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <MapPin className="size-5 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.fin} aceitam financiamento</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-sm font-bold text-primary">{c.total}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-border bg-secondary py-16"><div className="max-w-7xl mx-auto px-4 sm:px-6"><div className="max-w-2xl"><p className="text-xs font-bold uppercase text-primary">Do interesse à proposta</p><h2 className="mt-2 text-3xl font-extrabold text-foreground">Um caminho simples e acompanhado</h2></div><div className="mt-9 grid gap-8 sm:grid-cols-3">
        {[
          { icon: ShieldCheck, t: 'Lista oficial da Caixa', d: 'Atualizamos todas as madrugadas. Imóvel vendido sai do site.' },
          { icon: FileCheck2, t: 'Pré-análise grátis', d: 'Envie seus dados e documentos pelo celular e receba o retorno da nossa equipe.' },
          { icon: MessageCircle, t: 'Corretor no WhatsApp', d: 'Tire dúvidas a qualquer momento com um corretor credenciado.' },
        ].map((b) => (
          <div key={b.t} className="border-l-2 border-accent pl-5">
            <b.icon className="size-6 text-primary" />
            <p className="mt-3 font-bold text-foreground">{b.t}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{b.d}</p>
          </div>
        ))}
      </div><Button asChild variant="outline" className="mt-10"><a href="/imoveis/perguntas-frequentes">Entenda como funciona <ArrowRight /></a></Button></div></section>
    </SiteLayout>
  );
}
