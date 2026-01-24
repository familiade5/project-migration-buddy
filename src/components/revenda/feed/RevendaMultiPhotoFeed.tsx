import { RevendaPropertyData } from '@/types/revenda';
import { RevendaWatermark } from '../RevendaLogo';

interface RevendaMultiPhotoFeedProps {
  data: RevendaPropertyData;
  photos: string[];
  label?: string;
  variant?: 'split' | 'triangle';
}

export const RevendaMultiPhotoFeed = ({ data, photos, label, variant = 'split' }: RevendaMultiPhotoFeedProps) => {
  const photoCount = photos.length;
  
  // Layout variants
  const renderLayout = () => {
    if (photoCount === 0) {
      return (
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          }}
        >
          <span className="text-slate-500 text-lg">Adicione fotos</span>
        </div>
      );
    }
    
    if (photoCount === 1) {
      return (
        <img 
          src={photos[0]} 
          alt="Property"
          className="w-full h-full object-cover"
        />
      );
    }
    
    if (photoCount === 2) {
      // 2 photos: side by side with elegant divider
      return (
        <div className="w-full h-full flex">
          {photos.slice(0, 2).map((photo, i) => (
            <div key={i} className="w-1/2 h-full relative">
              <img 
                src={photo} 
                alt={`Property ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {i === 0 && (
                <div 
                  className="absolute top-0 right-0 bottom-0 w-[3px]"
                  style={{ backgroundColor: '#0f172a' }}
                />
              )}
            </div>
          ))}
        </div>
      );
    }
    
    // 3 photos layouts
    if (photoCount >= 3) {
      if (variant === 'triangle') {
        // Triangular layout - modern and dynamic
        return (
          <div className="w-full h-full relative">
            {/* Top photo - full width, shorter height */}
            <div className="absolute top-0 left-0 right-0 h-[45%]">
              <img 
                src={photos[0]} 
                alt="Property main"
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute left-0 right-0 bottom-0 h-[3px]"
                style={{ backgroundColor: '#0f172a' }}
              />
            </div>
            
            {/* Bottom left photo - takes left side */}
            <div className="absolute bottom-0 left-0 w-[55%] h-[55%]">
              <img 
                src={photos[1]} 
                alt="Property 2"
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute top-0 right-0 bottom-0 w-[3px]"
                style={{ backgroundColor: '#0f172a' }}
              />
            </div>
            
            {/* Bottom right photo - takes right side */}
            <div className="absolute bottom-0 right-0 w-[45%] h-[55%]">
              <img 
                src={photos[2]} 
                alt="Property 3"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        );
      }
      
      // Default split layout: 1 large left, 2 stacked right
      return (
        <div className="w-full h-full flex">
          <div className="w-[60%] h-full relative">
            <img 
              src={photos[0]} 
              alt="Property main"
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute top-0 right-0 bottom-0 w-[3px]"
              style={{ backgroundColor: '#0f172a' }}
            />
          </div>
          <div className="w-[40%] h-full flex flex-col">
            {photos.slice(1, 3).map((photo, i) => (
              <div key={i} className="w-full h-1/2 relative">
                <img 
                  src={photo} 
                  alt={`Property ${i + 2}`}
                  className="w-full h-full object-cover"
                />
                {i === 0 && (
                  <div 
                    className="absolute left-0 right-0 bottom-0 h-[3px]"
                    style={{ backgroundColor: '#0f172a' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div 
      className="relative w-[1080px] h-[1080px] overflow-hidden"
      style={{ backgroundColor: '#0f172a' }}
    >
      {/* Photos Grid */}
      <div className="absolute inset-0">
        {renderLayout()}
        
        {/* Subtle gradient overlay at bottom */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(15,23,42,0.5) 100%)',
          }}
        />
      </div>

      {/* Label badge (optional) - top left, elegant blue styling */}
      {label && (
        <div 
          className="absolute top-10 left-10 px-6 py-3 rounded-full"
          style={{ 
            backgroundColor: 'rgba(15,23,42,0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          }}
        >
          <span 
            className="text-sm font-medium uppercase tracking-[0.2em]"
            style={{ 
              background: 'linear-gradient(135deg, #60a5fa, #93c5fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {label}
          </span>
        </div>
      )}

      {/* Logo watermark - bottom right, subtle */}
      <RevendaWatermark position="bottom-right" size="md" />
    </div>
  );
};