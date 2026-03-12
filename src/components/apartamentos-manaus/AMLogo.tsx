import logoColor from '@/assets/logo-apartamentos-manaus.svg';

interface AMLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'color' | 'white';
  width?: number;
}

const sizeConfig = {
  sm: 140,
  md: 220,
  lg: 300,
  xl: 400,
};

export const AMLogo = ({ size = 'md', className = '', width }: AMLogoProps) => {
  const w = width ?? sizeConfig[size];
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <img src={logoColor} alt="Apartamentos Manaus" width={w} style={{ display: 'block' }} />
    </div>
  );
};

// For slides/watermarks we keep a white SVG version using the same icon geometry
interface AMLogoSVGProps {
  width?: number;
  variant?: 'color' | 'white';
}

export const AMLogoSVG = ({ width = 220, variant = 'color' }: AMLogoSVGProps) => {
  if (variant === 'color') {
    const h = Math.round(width * (140 / 520));
    return (
      <img src={logoColor} alt="Apartamentos Manaus" width={width} height={h} style={{ display: 'block' }} />
    );
  }

  // White variant — inline SVG recreation for dark/colored backgrounds
  const aspectRatio = 520 / 140;
  const height = width / aspectRatio;
  const cut = 'white';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 520 140"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Roofline */}
      <polygon points="80,6 4,56 156,56" fill="white" />
      <polygon points="80,6 74,26 86,26" fill="rgba(255,255,255,0.7)" />

      {/* Left block — "A" (blue → white) */}
      <rect x="6"  y="56" width="64" height="78" rx="3" fill="white" />
      <rect x="15" y="65" width="16" height="16" rx="2" fill="rgba(255,255,255,0.25)" />
      <rect x="45" y="65" width="16" height="16" rx="2" fill="rgba(255,255,255,0.25)" />
      <rect x="28" y="92" width="20" height="42" rx="10 10 2 2" fill="rgba(255,255,255,0.25)" />

      {/* Right block — "M" (orange → white) */}
      <rect x="90" y="56" width="64" height="78" rx="3" fill="rgba(255,255,255,0.85)" />
      <rect x="98"  y="56" width="18" height="26" rx="9 9 2 2" fill={cut} fillOpacity={0.25} />
      <rect x="128" y="56" width="18" height="26" rx="9 9 2 2" fill={cut} fillOpacity={0.25} />
      <rect x="99"  y="94" width="16" height="14" rx="2" fill={cut} fillOpacity={0.25} />
      <rect x="129" y="94" width="16" height="14" rx="2" fill={cut} fillOpacity={0.25} />

      {/* Divider */}
      <line x1="174" y1="10" x2="174" y2="130" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />

      {/* APARTAMENTOS */}
      <text x="188" y="64"
        fontFamily="'Montserrat','Arial Black',Arial,sans-serif"
        fontSize="44" fontWeight="800" fill="white" letterSpacing="1">
        APARTAMENTOS
      </text>
      {/* MANAUS */}
      <text x="188" y="108"
        fontFamily="'Montserrat','Arial Black',Arial,sans-serif"
        fontSize="44" fontWeight="800" fill="white" letterSpacing="1">
        MANAUS
      </text>
      {/* IMOBILIÁRIA */}
      <text x="190" y="130"
        fontFamily="'Montserrat',Arial,sans-serif"
        fontSize="20" fontWeight="400" fill="rgba(255,255,255,0.65)" letterSpacing="6">
        IMOBILIÁRIA
      </text>
    </svg>
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
