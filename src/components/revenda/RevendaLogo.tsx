import { Gem } from 'lucide-react';

interface RevendaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'minimal';
  className?: string;
  dark?: boolean;
}

const sizeConfig = {
  sm: { icon: 16, text: '14px', subtitle: '8px', gap: 6 },
  md: { icon: 20, text: '18px', subtitle: '10px', gap: 8 },
  lg: { icon: 28, text: '24px', subtitle: '12px', gap: 10 },
  xl: { icon: 36, text: '32px', subtitle: '14px', gap: 12 },
};

export const RevendaLogo = ({ 
  size = 'md', 
  variant = 'full', 
  className = '',
  dark = false
}: RevendaLogoProps) => {
  const config = sizeConfig[size];
  
  // Colors based on theme
  const primaryColor = dark ? '#1a1a1a' : '#0f172a';
  const accentColor = '#0ea5e9'; // Sky blue - elegant and modern
  
  if (variant === 'icon') {
    return (
      <div 
        className={`flex items-center justify-center rounded-full ${className}`}
        style={{
          width: config.icon * 2,
          height: config.icon * 2,
          background: `linear-gradient(135deg, ${accentColor}, #0284c7)`,
        }}
      >
        <Gem 
          style={{ 
            width: config.icon, 
            height: config.icon,
            color: '#ffffff',
          }} 
        />
      </div>
    );
  }
  
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center ${className}`} style={{ gap: config.gap }}>
        <Gem 
          style={{ 
            width: config.icon, 
            height: config.icon,
            color: accentColor,
          }} 
        />
        <span 
          className="font-display font-bold tracking-wide"
          style={{ 
            fontSize: config.text,
            color: primaryColor,
          }}
        >
          VDH
        </span>
      </div>
    );
  }
  
  // Full variant
  return (
    <div className={`flex items-center ${className}`} style={{ gap: config.gap }}>
      <div 
        className="flex items-center justify-center rounded-lg"
        style={{
          width: config.icon * 1.5,
          height: config.icon * 1.5,
          background: `linear-gradient(135deg, ${accentColor}, #0284c7)`,
        }}
      >
        <Gem 
          style={{ 
            width: config.icon * 0.8, 
            height: config.icon * 0.8,
            color: '#ffffff',
          }} 
        />
      </div>
      <div className="flex flex-col">
        <span 
          className="font-display font-bold tracking-wide leading-tight"
          style={{ 
            fontSize: config.text,
            color: primaryColor,
          }}
        >
          VDH Premium
        </span>
        <span 
          className="font-medium tracking-widest uppercase"
          style={{ 
            fontSize: config.subtitle,
            color: accentColor,
          }}
        >
          Revenda
        </span>
      </div>
    </div>
  );
};

// Watermark component for posts
export const RevendaWatermark = ({ opacity = 0.03 }: { opacity?: number }) => {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
      style={{ opacity }}
    >
      <Gem 
        className="text-slate-900"
        style={{ 
          width: '70%', 
          height: '70%',
        }} 
      />
    </div>
  );
};

// Logo bar for bottom of posts
export const RevendaLogoBar = () => {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-8 py-5"
      style={{
        background: 'linear-gradient(to top, rgba(255,255,255,0.98), rgba(255,255,255,0.9))',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid rgba(14,165,233,0.1)',
      }}
    >
      <RevendaLogo size="md" variant="minimal" />
      <div 
        className="text-xs font-medium tracking-wide uppercase"
        style={{ color: '#64748b' }}
      >
        Mercado Premium
      </div>
    </div>
  );
};
