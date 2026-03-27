import { useId } from 'react';
import { PropertyData } from '@/types/property';
import logoVDH from '@/assets/logo-vdh-transparent.png';
import { useLogoBase64 } from '@/hooks/useLogoBase64';

interface VDHFeedPhotoSlideStoryProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
  slideIndex?: number;
  totalSlides?: number;
}

const GRAY_BG = '#73c883';

export const VDHFeedPhotoSlideStory = ({ data, photo, slideIndex = 0 }: VDHFeedPhotoSlideStoryProps) => {
  const uid = useId();
  const clipId = `vdh-story-photo-${uid}`;
  const logoBase64 = useLogoBase64(logoVDH);

  // Use custom editable specs (only on first photo slide)
  const specs: string[] = slideIndex === 0
    ? (data.customPhotoSpecs || []).filter(s => s && s.trim() !== '').slice(0, 6)
    : [];

  // Notch for story format (1080x1920) — logo card top-left
  const shapePath = [
    'M 1020 24',
    'A 36 36 0 0 1 1056 60',
    'V 1884',
    'A 36 36 0 0 1 1020 1920',
    'H 60',
    'A 36 36 0 0 1 24 1884',
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
    <div className="post-template-story" style={{ backgroundColor: GRAY_BG, overflow: 'visible' }}>
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
          height: 1920,
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

      {/* Specs card — dark blurred overlay */}
      {specs.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: 80,
          right: 54,
          zIndex: 20,
          backgroundColor: 'rgba(10,10,14,0.65)',
          borderRadius: 18,
          padding: '20px 28px',
          maxWidth: 420,
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.50)',
        }}>
          {specs.map((spec, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < specs.length - 1 ? 6 : 0 }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 26, lineHeight: 1 }}>•</span>
              <span style={{ color: 'rgba(255,255,255,0.95)', fontSize: 26, fontWeight: 500, lineHeight: '32px' }}>{spec}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
