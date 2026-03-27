import { AFPropertyData } from '@/types/apartamentosFortaleza';
import logoAF from '@/assets/logo-apartamentos-fortaleza.png';
import { useLogoBase64 } from '@/hooks/useLogoBase64';

const PRIMARY = '#F2A126';
const ACCENT = '#F2A126';
const DARK_CARD = '#30323A';
const golos = "'Golos Text', Arial, sans-serif";

// ─── Helper: Logo ────────────────────────────────────────────────────────────
const AFLogo2 = ({ width = 100 }: { width?: number }) => {
  const base64 = useLogoBase64(logoAF);
  return <img src={base64} alt="AF" width={width} style={{ display: 'block' }} />;
};

// ─── Helper: Orange accent line ──────────────────────────────────────────────
const AccentLine = ({ top }: { top: string | number }) => (
  <div style={{
    position: 'absolute', left: 0, right: 0, top,
    height: 4, backgroundColor: ACCENT, zIndex: 20,
  }} />
);

// ─── Helper: Bed icon ────────────────────────────────────────────────────────
const BedIcon = () => (
  <svg width="32" height="24" viewBox="0 0 24 18" fill={ACCENT}>
    <path d="M2 12V6a2 2 0 012-2h5a2 2 0 012 2v1h2V6a2 2 0 012-2h5a2 2 0 012 2v6H2zm0 1h20v4H2v-4z" />
  </svg>
);

// ─── Helper: Car icon ────────────────────────────────────────────────────────
const CarIcon = () => (
  <svg width="32" height="24" viewBox="0 0 24 18" fill={ACCENT}>
    <path d="M3 6l2-4h14l2 4v8H3V6zm3 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm12 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
  </svg>
);

// ─── Helper: Area icon ───────────────────────────────────────────────────────
const AreaIcon = () => (
  <svg width="32" height="24" viewBox="0 0 24 20" fill={ACCENT}>
    <rect x="2" y="2" width="20" height="16" rx="2" fill="none" stroke={ACCENT} strokeWidth="2" />
    <path d="M6 14l4-4 3 3 5-5" stroke={ACCENT} strokeWidth="2" fill="none" />
  </svg>
);

// ─── Helper: Bath icon ───────────────────────────────────────────────────────
const BathIcon = () => (
  <svg width="32" height="24" viewBox="0 0 24 20" fill={ACCENT}>
    <path d="M4 10h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4zm2-8v8m0-8h2a2 2 0 012 2v2" stroke={ACCENT} strokeWidth="2" fill="none" />
  </svg>
);

// ─── Formatação de preço ─────────────────────────────────────────────────────
const formatPrice = (v: number) => {
  if (v >= 1000000) return `R$ ${(v / 1000000).toFixed(v % 1000000 === 0 ? 0 : 1).replace('.', ',')} MI`;
  if (v >= 1000) return `R$ ${(v / 1000).toFixed(0)} MIL`;
  return `R$ ${v.toLocaleString('pt-BR')}`;
};

