import { AMPropertyData } from '@/types/apartamentosManaus';
import logoAM from '@/assets/logo-apartamentos-manaus.png';
import { formatCurrency } from '@/lib/formatCurrency';

// ─── Shared logo component ───────────────────────────────────────────────────
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
// Reference: Capa_png.png
// - Orange rounded badge top-left (name, neighborhood, bedrooms, area)
// - Full photo background
// - White logo bottom-left (semi-transparent)
// - Blue rounded price card bottom-right (VENDA badge, price, payment method)
export const AMCoverSlide = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const priceLabel = data.isRental ? 'LOCAÇÃO' : 'VENDA';
  const paymentLine = data.isRental
    ? 'Locação'
    : [
        data.acceptsFinancing && 'Aceita financiamento',
        data.acceptsFGTS && 'Aceita FGTS',
      ]
        .filter(Boolean)
        .join(' | ') || 'À vista';

  return (
    <div
      className="relative overflow-hidden"
      style={{ width: 360, height: 360, fontFamily: 'Arial, sans-serif', backgroundColor: '#1B5EA6' }}
    >
      {/* Background photo */}
      {photo && (
        <img
          src={photo}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Orange info badge – top left */}
      <div
        className="absolute top-3 left-3 z-10 px-3 py-2 rounded-2xl"
        style={{ backgroundColor: '#F47920', maxWidth: 220 }}
      >
        <p className="text-white font-bold text-sm leading-tight truncate">
          {data.title || 'Nome do Imóvel'}
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
          {data.neighborhood && (
            <span className="flex items-center gap-0.5 text-white text-xs opacity-90">
              <svg width="10" height="12" viewBox="0 0 10 12" fill="white">
                <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 7 5 7s5-3.25 5-7c0-2.76-2.24-5-5-5zm0 6.5C4.17 6.5 3.5 5.83 3.5 5S4.17 3.5 5 3.5 6.5 4.17 6.5 5 5.83 6.5 5 6.5z"/>
              </svg>
              {data.neighborhood}
            </span>
          )}
          {data.bedrooms > 0 && (
            <span className="text-white text-xs opacity-90">
              🛏 {data.bedrooms} {data.bedrooms === 1 ? 'Quarto' : 'Quartos'}
            </span>
          )}
          {data.area > 0 && (
            <span className="text-white text-xs opacity-90">
              📐 {data.area} m²
            </span>
          )}
        </div>
      </div>

      {/* Bottom-left: white logo */}
      <div className="absolute bottom-3 left-3 z-10" style={{ opacity: 0.85 }}>
        <AMLogo width={100} variant="white" />
      </div>

      {/* Bottom-right: Blue price card */}
      <div
        className="absolute bottom-3 right-3 z-10 px-4 py-3 rounded-2xl"
        style={{ backgroundColor: '#1B5EA6', minWidth: 140 }}
      >
        {/* VENDA/LOCAÇÃO badge */}
        <div
          className="inline-block text-white text-xs font-bold px-2 py-0.5 rounded-full mb-1"
          style={{ backgroundColor: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.4)' }}
        >
          {priceLabel}
        </div>

        {/* Price */}
        {price > 0 ? (
          <div className="text-white">
            <span className="text-xs opacity-70">R$</span>
            {' '}
            <span className="text-xl font-bold leading-tight">
              {price.toLocaleString('pt-BR').replace(',', '.')}
            </span>
            <span className="text-xs opacity-70">,00</span>
          </div>
        ) : (
          <div className="text-white font-bold text-lg">Consulte</div>
        )}

        {/* Payment label */}
        <p className="text-white text-xs opacity-80 mt-0.5 leading-tight">{paymentLine}</p>
      </div>
    </div>
  );
};

// ─── Slide 2: ESPECIFICAÇÕES ─────────────────────────────────────────────────
// Reference: slide_2.png
// - Color logo top-left on white rounded panel
// - Full photo background
// - Dark rounded specs box bottom-right with bullet list
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
      style={{ width: 360, height: 360, fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f0f0' }}
    >
      {/* Full photo */}
      {photo && (
        <img src={photo} alt="" className="absolute inset-0 w-full h-full object-cover" />
      )}

      {/* Top-left: white logo panel */}
      <div
        className="absolute top-3 left-3 z-10 px-3 py-2 rounded-2xl"
        style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}
      >
        <AMLogo width={90} variant="color" />
      </div>

      {/* Bottom-right: dark specs box */}
      {specs.length > 0 && (
        <div
          className="absolute bottom-3 right-3 z-10 px-4 py-3 rounded-2xl"
          style={{
            backgroundColor: 'rgba(31, 41, 55, 0.88)',
            backdropFilter: 'blur(4px)',
            maxWidth: 180,
          }}
        >
          {specs.map((spec, i) => (
            <div key={i} className="flex items-start gap-1.5 mb-0.5 last:mb-0">
              <span className="text-white text-xs opacity-60 mt-0.5">•</span>
              <span className="text-white text-xs leading-snug">{spec}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Slide 3: LOCALIZAÇÃO ────────────────────────────────────────────────────
// Reference: Slide_3.png
// - Blue rounded card top-left (title + address + CTA)
// - Photo occupies bottom half and right
// - White logo card bottom-right
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
      className="relative overflow-hidden"
      style={{ width: 360, height: 360, fontFamily: 'Arial, sans-serif', backgroundColor: '#e5e7eb' }}
    >
      {/* Photo – bottom half */}
      {photo && (
        <div className="absolute inset-0">
          <img src={photo} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Top-left: blue info card */}
      <div
        className="absolute top-3 left-3 z-10 px-4 py-3 rounded-2xl"
        style={{ backgroundColor: '#1B5EA6', maxWidth: 190 }}
      >
        <p className="text-white font-bold text-sm leading-snug mb-1">
          {data.title || 'Imóveis bem localizados em Manaus'}
        </p>
        {address && (
          <p className="text-white text-xs opacity-80 leading-snug mb-2">{address}</p>
        )}
        {data.referencePoint && (
          <p className="text-white text-xs opacity-70 leading-snug mb-2">{data.referencePoint}</p>
        )}
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white border border-white/40"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)', width: 'fit-content' }}
        >
          <span>Arraste para o lado</span>
          <span>→</span>
        </div>
      </div>

      {/* Bottom-right: white logo card */}
      <div
        className="absolute bottom-3 right-3 z-10 px-3 py-2 rounded-2xl flex items-center gap-2"
        style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}
      >
        <AMLogo width={80} variant="color" />
      </div>
    </div>
  );
};

// ─── Slide 4+: FOTO SIMPLES ──────────────────────────────────────────────────
// Reference: Slide_4.png
// - Color logo top-left on white panel
// - Full photo
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
      style={{ width: 360, height: 360, backgroundColor: '#1f2937' }}
    >
      <img src={photo} alt="" className="absolute inset-0 w-full h-full object-cover" />

      {/* Top-left logo panel */}
      <div
        className="absolute top-3 left-3 z-10 px-3 py-2 rounded-2xl"
        style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}
      >
        <AMLogo width={90} variant="color" />
      </div>
    </div>
  );
};

// ─── Último Slide: INFORMAÇÃO ────────────────────────────────────────────────
// Reference: Informação.png
// - Full photo bg with dark overlay
// - Large white headline + subtitle inside white-bordered rounded box
// - White logo card bottom-right
export const AMInfoSlide = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => {
  const headline = data.infoMessage ||
    'A Apartamentos Manaus acompanha você em todas as etapas da escolha do seu imóvel.';
  const subtitle =
    'Encontrar o imóvel ideal pode ser mais simples do que parece. A Apartamentos Manaus orienta você sobre as possibilidades de financiamento e acompanha todo o processo com transparência.';

  return (
    <div
      className="relative overflow-hidden"
      style={{ width: 360, height: 360, fontFamily: 'Arial, sans-serif', backgroundColor: '#111827' }}
    >
      {/* Background photo */}
      {photo && (
        <img src={photo} alt="" className="absolute inset-0 w-full h-full object-cover" />
      )}
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }} />

      {/* White-bordered content box */}
      <div
        className="absolute inset-4 z-10 rounded-2xl p-5 flex flex-col justify-between"
        style={{ border: '2px solid rgba(255,255,255,0.5)' }}
      >
        <div className="flex-1">
          <h2
            className="text-white font-bold leading-tight mb-3"
            style={{ fontSize: 18 }}
          >
            {headline}
          </h2>
          <p className="text-white opacity-80 leading-snug" style={{ fontSize: 11 }}>
            {subtitle}
          </p>
        </div>

        {/* Bottom-right: white logo card */}
        <div className="flex justify-end mt-3">
          <div
            className="px-3 py-2 rounded-xl flex items-center gap-2"
            style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}
          >
            <AMLogo width={75} variant="color" />
          </div>
        </div>
      </div>
    </div>
  );
};
