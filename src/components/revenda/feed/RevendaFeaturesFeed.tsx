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
      features.push({ icon: Sun, text: 'Excelente iluminação natural' });
    }
    if (data.hasVaranda) {
      features.push({ icon: LayoutDashboard, text: 'Varanda espaçosa' });
    }
    if (data.hasVista) {
      features.push({ icon: Mountain, text: 'Vista privilegiada' });
    }
    if (data.hasGoodLayout) {
      features.push({ icon: Sparkles, text: 'Ambientes bem distribuídos' });
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
      className="relative w-[1080px] h-[1080px] overflow-hidden flex"
      style={{ backgroundColor: '#ffffff' }}
    >
      {/* Left side - Photo */}
      <div className="w-1/2 h-full">
        {photo ? (
          <img 
            src={photo} 
            alt="Property"
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: '#f1f5f9' }}
          >
            <span className="text-slate-400">Foto</span>
          </div>
        )}
      </div>

      {/* Right side - Features */}
      <div className="w-1/2 h-full flex flex-col justify-center px-12" style={{ backgroundColor: '#fafafa' }}>
        <div className="space-y-2 mb-8">
          <p 
            className="text-sm font-medium uppercase tracking-widest"
            style={{ color: '#0ea5e9' }}
          >
            Diferenciais
          </p>
          <h2 
            className="font-display font-bold leading-tight"
            style={{ fontSize: '36px', color: '#0f172a' }}
          >
            Um imóvel que combina conforto e qualidade
          </h2>
        </div>

        {/* Features list */}
        <div className="space-y-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#e0f2fe' }}
                >
                  <Icon className="w-6 h-6" style={{ color: '#0ea5e9' }} />
                </div>
                <span 
                  className="text-lg font-medium"
                  style={{ color: '#334155' }}
                >
                  {feature.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Logo */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: '#e2e8f0' }}>
          <RevendaLogo size="md" variant="minimal" />
        </div>
      </div>
    </div>
  );
};
