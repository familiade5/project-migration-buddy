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
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: '3px 7px', marginTop: 5 }}>
          {data.neighborhood && (
            <span style={{ color: 'white', fontSize: 10, opacity: 0.95, display: 'flex', alignItems: 'center', gap: 2, whiteSpace: 'nowrap' }}>
              <svg width="8" height="10" viewBox="0 0 10 13" fill="white">
                <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8C10 2.24 7.76 0 5 0zm0 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              </svg>
              {data.neighborhood}
            </span>
          )}
          {data.bedrooms > 0 && (
            <span style={{ color: 'white', fontSize: 10, opacity: 0.95, display: 'flex', alignItems: 'center', gap: 2, whiteSpace: 'nowrap' }}>
              <svg width="12" height="9" viewBox="0 0 18 12" fill="white">
                <path d="M1 8V4a1 1 0 011-1h4a1 1 0 011 1v1h4V4a1 1 0 011-1h4a1 1 0 011 1v4H1zm0 1h16v3H1V9z"/>
              </svg>
              {data.bedrooms} {data.bedrooms === 1 ? 'Qto' : 'Qtos'}
            </span>
          )}
          {data.area > 0 && (
            <span style={{ color: 'white', fontSize: 10, opacity: 0.95, display: 'flex', alignItems: 'center', gap: 2, whiteSpace: 'nowrap' }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="white">
                <path d="M0 0v5l2-2 3 3 2-2-3-3 2-2H0zm12 12V7l-2 2-3-3-2 2 3 3-2 2h6z"/>
              </svg>
              {data.area}m²
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
  const uid = useId();
  const clipId = `am-specs-${uid}`;
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
  // Notch top-left reduzido: w=120, h=52. Bordas externas mantidas (330→352, etc.)
  const shapePath = [
    'M 330 8',               // top-right arc entry — borda externa mantida
    'A 22 22 0 0 1 352 30',  // top-right outer corner
    'V 330',                 // right edge full height
    'A 22 22 0 0 1 330 352', // bottom-right outer corner
    'H 30',                  // bottom edge full width
    'A 22 22 0 0 1 8 330',   // bottom-left outer corner
    'V 74',                  // left edge up to notch start (52+22=74)
    'Q 8 52 26 52',          // concave into notch bottom-left
    'H 98',                  // notch bottom (120-22=98)
    'Q 120 52 120 30',       // convex up notch right corner (52-22=30)
    'V 30',                  // up notch right wall to arc
    'A 22 22 0 0 1 142 8',   // round top-notch corner (120+22=142)
    'H 330',                 // top edge back
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
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
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
          clipPath: `url(#${clipId})`,
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
        width: 116,
        height: 52,
        borderRadius: 14,
        backgroundColor: '#ffffff',
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 8,
        paddingRight: 8,
        boxSizing: 'border-box',
      }}>
        <AMLogo width={100} variant="color" />
      </div>

      {/* ── Specs card ── */}
      {specs.length > 0 && (
        <div style={{
          position: 'absolute', bottom: 18, right: 18, zIndex: 20,
          backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: 8, padding: '3px 9px', maxWidth: 116,
          border: '1px solid rgba(255,255,255,0.10)',
        }}>
          {specs.map((spec, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: i < specs.length - 1 ? 1 : 0 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 8, marginTop: 1, flexShrink: 0 }}>•</span>
              <span style={{ color: 'white', fontSize: 8, lineHeight: 1.2 }}>{spec}</span>
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
  const uid = useId();
  const clipId = `am-location-${uid}`;

  // Apenas o endereço digitado — cidade/estado e bairro NÃO são adicionados automaticamente
  const address = data.address || '';

  // Clip path com DOIS nichos: superior-esquerdo (card azul) e inferior-direito (card logo).
  // Notch azul: x 14→170, y 14→172 (mantido). Notch logo reduzido: x 250→346, y 300→346.
  // Card logo: bottom=14, right=14, width=96, height=32.
  const shapePath = [
    'M 192 14',              // top edge start
    'H 324',                 // top edge rightward
    'A 22 22 0 0 1 346 36',  // top-right outer convex corner
    'V 278',                 // right edge down (300-22=278)
    'Q 346 300 324 300',     // concave at top-right of logo notch
    'H 272',                 // logo notch top leftward (250+22=272)
    'Q 250 300 250 322',     // concave at top-left of logo notch
    'V 324',                 // down logo notch left wall
    'A 22 22 0 0 1 228 346', // canto inferior-esquerdo (250-22=228)
    'H 36',                  // bottom edge leftward
    'A 22 22 0 0 1 14 324',  // bottom-left outer convex corner
    'V 194',                 // left edge upward to blue notch
    'Q 14 172 36 172',       // concave at bottom-left of blue notch
    'H 148',                 // blue notch bottom
    'Q 170 172 170 150',     // concave at bottom-right of blue notch
    'V 36',
    'A 22 22 0 0 1 192 14',
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
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
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

      {/* Blue info card */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          zIndex: 20,
          backgroundColor: '#1B5EA6',
          borderRadius: 15,
          padding: '11px 11px 10px',
          width: 124,
          height: 120,
          boxSizing: 'border-box',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p style={{ color: 'white', fontWeight: 700, fontSize: 12, lineHeight: 1.3, margin: '0 0 5px' }}>
            {data.title || 'Imóveis bem localizados em Manaus'}
          </p>
          {address && (
            <p style={{ color: 'white', fontSize: 9, opacity: 0.82, lineHeight: 1.4, margin: 0 }}>
              {address}
            </p>
          )}
          {data.referencePoint && (
            <p style={{ color: 'white', fontSize: 9, opacity: 0.7, lineHeight: 1.4, margin: '3px 0 0' }}>
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
            padding: '3px 8px',
            fontSize: 8,
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
          borderRadius: 10,
          width: 96,
          height: 32,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          padding: '2px 4px',
        }}
      >
        <AMLogo width={88} variant="color" />
      </div>
    </div>
  );
};

// ─── Slide 4+: FOTO SIMPLES ──────────────────────────────────────────────────
// Mesmo padrão do Slide 2: foto recortada com notch superior-esquerdo para o card da logo.
// Card da logo: top=4, left=4, w=164, h=76, r=18. Foto ocupa o resto via clipPath.
export const AMPhotoSlide = ({
  data,
  photo,
  photoIndex,
}: {
  data: AMPropertyData;
  photo: string;
  photoIndex: number;
}) => {
  const uid = useId();
  const clipId = `am-photo-${uid}`;

  // Notch top-left reduzido: w=120, h=52. Bordas externas mantidas (330→352, etc.)
  const shapePath = [
    'M 330 8',
    'A 22 22 0 0 1 352 30',
    'V 330',
    'A 22 22 0 0 1 330 352',
    'H 30',
    'A 22 22 0 0 1 8 330',
    'V 74',
    'Q 8 52 26 52',
    'H 98',
    'Q 120 52 120 30',
    'V 30',
    'A 22 22 0 0 1 142 8',
    'H 330',
    'Z',
  ].join(' ');

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>

      {/* clipPath definition */}
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={shapePath} />
          </clipPath>
        </defs>
      </svg>

      {/* Foto — recortada com o mesmo shape do Slide 2 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 360,
          height: 360,
          clipPath: `url(#${clipId})`,
          zIndex: 10,
        }}
      >
        <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>

      {/* Card da logo — encaixado no notch superior-esquerdo (zIndex abaixo da foto) */}
      <div style={{
        position: 'absolute',
        top: 4,
        left: 4,
        width: 116,
        height: 52,
        borderRadius: 14,
        backgroundColor: '#ffffff',
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 8,
        paddingRight: 8,
        boxSizing: 'border-box',
      }}>
        <AMLogo width={100} variant="color" />
      </div>
    </div>
  );
};

// ─── Último Slide: INFORMAÇÃO ─────────────────────────────────────────────────
export const AMInfoSlide = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => {
  const uid = useId();
  const clipId = `am-info-${uid}`;

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
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
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
          clipPath: `url(#${clipId})`,
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

// ─── STORY SLIDES (360 × 640 — formato 9:16) ─────────────────────────────────
// Versões dos slides adaptadas para o formato de story vertical.

const STORY_W = 360;
const STORY_H = 640;

const formatPriceSt = (v: number) =>
  v > 0
    ? `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    : 'Consulte';

// Story: Capa
export const AMStoryCoverSlide = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const priceLabel = data.isRental ? 'LOCAÇÃO' : 'VENDA';

  return (
    <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#0a0f1e', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      {/* Full bleed photo */}
      {photo && (
        <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)' }} />
      )}
      {/* Gradient overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 30%, transparent 55%, rgba(0,0,0,0.85) 100%)' }} />

      {/* Logo + header */}
      <div style={{ position: 'absolute', top: 44, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
        <AMLogo width={110} variant="white" />
      </div>

      {/* Orange badge */}
      <div style={{ position: 'absolute', top: 44, left: 18, zIndex: 10 }}>
        <div style={{ backgroundColor: '#F47920', borderRadius: 6, padding: '4px 10px' }}>
          <p style={{ color: 'white', fontSize: 10, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{priceLabel}</p>
        </div>
      </div>

      {/* Bottom content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 36px', zIndex: 10 }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>
          {data.neighborhood || 'Manaus'} — {data.city || 'AM'}
        </p>
        <p style={{ color: 'white', fontSize: 24, fontWeight: 900, lineHeight: 1.25, margin: '0 0 16px', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
          {data.title || 'Apartamento Disponível'}
        </p>

        {/* Specs row */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {data.bedrooms > 0 && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '5px 10px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <span style={{ color: 'white', fontSize: 11, fontWeight: 600 }}>🛏 {data.bedrooms} Qto{data.bedrooms > 1 ? 's' : ''}</span>
            </div>
          )}
          {data.area > 0 && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '5px 10px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <span style={{ color: 'white', fontSize: 11, fontWeight: 600 }}>📐 {data.area}m²</span>
            </div>
          )}
          {data.garageSpaces > 0 && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '5px 10px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <span style={{ color: 'white', fontSize: 11, fontWeight: 600 }}>🚗 {data.garageSpaces} Vaga{data.garageSpaces > 1 ? 's' : ''}</span>
            </div>
          )}
          {data.floor && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '5px 10px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <span style={{ color: 'white', fontSize: 11, fontWeight: 600 }}>🏢 {data.floor}° And.</span>
            </div>
          )}
        </div>

        {/* Price card */}
        <div style={{
          backgroundColor: '#1B5EA6', borderRadius: 16, padding: '14px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 8px 30px rgba(27,94,166,0.45)',
        }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {data.isRental ? 'Aluguel' : 'Valor de Venda'}
            </p>
            <p style={{ color: 'white', fontSize: 26, fontWeight: 900, margin: 0, lineHeight: 1 }}>
              {formatPriceSt(price)}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            {data.acceptsFinancing && <p style={{ color: '#86efac', fontSize: 10, fontWeight: 600, margin: '0 0 2px' }}>✓ Financiamento</p>}
            {data.acceptsFGTS && <p style={{ color: '#86efac', fontSize: 10, fontWeight: 600, margin: 0 }}>✓ FGTS</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

// Story: Foto individual
export const AMStoryPhotoSlide = ({
  photo,
  data,
  photoIndex,
}: {
  photo: string;
  data: AMPropertyData;
  photoIndex: number;
}) => (
  <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#0a0f1e', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
    <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
    {/* Subtle gradient bottom for logo */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }} />
    {/* Top logo */}
    <div style={{ position: 'absolute', top: 18, left: 18, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.88)', borderRadius: 8, padding: '4px 10px' }}>
      <AMLogo width={96} variant="color" />
    </div>
    {/* Bottom info */}
    <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ backgroundColor: '#F47920', borderRadius: 8, padding: '4px 12px' }}>
        <p style={{ color: 'white', fontSize: 10, fontWeight: 700, margin: 0 }}>📍 {data.neighborhood || 'Manaus'}</p>
      </div>
      <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '4px 12px', border: '1px solid rgba(255,255,255,0.2)' }}>
        <p style={{ color: 'white', fontSize: 10, fontWeight: 600, margin: 0 }}>{photoIndex} / {photoIndex}</p>
      </div>
    </div>
  </div>
);

// Story: Especificações
export const AMStorySpecsSlide = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => {
  const specs: { icon: string; label: string }[] = [
    data.bedrooms > 0 ? { icon: '🛏', label: `${data.bedrooms} quarto${data.bedrooms > 1 ? 's' : ''}` } : null,
    data.suites > 0 ? { icon: '🛁', label: `${data.suites} suíte${data.suites > 1 ? 's' : ''}` } : null,
    data.garageSpaces > 0 ? { icon: '🚗', label: `${data.garageSpaces} vaga${data.garageSpaces > 1 ? 's' : ''}` } : null,
    data.floor ? { icon: '🏢', label: `${data.floor}° andar` } : null,
    data.area > 0 ? { icon: '📐', label: `${data.area}m²` } : null,
    ...(data.rooms ? data.rooms.split('\n').filter(Boolean).map(r => ({ icon: '✅', label: r })) : []),
  ].filter(Boolean) as { icon: string; label: string }[];

  return (
    <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#0a0f1e', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      {/* Background photo */}
      {photo && (
        <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0a0f1e 0%, transparent 40%, rgba(0,0,0,0.8) 100%)' }} />

      {/* Logo */}
      <div style={{ position: 'absolute', top: 44, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
        <AMLogo width={110} variant="white" />
      </div>

      {/* Content */}
      <div style={{ position: 'absolute', top: 120, left: 24, right: 24, zIndex: 10 }}>
        <div style={{ backgroundColor: '#F47920', borderRadius: 30, padding: '5px 18px', display: 'inline-block', marginBottom: 16 }}>
          <p style={{ color: 'white', fontSize: 11, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Detalhes do imóvel</p>
        </div>

        <p style={{ color: 'white', fontSize: 20, fontWeight: 800, margin: '0 0 20px', lineHeight: 1.3 }}>
          {data.title || 'Apartamento Disponível'}
        </p>

        {/* Specs list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {specs.slice(0, 8).map((spec, i) => (
            <div key={i} style={{
              backgroundColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)',
              borderRadius: 12, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 16 }}>{spec.icon}</span>
              <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{spec.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ position: 'absolute', bottom: 30, left: 24, right: 24, zIndex: 10 }}>
        <div style={{ backgroundColor: '#1B5EA6', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, margin: 0 }}>apartamentosmanaus.com</p>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '3px 12px' }}>
            <p style={{ color: 'white', fontSize: 10, margin: 0, fontWeight: 600 }}>Deslize ➜</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Story: Localização
export const AMStoryLocationSlide = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => {
  const address = data.address || '';

  return (
    <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#0a0f1e', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      {/* Background photo */}
      {photo && (
        <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45)' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.75) 100%)' }} />

      {/* Logo */}
      <div style={{ position: 'absolute', top: 44, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
        <AMLogo width={110} variant="white" />
      </div>

      {/* Location pin icon */}
      <div style={{ position: 'absolute', top: '38%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 10, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📍</div>
        <div style={{ backgroundColor: '#F47920', borderRadius: 30, padding: '6px 20px', display: 'inline-block' }}>
          <p style={{ color: 'white', fontSize: 12, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {data.neighborhood || 'Manaus'}
          </p>
        </div>
      </div>

      {/* Bottom info card */}
      <div style={{ position: 'absolute', bottom: 30, left: 20, right: 20, zIndex: 10 }}>
        <div style={{
          backgroundColor: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(16px)',
          borderRadius: 20, padding: '18px 20px',
          border: '1px solid rgba(27,94,166,0.4)',
        }}>
          <p style={{ color: '#93c5fd', fontSize: 10, fontWeight: 700, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>📌 Localização</p>
          <p style={{ color: 'white', fontSize: 16, fontWeight: 800, margin: '0 0 6px', lineHeight: 1.3 }}>
            {data.title || 'Apartamento Disponível'}
          </p>
          {address && (
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: '0 0 6px', lineHeight: 1.4 }}>{address}</p>
          )}
          {data.referencePoint && (
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, margin: 0, lineHeight: 1.4 }}>📎 {data.referencePoint}</p>
          )}
          <div style={{ marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, margin: 0 }}>apartamentosmanaus.com</p>
            <div style={{ backgroundColor: '#1B5EA6', borderRadius: 20, padding: '3px 12px' }}>
              <p style={{ color: 'white', fontSize: 10, fontWeight: 600, margin: 0 }}>Deslize ➜</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Story: Info / CTA final
export const AMStoryInfoSlide = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => (
  <div style={{ position: 'relative', width: STORY_W, height: STORY_H, fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
    {photo && (
      <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' }} />
    )}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(160deg, #0a1628 0%, #1B5EA6 50%, #0a1628 100%)',
      opacity: photo ? 0.85 : 1,
    }} />
    {/* Geometric accents */}
    <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%', border: '2px solid rgba(244,121,32,0.2)', zIndex: 2 }} />
    <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', border: '2px solid rgba(244,121,32,0.35)', zIndex: 2 }} />

    <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 28px 40px' }}>
      <AMLogo width={110} variant="white" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          backgroundColor: 'rgba(244,121,32,0.15)', border: '1px solid rgba(244,121,32,0.5)',
          borderRadius: 30, padding: '5px 20px', marginBottom: 20,
        }}>
          <p style={{ color: '#F47920', fontSize: 11, fontWeight: 700, margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Fale conosco hoje
          </p>
        </div>

        <p style={{ color: 'white', fontSize: 30, fontWeight: 900, textAlign: 'center', lineHeight: 1.2, margin: '0 0 8px' }}>
          Tire suas dúvidas
        </p>
        <p style={{ color: '#F47920', fontSize: 34, fontWeight: 900, textAlign: 'center', lineHeight: 1.1, margin: '0 0 28px' }}>
          entre em contato!
        </p>

        {/* Phone CTA */}
        <div style={{
          width: '100%', backgroundColor: '#F47920', borderRadius: 16, padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14,
          boxShadow: '0 8px 24px rgba(244,121,32,0.4)',
        }}>
          <span style={{ fontSize: 22 }}>📱</span>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Fale agora via WhatsApp</p>
            <p style={{ color: 'white', fontSize: 18, fontWeight: 900, margin: 0 }}>{data.brokerPhone || '(92) 9XXXX-XXXX'}</p>
          </div>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, textAlign: 'center', margin: '0 0 4px' }}>
          {data.brokerName || 'Iury Sampaio'} • Corretor de Imóveis
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, textAlign: 'center', margin: '0 0 4px' }}>Creci 3968 PF</p>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, textAlign: 'center', margin: 0 }}>🌐 www.apartamentosmanaus.com</p>
      </div>
    </div>
  </div>
);
