import logoVdhRevenda from '@/assets/logo-vdh-revenda.png';

interface RevendaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
}

const sizeConfig = {
  sm: { width: 80, height: 40 },
  md: { width: 120, height: 60 },
  lg: { width: 160, height: 80 },
  xl: { width: 200, height: 100 },
  xxl: { width: 280, height: 140 },
};

// Main logo component - uses the uploaded VDH Revenda+ image
// White/transparent version for overlay on images - NO background
export const RevendaLogo = ({ 
  size = 'md', 
  className = '',
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
          // White color with subtle glow - no background, fully transparent
          filter: `
            brightness(0) invert(1)
            drop-shadow(0 0 6px rgba(255, 255, 255, 0.4))
            drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))
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
        src={logoVdhRevenda}
        alt="VDH Revenda+"
        className="w-full h-full object-contain"
        style={{
          // Subtle white watermark - discreet signature
          filter: `
            brightness(0) invert(1)
            drop-shadow(0 0 4px rgba(0, 0, 0, 0.5))
          `,
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
      <RevendaLogo size="lg" />
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
      <RevendaLogo size="xl" />
    </div>
  );
};
