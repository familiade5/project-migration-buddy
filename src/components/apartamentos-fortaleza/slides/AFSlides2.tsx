import { AFPropertyData } from '@/types/apartamentosFortaleza';
import logoAF from '@/assets/logo-apartamentos-fortaleza.png';
import { useLogoBase64 } from '@/hooks/useLogoBase64';

const GOLD_GRADIENT_ID = 'af2-gold-grad';
const DARK_CARD = '#30323A';
const golos = "'Golos Text', Arial, sans-serif";
const poppins = "'Poppins', Arial, sans-serif";

// ─── Shared SVG gradient definition ──────────────────────────────────────────
const GoldGradientDef = () => (
  <defs>
    <linearGradient id={GOLD_GRADIENT_ID} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#E8A020" />
      <stop offset="40%" stopColor="#F2B84B" />
      <stop offset="70%" stopColor="#D4912A" />
      <stop offset="100%" stopColor="#C07B18" />
    </linearGradient>
  </defs>
);

const GOLD_URL = `url(#${GOLD_GRADIENT_ID})`;

// ─── Helper: Logo ────────────────────────────────────────────────────────────
const AFLogo2 = ({ width = 100 }: { width?: number }) => {
  const base64 = useLogoBase64(logoAF);
  return <img src={base64} alt="AF" width={width} style={{ display: 'block' }} />;
};

// ─── Helper: Golden accent line ──────────────────────────────────────────────
const AccentLine = ({ top }: { top: string | number }) => (
  <svg style={{ position: 'absolute', left: 0, right: 0, top, width: '100%', height: 12, zIndex: 20 }}>
    <defs>
      <linearGradient id="accent-line-grad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#C07B18" />
        <stop offset="30%" stopColor="#F2B84B" />
        <stop offset="60%" stopColor="#E8A020" />
        <stop offset="100%" stopColor="#D4912A" />
      </linearGradient>
      <filter id="accent-line-shadow">
        <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.45" />
      </filter>
    </defs>
    <rect width="100%" height="5" fill="url(#accent-line-grad)" filter="url(#accent-line-shadow)" />
  </svg>
);

// ─── Spec Icons (more refined, with gradient) ────────────────────────────────
const BedIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <GoldGradientDef />
    <path d="M3 21V13a1 1 0 011-1h16a1 1 0 011 1v8" stroke={GOLD_URL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 14V7a2 2 0 012-2h14a2 2 0 012 2v7" stroke={GOLD_URL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 12V9.5A1.5 1.5 0 019.5 8h0A1.5 1.5 0 0111 9.5V12M13 12V9.5A1.5 1.5 0 0114.5 8h0A1.5 1.5 0 0116 9.5V12" stroke={GOLD_URL} strokeWidth="1.3" strokeLinecap="round" />
    <line x1="3" y1="17" x2="21" y2="17" stroke={GOLD_URL} strokeWidth="1" opacity="0.3" />
  </svg>
);

const CarIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <GoldGradientDef />
    <path d="M5 17h14a2 2 0 002-2v-2a2 2 0 00-1.1-1.79L17 9.5l-1.5-4A1 1 0 0014.56 5H9.44a1 1 0 00-.94.55L7 9.5 4.1 11.21A2 2 0 003 13v2a2 2 0 002 2z" stroke={GOLD_URL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7.5" cy="17" r="1.5" stroke={GOLD_URL} strokeWidth="1.3" fill="none" />
    <circle cx="16.5" cy="17" r="1.5" stroke={GOLD_URL} strokeWidth="1.3" fill="none" />
    <line x1="7" y1="9.5" x2="17" y2="9.5" stroke={GOLD_URL} strokeWidth="1" opacity="0.35" />
  </svg>
);

const GrillIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <GoldGradientDef />
    <path d="M12 12a6 6 0 006-6H6a6 6 0 006 6z" stroke={GOLD_URL} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 12v4M8 20h8M10 16h4" stroke={GOLD_URL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 3v1.5M12 2v2.5M15 3v1.5" stroke={GOLD_URL} strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const BathIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <GoldGradientDef />
    <path d="M4 12h16" stroke={GOLD_URL} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 12v4a4 4 0 004 4h8a4 4 0 004-4v-4" stroke={GOLD_URL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 12V5a2 2 0 012-2h1" stroke={GOLD_URL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="10" cy="7" r="0.7" fill={GOLD_URL} />
  </svg>
);

const PoolIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <GoldGradientDef />
    <path d="M2 15c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" stroke={GOLD_URL} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M2 19c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" stroke={GOLD_URL} strokeWidth="1.5" strokeLinecap="round" />
    <rect x="8" y="4" width="2.5" height="11" rx="1.25" stroke={GOLD_URL} strokeWidth="1.2" />
    <rect x="13.5" y="4" width="2.5" height="11" rx="1.25" stroke={GOLD_URL} strokeWidth="1.2" />
    <line x1="10.5" y1="7" x2="13.5" y2="7" stroke={GOLD_URL} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// ─── Icon selector based on leisure keyword ──────────────────────────────────
const getLeisureIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes('churrasq') || l.includes('grill') || l.includes('bbq')) return <GrillIcon />;
  if (l.includes('banheir') || l.includes('banheira') || l.includes('wc')) return <BathIcon />;
  if (l.includes('piscina') || l.includes('pool')) return <PoolIcon />;
  return <GrillIcon />;
};

// ─── Formatação de preço ─────────────────────────────────────────────────────
const formatPrice = (v: number) => {
  if (v >= 1000000) return `R$ ${(v / 1000000).toFixed(v % 1000000 === 0 ? 0 : 1).replace('.', ',')} MI`;
  if (v >= 1000) return `R$ ${(v / 1000).toFixed(0)} MIL`;
  return `R$ ${v.toLocaleString('pt-BR')}`;
};

