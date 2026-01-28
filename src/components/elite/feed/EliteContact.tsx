import { PropertyData } from '@/types/property';
import { MessageCircle, Phone, Crown, ArrowRight } from 'lucide-react';
import logoPatrimoniar from '@/assets/logo-patrimoniar.svg';

interface EliteContactProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const EliteContact = ({ data, photo }: EliteContactProps) => {
  return (
    <div className="post-template relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Background photo with heavy overlay */}
      {photo ? (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ 
              backgroundImage: `url(${photo})`,
              filter: 'blur(8px)'
            }}
          />
          <div className="absolute inset-0 bg-black/80" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1f] to-[#0a0a0f]" />
      )}

      {/* Decorative elements */}
      <div 
        className="absolute"
        style={{ 
          top: '40px',
          left: '40px',
          width: '120px',
          height: '120px',
          border: '1px solid rgba(212,175,55,0.2)',
          borderRadius: '50%'
        }}
      />
      <div 
        className="absolute"
        style={{ 
          bottom: '40px',
          right: '40px',
          width: '200px',
          height: '200px',
          border: '1px solid rgba(212,175,55,0.1)',
          borderRadius: '50%'
        }}
      />

      {/* Main content - Centered */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center z-10"
        style={{ padding: '80px' }}
      >
        {/* Crown icon */}
        <div 
          className="flex items-center justify-center"
          style={{ 
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d4af37, #f5d485)',
            marginBottom: '50px',
            boxShadow: '0 20px 60px rgba(212,175,55,0.4)'
          }}
        >
          <Crown style={{ width: '48px', height: '48px', color: '#0a0a0f' }} />
        </div>

        {/* Headline */}
        <h2 
          className="font-display font-semibold text-center"
          style={{ 
            fontSize: '64px', 
            color: '#ffffff',
            lineHeight: '1.1',
            marginBottom: '20px'
          }}
        >
          Seu próximo<br/>
          <span style={{ color: '#d4af37' }}>endereço</span> de prestígio
        </h2>

        <p 
          className="text-center"
          style={{ 
            fontSize: '24px', 
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '60px',
            maxWidth: '600px'
          }}
        >
          Agende uma visita exclusiva e descubra seu novo lar
        </p>

        {/* CTA Button */}
        <div 
          className="flex items-center gap-4"
          style={{ 
            padding: '28px 48px',
            background: 'linear-gradient(135deg, #d4af37, #f5d485)',
            borderRadius: '100px',
            marginBottom: '50px',
            boxShadow: '0 12px 40px rgba(212,175,55,0.4)'
          }}
        >
          <MessageCircle style={{ width: '32px', height: '32px', color: '#0a0a0f' }} />
          <span 
            className="font-semibold"
            style={{ fontSize: '28px', color: '#0a0a0f' }}
          >
            Fale com um consultor
          </span>
          <ArrowRight style={{ width: '28px', height: '28px', color: '#0a0a0f' }} />
        </div>

        {/* Phone number */}
        <div className="flex items-center gap-4">
          <Phone style={{ width: '28px', height: '28px', color: '#d4af37' }} />
          <span 
            className="font-display font-semibold"
            style={{ fontSize: '40px', color: '#ffffff' }}
          >
            {data.contactPhone || '(67) 99999-9999'}
          </span>
        </div>
      </div>

      {/* Bottom logo bar */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between"
        style={{ 
          padding: '30px 50px',
          background: 'linear-gradient(to top, rgba(10,10,15,0.98), transparent)'
        }}
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
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
          {data.creci || 'CRECI-MS'}
        </p>
      </div>
    </div>
  );
};
