import { PropertyData } from '@/types/property';
import logoVDH from '@/assets/logo-vdh.jpg';

interface VDHFeedPhotoSlideProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
  slideIndex?: number;
  totalSlides?: number;
}

const GOLD = '#D4AF37';
const DARK = '#101722';
const DARK_SOFT = '#1a2332';

export const VDHFeedPhotoSlide = ({ data, photo, slideIndex = 0, totalSlides = 10 }: VDHFeedPhotoSlideProps) => {
  const badges = ['Destaque', 'Ambiente', 'Detalhes', 'Oportunidade', 'Exclusivo', 'Visita'];
  const badge = badges[slideIndex % badges.length];
  const location = [data.neighborhood, data.city, data.state].filter(Boolean).join(' • ');
  const price = data.minimumValue?.trim() ? (data.minimumValue.includes('R$') ? data.minimumValue : `R$ ${data.minimumValue}`) : 'Consulte';

  return (
    <div className="post-template relative overflow-hidden" style={{ background: DARK }}>
      {photo ? (
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${photo})` }} />
      ) : (
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${DARK_SOFT} 100%)` }} />
      )}

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(6,10,18,0.15) 0%, rgba(6,10,18,0.35) 38%, rgba(6,10,18,0.88) 100%)',
        }}
      />

      <div className="absolute top-5 left-5 right-5 flex items-start justify-between z-10">
        <div
          style={{
            background: 'rgba(16,23,34,0.86)',
            border: `1px solid ${GOLD}`,
            color: '#fff',
            borderRadius: 999,
            padding: '10px 18px',
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {badge}
        </div>

        <img src={logoVDH} alt="VDH" style={{ height: 50, borderRadius: 8, objectFit: 'contain' }} />
      </div>

      <div className="absolute left-6 right-6 bottom-6 z-10">
        <div
          style={{
            background: 'rgba(12,18,28,0.84)',
            border: `1px solid ${GOLD}66`,
            borderRadius: 24,
            padding: '24px 24px 20px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 18px 50px rgba(0,0,0,0.24)',
          }}
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p style={{ color: '#fff', fontSize: 38, fontWeight: 800, lineHeight: 1.1, marginBottom: 8 }}>
                {data.propertyName || data.type || 'Imóvel'}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 20, marginBottom: 16 }}>
                {location || 'Localização privilegiada'}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                {data.bedrooms && data.bedrooms !== '0' ? (
                  <span style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}>🛏 {data.bedrooms} quartos</span>
                ) : null}
                {data.garageSpaces && data.garageSpaces !== '0' ? (
                  <span style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}>🚗 {data.garageSpaces} vagas</span>
                ) : null}
                {(data.area || data.areaPrivativa || data.areaTotal) ? (
                  <span style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}>
                    📐 {data.area || data.areaPrivativa || data.areaTotal}m²
                  </span>
                ) : null}
              </div>
            </div>

            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ color: GOLD, fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                Valor mínimo
              </p>
              <p style={{ color: '#fff', fontSize: 30, fontWeight: 900, lineHeight: 1 }}>{price}</p>
            </div>
          </div>

          <div style={{ marginTop: 16, height: 1, background: 'rgba(255,255,255,0.12)' }} />

          <div className="flex items-center justify-between" style={{ marginTop: 14 }}>
            <span style={{ color: 'rgba(255,255,255,0.72)', fontSize: 16, fontWeight: 600 }}>
              Venda Direta Hoje
            </span>
            <span style={{ color: GOLD, fontSize: 16, fontWeight: 800 }}>
              Slide {Math.min(slideIndex + 4, totalSlides)} de {totalSlides}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
