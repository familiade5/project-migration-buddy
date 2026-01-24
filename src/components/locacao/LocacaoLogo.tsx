// VDH Revenda+ Logo for Locação & Gestão section
// Same logo but styled more subtly - flat, neutral, professional

interface LocacaoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'dark' | 'light'; // dark = black text, light = white text
}

const sizeConfig = {
  sm: 100,
  md: 140,
  lg: 180,
  xl: 220,
};

// SVG Logo component - clean and flat
const LogoSVG = ({ width = 140, color = '#374151' }: { width?: number; color?: string }) => {
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

// Subtle watermark for creatives - very light opacity
export const LocacaoWatermark = ({ 
  position = 'bottom-center',
  size = 'md',
  variant = 'light',
}: { 
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'bottom-center';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
}) => {
  const config = {
    sm: 120,
    md: 160,
    lg: 200,
  };
  
  const color = variant === 'dark' ? '#374151' : '#ffffff';

  if (position === 'bottom-center') {
    return (
      <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none opacity-80">
        <LogoSVG width={config[size]} color={color} />
      </div>
    );
  }

  const positionStyles = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div className={`absolute ${positionStyles[position]} pointer-events-none opacity-80`}>
      <LogoSVG width={config[size]} color={color} />
    </div>
  );
};

// Logo bar for bottom of posts
export const LocacaoLogoBar = () => {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
      style={{ paddingBottom: '32px' }}
    >
      <LogoSVG width={200} color="#ffffff" />
    </div>
  );
};

// Story logo bar
export const LocacaoLogoBarStory = () => {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
      style={{ paddingBottom: '48px' }}
    >
      <LogoSVG width={240} color="#ffffff" />
    </div>
  );
};
