import { AMPropertyData } from '@/types/apartamentosManaus';
import logoAM from '@/assets/logo-apartamentos-manaus.png';
import { useLogoBase64 } from '@/hooks/useLogoBase64';

const GOLD_GRADIENT_ID = 'am2-gold-grad';
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
const AMLogo2 = ({ width = 100 }: { width?: number }) => {
  const base64 = useLogoBase64(logoAM);
  return <img src={base64} alt="AM" width={width} style={{ display: 'block' }} />;
};

// ─── Helper: Golden accent line ──────────────────────────────────────────────
const AccentLine = ({ top }: { top: string | number }) => (
  <svg style={{ position: 'absolute', left: 0, right: 0, top, width: '100%', height: 12, zIndex: 20 }}>
    <defs>
      <linearGradient id="am2-accent-line-grad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#C07B18" />
        <stop offset="30%" stopColor="#F2B84B" />
        <stop offset="60%" stopColor="#E8A020" />
        <stop offset="100%" stopColor="#D4912A" />
      </linearGradient>
      <filter id="am2-accent-line-shadow">
        <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.45" />
      </filter>
    </defs>
    <rect width="100%" height="5" fill="url(#am2-accent-line-grad)" filter="url(#am2-accent-line-shadow)" />
  </svg>
);

// ─── Spec Icons (with gradient) ──────────────────────────────────────────────
const BedIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <GoldGradientDef />
    <path d="M2 18v-4a1 1 0 011-1h18a1 1 0 011 1v4" stroke={GOLD_URL} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 13V8a2 2 0 012-2h16a2 2 0 012 2v5" stroke={GOLD_URL} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="5" y="8" width="5" height="3" rx="1" stroke={GOLD_URL} strokeWidth="0.8" />
    <rect x="14" y="8" width="5" height="3" rx="1" stroke={GOLD_URL} strokeWidth="0.8" />
    <line x1="2" y1="18" x2="2" y2="20" stroke={GOLD_URL} strokeWidth="0.9" strokeLinecap="round" />
    <line x1="22" y1="18" x2="22" y2="20" stroke={GOLD_URL} strokeWidth="0.9" strokeLinecap="round" />
  </svg>
);

const CarIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <GoldGradientDef />
    <path d="M7 17h10" stroke={GOLD_URL} strokeWidth="0.7" opacity="0.3" />
    <path d="M5 14h14a2 2 0 012 2v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1a2 2 0 012-2z" stroke={GOLD_URL} strokeWidth="0.9" strokeLinejoin="round" />
    <path d="M5 14l1.5-5A1 1 0 017.46 8h9.08a1 1 0 01.96.72L19 14" stroke={GOLD_URL} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7.5" cy="17.5" r="1" stroke={GOLD_URL} strokeWidth="0.8" />
    <circle cx="16.5" cy="17.5" r="1" stroke={GOLD_URL} strokeWidth="0.8" />
    <line x1="7" y1="11" x2="17" y2="11" stroke={GOLD_URL} strokeWidth="0.6" opacity="0.25" />
  </svg>
);

const GrillIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <GoldGradientDef />
    <path d="M9 4c0 1.2-.8 1.8-.8 2.8M12 3c0 1.5-.8 2.2-.8 3.2M15 4c0 1.2-.8 1.8-.8 2.8" stroke={GOLD_URL} strokeWidth="0.8" strokeLinecap="round" />
    <path d="M6 9h12c0 4-2.5 7-6 7s-6-3-6-7z" stroke={GOLD_URL} strokeWidth="0.9" strokeLinejoin="round" />
    <line x1="12" y1="16" x2="12" y2="19" stroke={GOLD_URL} strokeWidth="0.9" strokeLinecap="round" />
    <line x1="8" y1="19" x2="16" y2="19" stroke={GOLD_URL} strokeWidth="0.9" strokeLinecap="round" />
    <line x1="9" y1="21" x2="15" y2="21" stroke={GOLD_URL} strokeWidth="0.7" strokeLinecap="round" />
  </svg>
);

const BathIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <GoldGradientDef />
    <path d="M4 12h16" stroke={GOLD_URL} strokeWidth="0.9" strokeLinecap="round" />
    <path d="M4 12v5a4 4 0 004 4h8a4 4 0 004-4v-5" stroke={GOLD_URL} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 12V6a2 2 0 012-2h1.5" stroke={GOLD_URL} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="11" cy="7" r="1" stroke={GOLD_URL} strokeWidth="0.7" />
    <line x1="6" y1="21" x2="6" y2="22" stroke={GOLD_URL} strokeWidth="0.8" strokeLinecap="round" />
    <line x1="18" y1="21" x2="18" y2="22" stroke={GOLD_URL} strokeWidth="0.8" strokeLinecap="round" />
  </svg>
);

const PoolIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <GoldGradientDef />
    <path d="M2 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke={GOLD_URL} strokeWidth="0.9" strokeLinecap="round" />
    <path d="M2 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke={GOLD_URL} strokeWidth="0.9" strokeLinecap="round" />
    <rect x="7" y="4" width="2" height="12" rx="1" stroke={GOLD_URL} strokeWidth="0.8" />
    <rect x="15" y="4" width="2" height="12" rx="1" stroke={GOLD_URL} strokeWidth="0.8" />
    <line x1="9" y1="8" x2="15" y2="8" stroke={GOLD_URL} strokeWidth="0.8" strokeLinecap="round" />
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

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 1: CAPA
// ═══════════════════════════════════════════════════════════════════════════════
export const AM2CoverSlide = ({ data, photos, objectPosition, scale }: { data: AMPropertyData; photos: string[]; objectPosition?: string; scale?: number }) => {
  const logoBase64 = useLogoBase64(logoAM);
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

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: '#ffffff', fontFamily: poppins, overflow: 'hidden' }}>
      {photo ? (
        <div style={{ position: 'absolute', top: 0, left: 0, width: 360, height: photoH, overflow: 'hidden' }}>
          <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: objectPosition || '50% 50%', transform: scale ? `scale(${scale})` : undefined }} />
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 0, left: 0, width: 360, height: photoH, background: 'linear-gradient(180deg, #d8dadf 0%, #cfd2d8 100%)' }} />
      )}

      <AccentLine top={photoH - 1} />

      {/* White panel with top shadow */}
      <div style={{
        position: 'absolute', left: 0, top: photoH + 4, width: 360, height: 156, zIndex: 5,
        boxShadow: 'inset 0 6px 8px -4px rgba(0,0,0,0.18)',
        background: '#f8f7f3',
      }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 360 156" preserveAspectRatio="none">
          <polygon points="108,0 206,0 136,46 40,46" fill="rgba(255,255,255,0.85)" />
          <polygon points="150,0 304,0 206,78 54,78" fill="rgba(255,255,255,0.52)" />
          <polygon points="204,0 360,0 256,94 102,94" fill="rgba(255,255,255,0.30)" />
          <polygon points="232,48 360,48 360,156 314,156" fill="rgba(255,255,255,0.16)" />
        </svg>
      </div>

      {/* AM logo as watermark */}
      <div style={{
        position: 'absolute', left: '50%', top: photoH + 2, transform: 'translateX(-50%)',
        zIndex: 6, pointerEvents: 'none', userSelect: 'none',
        width: 360, height: 156, display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <img src={logoBase64} alt="" style={{ width: 700, marginRight: -420, display: 'block', filter: 'grayscale(100%) brightness(1.9) contrast(0.25)', opacity: 0.4 }} />
      </div>

      {/* Price badge */}
      <div style={{
        position: 'absolute', left: -3, top: 168, width: 200, height: 54, zIndex: 30,
        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.35))',
      }}>
        <svg viewBox="0 0 200 54" width="200" height="54" style={{ display: 'block', overflow: 'visible' }}>
          <path d="M0 2 H160 Q166 2 166 8 L144 46 Q140 52 134 52 H0 V2 Z" fill={DARK_CARD} stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 16px 0 10px', gap: 2 }}>
          <span style={{ background: GOLD_CSS, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 13, fontWeight: 800, lineHeight: 1 }}>R$</span>
          <span style={{ background: GOLD_CSS, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: Math.min(24, Math.max(16, 24 - Math.max(0, formattedPrice.length - 8) * 1.2)), fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em', transform: 'scaleY(1.4)', display: 'inline-block' }}>{formattedPrice}</span>
        </div>
      </div>

      {/* Title & neighborhood */}
      <div style={{ position: 'absolute', left: 16, top: 236, zIndex: 12, width: 160 }}>
        <p style={{ background: GOLD_CSS, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: Math.min(20, Math.max(12, 20 - Math.max(0, title.length - 10) * 0.55)), fontWeight: 800, lineHeight: 1.1, margin: 0, textTransform: 'uppercase', letterSpacing: '0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </p>
        <p style={{ color: '#1a1a1a', fontSize: Math.min(17, Math.max(11, 17 - Math.max(0, neighborhood.length - 10) * 0.5)), fontWeight: 800, lineHeight: 1.1, margin: '3px 0 0', textTransform: 'uppercase', letterSpacing: '0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {neighborhood}
        </p>
      </div>

      {/* Spec panel */}
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
        <AMLogo2 width={108} />
      </div>
    </div>
  );
};

// ─── Helper: build unique emotional trigger messages per slide ───────────────
const getSlideContent = (data: AMPropertyData, slideIndex: number): { headline: string; details: string[] } => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const priceFormatted = price > 0 ? formatPrice(price) : '';
  const neighborhood = (data.neighborhood || 'sua região').toUpperCase();
  const bedroomsText = data.suites > 0
    ? `${data.suites} SUÍTE${data.suites > 1 ? 'S' : ''}`
    : data.bedrooms > 0 ? `${data.bedrooms} QUARTO${data.bedrooms > 1 ? 'S' : ''}` : '';
  const garageText = data.garageSpaces > 0 ? `${data.garageSpaces} VAGA${data.garageSpaces > 1 ? 'S' : ''} DE GARAGEM` : '';
  const areaText = data.area > 0 ? `${data.area}M²` : '';
  const bathText = data.bathrooms > 0 ? `${data.bathrooms} BANHEIRO${data.bathrooms > 1 ? 'S' : ''}` : '';
  const leisureItems = (data.leisureItems || '').split(/[,\n]/).map(i => i.trim()).filter(Boolean);
  const rooms = (data.rooms || '').split(/[,\n]/).map(i => i.trim()).filter(Boolean);
  const infoMsg = (data.infoMessage || '').trim().toUpperCase();
  const hasFinancing = data.acceptsFinancing;
  const hasFGTS = data.acceptsFGTS;
  const specsLine = [bedroomsText, areaText, garageText].filter(Boolean).join(' | ');

  const leisureChunks: string[][] = [];
  for (let i = 0; i < leisureItems.length; i += 2) {
    leisureChunks.push(leisureItems.slice(i, i + 2).map(l => l.toUpperCase()));
  }

  const roomChunks: string[][] = [];
  for (let i = 0; i < rooms.length; i += 3) {
    roomChunks.push(rooms.slice(i, i + 3).map(r => r.toUpperCase()));
  }

  const templates: { headline: string; details: string[] }[] = [
    {
      headline: 'JÁ PENSOU EM MORAR NO QUE É SEU?',
      details: [
        hasFinancing && hasFGTS ? 'COM FINANCIAMENTO + FGTS, PODE SAIR MAIS BARATO QUE O ALUGUEL.' : 'CONDIÇÕES FACILITADAS PARA REALIZAR SEU SONHO.',
      ],
    },
    {
      headline: 'CONHEÇA CADA DETALHE!',
      details: [
        bedroomsText,
        ...(leisureChunks[0] || []),
        garageText,
      ].filter(Boolean),
    },
    {
      headline: `LOCALIZAÇÃO: ${neighborhood}`,
      details: [
        priceFormatted ? `VALOR: ${priceFormatted}` : '',
        hasFinancing ? 'ACEITA FINANCIAMENTO' + (hasFGTS ? ' E FGTS' : '') : '',
        'CLIQUE E FALE AGORA COM UM ESPECIALISTA.',
      ].filter(Boolean),
    },
    {
      headline: 'ESPAÇO QUE SUA FAMÍLIA MERECE.',
      details: [
        ...(roomChunks[0] ? [roomChunks[0].join(' | ')] : []),
        specsLine || 'IMÓVEL COMPLETO',
      ].filter(Boolean),
    },
    {
      headline: 'SAIA DO ALUGUEL!',
      details: [
        'INVISTA NO QUE É SEU.',
        hasFGTS ? 'UTILIZE SEU FGTS COMO ENTRADA.' : '',
        'PARCELAS QUE CABEM NO SEU BOLSO.',
      ].filter(Boolean),
    },
    {
      headline: infoMsg || 'CONFORTO EM CADA AMBIENTE.',
      details: infoMsg
        ? [`IMÓVEL EM ${neighborhood}`, 'AGENDE SUA VISITA.']
        : [
            bathText && bedroomsText ? `${bedroomsText} | ${bathText}` : bedroomsText || bathText || '',
            'AGENDE SUA VISITA.',
          ].filter(Boolean),
    },
    {
      headline: 'LAZER COMPLETO!',
      details: [
        ...(leisureChunks[1] || leisureChunks[0] || ['ÁREA DE LAZER EQUIPADA']),
        ...(leisureChunks[2] || []),
      ].filter(Boolean),
    },
    {
      headline: 'PRONTO PARA MORAR.',
      details: [
        `IMÓVEL EM ${neighborhood}`,
        hasFinancing ? 'ENTRADA FACILITADA.' : 'CONSULTE FORMAS DE PAGAMENTO.',
      ].filter(Boolean),
    },
    {
      headline: 'AMBIENTES PENSADOS PARA VOCÊ.',
      details: [
        ...(roomChunks[1] ? [roomChunks[1].join(' | ')] : roomChunks[0] ? [roomChunks[0].join(' | ')] : []),
        areaText ? `ÁREA: ${areaText}` : '',
        garageText || '',
      ].filter(Boolean),
    },
    {
      headline: 'MORADIA COM QUALIDADE DE VIDA.',
      details: [
        ...(leisureChunks[3] || leisureChunks[2] || leisureChunks[0] || []).slice(0, 2),
        ...(roomChunks[2] ? [roomChunks[2].join(' | ')] : []),
      ].filter(Boolean),
    },
    {
      headline: 'SEU NOVO LAR ESTÁ AQUI.',
      details: [
        infoMsg || `IMÓVEL EM ${neighborhood}`,
        'FALE COM UM ESPECIALISTA.',
      ].filter(Boolean),
    },
    {
      headline: 'VIVER BEM COMEÇA AQUI.',
      details: [
        ...(leisureChunks[4] || leisureChunks[1] || []).slice(0, 2),
        garageText || bedroomsText || '',
      ].filter(Boolean),
    },
  ];

  return templates[slideIndex % templates.length];
};

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE DE FOTOS — 2 fotos + caixa cinza central com gatilhos emocionais
// ═══════════════════════════════════════════════════════════════════════════════
export const AM2PhotoSlide = ({ photos, slideIndex, data, objectPositions, scales }: { photos: [string, string?]; slideIndex: number; data: AMPropertyData; objectPositions?: string[]; scales?: (number | undefined)[] }) => {
  const p1 = photos[0];
  const p2 = photos[1];
  const GOLD_CSS = 'linear-gradient(135deg, #E8A020, #F2B84B, #D4912A, #C07B18)';
  const content = getSlideContent(data, slideIndex);

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: '#e5e5e5', fontFamily: poppins, overflow: 'hidden' }}>
      {p1 && <div style={{ position: 'absolute', left: 0, top: 0, width: 360, height: 180, overflow: 'hidden' }}><img src={p1} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: objectPositions?.[0] || '50% 50%', transform: scales?.[0] ? `scale(${scales[0]})` : undefined }} /></div>}
      {p2 && <div style={{ position: 'absolute', left: 0, top: 180, width: 360, height: 180, overflow: 'hidden' }}><img src={p2} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: objectPositions?.[1] || '50% 50%', transform: scales?.[1] ? `scale(${scales[1]})` : undefined }} /></div>}
      {!p2 && p1 && <div style={{ position: 'absolute', left: 0, top: 180, width: 360, height: 180, overflow: 'hidden' }}><img src={p1} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: objectPositions?.[0] || '50% 50%', transform: `scaleX(-1)${scales?.[0] ? ` scale(${scales[0]})` : ''}` }} /></div>}

      <AccentLine top={175} />

      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(55, 58, 66, 0.92)',
        borderRadius: 10, padding: '0 14px', zIndex: 20, textAlign: 'center',
        width: '82%', maxWidth: 310, height: 58,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 6px 20px rgba(0,0,0,0.35)', overflow: 'hidden',
      }}>
        <p style={{
          background: GOLD_CSS, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          fontSize: 9, fontWeight: 800, margin: '0 0 1px',
          textTransform: 'uppercase', letterSpacing: '0.03em', lineHeight: 1.2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%',
        }}>
          {content.headline}
        </p>
        {content.details.slice(0, 3).map((line, i) => {
          const isCTA = line.includes('CLIQUE') || line.includes('FALE AGORA') || line.includes('FALE COM');
          return (
            <p key={i} style={{
              color: isCTA ? undefined : 'rgba(255,255,255,0.85)',
              background: isCTA ? GOLD_CSS : undefined,
              WebkitBackgroundClip: isCTA ? 'text' : undefined,
              WebkitTextFillColor: isCTA ? 'transparent' : undefined,
              fontSize: 7, fontWeight: isCTA ? 800 : 600, margin: 0,
              textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.3,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%',
            }}>
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE FINAL: CTA
// ═══════════════════════════════════════════════════════════════════════════════
export const AM2CTASlide = ({ data, photos }: { data: AMPropertyData; photos: string[] }) => {
  const logoBase64 = useLogoBase64(logoAM);
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const locationText = [data.neighborhood, data.city || 'Manaus'].filter(Boolean).join(' – ').toUpperCase();
  const priceText = price > 0 ? formatPrice(price) : 'CONSULTE';
  const GOLD_CSS = 'linear-gradient(135deg, #E8A020, #F2B84B, #D4912A, #C07B18)';

  const conditionsArr: string[] = [];
  if (data.acceptsFinancing) conditionsArr.push('FINANCIAMENTO');
  if (data.acceptsFGTS) conditionsArr.push('FGTS');
  const condLine = conditionsArr.length > 0 ? `ACEITA ${conditionsArr.join(' + ')}` : '';

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: DARK_CARD, fontFamily: poppins, overflow: 'hidden' }}>
      {photos[0] && (
        <img src={photos[0]} alt="" style={{ position: 'absolute', inset: 0, width: 360, height: 360, objectFit: 'cover', opacity: 0.15, filter: 'blur(2px)' }} />
      )}

      <AccentLine top={0} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 30, zIndex: 10, textAlign: 'center' }}>
        <img src={logoBase64} alt="AM" style={{ width: 120, marginBottom: 20, filter: 'brightness(0) invert(1)', opacity: 0.9 }} />

        <p style={{ color: 'white', fontSize: 11, fontWeight: 700, margin: '0 0 6px', lineHeight: 1.3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {(data.title || 'SEU IMÓVEL').toUpperCase()}
        </p>

        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: 500, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
          {locationText}
        </p>

        <p style={{
          background: GOLD_CSS, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          fontSize: 22, fontWeight: 800, margin: '0 0 4px', lineHeight: 1.2, letterSpacing: '-0.02em',
        }}>
          {priceText}
        </p>

        {condLine && (
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 8, fontWeight: 500, margin: '0 0 20px', textTransform: 'uppercase' }}>
            {condLine}
          </p>
        )}

        <div style={{
          background: GOLD_CSS, borderRadius: 8, padding: '10px 24px', marginTop: condLine ? 0 : 16,
        }}>
          <p style={{ color: DARK_CARD, fontSize: 10, fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            FALE AGORA COM UM ESPECIALISTA
          </p>
        </div>

        <div style={{ marginTop: 8 }}>
          {data.brokerName && (
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 8, fontWeight: 600, margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              {data.brokerName.toUpperCase()}
            </p>
          )}
          {data.creci && (
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 7, fontWeight: 400, margin: 0, textTransform: 'uppercase' }}>
              {data.creci}
            </p>
          )}
        </div>
      </div>

      <AccentLine top={355} />
    </div>
  );
};
