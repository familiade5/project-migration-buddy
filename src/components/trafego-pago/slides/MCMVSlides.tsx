/**
 * Design 1 — MCMV / Baixa Renda
 * 10 criativos únicos inspirados em ads reais de alta conversão
 */
import { TrafegoPropertyData } from '@/types/trafegoPago';
import logoAM from '@/assets/logo-apartamentos-manaus.svg';
import { useLogoBase64 } from '@/hooks/useLogoBase64';

const ORANGE = '#F47920';
const BROWN = '#5C3A1E';
const PURPLE = '#6B21A8';
const DARK = '#0a1628';
const GREEN_GRAD = 'linear-gradient(135deg, #22C55E, #16A34A)';
const TEAL_GRAD = 'linear-gradient(135deg, #0EA5E9, #14B8A6)';
const font = "'Inter', 'Segoe UI', Arial, sans-serif";
const W = 360;
const H = 360;

const Logo = ({ width = 70, white = false }: { width?: number; white?: boolean }) => {
  const b64 = useLogoBase64(logoAM);
  return <img src={b64} alt="" width={width} style={{ display: 'block', ...(white ? { filter: 'brightness(0) invert(1)' } : {}) }} />;
};

const fmt = (v: number) => v > 0 ? v.toLocaleString('pt-BR') : '';
const fmtFull = (v: number) => v > 0 ? `R$ ${v.toLocaleString('pt-BR')},00` : '';

/* MCMV circular badge */
const MCMVBadge = ({ size = 56 }: { size?: number }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', backgroundColor: '#fff', border: '2px solid #E5E7EB', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
    <span style={{ fontSize: size * 0.22, lineHeight: 1 }}>🏠</span>
    <span style={{ fontSize: size * 0.13, fontWeight: 800, color: '#1D4ED8', lineHeight: 1.1, textAlign: 'center' }}>Minha Casa</span>
    <span style={{ fontSize: size * 0.13, fontWeight: 800, color: '#F59E0B', lineHeight: 1 }}>Minha Vida</span>
  </div>
);

