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
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={shapePath} />
          </clipPath>
        </defs>
      </svg>

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
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, color: 'white' }}>
          <span style={{ fontSize: 11, opacity: 0.75, marginRight: 2 }}>R$</span>
          <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
            {price > 0
              ? price.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
              : 'Consulte'}
          </span>
          {price > 0 && <span style={{ fontSize: 11, opacity: 0.75 }}>,00</span>}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', marginTop: 4, paddingTop: 3 }}>
          <p style={{ color: 'white', fontSize: 9, opacity: 0.9, margin: 0, lineHeight: 1.3 }}>
            {paymentLine}
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Slide 2: ESPECIFICAÇÕES — 2 fotos lado a lado ───────────────────────────
// Coluna esquerda: logo (topo) + foto A (meio) + foto B (baixo)
// Coluna direita: foto A full-height + card de specs sobreposto
// Borda branca de 8px separa todos os recortes (é o próprio fundo #fff)
// Fallback: se houver menos fotos, repete a disponível
export const AMSpecsSlide = ({
  data,
  photos = [],
}: {
  data: AMPropertyData;
  photos?: string[];
}) => {
  // Foto coluna esquerda: preferencialmente diferente da capa (index 0)
  const photoLeft = photos[1] ?? photos[0] ?? undefined;
  // Foto coluna direita: diferente da foto esquerda quando possível
  const photoRight = photos[2] ?? photos[1] ?? photos[0] ?? undefined;

  const specs: string[] = [
    data.bedrooms > 0 ? `${data.bedrooms} quarto${data.bedrooms > 1 ? 's' : ''}` : '',
    ...(data.rooms ? data.rooms.split('\n').filter(Boolean) : []),
    data.garageSpaces > 0 ? `${data.garageSpaces} vaga${data.garageSpaces > 1 ? 's' : ''} de garagem` : '',
    data.floor ? `${data.floor}° andar` : '',
    data.area > 0 ? `${data.area}m²` : '',
    data.suites > 0 ? `${data.suites} suíte${data.suites > 1 ? 's' : ''}` : '',
  ].filter(Boolean).slice(0, 6);

  return (
    <div style={{
      position: 'relative', width: 360, height: 360,
      backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', overflow: 'hidden',
    }}>
      {/* ── Coluna esquerda: logo topo + foto esquerda ── */}

      {/* Card logo — topo esquerdo */}
      <div style={{
        position: 'absolute', top: 8, left: 8, width: 168, height: 56,
        borderRadius: 16, backgroundColor: '#ffffff', zIndex: 20,
        display: 'flex', alignItems: 'center',
        paddingLeft: 8, paddingRight: 8, boxSizing: 'border-box',
        border: '1px solid #f0f0f0',
      }}>
        <AMLogo width={100} variant="color" />
      </div>

      {/* Foto esquerda — abaixo do logo */}
      <div style={{
        position: 'absolute', top: 72, left: 8, width: 168, height: 280,
        borderRadius: 18, overflow: 'hidden',
      }}>
        {photoLeft
          ? <img src={photoLeft} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div style={{ width: '100%', height: '100%', backgroundColor: '#d1d5db' }} />}
      </div>

      {/* ── Coluna direita: foto full-height + card specs ── */}

      {/* Foto direita — full-height */}
      <div style={{
        position: 'absolute', top: 8, left: 184, width: 168, height: 344,
        borderRadius: 18, overflow: 'hidden',
      }}>
        {photoRight
          ? <img src={photoRight} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div style={{ width: '100%', height: '100%', backgroundColor: '#c4c9d1' }} />}
      </div>

      {/* Card specs — sobre foto direita, canto inferior */}
      {specs.length > 0 && (
        <div style={{
          position: 'absolute', bottom: 16, right: 16, zIndex: 20,
          backgroundColor: 'rgba(10,10,20,0.80)',
          backdropFilter: 'blur(6px)',
          borderRadius: 10, padding: '5px 10px', maxWidth: 130,
          border: '1px solid rgba(255,255,255,0.12)',
        }}>
          {specs.map((spec, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: i < specs.length - 1 ? 2 : 0 }}>
              <span style={{ color: '#F47920', fontSize: 8, marginTop: 1, flexShrink: 0 }}>•</span>
              <span style={{ color: 'white', fontSize: 8, lineHeight: 1.3 }}>{spec}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// ─── Slide 3: LOCALIZAÇÃO — 2 fotos ──────────────────────────────────────────
// Coluna esquerda: foto A full-height
// Coluna direita: card azul (topo) + foto B (meio) + card logo (baixo)
// Borda branca de 8px separa (fundo #fff)
export const AMLocationSlide = ({
  data,
  photos = [],
}: {
  data: AMPropertyData;
  photos?: string[];
}) => {
  const address = data.address || '';

  // Foto esquerda: diferente da capa quando possível
  const photoLeft  = photos[2] ?? photos[1] ?? photos[0] ?? undefined;
  // Foto direita (menor): diferente da esquerda quando possível
  const photoRight = photos[3] ?? photos[2] ?? photos[1] ?? photos[0] ?? undefined;

  return (
    <div style={{
      position: 'relative', width: 360, height: 360,
      backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', overflow: 'hidden',
    }}>

      {/* ── Coluna esquerda: foto A full-height ── */}
      <div style={{
        position: 'absolute', top: 8, left: 8, width: 168, height: 344,
        borderRadius: 18, overflow: 'hidden',
      }}>
        {photoLeft
          ? <img src={photoLeft} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div style={{ width: '100%', height: '100%', backgroundColor: '#d1d5db' }} />}
      </div>

      {/* ── Coluna direita: card azul topo ── */}
      <div style={{
        position: 'absolute', top: 8, left: 184, width: 168, height: 148,
        borderRadius: 18, overflow: 'hidden',
        backgroundColor: '#1B5EA6',
        padding: '12px 12px 10px', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div style={{ overflow: 'hidden' }}>
          <p style={{
            color: 'white', fontWeight: 700, fontSize: 12, lineHeight: 1.3,
            margin: '0 0 5px',
            display: '-webkit-box', WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {data.title || 'Imóveis em Manaus'}
          </p>
          {address && (
            <p style={{
              color: 'white', fontSize: 9, opacity: 0.85, lineHeight: 1.35, margin: 0,
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {address}
            </p>
          )}
          {data.referencePoint && (
            <p style={{
              color: 'white', fontSize: 9, opacity: 0.7, lineHeight: 1.35, margin: '3px 0 0',
              display: '-webkit-box', WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {data.referencePoint}
            </p>
          )}
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.35)',
          borderRadius: 20, padding: '2px 8px',
          fontSize: 7, color: 'white', alignSelf: 'flex-start',
        }}>
          Arraste →
        </div>
      </div>

      {/* ── Coluna direita: foto B (meio) ── */}
      <div style={{
        position: 'absolute', top: 164, left: 184, width: 168, height: 120,
        borderRadius: 18, overflow: 'hidden',
      }}>
        {photoRight
          ? <img src={photoRight} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div style={{ width: '100%', height: '100%', backgroundColor: '#c4c9d1' }} />}
      </div>

      {/* ── Coluna direita: logo card (baixo) ── */}
      <div style={{
        position: 'absolute', bottom: 8, left: 184, width: 168, height: 56,
        borderRadius: 16, backgroundColor: '#ffffff', zIndex: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxSizing: 'border-box', padding: '4px 8px',
        border: '1px solid #f0f0f0',
      }}>
        <AMLogo width={120} variant="color" />
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
  const shapePath = [
    'M 324 14',
    'A 22 22 0 0 1 346 36',
    'V 264',
    'Q 346 286 324 286',
    'H 240',
    'Q 218 286 218 308',
    'V 324',
    'A 22 22 0 0 1 196 346',
    'H 36',
    'A 22 22 0 0 1 14 324',
    'V 36',
    'A 22 22 0 0 1 36 14',
    'H 324',
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

      {/* Foto de fundo */}
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
          <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#374151' }} />
        )}
      </div>

      {/* Overlay escuro sobre a foto */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 360,
          height: 360,
          clipPath: `url(#${clipId})`,
          zIndex: 11,
          background: 'linear-gradient(135deg, rgba(27,94,166,0.80) 0%, rgba(10,15,30,0.75) 100%)',
        }}
      />

      {/* Texto principal */}
      <div
        style={{
          position: 'absolute',
          top: 28,
          left: 28,
          right: 28,
          zIndex: 20,
        }}
      >
        <p style={{
          color: 'white',
          fontWeight: 700,
          fontSize: 16,
          lineHeight: 1.35,
          margin: '0 0 10px',
        }}>
          {headline}
        </p>
        <p style={{
          color: 'rgba(255,255,255,0.78)',
          fontSize: 10,
          lineHeight: 1.55,
          margin: 0,
        }}>
          {subtitle}
        </p>
      </div>

      {/* Logo card — nicho inferior-direito */}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          right: 14,
          zIndex: 20,
          backgroundColor: '#ffffff',
          borderRadius: 10,
          width: 120,
          height: 52,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          padding: '2px 6px',
        }}
      >
        <AMLogo width={108} variant="color" />
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// STORY SLIDES
// ═══════════════════════════════════════════════════════════════════════════════
const STORY_W = 360;
const STORY_H = 640;

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
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 35%, rgba(0,0,0,0.7) 100%)' }} />

      {/* Logo top */}
      <div style={{ position: 'absolute', top: 28, left: 24 }}>
        <AMLogo width={120} variant="white" />
      </div>

      {/* Bottom content */}
      <div style={{ position: 'absolute', bottom: 36, left: 24, right: 24 }}>
        {data.neighborhood && (
          <div style={{
            display: 'inline-block', backgroundColor: '#F47920',
            borderRadius: 20, padding: '4px 14px', marginBottom: 10,
            color: 'white', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
          }}>
            {data.neighborhood}
          </div>
        )}
        <p style={{ color: 'white', fontWeight: 700, fontSize: 22, lineHeight: 1.25, margin: '0 0 8px' }}>
          {data.title || 'Nome do Imóvel'}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, color: 'white', marginBottom: 8 }}>
          <span style={{ fontSize: 12, opacity: 0.75 }}>R$</span>
          <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>
            {price > 0
              ? price.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
              : 'Consulte'}
          </span>
          {price > 0 && <span style={{ fontSize: 12, opacity: 0.75 }}>,00</span>}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {data.bedrooms > 0 && (
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 20, padding: '3px 10px' }}>
              {data.bedrooms} quartos
            </span>
          )}
          {data.area > 0 && (
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 20, padding: '3px 10px' }}>
              {data.area}m²
            </span>
          )}
          {data.garageSpaces > 0 && (
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 20, padding: '3px 10px' }}>
              {data.garageSpaces} vaga{data.garageSpaces > 1 ? 's' : ''}
            </span>
          )}
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
    <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
      <AMLogo width={100} variant="white" />
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
  const specs: string[] = [
    data.bedrooms > 0 ? `${data.bedrooms} quarto${data.bedrooms > 1 ? 's' : ''}` : '',
    ...(data.rooms ? data.rooms.split('\n').filter(Boolean) : []),
    data.garageSpaces > 0 ? `${data.garageSpaces} vaga${data.garageSpaces > 1 ? 's' : ''} de garagem` : '',
    data.floor ? `${data.floor}° andar` : '',
    data.area > 0 ? `${data.area}m²` : '',
    data.suites > 0 ? `${data.suites} suíte${data.suites > 1 ? 's' : ''}` : '',
  ].filter(Boolean);

  return (
    <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#0a0f1e', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      {photo && (
        <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35)' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(27,94,166,0.5), rgba(0,0,0,0.7))' }} />

      <div style={{ position: 'absolute', top: 28, left: 24 }}>
        <AMLogo width={100} variant="white" />
      </div>

      <div style={{ position: 'absolute', top: 100, left: 24, right: 24 }}>
        <p style={{ color: '#F47920', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', margin: '0 0 6px', textTransform: 'uppercase' }}>
          Especificações
        </p>
        <p style={{ color: 'white', fontWeight: 700, fontSize: 20, lineHeight: 1.3, margin: '0 0 20px' }}>
          {data.title || 'Detalhes do imóvel'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {specs.map((spec, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#F47920', flexShrink: 0 }} />
              <span style={{ color: 'white', fontSize: 14, lineHeight: 1.4 }}>{spec}</span>
            </div>
          ))}
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
      {photo && (
        <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(27,94,166,0.65))' }} />

      <div style={{ position: 'absolute', top: 28, left: 24 }}>
        <AMLogo width={100} variant="white" />
      </div>

      <div style={{ position: 'absolute', bottom: 60, left: 24, right: 24 }}>
        <p style={{ color: '#F47920', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', margin: '0 0 6px', textTransform: 'uppercase' }}>
          Localização
        </p>
        <p style={{ color: 'white', fontWeight: 700, fontSize: 22, lineHeight: 1.3, margin: '0 0 10px' }}>
          {data.neighborhood || data.title || 'Manaus'}
        </p>
        {address && (
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 1.5, margin: '0 0 8px' }}>
            {address}
          </p>
        )}
        {data.referencePoint && (
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, lineHeight: 1.4, margin: 0 }}>
            {data.referencePoint}
          </p>
        )}
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
}) => {
  const headline = data.infoMessage || 'A Apartamentos Manaus acompanha você em todas as etapas.';
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const priceLabel = data.isRental ? 'Locação' : 'Venda';

  return (
    <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#0a0f1e', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      {photo && (
        <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(27,94,166,0.75) 0%, rgba(10,15,30,0.85) 60%)' }} />

      <div style={{ position: 'absolute', top: 28, left: 24 }}>
        <AMLogo width={120} variant="white" />
      </div>

      <div style={{ position: 'absolute', top: '35%', left: 24, right: 24, transform: 'translateY(-50%)' }}>
        <p style={{ color: 'white', fontWeight: 700, fontSize: 22, lineHeight: 1.35, margin: '0 0 16px' }}>
          {headline}
        </p>
        {price > 0 && (
          <div style={{
            display: 'inline-block',
            backgroundColor: '#1B5EA6',
            borderRadius: 16,
            padding: '8px 20px',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 10, margin: '0 0 2px' }}>{priceLabel}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, color: 'white' }}>
              <span style={{ fontSize: 12, opacity: 0.75 }}>R$</span>
              <span style={{ fontSize: 26, fontWeight: 700 }}>
                {price.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
              <span style={{ fontSize: 12, opacity: 0.75 }}>,00</span>
            </div>
          </div>
        )}
      </div>

      <div style={{
        position: 'absolute', bottom: 32, left: 24, right: 24,
        backgroundColor: '#F47920', borderRadius: 16,
        padding: '14px 20px', textAlign: 'center',
      }}>
        <p style={{ color: 'white', fontWeight: 700, fontSize: 15, margin: 0 }}>
          Fale com um especialista
        </p>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, margin: '4px 0 0' }}>
          apartamentosmanaus.com.br
        </p>
      </div>
    </div>
  );
};
