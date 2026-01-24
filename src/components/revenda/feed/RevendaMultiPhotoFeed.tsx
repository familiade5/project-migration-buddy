import { RevendaPropertyData } from '@/types/revenda';
import { RevendaWatermark } from '../RevendaLogo';

interface RevendaMultiPhotoFeedProps {
  data: RevendaPropertyData;
  photos: string[];
  photoLabels?: string[];
  label?: string;
  variant?: 'triangle' | 'rounded-boxes' | 'split';
}

// Room label component - elegante e consistente com o Story
const RoomLabel = ({ label }: { label: string }) => (
  <div 
    className="absolute bottom-4 left-4 px-4 py-2 rounded-lg"
    style={{
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
    }}
  >
    <span 
      className="text-sm font-medium uppercase tracking-widest"
      style={{ 
        background: 'linear-gradient(135deg, #60a5fa, #93c5fd)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {label}
    </span>
  </div>
);

export const RevendaMultiPhotoFeed = ({ data, photos, photoLabels = [], label, variant = 'triangle' }: RevendaMultiPhotoFeedProps) => {
  const photoCount = photos.length;

  const getLabel = (index: number): string => {
    if (photoLabels[index]) return photoLabels[index];
    const defaults = ['Sala', 'Quarto', 'Cozinha'];
    return defaults[index] || 'Ambiente';
  };
  
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
        <div className="w-full h-full relative">
          <img 
            src={photos[0]} 
            alt="Property"
            className="w-full h-full object-cover"
          />
          <RoomLabel label={getLabel(0)} />
          <RevendaWatermark position="top-right" size="sm" />
        </div>
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
              <RoomLabel label={getLabel(i)} />
              <RevendaWatermark position="top-right" size="sm" />
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
      if (variant === 'rounded-boxes') {
        // Mesmo espírito do Story 3, adaptado para 1:1 (1080x1080)
        return (
          <div className="absolute inset-0 p-10" style={{ paddingTop: '90px', paddingBottom: '90px' }}>
            <div className="w-full h-full flex flex-col gap-4">
              {/* Top hero */}
              <div
                className="w-full rounded-3xl overflow-hidden relative"
                style={{
                  flex: '1.15',
                  border: '3px solid rgba(59, 130, 246, 0.5)',
                  boxShadow: '0 12px 40px rgba(59, 130, 246, 0.2), 0 8px 24px rgba(0,0,0,0.3)',
                }}
              >
                <img src={photos[0]} alt="Property main" className="w-full h-full object-cover" />
                <RoomLabel label={getLabel(0)} />
                <RevendaWatermark position="top-right" size="sm" />
              </div>

              {/* Bottom row */}
              <div className="flex gap-4" style={{ flex: '1' }}>
                <div
                  className="flex-1 rounded-3xl overflow-hidden relative"
                  style={{
                    border: '3px solid rgba(59, 130, 246, 0.5)',
                    boxShadow: '0 12px 40px rgba(59, 130, 246, 0.2), 0 8px 24px rgba(0,0,0,0.3)',
                  }}
                >
                  <img src={photos[1]} alt="Property 2" className="w-full h-full object-cover" />
                  <RoomLabel label={getLabel(1)} />
                  <RevendaWatermark position="top-right" size="sm" />
                </div>
                <div
                  className="flex-1 rounded-3xl overflow-hidden relative"
                  style={{
                    border: '3px solid rgba(59, 130, 246, 0.5)',
                    boxShadow: '0 12px 40px rgba(59, 130, 246, 0.2), 0 8px 24px rgba(0,0,0,0.3)',
                  }}
                >
                  <img src={photos[2]} alt="Property 3" className="w-full h-full object-cover" />
                  <RoomLabel label={getLabel(2)} />
                  <RevendaWatermark position="top-right" size="sm" />
                </div>
              </div>
            </div>
          </div>
        );
      }

      if (variant === 'triangle') {
        // Mesmo espírito do Story 2, adaptado para 1:1 (1080x1080)
        return (
          <div className="absolute inset-0 p-10">
            {/* Main hero */}
            <div
              className="absolute rounded-2xl overflow-hidden"
              style={{
                top: '90px',
                left: '40px',
                right: '40px',
                height: '50%',
                border: '2px solid rgba(59, 130, 246, 0.5)',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2), 0 4px 16px rgba(0,0,0,0.3)',
              }}
            >
              <img src={photos[0]} alt="Property main" className="w-full h-full object-cover" />
              <RoomLabel label={getLabel(0)} />
              <RevendaWatermark position="top-right" size="sm" />
            </div>

            {/* Bottom row */}
            <div
              className="absolute flex gap-4"
              style={{
                top: '62%',
                left: '40px',
                right: '40px',
                height: '30%',
              }}
            >
              <div
                className="flex-1 rounded-2xl overflow-hidden relative"
                style={{
                  border: '2px solid rgba(59, 130, 246, 0.5)',
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2), 0 4px 16px rgba(0,0,0,0.3)',
                }}
              >
                <img src={photos[1]} alt="Property 2" className="w-full h-full object-cover" />
                <RoomLabel label={getLabel(1)} />
                <RevendaWatermark position="top-right" size="sm" />
              </div>
              <div
                className="flex-1 rounded-2xl overflow-hidden relative"
                style={{
                  border: '2px solid rgba(59, 130, 246, 0.5)',
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2), 0 4px 16px rgba(0,0,0,0.3)',
                }}
              >
                <img src={photos[2]} alt="Property 3" className="w-full h-full object-cover" />
                <RoomLabel label={getLabel(2)} />
                <RevendaWatermark position="top-right" size="sm" />
              </div>
            </div>
          </div>
        );
      }

      // Fallback split (mantido)
      return (
        <div className="w-full h-full flex">
          <div className="w-[60%] h-full relative">
            <img src={photos[0]} alt="Property main" className="w-full h-full object-cover" />
            <RoomLabel label={getLabel(0)} />
            <RevendaWatermark position="top-right" size="sm" />
            <div className="absolute top-0 right-0 bottom-0 w-[3px]" style={{ backgroundColor: '#0f172a' }} />
          </div>
          <div className="w-[40%] h-full flex flex-col">
            {photos.slice(1, 3).map((photo, i) => (
              <div key={i} className="w-full h-1/2 relative">
                <img src={photo} alt={`Property ${i + 2}`} className="w-full h-full object-cover" />
                <RoomLabel label={getLabel(i + 1)} />
                <RevendaWatermark position="top-right" size="sm" />
                {i === 0 && (
                  <div className="absolute left-0 right-0 bottom-0 h-[3px]" style={{ backgroundColor: '#0f172a' }} />
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