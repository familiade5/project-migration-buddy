/**
 * TEMA 3 — "PÔR DO SOL" (Urgência Tropical)
 * Coral sunset dramatic aesthetic
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

export const AFStory3_T3_Curiosity = ({ data, photo }: { data: AFPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#0c0c0c', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
    {photo && <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.25) saturate(1.4)' }} />}
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, #0c0c0c 0%, ${ACCENT}44 50%, #0c0c0c 100%)` }} />
    <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${ACCENT}22 0%, transparent 70%)` }} />

    <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 28px 40px' }}>
      <Logo variant="white" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 60, height: 3, background: `linear-gradient(90deg, ${ACCENT}, ${PRIMARY})`, borderRadius: 2, marginBottom: 20 }} />
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 600, textAlign: 'center', margin: '0 0 8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          não perca esta chance
        </p>
        <p style={{ color: 'white', fontSize: 38, fontWeight: 900, textAlign: 'center', lineHeight: 1.1, margin: '0 0 8px', textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}>
          {data.bedrooms > 0 ? `${data.bedrooms} QUARTOS` : 'APARTAMENTO'}
        </p>
        <p style={{ color: ACCENT, fontSize: 22, fontWeight: 800, textAlign: 'center', lineHeight: 1.2, margin: '0 0 24px' }}>
          em {data.neighborhood || 'Fortaleza – CE'}
        </p>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px 20px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', width: '100%' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, margin: '0 0 4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>a partir de</p>
          <p style={{ color: 'white', fontSize: 26, fontWeight: 900, margin: 0 }}>{formatPrice(data.isRental ? data.rentalPrice : data.salePrice)}</p>
        </div>
      </div>
      <div style={{ backgroundColor: `${ACCENT}26`, borderRadius: 20, padding: '8px 20px', border: `1px solid ${ACCENT}55` }}>
        <p style={{ color: ACCENT, fontSize: 11, margin: 0, fontWeight: 700, letterSpacing: '0.08em' }}>👇 DESLIZE PARA VER MAIS</p>
      </div>
    </div>

    <div style={{ position: 'absolute', top: 18, right: 18, zIndex: 20, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '4px 12px' }}>
      <p style={{ color: 'white', fontSize: 10, margin: 0, fontWeight: 600 }}>1 / 3</p>
    </div>
  </div>
);

export const AFStory3_T3_Reveal = ({ data, photos }: { data: AFPropertyData; photos?: string[] }) => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const specs = [
    data.bedrooms > 0 && `${data.bedrooms} Quartos`,
    data.area > 0 && `${data.area}m²`,
    data.garageSpaces > 0 && `${data.garageSpaces} Vagas`,
    data.suites > 0 && `${data.suites} Suítes`,
    data.floor && `${data.floor}° Andar`,
    data.furnished && 'Mobiliado',
  ].filter(Boolean) as string[];
  const imgs = photos && photos.length > 0 ? photos : [];
  const img = (i: number) => imgs[i] ?? imgs[0] ?? undefined;

  return (
    <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#0c0c0c', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      {/* Panoramic photo top 60% */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%', overflow: 'hidden' }}>
        {img(0) ? <img src={img(0)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85)' }} /> : <div style={{ width: '100%', height: '100%', backgroundColor: '#1a2a2a' }} />}
        <div style={{ position: 'absolute', top: 16, left: 16 }}><Logo variant="white" /></div>
        {data.neighborhood && (
          <div style={{ position: 'absolute', top: 16, right: 16, backgroundColor: ACCENT, borderRadius: 20, padding: '5px 14px' }}>
            <p style={{ color: 'white', fontSize: 10, fontWeight: 700, margin: 0 }}>📍 {data.neighborhood}</p>
          </div>
        )}
        {imgs.length > 1 && (
          <div style={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', gap: 4 }}>
            {imgs.slice(1, 4).map((im, i) => (
              <div key={i} style={{ width: 52, height: 52, borderRadius: 8, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.5)' }}>
                <img src={im} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to bottom, transparent, #0c0c0c)' }} />
      </div>

      {/* Info bottom */}
      <div style={{ position: 'absolute', top: '58%', left: 16, right: 16, bottom: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: 'white', fontSize: 16, fontWeight: 800, margin: '0 0 10px', lineHeight: 1.3 }}>{data.title || 'Apartamento Premium'}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
            {specs.map((s, i) => (
              <span key={i} style={{ backgroundColor: `${ACCENT}22`, border: `1px solid ${ACCENT}44`, borderRadius: 20, padding: '4px 10px', color: '#fca5a5', fontSize: 10, fontWeight: 600 }}>{s}</span>
            ))}
          </div>
        </div>
        <div style={{ background: `linear-gradient(135deg, ${ACCENT}, #c44320)`, borderRadius: 16, padding: '14px 18px', boxShadow: `0 8px 30px ${ACCENT}55` }}>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 9, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{data.isRental ? 'Aluguel' : 'Valor de Venda'}</p>
          <p style={{ color: 'white', fontSize: 24, fontWeight: 900, margin: '0 0 6px', lineHeight: 1 }}>{formatPrice(price)}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {data.acceptsFinancing && <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '2px 10px', color: 'white', fontSize: 9, fontWeight: 600 }}>✓ Financiamento</span>}
            {data.acceptsFGTS && <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '2px 10px', color: 'white', fontSize: 9, fontWeight: 600 }}>✓ FGTS</span>}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: '3px 12px' }}>
            <p style={{ color: 'white', fontSize: 10, margin: 0, fontWeight: 600 }}>2 / 3</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AFStory3_T3_CTA = ({ data, photo }: { data: AFPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: STORY_W, height: STORY_H, fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
    {photo && <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.2) saturate(1.6)' }} />}
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, #0c0c0c 0%, #7c1e0a 50%, #0c0c0c 100%)`, opacity: photo ? 0.92 : 1 }} />

    <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px' }}>
      <Logo variant="white" />
      <div style={{ margin: '28px 0', textAlign: 'center' }}>
        <p style={{ color: ACCENT, fontSize: 42, fontWeight: 900, lineHeight: 1.1, margin: '0 0 6px', textShadow: `0 4px 30px ${ACCENT}88` }}>
          {data.neighborhood || 'FORTALEZA'}
        </p>
        <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: '0.08em' }}>
          O MELHOR ESTÁ AQUI
        </p>
      </div>

      <div style={{ width: '100%', backgroundColor: ACCENT, borderRadius: 18, padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16, boxShadow: `0 10px 40px ${ACCENT}77` }}>
        <span style={{ fontSize: 26 }}>📱</span>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Chame agora no WhatsApp</p>
          <p style={{ color: 'white', fontSize: 20, fontWeight: 900, margin: 0 }}>{data.brokerPhone || '(85) 9XXXX-XXXX'}</p>
        </div>
      </div>

      <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px 20px', border: '1px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
        {data.brokerName && <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>{data.brokerName}</p>}
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, margin: '0 0 2px' }}>Corretor de Imóveis</p>
        {data.creci && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, margin: 0 }}>{data.creci}</p>}
      </div>
    </div>

    <div style={{ position: 'absolute', bottom: 18, right: 20, zIndex: 20, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '4px 12px', border: '1px solid rgba(255,255,255,0.15)' }}>
      <p style={{ color: 'white', fontSize: 10, margin: 0, fontWeight: 600 }}>3 / 3</p>
    </div>
  </div>
);
