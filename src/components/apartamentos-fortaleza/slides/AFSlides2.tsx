import { AFPropertyData } from '@/types/apartamentosFortaleza';
import logoAF from '@/assets/logo-apartamentos-fortaleza.png';
import { useLogoBase64 } from '@/hooks/useLogoBase64';

const PRIMARY = '#0C7B8E';
const ACCENT = '#E8562A';
const DARK_CARD = 'rgba(40,44,52,0.88)';
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
    height: 3, backgroundColor: ACCENT, zIndex: 30,
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
// SLIDE 1: CAPA — foto full com overlay, preço, specs com ícones, logo
// ═══════════════════════════════════════════════════════════════════════════════
export const AF2CoverSlide = ({ data, photos }: { data: AFPropertyData; photos: string[] }) => {
  const photo = photos[0];
  const price = data.isRental ? data.rentalPrice : data.salePrice;

  // Build highlights for icon cards
  const specs: { icon: React.ReactNode; label: string }[] = [];
  if (data.suites > 0) specs.push({ icon: <BedIcon />, label: `${data.suites} SUÍTE${data.suites > 1 ? 'S' : ''}` });
  else if (data.bedrooms > 0) specs.push({ icon: <BedIcon />, label: `${data.bedrooms} QUARTO${data.bedrooms > 1 ? 'S' : ''}` });
  if (data.garageSpaces > 0) specs.push({ icon: <CarIcon />, label: `${data.garageSpaces} VAGA${data.garageSpaces > 1 ? 'S' : ''} DE GARAGEM` });
  // Use first highlight or a default
  const extraHighlights = (data.highlights || []).filter(h => h.trim());
  if (extraHighlights.length > 0) specs.push({ icon: <GrillIcon />, label: extraHighlights[0].toUpperCase() });

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: '#1a1a1a', fontFamily: golos, overflow: 'hidden' }}>
      {/* Photo background */}
      {photo && <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}

      {/* Decorative white diagonal lines behind content */}
      <svg style={{ position: 'absolute', inset: 0, width: 360, height: 360, zIndex: 5 }} viewBox="0 0 360 360">
        <line x1="60" y1="360" x2="200" y2="180" stroke="rgba(255,255,255,0.15)" strokeWidth="60" />
        <line x1="120" y1="360" x2="260" y2="180" stroke="rgba(255,255,255,0.08)" strokeWidth="40" />
      </svg>

      {/* Accent line */}
      <AccentLine top={218} />

      {/* Price badge — dark angled */}
      <div style={{
        position: 'absolute', left: 0, top: 190, zIndex: 20,
        background: 'linear-gradient(135deg, #2a2e36 0%, #3a3f4a 100%)',
        borderRadius: '0 8px 8px 0', padding: '6px 14px 6px 10px',
        clipPath: 'polygon(0 0, 100% 8%, 100% 92%, 0 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, color: 'white' }}>
          <span style={{ fontSize: 9, fontWeight: 600, opacity: 0.7 }}>R$</span>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px' }}>
            {price > 0 ? price.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : 'Consulte'}
          </span>
        </div>
      </div>

      {/* Bottom section — title + neighborhood */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 15,
        padding: '40px 14px 14px',
        background: 'linear-gradient(to top, rgba(255,255,255,0.95) 70%, transparent)',
      }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: PRIMARY, lineHeight: 1.2, margin: '0 0 1px', textTransform: 'uppercase' }}>
          {data.title || 'SEU IMÓVEL'}
        </p>
        {data.neighborhood && (
          <p style={{ fontSize: 10, fontWeight: 700, color: '#222', margin: 0, textTransform: 'uppercase' }}>
            {data.neighborhood}
          </p>
        )}

        {/* Logo bottom-left */}
        <div style={{ marginTop: 6 }}>
          <AFLogo2 width={90} />
        </div>
      </div>

      {/* Specs icon card — dark, right side */}
      {specs.length > 0 && (
        <div style={{
          position: 'absolute', right: 10, bottom: 10, zIndex: 20,
          backgroundColor: DARK_CARD, borderRadius: 10, padding: '8px 10px',
          display: 'grid', gridTemplateColumns: specs.length > 2 ? '1fr 1fr' : '1fr',
          gap: 6, minWidth: specs.length > 2 ? 140 : 90,
        }}>
          {specs.map((s, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '2px 4px' }}>
              {s.icon}
              <span style={{ color: 'white', fontSize: 6, fontWeight: 700, textAlign: 'center', lineHeight: 1.2, textTransform: 'uppercase' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}
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
