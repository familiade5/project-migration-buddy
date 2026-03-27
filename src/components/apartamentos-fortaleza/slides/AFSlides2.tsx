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

// ─── Helper: Grill icon ──────────────────────────────────────────────────────
const GrillIcon = () => (
  <svg width="32" height="24" viewBox="0 0 24 20" fill={ACCENT}>
    <path d="M4 10h16v2a6 6 0 01-6 6h-4a6 6 0 01-6-6v-2zm2-2c.5-1.5 1-3 1.5-4M12 4c0 1.5.5 3 .5 4m3.5-4c-.5 1.5-1 3-1.5 4" strokeWidth="1.5" stroke={ACCENT} fill="none" />
    <rect x="11" y="16" width="2" height="4" fill={ACCENT} />
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

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: '#ffffff', fontFamily: golos, overflow: 'hidden' }}>
      {/* Photo top section */}
      {photo ? (
        <img src={photo} alt="" style={{ position: 'absolute', top: 0, left: 0, width: 360, height: photoH, objectFit: 'cover' }} />
      ) : (
        <div style={{ position: 'absolute', top: 0, left: 0, width: 360, height: photoH, backgroundColor: '#d1d5db' }} />
      )}

      {/* Logo on the photo (top-right) */}
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 15, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 6, padding: '4px 8px' }}>
        <AFLogo2 width={100} />
      </div>

      {/* Orange accent line */}
      <AccentLine top={photoH - 1} />

      {/* Decorative diagonal graphics on white section */}
      <svg style={{ position: 'absolute', left: 0, top: photoH, width: 360, height: 136, zIndex: 1 }} viewBox="0 0 360 136" preserveAspectRatio="none">
        <rect width="360" height="136" fill="#ffffff" />
        <polygon points="156,0 360,0 360,54 262,54" fill="rgba(0,0,0,0.035)" />
        <polygon points="202,34 360,34 360,102 256,102" fill="rgba(0,0,0,0.03)" />
        <polygon points="248,84 360,84 360,136 290,136" fill="rgba(0,0,0,0.028)" />
      </svg>

      {/* Dark angled price badge */}
      <div style={{ position: 'absolute', left: -12, top: 170, width: 300, height: 76, zIndex: 30 }}>
        <svg viewBox="0 0 300 76" width="300" height="76" style={{ display: 'block', overflow: 'visible' }}>
          <path d="M 16 4 H 240 Q 265 4 278 18 L 262 62 Q 254 74 232 74 H 18 Q 4 74 4 58 V 18 Q 4 4 16 4 Z" fill={DARK_CARD} stroke="#ffffff" strokeWidth="4" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', paddingLeft: 26, paddingRight: 12, gap: 6 }}>
          <span style={{ color: PRIMARY, fontSize: 28, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em' }}>R$</span>
          <span style={{ color: PRIMARY, fontSize: 42, fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.06em' }}>{formattedPrice}</span>
        </div>
      </div>

      {/* Title & neighborhood */}
      <div style={{ position: 'absolute', left: 18, bottom: 14, zIndex: 10, width: 320 }}>
        <p style={{ color: PRIMARY, fontSize: 22, fontWeight: 900, lineHeight: 1.08, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.03em', fontStyle: 'italic' }}>
          {data.title || 'SEU IMÓVEL'}
        </p>
        {data.neighborhood && (
          <p style={{ color: '#252730', fontSize: 16, fontWeight: 700, lineHeight: 1.1, margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            {data.neighborhood}
          </p>
        )}
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

      {/* Logo top-right on white card */}
      <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 25, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 6, padding: '4px 8px' }}>
        <AFLogo2 width={90} />
      </div>

      {/* Central dark pill */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 20, backgroundColor: DARK_CARD, borderRadius: 12,
        padding: '12px 18px', maxWidth: 310, textAlign: 'center',
      }}>
        <p style={{ color: 'white', fontSize: 9, fontWeight: 700, margin: '0 0 3px', lineHeight: 1.4, textTransform: 'uppercase' }}>
          LOCALIZAÇÃO: {locationText.toUpperCase()}
        </p>
        <p style={{ color: 'white', fontSize: 9, fontWeight: 700, margin: '0 0 4px', lineHeight: 1.4, textTransform: 'uppercase' }}>
          VALOR: {priceText}{condLine}
        </p>
        <p style={{ color: ACCENT, fontSize: 10, fontWeight: 800, margin: 0, lineHeight: 1.4, textTransform: 'uppercase' }}>
          CLIQUE E FALE AGORA COM UM ESPECIALISTA.
        </p>
      </div>
    </div>
  );
};
          CLIQUE E FALE AGORA COM UM ESPECIALISTA.
        </p>
      </div>
    </div>
  );
};
