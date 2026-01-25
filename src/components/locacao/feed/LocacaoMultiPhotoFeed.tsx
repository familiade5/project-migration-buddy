// Feed slide for 2 photos layout (top and bottom)
import { LocacaoPropertyData } from '@/types/locacao';
import { LocacaoWatermark } from '../LocacaoLogo';

interface LocacaoMultiPhotoFeedProps {
  data: LocacaoPropertyData;
  photos: string[];
  photoLabels?: string[];
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

export const LocacaoMultiPhotoFeed = ({ data, photos, photoLabels = [] }: LocacaoMultiPhotoFeedProps) => {
  const getLabel = (index: number): string => {
    if (photoLabels[index]) return photoLabels[index];
    const defaults = ['Sala', 'Quarto', 'Cozinha', 'Banheiro'];
    return defaults[index] || 'Ambiente';
  };

  if (photos.length === 0) {
    return (
      <div 
        className="relative w-[1080px] h-[1080px] overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: '#1f2937' }}
      >
        <span className="text-lg" style={{ color: '#6b7280' }}>Adicione fotos</span>
      </div>
    );
  }

  if (photos.length === 1) {
    return (
      <div 
        className="relative w-[1080px] h-[1080px] overflow-hidden"
        style={{ backgroundColor: '#1f2937' }}
      >
        <img src={photos[0]} alt="Property" className="w-full h-full object-cover" />
        <RoomLabel label={getLabel(0)} />
        <LocacaoWatermark position="top-right" size="sm" variant="light" />
      </div>
    );
  }

  // 2 photos: top and bottom layout
  return (
    <div 
      className="relative w-[1080px] h-[1080px] overflow-hidden"
      style={{ backgroundColor: '#1f2937' }}
    >
      <div className="absolute inset-0 p-6">
        <div className="w-full h-full flex flex-col gap-4">
          {/* Top photo */}
          <div className="flex-1 rounded-2xl overflow-hidden relative">
            <img src={photos[0]} alt="Property 1" className="w-full h-full object-cover" />
            <RoomLabel label={getLabel(0)} />
            <LocacaoWatermark position="top-right" size="sm" variant="light" />
          </div>

          {/* Bottom photo */}
          <div className="flex-1 rounded-2xl overflow-hidden relative">
            <img src={photos[1]} alt="Property 2" className="w-full h-full object-cover" />
            <RoomLabel label={getLabel(1)} />
            <LocacaoWatermark position="top-right" size="sm" variant="light" />
          </div>
        </div>
      </div>
    </div>
  );
};
