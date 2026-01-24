import { PropertyData } from '@/types/property';
import { EliteWatermark, EliteLogoBar } from '../EliteLogo';

interface ElitePhotoSlideProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
  photoIndex?: number;
}

export const ElitePhotoSlide = ({ photo }: ElitePhotoSlideProps) => {
  return (
    <div className="post-template relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Full bleed photo - NO gradients, maximum quality */}
      {photo ? (
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: `url(${photo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1f] via-[#0f0f14] to-[#0a0a0f]" />
      )}

      {/* Subtle watermark */}
      <EliteWatermark opacity={0.05} />

      {/* Premium floating logo bar */}
      <EliteLogoBar />
    </div>
  );
};
