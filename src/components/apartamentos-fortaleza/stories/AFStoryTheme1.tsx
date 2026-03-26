/**
 * TEMA 1 — "BRISA DO MAR" (Fortaleza)
 * Dark teal coastal aesthetic — oceanic blues with coral accents
 */

import { AFPropertyData } from '@/types/apartamentosFortaleza';
import logoAF from '@/assets/logo-apartamentos-fortaleza.png';

const STORY_W = 360;
const STORY_H = 640;
const PRIMARY = '#0C7B8E';
const ACCENT = '#E8562A';

const Logo = ({ variant = 'white' }: { variant?: 'white' | 'color' }) => (
  <img src={logoAF} alt="Apartamentos Fortaleza" width={110}
    style={variant === 'white' ? { filter: 'brightness(0) invert(1)' } : undefined} />
);

const formatPrice = (v: number) =>
  v > 0 ? `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : 'Consulte';

// Story 1: Curiosidade
export const AFStory1_T1_Curiosity = ({ data, photo }: { data: AFPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#071a1e', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 40% at 50% 20%, ${PRIMARY}88 0%, transparent 70%)` }} />

    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', padding: '20px 32px 16px', zIndex: 10 }}>
      <Logo variant="white" />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ backgroundColor: ACCENT, borderRadius: 30, padding: '5px 20px', marginBottom: 14, fontSize: 11, fontWeight: 700, color: 'white', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Você viu este imóvel?
        </div>
        <p style={{ color: 'white', fontSize: 28, fontWeight: 900, textAlign: 'center', lineHeight: 1.2, margin: '0 0 12px', textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}>
          {data.bedrooms > 0 ? `${data.bedrooms} quartos` : 'Apartamento'}{' '}
          <span style={{ color: ACCENT }}>em {data.neighborhood || 'Fortaleza'}</span>{' '}
          com um preço incrível
        </p>
        <div style={{ width: 48, height: 3, backgroundColor: ACCENT, borderRadius: 2, margin: '0 0 10px' }} />
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
          Deslize para ver o imóvel completo 👇
        </p>
      </div>
    </div>

    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', overflow: 'hidden', zIndex: 5 }}>
      {photo ? (
        <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#0d2e35' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, #071a1e 0%, transparent 35%, transparent 80%, rgba(0,0,0,0.4) 100%)` }} />
      <div style={{ position: 'absolute', top: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
        <div style={{ backgroundColor: `${ACCENT}F2`, borderRadius: 20, padding: '4px 16px' }}>
          <p style={{ color: 'white', fontSize: 10, fontWeight: 700, margin: 0, letterSpacing: '0.1em' }}>📸 VER IMÓVEL ↑</p>
        </div>
      </div>
    </div>

    <div style={{ position: 'absolute', bottom: 18, right: 20, zIndex: 20, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '5px 14px', border: '1px solid rgba(255,255,255,0.2)' }}>
      <p style={{ color: 'white', fontSize: 11, margin: 0, fontWeight: 600 }}>1 / 3</p>
    </div>
  </div>
);

// Story 2: Revelação
export const AFStory1_T1_Reveal = ({ data, photos }: { data: AFPropertyData; photos?: string[] }) => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const specs = [
    data.bedrooms > 0 && `${data.bedrooms} Quarto${data.bedrooms > 1 ? 's' : ''}`,
    data.area > 0 && `${data.area}m²`,
    data.garageSpaces > 0 && `${data.garageSpaces} Vaga${data.garageSpaces > 1 ? 's' : ''}`,
    data.floor && `${data.floor}° Andar`,
  ].filter(Boolean) as string[];
  const imgs = photos && photos.length > 0 ? photos : [];
  const img = (i: number) => imgs[i] ?? imgs[0] ?? undefined;
  const PHOTO_H = 435;
  const CARD_TOP = PHOTO_H - 20;

  return (
    <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#071a1e', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: PHOTO_H, zIndex: 1 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: 208, height: PHOTO_H, overflow: 'hidden' }}>
          {img(0) ? <img src={img(0)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', backgroundColor: '#0d2e35' }} />}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, transparent 60%, #071a1e 100%)` }} />
        </div>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 148, height: PHOTO_H, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[1,2,3].map((idx) => (
            <div key={idx} style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              {img(idx) ? <img src={img(idx)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', backgroundColor: '#0d2e35' }} />}
            </div>
          ))}
          {imgs.length > 4 && (
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 148, height: '33.3%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: 'white', fontSize: 18, fontWeight: 900, margin: 0 }}>+{imgs.length - 4}</p>
            </div>
          )}
        </div>
        <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}><Logo variant="white" /></div>
        {data.neighborhood && (
          <div style={{ position: 'absolute', top: 16, right: 8, zIndex: 10, backgroundColor: ACCENT, borderRadius: 20, padding: '4px 12px' }}>
            <p style={{ color: 'white', fontSize: 10, fontWeight: 700, margin: 0 }}>📍 {data.neighborhood}</p>
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: `linear-gradient(to bottom, transparent, #071a1e)` }} />
      </div>

      <div style={{ position: 'absolute', top: CARD_TOP, left: 12, right: 12, bottom: 12, zIndex: 20, backgroundColor: '#0d1f24', borderRadius: 20, padding: '16px 18px', border: `1px solid ${PRIMARY}59`, boxShadow: `0 0 40px ${PRIMARY}33`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 8px', lineHeight: 1.3 }}>{data.title || 'Apartamento Disponível'}</p>
        {specs.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
            {specs.map((s, i) => (
              <span key={i} style={{ backgroundColor: `${PRIMARY}40`, border: `1px solid ${PRIMARY}66`, borderRadius: 20, padding: '3px 10px', color: '#7dd3e0', fontSize: 10, fontWeight: 600 }}>{s}</span>
            ))}
          </div>
        )}
        <div style={{ backgroundColor: PRIMARY, borderRadius: 14, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{data.isRental ? 'Aluguel' : 'Valor de Venda'}</p>
            <p style={{ color: 'white', fontSize: 22, fontWeight: 900, margin: 0, lineHeight: 1 }}>{formatPrice(price)}</p>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end' }}>
            {data.acceptsFinancing && <p style={{ color: '#86efac', fontSize: 10, margin: 0, fontWeight: 600 }}>✓ Financiamento</p>}
            {data.acceptsFGTS && <p style={{ color: '#86efac', fontSize: 10, margin: 0, fontWeight: 600 }}>✓ FGTS</p>}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: '3px 12px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <p style={{ color: 'white', fontSize: 10, margin: 0, fontWeight: 600 }}>2 / 3</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Story 3: CTA
export const AFStory1_T1_CTA = ({ data, photo }: { data: AFPropertyData; photo?: string }) => {
  const buildHeadline = () => {
    if (data.neighborhood && data.bedrooms > 0) return { line1: 'Seu novo lar em', line2: data.neighborhood, line3: 'está esperando por você' };
    if (data.bedrooms > 0 && data.area > 0) return { line1: `${data.bedrooms} quartos,`, line2: `${data.area}m² de`, line3: 'vida nova' };
    if (data.neighborhood) return { line1: 'Sua nova vida em', line2: `${data.neighborhood}`, line3: 'começa aqui' };
    return { line1: 'O imóvel que você', line2: 'procurou', line3: 'está aqui' };
  };
  const hl = buildHeadline();

  return (
    <div style={{ position: 'relative', width: STORY_W, height: STORY_H, fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      {photo && <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' }} />}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, #061015 0%, ${PRIMARY} 50%, #061015 100%)`, opacity: photo ? 0.85 : 1 }} />

      <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%', border: `2px solid ${ACCENT}33`, zIndex: 2 }} />
      <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', border: `2px solid ${ACCENT}55`, zIndex: 2 }} />
      <div style={{ position: 'absolute', bottom: -100, left: -60, width: 300, height: 300, borderRadius: '50%', border: `2px solid ${PRIMARY}40`, zIndex: 2 }} />

      <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 28px 40px' }}>
        <Logo variant="white" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: `${ACCENT}26`, border: `1px solid ${ACCENT}80`, borderRadius: 30, padding: '5px 20px', marginBottom: 20 }}>
            <p style={{ color: ACCENT, fontSize: 11, fontWeight: 700, margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Fale conosco hoje</p>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: 600, textAlign: 'center', lineHeight: 1.2, margin: '0 0 4px' }}>{hl.line1}</p>
          <p style={{ color: ACCENT, fontSize: 36, fontWeight: 900, textAlign: 'center', lineHeight: 1.1, margin: '0 0 4px' }}>{hl.line2}</p>
          <p style={{ color: 'white', fontSize: 22, fontWeight: 700, textAlign: 'center', lineHeight: 1.2, margin: '0 0 28px' }}>{hl.line3}</p>

          {data.address && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 16px', marginBottom: 20, width: '100%' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Endereço</p>
              <p style={{ color: 'white', fontSize: 12, margin: 0, lineHeight: 1.4 }}>{data.address}</p>
            </div>
          )}

          <div style={{ width: '100%', backgroundColor: ACCENT, borderRadius: 16, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14, boxShadow: `0 8px 24px ${ACCENT}66` }}>
            <span style={{ fontSize: 22 }}>📱</span>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Fale agora via WhatsApp</p>
              <p style={{ color: 'white', fontSize: 18, fontWeight: 900, margin: 0 }}>{data.brokerPhone || '(85) 9XXXX-XXXX'}</p>
            </div>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, textAlign: 'center', margin: '0 0 4px' }}>{data.brokerName || 'Corretor de Imóveis'}</p>
          {data.creci && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, textAlign: 'center', margin: 0 }}>{data.creci}</p>}
        </div>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '5px 14px', border: '1px solid rgba(255,255,255,0.15)' }}>
          <p style={{ color: 'white', fontSize: 11, margin: 0, fontWeight: 600 }}>3 / 3</p>
        </div>
      </div>
    </div>
  );
};
