import logoVdhRevenda from '@/assets/logo-vdh-revenda.png';

interface RevendaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
  dark?: boolean;
}

const sizeConfig = {
  sm: { width: 80, height: 40 },
  md: { width: 120, height: 60 },
  lg: { width: 160, height: 80 },
  xl: { width: 200, height: 100 },
  xxl: { width: 280, height: 140 },
};

// Main logo component - uses the uploaded VDH Revenda+ image
// Blue tinted with illumination effect, no background
export const RevendaLogo = ({ 
  size = 'md', 
  className = '',
  dark = false
}: RevendaLogoProps) => {
  const config = sizeConfig[size];
  
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{
        width: config.width,
        height: config.height,
      }}
    >
      <img 
        src={logoVdhRevenda}
        alt="VDH Revenda+"
        className="w-full h-full object-contain"
        style={{
          // Blue tint with illumination effect similar to gold glow
          filter: `
            brightness(1.1) 
            sepia(1) 
            saturate(3) 
            hue-rotate(180deg) 
            drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))
            drop-shadow(0 2px 12px rgba(59, 130, 246, 0.3))
          `,
        }}
      />
    </div>
  );
};

// Watermark overlay - subtle logo in corner
export const RevendaWatermark = ({ 
  position = 'bottom-left',
  size = 'md',
}: { 
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'sm' | 'md' | 'lg';
}) => {
  const config = {
    sm: { width: 80, height: 40 },
    md: { width: 120, height: 60 },
    lg: { width: 160, height: 80 },
  };

  const positionStyles = {
    'top-left': 'top-8 left-8',
    'top-right': 'top-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'bottom-right': 'bottom-8 right-8',
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
        src={logoVdhRevenda}
        alt="VDH Revenda+"
        className="w-full h-full object-contain"
        style={{
          // Blue illumination effect
          filter: `
            brightness(1.1) 
            sepia(1) 
            saturate(3) 
            hue-rotate(180deg) 
            drop-shadow(0 0 10px rgba(59, 130, 246, 0.6))
            drop-shadow(0 4px 16px rgba(59, 130, 246, 0.4))
          `,
          opacity: 0.95,
        }}
      />
    </div>
  );
};

// Logo bar for bottom of feed posts - elegant gradient fade
export const RevendaLogoBar = ({ dark = false }: { dark?: boolean }) => {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-8"
      style={{
        background: dark 
          ? 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.6) 50%, transparent 100%)'
          : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
      }}
    >
      <RevendaLogo size="lg" dark={dark} />
    </div>
  );
};

// Story logo bar - vertical format
export const RevendaLogoBarStory = ({ dark = false }: { dark?: boolean }) => {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-12"
      style={{
        background: dark 
          ? 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.6) 50%, transparent 100%)'
          : 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
      }}
    >
      <RevendaLogo size="xl" dark={dark} />
    </div>
  );
};