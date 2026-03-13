/**
 * TEMA 1 — "ENIGMA"
 * Story 1: Curiosidade — fundo escuro + foto borrada + pergunta provocativa
 * Story 2: Revelação   — galeria moderna 4+ fotos + preço
 * Story 3: CTA         — gradiente azul + chamada de ação vibrante
 */

import { AMPropertyData } from '@/types/apartamentosManaus';
import logoAM from '@/assets/logo-apartamentos-manaus.png';

const STORY_W = 360;
const STORY_H = 640;

const Logo = ({ variant = 'white' }: { variant?: 'white' | 'color' }) => (
  <img
    src={logoAM}
    alt="Apartamentos Manaus"
    width={110}
    style={variant === 'white' ? { filter: 'brightness(0) invert(1)' } : undefined}
  />
);

const formatPrice = (v: number) =>
  v > 0
    ? `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    : 'Consulte';

/* ── Story 1: Curiosidade ───────────────────────────────────────────────────── */
export const AMStory1_T1_Curiosity = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => (
  <div
    style={{
      position: 'relative',
      width: STORY_W,
      height: STORY_H,
      backgroundColor: '#0a0f1e',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden',
    }}
  >
    {/* Background photo — heavily blurred & dark */}
    {photo && (
      <img
        src={photo}
        alt=""
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', filter: 'blur(14px) brightness(0.25)', transform: 'scale(1.1)',
        }}
      />
    )}

    {/* Radial glow — blue center */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse 70% 50% at 50% 60%, rgba(27,94,166,0.45) 0%, transparent 70%)',
    }} />

    {/* Top logo */}
    <div style={{ position: 'absolute', top: 40, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
      <Logo variant="white" />
    </div>

    {/* Center content */}
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '0 32px', zIndex: 10,
    }}>
      {/* Eyebrow */}
      <div style={{
        backgroundColor: '#F47920', borderRadius: 30, padding: '5px 20px', marginBottom: 24,
        fontSize: 11, fontWeight: 700, color: 'white', letterSpacing: '0.15em', textTransform: 'uppercase',
      }}>
        Você viu esse imóvel?
      </div>

      {/* Main question */}
      <p style={{
        color: 'white', fontSize: 34, fontWeight: 900, textAlign: 'center',
        lineHeight: 1.15, margin: '0 0 20px',
        textShadow: '0 2px 20px rgba(0,0,0,0.6)',
      }}>
        {data.bedrooms > 0 ? `${data.bedrooms} quartos` : 'Apartamento'}{' '}
        <span style={{ color: '#F47920' }}>em {data.neighborhood || 'Manaus'}</span> por um preço que vai te surpreender
      </p>

      {/* Divider */}
      <div style={{ width: 48, height: 3, backgroundColor: '#F47920', borderRadius: 2, margin: '0 0 20px' }} />

      {/* Tease */}
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
        Deslize para ver o imóvel completo 👇
      </p>
    </div>

    {/* Photo teaser strip at bottom — clear, not blurred */}
    {photo && (
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 160, overflow: 'hidden', zIndex: 5,
      }}>
        <img
          src={photo}
          alt=""
          style={{
            width: '100%', height: 220, objectFit: 'cover', objectPosition: 'center',
            filter: 'brightness(0.7)', marginTop: -60,
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, #0a0f1e 0%, transparent 40%, transparent 100%)',
        }} />
        {/* Subtle "ver mais" label */}
        <div style={{
          position: 'absolute', bottom: 16, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10,
        }}>
          <div style={{
            backgroundColor: 'rgba(244,121,32,0.85)', borderRadius: 20, padding: '4px 16px',
            backdropFilter: 'blur(8px)',
          }}>
            <p style={{ color: 'white', fontSize: 10, fontWeight: 700, margin: 0, letterSpacing: '0.1em' }}>
              VER IMÓVEL ↑
            </p>
          </div>
        </div>
      </div>
    )}

    {/* Bottom bar */}
    <div style={{
      position: 'absolute', bottom: 32, left: 32, right: 32, zIndex: 20,
      display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
    }}>
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20,
        padding: '5px 14px', border: '1px solid rgba(255,255,255,0.15)',
      }}>
        <p style={{ color: 'white', fontSize: 11, margin: 0, fontWeight: 600 }}>1 / 3</p>
      </div>
    </div>
  </div>
);

/* ── Story 2: Revelação — multi-photo gallery ───────────────────────────────── */
export const AMStory1_T1_Reveal = ({
  data,
  photos,
}: {
  data: AMPropertyData;
  photos?: string[];
}) => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const specs = [
    data.bedrooms > 0 && `${data.bedrooms} Quarto${data.bedrooms > 1 ? 's' : ''}`,
    data.area > 0 && `${data.area}m²`,
    data.garageSpaces > 0 && `${data.garageSpaces} Vaga${data.garageSpaces > 1 ? 's' : ''}`,
    data.floor && `${data.floor}° Andar`,
  ].filter(Boolean) as string[];

  const imgs = photos && photos.length > 0 ? photos : [];
  const img = (i: number) => imgs[i] ?? imgs[0] ?? undefined;

  return (
    <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#0a0f1e', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>

      {/* ── Photo gallery — top 54% ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 346, zIndex: 1 }}>

        {/* Main large photo — left 58% */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: 208, height: 346, overflow: 'hidden' }}>
          {img(0) ? (
            <img src={img(0)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#1e293b' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, #0a0f1e 100%)' }} />
        </div>

        {/* Right column — 3 small photos stacked */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: 148, height: 346, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[1, 2, 3].map((idx) => (
            <div key={idx} style={{ flex: 1, overflow: 'hidden' }}>
              {img(idx) ? (
                <img src={img(idx)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: idx === 1 ? '#1e293b' : idx === 2 ? '#172033' : '#111827' }} />
              )}
            </div>
          ))}
          {/* "+N" badge on last if more photos */}
          {imgs.length > 4 && (
            <div style={{
              position: 'absolute', bottom: 0, right: 0, width: 148, height: '33.3%',
              backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <p style={{ color: 'white', fontSize: 18, fontWeight: 900, margin: 0 }}>+{imgs.length - 4}</p>
            </div>
          )}
        </div>

        {/* Top overlay: logo + neighborhood badge */}
        <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
          <Logo variant="white" />
        </div>
        {data.neighborhood && (
          <div style={{
            position: 'absolute', top: 16, right: 8, zIndex: 10,
            backgroundColor: '#F47920', borderRadius: 20, padding: '4px 12px',
          }}>
            <p style={{ color: 'white', fontSize: 10, fontWeight: 700, margin: 0 }}>📍 {data.neighborhood}</p>
          </div>
        )}

        {/* Gradient bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
          background: 'linear-gradient(to bottom, transparent, #0a0f1e)',
        }} />
      </div>

      {/* ── Info card — bottom 46% ── */}
      <div style={{
        position: 'absolute', top: 330, left: 16, right: 16, zIndex: 20,
        backgroundColor: '#111827', borderRadius: 20, padding: '18px 20px',
        border: '1px solid rgba(27,94,166,0.3)',
        boxShadow: '0 0 40px rgba(27,94,166,0.15)',
      }}>
        {/* Title */}
        <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 10px', lineHeight: 1.3 }}>
          {data.title || 'Apartamento Disponível'}
        </p>

        {/* Specs pills */}
        {specs.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
            {specs.map((s, i) => (
              <span key={i} style={{
                backgroundColor: 'rgba(27,94,166,0.25)', border: '1px solid rgba(27,94,166,0.4)',
                borderRadius: 20, padding: '3px 10px', color: '#93c5fd', fontSize: 10, fontWeight: 600,
              }}>
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div style={{
          backgroundColor: '#1B5EA6', borderRadius: 14, padding: '10px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {data.isRental ? 'Aluguel' : 'Valor de Venda'}
            </p>
            <p style={{ color: 'white', fontSize: 22, fontWeight: 900, margin: 0, lineHeight: 1 }}>
              {formatPrice(price)}
            </p>
          </div>
          {(data.acceptsFinancing || data.acceptsFGTS) && (
            <div style={{ textAlign: 'right' }}>
              {data.acceptsFinancing && (
                <p style={{ color: '#86efac', fontSize: 10, margin: '0 0 2px', fontWeight: 600 }}>✓ Financiamento</p>
              )}
              {data.acceptsFGTS && (
                <p style={{ color: '#86efac', fontSize: 10, margin: 0, fontWeight: 600 }}>✓ FGTS</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom counter */}
      <div style={{
        position: 'absolute', bottom: 14, right: 24, zIndex: 30,
      }}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '4px 12px', border: '1px solid rgba(255,255,255,0.15)' }}>
          <p style={{ color: 'white', fontSize: 11, margin: 0, fontWeight: 600 }}>2 / 3</p>
        </div>
      </div>
    </div>
  );
};

/* ── Story 3: CTA ────────────────────────────────────────────────────────────── */
export const AMStory1_T1_CTA = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => (
  <div style={{ position: 'relative', width: STORY_W, height: STORY_H, fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
    {/* Background */}
    {photo && (
      <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35)' }} />
    )}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(160deg, #0a1628 0%, #1B5EA6 50%, #0a1628 100%)',
      opacity: photo ? 0.85 : 1,
    }} />

    {/* Geometric accent circles */}
    <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%', border: '2px solid rgba(244,121,32,0.2)', zIndex: 2 }} />
    <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', border: '2px solid rgba(244,121,32,0.35)', zIndex: 2 }} />
    <div style={{ position: 'absolute', bottom: -100, left: -60, width: 300, height: 300, borderRadius: '50%', border: '2px solid rgba(27,94,166,0.25)', zIndex: 2 }} />

    {/* Content */}
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10,
      display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 28px 40px',
    }}>
      {/* Logo */}
      <Logo variant="white" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Tag */}
        <div style={{
          backgroundColor: 'rgba(244,121,32,0.15)', border: '1px solid rgba(244,121,32,0.5)',
          borderRadius: 30, padding: '5px 20px', marginBottom: 20,
        }}>
          <p style={{ color: '#F47920', fontSize: 11, fontWeight: 700, margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Não perca essa oportunidade
          </p>
        </div>

        {/* Headline */}
        <p style={{
          color: 'white', fontSize: 30, fontWeight: 900, textAlign: 'center', lineHeight: 1.2, margin: '0 0 8px',
        }}>
          Garanta o seu
        </p>
        <p style={{
          color: '#F47920', fontSize: 34, fontWeight: 900, textAlign: 'center', lineHeight: 1.1, margin: '0 0 28px',
        }}>
          apartamento hoje!
        </p>

        {/* Address */}
        {data.address && (
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 16px',
            marginBottom: 24, width: '100%',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Endereço</p>
            <p style={{ color: 'white', fontSize: 12, margin: 0, lineHeight: 1.4 }}>{data.address}</p>
          </div>
        )}

        {/* Phone CTA */}
        <div style={{
          width: '100%', backgroundColor: '#F47920', borderRadius: 16, padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16,
          boxShadow: '0 8px 24px rgba(244,121,32,0.4)',
        }}>
          <span style={{ fontSize: 22 }}>📱</span>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Fale agora via WhatsApp</p>
            <p style={{ color: 'white', fontSize: 18, fontWeight: 900, margin: 0 }}>{data.brokerPhone || '(92) 9XXXX-XXXX'}</p>
          </div>
        </div>

        {/* Broker */}
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, textAlign: 'center', margin: '0 0 4px' }}>
          {data.brokerName || 'Iury Sampaio'} • Corretor de Imóveis
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, textAlign: 'center', margin: 0 }}>
          Creci 3968 PF
        </p>
      </div>

      {/* Bottom counter */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '5px 14px', border: '1px solid rgba(255,255,255,0.15)' }}>
        <p style={{ color: 'white', fontSize: 11, margin: 0, fontWeight: 600 }}>3 / 3</p>
      </div>
    </div>
  </div>
);
