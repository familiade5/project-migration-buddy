import logoPatrimoniar from '@/assets/logo-patrimoniar.svg';

interface EliteLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'minimal';
  className?: string;
}

const sizeConfig = {
  sm: { width: 80, height: 51 },
  md: { width: 120, height: 77 },
  lg: { width: 160, height: 102 },
  xl: { width: 200, height: 128 },
};

export const EliteLogo = ({ size = 'md', variant = 'full', className = '' }: EliteLogoProps) => {
  const config = sizeConfig[size];
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={logoPatrimoniar} 
        alt="Patrimoniar Imóveis" 
        style={{ 
          width: config.width, 
          height: 'auto',
          maxHeight: config.height,
        }}
      />
    </div>
  );
};

// Standalone watermark component for posts - uses the logo with transparency
export const EliteWatermark = ({ opacity = 0.15 }: { opacity?: number }) => {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      style={{ zIndex: 1 }}
    >
      <img 
        src={logoPatrimoniar} 
        alt="" 
        style={{ 
          width: '60%',
          maxWidth: 500,
          opacity,
        }}
      />
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
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(24px)',
          borderRadius: '16px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
        }}
      >
        <img 
          src={logoPatrimoniar} 
          alt="Patrimoniar Imóveis" 
          style={{ height: 50 }}
        />

        {showCta && (
          <>
            <div style={{ width: 1, height: 36, background: 'rgba(45, 43, 77, 0.2)', margin: '0 8px' }} />
            <span 
              className="text-sm font-medium uppercase tracking-wider"
              style={{ color: 'rgba(45, 43, 77, 0.8)' }}
            >
              Alto Padrão
            </span>
          </>
        )}
      </div>
    </div>
  );
};
