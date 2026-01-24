import { RevendaPropertyData, CategorizedPhoto, photoCategoryOrder } from '@/types/revenda';
import { RevendaLogo, RevendaLogoBar, RevendaWatermark } from '../RevendaLogo';
import { MapPin, Bed, Bath, Car, Maximize } from 'lucide-react';

interface RevendaCoverFeedProps {
  data: RevendaPropertyData;
  photo: string | null;
}

export const RevendaCoverFeed = ({ data, photo }: RevendaCoverFeedProps) => {
  const getLocationText = () => {
    const parts = [data.neighborhood, data.city, data.state].filter(Boolean);
    return parts.join(' • ');
  };

  return (
    <div 
      className="relative w-[1080px] h-[1080px] overflow-hidden"
      style={{ backgroundColor: '#ffffff' }}
    >
      {/* Main Photo - Top 70% */}
      <div className="absolute top-0 left-0 right-0 h-[70%]">
        {photo ? (
          <img 
            src={photo} 
            alt="Property"
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: '#f1f5f9' }}
          >
            <span className="text-slate-400 text-lg">Adicione uma foto de fachada</span>
          </div>
        )}
        
        {/* Gradient overlay at bottom of photo */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: 'linear-gradient(to top, rgba(255,255,255,1), transparent)',
          }}
        />
      </div>

      {/* Content Area - Bottom 30% */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%] px-12 py-8 flex flex-col justify-between">
        {/* Property Info */}
        <div className="space-y-3">
          {/* Property Name */}
          <h1 
            className="font-display font-bold leading-tight"
            style={{ 
              fontSize: '42px',
              color: '#0f172a',
            }}
          >
            {data.propertyName || `${data.type} em ${data.neighborhood}`}
          </h1>
          
          {/* Location */}
          <div className="flex items-center gap-2" style={{ color: '#64748b' }}>
            <MapPin className="w-5 h-5" style={{ color: '#0ea5e9' }} />
            <span className="text-lg">{getLocationText() || 'Localização'}</span>
          </div>

          {/* Features Row */}
          <div className="flex items-center gap-6 pt-2">
            {data.bedrooms && (
              <div className="flex items-center gap-2" style={{ color: '#475569' }}>
                <Bed className="w-5 h-5" style={{ color: '#0ea5e9' }} />
                <span className="font-medium">{data.bedrooms} quartos</span>
              </div>
            )}
            {data.bathrooms && (
              <div className="flex items-center gap-2" style={{ color: '#475569' }}>
                <Bath className="w-5 h-5" style={{ color: '#0ea5e9' }} />
                <span className="font-medium">{data.bathrooms} banheiros</span>
              </div>
            )}
            {data.garageSpaces && (
              <div className="flex items-center gap-2" style={{ color: '#475569' }}>
                <Car className="w-5 h-5" style={{ color: '#0ea5e9' }} />
                <span className="font-medium">{data.garageSpaces} vagas</span>
              </div>
            )}
            {data.area && (
              <div className="flex items-center gap-2" style={{ color: '#475569' }}>
                <Maximize className="w-5 h-5" style={{ color: '#0ea5e9' }} />
                <span className="font-medium">{data.area} m²</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#e2e8f0' }}>
          <RevendaLogo size="md" variant="minimal" />
          
          {/* Price */}
          {data.price && (
            <div className="text-right">
              <p className="text-sm" style={{ color: '#94a3b8' }}>A partir de</p>
              <p 
                className="font-display font-bold"
                style={{ fontSize: '28px', color: '#0ea5e9' }}
              >
                {data.price}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Subtle watermark */}
      <RevendaWatermark opacity={0.02} />
    </div>
  );
};
