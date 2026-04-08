/**
 * Design 2 — Médio/Alto Padrão
 * 10 criativos premium com linguagem sofisticada para tráfego pago
 */
import { TrafegoPropertyData } from '@/types/trafegoPago';
import logoAM from '@/assets/logo-apartamentos-manaus.svg';
import { useLogoBase64 } from '@/hooks/useLogoBase64';

const NAVY = '#0a1628';
const GOLD = '#C9A94E';
const BLUE = '#1B5EA6';
const CREAM = '#FAF8F5';
const font = "'Inter', 'Segoe UI', Arial, sans-serif";

const Logo = ({ width = 80, white = false }: { width?: number; white?: boolean }) => {
  const b64 = useLogoBase64(logoAM);
  return <img src={b64} alt="" width={width} style={{ display: 'block', ...(white ? { filter: 'brightness(0) invert(1)' } : {}) }} />;
};

const fmt = (v: number) => v > 0 ? `R$ ${v.toLocaleString('pt-BR')}` : '';
const W = 360;
const H = 360;

// ────────────────────────────────────────────
// 1. LIFESTYLE HERO — Elegante, aspiracional
// ────────────────────────────────────────────
export const Premium1 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => {
  const price = fmt(data.salePrice);
  return (
    <div style={{ position: 'relative', width: W, height: H, backgroundColor: NAVY, fontFamily: font, overflow: 'hidden' }}>
      {photo && <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,22,40,0.95) 0%, rgba(10,22,40,0.55) 40%, rgba(10,22,40,0.15) 70%, transparent 100%)', zIndex: 2 }} />

      {/* Gold accent line top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`, zIndex: 10 }} />

      {/* Logo */}
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '5px 8px' }}>
        <Logo width={65} />
      </div>

      {/* Badge */}
      <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, background: `linear-gradient(135deg, ${GOLD}, #D4AF37)`, borderRadius: 6, padding: '5px 12px' }}>
        <span style={{ fontSize: 8, fontWeight: 800, color: NAVY, letterSpacing: '0.08em', textTransform: 'uppercase' }}>✦ Exclusivo</span>
      </div>

      {/* Content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5, padding: '0 18px 16px' }}>
        <p style={{ color: GOLD, fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 4px' }}>
          {data.propertyType} • {data.neighborhood}
        </p>
        <p style={{ color: '#fff', fontSize: 20, fontWeight: 900, lineHeight: 1.1, margin: '0 0 8px' }}>
          {data.headline || data.title || 'Viva com sofisticação'}
        </p>

        {/* Specs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          {data.bedrooms > 0 && <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: 600 }}>{data.bedrooms} Quartos</span>}
          {data.bedrooms > 0 && data.area > 0 && <span style={{ color: GOLD, fontSize: 10 }}>•</span>}
          {data.area > 0 && <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: 600 }}>{data.area}m²</span>}
          {data.area > 0 && data.garageSpaces > 0 && <span style={{ color: GOLD, fontSize: 10 }}>•</span>}
          {data.garageSpaces > 0 && <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: 600 }}>{data.garageSpaces} Vagas</span>}
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(201,169,78,0.12)', border: `1px solid ${GOLD}44`, borderRadius: 10, padding: '10px 16px' }}>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8, display: 'block' }}>A partir de</span>
            <span style={{ color: '#fff', fontSize: 18, fontWeight: 900 }}>{price || 'Consulte'}</span>
          </div>
          <div style={{ background: GOLD, borderRadius: 8, padding: '7px 16px' }}>
            <span style={{ color: NAVY, fontSize: 10, fontWeight: 800 }}>CONHECER →</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────
// 2. EDITORIAL — Layout magazine-style
// ────────────────────────────────────────────
export const Premium2 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: W, height: H, backgroundColor: CREAM, fontFamily: font, overflow: 'hidden' }}>
    {/* Left: content */}
    <div style={{ position: 'absolute', left: 0, top: 0, width: 165, height: H, padding: '20px 14px 16px 18px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <Logo width={70} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ width: 30, height: 2, backgroundColor: GOLD, borderRadius: 1, marginBottom: 10 }} />
        <p style={{ color: '#6B7280', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>
          {data.propertyType}
        </p>
        <p style={{ color: NAVY, fontSize: 15, fontWeight: 900, lineHeight: 1.15, margin: '0 0 8px' }}>
          {data.title || 'Elegância em cada detalhe'}
        </p>
        <p style={{ color: '#9CA3AF', fontSize: 9, lineHeight: 1.4, margin: '0 0 10px' }}>
          {data.neighborhood}, {data.city}
        </p>
        {data.salePrice > 0 && (
          <div style={{ marginBottom: 10 }}>
            <span style={{ color: '#9CA3AF', fontSize: 7, display: 'block' }}>Investimento</span>
            <span style={{ color: NAVY, fontSize: 14, fontWeight: 900 }}>{fmt(data.salePrice)}</span>
          </div>
        )}
      </div>
      <div style={{ background: NAVY, borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
        <span style={{ color: GOLD, fontSize: 9, fontWeight: 800 }}>AGENDAR VISITA →</span>
      </div>
    </div>

    {/* Right: photo */}
    <div style={{ position: 'absolute', right: 0, top: 10, width: 190, height: H - 20, borderRadius: '12px 0 0 12px', overflow: 'hidden' }}>
      {photo ? <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', backgroundColor: '#ddd' }} />}
    </div>

    {/* Gold vertical line separator */}
    <div style={{ position: 'absolute', left: 163, top: 20, bottom: 20, width: 2, backgroundColor: GOLD, zIndex: 5 }} />
  </div>
);

// ────────────────────────────────────────────
// 3. SPECS PREMIUM — Dark + gold icons
// ────────────────────────────────────────────
export const Premium3 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => {
  const specs = [
    data.bedrooms > 0 ? { v: `${data.bedrooms}`, l: data.bedrooms > 1 ? 'Quartos' : 'Quarto' } : null,
    data.suites > 0 ? { v: `${data.suites}`, l: data.suites > 1 ? 'Suítes' : 'Suíte' } : null,
    data.area > 0 ? { v: `${data.area}`, l: 'm²' } : null,
    data.garageSpaces > 0 ? { v: `${data.garageSpaces}`, l: data.garageSpaces > 1 ? 'Vagas' : 'Vaga' } : null,
    data.bathrooms > 0 ? { v: `${data.bathrooms}`, l: data.bathrooms > 1 ? 'Banheiros' : 'Banheiro' } : null,
  ].filter(Boolean) as { v: string; l: string }[];

  return (
    <div style={{ position: 'relative', width: W, height: H, backgroundColor: NAVY, fontFamily: font, overflow: 'hidden' }}>
      {photo && <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, filter: 'blur(2px)' }} />}

      <div style={{ position: 'relative', zIndex: 2, padding: '20px 22px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <Logo width={75} white />
          <div style={{ background: `linear-gradient(135deg, ${GOLD}, #D4AF37)`, borderRadius: 6, padding: '4px 10px' }}>
            <span style={{ fontSize: 7, fontWeight: 800, color: NAVY }}>PREMIUM</span>
          </div>
        </div>

        <p style={{ color: GOLD, fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 4px' }}>Ficha Técnica</p>
        <p style={{ color: '#fff', fontSize: 16, fontWeight: 900, lineHeight: 1.15, margin: '0 0 16px' }}>
          {data.title || 'Detalhes do Imóvel'}
        </p>

        {/* Specs grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {specs.slice(0, 4).map((s, i) => (
            <div key={i} style={{ background: 'rgba(201,169,78,0.08)', border: `1px solid ${GOLD}33`, borderRadius: 10, padding: '10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: GOLD, fontSize: 22, fontWeight: 900, lineHeight: 1 }}>{s.v}</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: 600, marginTop: 2 }}>{s.l}</span>
            </div>
          ))}
        </div>

        <div style={{ background: `linear-gradient(135deg, ${GOLD}, #D4AF37)`, borderRadius: 10, padding: '10px', textAlign: 'center', marginTop: 12 }}>
          <span style={{ color: NAVY, fontSize: 11, fontWeight: 800 }}>SOLICITE MAIS INFORMAÇÕES →</span>
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────
// 4. GALERIA LUXO — Grid elegante
// ────────────────────────────────────────────
export const Premium4 = ({ data, photos }: { data: TrafegoPropertyData; photos: string[] }) => {
  const p = photos.slice(0, 4);
  return (
    <div style={{ position: 'relative', width: W, height: H, backgroundColor: NAVY, fontFamily: font, overflow: 'hidden' }}>
      {/* Top gold line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`, zIndex: 10 }} />

      {/* Grid */}
      <div style={{ position: 'absolute', inset: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 4 }}>
        {p.map((photo, i) => (
          <div key={i} style={{ borderRadius: 8, overflow: 'hidden', border: `1px solid ${GOLD}33` }}>
            <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </div>

      {/* Center badge */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, background: NAVY, borderRadius: 12, padding: '10px 18px', textAlign: 'center', border: `2px solid ${GOLD}`, boxShadow: `0 0 40px ${GOLD}22` }}>
        <p style={{ color: GOLD, fontSize: 7, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 2px' }}>{data.neighborhood}</p>
        <p style={{ color: '#fff', fontSize: 13, fontWeight: 900, margin: '0 0 2px' }}>{data.title || 'Ambientes'}</p>
        <div style={{ width: 24, height: 2, backgroundColor: GOLD, borderRadius: 1, margin: '0 auto' }} />
      </div>

      {/* Logo */}
      <div style={{ position: 'absolute', bottom: 14, right: 14, zIndex: 10, backgroundColor: 'rgba(10,22,40,0.9)', borderRadius: 8, padding: '5px 8px', border: `1px solid ${GOLD}33` }}>
        <Logo width={55} white />
      </div>
    </div>
  );
};

// ────────────────────────────────────────────
// 5. LIFESTYLE ASPIRACIONAL — Foto full + frase
// ────────────────────────────────────────────
export const Premium5 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: W, height: H, backgroundColor: NAVY, fontFamily: font, overflow: 'hidden' }}>
    {photo && <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,22,40,0.9) 0%, rgba(10,22,40,0.2) 60%, transparent 100%)', zIndex: 2 }} />

    {/* Logo top-right */}
    <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '5px 8px' }}>
      <Logo width={60} />
    </div>

    {/* Content bottom */}
    <div style={{ position: 'absolute', bottom: 16, left: 18, right: 18, zIndex: 5 }}>
      <div style={{ width: 30, height: 2, backgroundColor: GOLD, borderRadius: 1, marginBottom: 8 }} />
      <p style={{ color: '#fff', fontSize: 18, fontWeight: 900, lineHeight: 1.15, margin: '0 0 4px' }}>
        {data.headline || 'Viva o extraordinário'}
      </p>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9, margin: '0 0 10px' }}>
        {data.subheadline || `${data.propertyType} em ${data.neighborhood}, ${data.city}`}
      </p>
      <div style={{ display: 'inline-flex', background: `linear-gradient(135deg, ${GOLD}, #D4AF37)`, borderRadius: 8, padding: '7px 18px' }}>
        <span style={{ color: NAVY, fontSize: 10, fontWeight: 800 }}>{data.ctaText || 'CONHECER'} →</span>
      </div>
    </div>
  </div>
);

// ────────────────────────────────────────────
// 6. DIFERENCIAIS PREMIUM — Cards elegantes
// ────────────────────────────────────────────
export const Premium6 = ({ data }: { data: TrafegoPropertyData }) => {
  const items = data.highlights.length > 0 ? data.highlights : ['Design moderno', 'Acabamento premium', 'Localização privilegiada', 'Área de lazer completa'];
  return (
    <div style={{ position: 'relative', width: W, height: H, backgroundColor: CREAM, fontFamily: font, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, ${GOLD}, transparent)`, zIndex: 10 }} />

      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <Logo width={70} />
        </div>

        <p style={{ color: GOLD, fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 4px' }}>Diferenciais</p>
        <p style={{ color: NAVY, fontSize: 16, fontWeight: 900, lineHeight: 1.15, margin: '0 0 14px' }}>
          {data.title || 'O que faz a diferença'}
        </p>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {items.slice(0, 4).map((item, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 10, padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', border: `1px solid ${GOLD}22`, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${GOLD}22, ${GOLD}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                <span style={{ color: GOLD, fontSize: 13 }}>✦</span>
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, color: NAVY, lineHeight: 1.3 }}>{item}</span>
            </div>
          ))}
        </div>

        <div style={{ background: NAVY, borderRadius: 10, padding: '10px', textAlign: 'center', marginTop: 10 }}>
          <span style={{ color: GOLD, fontSize: 11, fontWeight: 800 }}>AGENDE UMA VISITA →</span>
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────
// 7. PREÇO EXCLUSIVO — Elegante, dark mode
// ────────────────────────────────────────────
export const Premium7 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: W, height: H, backgroundColor: NAVY, fontFamily: font, overflow: 'hidden' }}>
    {photo && <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.25) blur(1px)' }} />}

    <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 24, textAlign: 'center' }}>
      <Logo width={95} white />
      <div style={{ width: 40, height: 2, background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`, margin: '14px auto' }} />
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {data.propertyType} • {data.neighborhood}
      </p>
      <p style={{ color: '#fff', fontSize: 15, fontWeight: 800, margin: '0 0 14px' }}>{data.title || 'Investimento inteligente'}</p>

      <div style={{ background: `linear-gradient(135deg, ${GOLD}22, ${GOLD}11)`, border: `1px solid ${GOLD}55`, borderRadius: 14, padding: '14px 28px', marginBottom: 14, boxShadow: `0 0 40px ${GOLD}11` }}>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, display: 'block', marginBottom: 2 }}>Investimento a partir de</span>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 3 }}>
          <span style={{ color: GOLD, fontSize: 12, opacity: 0.8 }}>R$</span>
          <span style={{ color: '#fff', fontSize: 28, fontWeight: 900, lineHeight: 1 }}>{data.salePrice > 0 ? data.salePrice.toLocaleString('pt-BR') : 'Consulte'}</span>
        </div>
      </div>

      <div style={{ background: `linear-gradient(135deg, ${GOLD}, #D4AF37)`, borderRadius: 10, padding: '8px 28px' }}>
        <span style={{ color: NAVY, fontSize: 11, fontWeight: 800 }}>FALE COM CONSULTOR →</span>
      </div>
    </div>
  </div>
);

