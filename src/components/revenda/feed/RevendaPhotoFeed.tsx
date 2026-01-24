import { RevendaPropertyData } from '@/types/revenda';
import { RevendaWatermark } from '../RevendaLogo';

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

      {/* Logo centered at bottom - like reference image */}
      <RevendaWatermark position="bottom-center" size="lg" />
    </div>
  );
};
