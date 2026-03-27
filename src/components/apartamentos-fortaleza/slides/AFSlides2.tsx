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
  <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
    <path d="M3 11.5V7.5C3 6.4 3.9 5.5 5 5.5H10C11.1 5.5 12 6.4 12 7.5V8.5H14V7.5C14 6.4 14.9 5.5 16 5.5H19C20.1 5.5 21 6.4 21 7.5V11.5" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 11.5H21.5V15.5H2.5V11.5Z" stroke={ACCENT} strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

// ─── Helper: Car icon ────────────────────────────────────────────────────────
const CarIcon = () => (
  <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
    <path d="M5 12.5H19M6.5 12.5L8 8.5H16L17.5 12.5M7.5 15.5C8.32843 15.5 9 14.8284 9 14C9 13.1716 8.32843 12.5 7.5 12.5C6.67157 12.5 6 13.1716 6 14C6 14.8284 6.67157 15.5 7.5 15.5ZM16.5 15.5C17.3284 15.5 18 14.8284 18 14C18 13.1716 17.3284 12.5 16.5 12.5C15.6716 12.5 15 13.1716 15 14C15 14.8284 15.6716 15.5 16.5 15.5Z" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Helper: Grill icon ──────────────────────────────────────────────────────
const GrillIcon = () => (
  <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
    <path d="M8 4.5C8 5.7 7.1 6.1 7.1 7.2M12 3.5C12 4.9 11.1 5.5 11.1 6.7M16 4.5C16 5.7 15.1 6.1 15.1 7.2" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 10.5H18C18 13.3 15.8 15.5 13 15.5H11C8.2 15.5 6 13.3 6 10.5Z" stroke={ACCENT} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 15.5V18.5" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" />
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
// SLIDE 1: CAPA — reconstruído para ficar muito mais fiel ao modelo anexado
// ═══════════════════════════════════════════════════════════════════════════════
export const AF2CoverSlide = ({ data, photos }: { data: AFPropertyData; photos: string[] }) => {
  const photo = photos[0];
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const formattedPrice = price > 0
    ? price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : 'Consulte';
  const photoH = 182;

  const title = (data.title || 'SEU IMÓVEL').toUpperCase();
  const neighborhood = (data.neighborhood || 'BAIRRO').toUpperCase();
  const bedroomsLabel = data.suites > 0
    ? `${data.suites} SUÍTE${data.suites > 1 ? 'S' : ''}`
    : `${data.bedrooms || 0} QUARTO${(data.bedrooms || 0) !== 1 ? 'S' : ''}`;
  const garageLabel = `${data.garageSpaces || 0} VAGA${(data.garageSpaces || 0) !== 1 ? 'S' : ''} DE GARAGEM`;
  const leisureLabel = ((data.leisureItems || '').split(/[,\n]/).map(item => item.trim()).filter(Boolean)[0] || 'CHURRASQUEIRA').toUpperCase();

  const specLabelStyle: React.CSSProperties = {
    color: '#F7F7F4',
    fontSize: 9,
    lineHeight: 1.15,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    fontWeight: 500,
    textAlign: 'center',
    margin: 0,
  };

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: '#ffffff', fontFamily: golos, overflow: 'hidden' }}>
      {photo ? (
        <img src={photo} alt="" style={{ position: 'absolute', top: 0, left: 0, width: 360, height: photoH, objectFit: 'cover' }} />
      ) : (
        <div style={{ position: 'absolute', top: 0, left: 0, width: 360, height: photoH, background: 'linear-gradient(180deg, #d8dadf 0%, #cfd2d8 100%)' }} />
      )}

      <AccentLine top={photoH - 1} />

      <svg style={{ position: 'absolute', left: 0, top: photoH, width: 360, height: 178, zIndex: 1 }} viewBox="0 0 360 178" preserveAspectRatio="none">
        <rect width="360" height="178" fill="#f8f7f3" />
        <polygon points="108,0 206,0 136,56 40,56" fill="rgba(255,255,255,0.85)" />
        <polygon points="150,0 304,0 206,92 54,92" fill="rgba(255,255,255,0.52)" />
        <polygon points="204,0 360,0 256,110 102,110" fill="rgba(255,255,255,0.30)" />
        <polygon points="232,58 360,58 360,178 314,178" fill="rgba(255,255,255,0.16)" />
      </svg>

      <div style={{ position: 'absolute', left: -6, top: 146, width: 228, height: 78, zIndex: 30 }}>
        <svg viewBox="0 0 228 78" width="228" height="78" style={{ display: 'block', overflow: 'visible' }}>
          <path d="M18 3 H189 L210 21 L191 63 H18 C8 63 3 57 3 47 V18 C3 8 8 3 18 3 Z" fill={DARK_CARD} stroke="#ffffff" strokeWidth="3.5" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '6px 16px 10px 18px', gap: 6 }}>
          <span style={{ color: PRIMARY, fontSize: 20, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em' }}>R$</span>
          <span style={{ color: PRIMARY, fontSize: 42, fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.06em' }}>{formattedPrice}</span>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 20, top: 234, zIndex: 12, width: 154 }}>
        <p style={{ color: PRIMARY, fontSize: 18, fontWeight: 900, lineHeight: 1.02, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.04em', textWrap: 'balance' as any }}>
          {title}
        </p>
        <p style={{ color: '#2f3138', fontSize: 10, fontWeight: 500, lineHeight: 1.05, margin: '6px 0 0', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          {neighborhood}
        </p>
      </div>

      <div style={{
        position: 'absolute', right: 10, bottom: 0, zIndex: 15,
        width: 184, height: 108, backgroundColor: '#30323A',
        borderTopLeftRadius: 16, borderTopRightRadius: 16, borderBottomLeftRadius: 16,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr',
        padding: '14px 12px 10px', boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <BedIcon />
          <p style={specLabelStyle}>{bedroomsLabel}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <CarIcon />
          <p style={specLabelStyle}>{garageLabel}</p>
        </div>
        <div style={{ gridColumn: '1 / span 2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <GrillIcon />
          <p style={specLabelStyle}>{leisureLabel}</p>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 18, bottom: 14, zIndex: 12 }}>
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
        <p style={{ color: ACCENT, fontSize: 8.5, fontWeight: 800, margin: 0, lineHeight: 1.4, textTransform: 'uppercase' }}>
          CLIQUE E FALE AGORA COM UM ESPECIALISTA.
        </p>
      </div>
    </div>
  );
};
