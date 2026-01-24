import { PropertyData } from '@/types/property';
import { Check, Sparkles, Shield, TrendingUp } from 'lucide-react';
import logoElite from '@/assets/logo-elite.png';

interface EliteFeaturesProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const EliteFeatures = ({ data, photo }: EliteFeaturesProps) => {
  // Fixed premium triggers
  const features = [
    { icon: TrendingUp, text: 'Valorização garantida na região' },
    { icon: Shield, text: 'Documentação 100% regularizada' },
    { icon: Sparkles, text: 'Acabamentos de alto padrão' },
  ];

  return (
    <div className="post-template relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Split layout - Content left, Photo right */}
      <div className="absolute inset-0 flex">
        {/* Left - Features */}
        <div 
          className="flex flex-col justify-center"
          style={{ 
            width: '50%',
            padding: '60px 40px 60px 60px'
          }}
        >
          {/* Section header */}
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
                style={{ fontSize: '14px', color: '#d4af37' }}
              >
                Diferenciais
              </span>
            </div>
            <h2 
              className="font-display font-semibold"
              style={{ fontSize: '44px', color: '#ffffff', lineHeight: '1.1' }}
            >
              Por que este<br/>imóvel?
            </h2>
          </div>

          {/* Feature list */}
          <div className="flex flex-col" style={{ gap: '28px', marginBottom: '50px' }}>
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-5"
              >
                <div 
                  className="flex items-center justify-center flex-shrink-0"
                  style={{ 
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #d4af37, #f5d485)',
                    boxShadow: '0 8px 30px rgba(212,175,55,0.3)'
                  }}
                >
                  <feature.icon style={{ width: '28px', height: '28px', color: '#0a0a0f' }} />
                </div>
                <p 
                  style={{ 
                    fontSize: '28px', 
                    color: '#ffffff',
                    fontWeight: '500',
                    lineHeight: '1.3'
                  }}
                >
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          {/* Additional badges if applicable */}
          <div className="flex flex-wrap gap-3">
            {data.acceptsFinancing && (
              <div 
                style={{ 
                  padding: '12px 24px',
                  borderRadius: '100px',
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.3)'
                }}
              >
                <span style={{ fontSize: '16px', color: '#22c55e', fontWeight: '500' }}>
                  Aceita Financiamento
                </span>
              </div>
            )}
            {data.acceptsFGTS && (
              <div 
                style={{ 
                  padding: '12px 24px',
                  borderRadius: '100px',
                  background: 'rgba(212,175,55,0.1)',
                  border: '1px solid rgba(212,175,55,0.3)'
                }}
              >
                <span style={{ fontSize: '16px', color: '#d4af37', fontWeight: '500' }}>
                  Aceita FGTS
                </span>
              </div>
            )}
          </div>

          {/* Logo at bottom */}
          <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
            <img 
              src={logoElite} 
              alt="Élite Imóveis" 
              style={{ height: '50px', objectFit: 'contain', opacity: 0.7 }}
            />
          </div>
        </div>

        {/* Right - Full bleed photo */}
        <div className="relative" style={{ width: '50%', height: '100%' }}>
          {photo ? (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${photo})`,
                clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)'
              }}
            />
          ) : (
            <div 
              className="absolute inset-0"
              style={{ 
                background: 'linear-gradient(135deg, #1a1a1f, #0f0f14)',
                clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)'
              }}
            />
          )}
          {/* Overlay for depth */}
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(270deg, transparent 70%, #0a0a0f 100%)',
              clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)'
            }}
          />
        </div>
      </div>
    </div>
  );
};