// ────────────────────────────────────────────
// 8. LOCALIZAÇÃO — Mapa-style com foto
// ────────────────────────────────────────────
export const Premium8 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: W, height: H, backgroundColor: '#fff', fontFamily: font, overflow: 'hidden' }}>
    {/* Full photo */}
    <div style={{ position: 'absolute', inset: 0 }}>
      {photo && <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
    </div>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,22,40,0.85) 0%, rgba(10,22,40,0.5) 50%, rgba(10,22,40,0.85) 100%)', zIndex: 2 }} />

    <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 24, textAlign: 'center' }}>
      <Logo width={80} white />

      {/* Location pin */}
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${GOLD}, #D4AF37)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '14px 0 10px', boxShadow: `0 0 30px ${GOLD}44` }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill={NAVY}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
      </div>

      <p style={{ color: GOLD, fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 4px' }}>Localização Privilegiada</p>
      <p style={{ color: '#fff', fontSize: 18, fontWeight: 900, lineHeight: 1.15, margin: '0 0 4px' }}>{data.neighborhood || 'Bairro Nobre'}</p>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, margin: '0 0 14px' }}>{data.city} • {data.state}</p>

      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9, lineHeight: 1.5, margin: '0 0 14px', maxWidth: 260 }}>
        {data.subheadline || 'Próximo a tudo que importa: escolas, shoppings, hospitais e vias de acesso.'}
      </p>

      <div style={{ background: `linear-gradient(135deg, ${GOLD}, #D4AF37)`, borderRadius: 8, padding: '8px 22px' }}>
        <span style={{ color: NAVY, fontSize: 10, fontWeight: 800 }}>VER NO MAPA →</span>
      </div>
    </div>
  </div>
);

