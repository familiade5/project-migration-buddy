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
// Exact analysis of Capa_png-3.png:
//
//  PHOTO: rounded rect, ~8px margin on top/left/right, ends ~82px from bottom.
//  border-radius 22px all corners. The 4 rounded corners expose the white slide
//  background — this IS the "white border contouring the frames" effect.
//
//  ORANGE BADGE: top=4, left=4. Sits mostly on top of the photo's top-left
//  rounded corner, causing the white arc of that corner to appear AROUND the badge.
//
//  WHITE LOGO: on the photo, bottom-left area. bottom ≈ 88px, left=18px.
//  Uses white (inverted) version since it sits on the photo.
//
//  BLUE PRICE CARD: bottom=10, right=10. Sits in the white strip below the photo,
//  extending slightly upward to overlap the photo's bottom edge.
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
      {/* ── PHOTO: full bleed with 8px margin top/sides, 8px bottom (same as blue card) ── */}
      {/* Rounded corners create white arcs that "contour" the badges */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          right: 8,
          bottom: 8,
          borderRadius: 22,
          overflow: 'hidden',
        }}
      >
        {photo ? (
          <img
            src={photo}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#d1d5db' }} />
        )}
      </div>

      {/* ── ORANGE BADGE: ~60% width, white ring contour ── */}
      <div
        style={{
          position: 'absolute',
          top: 4,
          left: 4,
          width: 210,
          zIndex: 20,
          backgroundColor: '#F47920',
          borderRadius: 17,
          padding: '8px 14px 9px',
          boxShadow: '0 0 0 5px #ffffff',
        }}
      >
        <p style={{ color: 'white', fontWeight: 700, fontSize: 15, lineHeight: 1.25, margin: 0 }}>
          {data.title || 'Nome do Imóvel'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '5px 10px', marginTop: 5 }}>
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
              <svg width="14" height="10" viewBox="0 0 18 12" fill="white">
                <path d="M1 8V4a1 1 0 011-1h4a1 1 0 011 1v1h4V4a1 1 0 011-1h4a1 1 0 011 1v4H1zm0 1h16v3H1V9z"/>
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

      {/* ── WHITE LOGO: bottom-left footer, on the photo ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 18,
          left: 18,
          zIndex: 20,
        }}
      >
        <AMLogo width={106} variant="white" />
      </div>

      {/* ── BLUE PRICE CARD: compact height, white ring contour ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          zIndex: 20,
          backgroundColor: '#1B5EA6',
          borderRadius: 20,
          padding: '3px 12px 4px',
          minWidth: 170,
          boxShadow: '0 0 0 5px #ffffff',
        }}
      >
        {/* VENDA/LOCAÇÃO pill */}
        <div
          style={{
            display: 'inline-block',
            color: 'white',
            fontWeight: 700,
            fontSize: 9,
            letterSpacing: '0.08em',
            backgroundColor: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: 20,
            padding: '1px 10px',
            marginBottom: 4,
          }}
        >
          {priceLabel}
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, color: 'white' }}>
          <span style={{ fontSize: 11, opacity: 0.75, marginRight: 2 }}>R$</span>
          <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
            {price > 0
              ? price.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
              : 'Consulte'}
          </span>
          {price > 0 && <span style={{ fontSize: 11, opacity: 0.75 }}>,00</span>}
        </div>

        {/* Payment separator line */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', marginTop: 4, paddingTop: 3 }}>
          <p style={{ color: 'white', fontSize: 9, opacity: 0.9, margin: 0, lineHeight: 1.3 }}>
            {paymentLine}
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Slide 2: ESPECIFICAÇÕES ─────────────────────────────────────────────────
//
// SINGLE CONTINUOUS PATH with SMOOTH BEZIER CURVES:
//   One vector path defines the entire image container shape.
//   Outer corners use arc segments (r=22).
//   Notch corners use quadratic bezier curves (Q) for smooth, organic transitions.
//
//   Path walkthrough (clockwise from top, right of notch):
//     M 168 8          → start at top edge, right end of notch
//     H 330            → right along top edge
//     A 22,22 → 352,30 → top-right outer convex corner
//     V 330            → down right edge
//     A 22,22 → 330,352→ bottom-right outer convex corner
//     H 30             → left along bottom edge
//     A 22,22 → 8,330  → bottom-left outer convex corner
//     V 98             → up left edge, stop before notch bottom
//     Q 8,80 → 26,80   → smooth concave curve into notch bottom-left corner
//     H 150            → along notch bottom
//     Q 168,80 → 168,62→ smooth convex curve out of notch bottom-right corner
//     V 8 Z            → up right notch edge to start
//
//   Logo card: top=4, left=4, w=164, h=76, r=18
//   Notch: x 8→168, y 8→80, Q radius ≈ 18
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

  // One continuous path — smooth Q bezier curves at the notch corners,
  // standard A arcs at the three outer rounded corners.
  // Path starts at (330, 8) — the exact entry point of the top-right arc —
  // so the arc comes FIRST with no straight segment before it.
  // The top edge (168→330 at y=8) is the LAST segment before Z.
  const shapePath = [
    'M 330 8',               // start directly at top-right arc entry
    'A 22 22 0 0 1 352 30',  // top-right outer corner (r=22) — no straight before it
    'V 330',                 // right edge downward
    'A 22 22 0 0 1 330 352', // bottom-right outer corner (r=22)
    'H 30',                  // bottom edge leftward
    'A 22 22 0 0 1 8 330',   // bottom-left outer corner (r=22)
    'V 98',                  // left edge upward to notch start
    'Q 8 80 26 80',          // smooth concave curve into notch bottom-left
    'H 150',                 // notch bottom rightward
    'Q 168 80 168 62',       // smooth convex curve up notch bottom-right
    'V 8',                   // up notch right edge to top
    'H 330',                 // top edge back to arc start
    'Z',
  ].join(' ');

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>

      {/* ── clipPath definition — 0×0 SVG keeps it out of flow but in the DOM ── */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      >
        <defs>
          <clipPath id="am-specs-shape" clipPathUnits="userSpaceOnUse">
            <path d={shapePath} />
          </clipPath>
        </defs>
      </svg>

      {/* ── Image container — clip-path applied directly to this div ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 360,
          height: 360,
          clipPath: 'url(#am-specs-shape)',
          zIndex: 10,
        }}
      >
        {photo ? (
          <img
            src={photo}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#d1d5db' }} />
        )}
      </div>

      {/* ── Logo card — sits in the notch (z-index below image) ── */}
      <div style={{
        position: 'absolute',
        top: 4,
        left: 4,
        width: 164,
        height: 76,
        borderRadius: 18,
        backgroundColor: '#ffffff',
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 12,
        paddingRight: 12,
        boxSizing: 'border-box',
      }}>
        <AMLogo width={140} variant="color" />
      </div>

      {/* ── Specs card ── */}
      {specs.length > 0 && (
        <div style={{
          position: 'absolute', bottom: 22, right: 22, zIndex: 20,
          backgroundColor: 'rgba(17,24,39,0.75)', backdropFilter: 'blur(6px)',
          borderRadius: 14, padding: '10px 14px', maxWidth: 165,
        }}>
          {specs.map((spec, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 5, marginBottom: i < specs.length - 1 ? 4 : 0 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 1, flexShrink: 0 }}>•</span>
              <span style={{ color: 'white', fontSize: 11, lineHeight: 1.4 }}>{spec}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// ─── Slide 3: LOCALIZAÇÃO ────────────────────────────────────────────────────
// White bg • right photo (large, rounded) + bottom-left photo (smaller, rounded)
// • blue info card top-left • white logo panel between cards on left
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

      {/* Bottom-left photo */}
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

      {/* Blue info card — top-left */}
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

      {/* White logo card — mid-left between the two left panels */}
      <div
        style={{
          position: 'absolute',
          bottom: 134,
          left: 14,
          zIndex: 20,
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: '7px 9px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          width: 134,
        }}
      >
        <AMLogo width={42} variant="color" />
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 8, color: '#1B5EA6', letterSpacing: '0.05em', lineHeight: 1.3 }}>APARTAMENTOS</p>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 8, color: '#1B5EA6', letterSpacing: '0.05em', lineHeight: 1.3 }}>MANAUS</p>
          <p style={{ margin: 0, fontSize: 7, color: '#9ca3af', letterSpacing: '0.08em' }}>IMOBILIÁRIA</p>
        </div>
      </div>
    </div>
  );
};

// ─── Slide 4+: FOTO SIMPLES ──────────────────────────────────────────────────
// White bg • logo + brand top-left on white • photo as rounded card below
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
// White bg • photo fills inner rounded card (inset 14px) with dark overlay
// • white-bordered text box inside • white logo card bottom-right
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
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.58)' }} />
      </div>

      {/* White-bordered content box */}
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
