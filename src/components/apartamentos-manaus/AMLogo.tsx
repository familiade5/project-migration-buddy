// AM Logo — SVG recreation faithful to the Apartamentos Manaus brand
// Icon: letter A (blue block, left) + letter M (orange block, right) forming a house/building
// Colors: #1B5EA6 (blue), #E8873A (orange)

interface AMLogoSVGProps {
  width?: number;
  variant?: 'color' | 'white';
}

const AMLogoSVG = ({ width = 240, variant = 'color' }: AMLogoSVGProps) => {
  const aspectRatio = 520 / 140;
  const height = width / aspectRatio;

  const blue       = variant === 'white' ? '#FFFFFF' : '#1B5EA6';
  const orange     = variant === 'white' ? 'rgba(255,255,255,0.80)' : '#E8873A';
  const divider    = variant === 'white' ? 'rgba(255,255,255,0.40)' : '#CCCCCC';
  const titleColor = variant === 'white' ? '#FFFFFF' : '#222222';
  const subColor   = variant === 'white' ? 'rgba(255,255,255,0.60)' : '#999999';
  // "cut-out" white for letter shapes inside blocks
  const cut = 'white';
  const cutOp = variant === 'white' ? 0.25 : 1;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 520 140"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* ─────────────────────────────────────────
          ICON  (fits in 0,0 → 160,140)
          ───────────────────────────────────────── */}

      {/* shared roofline triangle: peak at (80,6), base corners (4,56) and (156,56) */}
      <polygon points="80,6 4,56 156,56" fill={blue} />
      {/* small orange roof accent */}
      <polygon points="80,6 74,26 86,26" fill={orange} />

      {/* LEFT BLOCK — blue "A" shape */}
      <rect x="6"  y="56" width="64" height="78" rx="3" fill={blue} />
      {/* "A" cutout: two top windows */}
      <rect x="15" y="65" width="16" height="16" rx="2" fill={cut} fillOpacity={cutOp} />
      <rect x="45" y="65" width="16" height="16" rx="2" fill={cut} fillOpacity={cutOp} />
      {/* "A" arch/door at bottom center — white arch */}
      <rect x="28" y="92" width="20" height="42" rx="10 10 2 2" fill={cut} fillOpacity={cutOp} />

      {/* RIGHT BLOCK — orange "M" shape */}
      <rect x="90" y="56" width="64" height="78" rx="3" fill={orange} />
      {/* "M" cutout: two top notch arches */}
      <rect x="98"  y="56" width="18" height="26" rx="9 9 2 2" fill={cut} fillOpacity={cutOp} />
      <rect x="128" y="56" width="18" height="26" rx="9 9 2 2" fill={cut} fillOpacity={cutOp} />
      {/* "M" bottom windows */}
      <rect x="99"  y="94" width="16" height="14" rx="2" fill={cut} fillOpacity={cutOp} />
      <rect x="129" y="94" width="16" height="14" rx="2" fill={cut} fillOpacity={cutOp} />

      {/* ─────────────────────────────────────────
          DIVIDER
          ───────────────────────────────────────── */}
      <line x1="174" y1="10" x2="174" y2="130" stroke={divider} strokeWidth="2" />

      {/* ─────────────────────────────────────────
          TEXT
          ───────────────────────────────────────── */}
      {/* APARTAMENTOS */}
      <text
        x="188" y="64"
        fontFamily="'Montserrat', 'Arial Black', Arial, sans-serif"
        fontSize="44"
        fontWeight="800"
        fill={titleColor}
        letterSpacing="1"
      >
        APARTAMENTOS
      </text>

      {/* MANAUS */}
      <text
        x="188" y="108"
        fontFamily="'Montserrat', 'Arial Black', Arial, sans-serif"
        fontSize="44"
        fontWeight="800"
        fill={titleColor}
        letterSpacing="1"
      >
        MANAUS
      </text>

      {/* IMOBILIÁRIA */}
      <text
        x="190" y="130"
        fontFamily="'Montserrat', Arial, sans-serif"
        fontSize="20"
        fontWeight="400"
        fill={subColor}
        letterSpacing="6"
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
  sm: 160,
  md: 240,
  lg: 320,
  xl: 420,
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
  const widths = { sm: 140, md: 190, lg: 250 };
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
