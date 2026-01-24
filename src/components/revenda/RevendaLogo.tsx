import logoVdhRevenda from '@/assets/logo-vdh-revenda.png';
import logoVdhRevendaTransparent from '@/assets/logo-vdh-revenda-transparent.png';
import logoVdhRevendaWhiteAlpha from '@/assets/logo-vdh-revenda-white-alpha.png';

interface RevendaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
  variant?: 'transparent' | 'with-background';
}

const sizeConfig = {
  sm: { width: 80, height: 40 },
  md: { width: 120, height: 60 },
  lg: { width: 160, height: 80 },
  xl: { width: 200, height: 100 },
  xxl: { width: 280, height: 140 },
};

// Main logo component - uses the uploaded VDH Revenda+ image
// variant: 'transparent' = white logo on transparent (for creatives)
// variant: 'with-background' = logo with grey background (for app UI)
export const RevendaLogo = ({ 
  size = 'md', 
  className = '',
  variant = 'transparent',
}: RevendaLogoProps) => {
  const config = sizeConfig[size];
  
  if (variant === 'with-background') {
    // Version with grey background for app UI/presentation
    return (
      <div 
        className={`flex items-center justify-center rounded-xl ${className}`}
        style={{
          width: config.width,
          height: config.height,
          backgroundColor: '#e2e8f0',
          padding: '8px',
        }}
      >
        <img 
          src={logoVdhRevenda}
          alt="VDH Revenda+"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }
  
  // Transparent version - white logo floating on images (for creatives)
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{
        width: config.width,
        height: config.height,
      }}
    >
      <img 
        src={logoVdhRevendaWhiteAlpha}
        alt="VDH Revenda+"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

// Watermark overlay - subtle white logo in corner or center for all images
export const RevendaWatermark = ({ 
  position = 'bottom-center',
  size = 'md',
}: { 
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'bottom-center';
  size?: 'sm' | 'md' | 'lg';
}) => {
  const config = {
    sm: { width: 100, height: 50 },
    md: { width: 140, height: 70 },
    lg: { width: 180, height: 90 },
  };

  // Bottom-center is the default for single-photo slides (like reference image)
  if (position === 'bottom-center') {
    return (
      <div 
        className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none"
      >
        <img 
          src={logoVdhRevendaWhiteAlpha}
          alt="VDH Revenda+"
          style={{
            width: config[size].width,
            height: 'auto',
          }}
        />
      </div>
    );
  }

  const positionStyles = {
    'top-left': 'top-6 left-6',
    'top-right': 'top-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-right': 'bottom-6 right-6',
  };

  return (
    <div 
      className={`absolute ${positionStyles[position]} pointer-events-none`}
      style={{
        width: config[size].width,
        height: config[size].height,
      }}
    >
      <img 
        src={logoVdhRevendaWhiteAlpha}
        alt="VDH Revenda+"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

// Logo bar for bottom of feed posts - centered at bottom like reference image
export const RevendaLogoBar = () => {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
      style={{
        paddingBottom: '40px',
      }}
    >
      <img 
        src={logoVdhRevendaWhiteAlpha}
        alt="VDH Revenda+"
        style={{
          width: '180px',
          height: 'auto',
        }}
      />
    </div>
  );
};

// Story logo bar - vertical format, centered at bottom
export const RevendaLogoBarStory = () => {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
      style={{
        paddingBottom: '60px',
      }}
    >
      <img 
        src={logoVdhRevendaWhiteAlpha}
        alt="VDH Revenda+"
        style={{
          width: '220px',
          height: 'auto',
        }}
      />
    </div>
  );
};
