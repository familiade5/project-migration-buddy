/**
 * TEMA 3 — "URGÊNCIA URBANA"
 * Story 1: Curiosidade — foto dramática mais clara + texto impactante sem "unidades limitadas"
 * Story 2: Revelação   — fotos maiores (68%) + card azul no rodapé
 * Story 3: CTA         — sem "oportunidade única" + contato honesto
 */

import { AMPropertyData } from '@/types/apartamentosManaus';
import logoAM from '@/assets/logo-apartamentos-manaus.png';
import { AMStoryRevealSlide } from './AMStoryRevealSlide';

const STORY_W = 360;
const STORY_H = 640;

const Logo = ({ variant = 'white' }: { variant?: 'white' | 'color' }) => (
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
export const AMStory3_T3_Curiosity = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => (
  <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#0c0c0c', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
    {/* Full bleed photo — sombra mais clara para a foto aparecer */}
    {photo && (
      <img src={photo} alt="" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover',
        // brightness mais alto = imagem mais visível
        filter: 'brightness(0.62) contrast(1.05)',
      }} />
    )}

    {/* Gradient top dark — apenas no topo para o logo */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)' }} />
    {/* Gradient bottom dark — para o texto */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '48%', background: 'linear-gradient(to top, rgba(0,0,0,0.92), transparent)' }} />

    {/* Orange diagonal stripe accent */}
    <div style={{
      position: 'absolute', top: -20, left: -60, width: 220, height: 28,
      backgroundColor: '#F47920', transform: 'rotate(-3deg)', zIndex: 5, opacity: 0.9,
    }} />
    <div style={{
      position: 'absolute', top: 14, left: -80, width: 280, height: 12,
      backgroundColor: '#F47920', transform: 'rotate(-3deg)', zIndex: 5, opacity: 0.4,
    }} />

    {/* Top section — logo */}
    <div style={{ position: 'absolute', top: 50, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
      <Logo variant="white" />
    </div>

    {/* Main dramatic text */}
    <div style={{
      position: 'absolute', bottom: 100, left: 24, right: 24, zIndex: 10,
    }}>
      {/* Alert pill — sem "unidades limitadas", frase relevante para o cliente */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        backgroundColor: '#F47920', borderRadius: 30, padding: '5px 16px', marginBottom: 16,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'white' }} />
        <p style={{ color: 'white', fontSize: 10, fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          {data.neighborhood ? `Imóvel em ${data.neighborhood}` : 'Imóvel especial para você'}
        </p>
      </div>

      {/* Big statement */}
      <p style={{
        color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 6px',
        textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8,
      }}>
        {data.neighborhood || 'Manaus'} — {data.city || 'AM'}
      </p>
      <p style={{
        color: 'white', fontSize: 36, fontWeight: 900, lineHeight: 1.1, margin: '0 0 16px',
        textShadow: '0 2px 20px rgba(0,0,0,0.5)',
      }}>
        O imóvel que{' '}
        <span style={{ color: '#F47920' }}>
          você procura
        </span>
      </p>

      {/* Subtext */}
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 16px',
        border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
          {data.bedrooms > 0 ? `${data.bedrooms} quartos` : 'Apartamento'}
          {data.area > 0 ? ` • ${data.area}m²` : ''}
          {data.neighborhood ? ` • ${data.neighborhood}` : ''}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: '6px 0 0' }}>
          Veja o preço na próxima story 👀
        </p>
      </div>
    </div>

    {/* Bottom bar */}
    <div style={{
      position: 'absolute', bottom: 30, left: 24, right: 24, zIndex: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', gap: 4 }}>
        <div style={{ width: 32, height: 3, borderRadius: 2, backgroundColor: '#F47920' }} />
        <div style={{ width: 32, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' }} />
        <div style={{ width: 32, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' }} />
      </div>
      <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '4px 12px', border: '1px solid rgba(255,255,255,0.15)' }}>
        <p style={{ color: 'white', fontSize: 10, margin: 0, fontWeight: 600 }}>1 / 3</p>
      </div>
    </div>
  </div>
);

/* ── Story 2: Revelação — fotos maiores (68%) + card no rodapé ───────────────*/
export const AMStory3_T3_Reveal = ({
  data,
  photos,
}: {
  data: AMPropertyData;
  photos?: string[];
}) => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const imgs = photos && photos.length > 0 ? photos : [];
  const img = (i: number) => imgs[i] ?? imgs[0] ?? undefined;

  // Fotos 68% = 435px
  const PHOTO_H = 435;
  const CARD_TOP = PHOTO_H - 20;

  return (
    <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#0c0c0c', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>

      {/* ── 4-photo mosaic — 68% da tela ── */}
      {/* Top row: 2 equal photos */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: Math.round(PHOTO_H * 0.46), display: 'flex', gap: 2 }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {img(0) ? (
            <img src={img(0)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85)' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#1a1a2e' }} />
          )}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {img(1) ? (
            <img src={img(1)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85)' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#16213e' }} />
          )}
        </div>
      </div>

      {/* Bottom row: 1 wide + 1 normal */}
      <div style={{ position: 'absolute', top: Math.round(PHOTO_H * 0.46) + 2, left: 0, right: 0, height: Math.round(PHOTO_H * 0.54) - 2, display: 'flex', gap: 2 }}>
        <div style={{ flex: 2, overflow: 'hidden' }}>
          {img(2) ? (
            <img src={img(2)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85)' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#0f3460' }} />
          )}
        </div>
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {img(3) ? (
            <img src={img(3)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85)' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#533483' }} />
          )}
          {imgs.length > 4 && (
            <div style={{
              position: 'absolute', inset: 0, backgroundColor: 'rgba(244,121,32,0.75)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <p style={{ color: 'white', fontSize: 22, fontWeight: 900, margin: 0 }}>+{imgs.length - 4}</p>
            </div>
          )}
        </div>
      </div>

      {/* Gradient fade bottom das fotos */}
      <div style={{
        position: 'absolute', top: PHOTO_H - 60, left: 0, right: 0, height: 60,
        background: 'linear-gradient(to bottom, transparent, #0c0c0c)',
        zIndex: 3,
      }} />

      {/* Top overlay: logo + neighborhood tag */}
      <div style={{ position: 'absolute', top: 18, left: 16, right: 16, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo variant="white" />
        {data.neighborhood && (
          <div style={{ backgroundColor: '#F47920', borderRadius: 20, padding: '5px 12px' }}>
            <p style={{ color: 'white', fontSize: 10, fontWeight: 700, margin: 0 }}>📍 {data.neighborhood}</p>
          </div>
        )}
      </div>

      {/* ── Card info — rodapé ── */}
      <div style={{
        position: 'absolute', top: CARD_TOP, left: 12, right: 12, bottom: 12, zIndex: 20,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        {/* Property name */}
        <p style={{ color: 'white', fontSize: 14, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.3 }}>
          {data.title || 'Apartamento Disponível'}
        </p>

        {/* Specs row */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
          {data.bedrooms > 0 && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 10, padding: '4px 10px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <p style={{ color: 'white', fontSize: 10, fontWeight: 600, margin: 0 }}>🛏 {data.bedrooms} Qto{data.bedrooms > 1 ? 's' : ''}</p>
            </div>
          )}
          {data.area > 0 && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 10, padding: '4px 10px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <p style={{ color: 'white', fontSize: 10, fontWeight: 600, margin: 0 }}>📐 {data.area}m²</p>
            </div>
          )}
          {data.garageSpaces > 0 && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 10, padding: '4px 10px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <p style={{ color: 'white', fontSize: 10, fontWeight: 600, margin: 0 }}>🚗 {data.garageSpaces} Vaga{data.garageSpaces > 1 ? 's' : ''}</p>
            </div>
          )}
          {data.floor && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 10, padding: '4px 10px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <p style={{ color: 'white', fontSize: 10, fontWeight: 600, margin: 0 }}>🏢 {data.floor}° And.</p>
            </div>
          )}
        </div>

        {/* Price — big highlight */}
        <div style={{
          background: 'linear-gradient(135deg, #1B5EA6 0%, #0d3b6e 100%)',
          borderRadius: 16, padding: '13px 18px',
          border: '1px solid rgba(27,94,166,0.5)',
          boxShadow: '0 8px 32px rgba(27,94,166,0.4)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {data.isRental ? 'Aluguel' : 'Valor de Venda'}
              </p>
              <p style={{ color: 'white', fontSize: 28, fontWeight: 900, margin: 0, lineHeight: 1 }}>
                {formatPrice(price)}
              </p>
            </div>
            {data.subsidy > 0 && (
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9, margin: '0 0 2px', textTransform: 'uppercase' }}>Subsídio até</p>
                <p style={{ color: '#86efac', fontSize: 14, fontWeight: 800, margin: 0 }}>{formatPrice(data.subsidy)}</p>
              </div>
            )}
          </div>
          {(data.acceptsFinancing || data.acceptsFGTS) && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 8, paddingTop: 8, display: 'flex', gap: 8 }}>
              {data.acceptsFinancing && <span style={{ color: '#86efac', fontSize: 10, fontWeight: 600 }}>✓ Financiamento</span>}
              {data.acceptsFGTS && <span style={{ color: '#86efac', fontSize: 10, fontWeight: 600 }}>✓ FGTS</span>}
            </div>
          )}
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ width: 32, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' }} />
            <div style={{ width: 32, height: 3, borderRadius: 2, backgroundColor: '#F47920' }} />
            <div style={{ width: 32, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' }} />
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '4px 12px', border: '1px solid rgba(255,255,255,0.15)' }}>
            <p style={{ color: 'white', fontSize: 10, margin: 0, fontWeight: 600 }}>2 / 3</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Story 3: CTA — sem gatilhos falsos, honesto e direto ────────────────────*/
