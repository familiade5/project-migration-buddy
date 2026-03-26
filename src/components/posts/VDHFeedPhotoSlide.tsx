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

  // Same notch shape as AM but scaled 3x (360→1080)
  const shapePath = [
    'M 1020 24',
    'A 36 36 0 0 1 1056 60',
    'V 1020',
    'A 36 36 0 0 1 1020 1056',
    'H 60',
    'A 36 36 0 0 1 24 1020',
    'V 192',
    'Q 24 156 60 156',
    'H 300',
    'Q 360 156 360 120',
    'V 60',
    'A 36 36 0 0 1 396 24',
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
          width: 348,
          height: 156,
          borderRadius: 42,
          backgroundColor: GRAY_BG,
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: 18,
          paddingRight: 18,
          boxSizing: 'border-box',
        }}
      >
        <img src={logoVDH} alt="VDH" style={{ height: 120, borderRadius: 18, objectFit: 'contain' }} />
      </div>
    </div>
  );
};
