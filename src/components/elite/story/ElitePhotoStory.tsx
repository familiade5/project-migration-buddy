import { PropertyData } from '@/types/property';
import logoElite from '@/assets/logo-elite.png';

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
      {/* Full bleed photo - NO gradients, clean image */}
      {photo ? (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${photo})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1f] via-[#0f0f14] to-[#0a0a0f]" />
      )}

      {/* Watermark - Subtle "É" in the center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p 
          className="font-display font-bold tracking-[0.1em]"
          style={{ 
            fontSize: '500px', 
            color: 'rgba(255,255,255,0.06)',
            textShadow: '0 0 120px rgba(0,0,0,0.3)'
          }}
        >
          É
        </p>
      </div>

      {/* Bottom logo bar - Elegant floating design */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center"
        style={{ padding: '60px' }}
      >
        <div 
          className="flex items-center justify-center"
          style={{ 
            padding: '20px 50px',
            background: 'rgba(10, 10, 15, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: '100px',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            boxShadow: '0 15px 50px rgba(0,0,0,0.5)'
          }}
        >
          <img 
            src={logoElite} 
            alt="Élite Imóveis" 
            style={{ height: '50px', objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
};
