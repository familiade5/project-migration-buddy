import { useId } from 'react';
import { PropertyData } from '@/types/property';
import logoVDH from '@/assets/logo-vdh-transparent.png';
import { useLogoBase64 } from '@/hooks/useLogoBase64';

interface VDHFeedPhotoSlideProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
  slideIndex?: number;
  totalSlides?: number;
}

const GRAY_BG = '#2a2a2a';

export const VDHFeedPhotoSlide = ({ data, photo, slideIndex = 0 }: VDHFeedPhotoSlideProps) => {
  const uid = useId();
  const clipId = `vdh-photo-${uid}`;
  const logoBase64 = useLogoBase64(logoVDH);

  // Build specs from property data (only show on first photo slide, slideIndex 0)
  const specs: string[] = slideIndex === 0 ? [
    data.bedrooms && data.bedrooms !== '0' ? `${data.bedrooms} quarto${Number(data.bedrooms) > 1 ? 's' : ''}` : '',
    data.bathrooms && data.bathrooms !== '0' ? `${data.bathrooms} banheiro${Number(data.bathrooms) > 1 ? 's' : ''}` : '',
    data.garageSpaces && data.garageSpaces !== '0' ? `${data.garageSpaces} vaga${Number(data.garageSpaces) > 1 ? 's' : ''}` : '',
    data.area ? `${data.area}m²` : '',
    ...(data.features || []),
  ].filter(Boolean).slice(0, 6) : [];

  // Notch matches card: top=10, left=10, w=308, h=132
  // Card bottom=142, card right=318, with 36px radius transitions
  const shapePath = [
    'M 1020 24',
    'A 36 36 0 0 1 1056 60',
    'V 1020',
    'A 36 36 0 0 1 1020 1056',
    'H 60',
    'A 36 36 0 0 1 24 1020',
    'V 178',
    'Q 24 142 60 142',
    'H 282',
    'Q 318 142 318 106',
    'V 60',
    'A 36 36 0 0 1 354 24',
    'H 1020',
    'Z',
  ].join(' ');

  return (
    <div className="post-template" style={{ backgroundColor: GRAY_BG, overflow: 'visible' }}>
      {/* clipPath definition */}
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={shapePath} />
          </clipPath>
        </defs>
      </svg>

      {/* Photo — clipped with notch */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1080,
          height: 1080,
          clipPath: `url(#${clipId})`,
          zIndex: 10,
        }}
      >
        {photo ? (
          <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#1a1a1a' }} />
        )}
      </div>

      {/* Logo card — fits in the top-left notch */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          width: 308,
          height: 132,
          borderRadius: 28,
          backgroundColor: GRAY_BG,
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 16px',
          boxSizing: 'border-box',
          overflow: 'visible',
        }}
      >
        <img src={logoBase64} alt="VDH" style={{ height: 250, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
      </div>
    </div>
  );
};
