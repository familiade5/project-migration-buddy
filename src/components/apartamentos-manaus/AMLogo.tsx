// AM Logo — faithful SVG recreation of the Apartamentos Manaus logo
// Icon: two square blocks (A=blue left, M=orange right) with peaked shared roofline

interface AMLogoSVGProps {
  width?: number;
  variant?: 'color' | 'white';
}

export const AMLogoSVG = ({ width = 220, variant = 'color' }: AMLogoSVGProps) => {
  const height = Math.round(width * (130 / 480));

  const blue    = variant === 'white' ? '#FFFFFF' : '#1B5EA6';
  const orange  = variant === 'white' ? 'rgba(255,255,255,0.82)' : '#E07B2E';
  const div     = variant === 'white' ? 'rgba(255,255,255,0.38)' : '#CCCCCC';
  const title   = variant === 'white' ? '#FFFFFF' : '#1a1a1a';
  const sub     = variant === 'white' ? 'rgba(255,255,255,0.55)' : '#999999';
  const bg      = variant === 'white' ? 'rgba(255,255,255,0.18)' : '#FFFFFF';
  const bgOp    = variant === 'white' ? 1 : 1;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 480 130"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* ── ICON (0,0 → 130,130) ── */}

      {/* Shared roofline — flat triangle, peak at (65, 8) */}
      <polygon points="65,8 4,52 126,52" fill={blue} />
      {/* small orange triangle at peak */}
      <polygon points="65,8 60,22 70,22" fill={orange} />

      {/* LEFT BLOCK — "A" shape — blue rectangle */}
      <rect x="5"  y="52" width="54" height="70" rx="3" fill={blue} />
      {/* Two top windows (eyes of A) */}
      <rect x="13" y="61" width="14" height="13" rx="2" fill={bg} fillOpacity={bgOp} />
      <rect x="36" y="61" width="14" height="13" rx="2" fill={bg} fillOpacity={bgOp} />
      {/* Center arch / door — the "leg" opening of the letter A */}
      <rect x="24" y="88" width="16" height="34" rx="8 8 0 0" fill={bg} fillOpacity={bgOp} />

      {/* RIGHT BLOCK — "M" shape — orange rectangle */}
      <rect x="72" y="52" width="54" height="70" rx="3" fill={orange} />
      {/* Two top arch cutouts — the humps of M */}
      <rect x="79" y="52" width="15" height="22" rx="7 7 0 0" fill={bg} fillOpacity={bgOp} />
      <rect x="104" y="52" width="15" height="22" rx="7 7 0 0" fill={bg} fillOpacity={bgOp} />
      {/* Bottom windows */}
      <rect x="80" y="89" width="13" height="12" rx="2" fill={bg} fillOpacity={bgOp} />
      <rect x="105" y="89" width="13" height="12" rx="2" fill={bg} fillOpacity={bgOp} />

      {/* ── DIVIDER ── */}
      <line x1="143" y1="10" x2="143" y2="120" stroke={div} strokeWidth="1.5" />

      {/* ── TEXT ── */}
      <text x="156" y="58"
        fontFamily="'Montserrat','Arial Black',Arial,sans-serif"
        fontSize="40" fontWeight="800" fill={title} letterSpacing="0.5">
        APARTAMENTOS
      </text>
      <text x="156" y="97"
        fontFamily="'Montserrat','Arial Black',Arial,sans-serif"
        fontSize="40" fontWeight="800" fill={title} letterSpacing="0.5">
        MANAUS
      </text>
      <text x="158" y="117"
        fontFamily="'Montserrat',Arial,sans-serif"
        fontSize="17" fontWeight="400" fill={sub} letterSpacing="5">
        IMOBILIÁRIA
      </text>
    </svg>
  );
};

// ── AMLogo wrapper ────────────────────────────────────────────────────────────
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

// ── AMWatermark ───────────────────────────────────────────────────────────────
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
