// AM Logo component - faithful SVG recreation of the Apartamentos Manaus logo
// Colors: blue #1B5EA6, orange #F47920

interface AMLogoSVGProps {
  width?: number;
  variant?: 'color' | 'white';
}

const AMLogoSVG = ({ width = 200, variant = 'color' }: AMLogoSVGProps) => {
  const height = width * 0.38;
  const scale = width / 520;

  const blue = variant === 'white' ? '#FFFFFF' : '#1B5EA6';
  const orange = variant === 'white' ? 'rgba(255,255,255,0.85)' : '#F47920';
  const dividerColor = variant === 'white' ? 'rgba(255,255,255,0.4)' : '#CCCCCC';
  const textColor = variant === 'white' ? '#FFFFFF' : '#1B5EA6';
  const subTextColor = variant === 'white' ? 'rgba(255,255,255,0.7)' : '#888888';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 520 198"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Left building block (blue) */}
      <rect x="4" y="80" width="72" height="110" rx="5" fill={blue} />
      {/* Left window */}
      <rect x="20" y="100" width="16" height="16" rx="2" fill="white" fillOpacity="0.6" />
      <rect x="44" y="100" width="16" height="16" rx="2" fill="white" fillOpacity="0.6" />

      {/* Right building block (orange) */}
      <rect x="84" y="80" width="72" height="110" rx="5" fill={orange} />
      {/* Right window */}
      <rect x="100" y="100" width="16" height="16" rx="2" fill="white" fillOpacity="0.6" />
      <rect x="124" y="100" width="16" height="16" rx="2" fill="white" fillOpacity="0.6" />

      {/* Roof (blue) - shared peaked roof */}
      <polygon points="80,8 4,84 156,84" fill={blue} />
      {/* Roof ridge (orange accent) */}
      <polygon points="80,8 76,28 84,28" fill={orange} />

      {/* Vertical divider */}
      <line x1="172" y1="10" x2="172" y2="188" stroke={dividerColor} strokeWidth="2" />

      {/* APARTAMENTOS */}
      <text
        x="186"
        y="90"
        fontFamily="Arial Black, Arial, sans-serif"
        fontSize="46"
        fontWeight="900"
        fill={textColor}
        letterSpacing="1"
      >
        APARTAMENTOS
      </text>
      {/* MANAUS */}
      <text
        x="186"
        y="144"
        fontFamily="Arial Black, Arial, sans-serif"
        fontSize="46"
        fontWeight="900"
        fill={textColor}
        letterSpacing="1"
      >
        MANAUS
      </text>
      {/* IMOBILIÁRIA */}
      <text
        x="188"
        y="175"
        fontFamily="Arial, sans-serif"
        fontSize="22"
        fontWeight="400"
        fill={subTextColor}
        letterSpacing="4"
      >
        IMOBILIÁRIA
      </text>
    </svg>
  );
};

interface AMLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'color' | 'white';
}

const sizeConfig = {
  sm: 120,
  md: 200,
  lg: 260,
  xl: 340,
};

export const AMLogo = ({ size = 'md', className = '', variant = 'color' }: AMLogoProps) => {
  const width = sizeConfig[size];
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <AMLogoSVG width={width} variant={variant} />
    </div>
  );
};

export const AMWatermark = ({
  position = 'bottom-left',
  size = 'md',
}: {
  position?: 'bottom-left' | 'bottom-right' | 'bottom-center';
  size?: 'sm' | 'md' | 'lg';
}) => {
  const widths = { sm: 120, md: 160, lg: 210 };
  const w = widths[size];

  const baseClass = 'absolute pointer-events-none';
  const posMap: Record<string, string> = {
    'bottom-left': `${baseClass} bottom-3 left-3`,
    'bottom-right': `${baseClass} bottom-3 right-3`,
    'bottom-center': `${baseClass} bottom-3 left-0 right-0 flex justify-center`,
  };

  return (
    <div className={posMap[position]}>
      <AMLogoSVG width={w} variant="white" />
    </div>
  );
};

export { AMLogoSVG };
