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
      style={{ backgroundColor: '#ffffff' }}
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
            style={{ backgroundColor: '#f1f5f9' }}
          >
            <span className="text-slate-400 text-lg">Foto</span>
          </div>
        )}
      </div>

      {/* Bottom gradient */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{
          background: 'linear-gradient(to top, rgba(255,255,255,0.9), transparent)',
        }}
      />

      {/* Label badge (optional) */}
      {label && (
        <div 
          className="absolute top-8 left-8 px-4 py-2 rounded-full"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <span 
            className="text-sm font-medium uppercase tracking-wide"
            style={{ color: '#0ea5e9' }}
          >
            {label}
          </span>
        </div>
      )}

      {/* Bottom logo */}
      <div className="absolute bottom-6 left-8">
        <RevendaLogo size="sm" variant="minimal" />
      </div>
    </div>
  );
};
