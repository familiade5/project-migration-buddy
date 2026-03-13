/**
 * TEMA 2 — "CLEAN LUXURY"
 * Story 1: Curiosidade — foto grande (50%) + texto organizado abaixo
 * Story 2: Revelação   — fotos maiores (68%) + info no rodapé
 * Story 3: CTA         — cabeçalho laranja grande com foto de fundo + contato
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

/* ── Story 1: Curiosidade — foto 50% superior, texto organizado abaixo ────────*/
export const AMStory2_T2_Curiosity = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => (
  <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
    {/* Blue vertical stripe left */}
    <div style={{ position: 'absolute', left: 0, top: 0, width: 6, height: '100%', backgroundColor: '#1B5EA6', zIndex: 5 }} />

    {/* ── FOTO — ocupa 50% superior ── */}
    <div style={{ position: 'absolute', top: 0, left: 6, right: 0, height: '50%', overflow: 'hidden' }}>
      {photo ? (
        <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#e2e8f0' }} />
      )}
      {/* Gradient bottom para integrar */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(255,255,255,0.95) 100%)' }} />
      {/* Orange badge bairro */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16,
        backgroundColor: '#F47920', borderRadius: 8, padding: '5px 12px',
      }}>
        <p style={{ color: 'white', fontSize: 10, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          📍 {data.neighborhood || 'Manaus'}
        </p>
      </div>
      {/* Logo overlay canto superior */}
      <div style={{ position: 'absolute', top: 14, right: 14, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 8, padding: '4px 8px' }}>
        <Logo variant="color" />
      </div>
    </div>

    {/* ── TEXTO — 50% inferior, organizado ── */}
    <div style={{
      position: 'absolute', top: '50%', left: 6, right: 0, bottom: 0,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: '20px 22px 0',
    }}>
      <div>
        {/* Eyebrow */}
        <p style={{
          color: '#1B5EA6', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
          textTransform: 'uppercase', margin: '0 0 8px',
        }}>
          Você sabia que...
        </p>

        {/* Headline */}
        <p style={{ color: '#0f172a', fontSize: 28, fontWeight: 900, lineHeight: 1.2, margin: '0 0 12px' }}>
          É possível{' '}
          <span style={{ color: '#F47920' }}>sair do aluguel</span>{' '}
          em {data.neighborhood || 'Manaus'}?
        </p>

        {/* Divider */}
        <div style={{ width: 40, height: 3, backgroundColor: '#1B5EA6', borderRadius: 2, marginBottom: 12 }} />

        {/* Subtext */}
        <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.55, margin: '0 0 14px' }}>
          Temos um apartamento de{' '}
          <strong style={{ color: '#0f172a' }}>{data.bedrooms > 0 ? `${data.bedrooms} quartos` : 'alta qualidade'}</strong>
          {data.area > 0 ? ` com ${data.area}m²` : ''} que cabe no seu bolso.
        </p>

        {/* Specs rápidas */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {data.bedrooms > 0 && (
            <div style={{ backgroundColor: '#f0f6ff', borderRadius: 8, padding: '5px 10px', border: '1px solid #bfdbfe' }}>
              <span style={{ color: '#1B5EA6', fontSize: 11, fontWeight: 600 }}>🛏 {data.bedrooms} Qto{data.bedrooms > 1 ? 's' : ''}</span>
            </div>
          )}
          {data.area > 0 && (
            <div style={{ backgroundColor: '#f0f6ff', borderRadius: 8, padding: '5px 10px', border: '1px solid #bfdbfe' }}>
              <span style={{ color: '#1B5EA6', fontSize: 11, fontWeight: 600 }}>📐 {data.area}m²</span>
            </div>
          )}
          {data.garageSpaces > 0 && (
            <div style={{ backgroundColor: '#f0f6ff', borderRadius: 8, padding: '5px 10px', border: '1px solid #bfdbfe' }}>
              <span style={{ color: '#1B5EA6', fontSize: 11, fontWeight: 600 }}>🚗 {data.garageSpaces} Vaga{data.garageSpaces > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{
        backgroundColor: '#1B5EA6',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 18px', marginLeft: -22, marginRight: 0,
      }}>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, margin: 0, fontWeight: 600 }}>
          Veja nas próximas ➜
        </p>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 14px' }}>
          <p style={{ color: 'white', fontSize: 11, margin: 0, fontWeight: 700 }}>1 / 3</p>
        </div>
      </div>
    </div>
  </div>
);

