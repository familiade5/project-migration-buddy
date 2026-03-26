import logoColor from '@/assets/logo-apartamentos-fortaleza.png';

interface AFLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'color' | 'white';
  width?: number;
}

const sizeConfig = { sm: 160, md: 220, lg: 300, xl: 400 };

export const AFLogoSVG = ({ width = 220, variant = 'color' }: { width?: number; variant?: 'color' | 'white' }) => {
  if (variant === 'white') {
    return (
      <img
        src={logoColor}
        alt="Apartamentos Fortaleza"
        style={{ width, height: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }}
      />
    );
  }
  return (
    <img
      src={logoColor}
      alt="Apartamentos Fortaleza"
      style={{ width, height: 'auto', display: 'block' }}
    />
  );
};

export const AFLogo = ({ size = 'md', className = '', variant = 'color', width }: AFLogoProps) => {
  const w = width ?? sizeConfig[size];
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <AFLogoSVG width={w} variant={variant} />
    </div>
  );
};

export const AFWatermark = ({
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
      <AFLogoSVG width={widths[size]} variant="white" />
    </div>
  );
};
