import { useId } from 'react';
import { PropertyData } from '@/types/property';
import logoVDH from '@/assets/logo-vdh-transparent.png';

interface VDHFeedPhotoSlideProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
  slideIndex?: number;
  totalSlides?: number;
}

const GRAY_BG = '#2a2a2a';

export const VDHFeedPhotoSlide = ({ photo }: VDHFeedPhotoSlideProps) => {
  const uid = useId();
  const clipId = `vdh-photo-${uid}`;

  // Notch top-left scaled to 1080px — larger notch for bigger logo
  // Card: top=12, left=12, w=420, h=192
  // Notch inner corner at x=432, transitions at y=204
  const shapePath = [
    'M 1020 24',
    'A 36 36 0 0 1 1056 60',
    'V 1020',
    'A 36 36 0 0 1 1020 1056',
    'H 60',
    'A 36 36 0 0 1 24 1020',
    'V 240',
    'Q 24 204 60 204',
    'H 372',
    'Q 432 204 432 144',
    'V 60',
    'A 36 36 0 0 1 468 24',
    'H 1020',
    'Z',
  ].join(' ');

  return (
    <div className="post-template" style={{ backgroundColor: GRAY_BG }}>
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
          top: 12,
          left: 12,
          width: 420,
          height: 192,
          borderRadius: 36,
          backgroundColor: GRAY_BG,
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 24px',
          boxSizing: 'border-box',
        }}
      >
        <img src={logoVDH} alt="VDH" style={{ height: 160, objectFit: 'contain' }} />
      </div>
    </div>
  );
};
