// Feed single photo slide - clean presentation with larger labels
import { LocacaoPropertyData } from '@/types/locacao';
import { LocacaoWatermark } from '../LocacaoLogo';

interface LocacaoPhotoFeedProps {
  data: LocacaoPropertyData;
  photo: string | null;
  label?: string;
}

// Room label component - matching Revenda+ style and size
const RoomLabel = ({ label }: { label: string }) => (
  <div 
    className="absolute bottom-8 left-8 px-6 py-3 rounded-lg"
    style={{
      backgroundColor: 'rgba(31, 41, 55, 0.85)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(156, 163, 175, 0.3)',
    }}
  >
    <span 
      className="text-lg font-medium uppercase tracking-widest"
      style={{ color: '#d1d5db' }}
    >
      {label}
    </span>
  </div>
);

export const LocacaoPhotoFeed = ({ data, photo, label }: LocacaoPhotoFeedProps) => {
  return (
    <div 
      className="relative w-[1080px] h-[1080px] overflow-hidden"
      style={{ backgroundColor: '#1f2937' }}
    >
      {/* Photo - full bleed, no shadows */}
      {photo ? (
        <img 
          src={photo} 
          alt="Property"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p style={{ color: '#6b7280' }}>Adicione uma foto</p>
        </div>
      )}

      {/* Label - larger, matching Revenda+ */}
      {label && <RoomLabel label={label} />}

      {/* Watermark */}
      <LocacaoWatermark position="bottom-center" size="md" variant="light" />
    </div>
  );
};
