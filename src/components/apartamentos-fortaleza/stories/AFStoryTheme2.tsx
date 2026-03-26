/**
 * TEMA 2 — "PRAIA BRANCA" (Clean Luxury)
 * Light, premium coastal aesthetic
 */

import { AFPropertyData } from '@/types/apartamentosFortaleza';
import logoAF from '@/assets/logo-apartamentos-fortaleza.png';

const STORY_W = 360;
const STORY_H = 640;
const PRIMARY = '#0C7B8E';
const ACCENT = '#E8562A';

const Logo = ({ variant = 'color' }: { variant?: 'white' | 'color' }) => (
  <img src={logoAF} alt="Apartamentos Fortaleza" width={110}
    style={variant === 'white' ? { filter: 'brightness(0) invert(1)' } : undefined} />
);

const formatPrice = (v: number) =>
  v > 0 ? `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : 'Consulte';

export const AFStory2_T2_Curiosity = ({ data, photo }: { data: AFPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#f8f9fa', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: -120, right: -120, width: 380, height: 380, borderRadius: '50%', background: `radial-gradient(circle, ${PRIMARY}18 0%, transparent 70%)` }} />
    <div style={{ position: 'absolute', bottom: -80, left: -80, width: 260, height: 260, borderRadius: '50%', background: `radial-gradient(circle, ${ACCENT}18 0%, transparent 70%)` }} />

    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '52%', overflow: 'hidden' }}>
      {photo ? (
        <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#b2d8df' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 50%, #f8f9fa 100%)' }} />
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <div style={{ backgroundColor: 'white', borderRadius: 12, padding: '6px 12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          <Logo variant="color" />
        </div>
      </div>
    </div>

    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: '48%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px 28px 40px', zIndex: 10 }}>
      <div style={{ backgroundColor: PRIMARY, borderRadius: 30, padding: '5px 18px', marginBottom: 16, alignSelf: 'flex-start' }}>
        <p style={{ color: 'white', fontSize: 10, fontWeight: 700, margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Oportunidade única</p>
      </div>
      <p style={{ color: '#0a1a1e', fontSize: 26, fontWeight: 900, lineHeight: 1.25, margin: '0 0 8px' }}>
        {data.bedrooms > 0 ? `${data.bedrooms} quartos` : 'Apartamento'}{' '}
        <span style={{ color: ACCENT }}>em {data.neighborhood || 'Fortaleza'}</span>
      </p>
      {data.area > 0 && (
        <p style={{ color: '#4b5563', fontSize: 14, margin: '0 0 16px', lineHeight: 1.5 }}>{data.area}m² de espaço e conforto</p>
      )}
      <div style={{ width: 40, height: 3, backgroundColor: ACCENT, borderRadius: 2, marginBottom: 16 }} />
      <p style={{ color: '#6b7280', fontSize: 12, lineHeight: 1.5, margin: 0 }}>Arraste para descobrir todos os detalhes 👇</p>
    </div>

    <div style={{ position: 'absolute', bottom: 18, right: 20, zIndex: 20, backgroundColor: PRIMARY, borderRadius: 20, padding: '4px 12px' }}>
      <p style={{ color: 'white', fontSize: 10, margin: 0, fontWeight: 600 }}>1 / 3</p>
    </div>
  </div>
);

export const AFStory2_T2_Reveal = ({ data, photos }: { data: AFPropertyData; photos?: string[] }) => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const specs = [
    data.bedrooms > 0 && `${data.bedrooms} Quarto${data.bedrooms > 1 ? 's' : ''}`,
    data.area > 0 && `${data.area}m²`,
    data.garageSpaces > 0 && `${data.garageSpaces} Vaga${data.garageSpaces > 1 ? 's' : ''}`,
    data.suites > 0 && `${data.suites} Suíte${data.suites > 1 ? 's' : ''}`,
    data.floor && `${data.floor}° Andar`,
  ].filter(Boolean) as string[];
  const imgs = photos && photos.length > 0 ? photos : [];
  const img = (i: number) => imgs[i] ?? imgs[0] ?? undefined;

  return (
    <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      {/* Top logo bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 20, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
        <Logo variant="color" />
        {data.neighborhood && <div style={{ backgroundColor: `${PRIMARY}18`, borderRadius: 20, padding: '4px 12px' }}>
          <p style={{ color: PRIMARY, fontSize: 10, fontWeight: 700, margin: 0 }}>📍 {data.neighborhood}</p>
        </div>}
      </div>

      {/* Photo grid */}
      <div style={{ position: 'absolute', top: 60, left: 0, right: 0, height: 300 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 3, width: '100%', height: '100%' }}>
          {[0,1,2,3].map((idx) => (
            <div key={idx} style={{ overflow: 'hidden', position: 'relative' }}>
              {img(idx) ? <img src={img(idx)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', backgroundColor: '#b2d8df' }} />}
              {idx === 3 && imgs.length > 4 && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ color: 'white', fontSize: 22, fontWeight: 900, margin: 0 }}>+{imgs.length - 4}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Info bottom */}
      <div style={{ position: 'absolute', top: 360, left: 0, right: 0, bottom: 0, padding: '20px 20px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <p style={{ color: '#0a1a1e', fontSize: 15, fontWeight: 700, margin: '0 0 10px', lineHeight: 1.3 }}>{data.title || 'Apartamento Disponível'}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
          {specs.map((s, i) => (
            <span key={i} style={{ backgroundColor: `${PRIMARY}15`, border: `1px solid ${PRIMARY}33`, borderRadius: 20, padding: '4px 12px', color: PRIMARY, fontSize: 10, fontWeight: 700 }}>{s}</span>
          ))}
        </div>
        <div style={{ backgroundColor: PRIMARY, borderRadius: 14, padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 9, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{data.isRental ? 'Aluguel' : 'Valor de Venda'}</p>
            <p style={{ color: 'white', fontSize: 20, fontWeight: 900, margin: 0, lineHeight: 1 }}>{formatPrice(price)}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            {data.acceptsFinancing && <p style={{ color: '#a7f3d0', fontSize: 10, margin: '0 0 3px', fontWeight: 600 }}>✓ Financiamento</p>}
            {data.acceptsFGTS && <p style={{ color: '#a7f3d0', fontSize: 10, margin: 0, fontWeight: 600 }}>✓ FGTS</p>}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <div style={{ backgroundColor: `${PRIMARY}18`, borderRadius: 20, padding: '3px 12px' }}>
            <p style={{ color: PRIMARY, fontSize: 10, margin: 0, fontWeight: 600 }}>2 / 3</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AFStory2_T2_CTA = ({ data, photo }: { data: AFPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#f0f9fa', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', backgroundColor: `${PRIMARY}15` }} />
    <div style={{ position: 'absolute', bottom: 80, left: -60, width: 200, height: 200, borderRadius: '50%', backgroundColor: `${ACCENT}12` }} />

    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '42%', overflow: 'hidden' }}>
      {photo ? <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', backgroundColor: '#b2d8df' }} />}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), #f0f9fa)' }} />
    </div>

    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: '38%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 28px 36px', zIndex: 10 }}>
      <div style={{ backgroundColor: 'white', borderRadius: 14, padding: '8px 16px', marginBottom: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Logo variant="color" />
      </div>
      <p style={{ color: '#0a1a1e', fontSize: 22, fontWeight: 900, textAlign: 'center', lineHeight: 1.3, margin: '0 0 6px' }}>
        {data.neighborhood ? `Seu apartamento em ${data.neighborhood}` : 'Realize seu sonho'}{' '}
        <span style={{ color: ACCENT }}>está ao seu alcance!</span>
      </p>
      {data.salePrice > 0 && (
        <div style={{ backgroundColor: PRIMARY, borderRadius: 12, padding: '8px 20px', marginBottom: 20 }}>
          <p style={{ color: 'white', fontSize: 16, fontWeight: 900, margin: 0, textAlign: 'center' }}>{formatPrice(data.salePrice)}</p>
        </div>
      )}
      <div style={{ width: '100%', backgroundColor: ACCENT, borderRadius: 16, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12, boxShadow: `0 8px 24px ${ACCENT}40` }}>
        <span style={{ fontSize: 22 }}>📱</span>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 10, margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Fale agora via WhatsApp</p>
          <p style={{ color: 'white', fontSize: 18, fontWeight: 900, margin: 0 }}>{data.brokerPhone || '(85) 9XXXX-XXXX'}</p>
        </div>
      </div>
      {data.brokerName && <p style={{ color: '#6b7280', fontSize: 11, textAlign: 'center', margin: '0 0 4px' }}>{data.brokerName} • Corretor de Imóveis</p>}
      {data.creci && <p style={{ color: '#9ca3af', fontSize: 10, textAlign: 'center', margin: 0 }}>{data.creci}</p>}
    </div>

    <div style={{ position: 'absolute', bottom: 18, right: 20, zIndex: 20, backgroundColor: PRIMARY, borderRadius: 20, padding: '4px 12px' }}>
      <p style={{ color: 'white', fontSize: 10, margin: 0, fontWeight: 600 }}>3 / 3</p>
    </div>
  </div>
);
