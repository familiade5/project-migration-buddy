// AM Logo — faithful SVG recreation of the Apartamentos Manaus logo
// Icon: two building blocks (blue "A" + orange "M") sharing a peaked roofline
// Colors: blue #1B5EA6, orange #F47920

interface AMLogoSVGProps {
  width?: number;
  variant?: 'color' | 'white';
}

const AMLogoSVG = ({ width = 240, variant = 'color' }: AMLogoSVGProps) => {
  const blue   = variant === 'white' ? '#FFFFFF' : '#1B5EA6';
  const orange = variant === 'white' ? 'rgba(255,255,255,0.85)' : '#E8873A';
  const dividerColor  = variant === 'white' ? 'rgba(255,255,255,0.45)' : '#CCCCCC';
  const textColor     = variant === 'white' ? '#FFFFFF' : '#1a1a1a';
  const subTextColor  = variant === 'white' ? 'rgba(255,255,255,0.65)' : '#888888';
  const windowFill    = variant === 'white' ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.55)';

  // All coordinates designed on a 220×80 viewBox
  // Icon occupies x 0..76, text starts at x 86
  return (
    <svg
      width={width}
      height={width * (80 / 220)}
      viewBox="0 0 220 80"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* ── ROOFLINE (shared peaked triangle) ── */}
      {/* The peak sits at x=38, y=4; left edge x=2, right edge x=74; base y=34 */}
      <polygon points="38,4 2,34 74,34" fill={blue} />
      {/* Small orange accent at peak */}
      <polygon points="38,4 34,16 42,16" fill={orange} />

      {/* ── LEFT BLOCK — "A" shape (blue) ── */}
      <rect x="4"  y="34" width="30" height="40" rx="2" fill={blue} />
      {/* Window left */}
      <rect x="9"  y="41" width="8" height="8" rx="1" fill={windowFill} />
      {/* Window right */}
      <rect x="21" y="41" width="8" height="8" rx="1" fill={windowFill} />
      {/* Door / archway in middle bottom */}
      <rect x="14" y="58" width="10" height="16" rx="2" fill={windowFill} />

      {/* ── RIGHT BLOCK — "M" shape (orange) ── */}
      <rect x="40" y="34" width="30" height="40" rx="2" fill={orange} />
      {/* M arch: two inner notches cut from the top of the block */}
      <rect x="44" y="34" width="9"  height="14" rx="1" fill="white" fillOpacity={variant === 'white' ? 0.2 : 0.9} />
      <rect x="57" y="34" width="9"  height="14" rx="1" fill="white" fillOpacity={variant === 'white' ? 0.2 : 0.9} />
      {/* Window */}
      <rect x="45" y="55" width="8"  height="8" rx="1" fill={windowFill} />
      <rect x="57" y="55" width="8"  height="8" rx="1" fill={windowFill} />

      {/* ── DIVIDER ── */}
      <line x1="82" y1="6" x2="82" y2="74" stroke={dividerColor} strokeWidth="1.5" />

      {/* ── TEXT: APARTAMENTOS ── */}
      <text
        x="90" y="36"
        fontFamily="'Montserrat', 'Arial Black', Arial, sans-serif"
        fontSize="17.5"
        fontWeight="800"
        fill={textColor}
        letterSpacing="0.5"
      >
        APARTAMENTOS
      </text>

      {/* ── TEXT: MANAUS ── */}
      <text
        x="90" y="56"
        fontFamily="'Montserrat', 'Arial Black', Arial, sans-serif"
        fontSize="17.5"
        fontWeight="800"
        fill={textColor}
        letterSpacing="0.5"
      >
        MANAUS
      </text>

      {/* ── SUBTEXT: IMOBILIÁRIA ── */}
      <text
        x="90" y="70"
        fontFamily="'Montserrat', Arial, sans-serif"
        fontSize="9"
        fontWeight="400"
        fill={subTextColor}
        letterSpacing="2.5"
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
  sm: 140,
  md: 220,
  lg: 280,
  xl: 360,
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
  const widths = { sm: 130, md: 170, lg: 220 };
  const w = widths[size];

  const baseClass = 'absolute pointer-events-none';
  const posMap: Record<string, string> = {
    'bottom-left':   `${baseClass} bottom-3 left-3`,
    'bottom-right':  `${baseClass} bottom-3 right-3`,
    'bottom-center': `${baseClass} bottom-3 left-0 right-0 flex justify-center`,
  };

  return (
    <div className={posMap[position]}>
      <AMLogoSVG width={w} variant="white" />
    </div>
  );
};

export { AMLogoSVG };