/* Location pin */
const LocationPin = ({ color = ORANGE, size = 16 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" /></svg>
);

/* Specs icons */
const BedIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2V10c0-2.21-1.79-4-4-4z"/></svg>;
const CarIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>;
const AreaIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z"/></svg>;
const LeisureIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 21c-1.11 0-1.73-.37-2.18-.64-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.08.64-2.19.64-1.11 0-1.73-.37-2.18-.64-.37-.23-.6-.36-1.15-.36s-.78.13-1.15.36c-.46.27-1.08.64-2.19.64v-2c.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.19-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.19-.64 1.11 0 1.73.37 2.18.64.37.22.6.36 1.15.36s.78-.13 1.15-.36c.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36v2zM8.67 12l.67-2h5.33l.67 2h1.33l-3-9h-3.33l-3 9h1.33zm3-7h.67L13.5 9h-3l1.17-4z"/></svg>;

/* Price display - big number style from references */
const BigPrice = ({ value, label, bgColor = ORANGE }: { value: string; label: string; bgColor?: string }) => (
  <div style={{ background: bgColor, borderRadius: 10, padding: '6px 14px', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
    <span style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase' }}>{label}</span>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>R$</span>
      <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{value.split(',')[0] || value}</span>
      {value.includes(',') && <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>,{value.split(',')[1]}</span>}
    </div>
  </div>
);

// ────────────────────────────────────────────
// 1. "SAIA DO ALUGUEL" — Hero com foto de fundo + brown header + preço grande
// Inspirado na imagem 1 (marrom/laranja com collage de fotos)
// ────────────────────────────────────────────
export const MCMV1 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: W, height: H, backgroundColor: '#f5f0eb', fontFamily: font, overflow: 'hidden' }}>
    {/* Background photo */}
    {photo && <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.75) 100%)' }} />

    {/* Brown header bar */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5, background: 'rgba(92,58,30,0.92)', borderRadius: '0 0 16px 16px', padding: '12px 16px', textAlign: 'center' }}>
      <p style={{ color: '#fff', fontSize: 20, fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        Saia do Aluguel
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 6 }}>
        <LocationPin color="#fff" size={14} />
        <p style={{ color: '#fff', fontSize: 11, fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
          {data.title || 'Condomínio'} — {data.city || 'Manaus'}
        </p>
      </div>
    </div>

    {/* Logo */}
    <div style={{ position: 'absolute', top: 80, right: 12, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 10, padding: '5px 8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      <Logo width={65} />
    </div>

    {/* Bottom info bar */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5, padding: '0 12px 10px' }}>
      {/* Entrada + Parcela badges */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 8, justifyContent: 'center' }}>
        {data.entrada && (
          <div style={{ background: ORANGE, borderRadius: 10, padding: '6px 14px', textAlign: 'center' }}>
            <span style={{ fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', display: 'block' }}>Possibilidade de</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>{data.entrada}</span>
          </div>
        )}
        {data.parcelas && (
          <div style={{ background: ORANGE, borderRadius: 10, padding: '6px 14px', textAlign: 'center' }}>
            <span style={{ fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', display: 'block' }}>Mensais a partir de</span>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>R$</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{data.parcelas.replace(/[^\d]/g, '') || '499'}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>,00</span>
            </div>
          </div>
        )}
      </div>

      {/* Specs row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8, padding: '6px 12px' }}>
        {data.bedrooms > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fff' }}><BedIcon /><span style={{ fontSize: 9, fontWeight: 700 }}>{data.bedrooms} Quartos</span></div>}
        {data.garageSpaces > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fff' }}><CarIcon /><span style={{ fontSize: 9, fontWeight: 700 }}>Garagem</span></div>}
        {data.area > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fff' }}><AreaIcon /><span style={{ fontSize: 9, fontWeight: 700 }}>{data.area}m²</span></div>}
      </div>
    </div>

    {/* MCMV badge */}
    {data.isMCMV && <div style={{ position: 'absolute', bottom: 90, right: 12, zIndex: 10 }}><MCMVBadge size={50} /></div>}
  </div>
);

// ────────────────────────────────────────────
// 2. REALIZE O SONHO — Purple bg + foto central + chave dourada style
// Inspirado na imagem 2 (roxo com "Realize o sonho da casa própria")
// ────────────────────────────────────────────
export const MCMV2 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: W, height: H, background: `linear-gradient(135deg, ${PURPLE} 0%, #7C3AED 100%)`, fontFamily: font, overflow: 'hidden' }}>
    {/* Logo top-right */}
    <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '4px 7px' }}>
      <Logo width={55} />
    </div>

    {/* MCMV badge */}
    {data.isMCMV && <div style={{ position: 'absolute', top: 8, right: 75, zIndex: 10 }}><MCMVBadge size={44} /></div>}

    {/* Headline */}
    <div style={{ position: 'absolute', top: 10, left: 14, zIndex: 5, maxWidth: 180 }}>
      <p style={{ color: '#fff', fontSize: 18, fontWeight: 900, lineHeight: 1.15, margin: 0, fontStyle: 'italic' }}>
        Realize o sonho da casa própria
      </p>
    </div>

    {/* White card badges */}
    <div style={{ position: 'absolute', top: 70, left: 14, zIndex: 10, display: 'flex', gap: 6 }}>
      {data.entrada && (
        <div style={{ background: '#fff', borderRadius: 10, padding: '6px 12px', textAlign: 'center' }}>
          <span style={{ fontSize: 7, fontWeight: 700, color: PURPLE, textTransform: 'uppercase', display: 'block' }}>Possibilidade de</span>
          <span style={{ fontSize: 14, fontWeight: 900, color: PURPLE, textTransform: 'uppercase' }}>{data.entrada}</span>
        </div>
      )}
      {data.parcelas && (
        <div style={{ background: '#fff', borderRadius: 10, padding: '6px 12px', textAlign: 'center' }}>
          <span style={{ fontSize: 7, fontWeight: 700, color: PURPLE, textTransform: 'uppercase', display: 'block' }}>Mensais a partir de</span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: PURPLE }}>R$</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: PURPLE, lineHeight: 1 }}>{data.parcelas.replace(/[^\d]/g, '') || '499'}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: PURPLE }}>,00</span>
          </div>
        </div>
      )}
    </div>

    {/* Central photo */}
    <div style={{ position: 'absolute', top: 120, left: 20, right: 20, height: 160, borderRadius: 14, overflow: 'hidden', border: '3px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', zIndex: 3 }}>
      {photo && <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
    </div>

    {/* Location badge */}
    <div style={{ position: 'absolute', top: 240, left: 14, right: 14, zIndex: 10, background: 'rgba(255,255,200,0.95)', borderRadius: 10, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
      <LocationPin color={PURPLE} size={14} />
      <span style={{ fontSize: 10, fontWeight: 800, color: '#1a1a1a', textTransform: 'uppercase' }}>
        {data.title || 'Condomínio'} — {data.neighborhood} — {data.city || 'Manaus'}
      </span>
    </div>

    {/* Bottom specs */}
    <div style={{ position: 'absolute', bottom: 8, left: 10, right: 10, zIndex: 5, display: 'flex', justifyContent: 'center', gap: 16, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 8, padding: '7px 12px' }}>
      {data.bedrooms > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fff' }}><BedIcon /><span style={{ fontSize: 9, fontWeight: 700 }}>{data.bedrooms > 1 ? `0${data.bedrooms}` : '0' + data.bedrooms} quartos</span></div>}
      {data.garageSpaces > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fff' }}><CarIcon /><span style={{ fontSize: 9, fontWeight: 700 }}>Garagem</span></div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fff' }}><LeisureIcon /><span style={{ fontSize: 9, fontWeight: 700 }}>Áreas de Lazer</span></div>
    </div>
  </div>
);

// ────────────────────────────────────────────
// 3. SAIA DO ALUGUEL — Purple variant com specs + preço
// Inspirado na imagem 3 (purple com bullets e MCMV badge)
// ────────────────────────────────────────────
export const MCMV3 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: W, height: H, background: `linear-gradient(180deg, ${PURPLE} 0%, #581C87 100%)`, fontFamily: font, overflow: 'hidden' }}>
    {/* Header */}
    <div style={{ padding: '14px 16px 0', textAlign: 'center', position: 'relative', zIndex: 5 }}>
      <p style={{ color: '#fff', fontSize: 20, fontWeight: 900, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
        Saia do Aluguel
      </p>
      <p style={{ color: '#FDE68A', fontSize: 12, fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>
        {data.title || 'Cond.'} — {data.neighborhood} — {data.city || 'Manaus'}
      </p>
    </div>

    {/* Central photo */}
    <div style={{ position: 'absolute', top: 55, left: 14, right: 14, height: 150, borderRadius: 12, overflow: 'hidden', zIndex: 3 }}>
      {photo && <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
    </div>

    {/* Location badge on photo */}
    <div style={{ position: 'absolute', top: 60, left: 18, zIndex: 10, display: 'flex', alignItems: 'flex-start', gap: 4, maxWidth: 140 }}>
      <LocationPin color={PURPLE} size={18} />
      <span style={{ fontSize: 8, fontWeight: 700, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.8)', lineHeight: 1.2 }}>
        {`${data.neighborhood}, ${data.city || 'Manaus'}/${data.state || 'AM'}`}
      </span>
    </div>

    {/* White card bottom */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5, background: 'rgba(88,28,135,0.95)', padding: '10px 16px 12px' }}>
      {/* Entrada + parcela */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
        {data.entrada && (
          <div style={{ background: '#fff', borderRadius: 10, padding: '5px 12px', textAlign: 'center' }}>
            <span style={{ fontSize: 7, fontWeight: 700, color: PURPLE, display: 'block' }}>Possibilidade</span>
            <span style={{ fontSize: 13, fontWeight: 900, color: ORANGE }}>ENTRADA ZERO</span>
          </div>
        )}
        <div style={{ background: '#fff', borderRadius: 10, padding: '5px 12px', textAlign: 'center' }}>
          <span style={{ fontSize: 7, fontWeight: 700, color: PURPLE, display: 'block' }}>Mensais a partir de</span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <span style={{ fontSize: 8, fontWeight: 700, color: '#6B21A8' }}>R$</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#F59E0B', lineHeight: 1 }}>{data.parcelas ? data.parcelas.replace(/[^\d]/g, '') : '450'}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#6B21A8' }}>,00</span>
          </div>
        </div>
      </div>

      {/* Specs bullets */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.bedrooms > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fff' }}><span style={{ fontSize: 8 }}>•</span><span style={{ fontSize: 10, fontWeight: 700 }}>{data.bedrooms > 1 ? `0${data.bedrooms}` : '0' + data.bedrooms} quartos</span></div>}
          {data.garageSpaces > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fff' }}><span style={{ fontSize: 8 }}>•</span><span style={{ fontSize: 10, fontWeight: 700 }}>Garagem</span></div>}
          {data.area > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fff' }}><span style={{ fontSize: 8 }}>•</span><span style={{ fontSize: 10, fontWeight: 700 }}>{data.area}m²</span></div>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fff' }}><span style={{ fontSize: 8 }}>•</span><span style={{ fontSize: 10, fontWeight: 700 }}>FINANCIE ATÉ 100%</span></div>
        </div>
        {data.isMCMV && <MCMVBadge size={48} />}
      </div>
    </div>

    {/* Logo bottom-right */}
    <div style={{ position: 'absolute', bottom: 8, right: 12, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '3px 6px' }}>
      <Logo width={50} />
    </div>
  </div>
);

// ────────────────────────────────────────────
// 4. LAYOUT CLEAN — White bg + fotos + green gradients para pricing
// Inspirado na imagem 4 (branco com gradientes verde/teal)
// ────────────────────────────────────────────
export const MCMV4 = ({ data, photos }: { data: TrafegoPropertyData; photos: string[] }) => {
  const p = photos.length >= 3 ? photos.slice(0, 3) : [photos[0] || '', photos[0] || '', photos[0] || ''];
  return (
    <div style={{ position: 'relative', width: W, height: H, backgroundColor: '#fff', fontFamily: font, overflow: 'hidden' }}>
      {/* Top bar teal/green gradient */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: TEAL_GRAD }} />

      {/* Logo */}
      <div style={{ position: 'absolute', top: 8, left: 12, zIndex: 10 }}>
        <Logo width={60} />
      </div>

      {/* Bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: TEAL_GRAD }} />

      {/* Two-column layout */}
      <div style={{ display: 'flex', height: '100%', padding: '32px 12px 12px' }}>
        {/* Left column - info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
            <LocationPin color="#22C55E" size={14} />
            <span style={{ fontSize: 10, fontWeight: 800, color: '#1a1a1a', textTransform: 'uppercase' }}>{data.title || data.neighborhood}</span>
          </div>
          <div style={{ background: '#22C55E', borderRadius: 4, padding: '2px 8px', marginBottom: 8, alignSelf: 'flex-start' }}>
            <span style={{ fontSize: 10, fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>Saia do Aluguel</span>
          </div>

          {/* Specs bullets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 10 }}>
            {data.bedrooms > 0 && <span style={{ fontSize: 10, fontWeight: 800, color: '#1a1a1a' }}>• {data.bedrooms} quartos</span>}
            {data.garageSpaces > 0 && <span style={{ fontSize: 10, fontWeight: 800, color: '#1a1a1a' }}>• Garagem</span>}
            {data.area > 0 && <span style={{ fontSize: 10, fontWeight: 800, color: '#1a1a1a' }}>• {data.area}m²</span>}
          </div>

          {/* Pricing with gradient backgrounds */}
          {data.entrada && (
            <div style={{ background: TEAL_GRAD, borderRadius: 8, padding: '4px 10px', marginBottom: 4 }}>
              <span style={{ fontSize: 7, fontWeight: 700, color: '#fff', display: 'block' }}>Entrada a partir de</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>R$ {data.entrada.replace(/[^\d.]/g, '') || '25.000'}</span>
            </div>
          )}
          {data.parcelas && (
            <div style={{ background: TEAL_GRAD, borderRadius: 8, padding: '4px 10px', marginBottom: 4 }}>
              <span style={{ fontSize: 7, fontWeight: 700, color: '#fff', display: 'block' }}>Mensais a partir de</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: '#fff' }}>R$</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{data.parcelas.replace(/[^\d]/g, '') || '550'}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>,00</span>
              </div>
            </div>
          )}
          {data.subsidio && (
            <div style={{ background: TEAL_GRAD, borderRadius: 8, padding: '4px 10px' }}>
              <span style={{ fontSize: 7, fontWeight: 700, color: '#fff', display: 'block' }}>Subsídio até</span>
              <span style={{ fontSize: 12, fontWeight: 900, color: '#fff' }}>{data.subsidio}</span>
            </div>
          )}
        </div>

        {/* Right column - photos */}
        <div style={{ width: 150, display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center' }}>
          <div style={{ borderRadius: 10, overflow: 'hidden', height: 90, border: '2px solid #E0F2FE' }}>
            {p[0] && <img src={p[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </div>
          {/* MCMV badge between photos */}
          {data.isMCMV && <div style={{ alignSelf: 'center' }}><MCMVBadge size={36} /></div>}
          <div style={{ borderRadius: 10, overflow: 'hidden', height: 90, border: '2px solid #E0F2FE' }}>
            {p[1] && <img src={p[1]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </div>
          {/* FGTS badge */}
          {data.acceptsFGTS && (
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: '#1D4ED8' }}>FGTS</span>
              <span style={{ fontSize: 8, fontWeight: 700, color: '#6B7280', display: 'block' }}>ACEITO</span>
            </div>
          )}
          <div style={{ borderRadius: 10, overflow: 'hidden', height: 70, border: '2px solid #E0F2FE' }}>
            {p[2] && <img src={p[2]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────
// 5. OPORTUNIDADE ELEGANTE — Dark brown + foto dupla + script font style
// Inspirado na imagem 5 (marrom escuro elegante com script)
// ────────────────────────────────────────────
export const MCMV5 = ({ data, photos }: { data: TrafegoPropertyData; photos: string[] }) => {
  const p = photos.length >= 2 ? photos.slice(0, 2) : [photos[0] || '', photos[0] || ''];
  return (
    <div style={{ position: 'relative', width: W, height: H, backgroundColor: '#2C1810', fontFamily: font, overflow: 'hidden' }}>
      {/* Top section */}
      <div style={{ padding: '14px 16px 0', textAlign: 'center', position: 'relative', zIndex: 5 }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 600, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Oportunidade para sair do aluguel
        </p>
        <p style={{ color: '#fff', fontSize: 20, fontWeight: 900, margin: '0 0 4px', fontStyle: 'italic', fontFamily: "'Georgia', serif" }}>
          {data.title || 'Seu Condomínio'}
        </p>
      </div>

      {/* Hero photo top */}
      <div style={{ position: 'absolute', top: 50, left: 14, right: 14, height: 100, borderRadius: 10, overflow: 'hidden', zIndex: 3 }}>
        {p[0] && <img src={p[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>

      {/* Price info */}
      <div style={{ position: 'absolute', top: 155, left: 0, right: 0, zIndex: 5, padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div>
            <span style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.6)', display: 'block' }}>OPORTUNIDADE</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>R$ {fmt(data.salePrice) || '150.000'}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,0.6)', display: 'block' }}>USE SEU FGTS</span>
            <span style={{ fontSize: 8, fontWeight: 700, color: '#FDE68A' }}>{data.subsidio || 'Subsídio disponível'}</span>
            <span style={{ fontSize: 8, fontWeight: 700, color: '#FDE68A', display: 'block' }}>ACEITA FINANCIAMENTO</span>
          </div>
        </div>

        {/* Entrada + Parcela */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <span style={{ fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', display: 'block' }}>Entrada a partir de</span>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: '#FDE68A' }}>R$</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#FDE68A', lineHeight: 1 }}>25</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#FDE68A' }}>MIL</span>
            </div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <span style={{ fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', display: 'block' }}>Mensais a partir de</span>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: '#FDE68A' }}>R$</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: '#FDE68A', lineHeight: 1, fontStyle: 'italic' }}>{data.parcelas ? data.parcelas.replace(/[^\d]/g, '') : '550'}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#FDE68A' }}>,00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom dual photos */}
      <div style={{ position: 'absolute', bottom: 28, left: 14, right: 14, height: 80, display: 'flex', gap: 4, zIndex: 3 }}>
        {p.map((photo, i) => (
          <div key={i} style={{ flex: 1, borderRadius: 8, overflow: 'hidden' }}>
            {photo && <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </div>
        ))}
      </div>

      {/* Bottom specs */}
      <div style={{ position: 'absolute', bottom: 6, left: 14, right: 14, zIndex: 5, display: 'flex', justifyContent: 'center', gap: 16 }}>
        {data.bedrooms > 0 && <span style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>{data.bedrooms} Quartos</span>}
        <span style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Sol Nascente</span>
        {data.garageSpaces > 0 && <span style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Garagem</span>}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────
// 6. COLLAGE COM POLAROIDS — Multi-foto estilo polaroid + fundo foto
// Inspirado na imagem 1 (fotos tipo polaroid sobre fundo)
// ────────────────────────────────────────────
export const MCMV6 = ({ data, photo, photos }: { data: TrafegoPropertyData; photo?: string; photos?: string[] }) => {
  const allPhotos = photos || [photo || '', photo || '', photo || ''];
  const p = allPhotos.slice(0, 3);
  return (
    <div style={{ position: 'relative', width: W, height: H, fontFamily: font, overflow: 'hidden' }}>
      {/* Background photo */}
      {(photo || p[0]) && <img src={photo || p[0]} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85) blur(1px)' }} />}

      {/* Brown header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5, background: 'rgba(92,58,30,0.92)', borderRadius: '0 0 14px 14px', padding: '10px 16px', textAlign: 'center' }}>
        <p style={{ color: '#fff', fontSize: 18, fontWeight: 900, margin: '0 0 4px', textTransform: 'uppercase' }}>Saia do Aluguel</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <LocationPin color={ORANGE} size={12} />
          <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>{data.title} — {data.city || 'Manaus'}</span>
        </div>
      </div>

      {/* Polaroid photos scattered */}
      <div style={{ position: 'absolute', top: 70, left: 8, width: 100, height: 90, zIndex: 8, background: '#fff', padding: 4, borderRadius: 4, boxShadow: '0 4px 16px rgba(0,0,0,0.25)', transform: 'rotate(-5deg)' }}>
        {p[0] && <img src={p[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2 }} />}
      </div>
      <div style={{ position: 'absolute', top: 80, left: 110, width: 110, height: 95, zIndex: 9, background: '#fff', padding: 4, borderRadius: 4, boxShadow: '0 4px 16px rgba(0,0,0,0.25)', transform: 'rotate(3deg)' }}>
        {p[1] && <img src={p[1]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2 }} />}
      </div>
      <div style={{ position: 'absolute', top: 110, left: 20, width: 95, height: 80, zIndex: 7, background: '#fff', padding: 4, borderRadius: 4, boxShadow: '0 4px 16px rgba(0,0,0,0.25)', transform: 'rotate(4deg)' }}>
        {p[2] && <img src={p[2]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2 }} />}
      </div>

      {/* Logo badge */}
      <div style={{ position: 'absolute', top: 105, right: 14, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 10, padding: '5px 8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <Logo width={60} />
      </div>

      {/* Bottom bar with prices */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, padding: '8px 10px 10px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 6, justifyContent: 'center' }}>
          {data.entrada && (
            <div style={{ background: ORANGE, borderRadius: 10, padding: '5px 12px', textAlign: 'center' }}>
              <span style={{ fontSize: 6, fontWeight: 700, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', display: 'block' }}>Possibilidade de</span>
              <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>Entrada Zero</span>
            </div>
          )}
          {data.parcelas && (
            <div style={{ background: ORANGE, borderRadius: 10, padding: '5px 12px', textAlign: 'center' }}>
              <span style={{ fontSize: 6, fontWeight: 700, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', display: 'block' }}>Mensais a partir de</span>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: '#fff' }}>R$</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{data.parcelas.replace(/[^\d]/g, '') || '550'}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>,00</span>
              </div>
            </div>
          )}
        </div>

        {/* Specs + MCMV + subsídio */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {data.bedrooms > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fff' }}><BedIcon /><span style={{ fontSize: 9, fontWeight: 700, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{data.bedrooms} Quartos</span></div>}
            {data.garageSpaces > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fff' }}><CarIcon /><span style={{ fontSize: 9, fontWeight: 700, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Garagem</span></div>}
          </div>
          <div style={{ textAlign: 'right' }}>
            {data.subsidio && (
              <div style={{ background: ORANGE, borderRadius: 6, padding: '3px 8px', marginBottom: 3 }}>
                <span style={{ fontSize: 8, fontWeight: 800, color: '#fff' }}>Subsídio de até</span>
                <span style={{ fontSize: 8, fontWeight: 800, color: '#fff', display: 'block' }}>{data.subsidio}</span>
              </div>
            )}
            {data.salePrice > 0 && (
              <div style={{ background: ORANGE, borderRadius: 6, padding: '3px 8px' }}>
                <span style={{ fontSize: 10, fontWeight: 900, color: '#fff' }}>{fmtFull(data.salePrice)}</span>
              </div>
            )}
          </div>
        </div>
        {data.isMCMV && <div style={{ position: 'absolute', bottom: 44, left: '45%', zIndex: 11 }}><MCMVBadge size={40} /></div>}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────
// 7. COMPARATIVO ALUGUEL vs FINANCIAR — Impactful split
// ────────────────────────────────────────────
export const MCMV7 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: W, height: H, backgroundColor: '#fff', fontFamily: font, overflow: 'hidden' }}>
    {/* Orange header */}
    <div style={{ background: ORANGE, padding: '12px 16px', textAlign: 'center' }}>
      <p style={{ color: '#fff', fontSize: 16, fontWeight: 900, margin: 0, textTransform: 'uppercase' }}>
        Por que pagar aluguel?
      </p>
      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 9, fontWeight: 600, margin: '2px 0 0' }}>
        Compare e veja a diferença
      </p>
    </div>

    {/* Comparison */}
    <div style={{ display: 'flex', gap: 8, padding: '10px 12px' }}>
      {/* Aluguel */}
      <div style={{ flex: 1, background: '#FEF2F2', borderRadius: 12, padding: 10, textAlign: 'center', border: '2px solid #FECACA' }}>
        <span style={{ fontSize: 24, display: 'block', marginBottom: 4 }}>❌</span>
        <span style={{ fontSize: 10, fontWeight: 900, color: '#DC2626', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Aluguel</span>
        <span style={{ fontSize: 8, color: '#991B1B', lineHeight: 1.3, display: 'block' }}>R$ jogado fora todo mês sem retorno</span>
      </div>
      {/* Financiar */}
      <div style={{ flex: 1, background: '#F0FDF4', borderRadius: 12, padding: 10, textAlign: 'center', border: '2px solid #86EFAC' }}>
        <span style={{ fontSize: 24, display: 'block', marginBottom: 4 }}>🏡</span>
        <span style={{ fontSize: 10, fontWeight: 900, color: '#16A34A', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Financiar</span>
        <span style={{ fontSize: 14, fontWeight: 900, color: '#16A34A', display: 'block' }}>{data.parcelas || 'R$ 499/mês'}</span>
        <span style={{ fontSize: 7, color: '#166534', display: 'block', marginTop: 2 }}>e o imóvel é SEU!</span>
      </div>
    </div>

    {/* Photo strip */}
    <div style={{ margin: '0 12px', height: 80, borderRadius: 10, overflow: 'hidden' }}>
      {photo && <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
    </div>

    {/* Bottom CTA */}
    <div style={{ padding: '8px 12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <LocationPin color={ORANGE} size={12} />
          <span style={{ fontSize: 9, fontWeight: 700, color: '#1a1a1a' }}>{data.title} • {data.neighborhood}</span>
        </div>
        {data.isMCMV && <MCMVBadge size={34} />}
      </div>
      <div style={{ background: `linear-gradient(135deg, ${ORANGE}, #e85d10)`, borderRadius: 10, padding: '8px', textAlign: 'center' }}>
        <span style={{ color: '#fff', fontSize: 11, fontWeight: 900 }}>SIMULE GRÁTIS AGORA →</span>
      </div>
    </div>
  </div>
);

// ────────────────────────────────────────────
// 8. URGÊNCIA — "Últimas Unidades" dark + red accents
// ────────────────────────────────────────────
export const MCMV8 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: W, height: H, backgroundColor: DARK, fontFamily: font, overflow: 'hidden' }}>
    {photo && <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.25) saturate(0.5)' }} />}

    <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center' }}>
      {/* Urgent badge */}
      <div style={{ background: '#EF4444', borderRadius: 8, padding: '4px 16px', marginBottom: 10 }}>
        <span style={{ color: '#fff', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>⚠️ Últimas Unidades</span>
      </div>

      <p style={{ color: '#fff', fontSize: 20, fontWeight: 900, lineHeight: 1.15, margin: '0 0 4px' }}>
        {data.title || 'Não perca!'}
      </p>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, margin: '0 0 10px' }}>{data.neighborhood} • {data.city}</p>

      {/* Price row */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {data.entrada && (
          <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '6px 14px', textAlign: 'center' }}>
            <span style={{ fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,0.7)', display: 'block', textTransform: 'uppercase' }}>Possibilidade de</span>
            <span style={{ fontSize: 14, fontWeight: 900, color: '#22C55E' }}>{data.entrada}</span>
          </div>
        )}
        {data.parcelas && (
          <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '6px 14px', textAlign: 'center' }}>
            <span style={{ fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,0.7)', display: 'block', textTransform: 'uppercase' }}>Mensais a partir de</span>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: ORANGE }}>R$</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: ORANGE, lineHeight: 1 }}>{data.parcelas.replace(/[^\d]/g, '') || '499'}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: ORANGE }}>,00</span>
            </div>
          </div>
        )}
      </div>

      {data.isMCMV && <MCMVBadge size={42} />}

      <div style={{ background: '#EF4444', borderRadius: 10, padding: '8px 28px', marginTop: 10 }}>
        <span style={{ color: '#fff', fontSize: 11, fontWeight: 900 }}>GARANTA A SUA →</span>
      </div>
    </div>

    {/* Logo */}
    <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '4px 7px' }}>
      <Logo width={55} />
    </div>
  </div>
);

// ────────────────────────────────────────────
// 9. CONDIÇÕES ESPECIAIS — Split layout + green pricing cards
// ────────────────────────────────────────────
export const MCMV9 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: W, height: H, fontFamily: font, overflow: 'hidden' }}>
    {/* Left half — photo */}
    <div style={{ position: 'absolute', left: 0, top: 0, width: W / 2, height: H }}>
      {photo ? <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', backgroundColor: '#ddd' }} />}
    </div>

    {/* Right half — info */}
    <div style={{ position: 'absolute', right: 0, top: 0, width: W / 2, height: H, background: `linear-gradient(180deg, ${BROWN} 0%, #3D2415 100%)`, padding: '12px 10px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <Logo width={55} white />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
        <span style={{ fontSize: 8, fontWeight: 800, color: ORANGE, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Condições Especiais</span>

        {data.entrada && (
          <div style={{ background: GREEN_GRAD, borderRadius: 8, padding: '5px 8px' }}>
            <span style={{ fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,0.85)', display: 'block' }}>Entrada</span>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#fff' }}>{data.entrada}</span>
          </div>
        )}
        {data.parcelas && (
          <div style={{ background: GREEN_GRAD, borderRadius: 8, padding: '5px 8px' }}>
            <span style={{ fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,0.85)', display: 'block' }}>Mensais</span>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#fff' }}>{data.parcelas}</span>
          </div>
        )}
        {data.subsidio && (
          <div style={{ background: GREEN_GRAD, borderRadius: 8, padding: '5px 8px' }}>
            <span style={{ fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,0.85)', display: 'block' }}>Subsídio até</span>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#fff' }}>{data.subsidio}</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {data.acceptsFGTS && <span style={{ fontSize: 7, fontWeight: 700, color: '#FDE68A', background: 'rgba(253,230,138,0.15)', borderRadius: 4, padding: '2px 6px' }}>FGTS ✓</span>}
          {data.acceptsFinancing && <span style={{ fontSize: 7, fontWeight: 700, color: '#FDE68A', background: 'rgba(253,230,138,0.15)', borderRadius: 4, padding: '2px 6px' }}>Financ. ✓</span>}
        </div>
      </div>

      {data.isMCMV && <div style={{ alignSelf: 'center', marginBottom: 4 }}><MCMVBadge size={38} /></div>}

      <div style={{ background: ORANGE, borderRadius: 8, padding: '7px', textAlign: 'center' }}>
        <span style={{ color: '#fff', fontSize: 9, fontWeight: 900 }}>CONSULTE →</span>
      </div>
    </div>
  </div>
);

// ────────────────────────────────────────────
// 10. CTA FINAL — Contato direto + WhatsApp
// ────────────────────────────────────────────
export const MCMV10 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: W, height: H, fontFamily: font, overflow: 'hidden' }}>
    {/* Top photo */}
    <div style={{ position: 'absolute', top: 0, left: 0, width: W, height: 155 }}>
      {photo && <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 50, background: `linear-gradient(to top, ${BROWN}, transparent)` }} />
    </div>

    {/* Logo */}
    <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '4px 7px' }}>
      <Logo width={55} />
    </div>

    {data.isMCMV && <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}><MCMVBadge size={44} /></div>}

    {/* Bottom section */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 220, background: `linear-gradient(180deg, ${BROWN} 0%, #1a0e06 100%)`, padding: '16px 16px 10px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <p style={{ color: '#fff', fontSize: 15, fontWeight: 900, textAlign: 'center', margin: '0 0 2px', textTransform: 'uppercase' }}>
        Fale com um Consultor
      </p>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, textAlign: 'center', margin: '0 0 6px' }}>
        {data.title} • {data.neighborhood} • {data.city || 'Manaus'}
      </p>

      {/* Price highlight */}
      {data.salePrice > 0 && (
        <div style={{ background: ORANGE, borderRadius: 10, padding: '5px 20px', marginBottom: 8 }}>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 900 }}>{fmtFull(data.salePrice)}</span>
        </div>
      )}

      {data.brokerName && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '5px 12px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: `linear-gradient(135deg, ${ORANGE}, #e85d10)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
          </div>
          <div>
            <p style={{ color: '#fff', fontSize: 10, fontWeight: 700, margin: 0 }}>{data.brokerName}</p>
            {data.brokerPhone && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8, margin: 0 }}>{data.brokerPhone}</p>}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, width: '100%' }}>
        <div style={{ flex: 1, background: '#25D366', borderRadius: 8, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
          <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>WhatsApp</span>
        </div>
        <div style={{ flex: 1, background: ORANGE, borderRadius: 8, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
          <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>Ligar</span>
        </div>
      </div>

      {data.creci && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 6.5, marginTop: 4 }}>CRECI: {data.creci}</span>}
    </div>
  </div>
);
