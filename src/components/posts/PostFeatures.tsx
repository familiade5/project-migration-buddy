import { PropertyData } from '@/types/property';
import { Check } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface PostFeaturesProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostFeatures = ({ data, photo, photos = [] }: PostFeaturesProps) => {
  const getPhoto = (index: number) => {
    if (photos.length > 0) return photos[index % photos.length] || photo;
    return photo;
  };

  // SLIDE 2 FEED - Foco: DETALHES DO IMÓVEL (mesmo conteúdo do Story slide 2)
  const getHighlightFeatures = () => {
    if (data.customSlide2Texts && data.customSlide2Texts.some(t => t && t.trim() !== '')) {
      const customTexts = data.customSlide2Texts.filter(t => t && t.trim() !== '');
      if (customTexts.length >= 3) return customTexts.slice(0, 3);
      const autoTexts = generateAutoTexts();
      return [...customTexts, ...autoTexts].slice(0, 3);
    }
    return generateAutoTexts();
  };

  const generateAutoTexts = () => {
    const bedroomsNum = Number(data.bedrooms || 0);
    const garageNum = Number(data.garageSpaces || 0);
    const bathroomsNum = Number(data.bathrooms || 0);
    const areaValue = (data.area || data.areaPrivativa || data.areaTotal || '').trim();

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

      {/* Foto grande no topo — 52% da altura */}
      <div className="absolute top-0 left-0 right-0" style={{ height: '52%' }}>
        {getPhoto(0) ? (
          <div
            className="absolute inset-0 bg-cover bg-center brightness-110"
            style={{ backgroundImage: `url(${getPhoto(0)})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a3142] to-[#1a1f2e]" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white/15 font-bold tracking-wider" style={{ fontSize: '200px' }}>VDH</p>
        </div>
      </div>

      {/* Duas fotos menores no meio — 20% da altura */}
      <div
        className="absolute left-0 right-0 flex"
        style={{ top: '52%', height: '20%', gap: '16px', padding: '0 16px' }}
      >
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
              <p className="text-white/15 font-bold tracking-wider" style={{ fontSize: '80px' }}>VDH</p>
            </div>
          </div>
        ))}
      </div>

      {/* Painel de características na parte inferior — 28% da altura */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-[#2a3142] flex flex-col justify-center"
        style={{ height: '28%', padding: '0 48px' }}
      >
        {highlightFeatures.map((feature, index) => (
          <div
            key={index}
            className="flex items-center border-b border-white/10 last:border-b-0"
            style={{ gap: '32px', padding: '20px 0' }}
          >
            <div
              className="rounded bg-[#d4a44c] flex items-center justify-center flex-shrink-0"
              style={{ width: '64px', height: '64px' }}
            >
              <Check className="text-[#1a1f2e]" style={{ width: '42px', height: '42px' }} />
            </div>
            <span className="text-white font-medium" style={{ fontSize: '46px' }}>{feature}</span>
          </div>
        ))}
      </div>

      {/* Logo VDH */}
      <div className="absolute z-10" style={{ bottom: '32px', right: '40px' }}>
        <img src={logoVDH} alt="VDH" className="rounded" style={{ height: '90px' }} />
      </div>
    </div>
  );
};
