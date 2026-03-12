// AM Logo — inline SVG faithful to Apartamentos Manaus branding
// Icon: two building blocks — blue "A" (left) + orange "M" (right) — with shared triangular roofline

interface AMLogoSVGProps {
  width?: number;
  variant?: 'color' | 'white';
}

export const AMLogoSVG = ({ width = 220, variant = 'color' }: AMLogoSVGProps) => {
  // viewBox: 480 × 130 — icon on left (0..130), divider, text on right
  const height = Math.round(width * (130 / 480));

  const blue       = variant === 'white' ? '#FFFFFF' : '#1B5EA6';
  const orange     = variant === 'white' ? 'rgba(255,255,255,0.82)' : '#E8873A';
  const divider    = variant === 'white' ? 'rgba(255,255,255,0.38)' : '#CCCCCC';
  const titleColor = variant === 'white' ? '#FFFFFF' : '#1a1a1a';
  const subColor   = variant === 'white' ? 'rgba(255,255,255,0.58)' : '#999999';
  const cutFill    = 'white';
  const cutOp      = variant === 'white' ? 0.22 : 1;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 480 130"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* ── SHARED ROOFLINE (triangle, peak at 65,4) ── */}
      <polygon points="65,4 2,50 128,50" fill={blue} />
      {/* small orange accent on peak */}
      <polygon points="65,4 60,20 70,20" fill={orange} />

      {/* ── LEFT BLOCK — blue "A" shape ── */}
      {/* main body */}
      <rect x="4"  y="50" width="55" height="74" rx="3" fill={blue} />
      {/* two top windows */}
      <rect x="11" y="59" width="14" height="14" rx="2" fill={cutFill} fillOpacity={cutOp} />
      <rect x="35" y="59" width="14" height="14" rx="2" fill={cutFill} fillOpacity={cutOp} />
      {/* arch/door at bottom center — the "A" leg opening */}
      <rect x="23" y="86" width="18" height="38" rx="9 9 2 2" fill={cutFill} fillOpacity={cutOp} />

      {/* ── RIGHT BLOCK — orange "M" shape ── */}
      <rect x="73" y="50" width="55" height="74" rx="3" fill={orange} />
      {/* two top notch cutouts — the "M" humps */}
      <rect x="80" y="50" width="16" height="24" rx="8 8 2 2" fill={cutFill} fillOpacity={cutOp} />
      <rect x="105" y="50" width="16" height="24" rx="8 8 2 2" fill={cutFill} fillOpacity={cutOp} />
      {/* two bottom windows */}
      <rect x="81" y="90" width="14" height="13" rx="2" fill={cutFill} fillOpacity={cutOp} />
      <rect x="106" y="90" width="14" height="13" rx="2" fill={cutFill} fillOpacity={cutOp} />

      {/* ── DIVIDER ── */}
      <line x1="143" y1="8" x2="143" y2="122" stroke={divider} strokeWidth="1.5" />

      {/* ── TEXT ── */}
      {/* APARTAMENTOS */}
      <text
        x="155" y="58"
        fontFamily="'Montserrat','Arial Black',Arial,sans-serif"
        fontSize="41"
        fontWeight="800"
        fill={titleColor}
        letterSpacing="0.8"
      >
        APARTAMENTOS
      </text>

      {/* MANAUS */}
      <text
        x="155" y="98"
        fontFamily="'Montserrat','Arial Black',Arial,sans-serif"
        fontSize="41"
        fontWeight="800"
        fill={titleColor}
        letterSpacing="0.8"
      >
        MANAUS
      </text>

      {/* IMOBILIÁRIA */}
      <text
        x="157" y="118"
        fontFamily="'Montserrat',Arial,sans-serif"
        fontSize="18"
        fontWeight="400"
        fill={subColor}
        letterSpacing="5.5"
      >
        IMOBILIÁRIA
      </text>
    </svg>
  );
};

// ── Named export for component use ──
interface AMLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'color' | 'white';
  width?: number;
}

const sizeConfig = { sm: 160, md: 240, lg: 320, xl: 420 };

export const AMLogo = ({ size = 'md', className = '', variant = 'color', width }: AMLogoProps) => {
  const w = width ?? sizeConfig[size];
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <AMLogoSVG width={w} variant={variant} />
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
  const posMap: Record<string, string> = {
    'bottom-left':   'absolute pointer-events-none bottom-3 left-3',
    'bottom-right':  'absolute pointer-events-none bottom-3 right-3',
    'bottom-center': 'absolute pointer-events-none bottom-3 left-0 right-0 flex justify-center',
  };
  return (
    <div className={posMap[position]}>
      <AMLogoSVG width={widths[size]} variant="white" />
    </div>
  );
};
