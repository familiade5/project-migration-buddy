import logoAM from '@/assets/logo-apartamentos-manaus.png';

interface AMLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'color' | 'white';
}

const sizeConfig = {
  sm: { width: 100, height: 40 },
  md: { width: 160, height: 64 },
  lg: { width: 200, height: 80 },
  xl: { width: 260, height: 104 },
};

// White SVG version for overlaying on colored/dark backgrounds
const AMLogoWhiteSVG = ({ width = 160 }: { width?: number }) => {
  const height = width * 0.4;
  return (
    <svg width={width} height={height} viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg">
      {/* AM house icon */}
      <g fill="#FFFFFF">
        {/* Left block - A shape */}
        <rect x="10" y="60" width="60" height="70" rx="4"/>
        <rect x="25" y="80" width="30" height="25" rx="2" fill="rgba(255,255,255,0.3)"/>
        {/* Right block - M shape */}
        <rect x="90" y="60" width="60" height="70" rx="4"/>
        <rect x="105" y="80" width="30" height="25" rx="2" fill="rgba(255,255,255,0.3)"/>
        {/* Shared roof */}
        <polygon points="80,10 5,65 155,65"/>
        {/* Divider */}
        <line x1="180" y1="20" x2="180" y2="130" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
        {/* Text */}
        <text x="200" y="60" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="700" fill="#FFFFFF">APARTAMENTOS</text>
        <text x="200" y="95" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="700" fill="#FFFFFF">MANAUS</text>
        <text x="200" y="120" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="400" fill="rgba(255,255,255,0.8)" letterSpacing="3">IMOBILIÁRIA</text>
      </g>
    </svg>
  );
};

export const AMLogo = ({ size = 'md', className = '', variant = 'color' }: AMLogoProps) => {
  const config = sizeConfig[size];

  if (variant === 'white') {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: config.width, height: config.height }}>
        <AMLogoWhiteSVG width={config.width} />
      </div>
    );
  }

  return (
    <img
      src={logoAM}
      alt="Apartamentos Manaus"
      className={className}
      style={{ width: config.width, height: config.height, objectFit: 'contain' }}
    />
  );
};

// Watermark for post creatives - white version bottom-right
export const AMWatermark = ({
  position = 'bottom-left',
  size = 'md',
}: {
  position?: 'bottom-left' | 'bottom-right' | 'bottom-center';
  size?: 'sm' | 'md' | 'lg';
}) => {
  const widths = { sm: 100, md: 140, lg: 180 };
  const w = widths[size];

  const posMap = {
    'bottom-left': 'bottom-3 left-3',
    'bottom-right': 'bottom-3 right-3',
    'bottom-center': 'bottom-3 left-0 right-0 flex justify-center',
  };

  return (
    <div className={`absolute ${posMap[position]} pointer-events-none`}>
      <AMLogoWhiteSVG width={w} />
    </div>
  );
};
