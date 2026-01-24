import { PropertyData } from '@/types/property';
import { Check } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface PostFeaturesProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostFeatures = ({ data, photo }: PostFeaturesProps) => {
  // SLIDE 2 - Foco: BENEFÍCIOS E CONDIÇÕES (Gatilhos: Facilidade, Oportunidade)
  const getHighlightFeatures = () => {
    // Se tem textos personalizados, usa eles
    if (data.customSlide2Texts && data.customSlide2Texts.some(t => t && t.trim() !== '')) {
      const customTexts = data.customSlide2Texts.filter(t => t && t.trim() !== '');
      if (customTexts.length >= 3) return customTexts.slice(0, 3);
      // Preenche o resto com automáticos
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
    <div className="post-template bg-[#1a1f2e] relative overflow-hidden">
      {/* Layout dividido - Texto à esquerda, foto à direita */}
      <div className="absolute inset-0 flex">
        {/* Painel de texto à esquerda */}
        <div className="w-[50%] h-full flex flex-col justify-center bg-[#2a3142]" style={{ padding: '80px' }}>
          {/* Marca d'água VDH sutil no fundo */}
          <div className="absolute opacity-5" style={{ top: '25%', left: '80px' }}>
            <p className="font-bold tracking-wider text-white" style={{ fontSize: '160px' }}>VDH</p>
          </div>
          
          <div className="relative z-10" style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
            {highlightFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-start"
                style={{ gap: '40px' }}
              >
                <div className="rounded bg-[#d4a44c] flex items-center justify-center flex-shrink-0" style={{ width: '80px', height: '80px', marginTop: '4px' }}>
                  <Check className="text-[#1a1f2e]" style={{ width: '50px', height: '50px' }} />
                </div>
                <span className="text-white font-semibold leading-tight" style={{ fontSize: '52px' }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Foto à direita */}
        <div className="w-[50%] h-full relative">
          {photo ? (
            <div
              className="absolute inset-0 bg-cover bg-center brightness-110"
              style={{ backgroundImage: `url(${photo})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2a3142] to-[#1a1f2e]" />
          )}
          {/* Marca d'água VDH sutil */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/15 font-bold tracking-wider" style={{ fontSize: '140px' }}>VDH</p>
          </div>
        </div>
      </div>

      {/* Logo VDH no canto inferior direito */}
      <div className="absolute z-10" style={{ bottom: '40px', right: '40px' }}>
        <img src={logoVDH} alt="VDH" className="rounded" style={{ height: '100px' }} />
      </div>
    </div>
  );
};
