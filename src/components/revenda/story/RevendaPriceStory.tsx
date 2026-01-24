import { RevendaPropertyData } from '@/types/revenda';
import { RevendaLogo, RevendaWatermark } from '../RevendaLogo';
import { Bed, Bath, Car, Maximize, MapPin, Quote } from 'lucide-react';

interface RevendaPriceStoryProps {
  data: RevendaPropertyData;
  photo: string | null;
}

// Generate emotional, conversion-focused description
const generateEmotionalDescription = (data: RevendaPropertyData): string => {
  const type = data.type || 'imóvel';
  const neighborhood = data.neighborhood || 'localização privilegiada';
  const bedrooms = data.bedrooms;
  const area = data.area;
  
  const parts: string[] = [];
  
  // Opening hook
  if (data.propertyName) {
    parts.push(`${data.propertyName} é mais que um endereço — é o lugar onde sua história vai acontecer.`);
  } else {
    parts.push(`Este ${type.toLowerCase()} em ${neighborhood} é mais que um endereço — é o lugar onde sua história vai acontecer.`);
  }
  
  if (data.hasNaturalLight) {
    parts.push('Imagine acordar todos os dias com a luz natural entrando suavemente.');
  }
  
  if (data.hasVaranda) {
    parts.push('Varanda perfeita para seus momentos de paz.');
  }
  
  if (data.hasVista) {
    parts.push('Vista privilegiada que transforma cada dia.');
  }
  
  if (data.hasGoodLayout) {
    parts.push('Ambientes bem distribuídos para seu conforto.');
  }
  
  if (bedrooms && parseInt(bedrooms) >= 3) {
    parts.push('Espaço generoso para toda a família.');
  }
  
  if (area && parseInt(area) >= 100) {
    parts.push(`São ${area}m² pensados para você.`);
  }
  
  parts.push('Agende sua visita e encontre seu lar.');
  
  return parts.join(' ');
};

export const RevendaPriceStory = ({ data, photo }: RevendaPriceStoryProps) => {
  const getLocationText = () => {
    const parts = [data.neighborhood, data.city, data.state].filter(Boolean);
    return parts.join(' • ');
  };

  // Use provided description or generate one
  const description = data.descricaoLivre || generateEmotionalDescription(data);

  return (
    <div 
      className="relative w-[1080px] h-[1920px] overflow-hidden"
      style={{ backgroundColor: '#fafafa' }}
    >
      {/* Top Photo - 35% */}
      <div className="absolute top-0 left-0 right-0 h-[35%] relative">
        {photo ? (
          <>
            <img 
              src={photo} 
              alt="Property"
              className="w-full h-full object-cover"
            />
            <RevendaWatermark position="top-right" size="md" />
          </>
        ) : (
          <div 
            className="w-full h-full"
            style={{ backgroundColor: '#e2e8f0' }}
          />
        )}
        
        {/* Bottom fade */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: 'linear-gradient(to top, #fafafa, transparent)',
          }}
        />
      </div>

      {/* Content */}
      <div className="absolute top-[33%] left-0 right-0 bottom-0 px-12 flex flex-col">
        {/* Property type badge */}
        <div className="flex justify-center mb-4">
          <div 
            className="px-6 py-2 rounded-full"
            style={{ backgroundColor: 'rgba(14,165,233,0.1)' }}
          >
            <span 
              className="text-sm font-medium uppercase tracking-widest"
              style={{ color: '#0ea5e9' }}
            >
              {data.type}
            </span>
          </div>
        </div>

        {/* Property Name */}
        <h2 
          className="font-display font-bold text-center leading-tight mb-3"
          style={{ fontSize: '44px', color: '#0f172a' }}
        >
          {data.propertyName || `${data.type} em ${data.neighborhood}`}
        </h2>

        {/* Location */}
        {getLocationText() && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <MapPin className="w-5 h-5" style={{ color: '#94a3b8' }} />
            <span className="text-lg" style={{ color: '#64748b' }}>
              {getLocationText()}
            </span>
          </div>
        )}

        {/* Specs Row */}
        <div 
          className="flex justify-center gap-8 py-5 px-6 rounded-xl mb-6"
          style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
        >
          {data.bedrooms && (
            <div className="flex items-center gap-3">
              <Bed className="w-6 h-6" style={{ color: '#0ea5e9' }} />
              <span className="text-lg font-semibold" style={{ color: '#0f172a' }}>{data.bedrooms} quartos</span>
            </div>
          )}
          {data.bathrooms && (
            <div className="flex items-center gap-3">
              <Bath className="w-6 h-6" style={{ color: '#0ea5e9' }} />
              <span className="text-lg font-semibold" style={{ color: '#0f172a' }}>{data.bathrooms} banheiros</span>
            </div>
          )}
          {data.garageSpaces && (
            <div className="flex items-center gap-3">
              <Car className="w-6 h-6" style={{ color: '#0ea5e9' }} />
              <span className="text-lg font-semibold" style={{ color: '#0f172a' }}>{data.garageSpaces} vagas</span>
            </div>
          )}
          {data.area && (
            <div className="flex items-center gap-3">
              <Maximize className="w-6 h-6" style={{ color: '#0ea5e9' }} />
              <span className="text-lg font-semibold" style={{ color: '#0f172a' }}>{data.area}m²</span>
            </div>
          )}
        </div>

        {/* Description Box (Blue) */}
        <div 
          className="p-8 rounded-2xl flex-grow flex flex-col"
          style={{ 
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          }}
        >
          {/* Quote icon */}
          <Quote 
            className="w-10 h-10 mb-4" 
            style={{ color: 'rgba(255,255,255,0.4)' }} 
          />
          
          {/* Description Text */}
          <p 
            className="leading-relaxed flex-grow"
            style={{ 
              fontSize: '28px', 
              color: 'rgba(255,255,255,0.95)',
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>

          {/* Price at bottom of blue box */}
          <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <p 
              className="text-sm font-medium uppercase tracking-widest mb-2"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              Investimento
            </p>
            <p 
              className="font-display font-bold"
              style={{ fontSize: '52px', color: '#ffffff' }}
            >
              {data.price || 'Consulte'}
            </p>
            {data.condominiumFee && (
              <p 
                className="text-base mt-2"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                Condomínio: {data.condominiumFee}
              </p>
            )}
          </div>
        </div>

        {/* Logo */}
        <div className="flex justify-center py-6">
          <RevendaLogo size="lg" />
        </div>
      </div>
    </div>
  );
};
