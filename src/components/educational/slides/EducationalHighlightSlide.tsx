import { EducationalSlide, EducationalCategory } from '@/types/educational';
import { Sparkles } from 'lucide-react';
import { getBackground } from '../backgrounds';

interface EducationalHighlightSlideProps {
  slide: EducationalSlide;
  slideNumber: number;
  totalSlides: number;
  format: 'feed' | 'story';
  category: EducationalCategory;
}

export const EducationalHighlightSlide = ({ 
  slide, 
  slideNumber, 
  totalSlides, 
  format,
  category,
}: EducationalHighlightSlideProps) => {
  const isStory = format === 'story';
  const bgImage = getBackground(category, 'highlight');
  
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

      {/* Lighter overlay with warm tint */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(15,10,20,0.3) 0%, rgba(25,15,10,0.25) 50%, rgba(15,10,20,0.4) 100%)',
        }}
      />

      {/* Radial gold glow effect */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 60%)',
          borderRadius: '50%',
        }}
      />

      {/* Corner decorative elements */}
      <div 
        style={{
          position: 'absolute',
          top: isStory ? '60px' : '40px',
          left: isStory ? '60px' : '40px',
          width: '80px',
          height: '80px',
          borderTop: '2px solid rgba(212, 175, 55, 0.5)',
          borderLeft: '2px solid rgba(212, 175, 55, 0.5)',
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: isStory ? '60px' : '40px',
          right: isStory ? '60px' : '40px',
          width: '80px',
          height: '80px',
          borderBottom: '2px solid rgba(212, 175, 55, 0.5)',
          borderRight: '2px solid rgba(212, 175, 55, 0.5)',
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
        {/* Sparkle icon with premium styling */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: isStory ? '48px' : '40px',
          }}
        >
          <div 
            style={{
              width: isStory ? '90px' : '76px',
              height: isStory ? '90px' : '76px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 50%, #D4AF37 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 40px rgba(212, 175, 55, 0.5), inset 0 -2px 10px rgba(0,0,0,0.2)',
            }}
          >
            <Sparkles 
              style={{ 
                width: isStory ? '44px' : '38px', 
                height: isStory ? '44px' : '38px', 
                color: '#1a1a2e' 
              }} 
            />
          </div>
        </div>

        {/* Headline in gold */}
        <h2 
          style={{
            fontSize: isStory ? '68px' : '60px',
            fontWeight: '700',
            color: '#D4AF37',
            lineHeight: '1.15',
            marginBottom: isStory ? '36px' : '28px',
            textShadow: '0 4px 30px rgba(212, 175, 55, 0.3)',
          }}
        >
          {slide.headline}
        </h2>

        {/* Body */}
        {slide.body && (
          <p 
            style={{
              fontSize: isStory ? '38px' : '32px',
              color: 'rgba(255,255,255,0.95)',
              lineHeight: '1.5',
              maxWidth: '850px',
              margin: '0 auto',
              textShadow: '0 2px 10px rgba(0,0,0,0.4)',
            }}
          >
            {slide.body}
          </p>
        )}
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
            opacity: 0.8,
            textShadow: '0 2px 10px rgba(0,0,0,0.4)',
          }}
        >
          VDH
        </span>
      </div>
    </div>
  );
};
