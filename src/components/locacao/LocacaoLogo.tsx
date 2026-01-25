// VDH Revenda+ Logo for Locação & Gestão section
// Same logo but styled more subtly - flat, neutral, professional

interface LocacaoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
  variant?: 'dark' | 'light';
}

const sizeConfig = {
  sm: 120,
  md: 160,
  lg: 200,
  xl: 260,
  xxl: 320,
};

// SVG Logo component - clean and flat
const LogoSVG = ({ width = 180, color = '#374151' }: { width?: number; color?: string }) => {
  const height = width * 0.375;
  
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

export const LocacaoLogo = ({ 
  size = 'md', 
  className = '',
  variant = 'dark',
}: LocacaoLogoProps) => {
  const width = sizeConfig[size];
  const color = variant === 'dark' ? '#374151' : '#ffffff';
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <LogoSVG width={width} color={color} />
    </div>
  );
};

// Watermark for creatives - matching Revenda+ sizes
export const LocacaoWatermark = ({ 
  position = 'bottom-center',
  size = 'md',
  variant = 'light',
}: { 
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'bottom-center';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
}) => {
  // Match Revenda+ sizes
  const config = {
    sm: 160,
    md: 220,
    lg: 280,
  };
  
  const color = variant === 'dark' ? '#374151' : '#ffffff';

  if (position === 'bottom-center') {
    return (
      <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
        <LogoSVG width={config[size]} color={color} />
      </div>
    );
  }

  const positionStyles = {
    'top-left': 'top-10 left-10',
    'top-right': 'top-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-right': 'bottom-6 right-6',
  };

  return (
    <div className={`absolute ${positionStyles[position]} pointer-events-none`}>
      <LogoSVG width={config[size]} color={color} />
    </div>
  );
};

// Logo bar for bottom of posts - matching Revenda+ sizes
export const LocacaoLogoBar = () => {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
      style={{ paddingBottom: '40px' }}
    >
      <LogoSVG width={280} color="#ffffff" />
    </div>
  );
};

// Story logo bar - larger for stories
export const LocacaoLogoBarStory = () => {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
      style={{ paddingBottom: '60px' }}
    >
      <LogoSVG width={320} color="#ffffff" />
    </div>
  );
};
