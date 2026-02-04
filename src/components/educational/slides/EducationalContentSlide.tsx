import { EducationalSlide } from '@/types/educational';
import { Check } from 'lucide-react';
import bgContent from '@/assets/educational/bg-content.jpg';

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
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background image */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${bgContent})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Dark overlay */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(10,10,20,0.92) 0%, rgba(20,20,35,0.88) 100%)',
        }}
      />

      {/* Left gold accent bar */}
      <div 
        style={{
          position: 'absolute',
          left: 0,
          top: '15%',
          bottom: '15%',
          width: '5px',
          background: 'linear-gradient(180deg, transparent, #D4AF37 20%, #D4AF37 80%, transparent)',
          boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
        }}
      />

      {/* Slide indicator */}
      <div 
        style={{
          position: 'absolute',
          top: isStory ? '80px' : '50px',
          right: isStory ? '80px' : '60px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div 
          style={{
            width: '40px',
            height: '2px',
            background: 'rgba(212, 175, 55, 0.3)',
          }}
        />
        <span 
          style={{
            color: '#D4AF37',
            fontSize: isStory ? '22px' : '18px',
            fontWeight: '600',
            letterSpacing: '2px',
          }}
        >
          {slideNumber}/{totalSlides}
        </span>
      </div>

      {/* Main content area */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: isStory ? '100px' : '100px',
          right: isStory ? '100px' : '100px',
          transform: 'translateY(-50%)',
        }}
      >
        {/* Headline */}
        <h2 
          style={{
            fontSize: isStory ? '60px' : '52px',
            fontWeight: '700',
            color: '#ffffff',
            lineHeight: '1.2',
            marginBottom: isStory ? '48px' : '40px',
            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
          }}
        >
          {slide.headline}
        </h2>

        {/* Body text or bullets */}
        {slide.bullets ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: isStory ? '32px' : '24px' }}>
            {slide.bullets.map((bullet, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                }}
              >
                <div 
                  style={{
                    width: isStory ? '36px' : '32px',
                    height: isStory ? '36px' : '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #B8960C 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '4px',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                  }}
                >
                  <Check 
                    style={{ 
                      width: isStory ? '20px' : '18px', 
                      height: isStory ? '20px' : '18px', 
                      color: '#0a0a14',
                      strokeWidth: 3,
                    }} 
                  />
                </div>
                <p 
                  style={{
                    fontSize: isStory ? '34px' : '30px',
                    color: 'rgba(255,255,255,0.9)',
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
              fontSize: isStory ? '38px' : '34px',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: '1.6',
            }}
          >
            {slide.body}
          </p>
        ) : null}
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
            fontSize: isStory ? '40px' : '32px',
            fontWeight: '700',
            color: '#ffffff',
            letterSpacing: '6px',
            opacity: 0.7,
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}
        >
          VDH
        </span>
      </div>
    </div>
  );
};
