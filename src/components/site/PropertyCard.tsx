import { Link } from 'react-router-dom';
import { BedDouble, Car, Timer } from 'lucide-react';
import noPhoto from '@/assets/imagem-nao-fornecida.jpg';
import { SiteProperty, brl, countdownLabel, isNew, SITE_GREEN, SITE_GOLD } from '@/lib/vdhSite';

export function PropertyCard({ p }: { p: SiteProperty }) {
  const cd = countdownLabel(p.countdown_ends_at);
  const sold = p.status === 'sold';
  return (
    <Link
      to={`/imoveis/imovel/${p.code}`}
      className="group block rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[4/3] bg-slate-100">
        <img
          src={p.photo_url || noPhoto}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = noPhoto; }}
          alt={`${p.property_type} em ${p.neighborhood}`}
          loading="lazy"
          className="w-full h-full object-cover"
          style={sold ? { filter: 'grayscale(1)', opacity: 0.6 } : undefined}
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {sold ? (
            <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-slate-800 text-white">VENDIDO</span>
          ) : (
            <span className="text-[11px] font-bold px-2 py-1 rounded-full text-white" style={{ backgroundColor: p.accepts_financing ? '#22c55e' : '#f97316' }}>
              {p.accepts_financing ? 'Aceita financiamento' : 'Somente à vista'}
            </span>
          )}
          {!sold && isNew(p) && <span className="text-[11px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: SITE_GOLD, color: '#1f2937' }}>NOVO</span>}
          {!sold && cd && <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-red-600 text-white flex items-center gap-1"><Timer className="w-3 h-3" />Em disputa · {cd}</span>}
        </div>
        {p.discount > 0 && !sold && (
          <span className="absolute bottom-2 right-2 text-xs font-bold px-2 py-1 rounded-lg text-white" style={{ backgroundColor: SITE_GREEN }}>
            -{Math.round(p.discount)}%
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-slate-500 truncate">{p.property_type} · {p.neighborhood}</p>
        <p className="text-xl font-extrabold mt-1" style={{ color: SITE_GREEN }}>{brl(p.price)}</p>
        {p.evaluation > p.price && <p className="text-xs text-slate-400 line-through">{brl(p.evaluation)}</p>}
        <div className="flex gap-4 mt-2 text-xs text-slate-600">
          {p.bedrooms > 0 && <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" />{p.bedrooms} qto</span>}
          {p.garage_spaces > 0 && <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5" />{p.garage_spaces} vaga</span>}
          {p.area ? <span>{Math.round(p.area)} m²</span> : null}
        </div>
      </div>
    </Link>
  );
}
