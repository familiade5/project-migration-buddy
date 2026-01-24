import { RevendaPropertyData } from '@/types/revenda';
import { RevendaWatermark } from '../RevendaLogo';
import { Sun, Mountain, LayoutDashboard, Sparkles, Check, Shield, TrendingDown, Clock, Home, Wallet } from 'lucide-react';

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
    if (features.length < 8) {
      data.features.slice(0, 8 - features.length).forEach(f => {
        features.push({ icon: Check, text: f });
      });
    }
    
    // Default 8 features for conversion
    if (features.length === 0) {
      features.push(
        { icon: Sparkles, text: 'Pronto para morar' },
        { icon: Sun, text: 'Ambientes arejados' },
        { icon: LayoutDashboard, text: 'Ótima distribuição' },
        { icon: TrendingDown, text: 'Preço abaixo do mercado' },
        { icon: Shield, text: 'Processo seguro e transparente' },
        { icon: Wallet, text: 'Excelente custo-benefício' },
        { icon: Clock, text: 'Oportunidade única' },
        { icon: Home, text: 'Ideal para família' },
      );
    }
    
    // If we have some but less than 8, add defaults
    const defaultExtras = [
      { icon: TrendingDown, text: 'Preço abaixo do mercado' },
      { icon: Shield, text: 'Processo seguro e transparente' },
      { icon: Wallet, text: 'Excelente custo-benefício' },
      { icon: Clock, text: 'Oportunidade única' },
      { icon: Home, text: 'Ideal para família' },
    ];
    
    let extraIndex = 0;
    while (features.length < 8 && extraIndex < defaultExtras.length) {
      const existing = features.find(f => f.text === defaultExtras[extraIndex].text);
      if (!existing) {
        features.push(defaultExtras[extraIndex]);
      }
      extraIndex++;
    }
    
    return features.slice(0, 8);
  };

  const features = getFeatures();

  return (
    <div 
      className="relative w-[1080px] h-[1080px] overflow-hidden"
      style={{ backgroundColor: '#0f172a' }}
    >
      {/* Photo on left - 55% */}
      <div className="absolute top-0 left-0 w-[55%] h-full relative">
        {photo ? (
          <img 
            src={photo} 
            alt="Property"
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: '#1e293b' }}
          >
            <span className="text-slate-500">Foto</span>
          </div>
        )}
        
        {/* Logo on the photo */}
        <RevendaWatermark position="top-right" size="sm" />
      </div>

      {/* Content on right - 45% */}
      <div 
        className="absolute top-0 right-0 w-[45%] h-full flex flex-col justify-center px-12"
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
          className="font-display font-bold leading-tight mb-10"
          style={{ fontSize: '36px', color: '#ffffff' }}
        >
          Conforto e qualidade em cada detalhe
        </h2>

        {/* Features list - 8 items, more compact */}
        <div className="space-y-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-center gap-4">
                <div 
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(14,165,233,0.2), rgba(14,165,233,0.1))',
                    border: '1px solid rgba(14,165,233,0.3)',
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: '#0ea5e9' }} />
                </div>
                <span 
                  className="text-lg font-light"
                  style={{ color: 'rgba(255,255,255,0.9)' }}
                >
                  {feature.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
