import { PropertyData } from '@/types/property';
import { MessageCircle, Phone, Crown, Send, ArrowRight } from 'lucide-react';
import logoElite from '@/assets/logo-elite.png';

interface EliteVDH4Props {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const EliteVDH4 = ({ data, photo }: EliteVDH4Props) => {
  return (
    <div className="post-template-story relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Background gradient */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)'
        }}
      />

      {/* Decorative elements */}
      <div 
        className="absolute"
        style={{ 
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          border: '1px solid rgba(212,175,55,0.1)',
          borderRadius: '50%'
        }}
      />
      <div 
        className="absolute"
        style={{ 
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          border: '1px solid rgba(212,175,55,0.08)',
          borderRadius: '50%'
        }}
      />

      {/* Logo at top */}
      <div 
        className="absolute z-20 flex justify-center"
        style={{ top: '60px', left: 0, right: 0 }}
      >
        <img 
          src={logoElite} 
          alt="Élite Imóveis" 
          style={{ height: '70px', objectFit: 'contain' }}
        />
      </div>

      {/* Main content */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center z-10"
        style={{ padding: '100px 50px' }}
      >
        {/* Crown icon */}
        <div 
          className="flex items-center justify-center"
          style={{ 
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d4af37, #f5d485)',
            marginBottom: '60px',
            boxShadow: '0 30px 100px rgba(212,175,55,0.5)'
          }}
        >
          <Crown style={{ width: '72px', height: '72px', color: '#0a0a0f' }} />
        </div>

        {/* Headline */}
        <h2 
          className="font-display font-bold text-center"
          style={{ fontSize: '68px', color: '#ffffff', lineHeight: '1.1', marginBottom: '24px' }}
        >
          Agende sua<br/>
          <span 
            style={{ 
              background: 'linear-gradient(135deg, #d4af37, #f5d485)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            visita exclusiva
          </span>
        </h2>

        <p 
          className="text-center"
          style={{ fontSize: '26px', color: 'rgba(255,255,255,0.7)', marginBottom: '70px' }}
        >
          Nossos consultores estão prontos<br/>para atendê-lo
        </p>

        {/* Phone number - Large */}
        <div 
          className="flex items-center gap-5"
          style={{ 
            padding: '36px 50px',
            background: 'linear-gradient(135deg, #d4af37, #f5d485)',
            borderRadius: '20px',
            marginBottom: '30px',
            boxShadow: '0 20px 60px rgba(212,175,55,0.4)'
          }}
        >
          <Phone style={{ width: '40px', height: '40px', color: '#0a0a0f' }} />
          <span 
            className="font-display font-bold"
            style={{ fontSize: '44px', color: '#0a0a0f' }}
          >
            {data.contactPhone || '(67) 99999-9999'}
          </span>
        </div>

        {/* Direct message CTA */}
        <div 
          className="flex items-center gap-4"
          style={{ 
            padding: '24px 40px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '100px'
          }}
        >
          <Send style={{ width: '28px', height: '28px', color: '#d4af37' }} />
          <span style={{ fontSize: '24px', color: '#ffffff', fontWeight: '500' }}>
            Chame no Direct
          </span>
          <ArrowRight style={{ width: '24px', height: '24px', color: '#d4af37' }} />
        </div>
      </div>

      {/* Bottom CRECI */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-20 text-center"
        style={{ padding: '40px' }}
      >
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)' }}>
          {data.creci || 'CRECI-MS'}
        </p>
      </div>
    </div>
  );
};
