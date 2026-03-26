import { useId } from 'react';
import { AFPropertyData } from '@/types/apartamentosFortaleza';
import logoAF from '@/assets/logo-apartamentos-fortaleza.png';
import { useLogoBase64 } from '@/hooks/useLogoBase64';

// ─── AF Brand Colors ──────────────────────────────────────────────────────────
const PRIMARY = '#0C7B8E';   // Teal ocean blue
const ACCENT  = '#E8562A';   // Coral orange

// ─── Internal Logo component ─────────────────────────────────────────────────
export const AFLogo = ({
  width = 120,
  variant = 'color',
}: {
  width?: number;
  variant?: 'color' | 'white';
}) => {
  const base64 = useLogoBase64(logoAF);
  return (
    <img
      src={base64}
      alt="Apartamentos Fortaleza"
      width={width}
      style={{ display: 'block', ...(variant === 'white' ? { filter: 'brightness(0) invert(1)' } : {}) }}
    />
  );
};

const golos = "'Golos Text', Arial, sans-serif";

// ─── Slide 1: CAPA ───────────────────────────────────────────────────────────
export const AFCoverSlide = ({ data, photo }: { data: AFPropertyData; photo?: string }) => {
  const uid = useId();
  const clipId = `af-cover-${uid}`;

  const price = data.isRental ? data.rentalPrice : data.salePrice;

  // Teal badge top-left: 190x48 at top:6, left:6
  // Orange price card bottom-right: 148x52 at bottom:10, right:10
  const shapePath = [
    'M 210 6', 'H 344', 'A 10 10 0 0 1 354 16', 'V 284',
    'Q 354 294 344 294', 'H 208', 'Q 198 294 198 304',
    'V 344', 'A 10 10 0 0 1 188 354', 'H 16',
    'A 10 10 0 0 1 6 344', 'V 68', 'Q 6 58 16 58',
    'H 190', 'Q 200 58 200 48', 'V 16',
    'A 10 10 0 0 1 210 6', 'Z',
  ].join(' ');

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: '#ffffff', fontFamily: golos, overflow: 'hidden' }}>
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={shapePath} />
          </clipPath>
        </defs>
      </svg>

      {/* TEAL BADGE */}
      <div style={{
        position: 'absolute', top: 6, left: 6, width: 190, height: 48, zIndex: 5,
        background: `linear-gradient(180deg, #1190A6 52%, ${PRIMARY} 100%)`,
        borderRadius: 10, padding: '5px 10px', boxSizing: 'border-box',
        overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <p style={{ color: 'white', fontWeight: 700, fontSize: 11, lineHeight: 1.2, margin: 0, fontFamily: golos, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {data.title || 'Nome do Imóvel'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '2px 6px', marginTop: 2 }}>
          {data.neighborhood && (
            <span style={{ color: 'white', fontSize: 9, opacity: 0.95, display: 'flex', alignItems: 'center', gap: 2, fontFamily: golos }}>
              <svg width="7" height="9" viewBox="0 0 10 13" fill="white">
                <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8C10 2.24 7.76 0 5 0zm0 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              </svg>
              {data.neighborhood}
            </span>
          )}
          {data.bedrooms > 0 && (
            <span style={{ color: 'white', fontSize: 9, opacity: 0.95, display: 'flex', alignItems: 'center', gap: 2, fontFamily: golos }}>
              <svg width="11" height="8" viewBox="0 0 18 12" fill="white">
                <path d="M1 8V4a1 1 0 011-1h4a1 1 0 011 1v1h4V4a1 1 0 011-1h4a1 1 0 011 1v4H1zm0 1h16v3H1V9z"/>
              </svg>
              {data.bedrooms} {data.bedrooms === 1 ? 'Qto' : 'Qtos'}
            </span>
          )}
          {data.area > 0 && (
            <span style={{ color: 'white', fontSize: 9, opacity: 0.95, display: 'flex', alignItems: 'center', gap: 2, fontFamily: golos }}>
              <svg width="9" height="9" viewBox="0 0 12 12" fill="white">
                <path d="M0 0v5l2-2 3 3 2-2-3-3 2-2H0zm12 12V7l-2 2-3-3-2 2 3 3-2 2h6z"/>
              </svg>
              {data.area}m²
            </span>
          )}
        </div>
      </div>

      {/* PHOTO */}
      {photo ? (
        <img src={photo} alt="" style={{ position: 'absolute', top: 0, left: 0, width: 360, height: 360, objectFit: 'cover', display: 'block', clipPath: `url(#${clipId})`, zIndex: 10 }} />
      ) : (
        <div style={{ position: 'absolute', top: 0, left: 0, width: 360, height: 360, backgroundColor: '#cfe8eb', clipPath: `url(#${clipId})`, zIndex: 10 }} />
      )}

      {/* WHITE LOGO */}
      <div style={{ position: 'absolute', bottom: 18, left: 18, zIndex: 20 }}>
        <AFLogo width={106} variant="white" />
      </div>

      {/* CORAL PRICE CARD */}
      <div style={{
        position: 'absolute', bottom: 10, right: 10, zIndex: 20,
        background: `linear-gradient(180deg, ${ACCENT} 36%, #C44320 100%)`,
        borderRadius: 10, padding: '5px 14px 5px', width: 148, height: 52,
        boxSizing: 'border-box', boxShadow: '0 0 0 4px #ffffff',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        {!data.isRental && (
          <div style={{
            display: 'inline-block', color: 'white', fontWeight: 700, fontSize: 7,
            letterSpacing: '0.08em', backgroundColor: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.4)', borderRadius: 20,
            padding: '1px 6px', marginBottom: 2, alignSelf: 'flex-start', fontFamily: golos,
          }}>VENDA</div>
        )}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, color: 'white' }}>
          <span style={{ fontSize: 9, opacity: 0.75, marginRight: 1, fontFamily: golos }}>R$</span>
          <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1, fontFamily: golos }}>
            {price > 0 ? price.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 'Consulte'}
          </span>
          {price > 0 && <span style={{ fontSize: 10, opacity: 0.75, fontFamily: golos }}>,00</span>}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', marginTop: 3, paddingTop: 2 }}>
          <p style={{ color: 'white', fontSize: 8, opacity: 0.9, margin: 0, lineHeight: 1.3, fontFamily: golos }}>
            {data.isRental ? 'Locação' : data.acceptsFinancing ? 'Aceita financiamento' : 'À vista'}
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Slide 2: ESPECIFICAÇÕES ─────────────────────────────────────────────────
export const AFSpecsSlide = ({ data, photo }: { data: AFPropertyData; photo?: string }) => {
  const uid = useId();
  const clipId = `af-specs-${uid}`;
  const specs: string[] = [
    data.bedrooms > 0 ? `${data.bedrooms} quarto${data.bedrooms > 1 ? 's' : ''}` : '',
    ...(data.rooms ? data.rooms.split('\n').filter(Boolean) : []),
    data.garageSpaces > 0 ? `${data.garageSpaces} vaga${data.garageSpaces > 1 ? 's' : ''} de garagem` : '',
    data.floor ? `${data.floor}° andar` : '',
    data.area > 0 ? `${data.area}m²` : '',
    data.suites > 0 ? `${data.suites} suíte${data.suites > 1 ? 's' : ''}` : '',
  ].filter(Boolean).slice(0, 6);

  const shapePath = [
    'M 340 8', 'A 12 12 0 0 1 352 20', 'V 340',
    'A 12 12 0 0 1 340 352', 'H 20', 'A 12 12 0 0 1 8 340',
    'V 64', 'Q 8 52 20 52', 'H 100', 'Q 120 52 120 40',
    'V 20', 'A 12 12 0 0 1 132 8', 'H 340', 'Z',
  ].join(' ');

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: '#ffffff', fontFamily: golos, overflow: 'hidden' }}>
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={shapePath} />
          </clipPath>
        </defs>
      </svg>

      <div style={{ position: 'absolute', top: 0, left: 0, width: 360, height: 360, clipPath: `url(#${clipId})`, zIndex: 10 }}>
        {photo ? (
          <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#cfe8eb' }} />
        )}
      </div>

      <div style={{
        position: 'absolute', top: 4, left: 4, width: 116, height: 52, borderRadius: 14,
        backgroundColor: '#ffffff', zIndex: 5, display: 'flex', alignItems: 'center',
        paddingLeft: 8, paddingRight: 8, boxSizing: 'border-box',
      }}>
        <AFLogo width={100} variant="color" />
      </div>

      {specs.length > 0 && (
        <div style={{
          position: 'absolute', bottom: 18, right: 18, zIndex: 20,
          backgroundColor: 'rgba(5,20,25,0.65)', borderRadius: 6, padding: '5px 9px', width: 130,
          border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 2px 16px rgba(0,0,0,0.40)',
        }}>
          {specs.map((spec, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 3, marginBottom: i < specs.length - 1 ? 0.5 : 0 }}>
              <span style={{ color: `${ACCENT}99`, fontFamily: golos, fontWeight: 400, fontSize: 8, marginTop: 0.5, flexShrink: 0 }}>•</span>
              <span style={{ color: 'rgba(255,255,255,0.95)', fontFamily: golos, fontWeight: 400, fontSize: 8, lineHeight: '9px' }}>{spec}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Slide 3: LOCALIZAÇÃO ────────────────────────────────────────────────────
export const AFLocationSlide = ({ data, photo }: { data: AFPropertyData; photo?: string }) => {
  const uid = useId();
  const clipId = `af-location-${uid}`;

  const shapePath = [
    'M 156 8', 'H 340', 'A 12 12 0 0 1 352 20', 'V 294',
    'Q 352 306 340 306', 'H 268', 'Q 256 306 256 318',
    'V 340', 'A 12 12 0 0 1 244 352', 'H 20',
    'A 12 12 0 0 1 8 340', 'V 176',
    'Q 8 164 20 164', 'H 132', 'Q 144 164 144 152',
    'V 20', 'A 12 12 0 0 1 156 8', 'Z',
  ].join(' ');

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: '#ffffff', fontFamily: golos, overflow: 'hidden' }}>
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={shapePath} />
          </clipPath>
        </defs>
      </svg>

      {photo ? (
        <img src={photo} alt="" style={{ position: 'absolute', top: 0, left: 0, width: 360, height: 360, objectFit: 'cover', display: 'block', clipPath: `url(#${clipId})`, zIndex: 10 }} />
      ) : (
        <div style={{ position: 'absolute', top: 0, left: 0, width: 360, height: 360, backgroundColor: '#cfe8eb', clipPath: `url(#${clipId})`, zIndex: 10 }} />
      )}

      {/* TEAL location card */}
      <div style={{
        position: 'absolute', top: 8, left: 8, width: 132, height: 152, zIndex: 5,
        background: `linear-gradient(160deg, #0E8FA4 0%, ${PRIMARY} 100%)`,
        borderRadius: 12, padding: '12px 10px', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
      }}>
        <p style={{ color: 'white', fontSize: 7.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px', opacity: 0.8, fontFamily: golos }}>
          📍 Localização
        </p>
        {data.neighborhood && (
          <p style={{ color: 'white', fontSize: 14, fontWeight: 900, lineHeight: 1.2, margin: '0 0 4px', fontFamily: golos }}>{data.neighborhood}</p>
        )}
        {data.address && (
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 9, lineHeight: 1.4, margin: '0 0 6px', fontFamily: golos }}>{data.address}</p>
        )}
        {data.referencePoint && (
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 8.5, lineHeight: 1.3, fontFamily: golos }}>{data.referencePoint}</p>
        )}
        {/* City badge */}
        <div style={{
          position: 'absolute', bottom: 10, left: 10, right: 10,
          backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 6,
          padding: '3px 8px', textAlign: 'center',
        }}>
          <p style={{ color: 'white', fontSize: 8, fontWeight: 700, margin: 0, letterSpacing: '0.05em', fontFamily: golos }}>
            Fortaleza – CE
          </p>
        </div>
      </div>

      {/* Logo card bottom-right */}
      <div style={{
        position: 'absolute', right: 8, bottom: 8, width: 96, height: 46, zIndex: 5,
        backgroundColor: '#ffffff', borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6, boxSizing: 'border-box',
      }}>
        <AFLogo width={84} variant="color" />
      </div>
    </div>
  );
};

