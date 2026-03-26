import { useId } from 'react';
import { PropertyData } from '@/types/property';
import logoVDH from '@/assets/logo-vdh.jpg';

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

  // Same notch shape as AM: top-left notch for logo card
  const shapePath = [
    'M 340 8',
    'A 12 12 0 0 1 352 20',
    'V 340',
    'A 12 12 0 0 1 340 352',
    'H 20',
    'A 12 12 0 0 1 8 340',
    'V 64',
    'Q 8 52 20 52',
    'H 100',
    'Q 120 52 120 40',
    'V 20',
    'A 12 12 0 0 1 132 8',
    'H 340',
    'Z',
  ].join(' ');

  return (
    <div
      className="post-template"
      style={{
        position: 'relative',
        width: 360,
        height: 360,
        backgroundColor: GRAY_BG,
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
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
          width: 360,
          height: 360,
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

      {/* Logo card — fits in the top-left notch (below photo z-index) */}
      <div
        style={{
          position: 'absolute',
          top: 4,
          left: 4,
          width: 116,
          height: 52,
          borderRadius: 14,
          backgroundColor: GRAY_BG,
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: 6,
          paddingRight: 6,
          boxSizing: 'border-box',
        }}
      >
        <img src={logoVDH} alt="VDH" style={{ height: 40, borderRadius: 6, objectFit: 'contain' }} />
      </div>
    </div>
  );
};
