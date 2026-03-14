/**
 * TEMA 2 — "CLEAN LUXURY"
 * Story 1: Curiosidade — foto grande (50%) + texto organizado abaixo
 * Story 2: Revelação   — fotos maiores (68%) + info no rodapé
 * Story 3: CTA         — cabeçalho laranja grande com foto de fundo + contato
 */

import { AMPropertyData } from '@/types/apartamentosManaus';
import logoAM from '@/assets/logo-apartamentos-manaus.png';
import { AMStoryRevealSlide } from './AMStoryRevealSlide';

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

/* ── Story 2: Imóvel — novo layout modelo (localização + grade de fotos + preço) */
export const AMStory2_T2_Reveal = ({
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
    footerBg="#ffffff"
    footerColor="#1B5EA6"
  />
);

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