/* ── Story 2: Revelação — fotos grandes 68%, info no rodapé ──────────────────*/
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
  ].filter(Boolean) as { label: string; icon: string }[];

  const imgs = photos && photos.length > 0 ? photos : [];
  const img = (i: number) => imgs[i] ?? imgs[0] ?? undefined;

  // Fotos: 68% = 435px
  const PHOTO_H = 435;
  const CARD_TOP = PHOTO_H - 20;

  return (
    <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#f8fafc', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      {/* Blue vertical stripe left */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 6, height: '100%', backgroundColor: '#1B5EA6', zIndex: 5 }} />

      {/* ── Photo grid — 68% da tela ── */}
      <div style={{
        position: 'absolute', top: 0, left: 6, right: 0, height: PHOTO_H,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 3,
      }}>
        {/* Large top-left spanning 2 rows */}
        <div style={{ gridRow: '1 / 3', overflow: 'hidden', position: 'relative' }}>
          {img(0) ? (
            <img src={img(0)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#cbd5e1' }} />
          )}
          {/* Logo overlay */}
          <div style={{ position: 'absolute', top: 14, left: 12, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.88)', borderRadius: 8, padding: '4px 8px' }}>
            <Logo variant="color" />
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
          {imgs.length > 3 && img(3) && (
            <div style={{ position: 'absolute', inset: 0 }}>
              <img src={img(3)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          {imgs.length > 4 && (
            <div style={{
              position: 'absolute', inset: 0, backgroundColor: 'rgba(27,94,166,0.75)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <p style={{ color: 'white', fontSize: 20, fontWeight: 900, margin: 0 }}>+{imgs.length - 3}</p>
            </div>
          )}
        </div>

        {/* Bottom gradient fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 50,
          background: 'linear-gradient(to bottom, transparent, #f8fafc)',
          zIndex: 3,
        }} />

        {/* Orange neighborhood tag */}
        {data.neighborhood && (
          <div style={{
            position: 'absolute', top: 16, right: 8, zIndex: 10,
            backgroundColor: '#F47920', borderRadius: 20, padding: '4px 12px',
            boxShadow: '0 4px 12px rgba(244,121,32,0.4)',
          }}>
            <p style={{ color: 'white', fontSize: 10, fontWeight: 700, margin: 0 }}>📍 {data.neighborhood}</p>
          </div>
        )}
      </div>

      {/* ── Info card — colado no rodapé ── */}
      <div style={{
        position: 'absolute', top: CARD_TOP, left: 6, right: 0, bottom: 0,
        backgroundColor: '#f8fafc', padding: '16px 18px 0',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        {/* Title */}
        <p style={{ color: '#0f172a', fontSize: 13, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.3 }}>
          {data.title || 'Apartamento Disponível'}
        </p>

        {/* Specs grid */}
        {specs.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
            {specs.slice(0, 5).map((s, i) => (
              <div key={i} style={{
                backgroundColor: 'white', borderRadius: 8, padding: '4px 9px',
                border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 4,
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}>
                <span style={{ fontSize: 11 }}>{s.icon}</span>
                <span style={{ color: '#334155', fontSize: 10, fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price block */}
        <div style={{
          backgroundColor: '#1B5EA6', borderRadius: 14, padding: '11px 16px',
          boxShadow: '0 8px 24px rgba(27,94,166,0.25)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {data.isRental ? 'Aluguel mensal' : 'Valor de venda'}
              </p>
              <p style={{ color: 'white', fontSize: 24, fontWeight: 900, margin: 0, lineHeight: 1 }}>
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

        {/* Bottom bar */}
        <div style={{
          backgroundColor: '#1B5EA6',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 18px', marginLeft: -18, marginRight: 0, marginTop: 10,
        }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, margin: 0 }}>apartamentosmanaus.com</p>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 14px' }}>
            <p style={{ color: 'white', fontSize: 11, margin: 0, fontWeight: 700 }}>2 / 3</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Story 3: CTA — quadro laranja grande com foto de fundo ─────────────────*/
export const AMStory2_T2_CTA = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => (
  <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
    {/* Blue vertical stripe left */}
    <div style={{ position: 'absolute', left: 0, top: 0, width: 6, height: '100%', backgroundColor: '#1B5EA6', zIndex: 5 }} />

    {/* ── Top section — laranja grande com foto de fundo, 55% ── */}
    <div style={{
      position: 'absolute', top: 0, left: 6, right: 0, height: '55%',
      backgroundColor: '#F47920', overflow: 'hidden',
    }}>
      {/* Foto de fundo com overlay laranja */}
      {photo && (
        <img src={photo} alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', filter: 'brightness(0.45) saturate(0.6)',
        }} />
      )}
      {/* Overlay laranja semi-transparente sobre a foto */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(145deg, rgba(244,121,32,0.75) 0%, rgba(200,80,0,0.85) 100%)',
      }} />
      {/* Logo no topo centralizada + texto abaixo */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '18px 28px 20px', zIndex: 10, gap: 14,
      }}>
        {/* Logo centralizada no topo da área laranja */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '6px 14px' }}>
          <Logo variant="white" />
        </div>
        {/* Texto */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>
            Pronto para mudar?
          </p>
          <p style={{ color: 'white', fontSize: 30, fontWeight: 900, textAlign: 'center', lineHeight: 1.15, margin: 0, textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
            Realize o seu<br />sonho agora!
          </p>
        </div>
      </div>
    </div>

    {/* ── Bottom section — branco, conteúdo de contato ── */}
    <div style={{ position: 'absolute', top: '55%', left: 6, right: 0, bottom: 0, padding: '14px 22px 0' }}>

      {/* Broker card */}
      <div style={{
        backgroundColor: '#f8fafc', borderRadius: 14, padding: '12px 16px',
        border: '1px solid #e2e8f0', marginBottom: 14,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <p style={{ color: '#64748b', fontSize: 10, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Fale com o corretor</p>
        <p style={{ color: '#0f172a', fontSize: 15, fontWeight: 800, margin: '0 0 2px' }}>{data.brokerName || 'Iury Sampaio'}</p>
        <p style={{ color: '#64748b', fontSize: 11, margin: 0 }}>Creci 3968 PF</p>
      </div>

      {/* WhatsApp button */}
      <div style={{
        backgroundColor: '#25D366', borderRadius: 14, padding: '13px 20px',
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

    {/* Bottom bar */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      backgroundColor: '#1B5EA6',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 20px 10px 26px',
    }}>
      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, margin: 0 }}>apartamentosmanaus.com</p>
      <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 14px' }}>
        <p style={{ color: 'white', fontSize: 11, margin: 0, fontWeight: 700 }}>3 / 3</p>
      </div>
    </div>
  </div>
);
