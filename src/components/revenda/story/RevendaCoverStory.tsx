import { RevendaPropertyData } from '@/types/revenda';
import { RevendaLogo, RevendaLogoBarStory } from '../RevendaLogo';
import { MapPin } from 'lucide-react';

interface RevendaCoverStoryProps {
  data: RevendaPropertyData;
  photo: string | null;
}

export const RevendaCoverStory = ({ data, photo }: RevendaCoverStoryProps) => {
  const getLocationText = () => {
    const parts = [data.neighborhood, data.city].filter(Boolean);
    return parts.join(' • ');
  };

  return (
    <div 
      className="relative w-[1080px] h-[1920px] overflow-hidden"
      style={{ backgroundColor: '#0f172a' }}
    >
      {/* Full Background Photo */}
      <div className="absolute inset-0">
        {photo ? (
          <img 
            src={photo} 
            alt="Property"
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full"
            style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            }}
          />
        )}
        
        {/* Elegant gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.1) 40%, rgba(15,23,42,0.6) 70%, rgba(15,23,42,0.95) 100%)',
          }}
        />
      </div>

      {/* Top Logo */}
      <div className="absolute top-12 left-0 right-0 flex justify-center">
        <RevendaLogo size="xxl" />
      </div>

      {/* Property Title - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-12 pb-48">
        {/* Property Name */}
        <h1 
          className="font-display font-bold leading-tight mb-6 text-center"
          style={{ 
            fontSize: '72px',
            color: '#ffffff',
            textShadow: '0 4px 30px rgba(0,0,0,0.5)',
          }}
        >
          {data.propertyName || data.type}
        </h1>
        
        {/* Location */}
        {getLocationText() && (
          <div className="flex items-center justify-center gap-3">
            <MapPin 
              className="w-8 h-8" 
              style={{ color: '#0ea5e9' }} 
            />
            <span 
              className="text-3xl font-light tracking-wide"
              style={{ color: 'rgba(255,255,255,0.9)' }}
            >
              {getLocationText()}
            </span>
          </div>
        )}

        {/* Subtle divider */}
        <div 
          className="w-24 h-1 mx-auto mt-10 rounded-full"
          style={{ backgroundColor: '#0ea5e9' }}
        />
      </div>
    </div>
  );
};
