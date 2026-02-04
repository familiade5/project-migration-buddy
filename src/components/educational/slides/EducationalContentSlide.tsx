import { EducationalSlide } from '@/types/educational';
import logoPatrimoniar from '@/assets/logo-patrimoniar.svg';
import { Check } from 'lucide-react';

interface EducationalContentSlideProps {
  slide: EducationalSlide;
  slideNumber: number;
  totalSlides: number;
  format: 'feed' | 'story';
}

export const EducationalContentSlide = ({ 
  slide, 
  slideNumber, 
  totalSlides, 
  format 
}: EducationalContentSlideProps) => {
  const isStory = format === 'story';
  
  return (
    <div 
      className={isStory ? 'post-template-story' : 'post-template'}
      style={{ 
        width: isStory ? '1080px' : '1080px',
        height: isStory ? '1920px' : '1080px',
        background: 'linear-gradient(180deg, #0f0f1a 0%, #0a0a14 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle side accent */}
      <div 
        style={{
          position: 'absolute',
          left: 0,
          top: '20%',
          bottom: '20%',
          width: '4px',
          background: 'linear-gradient(180deg, transparent, #BA9E72, transparent)',
        }}
      />

      {/* Logo watermark - subtle in corner */}
      <div 
        style={{
          position: 'absolute',
          bottom: isStory ? '60px' : '40px',
          right: isStory ? '60px' : '40px',
          opacity: 0.15,
        }}
      >
        <img 
          src={logoPatrimoniar} 
          alt=""
          style={{
            width: isStory ? '120px' : '100px',
            height: 'auto',
            filter: 'brightness(0) invert(1)',
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

      {/* Main content area */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: isStory ? '80px' : '80px',
          right: isStory ? '80px' : '80px',
          transform: 'translateY(-50%)',
        }}
      >
        {/* Headline */}
        <h2 
          style={{
            fontSize: isStory ? '56px' : '48px',
            fontWeight: '700',
            color: '#ffffff',
            lineHeight: '1.2',
            marginBottom: isStory ? '40px' : '32px',
          }}
        >
          {slide.headline}
        </h2>

        {/* Body text or bullets */}
        {slide.bullets ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: isStory ? '28px' : '20px' }}>
            {slide.bullets.map((bullet, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                }}
              >
                <div 
                  style={{
                    width: isStory ? '32px' : '28px',
                    height: isStory ? '32px' : '28px',
                    borderRadius: '50%',
                    background: 'rgba(186, 158, 114, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '4px',
                  }}
                >
                  <Check 
                    style={{ 
                      width: isStory ? '18px' : '16px', 
                      height: isStory ? '18px' : '16px', 
                      color: '#BA9E72' 
                    }} 
                  />
                </div>
                <p 
                  style={{
                    fontSize: isStory ? '32px' : '28px',
                    color: 'rgba(255,255,255,0.85)',
                    lineHeight: '1.4',
                  }}
                >
                  {bullet}
                </p>
              </div>
            ))}
          </div>
        ) : slide.body ? (
          <p 
            style={{
              fontSize: isStory ? '36px' : '32px',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: '1.5',
            }}
          >
            {slide.body}
          </p>
        ) : null}
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
