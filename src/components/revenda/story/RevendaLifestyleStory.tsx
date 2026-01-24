import { RevendaPropertyData } from '@/types/revenda';
import { RevendaLogo } from '../RevendaLogo';
import { Bed, Bath, Maximize, Sun, LayoutDashboard, Mountain, Sparkles } from 'lucide-react';

interface RevendaLifestyleStoryProps {
  data: RevendaPropertyData;
  photo: string | null;
}

export const RevendaLifestyleStory = ({ data, photo }: RevendaLifestyleStoryProps) => {
  // Build lifestyle highlights
  const getHighlights = () => {
    const highlights: string[] = [];
    
    if (data.hasNaturalLight) highlights.push('Iluminação natural');
    if (data.hasVaranda) highlights.push('Varanda');
    if (data.hasVista) highlights.push('Vista privilegiada');
    if (data.hasGoodLayout) highlights.push('Espaços bem distribuídos');
    
    // Add from features if needed
    data.features.slice(0, 3).forEach(f => {
      if (!highlights.includes(f) && highlights.length < 4) {
        highlights.push(f);
      }
    });
    
    // Fallback
    if (highlights.length === 0) {
      highlights.push('Pronto para morar', 'Excelente localização');
    }
    
    return highlights.slice(0, 3);
  };

  const highlights = getHighlights();

  return (
    <div 
      className="relative w-[1080px] h-[1920px] overflow-hidden"
      style={{ backgroundColor: '#ffffff' }}
    >
      {/* Photo - Top 60% */}
      <div className="absolute top-0 left-0 right-0 h-[60%]">
        {photo ? (
          <img 
            src={photo} 
            alt="Interior"
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full"
            style={{ backgroundColor: '#f1f5f9' }}
          />
        )}
        
        {/* Bottom fade */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{
            background: 'linear-gradient(to top, rgba(255,255,255,1), transparent)',
          }}
        />
      </div>

      {/* Content Area - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%] px-12 py-16 flex flex-col justify-between">
        {/* Main text */}
        <div className="text-center">
          <p 
            className="text-lg font-medium uppercase tracking-[0.3em] mb-6"
            style={{ color: '#0ea5e9' }}
          >
            Lifestyle
          </p>
          <h2 
            className="font-display font-bold leading-tight mb-8"
            style={{ fontSize: '52px', color: '#0f172a' }}
          >
            Viver com conforto<br />e qualidade
          </h2>
        </div>

        {/* Highlights */}
        <div className="space-y-6">
          {highlights.map((highlight, index) => (
            <div 
              key={index}
              className="flex items-center justify-center gap-4"
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: '#0ea5e9' }}
              />
              <span 
                className="text-2xl font-light"
                style={{ color: '#334155' }}
              >
                {highlight}
              </span>
            </div>
          ))}
        </div>

        {/* Specs row */}
        {(data.bedrooms || data.area) && (
          <div className="flex items-center justify-center gap-10 pt-10 border-t mt-8" style={{ borderColor: '#e2e8f0' }}>
            {data.bedrooms && (
              <div className="flex items-center gap-3">
                <Bed className="w-7 h-7" style={{ color: '#0ea5e9' }} />
                <span className="text-xl" style={{ color: '#64748b' }}>
                  {data.bedrooms} quartos
                </span>
              </div>
            )}
            {data.area && (
              <div className="flex items-center gap-3">
                <Maximize className="w-7 h-7" style={{ color: '#0ea5e9' }} />
                <span className="text-xl" style={{ color: '#64748b' }}>
                  {data.area} m²
                </span>
              </div>
            )}
          </div>
        )}

        {/* Logo */}
        <div className="flex justify-center pt-8">
          <RevendaLogo size="lg" variant="minimal" />
        </div>
      </div>
    </div>
  );
};
