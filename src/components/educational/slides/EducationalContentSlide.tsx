import { EducationalSlide, EducationalCategory } from '@/types/educational';
import { Check } from 'lucide-react';
import { getBackgroundByIndex } from '../backgrounds';

interface EducationalContentSlideProps {
  slide: EducationalSlide;
  slideNumber: number;
  totalSlides: number;
  format: 'feed' | 'story';
  category: EducationalCategory;
  slideIndex: number;
  customImage?: string;
}

export const EducationalContentSlide = ({ 
  slide, 
  slideNumber, 
  totalSlides, 
  format,
  category,
  slideIndex,
  customImage,
}: EducationalContentSlideProps) => {
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
          background: 'linear-gradient(135deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.25) 100%)',
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
            fontSize: isStory ? '72px' : '64px',
            fontWeight: '700',
            color: '#ffffff',
            lineHeight: '1.2',
            marginBottom: isStory ? '48px' : '40px',
            textShadow: '0 4px 30px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.6)',
          }}
        >
          {slide.headline}
        </h2>

        {/* Body text or bullets */}
        {slide.bullets ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: isStory ? '36px' : '28px' }}>
            {slide.bullets.map((bullet, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '24px',
                }}
              >
                <div 
                  style={{
                    width: isStory ? '44px' : '40px',
                    height: isStory ? '44px' : '40px',
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
                      width: isStory ? '24px' : '22px', 
                      height: isStory ? '24px' : '22px', 
                      color: '#0a0a14',
                      strokeWidth: 3,
                    }} 
                  />
                </div>
                <p 
                  style={{
                    fontSize: isStory ? '42px' : '38px',
                    color: '#ffffff',
                    lineHeight: '1.4',
                    textShadow: '0 4px 20px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)',
                    fontWeight: '500',
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
              fontSize: isStory ? '46px' : '42px',
              color: '#ffffff',
              lineHeight: '1.6',
              textShadow: '0 4px 20px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)',
              fontWeight: '500',
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
            fontSize: isStory ? '52px' : '44px',
            fontWeight: '700',
            color: '#ffffff',
            letterSpacing: '6px',
            textShadow: '0 4px 20px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          VDH
        </span>
      </div>
    </div>
  );
};
