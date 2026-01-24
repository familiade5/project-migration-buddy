import { Gem } from 'lucide-react';

interface RevendaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  variant?: 'full' | 'icon' | 'minimal';
  className?: string;
  dark?: boolean;
}

const sizeConfig = {
  sm: { icon: 20, text: '16px', subtitle: '9px', gap: 8 },
  md: { icon: 28, text: '22px', subtitle: '11px', gap: 10 },
  lg: { icon: 36, text: '28px', subtitle: '13px', gap: 12 },
  xl: { icon: 48, text: '36px', subtitle: '16px', gap: 14 },
  xxl: { icon: 64, text: '48px', subtitle: '20px', gap: 18 },
};

export const RevendaLogo = ({ 
  size = 'md', 
  variant = 'full', 
  className = '',
  dark = false
}: RevendaLogoProps) => {
  const config = sizeConfig[size];
  
  // Colors based on theme
  const primaryColor = dark ? '#ffffff' : '#0f172a';
  const accentColor = '#0ea5e9'; // Sky blue - elegant and modern
  
  if (variant === 'icon') {
    return (
      <div 
        className={`flex items-center justify-center rounded-xl ${className}`}
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
        <div 
          className="flex items-center justify-center rounded-lg"
          style={{
            width: config.icon * 1.3,
            height: config.icon * 1.3,
            background: `linear-gradient(135deg, ${accentColor}, #0284c7)`,
          }}
        >
          <Gem 
            style={{ 
              width: config.icon * 0.7, 
              height: config.icon * 0.7,
              color: '#ffffff',
            }} 
          />
        </div>
        <span 
          className="font-display font-bold tracking-wide"
          style={{ 
            fontSize: config.text,
            color: primaryColor,
          }}
        >
          VDH Premium
        </span>
      </div>
    );
  }
  
  // Full variant
  return (
    <div className={`flex items-center ${className}`} style={{ gap: config.gap }}>
      <div 
        className="flex items-center justify-center rounded-xl"
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

// Logo bar for bottom of posts - LARGER and more prominent
export const RevendaLogoBar = ({ dark = false }: { dark?: boolean }) => {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-10 py-6"
      style={{
        background: dark 
          ? 'linear-gradient(to top, rgba(15,23,42,0.98), rgba(15,23,42,0.8))'
          : 'linear-gradient(to top, rgba(255,255,255,0.98), rgba(255,255,255,0.9))',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid rgba(14,165,233,0.15)',
      }}
    >
      <RevendaLogo size="lg" variant="minimal" dark={dark} />
      <div 
        className="text-sm font-medium tracking-wide uppercase"
        style={{ color: dark ? '#94a3b8' : '#64748b' }}
      >
        Mercado Premium
      </div>
    </div>
  );
};

// Story logo bar - vertical format
export const RevendaLogoBarStory = ({ dark = false }: { dark?: boolean }) => {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 flex items-center justify-center px-8 py-8"
      style={{
        background: dark 
          ? 'linear-gradient(to top, rgba(15,23,42,0.98), rgba(15,23,42,0.7), transparent)'
          : 'linear-gradient(to top, rgba(255,255,255,0.98), rgba(255,255,255,0.85), transparent)',
      }}
    >
      <RevendaLogo size="xl" variant="minimal" dark={dark} />
    </div>
  );
};
