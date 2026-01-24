import { PropertyData } from '@/types/property';
import { EliteWatermark, EliteLogoBar } from '../EliteLogo';

interface ElitePhotoStoryProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
  photoIndex?: number;
}

export const ElitePhotoStory = ({ photo }: ElitePhotoStoryProps) => {
  return (
    <div 
      className="post-template-story relative overflow-hidden" 
      style={{ 
        width: '1080px', 
        height: '1920px',
        background: '#0a0a0f' 
      }}
    >
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
