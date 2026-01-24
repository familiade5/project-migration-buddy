import { RevendaPropertyData } from '@/types/revenda';
import { RevendaLogo } from '../RevendaLogo';

interface RevendaPhotoFeedProps {
  data: RevendaPropertyData;
  photo: string | null;
  label?: string;
}

export const RevendaPhotoFeed = ({ data, photo, label }: RevendaPhotoFeedProps) => {
  return (
    <div 
      className="relative w-[1080px] h-[1080px] overflow-hidden"
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
            <span className="text-slate-500 text-lg">Foto</span>
          </div>
        )}
        
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

      {/* Bottom logo bar */}
      <div 
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-10 py-6"
        style={{
          background: 'linear-gradient(to top, rgba(15,23,42,0.95), rgba(15,23,42,0.7), transparent)',
        }}
      >
        <RevendaLogo size="md" dark />
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
