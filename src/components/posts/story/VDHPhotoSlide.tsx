import { PropertyData } from '@/types/property';
import logoVDH from '@/assets/logo-vdh.jpg';

interface VDHPhotoSlideProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
  slideIndex?: number;
  totalSlides?: number;
}

const GOLD = '#D4AF37';
const DARK_BG = '#06090f';

/**
 * Dynamic VDH photo slide — used for slides 5–10.
 * Each variant uses a different creative layout for maximum engagement.
 */
export const VDHPhotoSlide = ({ data, photo, photos, slideIndex = 4, totalSlides = 10 }: VDHPhotoSlideProps) => {
  const variant = (slideIndex - 4) % 6; // 0-5 layouts that cycle

  const getPhoto = (idx: number) => photos?.[idx] || photo || null;
  const mainPhoto = getPhoto(slideIndex);
  const secondaryPhoto = getPhoto(slideIndex + 1) || getPhoto(0);

  const neighborhood = data.neighborhood || '';
  const city = data.city || '';
  const state = data.state || '';
  const locationParts = [neighborhood, city, state].filter(Boolean);
  const locationText = locationParts.join(' · ');

  const formatPrice = (val: string) => {
    if (!val) return null;
    if (val.includes('R$')) return val;
    return `R$ ${val}`;
  };

  const priceLabel = formatPrice(data.minimumValue || '') || 'Consulte';

  const bedroomsNum = Number(data.bedrooms || 0);
  const areaValue = (data.area || data.areaPrivativa || data.areaTotal || '').trim();

  // Shared elements
  const logoElement = (
    <img src={logoVDH} alt="VDH" style={{ height: 50, borderRadius: 8, objectFit: 'contain' }} />
  );

  const photoStyle = (src: string | null): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    backgroundImage: src ? `url(${src})` : undefined,
    backgroundColor: src ? undefined : '#1a2433',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  });

  // ═══════════════════════════════════════════════════
  // VARIANT 0 — Full bleed photo + bottom gradient CTA
  // ═══════════════════════════════════════════════════
  if (variant === 0) {
    return (
      <div className="post-template-story relative overflow-hidden" style={{ background: DARK_BG }}>
        <div style={photoStyle(mainPhoto)} />
        {/* Gradient overlay bottom */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,9,15,0.95) 0%, rgba(6,9,15,0.6) 35%, transparent 60%)' }} />

        {/* Top badge */}
        <div style={{ position: 'absolute', top: 40, left: 40, right: 40, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {logoElement}
          <div style={{ background: `linear-gradient(135deg, ${GOLD}, #b8941f)`, borderRadius: 30, padding: '10px 22px' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 20, letterSpacing: 1 }}>EXCLUSIVO</span>
          </div>
        </div>

        {/* Bottom content */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 44px 50px', zIndex: 10 }}>
          <p style={{ color: '#fff', fontSize: 40, fontWeight: 800, lineHeight: 1.2, marginBottom: 12 }}>
            {data.type || 'Imóvel'} {bedroomsNum > 0 ? `${bedroomsNum} Quartos` : ''}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 22, marginBottom: 24 }}>{locationText}</p>
          <div style={{ background: 'rgba(212,175,55,0.15)', border: `2px solid ${GOLD}`, borderRadius: 16, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: GOLD, fontSize: 18, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>A partir de</span>
            <span style={{ color: '#fff', fontSize: 36, fontWeight: 900 }}>{priceLabel}</span>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════
  // VARIANT 1 — Split vertical: photo left, dark right
  // ═══════════════════════════════════════════════════
  if (variant === 1) {
    return (
      <div className="post-template-story relative overflow-hidden" style={{ background: DARK_BG }}>
        {/* Left photo 55% */}
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '55%', overflow: 'hidden' }}>
          <div style={photoStyle(mainPhoto)} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(6,9,15,1))' }} />
        </div>

        {/* Right content */}
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 44px 60px 20px', zIndex: 10 }}>
          {logoElement}
          <div style={{ marginTop: 40 }}>
            <div style={{ width: 60, height: 4, background: GOLD, borderRadius: 2, marginBottom: 20 }} />
            <p style={{ color: '#fff', fontSize: 38, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
              {data.type || 'Imóvel'}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 20, marginBottom: 30 }}>{locationText}</p>

            {/* Specs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
              {bedroomsNum > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD }} />
                  <span style={{ color: '#fff', fontSize: 22 }}>{bedroomsNum} Quartos</span>
                </div>
              )}
              {areaValue && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD }} />
                  <span style={{ color: '#fff', fontSize: 22 }}>{areaValue}m²</span>
                </div>
              )}
            </div>

            <div style={{ background: `linear-gradient(135deg, ${GOLD}, #a07e1a)`, borderRadius: 14, padding: '20px 24px', textAlign: 'center' }}>
              <span style={{ color: '#fff', fontSize: 32, fontWeight: 900 }}>{priceLabel}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════
  // VARIANT 2 — Stacked 2 photos with diagonal divider
  // ═══════════════════════════════════════════════════
  if (variant === 2) {
    return (
      <div className="post-template-story relative overflow-hidden" style={{ background: DARK_BG }}>
        {/* Top photo */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '52%', overflow: 'hidden' }}>
          <div style={photoStyle(mainPhoto)} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(6,9,15,1))' }} />
        </div>

        {/* Bottom photo */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '52%', overflow: 'hidden' }}>
          <div style={photoStyle(secondaryPhoto)} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, transparent 50%, rgba(6,9,15,1))' }} />
        </div>

        {/* Center content band */}
        <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0, right: 0, zIndex: 10, padding: '0 44px' }}>
          <div style={{ background: 'rgba(6,9,15,0.92)', backdropFilter: 'blur(10px)', borderRadius: 20, border: `2px solid ${GOLD}33`, padding: '30px 32px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>{logoElement}</div>
            <p style={{ color: '#fff', fontSize: 34, fontWeight: 800, marginBottom: 8 }}>{data.type || 'Imóvel'}</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 20, marginBottom: 18 }}>{locationText}</p>
            <div style={{ height: 2, background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`, marginBottom: 18 }} />
            <span style={{ color: GOLD, fontSize: 40, fontWeight: 900 }}>{priceLabel}</span>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════
  // VARIANT 3 — Polaroid style with accent bar
  // ═══════════════════════════════════════════════════
  if (variant === 3) {
    return (
      <div className="post-template-story relative overflow-hidden" style={{ background: '#0a0f18' }}>
        {/* Accent top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: `linear-gradient(to right, ${GOLD}, #a07e1a)`, zIndex: 20 }} />

        <div style={{ position: 'absolute', top: 60, left: 44, right: 44, bottom: 180, zIndex: 10 }}>
          {/* "Polaroid" frame */}
          <div style={{ width: '100%', height: '100%', background: '#fff', borderRadius: 20, padding: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
              <div style={photoStyle(mainPhoto)} />
            </div>
            <div style={{ padding: '16px 8px 8px', textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a' }}>{data.type || 'Imóvel'} — {neighborhood || city}</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '30px 44px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {logoElement}
          <div style={{ background: `linear-gradient(135deg, ${GOLD}, #a07e1a)`, borderRadius: 14, padding: '14px 28px' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 28 }}>{priceLabel}</span>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════
  // VARIANT 4 — Cinematic letterbox with specs
  // ═══════════════════════════════════════════════════
  if (variant === 4) {
    return (
      <div className="post-template-story relative overflow-hidden" style={{ background: DARK_BG }}>
        {/* Letterbox bars */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '15%', background: '#000', zIndex: 5 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '15%', background: '#000', zIndex: 5 }} />

        {/* Photo */}
        <div style={{ position: 'absolute', top: '15%', left: 0, right: 0, bottom: '15%' }}>
          <div style={photoStyle(mainPhoto)} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8))' }} />
        </div>

        {/* Top bar content */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '15%', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 44px' }}>
          {logoElement}
          <span style={{ color: GOLD, fontSize: 18, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>{neighborhood}</span>
        </div>

        {/* Bottom bar content */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '15%', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, padding: '0 44px' }}>
          {bedroomsNum > 0 && <span style={{ color: '#fff', fontSize: 22, fontWeight: 600 }}>🛏 {bedroomsNum} Quartos</span>}
          {areaValue && <span style={{ color: '#fff', fontSize: 22, fontWeight: 600 }}>📐 {areaValue}m²</span>}
          <span style={{ color: GOLD, fontSize: 28, fontWeight: 900 }}>{priceLabel}</span>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════
  // VARIANT 5 — Magazine editorial with quote
  // ═══════════════════════════════════════════════════
  return (
    <div className="post-template-story relative overflow-hidden" style={{ background: DARK_BG }}>
      <div style={photoStyle(mainPhoto)} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(6,9,15,0.85) 0%, rgba(6,9,15,0.4) 50%, rgba(6,9,15,0.85) 100%)' }} />

      {/* Top logo */}
      <div style={{ position: 'absolute', top: 40, left: 44, zIndex: 10 }}>{logoElement}</div>

      {/* Center editorial quote */}
      <div style={{ position: 'absolute', top: '35%', left: 44, right: 44, zIndex: 10 }}>
        <div style={{ width: 50, height: 4, background: GOLD, borderRadius: 2, marginBottom: 20 }} />
        <p style={{ color: '#fff', fontSize: 44, fontWeight: 300, lineHeight: 1.3, fontStyle: 'italic', marginBottom: 16 }}>
          "Seu novo lar te espera"
        </p>
        <p style={{ color: GOLD, fontSize: 22, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>
          {data.type || 'Imóvel'} · {neighborhood || city}
        </p>
      </div>

      {/* Bottom price */}
      <div style={{ position: 'absolute', bottom: 50, left: 44, right: 44, zIndex: 10 }}>
        <div style={{ background: 'rgba(6,9,15,0.8)', backdropFilter: 'blur(10px)', borderRadius: 16, border: `1px solid ${GOLD}44`, padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18, fontWeight: 600, textTransform: 'uppercase' }}>A partir de</span>
          <span style={{ color: '#fff', fontSize: 34, fontWeight: 900 }}>{priceLabel}</span>
        </div>
      </div>
    </div>
  );
};
