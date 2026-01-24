import { RevendaPropertyData } from '@/types/revenda';
import { RevendaWatermark } from '../RevendaLogo';

interface RevendaPhotoStoryProps {
  data: RevendaPropertyData;
  photo: string | null;
  label?: string;
}

export const RevendaPhotoStory = ({ data, photo, label }: RevendaPhotoStoryProps) => {
  return (
    <div 
      className="relative w-[1080px] h-[1920px] overflow-hidden"
      style={{ backgroundColor: '#0f172a' }}
    >
      {/* Full Photo */}
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
            <span className="text-slate-500 text-2xl">Foto</span>
          </div>
        )}
        
        {/* Subtle gradient overlays */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(15,23,42,0.4) 0%, transparent 20%, transparent 80%, rgba(15,23,42,0.9) 100%)',
          }}
        />
      </div>

      {/* Label badge (optional) - top center with blue styling */}
      {label && (
        <div className="absolute top-12 left-0 right-0 flex justify-center">
          <div 
            className="px-8 py-4 rounded-full"
            style={{ 
              backgroundColor: 'rgba(15,23,42,0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            <span 
              className="text-xl font-medium uppercase tracking-[0.2em]"
              style={{ 
                background: 'linear-gradient(135deg, #60a5fa, #93c5fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {label}
            </span>
          </div>
        </div>
      )}

      {/* Bottom info */}
      <div 
        className="absolute bottom-0 left-0 right-0 px-12 pb-24 pt-32"
        style={{
          background: 'linear-gradient(to top, rgba(15,23,42,0.95), transparent)',
        }}
      >
        {/* Property name */}
        {data.propertyName && (
          <h2 
            className="font-display font-bold text-center mb-4"
            style={{ 
              fontSize: '48px',
              color: '#ffffff',
              textShadow: '0 4px 30px rgba(0,0,0,0.5)',
            }}
          >
            {data.propertyName}
          </h2>
        )}
        
        {/* Location */}
        {(data.neighborhood || data.city) && (
          <p 
            className="text-center text-2xl font-light tracking-wide"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            {[data.neighborhood, data.city].filter(Boolean).join(' • ')}
          </p>
        )}
      </div>

      {/* Logo watermark - bottom right */}
      <RevendaWatermark position="bottom-right" size="lg" />
    </div>
  );
};