import { PropertyData } from '@/types/property';
import { TrendingUp, Shield, Sparkles } from 'lucide-react';
import { EliteLogoFooter } from '../EliteLogo';

interface EliteFeaturesStoryProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const EliteFeaturesStory = ({ data, photo }: EliteFeaturesStoryProps) => {
  const features = [
    { icon: TrendingUp, text: 'Valorização garantida na região' },
    { icon: Shield, text: 'Documentação 100% regularizada' },
    { icon: Sparkles, text: 'Acabamentos de alto padrão' },
  ];

  return (
    <div className="post-template-story relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Top photo section - clean, no heavy overlays */}
      {photo ? (
        <div 
          className="absolute"
          style={{ 
            top: 0,
            left: 0,
            right: 0,
            height: '45%',
            backgroundImage: `url(${photo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Minimal fade to content area */}
          <div 
            className="absolute inset-x-0 bottom-0"
            style={{ 
              height: '40%',
              background: 'linear-gradient(to top, #0a0a0f 0%, transparent 100%)'
            }}
          />
        </div>
      ) : (
        <div 
          className="absolute"
          style={{ 
            top: 0,
            left: 0,
            right: 0,
            height: '45%',
            background: 'linear-gradient(135deg, #1a1a1f, #0f0f14)'
          }}
        />
      )}

      {/* Logo at top - centered, 90px */}
      <div 
        className="absolute z-20"
        style={{ top: '50px', left: '50px', right: '50px' }}
      >
        <EliteLogoFooter />
      </div>

      {/* Main content */}
      <div 
        className="absolute left-0 right-0"
        style={{ 
          top: '40%',
          bottom: 0,
          padding: '60px 50px 80px'
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
              style={{ fontSize: '16px', color: '#d4af37' }}
            >
              Diferenciais
            </span>
          </div>
          <h2 
            className="font-display font-semibold"
            style={{ fontSize: '52px', color: '#ffffff', lineHeight: '1.1' }}
          >
            Por que escolher<br/>este imóvel?
          </h2>
        </div>

        {/* Feature list */}
        <div className="flex flex-col" style={{ gap: '32px', marginBottom: '50px' }}>
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-center gap-6"
            >
              <div 
                className="flex items-center justify-center flex-shrink-0"
                style={{ 
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #d4af37, #f5d485)',
                  boxShadow: '0 12px 40px rgba(212,175,55,0.4)'
                }}
              >
                <feature.icon style={{ width: '36px', height: '36px', color: '#0a0a0f' }} />
              </div>
              <p 
                style={{ 
                  fontSize: '32px', 
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

        {/* Badges */}
        <div className="flex flex-wrap gap-4">
          {data.acceptsFinancing && (
            <div 
              style={{ 
                padding: '16px 32px',
                borderRadius: '100px',
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.3)'
              }}
            >
              <span style={{ fontSize: '20px', color: '#22c55e', fontWeight: '500' }}>
                Aceita Financiamento
              </span>
            </div>
          )}
          {data.acceptsFGTS && (
            <div 
              style={{ 
                padding: '16px 32px',
                borderRadius: '100px',
                background: 'rgba(212,175,55,0.1)',
                border: '1px solid rgba(212,175,55,0.3)'
              }}
            >
              <span style={{ fontSize: '20px', color: '#d4af37', fontWeight: '500' }}>
                Aceita FGTS
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
