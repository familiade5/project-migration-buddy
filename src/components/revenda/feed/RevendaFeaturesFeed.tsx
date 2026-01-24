import { RevendaPropertyData } from '@/types/revenda';
import { RevendaLogo } from '../RevendaLogo';
import { Sun, Mountain, LayoutDashboard, Sparkles, Check } from 'lucide-react';

interface RevendaFeaturesFeedProps {
  data: RevendaPropertyData;
  photo: string | null;
}

export const RevendaFeaturesFeed = ({ data, photo }: RevendaFeaturesFeedProps) => {
  const getFeatures = () => {
    const features: { icon: typeof Sun; text: string }[] = [];
    
    if (data.hasNaturalLight) {
      features.push({ icon: Sun, text: 'Iluminação natural' });
    }
    if (data.hasVaranda) {
      features.push({ icon: LayoutDashboard, text: 'Varanda' });
    }
    if (data.hasVista) {
      features.push({ icon: Mountain, text: 'Vista privilegiada' });
    }
    if (data.hasGoodLayout) {
      features.push({ icon: Sparkles, text: 'Bem distribuído' });
    }
    
    // Add from features array if we need more
    if (features.length < 4) {
      data.features.slice(0, 4 - features.length).forEach(f => {
        features.push({ icon: Check, text: f });
      });
    }
    
    // Fallback defaults
    if (features.length === 0) {
      features.push(
        { icon: Sparkles, text: 'Pronto para morar' },
        { icon: Sun, text: 'Ambientes arejados' },
        { icon: LayoutDashboard, text: 'Ótima distribuição' },
      );
    }
    
    return features.slice(0, 4);
  };

  const features = getFeatures();

  return (
    <div 
      className="relative w-[1080px] h-[1080px] overflow-hidden"
      style={{ backgroundColor: '#0f172a' }}
    >
      {/* Photo on left - 55% */}
      <div className="absolute top-0 left-0 w-[55%] h-full">
        {photo ? (
          <img 
            src={photo} 
            alt="Property"
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            }}
          >
            <span className="text-slate-500">Foto</span>
          </div>
        )}
        
        {/* Right edge gradient */}
        <div 
          className="absolute top-0 right-0 bottom-0 w-32"
          style={{
            background: 'linear-gradient(to left, #0f172a, transparent)',
          }}
        />
      </div>

      {/* Content on right - 45% */}
      <div 
        className="absolute top-0 right-0 w-[45%] h-full flex flex-col justify-center px-14"
      >
        {/* Section label */}
        <p 
          className="text-sm font-medium uppercase tracking-[0.3em] mb-4"
          style={{ color: '#0ea5e9' }}
        >
          Diferenciais
        </p>
        
        {/* Headline */}
        <h2 
          className="font-display font-bold leading-tight mb-12"
          style={{ fontSize: '42px', color: '#ffffff' }}
        >
          Conforto e qualidade em cada detalhe
        </h2>

        {/* Features list - elegant, spacious */}
        <div className="space-y-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-center gap-5">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(14,165,233,0.2), rgba(14,165,233,0.1))',
                    border: '1px solid rgba(14,165,233,0.3)',
                  }}
                >
                  <Icon className="w-7 h-7" style={{ color: '#0ea5e9' }} />
                </div>
                <span 
                  className="text-xl font-light"
                  style={{ color: 'rgba(255,255,255,0.9)' }}
                >
                  {feature.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Logo at bottom */}
        <div className="mt-auto pt-12">
          <RevendaLogo size="md" dark />
        </div>
      </div>
    </div>
  );
};