export const AMStory3_T3_CTA = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => (
  <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#0c0c0c', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
    {/* Background */}
    {photo && (
      <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.2) saturate(0.3)' }} />
    )}
    {/* Orange + blue dual gradient */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(145deg, rgba(244,121,32,0.7) 0%, rgba(10,20,40,0.95) 45%, rgba(27,94,166,0.6) 100%)',
    }} />

    {/* Big diagonal orange slash */}
    <div style={{
      position: 'absolute', top: 80, right: -40, width: 180, height: 600,
      backgroundColor: '#F47920', transform: 'rotate(12deg)', opacity: 0.06, zIndex: 1,
    }} />

    {/* Content */}
    <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '44px 28px 32px' }}>
      {/* Logo */}
      <Logo variant="white" />

      {/* Top badge — honesto, sem gatilho falso */}
      <div style={{
        marginTop: 20, backgroundColor: '#1B5EA6', borderRadius: 30, padding: '6px 20px',
        boxShadow: '0 4px 16px rgba(27,94,166,0.5)',
      }}>
        <p style={{ color: 'white', fontSize: 11, fontWeight: 800, margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          📞 Estamos aqui para ajudar
        </p>
      </div>

      {/* Main CTA text */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Tire suas dúvidas
        </p>
        <p style={{ color: 'white', fontSize: 38, fontWeight: 900, lineHeight: 1.1, margin: '0 0 6px' }}>
          Entre em
        </p>
        <p style={{ color: '#F47920', fontSize: 42, fontWeight: 900, lineHeight: 1, margin: '0 0 24px' }}>
          contato!
        </p>

        {/* Phone big button */}
        <div style={{
          width: '100%', backgroundColor: '#F47920', borderRadius: 18, padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12,
          boxShadow: '0 10px 30px rgba(244,121,32,0.5)',
        }}>
          <span style={{ fontSize: 26 }}>📲</span>
          <div style={{ textAlign: 'left' }}>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 10, margin: '0 0 1px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              WhatsApp agora
            </p>
            <p style={{ color: 'white', fontSize: 20, fontWeight: 900, margin: 0 }}>
              {data.brokerPhone || '(92) 9XXXX-XXXX'}
            </p>
          </div>
        </div>

        {/* Broker name & info */}
        <div style={{
          width: '100%', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: '12px 16px',
          border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
          marginBottom: 12,
        }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Corretor responsável</p>
          <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 1px' }}>{data.brokerName || 'Iury Sampaio'}</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, margin: 0 }}>Creci 3968 PF</p>
        </div>

        {/* Website */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
          🌐 www.apartamentosmanaus.com{'\n'}
          facebook.com/ApartamentosManaus
        </p>
      </div>

      {/* Bottom progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ width: 32, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' }} />
          <div style={{ width: 32, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' }} />
          <div style={{ width: 32, height: 3, borderRadius: 2, backgroundColor: '#F47920' }} />
        </div>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '4px 12px', border: '1px solid rgba(255,255,255,0.15)' }}>
          <p style={{ color: 'white', fontSize: 10, margin: 0, fontWeight: 600 }}>3 / 3</p>
        </div>
      </div>
    </div>
  </div>
);