// ─── Slide 4+: FOTO SIMPLES ──────────────────────────────────────────────────
// Mesmo padrão do Slide 2: foto recortada com notch superior-esquerdo para o card da logo.
export const AFPhotoSlide = ({
  data,
  photo,
  photoIndex,
}: { data: AFPropertyData; photo?: string; photoIndex: number }) => {
  const uid = useId();
  const clipId = `af-photo-${uid}`;

  // Notch top-left: bordas externas 8→352, raio 12 em todas as curvas
  const shapePath = [
    'M 340 8',
    'A 12 12 0 0 1 352 20',
    'V 340',
    'A 12 12 0 0 1 340 352',
    'H 20',
    'A 12 12 0 0 1 8 340',
    'V 64',
    'Q 8 52 20 52',
    'H 100',
    'Q 120 52 120 40',
    'V 20',
    'A 12 12 0 0 1 132 8',
    'H 340',
    'Z',
  ].join(' ');

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: '#ffffff', fontFamily: golos, overflow: 'hidden' }}>

      {/* clipPath definition */}
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={shapePath} />
          </clipPath>
        </defs>
      </svg>

      {/* Foto recortada com notch superior-esquerdo */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 360, height: 360, clipPath: `url(#${clipId})`, zIndex: 10 }}>
        {photo ? (
          <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#cfe8eb' }} />
        )}
      </div>

      {/* Card da logo no notch superior-esquerdo */}
      <div style={{
        position: 'absolute', top: 4, left: 4, width: 116, height: 52, borderRadius: 14,
        backgroundColor: '#ffffff', zIndex: 5, display: 'flex', alignItems: 'center',
        paddingLeft: 8, paddingRight: 8, boxSizing: 'border-box',
      }}>
        <AFLogo width={100} variant="color" />
      </div>
    </div>
  );
};