const formatPriceFull = (v: number) =>
  `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 1: CAPA — modelo fiel ao anexo: foto superior, faixa laranja divisória,
// badge escuro inclinado com contorno branco e bloco tipográfico no rodapé
// ═══════════════════════════════════════════════════════════════════════════════
export const AF2CoverSlide = ({ data, photos }: { data: AFPropertyData; photos: string[] }) => {
  const photo = photos[0];
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const formattedPrice = price > 0
    ? price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : 'Consulte';
  const photoH = 224;

  const bedroomsLabel = data.suites > 0
    ? `${data.suites} Suíte${data.suites > 1 ? 's' : ''}`
    : `${data.bedrooms || 0} Quarto${(data.bedrooms || 0) !== 1 ? 's' : ''}`;
  const areaLabel = data.area > 0 ? `${data.area}m²` : '0m²';
  const garageLabel = `${data.garageSpaces || 0} Vaga${(data.garageSpaces || 0) !== 1 ? 's' : ''}`;
  const bathLabel = `${data.bathrooms || 0} Banheiro${(data.bathrooms || 0) !== 1 ? 's' : ''}`;

  const specCardStyle: React.CSSProperties = {
    backgroundColor: DARK_CARD,
    borderRadius: 6,
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    minWidth: 80,
  };
  const specTextStyle: React.CSSProperties = {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 700,
    textTransform: 'uppercase',
    lineHeight: 1.2,
    letterSpacing: '0.01em',
  };

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: '#ffffff', fontFamily: golos, overflow: 'hidden' }}>
      {photo ? (
        <img src={photo} alt="" style={{ position: 'absolute', top: 0, left: 0, width: 360, height: photoH, objectFit: 'cover' }} />
      ) : (
        <div style={{ position: 'absolute', top: 0, left: 0, width: 360, height: photoH, backgroundColor: '#d1d5db' }} />
      )}

      <AccentLine top={photoH - 1} />

      <svg style={{ position: 'absolute', left: 0, top: photoH, width: 360, height: 136, zIndex: 1 }} viewBox="0 0 360 136" preserveAspectRatio="none">
        <rect width="360" height="136" fill="#ffffff" />
        <polygon points="156,0 360,0 360,54 262,54" fill="rgba(0,0,0,0.035)" />
        <polygon points="202,34 360,34 360,102 256,102" fill="rgba(0,0,0,0.03)" />
        <polygon points="248,84 360,84 360,136 290,136" fill="rgba(0,0,0,0.028)" />
      </svg>

      {/* Price badge */}
      <div style={{ position: 'absolute', left: -12, top: 166, width: 300, height: 86, zIndex: 30 }}>
        <svg viewBox="0 0 300 86" width="300" height="86" style={{ display: 'block', overflow: 'visible' }}>
          <path d="M 18 4 H 252 Q 280 4 292 22 L 272 70 Q 264 82 240 82 H 20 Q 4 82 4 64 V 20 Q 4 4 18 4 Z" fill={DARK_CARD} stroke="#ffffff" strokeWidth="4" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', paddingLeft: 28, paddingRight: 12, gap: 8 }}>
          <span style={{ color: PRIMARY, fontSize: 34, fontWeight: 800, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.05em' }}>R$</span>
          <span style={{ color: PRIMARY, fontSize: 56, fontWeight: 900, lineHeight: 0.88, letterSpacing: '-0.065em' }}>{formattedPrice}</span>
        </div>
      </div>

      {/* Title & neighborhood */}
      <div style={{ position: 'absolute', left: 22, top: 255, zIndex: 10, width: 180 }}>
        <p style={{ color: PRIMARY, fontSize: 22, fontWeight: 900, lineHeight: 1.04, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.04em' }}>
          {data.title || 'SEU IMÓVEL'}
        </p>
        <p style={{ color: '#252730', fontSize: 16, fontWeight: 500, lineHeight: 1.05, margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '-0.035em' }}>
          {data.neighborhood || 'BAIRRO'}
        </p>
      </div>

      {/* Spec cards - always visible, bottom right */}
      <div style={{
        position: 'absolute', right: 12, bottom: 42, zIndex: 20,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4,
      }}>
        <div style={specCardStyle}>
          <BedIcon />
          <span style={specTextStyle}>{bedroomsLabel}</span>
        </div>
        <div style={specCardStyle}>
          <AreaIcon />
          <span style={specTextStyle}>{areaLabel}</span>
        </div>
        <div style={specCardStyle}>
          <CarIcon />
          <span style={specTextStyle}>{garageLabel}</span>
        </div>
        <div style={specCardStyle}>
          <BathIcon />
          <span style={specTextStyle}>{bathLabel}</span>
        </div>
      </div>

      {/* Logo */}
      <div style={{ position: 'absolute', left: 20, bottom: 12, zIndex: 10 }}>
        <AFLogo2 width={120} />
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
        <p style={{ color: ACCENT, fontSize: 8.5, fontWeight: 800, margin: 0, lineHeight: 1.4, textTransform: 'uppercase' }}>
          CLIQUE E FALE AGORA COM UM ESPECIALISTA.
        </p>
      </div>
    </div>
  );
};
