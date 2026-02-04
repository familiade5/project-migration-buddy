import { EducationalSlide } from '@/types/educational';
import logoVDH from '@/assets/logo-vdh.jpg';
import { MessageCircle, ArrowRight } from 'lucide-react';

interface EducationalCTASlideProps {
  slide: EducationalSlide;
  slideNumber: number;
  totalSlides: number;
  format: 'feed' | 'story';
  contactName: string;
  contactPhone: string;
  creci: string;
}

export const EducationalCTASlide = ({ 
  slide, 
  slideNumber, 
  totalSlides, 
  format,
  contactName,
  contactPhone,
  creci,
}: EducationalCTASlideProps) => {
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
      {/* Gold gradient accent */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(180deg, transparent, rgba(186, 158, 114, 0.08))',
        }}
      />

      {/* Top line accent */}
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

      {/* Logo */}
      <div 
        style={{
          position: 'absolute',
          top: isStory ? '80px' : '60px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <img 
          src={logoVDH} 
          alt="Venda Direta Hoje"
          style={{
            width: isStory ? '220px' : '180px',
            height: 'auto',
            opacity: 0.9,
          }}
        />
      </div>

      {/* Main CTA content */}
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
            fontSize: isStory ? '64px' : '56px',
            fontWeight: '700',
            color: '#ffffff',
            lineHeight: '1.2',
            marginBottom: isStory ? '24px' : '20px',
          }}
        >
          {slide.headline}
        </h2>

        {/* Body */}
        {slide.body && (
          <p 
            style={{
              fontSize: isStory ? '32px' : '26px',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: '1.4',
              marginBottom: isStory ? '48px' : '40px',
            }}
          >
            {slide.body}
          </p>
        )}

        {/* CTA Button style */}
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            padding: isStory ? '24px 48px' : '20px 40px',
            background: 'linear-gradient(135deg, #BA9E72 0%, #D4C4A8 100%)',
            borderRadius: '60px',
            boxShadow: '0 8px 32px rgba(186, 158, 114, 0.4)',
          }}
        >
          <MessageCircle 
            style={{ 
              width: isStory ? '32px' : '28px', 
              height: isStory ? '32px' : '28px', 
              color: '#0a0a14' 
            }} 
          />
          <span 
            style={{
              fontSize: isStory ? '28px' : '24px',
              fontWeight: '600',
              color: '#0a0a14',
            }}
          >
            Fale conosco
          </span>
          <ArrowRight 
            style={{ 
              width: isStory ? '28px' : '24px', 
              height: isStory ? '28px' : '24px', 
              color: '#0a0a14' 
            }} 
          />
        </div>
      </div>

      {/* Contact info footer */}
      <div 
        style={{
          position: 'absolute',
          bottom: isStory ? '80px' : '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
        }}
      >
        {contactName && (
          <p 
            style={{
              fontSize: isStory ? '26px' : '22px',
              color: 'rgba(255,255,255,0.9)',
              fontWeight: '500',
              marginBottom: '8px',
            }}
          >
            {contactName}
          </p>
        )}
        {contactPhone && (
          <p 
            style={{
              fontSize: isStory ? '32px' : '28px',
              color: '#BA9E72',
              fontWeight: '600',
              marginBottom: '8px',
            }}
          >
            {contactPhone}
          </p>
        )}
        {creci && (
          <p 
            style={{
              fontSize: isStory ? '18px' : '16px',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            {creci}
          </p>
        )}
      </div>
    </div>
  );
};
