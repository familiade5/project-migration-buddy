import { EducationalSlide, EducationalCategory } from '@/types/educational';
import { Phone, User, FileText, MessageCircle } from 'lucide-react';
import { getBackgroundByIndex } from '../backgrounds';

interface EducationalCTASlideProps {
  slide: EducationalSlide;
  slideNumber: number;
  totalSlides: number;
  format: 'feed' | 'story';
  contactName: string;
  contactPhone: string;
  creci: string;
  category: EducationalCategory;
  slideIndex: number;
}

export const EducationalCTASlide = ({ 
  slide, 
  slideNumber, 
  totalSlides, 
  format,
  contactName,
  contactPhone,
  creci,
  category,
  slideIndex,
}: EducationalCTASlideProps) => {
  const isStory = format === 'story';
  const bgImage = getBackgroundByIndex(category, slideIndex);
  
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
          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Top gold accent */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '4px',
          background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
        }}
      />

      {/* VDH Text - top center */}
      <div 
        style={{
          position: 'absolute',
          top: isStory ? '80px' : '50px',
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
            letterSpacing: '8px',
            textShadow: '0 2px 20px rgba(0,0,0,0.6)',
          }}
        >
          VDH
        </span>
      </div>

      {/* Slide indicator */}
      <div 
        style={{
          position: 'absolute',
          top: isStory ? '80px' : '50px',
          right: isStory ? '80px' : '60px',
          color: '#D4AF37',
          fontSize: isStory ? '22px' : '18px',
          fontWeight: '600',
          letterSpacing: '2px',
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
        {/* Headline */}
        <h2 
          style={{
            fontSize: isStory ? '76px' : '68px',
            fontWeight: '700',
            color: '#ffffff',
            lineHeight: '1.2',
            marginBottom: isStory ? '24px' : '20px',
            textShadow: '0 6px 40px rgba(0,0,0,0.9), 0 3px 15px rgba(0,0,0,0.7)',
          }}
        >
          {slide.headline}
        </h2>

        {/* Subtext */}
        {slide.body && (
          <p 
            style={{
              fontSize: isStory ? '40px' : '36px',
              color: '#ffffff',
              marginBottom: isStory ? '60px' : '48px',
              textShadow: '0 4px 20px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)',
              fontWeight: '500',
            }}
          >
            {slide.body}
          </p>
        )}

        {/* Contact card - glassmorphism */}
        <div 
          style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: isStory ? '48px 60px' : '40px 50px',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            display: 'inline-block',
          }}
        >
          {/* Contact header */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: isStory ? '36px' : '28px',
              color: '#D4AF37',
              fontSize: isStory ? '26px' : '22px',
              fontWeight: '600',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            <MessageCircle style={{ width: isStory ? '28px' : '24px', height: isStory ? '28px' : '24px' }} />
            Fale Conosco
          </div>

          {/* Contact details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: isStory ? '24px' : '20px' }}>
            {/* Name */}
            {contactName && (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                }}
              >
                <User 
                  style={{ 
                    width: isStory ? '32px' : '28px', 
                    height: isStory ? '32px' : '28px', 
                    color: '#D4AF37' 
                  }} 
                />
                <span 
                  style={{
                    fontSize: isStory ? '42px' : '38px',
                    fontWeight: '600',
                    color: '#ffffff',
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  }}
                >
                  {contactName}
                </span>
              </div>
            )}

            {/* CRECI */}
            {creci && (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                }}
              >
                <FileText 
                  style={{ 
                    width: isStory ? '32px' : '28px', 
                    height: isStory ? '32px' : '28px', 
                    color: '#D4AF37' 
                  }} 
                />
                <span 
                  style={{
                    fontSize: isStory ? '36px' : '32px',
                    color: '#ffffff',
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  }}
                >
                  {creci}
                </span>
              </div>
            )}

            {/* Phone */}
            {contactPhone && (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                }}
              >
                <Phone 
                  style={{ 
                    width: isStory ? '32px' : '28px', 
                    height: isStory ? '32px' : '28px', 
                    color: '#D4AF37' 
                  }} 
                />
                <span 
                  style={{
                    fontSize: isStory ? '42px' : '38px',
                    fontWeight: '600',
                    color: '#ffffff',
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  }}
                >
                  {contactPhone}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '4px',
          background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
        }}
      />
    </div>
  );
};
