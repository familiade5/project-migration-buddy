import { useId } from 'react';
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
  const uid = useId();
  const clipId = `am-cover-${uid}`;

  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const priceLabel = data.isRental ? 'LOCAÇÃO' : 'VENDA';
  const paymentParts = data.isRental
    ? ['Locação']
    : [
        'À vista',
        data.acceptsFinancing && 'Aceita financiamento',
      ].filter(Boolean) as string[];
  const paymentLine = paymentParts.join(' | ');

  const shapePath = [
    'M 352 246',
    'A 22 22 0 0 1 330 268',
    'H 192',
    'Q 174 268 174 286',
    'V 334',
    'A 22 22 0 0 1 152 352',
    'H 30',
    'A 22 22 0 0 1 8 330',
    'V 84',
    'Q 8 66 26 66',
    'H 200',
    'Q 218 66 218 48',
    'V 30',
    'A 22 22 0 0 1 240 8',
    'H 330',
    'A 22 22 0 0 1 352 30',
    'Z',
  ].join(' ');

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
      {/* ── clipPath definition ── */}
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={shapePath} />
          </clipPath>
        </defs>
      </svg>

      {/* ── ORANGE BADGE — zIndex:5, sits inside the carved notch ── */}
      <div
        style={{
          position: 'absolute',
          top: 4,
          left: 4,
          width: 210,
          zIndex: 5,
          backgroundColor: '#F47920',
          borderRadius: 17,
          padding: '8px 14px 9px',
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

      {/* ── PHOTO — clipPath applied directly to the visible element ── */}
      {photo ? (
        <img
          src={photo}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 360,
            height: 360,
            objectFit: 'cover',
            display: 'block',
            clipPath: `url(#${clipId})`,
            zIndex: 10,
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 360,
            height: 360,
            backgroundColor: '#d1d5db',
            clipPath: `url(#${clipId})`,
            zIndex: 10,
          }}
        />
      )}

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
          bottom: 11,
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
    'A 22 22 0 0 1 352 30',  // top-right outer corner (r=22)
    'V 330',                 // right edge downward
    'A 22 22 0 0 1 330 352', // bottom-right outer corner (r=22)
    'H 30',                  // bottom edge leftward
    'A 22 22 0 0 1 8 330',   // bottom-left outer corner (r=22)
    'V 98',                  // left edge upward to notch start
    'Q 8 80 26 80',          // smooth concave curve into notch bottom-left
    'H 150',                 // notch bottom rightward
    'Q 168 80 168 62',       // smooth convex curve up notch bottom-right
    'V 30',                  // up notch right edge — stop 22px before top
    'A 22 22 0 0 1 190 8',   // round the top-notch corner (r=22, CW) ← corrected sweep
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
          borderRadius: 12, padding: '7px 12px', maxWidth: 155,
        }}>
          {specs.map((spec, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: i < specs.length - 1 ? 2 : 0 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 1, flexShrink: 0 }}>•</span>
              <span style={{ color: 'white', fontSize: 10, lineHeight: 1.3 }}>{spec}</span>
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

  // Clip path com DOIS nichos: superior-esquerdo (card azul) e inferior-direito (card logo).
  // Notch azul: x 14→170, y 14→172. Notch logo: x 210→346, y 282→346.
  // Card logo: bottom=14, right=14, width=120, height=52.
  // Card top: y=360-14-52=294. Notch top y=282 (12px acima do card → gap visual correto).
  // Left wall: y=304→324 = 20px reta (sem deformação).
  const shapePath = [
    'M 192 14',              // top edge start (notch-azul right x=170 + r=22)
    'H 324',                 // top edge rightward
    'A 22 22 0 0 1 346 36',  // top-right outer convex corner
    'V 260',                 // right edge down (282-22=260)
    'Q 346 282 324 282',     // concave at top-right of logo notch (notch topo y=282)
    'H 232',                 // logo notch top leftward (210+22=232)
    'Q 210 282 210 304',     // concave at top-left of logo notch (282+22=304)
    'V 324',                 // down logo notch left wall 304→324 = 20px reta
    'A 22 22 0 0 1 188 346', // canto inferior-esquerdo (210-22=188, down→left, CW)
    'H 36',                  // bottom edge leftward
    'A 22 22 0 0 1 14 324',  // bottom-left outer convex corner
    'V 194',                 // left edge upward to blue notch (172+22=194)
    'Q 14 172 36 172',       // concave at bottom-left of blue notch
    'H 148',                 // blue notch bottom (170-22=148)
    'Q 170 172 170 150',     // concave at bottom-right of blue notch (172-22=150)
    'V 36',                  // up notch right edge (stopping r=22 before top)
    'A 22 22 0 0 1 192 14',  // convex outer corner at top of notch
    'Z',
  ].join(' ');

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
      {/* clipPath definition */}
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <clipPath id="am-location-photo-clip" clipPathUnits="userSpaceOnUse">
            <path d={shapePath} />
          </clipPath>
        </defs>
      </svg>

      {/* Photo — single image, L-shaped clip */}
      {photo ? (
        <img
          src={photo}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 360,
            height: 360,
            objectFit: 'cover',
            display: 'block',
            clipPath: 'url(#am-location-photo-clip)',
            zIndex: 10,
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 360,
            height: 360,
            backgroundColor: '#d1d5db',
            clipPath: 'url(#am-location-photo-clip)',
            zIndex: 10,
          }}
        />
      )}

      {/* Blue info card — height:150 → bottom at y=164, alinhado ao notch */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          zIndex: 20,
          backgroundColor: '#1B5EA6',
          borderRadius: 18,
          padding: '14px 13px 12px',
          width: 148,
          height: 150,
          boxSizing: 'border-box',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p style={{ color: 'white', fontWeight: 700, fontSize: 14, lineHeight: 1.3, margin: '0 0 6px' }}>
            {data.title || 'Imóveis bem localizados em Manaus'}
          </p>
          {address && (
            <p style={{ color: 'white', fontSize: 10, opacity: 0.82, lineHeight: 1.4, margin: 0 }}>
              {address}
            </p>
          )}
          {data.referencePoint && (
            <p style={{ color: 'white', fontSize: 10, opacity: 0.7, lineHeight: 1.4, margin: '4px 0 0' }}>
              {data.referencePoint}
            </p>
          )}
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            backgroundColor: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: 20,
            padding: '4px 10px',
            fontSize: 9,
            color: 'white',
            alignSelf: 'flex-start',
          }}
        >
          Arraste para o lado →
        </div>
      </div>

      {/* Logo card — encaixado no notch inferior-direito */}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          right: 14,
          zIndex: 20,
          backgroundColor: '#ffffff',
          borderRadius: 12,
          width: 120,
          height: 52,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          padding: '2px 4px',
        }}
      >
        <AMLogo width={116} variant="color" />
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
// Mesmo padrão do Slide 3: clip-path com nicho recortado para o card da logo.
// Logo card em zIndex 5 (abaixo da foto), foto em zIndex 10 contornando o nicho.
// Overlay escuro dentro da foto. Texto sobreposto em zIndex 20.
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

  // Foto inset 14px. Nicho logo: bottom=14, right=14, w=120, h=52.
  // Slide coords logo: top=294, left=226. Margem de 8px → nicho top_y=286, left_x=218.
  // Bordas externas: r=22. Curvas côncavas Q idênticas ao Slide 3.
  const shapePath = [
    'M 324 14',              // top edge start, right of top-left arc
    'A 22 22 0 0 1 346 36',  // top-right outer corner
    'V 264',                 // right edge down (286 - 22 = 264)
    'Q 346 286 324 286',     // côncava → entrada do nicho superior-direito
    'H 240',                 // nicho topo esquerdo (218 + 22 = 240)
    'Q 218 286 218 308',     // côncava → entrada do nicho superior-esquerdo
    'V 324',                 // desce parede esquerda do nicho (346 - 22 = 324)
    'A 22 22 0 0 1 196 346', // canto inferior-esquerdo do nicho (218 - 22 = 196)
    'H 36',                  // borda inferior
    'A 22 22 0 0 1 14 324',  // canto inferior-esquerdo externo
    'V 36',                  // sobe borda esquerda
    'A 22 22 0 0 1 36 14',   // canto superior-esquerdo externo
    'H 324',                 // topo de volta
    'Z',
  ].join(' ');

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
      {/* clipPath definition */}
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <clipPath id="am-info-photo-clip" clipPathUnits="userSpaceOnUse">
            <path d={shapePath} />
          </clipPath>
        </defs>
      </svg>

      {/* Logo card — zIndex 5, fica no nicho abaixo da foto */}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          right: 14,
          zIndex: 5,
          backgroundColor: '#ffffff',
          borderRadius: 12,
          width: 120,
          height: 52,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          padding: '2px 4px',
        }}
      >
        <AMLogo width={116} variant="color" />
      </div>

      {/* Foto — clip-path recortando o nicho da logo, zIndex 10 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 360,
          height: 360,
          clipPath: 'url(#am-info-photo-clip)',
          zIndex: 10,
          overflow: 'hidden',
        }}
      >
        {photo ? (
          <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#374151' }} />
        )}
        {/* Overlay gradiente — escuro à esquerda (texto), transparente à direita (foto visível) */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.12) 100%)' }} />
      </div>

      {/* Texto — confinado à metade esquerda, dimensões fiéis ao modelo */}
      <div
        style={{
          position: 'absolute',
          top: 36,
          left: 26,
          zIndex: 20,
          maxWidth: 196,
        }}
      >
        <h2 style={{
          color: 'white',
          fontWeight: 800,
          fontSize: 20,
          lineHeight: 1.28,
          margin: '0 0 9px',
          letterSpacing: '-0.01em',
        }}>
          {headline}
        </h2>
        <p style={{
          color: 'white',
          fontSize: 10.5,
          opacity: 0.9,
          lineHeight: 1.58,
          margin: 0,
          maxWidth: 186,
        }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
};
