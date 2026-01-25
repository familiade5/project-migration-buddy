// Story slide for 4 photos layout (grid 2x2)
import { LocacaoPropertyData } from '@/types/locacao';
import { LocacaoWatermark, LocacaoLogoBarStory } from '../LocacaoLogo';

interface LocacaoMultiPhotoStoryProps {
  data: LocacaoPropertyData;
  photos: string[];
  photoLabels?: string[];
  variant?: 'grid-4' | 'grid-2x2';
}

// Room label component - matching Revenda+ style
const RoomLabel = ({ label }: { label: string }) => (
  <div 
    className="absolute bottom-4 left-4 px-4 py-2 rounded-lg"
    style={{
      backgroundColor: 'rgba(31, 41, 55, 0.85)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(156, 163, 175, 0.3)',
    }}
  >
    <span 
      className="text-sm font-medium uppercase tracking-widest"
      style={{ color: '#d1d5db' }}
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

  // Grid 4 layout - 2x2 grid
  const renderGrid4 = () => {
    const displayPhotos = photos.slice(0, 4);
    
    return (
      <div className="absolute inset-0 flex flex-col gap-4 p-10" style={{ paddingTop: '100px', paddingBottom: '220px' }}>
        {/* Top row */}
        <div className="flex gap-4" style={{ flex: 1 }}>
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
        </div>
        
        {/* Bottom row */}
        <div className="flex gap-4" style={{ flex: 1 }}>
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
          {/* Fill empty spots if less than 4 photos */}
          {displayPhotos.length < 4 && Array.from({ length: 4 - displayPhotos.length }).map((_, i) => (
            displayPhotos.length + i >= 2 && (
              <div 
                key={`empty-${i}`}
                className="flex-1 rounded-3xl overflow-hidden relative flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                <span style={{ color: '#6b7280' }}>+</span>
              </div>
            )
          ))}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="relative w-[1080px] h-[1920px] overflow-hidden"
      style={{ backgroundColor: '#1f2937' }}
    >
      {renderGrid4()}

      {/* Property info at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 px-12 pb-28 pt-12"
        style={{
          background: 'linear-gradient(to top, rgba(31,41,55,0.98) 0%, rgba(31,41,55,0.7) 50%, transparent 100%)',
        }}
      >
        {data.propertyName && (
          <h2 
            className="font-semibold text-center mb-3"
            style={{ 
              fontSize: '42px',
              color: '#ffffff',
              fontFamily: 'Georgia, serif',
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

      {/* Logo */}
      <LocacaoLogoBarStory />
    </div>
  );
};
