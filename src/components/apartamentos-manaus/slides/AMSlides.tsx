import { AMPropertyData } from '@/types/apartamentosManaus';
import { AMLogoSVG, AMWatermark } from '../AMLogo';
import { formatCurrency } from '@/lib/formatCurrency';

// ─── Slide 1: Capa com preço ────────────────────────────────────────────────
export const AMCoverSlide = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const priceLabel = data.isRental ? 'LOCAÇÃO' : 'VENDA';
  const paymentLabel = data.isRental
    ? 'Locação'
    : data.acceptsFinancing
    ? 'À vista | Aceita financiamento'
    : 'À vista';

  return (
    <div
      className="relative overflow-hidden flex flex-col"
      style={{ width: 360, height: 360, backgroundColor: '#1B5EA6', fontFamily: 'Arial, sans-serif' }}
    >
      {/* Background photo */}
      {photo && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${photo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.35)' }} />

      {/* Top orange banner */}
      <div
        className="absolute top-0 left-0 right-0 z-10 px-3 py-2"
        style={{ backgroundColor: '#F47920' }}
      >
        <p className="text-white font-bold text-sm truncate leading-tight">
          {data.title || 'Nome do Imóvel'}
        </p>
        <div className="flex items-center gap-3 text-white text-xs opacity-90 mt-0.5">
          {data.bedrooms > 0 && <span>🛏 {data.bedrooms} {data.bedrooms === 1 ? 'quarto' : 'quartos'}</span>}
          {data.area > 0 && <span>📐 {data.area} m²</span>}
          {data.neighborhood && <span>📍 {data.neighborhood}</span>}
        </div>
      </div>

      {/* Bottom price section */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end">
        {/* Logo bottom-left */}
        <div className="flex-1 p-3">
          <AMLogoSVG width={110} variant="white" />
        </div>
        {/* Price badge */}
        <div
          className="rounded-tl-2xl px-4 py-3 text-right"
          style={{ backgroundColor: '#1B5EA6', minWidth: 150 }}
        >
          <div
            className="text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-1"
            style={{ backgroundColor: '#F47920', color: 'white' }}
          >
            {priceLabel}
          </div>
          <div className="text-white font-bold text-lg leading-tight">
            {price > 0 ? formatCurrency(price) : 'Consulte'}
          </div>
          <div className="text-white text-xs opacity-80 mt-0.5">{paymentLabel}</div>
        </div>
      </div>
    </div>
  );
};

// ─── Slide 2: Detalhes / Ficha Técnica ──────────────────────────────────────
export const AMDetailsSlide = ({ data }: { data: AMPropertyData }) => {
  const specs = [
    data.bedrooms > 0 && { icon: '🛏', label: 'Quartos', value: String(data.bedrooms) },
    data.suites > 0 && { icon: '🛁', label: 'Suítes', value: String(data.suites) },
    data.bathrooms > 0 && { icon: '🚿', label: 'Banheiros', value: String(data.bathrooms) },
    data.area > 0 && { icon: '📐', label: 'Área', value: `${data.area} m²` },
    data.garageSpaces > 0 && { icon: '🚗', label: 'Vagas', value: String(data.garageSpaces) },
    data.floor && { icon: '🏢', label: 'Andar', value: data.floor },
    data.furnished && { icon: '🛋', label: 'Mobiliado', value: 'Sim' },
    data.condominiumFee > 0 && { icon: '💰', label: 'Condomínio', value: formatCurrency(data.condominiumFee) },
    data.iptu > 0 && { icon: '📋', label: 'IPTU', value: formatCurrency(data.iptu) },
  ].filter(Boolean) as { icon: string; label: string; value: string }[];

  return (
    <div
      className="relative overflow-hidden flex flex-col"
      style={{ width: 360, height: 360, backgroundColor: '#FFFFFF', fontFamily: 'Arial, sans-serif' }}
    >
      {/* Blue top bar */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{ backgroundColor: '#1B5EA6' }}
      >
        <AMLogoSVG width={120} variant="white" />
        <div className="flex-1" />
        <span className="text-white text-xs font-semibold opacity-80">{data.propertyType}</span>
      </div>

      {/* Title */}
      <div className="px-5 py-3 border-b border-gray-100">
        <h2 className="font-bold text-base leading-tight" style={{ color: '#1B5EA6' }}>
          {data.title || 'Nome do Imóvel'}
        </h2>
        {data.neighborhood && (
          <p className="text-xs text-gray-500 mt-0.5">
            📍 {data.neighborhood}, {data.city} - {data.state}
          </p>
        )}
      </div>

      {/* Specs grid */}
      <div className="flex-1 p-4 grid grid-cols-3 gap-2 content-start">
        {specs.slice(0, 9).map((spec, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center rounded-xl p-2 text-center"
            style={{ backgroundColor: '#F0F6FF', minHeight: 64 }}
          >
            <span className="text-xl">{spec.icon}</span>
            <span className="text-xs text-gray-500 mt-0.5">{spec.label}</span>
            <span className="text-sm font-bold" style={{ color: '#1B5EA6' }}>{spec.value}</span>
          </div>
        ))}
      </div>

      {/* Orange bottom accent */}
      <div className="h-1.5" style={{ backgroundColor: '#F47920' }} />
    </div>
  );
};

// ─── Slide 3: Foto individual ────────────────────────────────────────────────
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
      style={{ width: 360, height: 360, backgroundColor: '#111827' }}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `url(${photo})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      {/* subtle gradient at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}
      />
      {/* Photo counter */}
      <div
        className="absolute top-3 right-3 text-xs font-bold text-white px-2 py-1 rounded-full"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        📷 {photoIndex}
      </div>
      {/* Bottom info strip */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end p-3">
        <AMLogoSVG width={100} variant="white" />
        <div className="flex-1 text-right">
          <p className="text-white font-bold text-sm truncate">{data.title || ''}</p>
          <p className="text-white text-xs opacity-70">{data.neighborhood}</p>
        </div>
      </div>
    </div>
  );
};

// ─── Slide 4: Contato ────────────────────────────────────────────────────────
export const AMContactSlide = ({ data }: { data: AMPropertyData }) => {
  return (
    <div
      className="relative overflow-hidden flex flex-col items-center justify-center text-center"
      style={{
        width: 360,
        height: 360,
        background: 'linear-gradient(135deg, #1B5EA6 0%, #0D3D73 100%)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Orange accent top */}
      <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: '#F47920' }} />

      <div className="px-8 space-y-5">
        <AMLogoSVG width={160} variant="white" />

        <div>
          <p className="text-white text-sm opacity-70 mb-1">Fale com nosso corretor</p>
          {data.brokerName && (
            <p className="text-white font-bold text-lg">{data.brokerName}</p>
          )}
          {data.creci && (
            <p className="text-xs opacity-60" style={{ color: '#F47920' }}>CRECI {data.creci}</p>
          )}
        </div>

        {data.brokerPhone && (
          <div
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-full text-white font-bold"
            style={{ backgroundColor: '#F47920' }}
          >
            <span>📱</span>
            <span>{data.brokerPhone}</span>
          </div>
        )}

        <div>
          <p className="text-white font-semibold">{data.title || ''}</p>
          <p className="text-xs opacity-60 text-white mt-0.5">
            {data.neighborhood && `${data.neighborhood} • `}{data.city} - {data.state}
          </p>
        </div>
      </div>

      {/* Orange accent bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ backgroundColor: '#F47920' }} />
    </div>
  );
};

// ─── Slide 5: Mensagem Informativa ────────────────────────────────────────────
export const AMInfoSlide = ({ data }: { data: AMPropertyData }) => {
  const highlights = data.highlights.filter(Boolean);
  const defaultHighlights = [
    '✅ Financiamento facilitado',
    '✅ Documentação segura',
    '✅ Assessoria completa',
    '✅ Atendimento personalizado',
    '✅ Localização privilegiada',
    '✅ Melhor custo-benefício',
  ];
  const items = highlights.length > 0 ? highlights : defaultHighlights;

  return (
    <div
      className="relative overflow-hidden flex flex-col"
      style={{ width: 360, height: 360, backgroundColor: '#FFFFFF', fontFamily: 'Arial, sans-serif' }}
    >
      {/* Orange top bar */}
      <div className="px-5 py-3" style={{ backgroundColor: '#F47920' }}>
        <p className="text-white font-bold text-base">Por que escolher este imóvel?</p>
        <p className="text-white text-xs opacity-80 truncate">{data.title || 'Apartamentos Manaus'}</p>
      </div>

      {/* Highlights */}
      <div className="flex-1 p-4 space-y-2 overflow-hidden">
        {items.slice(0, 6).map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: i % 2 === 0 ? '#F0F6FF' : '#FFF5ED',
              color: i % 2 === 0 ? '#1B5EA6' : '#F47920',
            }}
          >
            {item}
          </div>
        ))}

        {data.infoMessage && (
          <div
            className="mt-2 px-3 py-2 rounded-lg text-xs italic text-gray-600 border border-gray-200"
          >
            💬 {data.infoMessage}
          </div>
        )}
      </div>

      {/* Logo footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100">
        <AMLogoSVG width={110} variant="color" />
        {data.brokerPhone && (
          <span className="text-xs font-bold" style={{ color: '#F47920' }}>{data.brokerPhone}</span>
        )}
      </div>
    </div>
  );
};
