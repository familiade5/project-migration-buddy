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
// SLIDE 1: CAPA — foto no topo, seção branca embaixo, badge preço, specs icons
// Referência: AM cover — foto 65%, white bottom com chevrons, dark price tag,
// title em laranja itálico bold, dark specs card com ícones à direita
// ═══════════════════════════════════════════════════════════════════════════════
export const AF2CoverSlide = ({ data, photos }: { data: AFPropertyData; photos: string[] }) => {
  const photo = photos[0];
  const price = data.isRental ? data.rentalPrice : data.salePrice;

  const specs: { icon: React.ReactNode; label: string }[] = [];
  if (data.suites > 0) specs.push({ icon: <BedIcon />, label: `${data.suites} SUÍTE${data.suites > 1 ? 'S' : ''}` });
  else if (data.bedrooms > 0) specs.push({ icon: <BedIcon />, label: `${data.bedrooms} QUARTO${data.bedrooms > 1 ? 'S' : ''}` });
  if (data.garageSpaces > 0) specs.push({ icon: <CarIcon />, label: `${data.garageSpaces} VAGA${data.garageSpaces > 1 ? 'S' : ''} DE GARAGEM` });
  const extraHighlights = (data.highlights || []).filter(h => h.trim());
  if (extraHighlights.length > 0) specs.push({ icon: <GrillIcon />, label: extraHighlights[0].toUpperCase() });

  // At 360px scale (1080/3): photo ~232px, bottom ~128px
  const photoH = 232;

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: '#ffffff', fontFamily: golos, overflow: 'hidden' }}>
      {/* Photo — top portion */}
      {photo ? (
        <img src={photo} alt="" style={{ position: 'absolute', top: 0, left: 0, width: 360, height: photoH, objectFit: 'cover' }} />
      ) : (
        <div style={{ position: 'absolute', top: 0, left: 0, width: 360, height: photoH, backgroundColor: '#d1d5db' }} />
      )}

      {/* Decorative chevron/arrow shapes in white bottom — subtle gray > shapes */}
      <svg style={{ position: 'absolute', left: 0, top: photoH, width: 360, height: 360 - photoH, zIndex: 1 }} viewBox="0 0 360 128" preserveAspectRatio="none">
        {/* Large chevron 1 */}
        <path d="M 30 128 L 90 128 L 160 30 L 130 30 L 70 100 L 50 128 Z" fill="rgba(0,0,0,0.04)" />
        {/* Large chevron 2 */}
        <path d="M 70 128 L 130 128 L 200 30 L 170 30 L 110 100 L 90 128 Z" fill="rgba(0,0,0,0.03)" />
        {/* Smaller chevron 3 */}
        <path d="M 110 128 L 150 128 L 220 50 L 190 50 L 140 105 Z" fill="rgba(0,0,0,0.025)" />
      </svg>

      {/* Accent line — full width at photo/white junction */}
      <AccentLine top={photoH} />

      {/* Price badge — dark angled tag, left-aligned, crossing the accent line */}
      <div style={{
        position: 'absolute', left: 0, top: photoH - 15, zIndex: 25,
      }}>
        <svg viewBox="0 0 180 36" width="180" height="36" style={{ display: 'block' }}>
          <path d="M 0 3 L 165 0 Q 180 1 178 6 L 172 30 Q 170 36 160 36 L 0 33 Z" fill="#3a3e47" />
        </svg>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', paddingLeft: 12, gap: 3,
        }}>
          <span style={{ color: ACCENT, fontSize: 8.5, fontWeight: 700 }}>R$</span>
          <span style={{ color: 'white', fontSize: 17, fontWeight: 800, letterSpacing: '-0.3px' }}>
            {price > 0
              ? price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : 'Consulte'}
          </span>
        </div>
      </div>

      {/* Bottom-left: Title (orange italic bold) + Neighborhood (black bold) + Logo */}
      <div style={{
        position: 'absolute', left: 12, bottom: 10, zIndex: 15,
        maxWidth: 165,
      }}>
        <p style={{
          fontSize: 12, fontWeight: 800, color: ACCENT, lineHeight: 1.15,
          margin: '0 0 0px', textTransform: 'uppercase', fontStyle: 'italic',
        }}>
          {data.title || 'SEU IMÓVEL'}
        </p>
        {data.neighborhood && (
          <p style={{
            fontSize: 11, fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px',
            textTransform: 'uppercase', lineHeight: 1.2,
          }}>
            {data.neighborhood}
          </p>
        )}
        <AFLogo2 width={95} />
      </div>

      {/* Bottom-right: Dark rounded specs card with icons */}
      {specs.length > 0 && (
        <div style={{
          position: 'absolute', right: 8, bottom: 8, zIndex: 20,
          backgroundColor: DARK_CARD, borderRadius: 10, padding: '8px 8px 6px',
          width: 155,
        }}>
          {/* Top row: 2 items side by side */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: specs.length >= 2 ? '1fr 1fr' : '1fr',
            gap: 4,
          }}>
            {specs.slice(0, 2).map((s, i) => (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 2, padding: '3px 2px',
              }}>
                {s.icon}
                <span style={{
                  color: 'white', fontSize: 5.5, fontWeight: 700, textAlign: 'center',
                  lineHeight: 1.2, textTransform: 'uppercase',
                }}>{s.label}</span>
              </div>
            ))}
          </div>
          {/* Bottom row: centered single item */}
          {specs.length > 2 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 2, padding: '3px 2px',
              }}>
                {specs[2].icon}
                <span style={{
                  color: 'white', fontSize: 5.5, fontWeight: 700, textAlign: 'center',
                  lineHeight: 1.2, textTransform: 'uppercase',
                }}>{specs[2].label}</span>
              </div>
            </div>
          )}
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
