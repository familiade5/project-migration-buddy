import { EducationalSlide } from '@/types/educational';
import logoVDH from '@/assets/logo-vdh-revenda-white-alpha.png';
import { Sparkles } from 'lucide-react';

interface EducationalHighlightSlideProps {
  slide: EducationalSlide;
  slideNumber: number;
  totalSlides: number;
  format: 'feed' | 'story';
}

export const EducationalHighlightSlide = ({ 
  slide, 
  slideNumber, 
  totalSlides, 
  format 
}: EducationalHighlightSlideProps) => {
  const isStory = format === 'story';
  
  return (
    <div 
      className={isStory ? 'post-template-story' : 'post-template'}
      style={{ 
        width: isStory ? '1080px' : '1080px',
        height: isStory ? '1920px' : '1080px',
        background: 'linear-gradient(135deg, #1a1520 0%, #0f0a14 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gold glow effect */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(186, 158, 114, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      {/* Corner accent */}
      <div 
        style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          background: 'linear-gradient(135deg, rgba(186, 158, 114, 0.1) 0%, transparent 100%)',
          borderRadius: '50%',
        }}
      />

      {/* Logo watermark */}
      <div 
        style={{
          position: 'absolute',
          bottom: isStory ? '60px' : '40px',
          right: isStory ? '60px' : '40px',
          opacity: 0.15,
        }}
      >
        <img 
          src={logoVDH} 
          alt=""
          style={{
            width: isStory ? '120px' : '100px',
            height: 'auto',
          }}
        />
      </div>

      {/* Slide indicator */}
      <div 
        style={{
          position: 'absolute',
          top: isStory ? '80px' : '50px',
          right: isStory ? '80px' : '60px',
          color: 'rgba(186, 158, 114, 0.6)',
          fontSize: isStory ? '20px' : '16px',
          fontWeight: '500',
        }}
      >
        {slideNumber}/{totalSlides}
      </div>

      {/* Main content - centered */}
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
        {/* Sparkle icon */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: isStory ? '40px' : '32px',
          }}
        >
          <div 
            style={{
              width: isStory ? '80px' : '64px',
              height: isStory ? '80px' : '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #BA9E72 0%, #D4C4A8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(186, 158, 114, 0.4)',
            }}
          >
            <Sparkles 
              style={{ 
                width: isStory ? '40px' : '32px', 
                height: isStory ? '40px' : '32px', 
                color: '#0a0a14' 
              }} 
            />
          </div>
        </div>

        {/* Headline */}
        <h2 
          style={{
            fontSize: isStory ? '64px' : '56px',
            fontWeight: '700',
            color: '#BA9E72',
            lineHeight: '1.2',
            marginBottom: isStory ? '32px' : '24px',
          }}
        >
          {slide.headline}
        </h2>

        {/* Body */}
        {slide.body && (
          <p 
            style={{
              fontSize: isStory ? '36px' : '30px',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: '1.5',
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            {slide.body}
          </p>
        )}
      </div>

      {/* Bottom progress dots */}
      <div 
        style={{
          position: 'absolute',
          bottom: isStory ? '80px' : '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
        }}
      >
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div 
            key={i}
            style={{
              width: i + 1 === slideNumber ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i + 1 === slideNumber ? '#BA9E72' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
};
