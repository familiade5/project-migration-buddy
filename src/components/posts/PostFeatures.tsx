import { PropertyData } from '@/types/property';
import { Check } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface PostFeaturesProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostFeatures = ({ data, photo, photos = [] }: PostFeaturesProps) => {
  // Usar fotos alternadas: foto principal, ou fallback para as disponíveis
  const getPhoto = (index: number) => {
    if (photos.length > 0) {
      return photos[index % photos.length] || photo;
    }
    return photo;
  };

  // SLIDE 2 - Foco: DETALHES DO IMÓVEL (Quartos, Garagem, Banheiros)
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
    // Slide 2 (Detalhes) - ORDEM FIXA:
    // 1) Quartos
    // 2) Garagem
    // 3) Banheiros (se for 1 banheiro, troca por Área construída)

    const bedroomsNum = Number(data.bedrooms || 0);
    const garageNum = Number(data.garageSpaces || 0);
    const bathroomsNum = Number(data.bathrooms || 0);
    const areaValue = (data.area || '').trim();

    const bedroomsText = bedroomsNum > 0
      ? `${bedroomsNum} quarto${bedroomsNum === 1 ? '' : 's'}`
      : 'Quartos';

    const garageText = garageNum > 0
      ? `Garagem: ${garageNum} vaga${garageNum === 1 ? '' : 's'}`
      : 'Garagem';

    const thirdLineText = bathroomsNum === 1
      ? (areaValue && areaValue !== '0' ? `${areaValue}m² de área construída` : 'Área construída')
      : (bathroomsNum > 0
        ? `${bathroomsNum} banheiro${bathroomsNum === 1 ? '' : 's'}`
        : 'Banheiros');

    return [bedroomsText, garageText, thirdLineText];
  };

  const highlightFeatures = getHighlightFeatures();

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
          {highlightFeatures.map((feature, index) => (
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
