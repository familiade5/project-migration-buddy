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

export const VDHFeedPhotoSlide = ({ photo, slideIndex = 0 }: VDHFeedPhotoSlideProps) => {
  return (
    <div className="post-template relative overflow-hidden" style={{ background: DARK }}>
      {photo ? (
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${photo})` }} />
      ) : (
        <div className="absolute inset-0" style={{ background: DARK }} />
      )}

      {/* Top bar: badge left, logo right — no overlay/shadow */}
      <div className="absolute top-5 left-5 right-5 flex items-start justify-between z-10">
        <div
          style={{
            background: 'rgba(16,23,34,0.82)',
            border: `1px solid ${GOLD}`,
            color: '#fff',
            borderRadius: 999,
            padding: '10px 18px',
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
          }}
        >
          Exclusivo
        </div>

        <img src={logoVDH} alt="VDH" style={{ height: 50, borderRadius: 8, objectFit: 'contain' }} />
      </div>
    </div>
  );
};
