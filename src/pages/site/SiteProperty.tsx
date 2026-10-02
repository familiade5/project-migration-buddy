import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BedDouble, Car, Ruler, MapPin, Timer, MessageCircle, FileCheck2, Download, BadgePercent } from 'lucide-react';
import noPhoto from '@/assets/imagem-nao-fornecida.jpg';
import { SiteLayout } from '@/components/site/SiteLayout';
import { SiteProperty as P, SITE_GREEN, SITE_GOLD, SITE_GREEN_DARK, brl, countdownLabel, formatDescription, hasFivePercentEntry, matriculaUrl, minimumEntry, siteTable, stateName, whatsappLink } from '@/lib/vdhSite';

export default function SiteProperty() {
  const { code = '' } = useParams();
  const [p, setP] = useState<P | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    siteTable().select('*').eq('code', code).maybeSingle()
      .then(({ data }: any) => { if (active) setP(data || null); })
      .catch(() => { if (active) setP(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [code]);

  if (loading) return <SiteLayout><p className="text-center text-slate-500 py-24">Carregando…</p></SiteLayout>;
  if (!p) return (
    <SiteLayout title="Imóvel indisponível">
      <div className="max-w-xl mx-auto text-center py-24 px-4">
        <h1 className="text-2xl font-bold text-slate-900">Este imóvel não está mais disponível</h1>
        <p className="text-slate-500 mt-2">Ele saiu da lista da Caixa. Veja outros imóveis na mesma região.</p>
        <Link to="/imoveis" className="inline-block mt-6 px-5 py-3 rounded-xl font-semibold text-white" style={{ backgroundColor: SITE_GREEN }}>Ver imóveis disponíveis</Link>
      </div>
    </SiteLayout>
  );

  const cd = countdownLabel(p.countdown_ends_at);
  const sold = p.status === 'sold';
  const fivePercentEntry = minimumEntry(p);

  return (
    <SiteLayout
      title={`${p.property_type} em ${p.neighborhood}, ${p.city}`}
      description={`${p.property_type} Caixa em ${p.neighborhood}, ${p.city}/${p.uf} por ${brl(p.price)}${p.discount ? ` (${Math.round(p.discount)}% de desconto)` : ''}.`}
      whatsapp={whatsappLink(p)}
    >
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link to={`/imoveis/${p.uf}/${encodeURIComponent(p.city)}`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" /> Imóveis em {p.city}
        </Link>
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 mt-4">
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3]">
              <img src={p.photo_url || noPhoto} onError={(e) => { (e.currentTarget as HTMLImageElement).src = noPhoto; }} alt={p.property_type || 'Imóvel'} className="w-full h-full object-cover" />
              {sold && <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(15,23,42,0.6)' }}><span className="text-white text-2xl font-extrabold">VENDIDO</span></div>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-5 text-slate-900">{p.property_type} · {p.neighborhood}</h1>
            <p className="flex items-start gap-1.5 text-slate-600 mt-1"><MapPin className="w-4 h-4 mt-0.5 shrink-0" />{p.address} – {p.city}/{p.uf}</p>
            <div className="flex flex-wrap gap-3 mt-4">
              {p.bedrooms > 0 && <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm"><BedDouble className="w-4 h-4" />{p.bedrooms} quarto(s)</span>}
              {p.garage_spaces > 0 && <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm"><Car className="w-4 h-4" />{p.garage_spaces} vaga(s)</span>}
              {p.area ? <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm"><Ruler className="w-4 h-4" />{Math.round(p.area)} m²</span> : null}
            </div>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-bold text-slate-900 mb-2">Descrição completa do imóvel</h2>
              <div className="text-slate-700 text-sm whitespace-pre-line leading-relaxed">
                {formatDescription(p)}
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="font-bold text-slate-900">Documentos oficiais</h2>
              <p className="text-sm text-slate-600 mt-1">Consulte a matrícula disponibilizada pela Caixa para este imóvel.</p>
              <a href={matriculaUrl(p)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-3 px-4 h-11 rounded-xl font-semibold text-white" style={{ backgroundColor: SITE_GREEN }}>
                <Download className="w-4 h-4" /> Baixar matrícula oficial
              </a>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-20 self-start">
            <div className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-bold px-2 py-1 rounded-full text-white" style={{ backgroundColor: p.accepts_financing ? '#22c55e' : '#f97316' }}>
                  {p.accepts_financing ? 'Aceita financiamento' : 'Somente à vista'}
                </span>
                {cd && !sold && <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-600 text-white flex items-center gap-1"><Timer className="w-3 h-3" />Em disputa · faltam {cd}</span>}
              </div>
              {p.evaluation > p.price && <p className="text-sm text-slate-400 line-through mt-3">Avaliado em {brl(p.evaluation)}</p>}
              <p className="text-4xl font-extrabold mt-1" style={{ color: SITE_GREEN }}>{brl(p.price)}</p>
              {p.discount > 0 && <p className="text-sm font-semibold mt-1" style={{ color: SITE_GREEN_DARK }}>{Math.round(p.discount)}% abaixo da avaliação</p>}
              {fivePercentEntry !== null && (
                <div className="flex items-start gap-2 mt-4 rounded-xl p-3" style={{ backgroundColor: '#e8f3ec', color: SITE_GREEN_DARK }}>
                  <BadgePercent className="w-5 h-5 shrink-0 mt-0.5" />
                  <div><p className="font-bold text-sm">Entrada a partir de 5%</p><p className="text-xs mt-0.5">A partir de {brl(fivePercentEntry)}, sujeita à análise e ao edital.</p></div>
                </div>
              )}

              {!sold && (
                <div className="mt-5 space-y-2">
                  {p.accepts_financing && (
                    <Link to={`/imoveis/imovel/${p.code}/simular`} className="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-bold text-white" style={{ backgroundColor: SITE_GREEN }}>
                      <FileCheck2 className="w-5 h-5" /> Quero saber se aprovo
                    </Link>
                  )}
                  <a href={whatsappLink(p)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-bold" style={{ backgroundColor: '#25D366', color: '#fff' }}>
                    <MessageCircle className="w-5 h-5" /> Falar com corretor
                  </a>
                </div>
              )}
            </div>

            {p.accepts_financing && !sold && (
              <div className="rounded-2xl p-5" style={{ backgroundColor: '#f2f8f4', border: '1px solid #cfe5d7' }}>
                <p className="font-bold text-slate-900">Pré-análise personalizada</p>
                <p className="text-sm text-slate-600 mt-2">Entrada, prazo e parcela variam conforme o imóvel, a modalidade, sua renda, FGTS, subsídio e análise da Caixa.</p>
                {hasFivePercentEntry(p) && <p className="text-sm font-semibold mt-2" style={{ color: SITE_GREEN_DARK }}>Este imóvel permite entrada a partir de 5%, conforme análise e edital.</p>}
                <p className="text-xs text-slate-500 mt-2">Por isso, não mostramos uma parcela genérica. Envie seus dados e nossa equipe calcula o cenário correto.</p>
                <Link to={`/imoveis/imovel/${p.code}/simular`} className="flex items-center justify-center gap-2 w-full h-11 rounded-xl font-bold text-white mt-4" style={{ backgroundColor: SITE_GREEN }}><FileCheck2 className="w-4 h-4" /> Solicitar pré-análise</Link>
              </div>
            )}
            <p className="text-[11px] text-slate-400 px-1">Valores conforme a lista oficial da Caixa de {stateName(p.uf)}. <span style={{ color: SITE_GOLD }}>●</span> Atualizado diariamente.</p>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
