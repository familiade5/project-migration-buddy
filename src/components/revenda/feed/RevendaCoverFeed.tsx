import { RevendaPropertyData, CategorizedPhoto } from '@/types/revenda';
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
      style={{ backgroundColor: '#0f172a' }}
    >
      {/* Full Bleed Photo */}
      <div className="absolute inset-0">
        {photo ? (
          <img 
            src={photo} 
            alt="Property"
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            }}
          >
            <span className="text-slate-500 text-lg">Adicione uma foto de fachada</span>
          </div>
        )}
        
        {/* Elegant gradient overlay - subtle top, stronger bottom */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0) 30%, rgba(15,23,42,0.4) 60%, rgba(15,23,42,0.95) 100%)',
          }}
        />
      </div>

      {/* Top Logo */}
      <div className="absolute top-10 left-10">
        <RevendaLogo size="lg" variant="minimal" dark />
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 px-12 pb-12">
        {/* Property Name - Large, editorial */}
        <h1 
          className="font-display font-bold leading-[0.95] mb-6"
          style={{ 
            fontSize: '72px',
            color: '#ffffff',
            textShadow: '0 4px 30px rgba(0,0,0,0.5)',
          }}
        >
          {data.propertyName || data.type}
        </h1>
        
        {/* Location */}
        <div className="flex items-center gap-3 mb-8">
          <MapPin className="w-6 h-6" style={{ color: '#0ea5e9' }} />
          <span 
            className="text-xl font-light tracking-wide"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            {getLocationText() || 'Localização'}
          </span>
        </div>

        {/* Specs row - minimal, elegant */}
        <div 
          className="flex items-center gap-8 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
        >
          {data.bedrooms && (
            <div className="flex items-center gap-3">
              <Bed className="w-6 h-6" style={{ color: '#0ea5e9' }} />
              <span className="text-lg font-light" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {data.bedrooms} quartos
              </span>
            </div>
          )}
          {data.bathrooms && (
            <div className="flex items-center gap-3">
              <Bath className="w-6 h-6" style={{ color: '#0ea5e9' }} />
              <span className="text-lg font-light" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {data.bathrooms} banheiros
              </span>
            </div>
          )}
          {data.area && (
            <div className="flex items-center gap-3">
              <Maximize className="w-6 h-6" style={{ color: '#0ea5e9' }} />
              <span className="text-lg font-light" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {data.area} m²
              </span>
            </div>
          )}
          
          {/* Price - Right aligned */}
          {data.price && (
            <div className="ml-auto text-right">
              <p 
                className="font-display font-bold"
                style={{ fontSize: '32px', color: '#0ea5e9' }}
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