const formatPriceFull = (v: number) =>
  `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 1: CAPA — reconstruído para ficar muito mais fiel ao modelo anexado
// ═══════════════════════════════════════════════════════════════════════════════
export const AF2CoverSlide = ({ data, photos }: { data: AFPropertyData; photos: string[] }) => {
  const logoBase64 = useLogoBase64(logoAF);
  const photo = photos[0];
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const formattedPrice = price > 0
    ? price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : 'Consulte';
  const photoH = 206;

  const title = (data.title || 'SEU IMÓVEL').toUpperCase();
  const neighborhood = (data.neighborhood || 'BAIRRO').toUpperCase();
  const bedroomsLabel = data.suites > 0
    ? `${data.suites} SUÍTE${data.suites > 1 ? 'S' : ''}`
    : `${data.bedrooms || 0} QUARTO${(data.bedrooms || 0) !== 1 ? 'S' : ''}`;
  const garageLabel = `${data.garageSpaces || 0} VAGA${(data.garageSpaces || 0) !== 1 ? 'S' : ''} DE GARAGEM`;
  const leisureLabel = ((data.leisureItems || '').split(/[,\n]/).map(item => item.trim()).filter(Boolean)[0] || 'CHURRASQUEIRA').toUpperCase();

  const specLabelStyle: React.CSSProperties = {
    color: '#F7F7F4',
    fontSize: 8.5,
    lineHeight: 1.15,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    fontWeight: 500,
    textAlign: 'center',
    margin: 0,
  };

  const GOLD_CSS = 'linear-gradient(135deg, #E8A020, #F2B84B, #D4912A, #C07B18)';
  const titleFont = poppins;

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: '#ffffff', fontFamily: poppins, overflow: 'hidden' }}>
      {photo ? (
        <img src={photo} alt="" style={{ position: 'absolute', top: 0, left: 0, width: 360, height: photoH, objectFit: 'cover' }} />
      ) : (
        <div style={{ position: 'absolute', top: 0, left: 0, width: 360, height: photoH, background: 'linear-gradient(180deg, #d8dadf 0%, #cfd2d8 100%)' }} />
      )}

      <AccentLine top={photoH - 1} />

      {/* White panel with top shadow for 3D/depth effect on golden line and price badge */}
      <div style={{
        position: 'absolute', left: 0, top: photoH + 4, width: 360, height: 156, zIndex: 5,
        boxShadow: 'inset 0 6px 8px -4px rgba(0,0,0,0.18)',
        background: '#f8f7f3',
      }}>
        {/* Subtle diagonal geometric shapes */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 360 156" preserveAspectRatio="none">
          <polygon points="108,0 206,0 136,46 40,46" fill="rgba(255,255,255,0.85)" />
          <polygon points="150,0 304,0 206,78 54,78" fill="rgba(255,255,255,0.52)" />
          <polygon points="204,0 360,0 256,94 102,94" fill="rgba(255,255,255,0.30)" />
          <polygon points="232,48 360,48 360,156 314,156" fill="rgba(255,255,255,0.16)" />
        </svg>
      </div>

      {/* AF logo icon as watermark - show only the AF symbol (left part of logo), hide text */}
      <div style={{
        position: 'absolute', left: '50%', top: photoH + 2, transform: 'translateX(-50%)',
        zIndex: 6, pointerEvents: 'none', userSelect: 'none',
        width: 360, height: 156, display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Move image RIGHT so the AF symbol (left side of logo) stays centered, text goes off-screen right */}
        <img src={logoBase64} alt="" style={{ width: 700, marginRight: -420, display: 'block', filter: 'grayscale(100%) brightness(1.9) contrast(0.25)', opacity: 0.4 }} />
      </div>

      {/* Price badge - taller, flush left, no rounding on left side */}
      <div style={{
        position: 'absolute', left: -3, top: 168, width: 200, height: 54, zIndex: 30,
        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.35))',
      }}>
        <svg viewBox="0 0 200 54" width="200" height="54" style={{ display: 'block', overflow: 'visible' }}>
          <path d="M0 2 H160 Q166 2 166 8 L144 46 Q140 52 134 52 H0 V2 Z" fill={DARK_CARD} stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 16px 0 10px', gap: 2 }}>
          <span style={{ background: GOLD_CSS, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 11, fontWeight: 800, lineHeight: 1 }}>R$</span>
          <span style={{ background: GOLD_CSS, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 20, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em', transform: 'scaleY(1.4)', display: 'inline-block' }}>{formattedPrice}</span>
        </div>
      </div>

      {/* Title & neighborhood */}
      <div style={{ position: 'absolute', left: 16, top: 238, zIndex: 12, width: 148 }}>
        <p style={{ background: GOLD_CSS, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 15, fontWeight: 800, lineHeight: 1.1, margin: 0, textTransform: 'uppercase', letterSpacing: '0.01em' }}>
          {title}
        </p>
        <p style={{ color: '#1a1a1a', fontSize: 14, fontWeight: 800, lineHeight: 1.1, margin: '3px 0 0', textTransform: 'uppercase', letterSpacing: '0.01em' }}>
          {neighborhood}
        </p>
      </div>

      {/* Spec panel - flush right */}
      <div style={{
        position: 'absolute', right: 0, bottom: 16, zIndex: 15,
        width: 164, height: 112, backgroundColor: '#30323A',
        borderTopLeftRadius: 14, borderBottomLeftRadius: 14,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr',
        padding: '10px 8px 8px', boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          <BedIcon />
          <p style={specLabelStyle}>{bedroomsLabel}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          <CarIcon />
          <p style={specLabelStyle}>{garageLabel}</p>
        </div>
        <div style={{ gridColumn: '1 / span 2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          {getLeisureIcon(leisureLabel)}
          <p style={specLabelStyle}>{leisureLabel}</p>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 16, bottom: 12, zIndex: 12 }}>
        <AFLogo2 width={108} />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 2: GALERIA 2x2 — "Já pensou em morar no que é seu?"
// ═══════════════════════════════════════════════════════════════════════════════
export const AF2GallerySlide = ({ data, photos }: { data: AFPropertyData; photos: string[] }) => {
  const p = [photos[0], photos[1], photos[2], photos[3]].map(x => x || photos[0]);
  const gap = 3;
  const half = (360 - gap) / 2;

  const financingText = data.acceptsFinancing
    ? `COM FINANCIAMENTO${data.acceptsFGTS ? ' + FGTS' : ''}, PODE SAIR MAIS BARATO QUE O ALUGUEL.`
    : 'CONSULTE CONDIÇÕES ESPECIAIS DE PAGAMENTO.';

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: '#e5e5e5', fontFamily: golos, overflow: 'hidden' }}>
      {/* 2x2 grid */}
      {[0, 1, 2, 3].map(i => (
        <img key={i} src={p[i]} alt="" style={{
          position: 'absolute',
          left: i % 2 === 0 ? 0 : half + gap,
          top: i < 2 ? 0 : half + gap,
          width: half, height: half,
          objectFit: 'cover',
        }} />
      ))}

      {/* Accent line */}
      <AccentLine top="50%" />

      {/* Central dark pill */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 20, backgroundColor: DARK_CARD, borderRadius: 12,
        padding: '10px 16px', maxWidth: 300, textAlign: 'center',
      }}>
        <p style={{ color: 'white', fontSize: 10, fontWeight: 800, margin: '0 0 3px', lineHeight: 1.3, textTransform: 'uppercase' }}>
          JÁ PENSOU EM MORAR NO QUE É SEU?
        </p>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 8, fontWeight: 500, margin: 0, lineHeight: 1.4, textTransform: 'uppercase' }}>
          {financingText}
        </p>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 3: FICHA TÉCNICA — 2 fotos top/bottom com specs centrais
// ═══════════════════════════════════════════════════════════════════════════════
export const AF2SpecsSlide = ({ data, photos }: { data: AFPropertyData; photos: string[] }) => {
  const p1 = photos[0] || '';
  const p2 = photos[1] || photos[0] || '';
  const gap = 3;
  const half = (360 - gap) / 2;

  const specs: string[] = [];
  if (data.suites > 0) specs.push(`${data.suites} SUÍTE${data.suites > 1 ? 'S' : ''}`);
  else if (data.bedrooms > 0) specs.push(`${data.bedrooms} QUARTO${data.bedrooms > 1 ? 'S' : ''}`);
  const roomLines = data.rooms ? data.rooms.split('\n').filter(Boolean) : [];
  roomLines.forEach(r => specs.push(r.toUpperCase()));
  if (data.area > 0) specs.push(`${data.area}M²`);
  if (data.garageSpaces > 0) specs.push(`${data.garageSpaces} VAGA${data.garageSpaces > 1 ? 'S' : ''} DE GARAGEM`);
  const highlights = (data.highlights || []).filter(h => h.trim());
  highlights.forEach(h => specs.push(h.toUpperCase()));

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: '#e5e5e5', fontFamily: golos, overflow: 'hidden' }}>
      {/* Top photo */}
      {p1 && <img src={p1} alt="" style={{ position: 'absolute', left: 0, top: 0, width: 360, height: half, objectFit: 'cover' }} />}
      {/* Bottom photo */}
      {p2 && <img src={p2} alt="" style={{ position: 'absolute', left: 0, top: half + gap, width: 360, height: half, objectFit: 'cover' }} />}

      {/* Accent line */}
      <AccentLine top="50%" />

      {/* Central dark pill with specs */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 20, backgroundColor: DARK_CARD, borderRadius: 12,
        padding: '10px 20px', maxWidth: 310, textAlign: 'center',
      }}>
        {specs.slice(0, 5).map((s, i) => (
          <p key={i} style={{
            color: 'white', fontSize: 8.5, fontWeight: 700, margin: i < specs.length - 1 ? '0 0 2px' : 0,
            lineHeight: 1.4, textTransform: 'uppercase', letterSpacing: '0.02em',
          }}>
            {s}
          </p>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 4: CTA — 2x2 galeria com localização, preço e CTA
// ═══════════════════════════════════════════════════════════════════════════════
export const AF2CTASlide = ({ data, photos }: { data: AFPropertyData; photos: string[] }) => {
  const p = [photos[0], photos[1], photos[2], photos[3]].map(x => x || photos[0]);
  const gap = 3;
  const half = (360 - gap) / 2;
  const price = data.isRental ? data.rentalPrice : data.salePrice;

  const locationText = [data.neighborhood, data.city || 'Fortaleza'].filter(Boolean).join(' – ');
  const priceText = price > 0 ? formatPrice(price) : 'CONSULTE';
  const conditionsArr: string[] = [];
  if (data.acceptsFinancing) conditionsArr.push('ACEITA FINANCIAMENTO');
  if (data.acceptsFGTS) conditionsArr.push('FGTS');
  const condLine = conditionsArr.length > 0 ? ` | ${conditionsArr.join(' E ')}` : '';

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: '#e5e5e5', fontFamily: golos, overflow: 'hidden' }}>
      {/* 2x2 grid */}
      {[0, 1, 2, 3].map(i => (
        <img key={i} src={p[i]} alt="" style={{
          position: 'absolute',
          left: i % 2 === 0 ? 0 : half + gap,
          top: i < 2 ? 0 : half + gap,
          width: half, height: half,
          objectFit: 'cover',
        }} />
      ))}

      {/* Accent line */}
      <AccentLine top="50%" />

      {/* Central dark pill */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 20, backgroundColor: DARK_CARD, borderRadius: 12,
        padding: '10px 16px', maxWidth: 310, textAlign: 'center',
      }}>
        <p style={{ color: 'white', fontSize: 8, fontWeight: 700, margin: '0 0 2px', lineHeight: 1.4, textTransform: 'uppercase' }}>
          LOCALIZAÇÃO: {locationText.toUpperCase()}
        </p>
        <p style={{ color: 'white', fontSize: 8, fontWeight: 700, margin: '0 0 2px', lineHeight: 1.4, textTransform: 'uppercase' }}>
          VALOR: {priceText}{condLine}
        </p>
        <p style={{ color: '#F2A126', fontSize: 8.5, fontWeight: 800, margin: 0, lineHeight: 1.4, textTransform: 'uppercase' }}>
          CLIQUE E FALE AGORA COM UM ESPECIALISTA.
        </p>
      </div>
    </div>
  );
};
