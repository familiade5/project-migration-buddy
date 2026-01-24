import logoVdhRevenda from '@/assets/logo-vdh-revenda.png';
import logoVdhRevendaTransparent from '@/assets/logo-vdh-revenda-transparent.png';

interface RevendaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
  variant?: 'transparent' | 'with-background';
}

const sizeConfig = {
  sm: { width: 80, height: 40 },
  md: { width: 120, height: 60 },
  lg: { width: 160, height: 80 },
  xl: { width: 200, height: 100 },
  xxl: { width: 280, height: 140 },
};

// Main logo component - uses the uploaded VDH Revenda+ image
// variant: 'transparent' = white logo on transparent (for creatives)
// variant: 'with-background' = logo with grey background (for app UI)
export const RevendaLogo = ({ 
  size = 'md', 
  className = '',
  variant = 'transparent',
}: RevendaLogoProps) => {
  const config = sizeConfig[size];
  
  if (variant === 'with-background') {
    // Version with grey background for app UI/presentation
    return (
      <div 
        className={`flex items-center justify-center rounded-xl ${className}`}
        style={{
          width: config.width,
          height: config.height,
          backgroundColor: '#e2e8f0',
          padding: '8px',
        }}
      >
        <img 
          src={logoVdhRevenda}
          alt="VDH Revenda+"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }
  
  // Transparent version - white logo floating on images (for creatives)
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{
        width: config.width,
        height: config.height,
      }}
    >
      <img 
        src={logoVdhRevendaTransparent}
        alt="VDH Revenda+"
        className="w-full h-full object-contain"
        style={{
          // Assinatura branca, sem fundo (usa PNG transparente)
          filter: `
            drop-shadow(0 0 8px rgba(255, 255, 255, 0.35))
            drop-shadow(0 2px 10px rgba(0, 0, 0, 0.45))
          `,
        }}
      />
    </div>
  );
};

// Watermark overlay - subtle white logo in corner for all images
export const RevendaWatermark = ({ 
  position = 'bottom-right',
  size = 'sm',
}: { 
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'sm' | 'md' | 'lg';
}) => {
  const config = {
    sm: { width: 60, height: 30 },
    md: { width: 80, height: 40 },
    lg: { width: 100, height: 50 },
  };

  const positionStyles = {
    'top-left': 'top-6 left-6',
    'top-right': 'top-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-right': 'bottom-6 right-6',
  };

  return (
    <div 
      className={`absolute ${positionStyles[position]} pointer-events-none`}
      style={{
        width: config[size].width,
        height: config[size].height,
      }}
    >
      <img 
        src={logoVdhRevendaTransparent}
        alt="VDH Revenda+"
        className="w-full h-full object-contain"
        style={{
          // Marca d'água discreta, branca e sem fundo
          filter: `drop-shadow(0 0 4px rgba(0, 0, 0, 0.55))`,
          opacity: 0.5,
        }}
      />
    </div>
  );
};

// Logo bar for bottom of feed posts - elegant gradient fade
export const RevendaLogoBar = () => {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-8"
      style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
      }}
    >
      <RevendaLogo size="lg" variant="transparent" />
    </div>
  );
};

// Story logo bar - vertical format
export const RevendaLogoBarStory = () => {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-12"
      style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
      }}
    >
      <RevendaLogo size="xl" variant="transparent" />
    </div>
  );
};
