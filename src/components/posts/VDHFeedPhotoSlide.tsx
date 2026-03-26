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

export const VDHFeedPhotoSlide = ({ data, photo, photos = [], slideIndex = 0 }: VDHFeedPhotoSlideProps) => {
  const getPhoto = (index: number): string | null => {
    if (photos.length > index) return photos[index];
    if (photos.length > 0) return photos[0];
    return photo;
  };

  // Each extra slide shows 2 photos based on slideIndex
  // slideIndex here is 0-based for extra slides, but photoIndex offset is handled by parent
  // We use the main photo and the next one
  const p0 = getPhoto(slideIndex + 3);
  const p1 = getPhoto(slideIndex + 4);

  // Alternate layout: even slides = photos left, odd = photos right (like slides 2/3)
  const isReversed = slideIndex % 2 === 1;

  const photosColumn = (
    <div className="w-[50%] h-full flex flex-col" style={{ padding: isReversed ? '24px 24px 24px 12px' : '24px 12px 24px 24px', gap: '12px' }}>
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
  );

  const location = [data.neighborhood, data.city, data.state].filter(Boolean).join(' · ');
  const bedroomsNum = Number(data.bedrooms || 0);
  const areaValue = (data.area || data.areaPrivativa || data.areaTotal || '').trim();
  const garageNum = Number(data.garageSpaces || 0);

  const infoColumn = (
    <div
      className="w-[50%] h-full flex flex-col justify-center"
      style={{ padding: isReversed ? '80px 50px 80px 60px' : '80px 60px 80px 50px', background: '#161b27' }}
    >
      <div style={{ width: '60px', height: '3px', background: GOLD, marginBottom: '40px', borderRadius: '2px' }} />

      <p style={{ fontSize: '42px', color: '#ffffff', fontWeight: 800, lineHeight: 1.2, marginBottom: '12px' }}>
        {data.propertyName || data.type || 'Imóvel'}
      </p>
      <p style={{ fontSize: '24px', color: 'rgba(255,255,255,0.6)', marginBottom: '40px' }}>
        {location || 'Localização privilegiada'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {bedroomsNum > 0 && (
          <span style={{ color: '#fff', fontSize: '32px', fontWeight: 600 }}>🛏 {bedroomsNum} quarto{bedroomsNum > 1 ? 's' : ''}</span>
        )}
        {garageNum > 0 && (
          <span style={{ color: '#fff', fontSize: '32px', fontWeight: 600 }}>🚗 {garageNum} vaga{garageNum > 1 ? 's' : ''}</span>
        )}
        {areaValue && areaValue !== '0' && (
          <span style={{ color: '#fff', fontSize: '32px', fontWeight: 600 }}>📐 {areaValue}m²</span>
        )}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '60px' }}>
        <div style={{ border: `1.5px solid ${GOLD}55`, borderRadius: '10px', padding: '6px 16px', display: 'inline-block' }}>
          <img src={logoVDH} alt="VDH" style={{ height: '52px', objectFit: 'contain', borderRadius: '6px', display: 'block' }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="post-template relative overflow-hidden" style={{ background: '#0d1117' }}>
      <div className="absolute inset-0 flex">
        {isReversed ? (
          <>
            {infoColumn}
            {photosColumn}
          </>
        ) : (
          <>
            {photosColumn}
            {infoColumn}
          </>
        )}
      </div>
    </div>
  );
};
