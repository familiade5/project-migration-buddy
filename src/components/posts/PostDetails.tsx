import { PropertyData } from '@/types/property';
import { Check } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface PostDetailsProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostDetails = ({ data, photo, photos = [] }: PostDetailsProps) => {
  // Usar fotos alternadas: foto principal, ou fallback para as disponíveis
  const getPhoto = (index: number) => {
    if (photos.length > 0) {
      return photos[index % photos.length] || photo;
    }
    return photo;
  };
  // SLIDE 3 - Foco: CARACTERÍSTICAS DO IMÓVEL (Gatilhos: Especificidade, Tangibilidade)
  const generateFeatures = () => {
    // Se tem textos personalizados, usa eles
    if (data.customSlide3Texts && data.customSlide3Texts.some(t => t && t.trim() !== '')) {
      const customTexts = data.customSlide3Texts.filter(t => t && t.trim() !== '');
      if (customTexts.length >= 3) return customTexts.slice(0, 3);
      // Preenche o resto com automáticos
      const autoTexts = generateAutoTexts();
      return [...customTexts, ...autoTexts].slice(0, 3);
    }
    return generateAutoTexts();
  };

  const generateAutoTexts = () => {
    const features: string[] = [];
    
    // Formato: dados concretos que geram confiança
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
    
    // Features do usuário (já são específicas)
    data.features.forEach(f => {
      if (features.length < 3) features.push(f);
    });
    
    // Fallback: Diferenciais universais (não repetir os do slide 2)
    const tangibleBenefits = [
      'Preço abaixo do mercado',
      'Processo simples e seguro',
      'Excelente custo-benefício',
    ];
    
    let benefitIndex = 0;
    while (features.length < 3 && benefitIndex < tangibleBenefits.length) {
      features.push(tangibleBenefits[benefitIndex]);
      benefitIndex++;
    }
    
    return features.slice(0, 3);
  };

  const displayFeatures = generateFeatures();

  return (
    <div className="post-template bg-[#1a1f2e] relative overflow-hidden">
      {/* Layout dividido - Fotos à esquerda em triângulo, conteúdo à direita */}
      <div className="absolute inset-0 flex">
        {/* Grid de 3 fotos em triângulo à esquerda */}
        <div className="w-[55%] h-full flex flex-col" style={{ padding: '24px', gap: '24px' }}>
          {/* Foto grande no topo - usa primeira foto disponível */}
          <div className="flex-1 relative overflow-hidden rounded-lg">
            {getPhoto(0) ? (
              <div
                className="absolute inset-0 bg-cover bg-center brightness-110"
                style={{ backgroundImage: `url(${getPhoto(0)})` }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#2a3142] to-[#1a1f2e]" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white/15 font-bold tracking-wider" style={{ fontSize: '100px' }}>VDH</p>
            </div>
          </div>
          
          {/* Duas fotos menores embaixo - usa fotos alternadas */}
          <div className="flex h-[40%]" style={{ gap: '24px' }}>
            {[1, 2].map((photoIndex) => (
              <div key={photoIndex} className="flex-1 relative overflow-hidden rounded-lg">
                {getPhoto(photoIndex) ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center brightness-110"
                    style={{ backgroundImage: `url(${getPhoto(photoIndex)})` }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2a3142] to-[#1a1f2e]" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white/15 font-bold tracking-wider" style={{ fontSize: '60px' }}>VDH</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Painel de características à direita */}
        <div className="w-[45%] h-full flex flex-col justify-center bg-[#2a3142]" style={{ padding: '60px' }}>
          {displayFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-center border-b border-white/10 last:border-b-0"
              style={{ gap: '32px', padding: '48px 0' }}
            >
              <div className="rounded bg-[#d4a44c] flex items-center justify-center flex-shrink-0" style={{ width: '72px', height: '72px' }}>
                <Check className="text-[#1a1f2e]" style={{ width: '44px', height: '44px' }} />
              </div>
              <span className="text-white font-medium" style={{ fontSize: '44px' }}>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logo VDH no canto inferior direito */}
      <div className="absolute z-10" style={{ bottom: '40px', right: '40px' }}>
        <img src={logoVDH} alt="VDH" className="rounded" style={{ height: '100px' }} />
      </div>
    </div>
  );
};
