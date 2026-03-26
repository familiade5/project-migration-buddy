import { useId } from 'react';
import { AFPropertyData } from '@/types/apartamentosFortaleza';
import logoAF from '@/assets/logo-apartamentos-fortaleza.png';
import { useLogoBase64 } from '@/hooks/useLogoBase64';

const PRIMARY = '#0C7B8E';
const ACCENT = '#E8562A';
const DARK = '#0a1628';
const golos = "'Golos Text', Arial, sans-serif";

const AFPaidLogo = ({ width = 100, variant = 'color' }: { width?: number; variant?: 'color' | 'white' }) => {
  const base64 = useLogoBase64(logoAF);
  return (
    <img
      src={base64}
      alt="Apartamentos Fortaleza"
      width={width}
      style={{ display: 'block', ...(variant === 'white' ? { filter: 'brightness(0) invert(1)' } : {}) }}
    />
  );
};

// ─── SLIDE 1: HERO CAPA — High-impact ad cover ──────────────────────────────
// Full-bleed photo, dramatic gradient, huge price, urgency badge, CTA
export const AFPaidHeroSlide = ({ data, photo }: { data: AFPropertyData; photo?: string }) => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const priceStr = price > 0 ? price.toLocaleString('pt-BR') : 'Consulte';

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: DARK, fontFamily: golos, overflow: 'hidden' }}>
      {/* Full photo */}
      {photo ? (
        <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#1a3a4a' }} />
      )}

      {/* Dramatic gradient overlay from bottom */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.65) 38%, rgba(0,0,0,0.08) 65%, transparent 100%)',
      }} />

      {/* Top: urgency badge */}
      <div style={{
        position: 'absolute', top: 12, left: 12, zIndex: 10,
        background: ACCENT, borderRadius: 6, padding: '4px 12px',
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#fff', animation: 'pulse 1.5s infinite' }} />
        <span style={{ color: '#fff', fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', fontFamily: golos, textTransform: 'uppercase' }}>
          {data.isRental ? 'Disponível para Locação' : 'Oportunidade Exclusiva'}
        </span>
      </div>

      {/* Top-right: logo */}
      <div style={{
        position: 'absolute', top: 10, right: 10, zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '5px 8px',
      }}>
        <AFPaidLogo width={72} variant="color" />
      </div>

      {/* Bottom content block */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5, padding: '0 16px 14px' }}>
        {/* Property name */}
        <p style={{
          color: '#fff', fontSize: 18, fontWeight: 900, lineHeight: 1.15, margin: '0 0 4px',
          fontFamily: golos, textShadow: '0 2px 12px rgba(0,0,0,0.5)',
        }}>
          {data.title || 'Seu Novo Lar'}
        </p>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
          <svg width="8" height="10" viewBox="0 0 10 13" fill={ACCENT}>
            <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8C10 2.24 7.76 0 5 0zm0 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
          </svg>
          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 10, fontFamily: golos }}>
            {[data.neighborhood, 'Fortaleza'].filter(Boolean).join(' • ')}
          </span>
        </div>

        {/* Specs row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          {data.bedrooms > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 6, padding: '4px 8px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, fontFamily: golos }}>{data.bedrooms}</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 8, marginLeft: 3, fontFamily: golos }}>Quartos</span>
            </div>
          )}
          {data.suites > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 6, padding: '4px 8px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, fontFamily: golos }}>{data.suites}</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 8, marginLeft: 3, fontFamily: golos }}>Suítes</span>
            </div>
          )}
          {data.area > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 6, padding: '4px 8px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, fontFamily: golos }}>{data.area}</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 8, marginLeft: 3, fontFamily: golos }}>m²</span>
            </div>
          )}
          {data.garageSpaces > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 6, padding: '4px 8px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, fontFamily: golos }}>{data.garageSpaces}</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 8, marginLeft: 3, fontFamily: golos }}>Vagas</span>
            </div>
          )}
        </div>

        {/* Price bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: `linear-gradient(135deg, ${ACCENT} 0%, #c43e18 100%)`,
          borderRadius: 10, padding: '8px 14px',
        }}>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 8, fontFamily: golos, display: 'block', marginBottom: 1 }}>
              {data.isRental ? 'Aluguel a partir de' : 'A partir de'}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ color: '#fff', fontSize: 9, opacity: 0.8, fontFamily: golos }}>R$</span>
              <span style={{ color: '#fff', fontSize: 20, fontWeight: 900, fontFamily: golos, lineHeight: 1 }}>{priceStr}</span>
            </div>
          </div>
          <div style={{
            backgroundColor: '#fff', borderRadius: 8, padding: '6px 14px',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ color: ACCENT, fontSize: 10, fontWeight: 800, fontFamily: golos }}>SAIBA MAIS</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill={ACCENT}>
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SLIDE 2: FEATURES — Key selling points ─────────────────────────────────
export const AFPaidFeaturesSlide = ({ data, photo }: { data: AFPropertyData; photo?: string }) => {
  const specs = [
    data.bedrooms > 0 ? `${data.bedrooms} Quarto${data.bedrooms > 1 ? 's' : ''}` : '',
    data.suites > 0 ? `${data.suites} Suíte${data.suites > 1 ? 's' : ''}` : '',
    data.bathrooms > 0 ? `${data.bathrooms} Banheiro${data.bathrooms > 1 ? 's' : ''}` : '',
    data.area > 0 ? `${data.area}m² de área` : '',
    data.garageSpaces > 0 ? `${data.garageSpaces} Vaga${data.garageSpaces > 1 ? 's' : ''} de garagem` : '',
    data.floor ? `${data.floor}° andar` : '',
    data.furnished ? 'Mobiliado' : '',
    ...(data.rooms ? data.rooms.split('\n').filter(Boolean).slice(0, 3) : []),
  ].filter(Boolean).slice(0, 8);

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: '#fff', fontFamily: golos, overflow: 'hidden' }}>
      {/* Left half: photo */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 170, height: 360 }}>
        {photo ? (
          <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#cfe8eb' }} />
        )}
        {/* Diagonal cut overlay */}
        <div style={{
          position: 'absolute', top: 0, right: -30, width: 60, height: '100%',
          background: 'linear-gradient(to right, transparent 0%, #fff 100%)',
        }} />
      </div>

      {/* Right panel */}
      <div style={{ position: 'absolute', right: 0, top: 0, width: 210, height: 360, padding: '16px 14px 14px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        {/* Logo */}
        <div style={{ marginBottom: 10 }}>
          <AFPaidLogo width={80} variant="color" />
        </div>

        {/* Title */}
        <p style={{ color: PRIMARY, fontSize: 8, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 4px', fontFamily: golos }}>
          Diferenciais
        </p>
        <p style={{ color: DARK, fontSize: 13, fontWeight: 900, lineHeight: 1.2, margin: '0 0 12px', fontFamily: golos }}>
          {data.title || 'Conheça os detalhes'}
        </p>

        {/* Spec list */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {specs.map((spec, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{
                width: 20, height: 20, borderRadius: 6,
                background: i % 2 === 0 ? `linear-gradient(135deg, ${PRIMARY}, #0A9CB2)` : `linear-gradient(135deg, ${ACCENT}, #F07030)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <span style={{ color: '#1e293b', fontSize: 9.5, fontWeight: 500, fontFamily: golos, lineHeight: 1.3 }}>{spec}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          background: `linear-gradient(135deg, ${PRIMARY} 0%, #0A6070 100%)`,
          borderRadius: 8, padding: '7px 12px', textAlign: 'center', marginTop: 8,
        }}>
          <span style={{ color: '#fff', fontSize: 9, fontWeight: 700, fontFamily: golos, letterSpacing: '0.04em' }}>
            Agende sua visita →
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── SLIDE 3: GALLERY — Multi-photo grid ────────────────────────────────────
export const AFPaidGallerySlide = ({ data, photos }: { data: AFPropertyData; photos: string[] }) => {
  const p = photos.slice(0, 4);
  while (p.length < 4) p.push('');

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: DARK, fontFamily: golos, overflow: 'hidden' }}>
      {/* 2x2 grid */}
      <div style={{ position: 'absolute', inset: 6, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 4, zIndex: 1 }}>
        {p.map((photo, i) => (
          <div key={i} style={{ borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
            {photo ? (
              <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: '#1a3a4a' }} />
            )}
          </div>
        ))}
      </div>

      {/* Center floating badge */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10,
        background: 'rgba(255,255,255,0.97)', borderRadius: 12, padding: '10px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)', textAlign: 'center',
        border: `2px solid ${ACCENT}`,
      }}>
        <p style={{ color: PRIMARY, fontSize: 8, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 3px', fontFamily: golos }}>
          {data.neighborhood || 'Fortaleza'}
        </p>
        <p style={{ color: DARK, fontSize: 13, fontWeight: 900, lineHeight: 1.1, margin: '0 0 3px', fontFamily: golos }}>
          {data.title || 'Veja os ambientes'}
        </p>
        <div style={{ width: 30, height: 2, backgroundColor: ACCENT, borderRadius: 2, margin: '0 auto' }} />
      </div>

      {/* Logo bottom-right */}
      <div style={{
        position: 'absolute', bottom: 12, right: 12, zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '4px 8px',
      }}>
        <AFPaidLogo width={60} variant="color" />
      </div>
    </div>
  );
};

// ─── SLIDE 4: PRICE HIGHLIGHT — Conversion focused ──────────────────────────
export const AFPaidPriceSlide = ({ data, photo }: { data: AFPropertyData; photo?: string }) => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const priceStr = price > 0 ? price.toLocaleString('pt-BR') : 'Consulte';

  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: DARK, fontFamily: golos, overflow: 'hidden' }}>
      {/* Background photo with heavy overlay */}
      {photo ? (
        <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3) blur(1px)' }} />
      ) : null}

      <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        {/* Logo */}
        <div style={{ marginBottom: 16 }}>
          <AFPaidLogo width={100} variant="white" />
        </div>

        {/* Property name */}
        <p style={{ color: '#fff', fontSize: 14, fontWeight: 800, textAlign: 'center', margin: '0 0 4px', fontFamily: golos }}>
          {data.title || 'Seu Novo Lar'}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9, textAlign: 'center', margin: '0 0 14px', fontFamily: golos }}>
          {[data.neighborhood, 'Fortaleza - CE'].filter(Boolean).join(' • ')}
        </p>

        {/* Big price card */}
        <div style={{
          background: `linear-gradient(135deg, ${ACCENT} 0%, #c43e18 100%)`,
          borderRadius: 14, padding: '12px 24px', textAlign: 'center', marginBottom: 14,
          boxShadow: `0 0 40px ${ACCENT}44`,
        }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9, display: 'block', marginBottom: 2, fontFamily: golos }}>
            {data.isRental ? 'Aluguel' : 'Investimento a partir de'}
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 3 }}>
            <span style={{ color: '#fff', fontSize: 12, opacity: 0.8, fontFamily: golos }}>R$</span>
            <span style={{ color: '#fff', fontSize: 28, fontWeight: 900, fontFamily: golos, lineHeight: 1 }}>{priceStr}</span>
          </div>
          {data.acceptsFinancing && !data.isRental && (
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 8, fontFamily: golos, display: 'block', marginTop: 3 }}>
              Aceita Financiamento
            </span>
          )}
        </div>

        {/* CTA */}
        <div style={{
          backgroundColor: '#fff', borderRadius: 10, padding: '8px 28px',
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 4px 20px rgba(255,255,255,0.15)',
        }}>
          <span style={{ color: PRIMARY, fontSize: 11, fontWeight: 800, fontFamily: golos }}>QUERO CONHECER</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill={PRIMARY}>
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// ─── SLIDE 5: CTA FINAL — Contact/conversion ───────────────────────────────
export const AFPaidCTASlide = ({ data, photo }: { data: AFPropertyData; photo?: string }) => {
  return (
    <div style={{ position: 'relative', width: 360, height: 360, fontFamily: golos, overflow: 'hidden' }}>
      {/* Split: top photo, bottom dark */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 360, height: 160 }}>
        {photo ? (
          <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#1a3a4a' }} />
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: `linear-gradient(to top, ${DARK}, transparent)` }} />
      </div>

      {/* Bottom dark section */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 220, backgroundColor: DARK, padding: '24px 20px 16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Logo */}
        <div style={{ marginBottom: 12 }}>
          <AFPaidLogo width={100} variant="white" />
        </div>

        <p style={{ color: '#fff', fontSize: 13, fontWeight: 800, textAlign: 'center', margin: '0 0 4px', fontFamily: golos }}>
          Não perca essa oportunidade!
        </p>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9, textAlign: 'center', margin: '0 0 14px', fontFamily: golos }}>
          Entre em contato e agende sua visita hoje
        </p>

        {/* Broker info */}
        {data.brokerName && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
            background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 14px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div>
              <p style={{ color: '#fff', fontSize: 10, fontWeight: 700, margin: 0, fontFamily: golos }}>{data.brokerName}</p>
              {data.brokerPhone && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 8, margin: 0, fontFamily: golos }}>{data.brokerPhone}</p>}
            </div>
          </div>
        )}

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
          <div style={{
            flex: 1, background: '#25D366', borderRadius: 8, padding: '8px 10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
            <span style={{ color: '#fff', fontSize: 9, fontWeight: 700, fontFamily: golos }}>WhatsApp</span>
          </div>
          <div style={{
            flex: 1, background: `linear-gradient(135deg, ${ACCENT}, #c43e18)`,
            borderRadius: 8, padding: '8px 10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            <span style={{ color: '#fff', fontSize: 9, fontWeight: 700, fontFamily: golos }}>Ligar Agora</span>
          </div>
        </div>
      </div>

      {/* CRECI badge */}
      {data.creci && (
        <div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 6.5, fontFamily: golos }}>CRECI: {data.creci}</span>
        </div>
      )}
    </div>
  );
};

