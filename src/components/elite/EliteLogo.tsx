import { Crown } from 'lucide-react';

interface EliteLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'minimal';
  className?: string;
}

const sizeConfig = {
  sm: { icon: 16, text: 18, subtitle: 8 },
  md: { icon: 24, text: 28, subtitle: 10 },
  lg: { icon: 32, text: 40, subtitle: 12 },
  xl: { icon: 48, text: 56, subtitle: 16 },
};

export const EliteLogo = ({ size = 'md', variant = 'full', className = '' }: EliteLogoProps) => {
  const config = sizeConfig[size];
  
  if (variant === 'icon') {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{
          width: config.icon * 2,
          height: config.icon * 2,
          background: 'linear-gradient(135deg, #d4af37 0%, #f4e5a3 50%, #d4af37 100%)',
          borderRadius: '50%',
          boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',
        }}
      >
        <Crown 
          style={{ 
            width: config.icon, 
            height: config.icon, 
            color: '#0a0a0f',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }} 
        />
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div 
          style={{
            width: config.icon * 1.5,
            height: config.icon * 1.5,
            background: 'linear-gradient(135deg, #d4af37 0%, #f4e5a3 50%, #d4af37 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',
          }}
        >
          <Crown 
            style={{ 
              width: config.icon * 0.7, 
              height: config.icon * 0.7, 
              color: '#0a0a0f' 
            }} 
          />
        </div>
        <span 
          className="font-display font-semibold tracking-wide"
          style={{ 
            fontSize: config.text * 0.7,
            background: 'linear-gradient(90deg, #f4e5a3 0%, #d4af37 50%, #b8973a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
          }}
        >
          ÉLITE
        </span>
      </div>
    );
  }

  // Full variant - Premium logo with icon and text
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Crown Icon with gradient background */}
      <div 
        style={{
          width: config.icon * 2,
          height: config.icon * 2,
          background: 'linear-gradient(135deg, #d4af37 0%, #f4e5a3 50%, #d4af37 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        <Crown 
          style={{ 
            width: config.icon, 
            height: config.icon, 
            color: '#0a0a0f',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
          }} 
        />
      </div>
      
      {/* Text */}
      <div className="flex flex-col">
        <span 
          className="font-display font-bold tracking-[0.15em] leading-none"
          style={{ 
            fontSize: config.text,
            background: 'linear-gradient(90deg, #f4e5a3 0%, #d4af37 40%, #b8973a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.12em',
          }}
        >
          ÉLITE
        </span>
        <span 
          className="tracking-[0.35em] uppercase font-medium"
          style={{ 
            fontSize: config.subtitle,
            color: 'rgba(212, 175, 55, 0.7)',
            marginTop: '2px',
          }}
        >
          IMÓVEIS
        </span>
      </div>
    </div>
  );
};

// Standalone watermark component for posts
export const EliteWatermark = ({ opacity = 0.06 }: { opacity?: number }) => {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      style={{ zIndex: 1 }}
    >
      <span 
        className="font-display font-bold"
        style={{ 
          fontSize: '500px', 
          color: `rgba(255, 255, 255, ${opacity})`,
          lineHeight: 1,
        }}
      >
        É
      </span>
    </div>
  );
};

// Bottom logo bar for gallery slides
export const EliteLogoBar = ({ showCta = false }: { showCta?: boolean }) => {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center"
      style={{ padding: '48px' }}
    >
      <div 
        className="flex items-center gap-4"
        style={{ 
          padding: '20px 48px',
          background: 'rgba(10, 10, 15, 0.9)',
          backdropFilter: 'blur(24px)',
          borderRadius: '100px',
          border: '2px solid rgba(212, 175, 55, 0.4)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        }}
      >
        {/* Crown */}
        <div 
          style={{
            width: 44,
            height: 44,
            background: 'linear-gradient(135deg, #d4af37 0%, #f4e5a3 50%, #d4af37 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(212, 175, 55, 0.4)',
          }}
        >
          <Crown style={{ width: 24, height: 24, color: '#0a0a0f' }} />
        </div>
        
        {/* Text */}
        <div className="flex flex-col">
          <span 
            className="font-display font-bold tracking-[0.12em] leading-none"
            style={{ 
              fontSize: 28,
              background: 'linear-gradient(90deg, #f4e5a3 0%, #d4af37 40%, #b8973a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ÉLITE
          </span>
          <span 
            className="tracking-[0.35em] uppercase font-medium"
            style={{ 
              fontSize: 10,
              color: 'rgba(212, 175, 55, 0.7)',
              marginTop: '2px',
            }}
          >
            IMÓVEIS
          </span>
        </div>

        {showCta && (
          <>
            <div style={{ width: 1, height: 36, background: 'rgba(212, 175, 55, 0.3)', margin: '0 8px' }} />
            <span 
              className="text-sm font-medium uppercase tracking-wider"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Alto Padrão
            </span>
          </>
        )}
      </div>
    </div>
  );
};
