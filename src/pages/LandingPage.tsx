import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  MapPin, Bed, Bath, Maximize, Car, Star, MessageCircle,
  Phone, ChevronLeft, ChevronRight, Loader2, Home as HomeIcon, Sparkles,
} from 'lucide-react';

interface LandingRow {
  id: string;
  slug: string;
  code: string;
  data: any;
  photos: string[];
  copy: {
    heroHeadline?: string;
    heroSubtitle?: string;
    description?: string;
    benefits?: string[];
    ctaText?: string;
  };
  sections: string[];
  accent_color: string;
  whatsapp_message?: string;
  broker: { name?: string; phone?: string; creci?: string; photo?: string };
}

interface NearbyResp {
  location: { lat: number; lng: number } | null;
  categories: { key: string; label: string; icon: string; items: { name: string; vicinity: string; rating: number | null }[] }[];
}

const formatBRL = (n: number) =>
  n?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }) || 'Consulte';

export default function LandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [row, setRow] = useState<LandingRow | null>(null);
  const [nearby, setNearby] = useState<NearbyResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);

  useEffect(() => {
    if (!slug) return;
    // Ensure landing page always renders in light theme (even when embedded in editor iframe)
    document.documentElement.classList.remove('dark');
    document.documentElement.style.background = '#ffffff';
    document.body.style.background = '#ffffff';
    (async () => {
      const { data, error } = await supabase
        .from('am_landing_pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();
      if (error || !data) { setNotFound(true); setLoading(false); return; }
      setRow(data as any);
      setLoading(false);

      // Track view (fire-and-forget)
      supabase.rpc('increment_landing_metric' as any, { _slug: slug, _metric: 'view' }).then(() => {});

      // Fetch nearby places
      const d: any = data.data || {};
      const address = [d.address, d.neighborhood, d.city, d.state].filter(Boolean).join(', ');
      if (address) {
        supabase.functions.invoke('nearby-places', { body: { address } })
          .then(({ data: n }) => n && setNearby(n as any))
          .catch(() => {});
      }
    })();
  }, [slug]);

  // SEO title
  useEffect(() => {
    if (row) {
      const t = `${row.copy?.heroHeadline || row.data?.propertyName || 'Imóvel'} — ${row.data?.neighborhood || ''}`.trim();
      document.title = t.slice(0, 60);
      const desc = row.copy?.description?.slice(0, 155) || `${row.data?.bedrooms || ''} quartos em ${row.data?.neighborhood || row.data?.city || 'Manaus'}. Fale com o corretor.`;
      let m = document.querySelector('meta[name="description"]');
      if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
      m.setAttribute('content', desc);
    }
  }, [row]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
    </div>
  );
  if (notFound || !row) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <HomeIcon className="w-12 h-12 text-slate-300 mb-4" />
      <h1 className="text-2xl font-bold text-slate-800">Imóvel não encontrado</h1>
      <p className="text-slate-500 mt-2">Esta landing page não está mais disponível.</p>
    </div>
  );

  const { data, photos, copy, broker, accent_color: accent } = row;
  const heroPhoto = photos?.[photoIdx] || photos?.[0];
  const isRental = data?.isRental;
  const price = isRental ? data?.rentalPrice : data?.salePrice;
  const address = [data?.address, data?.neighborhood, data?.city, data?.state].filter(Boolean).join(', ');

  const whatsappMsg = row.whatsapp_message || `Olá ${broker?.name || ''}! Tenho interesse no imóvel ${data?.propertyName || ''} (cód. ${row.code}). Poderia me passar mais informações?`;
  const waPhone = (broker?.phone || '').replace(/\D/g, '');
  const waUrl = `https://wa.me/55${waPhone}?text=${encodeURIComponent(whatsappMsg)}`;

  const trackWhats = () => {
    supabase.rpc('increment_landing_metric' as any, { _slug: slug!, _metric: 'whatsapp' }).then(() => {});
  };

  const mapSrc = address
    ? `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
    : null;

  return (
    <div className="min-h-screen bg-white pb-24" style={{ fontFamily: 'Golos Text, system-ui, sans-serif' }}>
      {/* HERO */}
      <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden bg-slate-900">
        {heroPhoto && (
          <img src={heroPhoto} alt={data?.propertyName} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
        <div className="relative z-10 h-full flex flex-col justify-end px-6 sm:px-10 lg:px-16 pb-16 max-w-6xl mx-auto text-white">
          {data?.propertyName && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-semibold uppercase tracking-wider w-fit mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              {data.propertyType || 'Imóvel'} • Cód. {row.code}
            </div>
          )}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight mb-4 drop-shadow-lg">
            {copy?.heroHeadline || data?.propertyName || 'Seu novo lar'}
          </h1>
          {(copy?.heroSubtitle || data?.neighborhood) && (
            <p className="text-lg sm:text-2xl text-white/90 mb-6 max-w-3xl">
              {copy?.heroSubtitle || `${data?.neighborhood}, ${data?.city}`}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="px-5 py-3 rounded-2xl bg-white text-slate-900 shadow-xl">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{isRental ? 'Aluguel' : 'Venda a partir de'}</div>
              <div className="text-2xl sm:text-3xl font-black" style={{ color: accent }}>{formatBRL(price)}{isRental && '/mês'}</div>
            </div>
            <a
              href={waUrl} target="_blank" rel="noopener noreferrer" onClick={trackWhats}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20b859] text-white font-bold shadow-xl transition-transform hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              Falar com corretor
            </a>
          </div>
        </div>
      </section>

      {/* SPECS */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 -mt-10 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 bg-white rounded-3xl shadow-2xl p-4 sm:p-6 border border-slate-100">
          {[
            { icon: Bed, label: 'Quartos', val: data?.bedrooms || '—' },
            { icon: Bath, label: 'Banheiros', val: data?.bathrooms || '—' },
            { icon: Maximize, label: 'Área', val: data?.area ? `${data.area} m²` : '—' },
            { icon: Car, label: 'Vagas', val: data?.garageSpaces || '—' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center p-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2" style={{ backgroundColor: `${accent}15`, color: accent }}>
                <s.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-black text-slate-900">{s.val}</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GALERIA */}
      {photos && photos.length > 1 && (
        <section className="max-w-6xl mx-auto px-6 sm:px-10 mt-16">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6">Galeria</h2>
          <div className="relative rounded-3xl overflow-hidden bg-slate-100 aspect-[4/3] sm:aspect-[16/9]">
            <img src={photos[photoIdx]} alt={`Foto ${photoIdx + 1}`} className="w-full h-full object-cover" />
            <button onClick={() => setPhotoIdx((i) => (i - 1 + photos.length) % photos.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white">
              <ChevronLeft className="w-6 h-6 text-slate-800" />
            </button>
            <button onClick={() => setPhotoIdx((i) => (i + 1) % photos.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white">
              <ChevronRight className="w-6 h-6 text-slate-800" />
            </button>
            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-semibold">
              {photoIdx + 1} / {photos.length}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-4 sm:grid-cols-8 gap-2">
            {photos.slice(0, 8).map((p, i) => (
              <button key={i} onClick={() => setPhotoIdx(i)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition ${i === photoIdx ? 'ring-2 ring-offset-2' : 'border-transparent opacity-60 hover:opacity-100'}`}
                style={i === photoIdx ? { borderColor: accent, boxShadow: `0 0 0 2px ${accent}` } : {}}>
                <img src={p} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* DESCRIÇÃO EMOCIONAL */}
      {copy?.description && (
        <section className="max-w-4xl mx-auto px-6 sm:px-10 mt-16">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6">Sobre este imóvel</h2>
          <div className="text-lg sm:text-xl text-slate-700 leading-relaxed whitespace-pre-line">
            {copy.description}
          </div>
        </section>
      )}

      {/* DIFERENCIAIS */}
      {copy?.benefits && copy.benefits.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 sm:px-10 mt-16">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6">Por que morar aqui</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {copy.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accent}20`, color: accent }}>
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-slate-800 pt-1.5 font-medium">{b}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LOCALIZAÇÃO */}
      {mapSrc && (
        <section className="max-w-6xl mx-auto px-6 sm:px-10 mt-16">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">Localização</h2>
          <p className="text-slate-600 flex items-center gap-2 mb-6"><MapPin className="w-4 h-4" style={{ color: accent }} />{address}</p>
          <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-100 aspect-[16/10]">
            <iframe src={mapSrc} className="w-full h-full border-0" loading="lazy" title="Mapa" />
          </div>

          {nearby && nearby.categories.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">O que tem por perto</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearby.categories.map((cat) => (
                  <div key={cat.key} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 font-bold text-slate-800">
                      <span className="text-xl">{cat.icon}</span>{cat.label}
                    </div>
                    <ul className="space-y-1.5 text-sm text-slate-600">
                      {cat.items.map((it, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: accent }} />
                          <span>{it.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* CORRETOR + CTA */}
      <section className="max-w-4xl mx-auto px-6 sm:px-10 mt-16">
        <div className="rounded-3xl p-8 sm:p-10 text-white shadow-2xl" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-3xl font-black">
              {broker?.photo
                ? <img src={broker.photo} alt={broker.name} className="w-full h-full rounded-full object-cover" />
                : (broker?.name?.[0] || 'C')}
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="text-xs uppercase tracking-wider opacity-80 mb-1">Corretor responsável</div>
              <div className="text-2xl font-black">{broker?.name || 'Corretor'}</div>
              {broker?.creci && <div className="text-sm opacity-90">{broker.creci}</div>}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-6">
            <a href={waUrl} target="_blank" rel="noopener noreferrer" onClick={trackWhats}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white text-slate-900 font-bold hover:bg-white/95">
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              {copy?.ctaText || 'Falar no WhatsApp'}
            </a>
            {broker?.phone && (
              <a href={`tel:${waPhone}`} className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/15 text-white font-bold hover:bg-white/25 backdrop-blur">
                <Phone className="w-5 h-5" />
                {broker.phone}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Sticky WhatsApp button (mobile) */}
      <a href={waUrl} target="_blank" rel="noopener noreferrer" onClick={trackWhats}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-4 rounded-full bg-[#25D366] text-white font-bold shadow-2xl hover:scale-105 transition-transform">
        <MessageCircle className="w-6 h-6" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
    </div>
  );
}