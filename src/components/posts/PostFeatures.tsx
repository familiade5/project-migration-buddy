import { PropertyData } from '@/types/property';
import { Check } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface PostFeaturesProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

const GOLD = '#D4AF37';

export const PostFeatures = ({ data, photo, photos = [] }: PostFeaturesProps) => {
  const getPhoto = (index: number): string | null => {
    if (photos.length > index) return photos[index];
    if (photos.length > 0) return photos[0];
    return photo;
  };

  // SLIDE 2 - Foco: DETALHES DO IMÓVEL
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

  const displayFeatures = getHighlightFeatures();
  const p0 = getPhoto(0);
  const p1 = getPhoto(1);

  return (
    <div className="post-template relative overflow-hidden" style={{ background: '#0d1117' }}>
      <div className="absolute inset-0 flex">

        {/* === COLUNA ESQUERDA: 2 fotos empilhadas === */}
        <div className="w-[50%] h-full flex flex-col" style={{ padding: '24px 12px 24px 24px', gap: '12px' }}>
          {/* Foto superior */}
          <div
            className="flex-1 relative overflow-hidden"
            style={{
              borderRadius: '16px',
              border: `2px solid ${GOLD}`,
              boxShadow: `0 0 20px rgba(212,175,55,0.2)`,
            }}
          >
            {p0 ? (
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p0})` }} />
            ) : (
              <div className="absolute inset-0" style={{ background: '#1a2535' }} />
            )}
          </div>

          {/* Foto inferior */}
          <div
            className="flex-1 relative overflow-hidden"
            style={{
              borderRadius: '16px',
              border: `2px solid ${GOLD}`,
              boxShadow: `0 0 20px rgba(212,175,55,0.2)`,
            }}
          >
            {p1 ? (
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p1})` }} />
            ) : (
              <div className="absolute inset-0" style={{ background: '#1e2c42' }} />
            )}
          </div>
        </div>

        {/* === COLUNA DIREITA: painel de texto === */}
        <div
          className="w-[50%] h-full flex flex-col justify-center"
          style={{ padding: '80px 60px 80px 50px', background: '#161b27' }}
        >
          {/* Linha dourada decorativa */}
          <div style={{ width: '60px', height: '3px', background: GOLD, marginBottom: '40px', borderRadius: '2px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '52px' }}>
            {displayFeatures.map((feature, index) => (
              <div key={index} className="flex items-start" style={{ gap: '32px' }}>
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${GOLD}, #f5d485)`,
                    boxShadow: `0 4px 20px rgba(212,175,55,0.3)`,
                    marginTop: '4px',
                  }}
                >
                  <Check style={{ width: '44px', height: '44px', color: '#0d1117' }} />
                </div>
                <span style={{ fontSize: '48px', color: '#ffffff', fontWeight: 600, lineHeight: 1.2 }}>
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Logo VDH */}
          <div style={{ marginTop: 'auto', paddingTop: '60px' }}>
            <div style={{ border: `1.5px solid ${GOLD}55`, borderRadius: '10px', padding: '6px 16px', display: 'inline-block' }}>
              <img src={logoVDH} alt="VDH" style={{ height: '52px', objectFit: 'contain', borderRadius: '6px', display: 'block' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
