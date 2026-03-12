// AM Logo — SVG recreation faithful to the Apartamentos Manaus logo
// Reference: two square blocks forming letters A (blue) and M (orange),
// with a shared triangular peaked roofline, vertical divider, and text.

import logoSvg from '@/assets/logo-apartamentos-manaus.svg';

interface AMLogoSVGProps {
  width?: number;
  variant?: 'color' | 'white';
}

// ── Color variant: uses the real image (color PNG/SVG) ─────────────────────
// The uploaded SVG is a 1440×810 canvas; the logo is at x≈522, y≈336, w≈396, h≈107.
// We crop it with overflow:hidden + negative offset.
const CANVAS_W = 1440;
const CANVAS_H = 810;
const LOGO_X   = 519;
const LOGO_Y   = 330;
const LOGO_W   = 400;
const LOGO_H   = 112;

// NOTE: that SVG only renders in white (it has a white filter).
// For the color variant we use an inline SVG recreation.
// For the white variant we use the cropped SVG file.

export const AMLogoSVG = ({ width = 220, variant = 'color' }: AMLogoSVGProps) => {
  const height = Math.round(width * (LOGO_H / LOGO_W));

  if (variant === 'white') {
    // Crop the real SVG to show only the logo region
    const scale = width / LOGO_W;
    const imgW  = Math.round(CANVAS_W * scale);
    const imgH  = Math.round(CANVAS_H * scale);
    const offX  = Math.round(LOGO_X * scale);
    const offY  = Math.round(LOGO_Y * scale);

    return (
      <div style={{ width, height, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
        <img
          src={logoSvg}
          alt="Apartamentos Manaus"
          style={{
            width: imgW,
            height: imgH,
            position: 'absolute',
            left: -offX,
            top: -offY,
            display: 'block',
          }}
        />
      </div>
    );
  }

  // ── Color variant: inline SVG recreation ─────────────────────────────────
  const blue   = '#1B5EA6';
  const orange = '#E07B2E';
  const div    = '#CCCCCC';
  const title  = '#1a1a1a';
  const sub    = '#999999';

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${LOGO_W} ${LOGO_H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* ── ICON (viewBox origin matches logo natural proportions) ── */}
      {/* Shared rooftop triangle — peak at (55, 6) */}
      <polygon points="55,6 4,44 106,44" fill={blue} />
      <polygon points="55,6 50,18 60,18" fill={orange} />

      {/* LEFT block — blue "A" */}
      <rect x="5"   y="44" width="44" height="62" rx="3" fill={blue} />
      <rect x="11"  y="52" width="11" height="11" rx="2" fill="white" />
      <rect x="30"  y="52" width="11" height="11" rx="2" fill="white" />
      <rect x="19"  y="74" width="13" height="32" rx="7 7 0 0" fill="white" />

      {/* RIGHT block — orange "M" */}
      <rect x="62"  y="44" width="44" height="62" rx="3" fill={orange} />
      <rect x="68"  y="44" width="12" height="20" rx="6 6 0 0" fill="white" />
      <rect x="90"  y="44" width="12" height="20" rx="6 6 0 0" fill="white" />
      <rect x="69"  y="80" width="10" height="10" rx="2" fill="white" />
      <rect x="91"  y="80" width="10" height="10" rx="2" fill="white" />

      {/* ── DIVIDER ── */}
      <line x1="118" y1="6" x2="118" y2="106" stroke={div} strokeWidth="1.5" />

      {/* ── TEXT ── */}
      <text x="126" y="48"
        fontFamily="'Montserrat','Arial Black',Arial,sans-serif"
        fontSize="32" fontWeight="800" fill={title} letterSpacing="0.4">
        APARTAMENTOS
      </text>
      <text x="126" y="80"
        fontFamily="'Montserrat','Arial Black',Arial,sans-serif"
        fontSize="32" fontWeight="800" fill={title} letterSpacing="0.4">
        MANAUS
      </text>
      <text x="127" y="98"
        fontFamily="'Montserrat',Arial,sans-serif"
        fontSize="13" fontWeight="400" fill={sub} letterSpacing="4.5">
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
  const widths = { sm: 130, md: 175, lg: 230 };
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