// ─── Último Slide: INFORMAÇÃO ────────────────────────────────────────────────
// Mesmo padrão do AMInfoSlide: sandwich de camadas com borda branca SVG.
export const AFInfoSlide = ({ data, photo }: { data: AFPropertyData; photo?: string }) => {
  const uid = useId();
  const clipId = `af-info-${uid}`;

  const headline =
    data.infoMessage ||
    'Fortaleza é onde o sol nasce primeiro — e onde o seu lar pode ser o próximo capítulo.';
  const subtitle =
    'Na Apartamentos Fortaleza, acreditamos que comprar um imóvel é muito mais do que uma decisão financeira. É a realização de um sonho construído com amor, planejado com cuidado e celebrado em família. Estamos ao seu lado em cada passo.';

  // Mesmo shapePath do AMInfoSlide
  const shapePath = [
    'M 336 12',
    'A 12 12 0 0 1 348 24',
    'V 284',
    'Q 348 296 336 296',
    'H 254',
    'Q 242 296 242 308',
    'V 334',
    'A 12 12 0 0 1 230 346',
    'H 24',
    'A 12 12 0 0 1 12 334',
    'V 24',
    'A 12 12 0 0 1 24 12',
    'Z',
  ].join(' ');

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: '#1a1a1a', fontFamily: golos, overflow: 'hidden' }}>

      {/* clipPath definition */}
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={shapePath} />
          </clipPath>
        </defs>
      </svg>

      {/* LAYER 0: Foto de fundo desfocada */}
      {photo && (
        <img src={photo} alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', display: 'block',
          filter: 'brightness(0.5) blur(2px)', zIndex: 0,
        }} />
      )}

      {/* LAYER 1: Quadro branco da logo (128×72) */}
      <div style={{
        position: 'absolute', bottom: 13, right: 11, zIndex: 1,
        backgroundColor: '#ffffff', borderRadius: 16,
        width: 128, height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxSizing: 'border-box', padding: '12px 8px 0',
      }}>
        <AFLogo width={114} variant="color" />
      </div>

      {/* LAYER 2: Frame recortado com borda branca */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        {photo ? (
          <img src={photo} alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', display: 'block', clipPath: `url(#${clipId})`,
          }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: '#374151', clipPath: `url(#${clipId})` }} />
        )}

        {/* Gradiente escuro recortado */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(270deg, rgba(0,0,0,0) -18.53%, rgba(0,0,0,0.85) 100%)',
          clipPath: `url(#${clipId})`,
        }} />

        {/* Borda branca ao redor do shape */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 360 360">
          <path d={shapePath} fill="none" stroke="white" strokeWidth="2.5" />
        </svg>
      </div>

      {/* Título */}
      <h2 style={{
        position: 'absolute', left: 47, top: 38, width: 210,
        color: '#ffffff', fontFamily: golos, fontWeight: 600,
        fontSize: 20, lineHeight: '26px', margin: 0, zIndex: 10,
      }}>
        {headline}
      </h2>

      {/* Subtítulo */}
      <p style={{
        position: 'absolute', left: 47, top: 174, width: 178,
        color: '#ffffff', fontFamily: golos, fontWeight: 600,
        fontSize: 11, lineHeight: '15.5px', margin: 0, zIndex: 10,
      }}>
        {subtitle}
      </p>
    </div>
  );
};
