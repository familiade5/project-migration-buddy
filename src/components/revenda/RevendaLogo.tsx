import logoVdhRevenda from '@/assets/logo-vdh-revenda.png';

interface RevendaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
  variant?: 'transparent' | 'with-background';
}

const sizeConfig = {
  sm: { width: 80, height: 30 },
  md: { width: 120, height: 45 },
  lg: { width: 160, height: 60 },
  xl: { width: 200, height: 75 },
  xxl: { width: 280, height: 105 },
};

// SVG Logo component - pure white version for creatives
const LogoSVG = ({ width = 180, color = '#FFFFFF' }: { width?: number; color?: string }) => {
  const height = width * 0.375; // Maintain aspect ratio (300/800)
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 800 300" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill={color}>
        {/* Roof */}
        <path d="M200 120 L400 40 L600 120 L585 120 L400 55 L215 120 Z"/>
        
        {/* VDH text */}
        <text 
          x="400" 
          y="180"
          textAnchor="middle"
          fontFamily="Georgia, Times New Roman, serif"
          fontSize="120"
          fontWeight="600"
          fill={color}
        >
          VDH
        </text>
        
        {/* REVENDA + */}
        <text 
          x="400" 
          y="235"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="42"
          letterSpacing="6"
          fill={color}
        >
          REVENDA +
        </text>
      </g>
    </svg>
  );
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
    // Version for app UI - black logo, no background
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{
          width: config.width,
          height: config.height,
        }}
      >
        <LogoSVG width={config.width} color="#000000" />
      </div>
    );
  }
  
  // Transparent version - white SVG logo for creatives
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{
        width: config.width,
        height: config.height,
      }}
    >
      <LogoSVG width={config.width} color="#FFFFFF" />
    </div>
  );
};

// Watermark overlay - white SVG logo for all images
export const RevendaWatermark = ({ 
  position = 'bottom-center',
  size = 'md',
}: { 
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'bottom-center';
  size?: 'sm' | 'md' | 'lg';
}) => {
  const config = {
    sm: 160,
    md: 220,
    lg: 280,
  };

  // Bottom-center is the default for single-photo slides
  if (position === 'bottom-center') {
    return (
      <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
        <LogoSVG width={config[size]} />
      </div>
    );
  }

  const positionStyles = {
    'top-left': 'top-6 left-6',
    'top-right': 'top-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-right': 'bottom-6 right-6',
  };

  return (
    <div className={`absolute ${positionStyles[position]} pointer-events-none`}>
      <LogoSVG width={config[size]} />
    </div>
  );
};

// Logo bar for bottom of feed posts - centered at bottom
export const RevendaLogoBar = () => {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
      style={{ paddingBottom: '40px' }}
    >
      <LogoSVG width={280} />
    </div>
  );
};

// Story logo bar - vertical format, centered at bottom
export const RevendaLogoBarStory = () => {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
      style={{ paddingBottom: '60px' }}
    >
      <LogoSVG width={320} />
    </div>
  );
};
