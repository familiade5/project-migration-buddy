/**
 * TEMA 2 — "CLEAN LUXURY"
 * Story 1: Curiosidade — fundo branco com foto lateral e texto bold
 * Story 2: Revelação   — layout dividido 50/50 foto + info clara
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

    {/* Photo — rounded rect, right side */}
    <div style={{
      position: 'absolute', top: 100, right: 20, width: 220, height: 240,
      borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(27,94,166,0.2)',
    }}>
      {photo ? (
        <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#e2e8f0' }} />
      )}
      {/* Photo overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(27,94,166,0.3) 0%, transparent 60%)',
      }} />
    </div>

    {/* Blurred mini-photo beneath */}
    {photo && (
      <div style={{
        position: 'absolute', top: 360, right: 20, width: 220, height: 100,
        borderRadius: 16, overflow: 'hidden', opacity: 0.5,
        filter: 'blur(4px)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      }}>
        <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '0% 70%' }} />
      </div>
    )}

    {/* Logo top */}
    <div style={{ position: 'absolute', top: 40, left: 48, zIndex: 10 }}>
      <Logo variant="color" />
    </div>

    {/* Main text */}
    <div style={{ position: 'absolute', top: 180, left: 44, right: 28, zIndex: 10 }}>
      <p style={{
        color: '#1B5EA6', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
        textTransform: 'uppercase', margin: '0 0 10px',
      }}>
        Você sabia que...
      </p>
      <p style={{ color: '#0f172a', fontSize: 28, fontWeight: 900, lineHeight: 1.2, margin: '0 0 16px' }}>
        É possível<br />
        <span style={{ color: '#F47920' }}>sair do aluguel</span><br />
        em {data.neighborhood || 'Manaus'}?
      </p>
      <div style={{ width: 36, height: 3, backgroundColor: '#1B5EA6', borderRadius: 2, marginBottom: 16 }} />
      <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.5, margin: 0 }}>
        Temos um apartamento de{' '}
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

/* ── Story 2: Revelação ──────────────────────────────────────────────────────*/
export const AMStory2_T2_Reveal = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const specs = [
    data.bedrooms > 0 && { label: `${data.bedrooms} Qto${data.bedrooms > 1 ? 's' : ''}`, icon: '🛏' },
    data.bathrooms > 0 && { label: `${data.bathrooms} Banheiro${data.bathrooms > 1 ? 's' : ''}`, icon: '🚿' },
    data.area > 0 && { label: `${data.area} m²`, icon: '📐' },
    data.garageSpaces > 0 && { label: `${data.garageSpaces} Vaga${data.garageSpaces > 1 ? 's' : ''}`, icon: '🚗' },
    data.floor && { label: `${data.floor}° Andar`, icon: '🏢' },
    data.furnished && { label: 'Mobiliado', icon: '✨' },
  ].filter(Boolean) as { label: string; icon: string }[];

  return (
    <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#f8fafc', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      {/* Blue vertical stripe left */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 28, height: '100%', backgroundColor: '#1B5EA6' }} />

      {/* Photo top half */}
      <div style={{ position: 'absolute', top: 0, left: 28, right: 0, height: 280, overflow: 'hidden' }}>
        {photo ? (
          <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#cbd5e1' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, #f8fafc 100%)' }} />
        {/* Logo on photo */}
        <div style={{ position: 'absolute', top: 20, left: 16, zIndex: 10 }}>
          <Logo variant="white" />
        </div>
        {/* Neighborhood badge */}
        {data.neighborhood && (
          <div style={{
            position: 'absolute', bottom: 20, right: 16, zIndex: 10,
            backgroundColor: '#F47920', borderRadius: 20, padding: '5px 14px',
            boxShadow: '0 4px 12px rgba(244,121,32,0.4)',
          }}>
            <p style={{ color: 'white', fontSize: 11, fontWeight: 700, margin: 0 }}>📍 {data.neighborhood}</p>
          </div>
        )}
      </div>

      {/* Info section */}
      <div style={{ position: 'absolute', top: 260, left: 44, right: 20 }}>
        {/* Title */}
        <p style={{ color: '#0f172a', fontSize: 16, fontWeight: 800, margin: '0 0 12px', lineHeight: 1.3 }}>
          {data.title || 'Apartamento Disponível'}
        </p>

        {/* Specs grid */}
        {specs.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 14 }}>
            {specs.slice(0, 4).map((s, i) => (
              <div key={i} style={{
                backgroundColor: 'white', borderRadius: 10, padding: '7px 10px',
                border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                <span style={{ fontSize: 14 }}>{s.icon}</span>
                <span style={{ color: '#334155', fontSize: 11, fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price block */}
        <div style={{
          backgroundColor: '#1B5EA6', borderRadius: 16, padding: '14px 18px',
          boxShadow: '0 8px 24px rgba(27,94,166,0.25)',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {data.isRental ? 'Aluguel mensal' : 'Valor de venda'}
          </p>
          <p style={{ color: 'white', fontSize: 28, fontWeight: 900, margin: '0 0 6px', lineHeight: 1 }}>
            {formatPrice(price)}
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {data.acceptsFinancing && (
              <span style={{ backgroundColor: 'rgba(134,239,172,0.2)', border: '1px solid rgba(134,239,172,0.4)', borderRadius: 20, padding: '2px 10px', color: '#86efac', fontSize: 10, fontWeight: 600 }}>
                ✓ Financiamento
              </span>
            )}
            {data.acceptsFGTS && (
              <span style={{ backgroundColor: 'rgba(134,239,172,0.2)', border: '1px solid rgba(134,239,172,0.4)', borderRadius: 20, padding: '2px 10px', color: '#86efac', fontSize: 10, fontWeight: 600 }}>
                ✓ FGTS
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
        backgroundColor: '#1B5EA6',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px 0 48px',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, margin: 0 }}>Minha Casa Minha Vida</p>
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
