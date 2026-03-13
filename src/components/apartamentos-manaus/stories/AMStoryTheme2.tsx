/**
 * TEMA 2 — "CLEAN LUXURY"
 * Story 1: Curiosidade — fundo branco com foto lateral e texto bold
 * Story 2: Revelação   — grade de 4 fotos moderno + info clara
 * Story 3: CTA         — branco + laranja, elegante e premium
 */

import { AMPropertyData } from '@/types/apartamentosManaus';
import logoAM from '@/assets/logo-apartamentos-manaus.png';

const STORY_W = 360;
const STORY_H = 640;

const Logo = ({ variant = 'color' }: { variant?: 'white' | 'color' }) => (
  <img
    src={logoAM}
    alt="Apartamentos Manaus"
    width={100}
    style={variant === 'white' ? { filter: 'brightness(0) invert(1)' } : undefined}
  />
);

const formatPrice = (v: number) =>
  v > 0
    ? `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    : 'Consulte';

/* ── Story 1: Curiosidade ─────────────────────────────────────────────────────*/
export const AMStory2_T2_Curiosity = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => (
  <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
    {/* Blue vertical stripe left */}
    <div style={{ position: 'absolute', left: 0, top: 0, width: 28, height: '100%', backgroundColor: '#1B5EA6' }} />

    {/* Orange accent top-right corner */}
    <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 180, height: 180,
        borderRadius: '50%', backgroundColor: '#F47920', opacity: 0.12,
      }} />
    </div>

    {/* Photo — rounded rect, visible and clear */}
    <div style={{
      position: 'absolute', top: 100, right: 20, width: 220, height: 260,
      borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(27,94,166,0.25)',
    }}>
      {photo ? (
        <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#e2e8f0' }} />
      )}
      {/* Subtle blue overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(27,94,166,0.15) 0%, transparent 60%)',
      }} />
      {/* Orange corner badge */}
      <div style={{
        position: 'absolute', bottom: 12, left: 12,
        backgroundColor: '#F47920', borderRadius: 8, padding: '4px 10px',
      }}>
        <p style={{ color: 'white', fontSize: 9, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          📍 {data.neighborhood || 'Manaus'}
        </p>
      </div>
    </div>

    {/* Logo top */}
    <div style={{ position: 'absolute', top: 40, left: 48, zIndex: 10 }}>
      <Logo variant="color" />
    </div>

    {/* Main text */}
    <div style={{ position: 'absolute', top: 190, left: 44, right: 252, zIndex: 10 }}>
      <p style={{
        color: '#1B5EA6', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
        textTransform: 'uppercase', margin: '0 0 10px',
      }}>
        Você sabia que...
      </p>
      <p style={{ color: '#0f172a', fontSize: 26, fontWeight: 900, lineHeight: 1.2, margin: '0 0 16px' }}>
        É possível<br />
        <span style={{ color: '#F47920' }}>sair do aluguel</span><br />
        em {data.neighborhood || 'Manaus'}?
      </p>
      <div style={{ width: 36, height: 3, backgroundColor: '#1B5EA6', borderRadius: 2, marginBottom: 14 }} />
      <p style={{ color: '#64748b', fontSize: 12, lineHeight: 1.5, margin: 0 }}>
        Temos um apart. de{' '}
        {data.bedrooms > 0 ? `${data.bedrooms} quartos` : 'alta qualidade'} que cabe no seu bolso.
      </p>
    </div>

    {/* Bottom strip */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
      backgroundColor: '#1B5EA6',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px 0 48px',
    }}>
      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, margin: 0, fontWeight: 600 }}>
        Veja nas próximas ➜
      </p>
      <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 14px' }}>
        <p style={{ color: 'white', fontSize: 11, margin: 0, fontWeight: 700 }}>1 / 3</p>
      </div>
    </div>
  </div>
);

/* ── Story 2: Revelação — 4-photo modern grid ────────────────────────────────*/
export const AMStory2_T2_Reveal = ({
  data,
  photos,
}: {
  data: AMPropertyData;
  photos?: string[];
}) => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const specs = [
    data.bedrooms > 0 && { label: `${data.bedrooms} Qto${data.bedrooms > 1 ? 's' : ''}`, icon: '🛏' },
    data.bathrooms > 0 && { label: `${data.bathrooms} Banh.`, icon: '🚿' },
    data.area > 0 && { label: `${data.area} m²`, icon: '📐' },
    data.garageSpaces > 0 && { label: `${data.garageSpaces} Vaga${data.garageSpaces > 1 ? 's' : ''}`, icon: '🚗' },
    data.floor && { label: `${data.floor}° And.`, icon: '🏢' },
    data.furnished && { label: 'Mobiliado', icon: '✨' },
  ].filter(Boolean) as { label: string; icon: string }[];

  const imgs = photos && photos.length > 0 ? photos : [];
  const img = (i: number) => imgs[i] ?? imgs[0] ?? undefined;

  return (
    <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#f8fafc', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      {/* Blue vertical stripe left */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 6, height: '100%', backgroundColor: '#1B5EA6' }} />

      {/* ── Photo grid — top 52% ── */}
      <div style={{ position: 'absolute', top: 0, left: 6, right: 0, height: 332, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 3 }}>
        {/* Large top-left photo spanning 2 rows */}
        <div style={{ gridRow: '1 / 3', overflow: 'hidden', position: 'relative' }}>
          {img(0) ? (
            <img src={img(0)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#cbd5e1' }} />
          )}
          {/* Logo overlay */}
          <div style={{ position: 'absolute', top: 14, left: 12, zIndex: 10 }}>
            <Logo variant="white" />
          </div>
        </div>

        {/* Top-right photo */}
        <div style={{ overflow: 'hidden', position: 'relative' }}>
          {img(1) ? (
            <img src={img(1)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#e2e8f0' }} />
          )}
        </div>

        {/* Bottom-right photo */}
        <div style={{ overflow: 'hidden', position: 'relative' }}>
          {img(2) ? (
            <img src={img(2)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#e2e8f0' }} />
          )}
          {/* "+N more" overlay */}
          {imgs.length > 4 && (
            <div style={{
              position: 'absolute', inset: 0, backgroundColor: 'rgba(27,94,166,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <p style={{ color: 'white', fontSize: 20, fontWeight: 900, margin: 0 }}>+{imgs.length - 3}</p>
            </div>
          )}
        </div>
      </div>

      {/* Orange neighborhood tag */}
      {data.neighborhood && (
        <div style={{
          position: 'absolute', top: 300, right: 8, zIndex: 20,
          backgroundColor: '#F47920', borderRadius: 20, padding: '4px 12px',
          boxShadow: '0 4px 12px rgba(244,121,32,0.4)',
        }}>
          <p style={{ color: 'white', fontSize: 10, fontWeight: 700, margin: 0 }}>📍 {data.neighborhood}</p>
        </div>
      )}

      {/* Info section */}
      <div style={{ position: 'absolute', top: 340, left: 16, right: 12 }}>
        {/* Title */}
        <p style={{ color: '#0f172a', fontSize: 14, fontWeight: 800, margin: '0 0 10px', lineHeight: 1.3 }}>
          {data.title || 'Apartamento Disponível'}
        </p>

        {/* Specs grid */}
        {specs.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
            {specs.slice(0, 5).map((s, i) => (
              <div key={i} style={{
                backgroundColor: 'white', borderRadius: 8, padding: '5px 9px',
                border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 4,
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}>
                <span style={{ fontSize: 12 }}>{s.icon}</span>
                <span style={{ color: '#334155', fontSize: 10, fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price block */}
        <div style={{
          backgroundColor: '#1B5EA6', borderRadius: 14, padding: '12px 16px',
          boxShadow: '0 8px 24px rgba(27,94,166,0.25)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {data.isRental ? 'Aluguel mensal' : 'Valor de venda'}
              </p>
              <p style={{ color: 'white', fontSize: 26, fontWeight: 900, margin: 0, lineHeight: 1 }}>
                {formatPrice(price)}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
              {data.acceptsFinancing && (
                <span style={{ backgroundColor: 'rgba(134,239,172,0.2)', border: '1px solid rgba(134,239,172,0.4)', borderRadius: 20, padding: '2px 8px', color: '#86efac', fontSize: 9, fontWeight: 600 }}>
                  ✓ Financiamento
                </span>
              )}
              {data.acceptsFGTS && (
                <span style={{ backgroundColor: 'rgba(134,239,172,0.2)', border: '1px solid rgba(134,239,172,0.4)', borderRadius: 20, padding: '2px 8px', color: '#86efac', fontSize: 9, fontWeight: 600 }}>
                  ✓ FGTS
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 52,
        backgroundColor: '#1B5EA6',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px 0 16px',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, margin: 0 }}>apartamentosmanaus.com</p>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 14px' }}>
          <p style={{ color: 'white', fontSize: 11, margin: 0, fontWeight: 700 }}>2 / 3</p>
        </div>
      </div>
    </div>
  );
};

/* ── Story 3: CTA ────────────────────────────────────────────────────────────*/
export const AMStory2_T2_CTA = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => (
  <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
    {/* Blue vertical stripe left */}
    <div style={{ position: 'absolute', left: 0, top: 0, width: 28, height: '100%', backgroundColor: '#1B5EA6' }} />

    {/* Top section — orange */}
    <div style={{
      position: 'absolute', top: 0, left: 28, right: 0, height: 220,
      backgroundColor: '#F47920', overflow: 'hidden',
    }}>
      {photo && (
        <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4) saturate(0.5)', mixBlendMode: 'multiply' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 24px' }}>
        <p style={{ color: 'white', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px', opacity: 0.9 }}>
          Pronto para mudar?
        </p>
        <p style={{ color: 'white', fontSize: 30, fontWeight: 900, textAlign: 'center', lineHeight: 1.2, margin: 0 }}>
          Realize o seu<br />sonho agora!
        </p>
      </div>
    </div>

    {/* Middle content */}
    <div style={{ position: 'absolute', top: 232, left: 44, right: 20 }}>
      {/* Logo */}
      <div style={{ marginBottom: 16 }}>
        <Logo variant="color" />
      </div>

      {/* Broker card */}
      <div style={{
        backgroundColor: '#f8fafc', borderRadius: 16, padding: '14px 16px',
        border: '1px solid #e2e8f0', marginBottom: 16,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <p style={{ color: '#64748b', fontSize: 10, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Fale com o corretor</p>
        <p style={{ color: '#0f172a', fontSize: 15, fontWeight: 800, margin: '0 0 2px' }}>{data.brokerName || 'Iury Sampaio'}</p>
        <p style={{ color: '#64748b', fontSize: 11, margin: 0 }}>Creci 3968 PF</p>
      </div>

      {/* WhatsApp button */}
      <div style={{
        backgroundColor: '#25D366', borderRadius: 14, padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12,
        boxShadow: '0 6px 20px rgba(37,211,102,0.35)',
      }}>
        <span style={{ fontSize: 20 }}>💬</span>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 10, margin: '0 0 1px', letterSpacing: '0.06em' }}>WhatsApp</p>
          <p style={{ color: 'white', fontSize: 17, fontWeight: 900, margin: 0 }}>{data.brokerPhone || '(92) 9XXXX-XXXX'}</p>
        </div>
      </div>

      {/* Website */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: 11, margin: '0 0 2px' }}>🌐 www.apartamentosmanaus.com</p>
        <p style={{ color: '#94a3b8', fontSize: 10, margin: 0 }}>facebook.com/ApartamentosManaus</p>
      </div>
    </div>

    {/* Bottom */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
      backgroundColor: '#1B5EA6',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px 0 48px',
    }}>
      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, margin: 0 }}>apartamentosmanaus.com</p>
      <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 14px' }}>
        <p style={{ color: 'white', fontSize: 11, margin: 0, fontWeight: 700 }}>3 / 3</p>
      </div>
    </div>
  </div>
);
