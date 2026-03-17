import { PropertyData } from '@/types/property';
import { Check } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface PostDetailsProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

const GOLD = '#D4AF37';

export const PostDetails = ({ data, photo, photos = [] }: PostDetailsProps) => {
  const getPhoto = (index: number): string | null => {
    if (photos.length > index) return photos[index];
    if (photos.length > 0) return photos[0];
    return photo;
  };

  // SLIDE 3 - Foco: DIFERENCIAIS (Gatilhos de conversão)
  const generateFeatures = () => {
    if (data.customSlide3Texts && data.customSlide3Texts.some(t => t && t.trim() !== '')) {
      const customTexts = data.customSlide3Texts.filter(t => t && t.trim() !== '');
      if (customTexts.length >= 3) return customTexts.slice(0, 3);
      const autoTexts = generateAutoTexts();
      return [...customTexts, ...autoTexts].slice(0, 3);
    }
    return generateAutoTexts();
  };

  const generateAutoTexts = () => [
    'Preço abaixo do mercado',
    'Processo simples e seguro',
    'Excelente custo-benefício',
  ];

  const displayFeatures = generateFeatures();
  const p0 = getPhoto(1); // foto 2 (índice 1)
  const p1 = getPhoto(2); // foto 3 (índice 2)

  return (
    <div className="post-template relative overflow-hidden" style={{ background: '#0d1117' }}>
      <div className="absolute inset-0 flex">

        {/* === COLUNA ESQUERDA: painel de texto === */}
        <div
          className="w-[50%] h-full flex flex-col justify-center"
          style={{ padding: '80px 50px 80px 60px', background: '#161b27' }}
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

        {/* === COLUNA DIREITA: 2 fotos empilhadas === */}
        <div className="w-[50%] h-full flex flex-col" style={{ padding: '24px 24px 24px 12px', gap: '12px' }}>
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
              <div className="absolute inset-0" style={{ background: '#151f30' }} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
