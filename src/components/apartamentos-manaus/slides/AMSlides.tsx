import { AMPropertyData } from '@/types/apartamentosManaus';
import logoAM from '@/assets/logo-apartamentos-manaus.png';

// ─── Logo ────────────────────────────────────────────────────────────────────
export const AMLogo = ({
  width = 120,
  variant = 'color',
}: {
  width?: number;
  variant?: 'color' | 'white';
}) => (
  <img
    src={logoAM}
    alt="Apartamentos Manaus"
    width={width}
    style={variant === 'white' ? { filter: 'brightness(0) invert(1)' } : undefined}
  />
);

// ─── Slide 1: CAPA ──────────────────────────────────────────────────────────
// Exact layout from reference image:
//  • White background (visible on sides and bottom strip ~85px)
//  • Photo: inset 14px top/left/right, ends 85px from bottom → border-radius 22px all corners
//  • Orange badge: z=20, top=8, left=8 (overlaps photo top-left)
//  • White logo: z=20, on photo bottom-left (bottom=93px, left=20px)
//  • Blue price card: z=20, bottom=14, right=14 (partially over photo, partially on white)
export const AMCoverSlide = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const priceLabel = data.isRental ? 'LOCAÇÃO' : 'VENDA';
  const paymentParts = data.isRental
    ? ['Locação']
    : [
        'À vista',
        data.acceptsFinancing && 'Aceita financiamento',
        data.acceptsFGTS && 'Aceita FGTS',
      ].filter(Boolean) as string[];
  const paymentLine = paymentParts.join(' | ');

  return (
    <div
      style={{
        position: 'relative',
        width: 360,
        height: 360,
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* ── Photo card: inset 14px all sides, ends 85px from bottom ── */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          right: 14,
          bottom: 85,
          borderRadius: 22,
          overflow: 'hidden',
        }}
      >
        {photo ? (
          <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#d1d5db' }} />
        )}
      </div>

      {/* ── Orange info badge — top-left, overlaps photo ── */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          zIndex: 20,
          backgroundColor: '#F47920',
          borderRadius: 18,
          padding: '8px 13px',
          maxWidth: 210,
        }}
      >
        <p style={{ color: 'white', fontWeight: 700, fontSize: 14, lineHeight: 1.25, margin: 0 }}>
          {data.title || 'Nome do Imóvel'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px 10px', marginTop: 5 }}>
          {data.neighborhood && (
            <span style={{ color: 'white', fontSize: 11, opacity: 0.95, display: 'flex', alignItems: 'center', gap: 3 }}>
              <svg width="9" height="11" viewBox="0 0 10 13" fill="white">
                <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8C10 2.24 7.76 0 5 0zm0 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              </svg>
              {data.neighborhood}
            </span>
          )}
          {data.bedrooms > 0 && (
            <span style={{ color: 'white', fontSize: 11, opacity: 0.95, display: 'flex', alignItems: 'center', gap: 3 }}>
              <svg width="13" height="10" viewBox="0 0 16 12" fill="white">
                <path d="M1 7V3a1 1 0 011-1h4a1 1 0 011 1v1h4V3a1 1 0 011-1h4a1 1 0 011 1v4H1zm0 1h14v3H1V8z"/>
              </svg>
              {data.bedrooms} {data.bedrooms === 1 ? 'Quarto' : 'Quartos'}
            </span>
          )}
          {data.area > 0 && (
            <span style={{ color: 'white', fontSize: 11, opacity: 0.95, display: 'flex', alignItems: 'center', gap: 3 }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="white">
                <path d="M0 0v5l2-2 3 3 2-2-3-3 2-2H0zm12 12V7l-2 2-3-3-2 2 3 3-2 2h6z"/>
              </svg>
              {data.area} m²
            </span>
          )}
        </div>
      </div>

      {/* ── White logo — bottom-left OF THE PHOTO (sits on the image) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 95,
          left: 22,
          zIndex: 20,
        }}
      >
        <AMLogo width={100} variant="white" />
      </div>

      {/* ── Blue price card — bottom-right, partially over photo ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          right: 14,
          zIndex: 20,
          backgroundColor: '#1B5EA6',
          borderRadius: 20,
          padding: '11px 16px',
          minWidth: 155,
        }}
      >
        {/* VENDA / LOCAÇÃO pill */}
        <div
          style={{
            display: 'inline-block',
            color: 'white',
            fontWeight: 700,
            fontSize: 9,
            letterSpacing: '0.07em',
            backgroundColor: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: 20,
            padding: '2px 9px',
            marginBottom: 6,
          }}
        >
          {priceLabel}
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, color: 'white' }}>
          <span style={{ fontSize: 12, opacity: 0.8 }}>R$</span>
          <span style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.1 }}>
            {price > 0
              ? price.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
              : 'Consulte'}
          </span>
          {price > 0 && <span style={{ fontSize: 12, opacity: 0.8 }}>,00</span>}
        </div>

        {/* Payment line */}
        <p style={{ color: 'white', fontSize: 10, opacity: 0.85, margin: '3px 0 0', lineHeight: 1.4 }}>
          {paymentLine}
        </p>
      </div>
    </div>
  );
};

