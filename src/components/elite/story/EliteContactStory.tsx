import { PropertyData } from '@/types/property';
import { MessageCircle, Phone, Crown, ArrowRight } from 'lucide-react';
import logoPatrimoniar from '@/assets/logo-patrimoniar.svg';

interface EliteContactStoryProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const EliteContactStory = ({ data, photo }: EliteContactStoryProps) => {
  return (
    <div className="post-template-story relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Background photo with blur */}
      {photo ? (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ 
              backgroundImage: `url(${photo})`,
              filter: 'blur(12px)'
            }}
          />
          <div className="absolute inset-0 bg-black/85" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1f] to-[#0a0a0f]" />
      )}

      {/* Decorative circles */}
      <div 
        className="absolute"
        style={{ 
          top: '80px',
          right: '60px',
          width: '200px',
          height: '200px',
          border: '1px solid rgba(212,175,55,0.15)',
          borderRadius: '50%'
        }}
      />
      <div 
        className="absolute"
        style={{ 
          bottom: '200px',
          left: '-50px',
          width: '300px',
          height: '300px',
          border: '1px solid rgba(212,175,55,0.1)',
          borderRadius: '50%'
        }}
      />

      {/* Logo at top */}
      <div 
        className="absolute z-20"
        style={{ top: '60px', left: '50px' }}
      >
        <img 
          src={logoPatrimoniar} 
          alt="Patrimoniar Imóveis" 
          style={{ 
            width: '180px',
            height: 'auto',
            filter: 'brightness(0) invert(1)',
            opacity: 0.9,
          }}
        />
      </div>

      {/* Main content - Centered */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center z-10"
        style={{ padding: '100px 50px' }}
      >
        {/* Crown icon */}
        <div 
          className="flex items-center justify-center"
          style={{ 
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d4af37, #f5d485)',
            marginBottom: '60px',
            boxShadow: '0 30px 80px rgba(212,175,55,0.5)'
          }}
        >
          <Crown style={{ width: '64px', height: '64px', color: '#0a0a0f' }} />
        </div>

        {/* Headline */}
        <h2 
          className="font-display font-semibold text-center"
          style={{ 
            fontSize: '72px', 
            color: '#ffffff',
            lineHeight: '1.1',
            marginBottom: '30px'
          }}
        >
          Seu próximo<br/>
          <span style={{ color: '#d4af37' }}>endereço</span><br/>
          de prestígio
        </h2>

        <p 
          className="text-center"
          style={{ 
            fontSize: '28px', 
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '80px',
            maxWidth: '700px'
          }}
        >
          Agende uma visita exclusiva e descubra seu novo lar
        </p>

        {/* CTA Button */}
        <div 
          className="flex items-center gap-5"
          style={{ 
            padding: '36px 60px',
            background: 'linear-gradient(135deg, #d4af37, #f5d485)',
            borderRadius: '100px',
            marginBottom: '60px',
            boxShadow: '0 16px 50px rgba(212,175,55,0.5)'
          }}
        >
          <MessageCircle style={{ width: '40px', height: '40px', color: '#0a0a0f' }} />
          <span 
            className="font-semibold"
            style={{ fontSize: '32px', color: '#0a0a0f' }}
          >
            Fale com um consultor
          </span>
          <ArrowRight style={{ width: '32px', height: '32px', color: '#0a0a0f' }} />
        </div>

        {/* Phone number */}
        <div className="flex items-center gap-5">
          <Phone style={{ width: '36px', height: '36px', color: '#d4af37' }} />
          <span 
            className="font-display font-semibold"
            style={{ fontSize: '52px', color: '#ffffff' }}
          >
            {data.contactPhone || '(67) 99999-9999'}
          </span>
        </div>
      </div>

      {/* Bottom CRECI */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-20 flex justify-center"
        style={{ padding: '40px' }}
      >
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.4)' }}>
          {data.creci || 'CRECI-MS'}
        </p>
      </div>
    </div>
  );
};
