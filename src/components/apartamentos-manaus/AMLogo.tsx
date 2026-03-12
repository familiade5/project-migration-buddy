import logoColor from '@/assets/logo-apartamentos-manaus.png';

interface AMLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'color' | 'white';
  width?: number;
}

const sizeConfig = { sm: 160, md: 220, lg: 300, xl: 400 };

// Color variant: just the PNG
export const AMLogoSVG = ({ width = 220, variant = 'color' }: { width?: number; variant?: 'color' | 'white' }) => {
  if (variant === 'white') {
    // White tinted version via CSS filter
    return (
      <img
        src={logoColor}
        alt="Apartamentos Manaus"
        style={{ width, height: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }}
      />
    );
  }
  return (
    <img
      src={logoColor}
      alt="Apartamentos Manaus"
      style={{ width, height: 'auto', display: 'block' }}
    />
  );
};

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