// ─── Slide 2: ESPECIFICAÇÕES ─────────────────────────────────────────────────
// White bg • logo + brand text top-left on white • photo inset with rounded
// corners (top 80px gap for logo area) • dark specs bullet box bottom-right on photo
export const AMSpecsSlide = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => {
  const specs: string[] = [
    data.bedrooms > 0 ? `${data.bedrooms} quarto${data.bedrooms > 1 ? 's' : ''}` : '',
    ...(data.rooms ? data.rooms.split('\n').filter(Boolean) : []),
    data.garageSpaces > 0 ? `${data.garageSpaces} vaga${data.garageSpaces > 1 ? 's' : ''} de garagem` : '',
    data.floor ? `${data.floor}° andar` : '',
    data.area > 0 ? `${data.area}m²` : '',
    data.suites > 0 ? `${data.suites} suíte${data.suites > 1 ? 's' : ''}` : '',
  ].filter(Boolean).slice(0, 6);

  return (
    <div
      style={{
        position: 'relative',
        width: 360,
        height: 360,
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Photo — starts 76px from top, leaving room for logo */}
      <div
        style={{
          position: 'absolute',
          top: 76,
          left: 14,
          right: 14,
          bottom: 14,
          borderRadius: 22,
          overflow: 'hidden',
        }}
      >
        {photo ? (
          <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#d1d5db' }} />
        )}
      </div>

      {/* Logo + brand text — top-left on white */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <AMLogo width={46} variant="color" />
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 10, color: '#1B5EA6', letterSpacing: '0.06em', lineHeight: 1.3 }}>APARTAMENTOS</p>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 10, color: '#1B5EA6', letterSpacing: '0.06em', lineHeight: 1.3 }}>MANAUS</p>
          <p style={{ margin: 0, fontSize: 8, color: '#9ca3af', letterSpacing: '0.1em', lineHeight: 1.3 }}>IMOBILIÁRIA</p>
        </div>
      </div>

      {/* Dark specs box — bottom-right overlaid on photo */}
      {specs.length > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 22,
            right: 22,
            zIndex: 20,
            backgroundColor: 'rgba(17, 24, 39, 0.82)',
            backdropFilter: 'blur(6px)',
            borderRadius: 16,
            padding: '10px 14px',
            maxWidth: 165,
          }}
        >
          {specs.map((spec, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 5, marginBottom: i < specs.length - 1 ? 4 : 0 }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 1, flexShrink: 0 }}>•</span>
              <span style={{ color: 'white', fontSize: 11, lineHeight: 1.4 }}>{spec}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Slide 3: LOCALIZAÇÃO ────────────────────────────────────────────────────
