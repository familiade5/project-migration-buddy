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
