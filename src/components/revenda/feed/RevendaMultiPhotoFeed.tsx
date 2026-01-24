import { RevendaPropertyData } from '@/types/revenda';
import { RevendaWatermark } from '../RevendaLogo';

interface RevendaMultiPhotoFeedProps {
  data: RevendaPropertyData;
  photos: string[];
  photoLabels?: string[];
  label?: string;
  variant?: 'rounded-boxes' | 'split-left';
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

export const RevendaMultiPhotoFeed = ({ data, photos, photoLabels = [], label, variant = 'rounded-boxes' }: RevendaMultiPhotoFeedProps) => {
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
      // Slide 3: split-left - 1 grande à esquerda, 2 empilhadas à direita
      if (variant === 'split-left') {
        return (
          <div className="absolute inset-0 p-6">
            <div className="w-full h-full flex gap-3">
              {/* Left - large photo */}
              <div
                className="rounded-2xl overflow-hidden relative"
                style={{ flex: '1.15' }}
              >
                <img src={photos[0]} alt="Property main" className="w-full h-full object-cover" />
                <RoomLabel label={getLabel(0)} />
                <RevendaWatermark position="top-right" size="sm" />
              </div>

              {/* Right column - 2 stacked photos */}
              <div className="flex flex-col gap-3" style={{ flex: '1' }}>
                <div className="flex-1 rounded-2xl overflow-hidden relative">
                  <img src={photos[1]} alt="Property 2" className="w-full h-full object-cover" />
                  <RoomLabel label={getLabel(1)} />
                  <RevendaWatermark position="top-right" size="sm" />
                </div>
                <div className="flex-1 rounded-2xl overflow-hidden relative">
                  <img src={photos[2]} alt="Property 3" className="w-full h-full object-cover" />
                  <RoomLabel label={getLabel(2)} />
                  <RevendaWatermark position="top-right" size="sm" />
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Slide 2: rounded-boxes - hero em cima, 2 embaixo
      // Padrão
      return (
        <div className="absolute inset-0 p-6">
          <div className="w-full h-full flex flex-col gap-3">
            {/* Top hero */}
            <div
              className="w-full rounded-2xl overflow-hidden relative"
              style={{ flex: '1.15' }}
            >
              <img src={photos[0]} alt="Property main" className="w-full h-full object-cover" />
              <RoomLabel label={getLabel(0)} />
              <RevendaWatermark position="top-right" size="sm" />
            </div>

            {/* Bottom row */}
            <div className="flex gap-3" style={{ flex: '1' }}>
              <div className="flex-1 rounded-2xl overflow-hidden relative">
                <img src={photos[1]} alt="Property 2" className="w-full h-full object-cover" />
                <RoomLabel label={getLabel(1)} />
                <RevendaWatermark position="top-right" size="sm" />
              </div>
              <div className="flex-1 rounded-2xl overflow-hidden relative">
                <img src={photos[2]} alt="Property 3" className="w-full h-full object-cover" />
                <RoomLabel label={getLabel(2)} />
                <RevendaWatermark position="top-right" size="sm" />
              </div>
            </div>
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

      {/* Remove logo watermark from bottom - logos are now on individual photos */}
    </div>
  );
};
