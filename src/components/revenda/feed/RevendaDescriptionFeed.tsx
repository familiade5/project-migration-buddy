import { RevendaPropertyData } from '@/types/revenda';
import { RevendaLogo, RevendaWatermark } from '../RevendaLogo';
import { MapPin, Quote } from 'lucide-react';

interface RevendaDescriptionFeedProps {
  data: RevendaPropertyData;
  photo: string | null;
}

// Generate emotional, conversion-focused description
export const generateEmotionalDescription = (data: RevendaPropertyData): string => {
  const type = data.type || 'imóvel';
  const neighborhood = data.neighborhood || 'localização privilegiada';
  const bedrooms = data.bedrooms;
  const area = data.area;
  
  // Build description based on available data
  const parts: string[] = [];
  
  // Opening hook
  if (data.propertyName) {
    parts.push(`${data.propertyName} é mais que um endereço — é o lugar onde sua história vai acontecer.`);
  } else {
    parts.push(`Este ${type.toLowerCase()} em ${neighborhood} é mais que um endereço — é o lugar onde sua história vai acontecer.`);
  }
  
  // Emotional benefits based on features
  if (data.hasNaturalLight) {
    parts.push('Imagine acordar todos os dias com a luz natural entrando suavemente pelas janelas.');
  }
  
  if (data.hasVaranda) {
    parts.push('Uma varanda perfeita para seus momentos de paz e contemplação.');
  }
  
  if (data.hasVista) {
    parts.push('A vista privilegiada transforma cada dia em uma experiência única.');
  }
  
  if (data.hasGoodLayout) {
    parts.push('Ambientes bem distribuídos que proporcionam conforto e praticidade no seu dia a dia.');
  }
  
  // Size benefits
  if (bedrooms && parseInt(bedrooms) >= 3) {
    parts.push('Espaço generoso para toda a família crescer junta, criando memórias que durarão para sempre.');
  } else if (bedrooms) {
    parts.push('O espaço ideal para quem valoriza qualidade de vida sem abrir mão do conforto.');
  }
  
  if (area && parseInt(area) >= 100) {
    parts.push(`São ${area}m² pensados para você viver com amplitude e liberdade.`);
  }
  
  // Location benefit
  parts.push(`Localizado em ${neighborhood}, você estará próximo de tudo que importa.`);
  
  // Closing CTA
  parts.push('Não deixe essa oportunidade passar. Agende sua visita e sinta a emoção de encontrar o seu lar.');
  
  return parts.join(' ');
};

export const RevendaDescriptionFeed = ({ data, photo }: RevendaDescriptionFeedProps) => {
  const getLocationText = () => {
    const parts = [data.neighborhood, data.city, data.state].filter(Boolean);
    return parts.join(' • ');
  };

  // Use provided description or generate one
  const description = data.descricaoLivre || generateEmotionalDescription(data);

  return (
    <div 
      className="relative w-[1080px] h-[1080px] overflow-hidden"
      style={{ backgroundColor: '#0f172a' }}
    >
      {/* Background Photo with overlay */}
      {photo && (
        <>
          <div className="absolute inset-0">
            <img 
              src={photo} 
              alt="Property"
              className="w-full h-full object-cover"
            />
          </div>
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.85) 100%)',
            }}
          />
        </>
      )}
      
      {/* Single watermark - top right only */}
      <RevendaWatermark position="top-right" size="sm" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col p-16">
        {/* Header */}
        <div className="mb-10">
          {/* Property Name */}
          <h2 
            className="font-display font-bold leading-tight mb-4"
            style={{ fontSize: '42px', color: '#ffffff' }}
          >
            {data.propertyName || `${data.type} em ${data.neighborhood}`}
          </h2>
          
          {/* Location */}
          {getLocationText() && (
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" style={{ color: '#0ea5e9' }} />
              <span className="text-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {getLocationText()}
              </span>
            </div>
          )}
        </div>

        {/* Quote Icon */}
        <div className="mb-6">
          <Quote 
            className="w-12 h-12" 
            style={{ color: '#0ea5e9', opacity: 0.5 }} 
          />
        </div>

        {/* Description Text */}
        <div className="flex-grow flex items-center">
          <p 
            className="leading-relaxed"
            style={{ 
              fontSize: '32px', 
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        </div>

        {/* Bottom: Price only - no logo here (watermark is top-right) */}
        <div className="flex items-end justify-between mt-10">
          {/* Price */}
          {data.price && (
            <div>
              <p 
                className="text-sm font-medium uppercase tracking-widest mb-2"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Investimento
              </p>
              <p 
                className="font-display font-bold"
                style={{ fontSize: '48px', color: '#0ea5e9' }}
              >
                {data.price}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
