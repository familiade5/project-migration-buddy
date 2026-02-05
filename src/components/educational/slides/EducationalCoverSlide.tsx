import { EducationalSlide, EducationalCategory, categoryLabels } from '@/types/educational';
import { getBackgroundByIndex } from '../backgrounds';

interface EducationalCoverSlideProps {
  slide: EducationalSlide;
  category: EducationalCategory;
  format: 'feed' | 'story';
  slideIndex: number;
  customImage?: string;
}

export const EducationalCoverSlide = ({ slide, category, format, slideIndex, customImage }: EducationalCoverSlideProps) => {
  const isStory = format === 'story';
  const bgImage = customImage || getBackgroundByIndex(category, slideIndex);
  
  return (
    <div 
      className={isStory ? 'post-template-story' : 'post-template'}
      style={{ 
        width: isStory ? '1080px' : '1080px',
        height: isStory ? '1920px' : '1080px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background image */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Very subtle overlay for text readability */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.35) 100%)',
        }}
      />

      {/* Top gold accent line */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, transparent 10%, #D4AF37 50%, transparent 90%)',
        }}
      />

      {/* Category badge - top right */}
      <div 
        style={{
          position: 'absolute',
          top: isStory ? '80px' : '60px',
          right: isStory ? '80px' : '60px',
        }}
      >
        <span 
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            background: 'rgba(212, 175, 55, 0.25)',
            border: '1px solid rgba(212, 175, 55, 0.6)',
            borderRadius: '50px',
            color: '#D4AF37',
            fontSize: isStory ? '26px' : '20px',
            fontWeight: '600',
            letterSpacing: '1px',
            backdropFilter: 'blur(10px)',
          }}
        >
          {categoryLabels[category]}
        </span>
      </div>

      {/* Main headline - centered */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          width: '85%',
        }}
      >
        {/* Decorative element above headline */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: isStory ? '40px' : '30px',
          }}
        >
          <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
          <div style={{ width: '8px', height: '8px', background: '#D4AF37', transform: 'rotate(45deg)' }} />
          <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
        </div>

        <h1 
          style={{
            fontSize: isStory ? '88px' : '80px',
            fontWeight: '700',
            color: '#ffffff',
            lineHeight: '1.15',
            whiteSpace: 'pre-line',
            textShadow: '0 6px 40px rgba(0,0,0,0.9), 0 3px 15px rgba(0,0,0,0.7)',
            letterSpacing: '-0.5px',
          }}
        >
          {slide.headline}
        </h1>

        {/* Decorative element below headline */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            marginTop: isStory ? '40px' : '30px',
          }}
        >
          <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
          <div style={{ width: '8px', height: '8px', background: '#D4AF37', transform: 'rotate(45deg)' }} />
          <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
        </div>
      </div>

      {/* VDH Text - centered at bottom */}
      <div 
        style={{
          position: 'absolute',
          bottom: isStory ? '100px' : '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
        }}
      >
        <span 
          style={{
            fontSize: isStory ? '60px' : '52px',
            fontWeight: '700',
            color: '#ffffff',
            letterSpacing: '8px',
            textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.7)',
          }}
        >
          VDH
        </span>
      </div>

      {/* Swipe indicator for stories */}
      {isStory && (
        <div 
          style={{
            position: 'absolute',
            bottom: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '18px',
            textTransform: 'uppercase',
            letterSpacing: '3px',
          }}
        >
          Arraste para ver →
        </div>
      )}
    </div>
  );
};
