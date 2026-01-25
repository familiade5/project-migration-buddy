// Story slide for 4 photos layout (grid 2x2)
import { LocacaoPropertyData } from '@/types/locacao';
import { LocacaoWatermark } from '../LocacaoLogo';

interface LocacaoMultiPhotoStoryProps {
  data: LocacaoPropertyData;
  photos: string[];
  photoLabels?: string[];
  variant?: 'grid-4' | 'grid-2x2';
}

// Room label component - matching Revenda+ style (larger size)
const RoomLabel = ({ label }: { label: string }) => (
  <div 
    className="absolute bottom-6 left-6 px-6 py-3 rounded-xl"
    style={{
      backgroundColor: 'rgba(31, 41, 55, 0.9)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(156, 163, 175, 0.3)',
    }}
  >
    <span 
      className="text-lg font-semibold uppercase tracking-widest"
      style={{ color: '#e5e7eb' }}
    >
      {label}
    </span>
  </div>
);

export const LocacaoMultiPhotoStory = ({ 
  data, 
  photos, 
  photoLabels = [],
  variant = 'grid-4' 
}: LocacaoMultiPhotoStoryProps) => {
  const getLabel = (index: number): string => {
    if (photoLabels[index]) return photoLabels[index];
    const defaults = ['Sala', 'Quarto', 'Cozinha', 'Banheiro'];
    return defaults[index] || 'Ambiente';
  };

  if (photos.length === 0) {
    return (
      <div 
        className="relative w-[1080px] h-[1920px] overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: '#1f2937' }}
      >
        <span className="text-lg" style={{ color: '#6b7280' }}>Adicione fotos</span>
      </div>
    );
  }

  // Grid 4 layout - 2x2 grid (photos only, no bottom gradient, logos on photos)
  const renderGrid4 = () => {
    const displayPhotos = photos.slice(0, 4);
    
    return (
      <div className="absolute inset-0 flex flex-col gap-5 p-8" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        {/* Top row */}
        <div className="flex gap-5" style={{ flex: 1 }}>
          {displayPhotos.slice(0, 2).map((photo, i) => (
            <div 
              key={i}
              className="flex-1 rounded-3xl overflow-hidden relative"
            >
              <img 
                src={photo} 
                alt={`Property ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <RoomLabel label={getLabel(i)} />
              <LocacaoWatermark position="top-right" size="sm" variant="light" />
            </div>
          ))}
          {/* Fill empty spot in top row if only 1 photo */}
          {displayPhotos.length === 1 && (
            <div 
              className="flex-1 rounded-3xl overflow-hidden relative flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              <span style={{ color: '#6b7280' }}>+</span>
            </div>
          )}
        </div>
        
        {/* Bottom row - only show if we have more than 2 photos */}
        {displayPhotos.length > 2 && (
          <div className="flex gap-5" style={{ flex: 1 }}>
            {displayPhotos.slice(2, 4).map((photo, i) => (
              <div 
                key={i + 2}
                className="flex-1 rounded-3xl overflow-hidden relative"
              >
                <img 
                  src={photo} 
                  alt={`Property ${i + 3}`}
                  className="w-full h-full object-cover"
                />
                <RoomLabel label={getLabel(i + 2)} />
                <LocacaoWatermark position="top-right" size="sm" variant="light" />
              </div>
            ))}
            {/* Fill empty spot if only 3 photos */}
            {displayPhotos.length === 3 && (
              <div 
                className="flex-1 rounded-3xl overflow-hidden relative flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                <span style={{ color: '#6b7280' }}>+</span>
              </div>
            )}
          </div>
        )}
        
        {/* Show 2 empty spots if we have exactly 2 photos */}
        {displayPhotos.length === 2 && (
          <div className="flex gap-5" style={{ flex: 1 }}>
            <div 
              className="flex-1 rounded-3xl overflow-hidden relative flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              <span style={{ color: '#6b7280' }}>+</span>
            </div>
            <div 
              className="flex-1 rounded-3xl overflow-hidden relative flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              <span style={{ color: '#6b7280' }}>+</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className="relative w-[1080px] h-[1920px] overflow-hidden"
      style={{ backgroundColor: '#1f2937' }}
    >
      {renderGrid4()}
      {/* No logo bar here - logos are on each photo only */}
    </div>
  );
};