// ────────────────────────────────────────────
// 9. INVESTMENT — Retorno / valorização
// ────────────────────────────────────────────
export const Premium9 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: W, height: H, backgroundColor: NAVY, fontFamily: font, overflow: 'hidden' }}>
    {photo && <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12 }} />}

    <div style={{ position: 'relative', zIndex: 2, padding: '20px 22px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <Logo width={75} white />
        <div style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}44`, borderRadius: 6, padding: '4px 10px' }}>
          <span style={{ fontSize: 7, fontWeight: 800, color: GOLD }}>INVESTIMENTO</span>
        </div>
      </div>

      <p style={{ color: '#fff', fontSize: 16, fontWeight: 900, lineHeight: 1.15, margin: '0 0 4px' }}>
        Invista em valorização real
      </p>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, margin: '0 0 16px' }}>
        {data.title} • {data.neighborhood}
      </p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1 }}>
        <div style={{ background: 'rgba(201,169,78,0.06)', border: `1px solid ${GOLD}22`, borderRadius: 10, padding: 12, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ color: GOLD, fontSize: 24, fontWeight: 900, lineHeight: 1 }}>📈</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 8, marginTop: 4 }}>Valorização</span>
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>Garantida</span>
        </div>
        <div style={{ background: 'rgba(201,169,78,0.06)', border: `1px solid ${GOLD}22`, borderRadius: 10, padding: 12, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ color: GOLD, fontSize: 24, fontWeight: 900, lineHeight: 1 }}>🏗️</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 8, marginTop: 4 }}>Região em</span>
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>Expansão</span>
        </div>
        <div style={{ background: 'rgba(201,169,78,0.06)', border: `1px solid ${GOLD}22`, borderRadius: 10, padding: 12, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ color: GOLD, fontSize: 24, fontWeight: 900, lineHeight: 1 }}>🔒</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 8, marginTop: 4 }}>Segurança</span>
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>Patrimonial</span>
        </div>
        <div style={{ background: 'rgba(201,169,78,0.06)', border: `1px solid ${GOLD}22`, borderRadius: 10, padding: 12, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ color: GOLD, fontSize: 24, fontWeight: 900, lineHeight: 1 }}>💰</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 8, marginTop: 4 }}>Renda com</span>
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>Aluguel</span>
        </div>
      </div>

      <div style={{ background: `linear-gradient(135deg, ${GOLD}, #D4AF37)`, borderRadius: 10, padding: '10px', textAlign: 'center', marginTop: 12 }}>
        <span style={{ color: NAVY, fontSize: 11, fontWeight: 800 }}>SAIBA MAIS SOBRE O INVESTIMENTO →</span>
      </div>
    </div>
  </div>
);

// ────────────────────────────────────────────
// 10. CTA PREMIUM — Contato elegante
// ────────────────────────────────────────────
export const Premium10 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: W, height: H, fontFamily: font, overflow: 'hidden' }}>
    {/* Top photo */}
    <div style={{ position: 'absolute', top: 0, left: 0, width: W, height: 150 }}>
      {photo && <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: `linear-gradient(to top, ${NAVY}, transparent)` }} />
    </div>

    {/* Gold line */}
    <div style={{ position: 'absolute', top: 148, left: 20, right: 20, height: 2, background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`, zIndex: 10 }} />

    {/* Bottom */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 230, backgroundColor: NAVY, padding: '22px 22px 14px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Logo width={90} white />
      <p style={{ color: '#fff', fontSize: 14, fontWeight: 800, textAlign: 'center', margin: '10px 0 4px' }}>
        Atendimento personalizado
      </p>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, textAlign: 'center', margin: '0 0 12px' }}>
        {data.title} • {data.neighborhood}
      </p>

      {data.brokerName && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, background: `rgba(201,169,78,0.08)`, border: `1px solid ${GOLD}33`, borderRadius: 8, padding: '6px 14px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${GOLD}, #D4AF37)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={NAVY}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
          </div>
          <div>
            <p style={{ color: '#fff', fontSize: 10, fontWeight: 700, margin: 0 }}>{data.brokerName}</p>
            {data.brokerPhone && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8, margin: 0 }}>{data.brokerPhone}</p>}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, width: '100%' }}>
        <div style={{ flex: 1, background: '#25D366', borderRadius: 8, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
          <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>WhatsApp</span>
        </div>
        <div style={{ flex: 1, background: `linear-gradient(135deg, ${GOLD}, #D4AF37)`, borderRadius: 8, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill={NAVY}><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
          <span style={{ color: NAVY, fontSize: 10, fontWeight: 700 }}>Ligar</span>
        </div>
      </div>

      {data.creci && <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 6.5, marginTop: 6 }}>CRECI: {data.creci}</span>}
    </div>
  </div>
);
