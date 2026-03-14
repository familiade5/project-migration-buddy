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

/* ── Story 2: Imóvel — novo layout modelo (localização + grade de fotos + preço) */
export const AMStory3_T3_Reveal = ({
  data,
  photos,
}: {
  data: AMPropertyData;
  photos?: string[];
}) => (
  <AMStoryRevealSlide
    data={data}
    photos={photos}
    counter="2 / 3"
    footerBg="#0c0c0c"
    footerColor="#ffffff"
  />
);

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