// White bg • two photos (right large + bottom-left smaller) both with rounded corners
// • blue card top-left on white • white logo card bottom-right on white
export const AMLocationSlide = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => {
  const address = [data.address, data.neighborhood, `${data.city} - ${data.state}`]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      style={{
        position: 'relative',
        width: 360,
        height: 360,
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Right photo — tall, right 57% */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 158,
          right: 14,
          bottom: 14,
          borderRadius: 20,
          overflow: 'hidden',
        }}
      >
        {photo ? (
          <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#d1d5db' }} />
        )}
      </div>

      {/* Bottom-left photo — square, below the blue card */}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          left: 14,
          width: 134,
          height: 110,
          borderRadius: 20,
          overflow: 'hidden',
        }}
      >
        {photo ? (
          <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '40% center', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#d1d5db' }} />
        )}
      </div>

      {/* Blue info card — top-left on white */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          zIndex: 20,
          backgroundColor: '#1B5EA6',
          borderRadius: 18,
          padding: '12px 13px',
          width: 134,
        }}
      >
        <p style={{ color: 'white', fontWeight: 700, fontSize: 13, lineHeight: 1.3, margin: '0 0 6px' }}>
          {data.title || 'Imóveis bem localizados em Manaus'}
        </p>
        {address && (
          <p style={{ color: 'white', fontSize: 10, opacity: 0.82, lineHeight: 1.4, margin: '0 0 8px' }}>
            {address}
          </p>
        )}
        {data.referencePoint && (
          <p style={{ color: 'white', fontSize: 10, opacity: 0.7, lineHeight: 1.4, margin: '0 0 8px' }}>
            {data.referencePoint}
          </p>
        )}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            backgroundColor: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 20,
            padding: '3px 9px',
            fontSize: 9,
            color: 'white',
          }}
        >
          Arraste para o lado →
        </div>
      </div>

      {/* White logo card — bottom-right on white */}
      <div
        style={{
          position: 'absolute',
          bottom: 128,
          left: 14,
          zIndex: 20,
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: '7px 9px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <AMLogo width={46} variant="color" />
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 8, color: '#1B5EA6', letterSpacing: '0.06em', lineHeight: 1.3 }}>APARTAMENTOS</p>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 8, color: '#1B5EA6', letterSpacing: '0.06em', lineHeight: 1.3 }}>MANAUS</p>
          <p style={{ margin: 0, fontSize: 7, color: '#9ca3af', letterSpacing: '0.08em' }}>IMOBILIÁRIA</p>
        </div>
      </div>
    </div>
  );
};

// ─── Slide 4+: FOTO SIMPLES ──────────────────────────────────────────────────
// White bg • logo + brand top-left on white • photo inset with rounded corners
export const AMPhotoSlide = ({
  data,
  photo,
  photoIndex,
}: {
  data: AMPropertyData;
  photo: string;
  photoIndex: number;
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width: 360,
        height: 360,
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Photo — starts 76px from top */}
      <div
        style={{
          position: 'absolute',
          top: 76,
          left: 14,
          right: 14,
          bottom: 14,
          borderRadius: 22,
          overflow: 'hidden',
        }}
      >
        <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>

      {/* Logo + brand text — top-left on white */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <AMLogo width={46} variant="color" />
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 10, color: '#1B5EA6', letterSpacing: '0.06em', lineHeight: 1.3 }}>APARTAMENTOS</p>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 10, color: '#1B5EA6', letterSpacing: '0.06em', lineHeight: 1.3 }}>MANAUS</p>
          <p style={{ margin: 0, fontSize: 8, color: '#9ca3af', letterSpacing: '0.1em', lineHeight: 1.3 }}>IMOBILIÁRIA</p>
        </div>
      </div>
    </div>
  );
};

