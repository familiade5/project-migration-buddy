import { RevendaPropertyData } from '@/types/revenda';
import { RevendaLogo } from '../RevendaLogo';

interface RevendaMultiPhotoFeedProps {
  data: RevendaPropertyData;
  photos: string[];
  label?: string;
}

export const RevendaMultiPhotoFeed = ({ data, photos, label }: RevendaMultiPhotoFeedProps) => {
  const photoCount = photos.length;
  
  // Layouts based on photo count
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
      // 2 photos: side by side
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
                  className="absolute top-0 right-0 bottom-0 w-1"
                  style={{ backgroundColor: '#0f172a' }}
                />
              )}
            </div>
          ))}
        </div>
      );
    }
    
    if (photoCount === 3) {
      // 3 photos: 1 large left, 2 stacked right
      return (
        <div className="w-full h-full flex">
          <div className="w-[60%] h-full relative">
            <img 
              src={photos[0]} 
              alt="Property main"
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute top-0 right-0 bottom-0 w-1"
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
                    className="absolute left-0 right-0 bottom-0 h-1"
                    style={{ backgroundColor: '#0f172a' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // 4+ photos: 2x2 grid
    return (
      <div className="w-full h-full grid grid-cols-2 grid-rows-2">
        {photos.slice(0, 4).map((photo, i) => (
          <div key={i} className="relative">
            <img 
              src={photo} 
              alt={`Property ${i + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Divider lines */}
            {(i === 0 || i === 2) && (
              <div 
                className="absolute top-0 right-0 bottom-0 w-0.5"
                style={{ backgroundColor: '#0f172a' }}
              />
            )}
            {(i === 0 || i === 1) && (
              <div 
                className="absolute left-0 right-0 bottom-0 h-0.5"
                style={{ backgroundColor: '#0f172a' }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      className="relative w-[1080px] h-[1080px] overflow-hidden"
      style={{ backgroundColor: '#0f172a' }}
    >
      {/* Photos Grid */}
      <div className="absolute inset-0">
        {renderLayout()}
        
        {/* Subtle gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, transparent 70%, rgba(15,23,42,0.8) 100%)',
          }}
        />
      </div>

      {/* Label badge (optional) - top left, elegant */}
      {label && (
        <div 
          className="absolute top-10 left-10 px-6 py-3 rounded-full"
          style={{ 
            backgroundColor: 'rgba(15,23,42,0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(14,165,233,0.3)',
          }}
        >
          <span 
            className="text-sm font-medium uppercase tracking-[0.2em]"
            style={{ color: '#0ea5e9' }}
          >
            {label}
          </span>
        </div>
      )}

      {/* Photo count badge - top right */}
      {photoCount > 1 && (
        <div 
          className="absolute top-10 right-10 px-5 py-3 rounded-full"
          style={{ 
            backgroundColor: 'rgba(15,23,42,0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <span 
            className="text-sm font-medium"
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            {photoCount} fotos
          </span>
        </div>
      )}

      {/* Bottom logo bar */}
      <div 
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-10 py-6"
        style={{
          background: 'linear-gradient(to top, rgba(15,23,42,0.95), rgba(15,23,42,0.7), transparent)',
        }}
      >
        <RevendaLogo size="md" variant="minimal" dark />
        {data.propertyName && (
          <span 
            className="text-sm font-light tracking-wide"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            {data.propertyName}
          </span>
        )}
      </div>
    </div>
  );
};
