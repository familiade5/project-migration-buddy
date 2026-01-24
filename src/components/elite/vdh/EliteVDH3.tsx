import { PropertyData } from '@/types/property';
import { TrendingDown } from 'lucide-react';
import logoElite from '@/assets/logo-elite.png';

interface EliteVDH3Props {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const EliteVDH3 = ({ data, photo }: EliteVDH3Props) => {
  return (
    <div className="post-template-story relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Subtle background pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 50% 50%, #d4af37 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Decorative gold lines */}
      <div 
        className="absolute"
        style={{ 
          top: '200px',
          left: '-100px',
          width: '300px',
          height: '300px',
          border: '1px solid rgba(212,175,55,0.1)',
          borderRadius: '50%'
        }}
      />
      <div 
        className="absolute"
        style={{ 
          bottom: '300px',
          right: '-100px',
          width: '400px',
          height: '400px',
          border: '1px solid rgba(212,175,55,0.08)',
          borderRadius: '50%'
        }}
      />

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

      {/* Main content - Centered */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center z-10"
        style={{ padding: '80px 50px' }}
      >
        {/* Section header */}
        <div className="flex items-center gap-3" style={{ marginBottom: '40px' }}>
          <div 
            style={{ 
              width: '40px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #d4af37)'
            }}
          />
          <span 
            className="uppercase tracking-[0.2em]"
            style={{ fontSize: '18px', color: '#d4af37' }}
          >
            Investimento
          </span>
          <div 
            style={{ 
              width: '40px',
              height: '2px',
              background: 'linear-gradient(90deg, #d4af37, transparent)'
            }}
          />
        </div>

        {/* Original price (if discount available) */}
        {data.evaluationValue && data.evaluationValue !== data.minimumValue && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.5)' }}>Avaliado em</p>
            <p 
              className="font-display"
              style={{ 
                fontSize: '40px', 
                color: 'rgba(255,255,255,0.4)',
                textDecoration: 'line-through'
              }}
            >
              {data.evaluationValue}
            </p>
          </div>
        )}

        {/* Main price */}
        <div className="text-center" style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '24px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>
            Por apenas
          </p>
          <p 
            className="font-display font-bold"
            style={{ 
              fontSize: '90px', 
              background: 'linear-gradient(135deg, #d4af37, #f5d485)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: '1'
            }}
          >
            {data.minimumValue || 'Consulte'}
          </p>
        </div>

        {/* Discount badge */}
        {data.discount && Number(data.discount) > 0 && (
          <div 
            className="flex items-center gap-4"
            style={{ 
              padding: '24px 40px',
              background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))',
              border: '2px solid #22c55e',
              borderRadius: '100px',
              marginBottom: '50px'
            }}
          >
            <TrendingDown style={{ width: '32px', height: '32px', color: '#22c55e' }} />
            <span style={{ fontSize: '28px', color: '#22c55e', fontWeight: '600' }}>
              {data.discount}% abaixo do mercado
            </span>
          </div>
        )}

        {/* Entry value if available */}
        {data.hasEasyEntry && data.entryValue && (
          <div 
            className="text-center"
            style={{ 
              padding: '32px 50px',
              background: 'rgba(212,175,55,0.1)',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: '20px'
            }}
          >
            <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
              Entrada a partir de
            </p>
            <p 
              className="font-display font-semibold"
              style={{ fontSize: '48px', color: '#d4af37' }}
            >
              {data.entryValue}
            </p>
          </div>
        )}
      </div>

      {/* Bottom property info */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-20 text-center"
        style={{ padding: '40px 50px' }}
      >
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)' }}>
          {data.propertyName || data.type} • {data.neighborhood}, {data.city}
        </p>
      </div>
    </div>
  );
};
