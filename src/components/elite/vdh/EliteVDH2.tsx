import { PropertyData } from '@/types/property';
import { Banknote, CreditCard, Landmark, CheckCircle2 } from 'lucide-react';
import logoElite from '@/assets/logo-elite.png';

interface EliteVDH2Props {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const EliteVDH2 = ({ data, photo }: EliteVDH2Props) => {
  const benefits = [];
  
  if (data.acceptsFinancing) {
    benefits.push({ icon: CreditCard, text: 'Aceita Financiamento Bancário', active: true });
  }
  if (data.acceptsFGTS) {
    benefits.push({ icon: Landmark, text: 'Pode usar FGTS', active: true });
  }
  benefits.push({ icon: Banknote, text: 'Recursos Próprios', active: true });

  return (
    <div className="post-template-story relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Photo top section */}
      {photo ? (
        <div 
          className="absolute bg-cover bg-center"
          style={{ 
            top: 0,
            left: 0,
            right: 0,
            height: '40%',
            backgroundImage: `url(${photo})`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0a0a0f]" />
        </div>
      ) : (
        <div 
          className="absolute"
          style={{ 
            top: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(135deg, #1a1a1f, #0f0f14)'
          }}
        />
      )}

      {/* Logo at top */}
      <div 
        className="absolute z-20"
        style={{ top: '60px', left: '50px' }}
      >
        <img 
          src={logoElite} 
          alt="Élite Imóveis" 
          style={{ height: '60px', objectFit: 'contain' }}
        />
      </div>

      {/* Main content */}
      <div 
        className="absolute left-0 right-0"
        style={{ 
          top: '35%',
          bottom: 0,
          padding: '60px 50px 80px'
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '50px' }}>
          <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
            <div 
              style={{ 
                width: '40px',
                height: '2px',
                background: 'linear-gradient(90deg, #d4af37, transparent)'
              }}
            />
            <span 
              className="uppercase tracking-[0.2em]"
              style={{ fontSize: '16px', color: '#d4af37' }}
            >
              Formas de Pagamento
            </span>
          </div>
          <h2 
            className="font-display font-semibold"
            style={{ fontSize: '52px', color: '#ffffff', lineHeight: '1.1' }}
          >
            Condições<br/>Facilitadas
          </h2>
        </div>

        {/* Benefits list */}
        <div className="flex flex-col" style={{ gap: '24px', marginBottom: '60px' }}>
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex items-center gap-5"
              style={{ 
                padding: '32px 36px',
                background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.02))',
                border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: '20px'
              }}
            >
              <div 
                className="flex items-center justify-center flex-shrink-0"
                style={{ 
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #d4af37, #f5d485)',
                  boxShadow: '0 8px 30px rgba(212,175,55,0.3)'
                }}
              >
                <benefit.icon style={{ width: '32px', height: '32px', color: '#0a0a0f' }} />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: '28px', color: '#ffffff', fontWeight: '500' }}>
                  {benefit.text}
                </p>
              </div>
              <CheckCircle2 style={{ width: '32px', height: '32px', color: '#22c55e' }} />
            </div>
          ))}
        </div>

        {/* Property type reminder */}
        <div 
          className="text-center"
          style={{ 
            padding: '24px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '16px'
          }}
        >
          <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)' }}>
            {data.type || 'Imóvel'} • {data.neighborhood}, {data.city}
          </span>
        </div>
      </div>
    </div>
  );
};
