// Feed slide 2/3: Photo slides - clean presentation
import { LocacaoPropertyData } from '@/types/locacao';
import { LocacaoWatermark } from '../LocacaoLogo';

interface LocacaoPhotoFeedProps {
  data: LocacaoPropertyData;
  photo: string | null;
  label?: string;
}

export const LocacaoPhotoFeed = ({ data, photo, label }: LocacaoPhotoFeedProps) => {
  return (
    <div 
      className="relative w-[1080px] h-[1080px] overflow-hidden"
      style={{ backgroundColor: '#1f2937' }}
    >
      {/* Photo */}
      {photo ? (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${photo})` }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p style={{ color: '#6b7280' }}>Adicione uma foto</p>
        </div>
      )}

      {/* Subtle gradient at bottom for label */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{ 
          background: 'linear-gradient(to top, rgba(17,24,39,0.8) 0%, transparent 100%)'
        }}
      />

      {/* Label */}
      {label && (
        <div 
          className="absolute bottom-8 left-8 px-4 py-2 rounded-md"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span 
            className="text-lg font-medium"
            style={{ color: '#ffffff' }}
          >
            {label}
          </span>
        </div>
      )}

      {/* Watermark */}
      <LocacaoWatermark position="bottom-right" size="sm" variant="light" />
    </div>
  );
};