// ─── Último Slide: INFORMAÇÃO ─────────────────────────────────────────────────
// White bg • photo fills inner rounded card (inset 14px all sides) with dark
// overlay • white-bordered text box inside • white logo card bottom-right
export const AMInfoSlide = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => {
  const headline =
    data.infoMessage ||
    'A Apartamentos Manaus acompanha você em todas as etapas da escolha do seu imóvel.';
  const subtitle =
    'Encontrar o imóvel ideal pode ser mais simples do que parece. A Apartamentos Manaus orienta você sobre as possibilidades de financiamento e acompanha todo o processo com transparência.';

  return (
    <div
      style={{
        position: 'relative',
        width: 360,
        height: 360,
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Photo card — inset 14px all sides */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          right: 14,
          bottom: 14,
          borderRadius: 22,
          overflow: 'hidden',
        }}
      >
        {photo && (
          <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.58)' }} />
      </div>

      {/* White-bordered content box on top of photo */}
      <div
        style={{
          position: 'absolute',
          top: 28,
          left: 28,
          right: 28,
          bottom: 28,
          zIndex: 20,
          border: '2px solid rgba(255,255,255,0.5)',
          borderRadius: 14,
          padding: '16px 14px 12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h2 style={{ color: 'white', fontWeight: 700, fontSize: 17, lineHeight: 1.35, margin: '0 0 8px' }}>
            {headline}
          </h2>
          <p style={{ color: 'white', fontSize: 10, opacity: 0.82, lineHeight: 1.5, margin: 0 }}>
            {subtitle}
          </p>
        </div>

        {/* Logo card bottom-right */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderRadius: 12,
              padding: '7px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <AMLogo width={40} variant="color" />
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 8, color: '#1B5EA6', letterSpacing: '0.05em', lineHeight: 1.3 }}>AP. MANAUS</p>
              <p style={{ margin: 0, fontSize: 7, color: '#9ca3af', letterSpacing: '0.08em' }}>IMOBILIÁRIA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// Layout: white background • photo fills right ~72% with rounded-left corners
// touching the right/top/bottom edges • orange info badge top-left overlapping
// the white+photo boundary • white logo bottom-left on white area •
// blue price card bottom-right floating on photo
export const AMCoverSlide = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const priceLabel = data.isRental ? 'LOCAÇÃO' : 'VENDA';
  const paymentParts = data.isRental
    ? ['Locação']
    : [
        'À vista',
        data.acceptsFinancing && 'Aceita financiamento',
        data.acceptsFGTS && 'Aceita FGTS',
      ].filter(Boolean) as string[];
  const paymentLine = paymentParts.join(' | ');

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 360,
        height: 360,
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Photo — covers right portion, left edge rounded, right edges flush */}
      {photo && (
        <div
          className="absolute overflow-hidden"
          style={{
            top: 14,
            left: 90,
            right: 0,
            bottom: 14,
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
          }}
        >
          <img src={photo} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Orange info badge — top-left, overlaps white+photo boundary */}
      <div
        className="absolute z-10"
        style={{
          top: 14,
          left: 14,
          backgroundColor: '#F47920',
          borderRadius: 16,
          padding: '8px 12px',
          maxWidth: 200,
        }}
      >
        <p className="text-white font-bold leading-tight" style={{ fontSize: 13 }}>
          {data.title || 'Nome do Imóvel'}
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
          {data.neighborhood && (
            <span className="text-white opacity-90 flex items-center gap-0.5" style={{ fontSize: 10 }}>
              <svg width="8" height="10" viewBox="0 0 10 12" fill="white">
                <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 7 5 7s5-3.25 5-7c0-2.76-2.24-5-5-5zm0 6.5C4.17 6.5 3.5 5.83 3.5 5S4.17 3.5 5 3.5 6.5 4.17 6.5 5 5.83 6.5 5 6.5z"/>
              </svg>
              {data.neighborhood}
            </span>
          )}
          {data.bedrooms > 0 && (
            <span className="text-white opacity-90" style={{ fontSize: 10 }}>
              🛏 {data.bedrooms} {data.bedrooms === 1 ? 'Quarto' : 'Quartos'}
            </span>
          )}
          {data.area > 0 && (
            <span className="text-white opacity-90" style={{ fontSize: 10 }}>
              📐 {data.area} m²
            </span>
          )}
        </div>
      </div>

      {/* Bottom-left: white logo on white background */}
      <div className="absolute z-10" style={{ bottom: 20, left: 14 }}>
        <AMLogo width={75} variant="color" />
      </div>

      {/* Bottom-right: blue price card floating on photo */}
      <div
        className="absolute z-10"
        style={{
          bottom: 18,
          right: 12,
          backgroundColor: '#1B5EA6',
          borderRadius: 18,
          padding: '10px 14px',
          minWidth: 148,
        }}
      >
        {/* VENDA badge */}
        <div
          className="inline-block text-white font-bold"
          style={{
            fontSize: 9,
            letterSpacing: '0.06em',
            backgroundColor: 'rgba(255,255,255,0.22)',
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: 20,
            padding: '2px 8px',
            marginBottom: 4,
          }}
        >
          {priceLabel}
        </div>

        {/* Price row */}
        <div className="text-white flex items-baseline gap-0.5">
          <span style={{ fontSize: 11, opacity: 0.8 }}>R$</span>
          <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}>
            {price > 0
              ? price.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
              : 'Consulte'}
          </span>
          {price > 0 && <span style={{ fontSize: 11, opacity: 0.8 }}>,00</span>}
        </div>

        {/* Payment methods */}
        <p className="text-white" style={{ fontSize: 10, opacity: 0.82, marginTop: 2 }}>
          {paymentLine}
        </p>
      </div>
    </div>
  );
};

// ─── Slide 2: ESPECIFICAÇÕES ─────────────────────────────────────────────────
// Layout: white background • main photo as large rounded card (slight inset all sides)
// logo + text "APARTAMENTOS MANAUS / IMOBILIÁRIA" top-left on white area
// dark rounded specs box bottom-right overlaid on photo
export const AMSpecsSlide = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => {
  const specs: string[] = [
    data.bedrooms > 0 ? `${data.bedrooms} quarto${data.bedrooms > 1 ? 's' : ''}` : '',
    ...(data.rooms ? data.rooms.split('\n').filter(Boolean) : []),
    data.garageSpaces > 0 ? `${data.garageSpaces} vaga${data.garageSpaces > 1 ? 's' : ''} de garagem` : '',
    data.floor ? `${data.floor}° andar` : '',
    data.area > 0 ? `${data.area}m²` : '',
    data.suites > 0 ? `${data.suites} suíte${data.suites > 1 ? 's' : ''}` : '',
  ].filter(Boolean).slice(0, 6);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 360,
        height: 360,
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Photo — large rounded card, inset 14px on all sides */}
      {photo && (
        <div
          className="absolute overflow-hidden"
          style={{
            top: 80,
            left: 14,
            right: 0,
            bottom: 0,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <img src={photo} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Top area: logo + brand text on white */}
      <div
        className="absolute z-10 flex items-center gap-2"
        style={{ top: 16, left: 14 }}
      >
        <AMLogo width={52} variant="color" />
        <div>
          <p className="font-bold" style={{ fontSize: 11, color: '#1B5EA6', letterSpacing: '0.05em' }}>
            APARTAMENTOS
          </p>
          <p className="font-bold" style={{ fontSize: 11, color: '#1B5EA6', letterSpacing: '0.05em' }}>
            MANAUS
          </p>
          <p style={{ fontSize: 9, color: '#6b7280', letterSpacing: '0.08em' }}>IMOBILIÁRIA</p>
        </div>
      </div>

      {/* Dark specs box — bottom-right, overlaid on photo */}
      {specs.length > 0 && (
        <div
          className="absolute z-10"
          style={{
            bottom: 16,
            right: 14,
            backgroundColor: 'rgba(31, 41, 55, 0.84)',
            backdropFilter: 'blur(6px)',
            borderRadius: 16,
            padding: '10px 14px',
            maxWidth: 170,
          }}
        >
          {specs.map((spec, i) => (
            <div key={i} className="flex items-start gap-1.5" style={{ marginBottom: i < specs.length - 1 ? 3 : 0 }}>
              <span className="text-white" style={{ fontSize: 10, opacity: 0.6, marginTop: 1 }}>•</span>
              <span className="text-white" style={{ fontSize: 11, lineHeight: 1.4 }}>{spec}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Slide 3: LOCALIZAÇÃO ────────────────────────────────────────────────────
// Layout: white background • TWO photos with rounded corners
// (bottom-left smaller + right larger) • blue card top-left on white •
// white logo card bottom-right on white
export const AMLocationSlide = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => {
  const address = [
    data.address,
    data.neighborhood ? `${data.neighborhood}` : '',
    `${data.city} - ${data.state}`,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 360,
        height: 360,
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Right photo — large, takes right 55%, with rounded corners */}
      {photo && (
        <div
          className="absolute overflow-hidden"
          style={{
            top: 14,
            left: 152,
            right: 0,
            bottom: 0,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 14,
          }}
        >
          <img src={photo} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Bottom-left photo — smaller square with rounded corners */}
      {photo && (
        <div
          className="absolute overflow-hidden"
          style={{
            bottom: 0,
            left: 14,
            width: 128,
            height: 148,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <img src={photo} alt="" className="w-full h-full object-cover" style={{ objectPosition: '30% center' }} />
        </div>
      )}

      {/* Top-left: blue info card on white */}
      <div
        className="absolute z-10"
        style={{
          top: 14,
          left: 14,
          backgroundColor: '#1B5EA6',
          borderRadius: 18,
          padding: '12px 14px',
          maxWidth: 172,
        }}
      >
        <p className="text-white font-bold leading-snug" style={{ fontSize: 13, marginBottom: 6 }}>
          {data.title || 'Imóveis bem localizados em Manaus'}
        </p>
        {address && (
          <p className="text-white leading-snug" style={{ fontSize: 10, opacity: 0.82, marginBottom: 8 }}>
            {address}
          </p>
        )}
        {data.referencePoint && (
          <p className="text-white leading-snug" style={{ fontSize: 10, opacity: 0.7, marginBottom: 8 }}>
            {data.referencePoint}
          </p>
        )}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            backgroundColor: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: 20,
            padding: '3px 10px',
            fontSize: 10,
            color: 'white',
          }}
        >
          Arraste para o lado →
        </div>
      </div>

      {/* Bottom-right: white logo panel on white background */}
      <div
        className="absolute z-10 flex items-center gap-2"
        style={{
          bottom: 14,
          right: 12,
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 14,
          padding: '8px 10px',
        }}
      >
        <AMLogo width={56} variant="color" />
        <div>
          <p style={{ fontSize: 9, fontWeight: 700, color: '#1B5EA6', letterSpacing: '0.05em' }}>APARTAMENTOS</p>
          <p style={{ fontSize: 9, fontWeight: 700, color: '#1B5EA6', letterSpacing: '0.05em' }}>MANAUS</p>
          <p style={{ fontSize: 8, color: '#9ca3af', letterSpacing: '0.08em' }}>IMOBILIÁRIA</p>
        </div>
      </div>
    </div>
  );
};

// ─── Slide 4+: FOTO ──────────────────────────────────────────────────────────
// Layout: white background • photo as rounded card with ~14px inset all sides
// logo + brand text top-left on white area
export const AMPhotoSlide = ({
  data,
  photo,
  photoIndex,
}: {
  data: AMPropertyData;
  photo: string;
  photoIndex: number;
}) => {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 360,
        height: 360,
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Photo — large rounded card, full height with top gap for logo */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: 78,
          left: 14,
          right: 0,
          bottom: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <img src={photo} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Top: logo + brand text on white */}
      <div
        className="absolute z-10 flex items-center gap-2"
        style={{ top: 16, left: 14 }}
      >
        <AMLogo width={52} variant="color" />
        <div>
          <p className="font-bold" style={{ fontSize: 11, color: '#1B5EA6', letterSpacing: '0.05em' }}>
            APARTAMENTOS
          </p>
          <p className="font-bold" style={{ fontSize: 11, color: '#1B5EA6', letterSpacing: '0.05em' }}>
            MANAUS
          </p>
          <p style={{ fontSize: 9, color: '#6b7280', letterSpacing: '0.08em' }}>IMOBILIÁRIA</p>
        </div>
      </div>
    </div>
  );
};

// ─── Último Slide: INFORMAÇÃO ─────────────────────────────────────────────────
// Layout: white background • photo fills inner rounded rectangle
// dark overlay over photo • white-bordered rounded content box inside
// white logo card bottom-right
export const AMInfoSlide = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => {
  const headline =
    data.infoMessage ||
    'A Apartamentos Manaus acompanha você em todas as etapas da escolha do seu imóvel.';
  const subtitle =
    'Encontrar o imóvel ideal pode ser mais simples do que parece. A Apartamentos Manaus orienta você sobre as possibilidades de financiamento e acompanha todo o processo com transparência.';

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 360,
        height: 360,
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Photo — rounded card inset 14px all sides */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: 14,
          left: 14,
          right: 14,
          bottom: 14,
          borderRadius: 22,
        }}
      >
        {photo && (
          <img src={photo} alt="" className="w-full h-full object-cover" />
        )}
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.58)' }}
        />
      </div>

      {/* White-bordered content box overlaid on photo */}
      <div
        className="absolute z-10 flex flex-col justify-between"
        style={{
          top: 28,
          left: 28,
          right: 28,
          bottom: 28,
          border: '2px solid rgba(255,255,255,0.55)',
          borderRadius: 14,
          padding: '16px 14px 12px 14px',
        }}
      >
        <div>
          <h2
            className="text-white font-bold leading-tight"
            style={{ fontSize: 17, marginBottom: 8 }}
          >
            {headline}
          </h2>
          <p
            className="text-white leading-snug"
            style={{ fontSize: 10, opacity: 0.82 }}
          >
            {subtitle}
          </p>
        </div>

        {/* Bottom-right: white logo card */}
        <div className="flex justify-end">
          <div
            className="flex items-center gap-2"
            style={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderRadius: 12,
              padding: '6px 10px',
            }}
          >
            <AMLogo width={44} variant="color" />
            <div>
              <p style={{ fontSize: 8, fontWeight: 700, color: '#1B5EA6', letterSpacing: '0.05em' }}>AP. MANAUS</p>
              <p style={{ fontSize: 7, color: '#9ca3af', letterSpacing: '0.08em' }}>IMOBILIÁRIA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
