import { RevendaPropertyData } from '@/types/revenda';
import { RevendaWatermark } from '../RevendaLogo';

interface RevendaMultiPhotoStoryProps {
  data: RevendaPropertyData;
  photos: string[];
  label?: string;
  variant?: 'triangle' | 'rounded-boxes';
}

export const RevendaMultiPhotoStory = ({ data, photos, label, variant = 'triangle' }: RevendaMultiPhotoStoryProps) => {
  const photoCount = photos.length;
  
  // Triangular layout - modern with thin premium border
  const renderTriangleLayout = () => {
    if (photoCount < 3) return null;
    
    return (
      <div className="absolute inset-0">
        {/* Top large photo - takes upper 50% */}
        <div 
          className="absolute top-8 left-8 right-8 rounded-xl overflow-hidden"
          style={{ 
            height: '45%',
            border: '2px solid rgba(212,175,55,0.4)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <img 
            src={photos[0]} 
            alt="Property main"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Bottom left photo - diagonal offset */}
        <div 
          className="absolute left-8 rounded-xl overflow-hidden"
          style={{ 
            top: '52%',
            width: '55%',
            height: '42%',
            border: '2px solid rgba(212,175,55,0.4)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <img 
            src={photos[1]} 
            alt="Property 2"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Bottom right photo - offset higher for triangle effect */}
        <div 
          className="absolute right-8 rounded-xl overflow-hidden"
          style={{ 
            top: '58%',
            width: '40%',
            height: '36%',
            border: '2px solid rgba(212,175,55,0.4)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <img 
            src={photos[2]} 
            alt="Property 3"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  };

  // Rounded boxes layout - 3 photos in elegant boxes
  const renderRoundedBoxesLayout = () => {
    if (photoCount < 3) return null;
    
    return (
      <div className="absolute inset-0 flex flex-col gap-4 p-8">
        {/* Top photo - larger */}
        <div 
          className="w-full rounded-3xl overflow-hidden"
          style={{ 
            height: '40%',
            border: '3px solid rgba(212,175,55,0.5)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
          }}
        >
          <img 
            src={photos[0]} 
            alt="Property main"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Middle row - 2 photos side by side */}
        <div className="flex gap-4" style={{ height: '35%' }}>
          <div 
            className="w-1/2 rounded-3xl overflow-hidden"
            style={{ 
              border: '3px solid rgba(212,175,55,0.5)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
            }}
          >
            <img 
              src={photos[1]} 
              alt="Property 2"
              className="w-full h-full object-cover"
            />
          </div>
          <div 
            className="w-1/2 rounded-3xl overflow-hidden"
            style={{ 
              border: '3px solid rgba(212,175,55,0.5)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
            }}
          >
            <img 
              src={photos[2]} 
              alt="Property 3"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Spacer for logo */}
        <div style={{ height: '20%' }} />
      </div>
    );
  };

  return (
    <div 
      className="relative w-[1080px] h-[1920px] overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      }}
    >
      {/* Decorative elements */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 50%)',
        }}
      />

      {/* Photos layout */}
      {variant === 'triangle' && renderTriangleLayout()}
      {variant === 'rounded-boxes' && renderRoundedBoxesLayout()}

      {/* Label badge - top center */}
      {label && (
        <div className="absolute top-24 left-0 right-0 flex justify-center">
          <div 
            className="px-8 py-4 rounded-full"
            style={{ 
              backgroundColor: 'rgba(15,23,42,0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(212,175,55,0.4)',
            }}
          >
            <span 
              className="text-lg font-medium uppercase tracking-[0.3em]"
              style={{ 
                background: 'linear-gradient(135deg, #d4af37, #f4e5a3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {label}
            </span>
          </div>
        </div>
      )}

      {/* Property info at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 px-12 pb-24 pt-16"
        style={{
          background: 'linear-gradient(to top, rgba(15,23,42,0.98) 0%, rgba(15,23,42,0.7) 50%, transparent 100%)',
        }}
      >
        {data.propertyName && (
          <h2 
            className="font-display font-bold text-center mb-3"
            style={{ 
              fontSize: '42px',
              color: '#ffffff',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            {data.propertyName}
          </h2>
        )}
        
        {(data.neighborhood || data.city) && (
          <p 
            className="text-center text-xl font-light tracking-wide"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            {[data.neighborhood, data.city].filter(Boolean).join(' • ')}
          </p>
        )}
      </div>

      {/* Logo watermark */}
      <RevendaWatermark position="bottom-right" size="lg" />
    </div>
  );
};