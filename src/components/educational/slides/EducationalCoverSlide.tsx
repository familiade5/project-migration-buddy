import { EducationalSlide, EducationalCategory, categoryLabels } from '@/types/educational';

interface EducationalCoverSlideProps {
  slide: EducationalSlide;
  category: EducationalCategory;
  format: 'feed' | 'story';
}

export const EducationalCoverSlide = ({ slide, category, format }: EducationalCoverSlideProps) => {
  const isStory = format === 'story';
  
  return (
    <div 
      className={isStory ? 'post-template-story' : 'post-template'}
      style={{ 
        width: isStory ? '1080px' : '1080px',
        height: isStory ? '1920px' : '1080px',
        background: 'linear-gradient(135deg, #0a0a14 0%, #12121f 50%, #0a0a14 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle geometric pattern */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(186, 158, 114, 0.08) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(186, 158, 114, 0.05) 0%, transparent 40%)`,
        }}
      />

      {/* Top accent line */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, transparent, #BA9E72, transparent)',
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
            padding: '10px 24px',
            background: 'rgba(186, 158, 114, 0.15)',
            border: '1px solid rgba(186, 158, 114, 0.3)',
            borderRadius: '50px',
            color: '#BA9E72',
            fontSize: isStory ? '24px' : '18px',
            fontWeight: '500',
            letterSpacing: '0.5px',
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
        <h1 
          style={{
            fontSize: isStory ? '72px' : '64px',
            fontWeight: '700',
            color: '#ffffff',
            lineHeight: '1.2',
            whiteSpace: 'pre-line',
            textShadow: '0 4px 30px rgba(0,0,0,0.3)',
          }}
        >
          {slide.headline}
        </h1>
      </div>

      {/* VDH Text - centered at bottom */}
      <div 
        style={{
          position: 'absolute',
          bottom: isStory ? '80px' : '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
        }}
      >
        <span 
          style={{
            fontSize: isStory ? '48px' : '40px',
            fontWeight: '700',
            color: '#ffffff',
            letterSpacing: '4px',
            opacity: 0.9,
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
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '18px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          Arraste para ver →
        </div>
      )}
    </div>
  );
};
