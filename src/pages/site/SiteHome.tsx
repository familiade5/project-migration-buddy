import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, ShieldCheck, FileCheck2, MessageCircle } from 'lucide-react';
import { SiteLayout } from '@/components/site/SiteLayout';
import { SITE_STATES, SITE_GREEN, SITE_GREEN_DARK, SITE_GOLD, fetchAll, siteTable } from '@/lib/vdhSite';

export default function SiteHome() {
  const navigate = useNavigate();
  const [uf, setUf] = useState('CE');
  const [rows, setRows] = useState<{ city: string; accepts_financing: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

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

  return (
    <SiteLayout description="Imóveis da Caixa com até 90% de desconto, atualizados todos os dias. Veja os que aceitam financiamento e faça sua pré-análise de crédito.">
      <section style={{ background: `linear-gradient(160deg, ${SITE_GREEN} 0%, ${SITE_GREEN_DARK} 100%)` }}>
        <div className="max-w-6xl mx-auto px-4 pt-12 pb-16 text-white">
          <p className="text-sm font-semibold tracking-wide" style={{ color: SITE_GOLD }}>IMÓVEIS CAIXA · ATUALIZADOS HOJE</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold mt-2 max-w-2xl leading-tight">Onde você quer morar?</h1>
          <p className="mt-3 max-w-xl" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Escolha o estado e a cidade. Mostramos só imóveis que estão à venda na Caixa hoje, com pré-análise personalizada para os que aceitam financiamento.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {SITE_STATES.map((s) => (
              <button
                key={s.uf}
                onClick={() => setUf(s.uf)}
                className="px-4 py-2 rounded-full text-sm font-semibold border transition-colors"
                style={uf === s.uf
                  ? { backgroundColor: SITE_GOLD, color: SITE_GREEN_DARK, borderColor: SITE_GOLD }
                  : { backgroundColor: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar cidade"
              className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-slate-400"
            />
          </div>
          {loading ? (
            <p className="text-slate-500 text-sm py-8 text-center">Carregando cidades…</p>
          ) : cities.length === 0 ? (
            <p className="text-slate-500 text-sm py-8 text-center">Nenhum imóvel disponível agora nesse estado.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {cities.map((c) => (
                <button
                  key={c.name}
                  onClick={() => navigate(`/imoveis/${uf}/${encodeURIComponent(c.name)}`)}
                  className="flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-white text-left hover:border-slate-400 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <MapPin className="w-5 h-5 shrink-0" style={{ color: SITE_GREEN }} />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.fin} aceitam financiamento</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: '#e8f3ec', color: SITE_GREEN }}>{c.total}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-12 grid sm:grid-cols-3 gap-4">
        {[
          { icon: ShieldCheck, t: 'Lista oficial da Caixa', d: 'Atualizamos todas as madrugadas. Imóvel vendido sai do site.' },
          { icon: FileCheck2, t: 'Pré-análise grátis', d: 'Envie seus dados e documentos pelo celular e receba o retorno da nossa equipe.' },
          { icon: MessageCircle, t: 'Corretor no WhatsApp', d: 'Tire dúvidas a qualquer momento com um corretor credenciado.' },
        ].map((b) => (
          <div key={b.t} className="p-5 rounded-2xl border border-slate-200 bg-white">
            <b.icon className="w-6 h-6" style={{ color: SITE_GREEN }} />
            <p className="font-bold mt-3 text-slate-900">{b.t}</p>
            <p className="text-sm text-slate-600 mt-1">{b.d}</p>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