// ─── SLIDE EXTRA: PHOTO SINGLE (for additional photos) ──────────────────────
export const AFPaidPhotoSlide = ({ data, photo, index }: { data: AFPropertyData; photo: string; index: number }) => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  
  return (
    <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: DARK, fontFamily: golos, overflow: 'hidden' }}>
      {/* Full photo */}
      <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      
      {/* Subtle gradient bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, zIndex: 2,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
      }} />

      {/* Logo badge top-right */}
      <div style={{
        position: 'absolute', top: 10, right: 10, zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '5px 8px',
      }}>
        <AFPaidLogo width={60} variant="color" />
      </div>

      {/* Bottom bar */}
      <div style={{
        position: 'absolute', bottom: 10, left: 10, right: 10, zIndex: 5,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="8" height="10" viewBox="0 0 10 13" fill="#fff">
            <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8C10 2.24 7.76 0 5 0zm0 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
          </svg>
          <span style={{ color: '#fff', fontSize: 9, fontFamily: golos, fontWeight: 600 }}>
            {data.neighborhood || data.title}
          </span>
        </div>
        {price > 0 && (
          <div style={{ background: ACCENT, borderRadius: 6, padding: '3px 10px' }}>
            <span style={{ color: '#fff', fontSize: 9, fontWeight: 800, fontFamily: golos }}>
              R$ {price.toLocaleString('pt-BR')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
