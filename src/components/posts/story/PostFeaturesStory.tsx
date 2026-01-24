import { PropertyData } from '@/types/property';
import { Check } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface PostFeaturesStoryProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostFeaturesStory = ({ data, photo }: PostFeaturesStoryProps) => {
  // SLIDE 2 STORY - Foco: BENEFÍCIOS E CONDIÇÕES
  const getHighlightFeatures = () => {
    // Se tem textos personalizados, usa eles
    if (data.customSlide2Texts && data.customSlide2Texts.some(t => t && t.trim() !== '')) {
      const customTexts = data.customSlide2Texts.filter(t => t && t.trim() !== '');
      if (customTexts.length >= 3) return customTexts.slice(0, 3);
      const autoTexts = generateAutoTexts();
      return [...customTexts, ...autoTexts].slice(0, 3);
    }
    return generateAutoTexts();
  };

  const generateAutoTexts = () => {
    const features: string[] = [];
    
    // Características do imóvel (dados concretos)
    if (data.bedrooms && data.bedrooms !== '' && data.bedrooms !== '0') {
      const bedroomNum = Number(data.bedrooms);
      if (bedroomNum >= 4) {
        features.push(`${bedroomNum} dormitórios privativos`);
      } else if (bedroomNum >= 2) {
        features.push(`${bedroomNum} quartos bem distribuídos`);
      } else {
        features.push('Quarto amplo e iluminado');
      }
    }
    
    if (data.bathrooms && data.bathrooms !== '' && data.bathrooms !== '0') {
      const bathroomNum = Number(data.bathrooms);
      if (bathroomNum >= 3) {
        features.push(`${bathroomNum} banheiros completos`);
      } else if (bathroomNum === 2) {
        features.push('Banheiro social + suíte');
      } else {
        features.push('Banheiro com acabamento');
      }
    }
    
    if (data.garageSpaces && data.garageSpaces !== '' && data.garageSpaces !== '0') {
      const garageNum = Number(data.garageSpaces);
      if (garageNum >= 2) {
        features.push(`Garagem para ${garageNum} veículos`);
      } else {
        features.push('Vaga de garagem coberta');
      }
    }
    
    if (features.length < 3 && data.area && data.area !== '' && data.area !== '0') {
      features.push(`${data.area}m² de área construída`);
    }
    
    // Features do usuário
    data.features.forEach(f => {
      if (features.length < 3) features.push(f);
    });
    
    // Fallback: características genéricas
    const propertyFeatures = [
      'Infraestrutura completa',
      'Região em valorização',
      'Pronto para morar',
    ];
    
    let featureIndex = 0;
    while (features.length < 3 && featureIndex < propertyFeatures.length) {
      features.push(propertyFeatures[featureIndex]);
      featureIndex++;
    }
    
    return features.slice(0, 3);
  };

  const highlightFeatures = getHighlightFeatures();

  return (
    <div className="post-template-story bg-[#1a1f2e] relative overflow-hidden">
      {/* Foto no topo - 55% da altura */}
      <div className="absolute top-0 left-0 right-0 h-[55%]">
        {photo ? (
          <div
            className="absolute inset-0 bg-cover bg-center brightness-110"
            style={{ backgroundImage: `url(${photo})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a3142] to-[#1a1f2e]" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white/15 font-bold tracking-wider" style={{ fontSize: '180px' }}>VDH</p>
        </div>
      </div>

      {/* Painel de diferenciais na parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-[#2a3142] flex flex-col justify-center" style={{ padding: '60px' }}>
        {/* Marca d'água VDH sutil */}
        <div className="absolute opacity-5" style={{ top: '40px', right: '40px' }}>
          <p className="font-bold tracking-wider text-white" style={{ fontSize: '120px' }}>VDH</p>
        </div>
        
        <div className="relative z-10" style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
          {highlightFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-start"
              style={{ gap: '40px' }}
            >
              <div className="rounded bg-[#d4a44c] flex items-center justify-center flex-shrink-0" style={{ width: '80px', height: '80px', marginTop: '4px' }}>
                <Check className="text-[#1a1f2e]" style={{ width: '50px', height: '50px' }} />
              </div>
              <span className="text-white font-semibold leading-tight" style={{ fontSize: '48px' }}>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logo VDH */}
      <div className="absolute z-10" style={{ bottom: '40px', right: '40px' }}>
        <img src={logoVDH} alt="VDH" className="rounded" style={{ height: '100px' }} />
      </div>
    </div>
  );
};
