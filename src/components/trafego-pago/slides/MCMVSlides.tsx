/**
 * Design 1 — MCMV / Baixa Renda
 * 10 criativos únicos focados em conversão para tráfego pago
 * Linguagem: acessível, urgência, sem entrada, parcelas baixas, subsídio, Minha Casa Minha Vida
 */
import { TrafegoPropertyData } from '@/types/trafegoPago';
import logoAM from '@/assets/logo-apartamentos-manaus.svg';
import { useLogoBase64 } from '@/hooks/useLogoBase64';

const BLUE = '#1B5EA6';
const ORANGE = '#F47920';
const GREEN = '#22C55E';
const DARK = '#0a1628';
const font = "'Inter', 'Segoe UI', Arial, sans-serif";

const Logo = ({ width = 80, white = false }: { width?: number; white?: boolean }) => {
  const b64 = useLogoBase64(logoAM);
  return <img src={b64} alt="" width={width} style={{ display: 'block', ...(white ? { filter: 'brightness(0) invert(1)' } : {}) }} />;
};

const fmt = (v: number) => v > 0 ? `R$ ${v.toLocaleString('pt-BR')}` : '';
const W = 360;
const H = 360;

// ────────────────────────────────────────────
// 1. IMPACTO MÁXIMO — Grande foto + preço + "sem entrada"
// ────────────────────────────────────────────
export const MCMV1 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => {
  const price = fmt(data.salePrice);
  return (
    <div style={{ position: 'relative', width: W, height: H, backgroundColor: DARK, fontFamily: font, overflow: 'hidden' }}>
      {photo && <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.1) 100%)', zIndex: 2 }} />

      {/* MCMV Badge */}
      {data.isMCMV && (
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, background: GREEN, borderRadius: 6, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 8, fontWeight: 800, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase' }}>🏠 Minha Casa Minha Vida</span>
        </div>
      )}

      {/* Logo */}
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '5px 8px' }}>
        <Logo width={65} />
      </div>

      {/* Content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5, padding: '0 16px 14px' }}>
        <p style={{ color: '#fff', fontSize: 20, fontWeight: 900, lineHeight: 1.1, margin: '0 0 6px', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
          {data.headline || data.title || 'Seu Novo Lar'}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, margin: '0 0 10px' }}>
          {[data.neighborhood, data.city].filter(Boolean).join(' • ')}
        </p>

        {/* Price bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `linear-gradient(135deg, ${ORANGE} 0%, #e85d10 100%)`, borderRadius: 10, padding: '8px 14px' }}>
          <div>
            {data.entrada && <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 8, fontWeight: 700, display: 'block', marginBottom: 1, textTransform: 'uppercase' }}>{data.entrada}</span>}
            {price && <span style={{ color: '#fff', fontSize: 18, fontWeight: 900, lineHeight: 1 }}>{price}</span>}
          </div>
          <div style={{ backgroundColor: '#fff', borderRadius: 8, padding: '6px 14px' }}>
            <span style={{ color: ORANGE, fontSize: 10, fontWeight: 800 }}>{data.ctaText || 'SAIBA MAIS'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────
// 2. PARCELAS EM DESTAQUE — Foco nas parcelas
// ────────────────────────────────────────────
export const MCMV2 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: W, height: H, backgroundColor: '#fff', fontFamily: font, overflow: 'hidden' }}>
    {/* Top half photo */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 190 }}>
      {photo && <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 50, background: 'linear-gradient(to top, #fff, transparent)' }} />
    </div>
    {/* Logo */}
    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '5px 8px' }}>
      <Logo width={65} />
    </div>

    {/* Bottom content */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 18px 16px', zIndex: 5 }}>
      {data.isMCMV && (
        <div style={{ display: 'inline-block', background: GREEN, borderRadius: 4, padding: '3px 10px', marginBottom: 8 }}>
          <span style={{ fontSize: 8, fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>Minha Casa Minha Vida</span>
        </div>
      )}
      <p style={{ color: DARK, fontSize: 16, fontWeight: 900, lineHeight: 1.15, margin: '0 0 4px' }}>
        {data.parcelas || 'Parcelas que cabem no seu bolso'}
      </p>
      <p style={{ color: '#6B7280', fontSize: 10, margin: '0 0 10px' }}>
        {data.title || 'Condomínio completo'} • {data.neighborhood}
      </p>

      {/* Specs row */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {data.bedrooms > 0 && <div style={{ background: '#F0F4FF', borderRadius: 6, padding: '4px 10px', border: `1px solid ${BLUE}22` }}><span style={{ fontSize: 10, fontWeight: 700, color: BLUE }}>{data.bedrooms} Qts</span></div>}
        {data.garageSpaces > 0 && <div style={{ background: '#F0F4FF', borderRadius: 6, padding: '4px 10px', border: `1px solid ${BLUE}22` }}><span style={{ fontSize: 10, fontWeight: 700, color: BLUE }}>{data.garageSpaces} Vaga{data.garageSpaces > 1 ? 's' : ''}</span></div>}
        {data.area > 0 && <div style={{ background: '#F0F4FF', borderRadius: 6, padding: '4px 10px', border: `1px solid ${BLUE}22` }}><span style={{ fontSize: 10, fontWeight: 700, color: BLUE }}>{data.area}m²</span></div>}
      </div>

      <div style={{ background: BLUE, borderRadius: 10, padding: '10px 16px', textAlign: 'center' }}>
        <span style={{ color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '0.04em' }}>SIMULE AGORA →</span>
      </div>
    </div>
  </div>
);

// ────────────────────────────────────────────
// 3. SUBSÍDIO DESTAQUE — Quanto o governo paga por você
// ────────────────────────────────────────────
export const MCMV3 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: W, height: H, backgroundColor: DARK, fontFamily: font, overflow: 'hidden' }}>
    {photo && <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35)' }} />}
    <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <Logo width={90} white />
      <div style={{ width: 40, height: 3, backgroundColor: ORANGE, borderRadius: 2, margin: '12px auto 14px' }} />
      <p style={{ color: '#fff', fontSize: 11, fontWeight: 600, opacity: 0.7, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        O Governo paga para você
      </p>
      <p style={{ color: ORANGE, fontSize: 28, fontWeight: 900, lineHeight: 1, margin: '0 0 6px' }}>
        {data.subsidio || 'Subsídio disponível'}
      </p>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, margin: '0 0 16px' }}>
        {data.title} • {data.neighborhood}
      </p>
      {data.entrada && (
        <div style={{ background: 'rgba(34,197,94,0.2)', border: `1px solid ${GREEN}`, borderRadius: 8, padding: '6px 18px', marginBottom: 12 }}>
          <span style={{ color: GREEN, fontSize: 12, fontWeight: 800 }}>{data.entrada}</span>
        </div>
      )}
      <div style={{ backgroundColor: '#fff', borderRadius: 10, padding: '8px 28px' }}>
        <span style={{ color: BLUE, fontSize: 11, fontWeight: 800 }}>QUERO MEU SUBSÍDIO →</span>
      </div>
    </div>
  </div>
);

// ────────────────────────────────────────────
// 4. COMPARATIVO ALUGUEL vs FINANCIAMENTO
// ────────────────────────────────────────────
export const MCMV4 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: W, height: H, backgroundColor: '#EFF6FF', fontFamily: font, overflow: 'hidden' }}>
    {/* Subtle bg photo */}
    {photo && <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.08 }} />}

    <div style={{ position: 'relative', zIndex: 2, padding: 20, display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <Logo width={70} />
        {data.isMCMV && (
          <div style={{ background: GREEN, borderRadius: 4, padding: '3px 10px' }}>
            <span style={{ fontSize: 7, fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>MCMV</span>
          </div>
        )}
      </div>

      <p style={{ color: DARK, fontSize: 14, fontWeight: 900, lineHeight: 1.2, margin: '0 0 14px' }}>
        Por que pagar aluguel se você pode ter o seu?
      </p>

      {/* Comparison cards */}
      <div style={{ display: 'flex', gap: 8, flex: 1 }}>
        {/* Aluguel */}
        <div style={{ flex: 1, background: '#FEE2E2', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 22, marginBottom: 4 }}>❌</span>
          <span style={{ fontSize: 8, fontWeight: 700, color: '#991B1B', textTransform: 'uppercase', marginBottom: 4 }}>Aluguel</span>
          <span style={{ fontSize: 9, color: '#7F1D1D', textAlign: 'center', lineHeight: 1.3 }}>Dinheiro jogado fora todo mês</span>
        </div>
        {/* Financiamento */}
        <div style={{ flex: 1, background: '#DCFCE7', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `2px solid ${GREEN}` }}>
          <span style={{ fontSize: 22, marginBottom: 4 }}>✅</span>
          <span style={{ fontSize: 8, fontWeight: 700, color: '#166534', textTransform: 'uppercase', marginBottom: 4 }}>Financiar</span>
          <span style={{ fontSize: 12, fontWeight: 900, color: '#166534' }}>{data.parcelas || 'R$ 499/mês'}</span>
          <span style={{ fontSize: 8, color: '#166534', marginTop: 2 }}>e o imóvel é SEU</span>
        </div>
      </div>

      <div style={{ background: ORANGE, borderRadius: 10, padding: '10px 16px', textAlign: 'center', marginTop: 12 }}>
        <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>SIMULE GRÁTIS →</span>
      </div>
    </div>
  </div>
);

// ────────────────────────────────────────────
// 5. GALERIA + SPECS — Grid de fotos com specs
// ────────────────────────────────────────────
export const MCMV5 = ({ data, photos }: { data: TrafegoPropertyData; photos: string[] }) => {
  const p = photos.slice(0, 4);
  return (
    <div style={{ position: 'relative', width: W, height: H, backgroundColor: DARK, fontFamily: font, overflow: 'hidden' }}>
      {/* 2x2 grid */}
      <div style={{ position: 'absolute', inset: 6, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 4, zIndex: 1 }}>
        {p.map((photo, i) => (
          <div key={i} style={{ borderRadius: 8, overflow: 'hidden' }}>
            <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </div>
      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)', zIndex: 2 }} />

      {/* Center badge */}
      <div style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, background: 'rgba(255,255,255,0.97)', borderRadius: 12, padding: '8px 16px', textAlign: 'center', border: `2px solid ${ORANGE}`, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
        {data.isMCMV && <span style={{ fontSize: 7, fontWeight: 800, color: GREEN, textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>MCMV</span>}
        <span style={{ fontSize: 12, fontWeight: 900, color: DARK }}>{data.title || 'Conheça'}</span>
      </div>

      {/* Bottom specs */}
      <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, zIndex: 5, display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        {data.bedrooms > 0 && <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 6, padding: '4px 10px', border: '1px solid rgba(255,255,255,0.2)' }}><span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>{data.bedrooms} Quartos</span></div>}
        {data.area > 0 && <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 6, padding: '4px 10px', border: '1px solid rgba(255,255,255,0.2)' }}><span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>{data.area}m²</span></div>}
        {data.garageSpaces > 0 && <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 6, padding: '4px 10px', border: '1px solid rgba(255,255,255,0.2)' }}><span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>{data.garageSpaces} Vaga{data.garageSpaces > 1 ? 's' : ''}</span></div>}
        {data.salePrice > 0 && <div style={{ background: ORANGE, borderRadius: 6, padding: '4px 10px' }}><span style={{ color: '#fff', fontSize: 10, fontWeight: 800 }}>{fmt(data.salePrice)}</span></div>}
      </div>

      {/* Logo */}
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '4px 7px' }}>
        <Logo width={55} />
      </div>
    </div>
  );
};

// ────────────────────────────────────────────
// 6. URGÊNCIA TEMPORAL — "Últimas Unidades"
// ────────────────────────────────────────────
export const MCMV6 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: W, height: H, backgroundColor: '#1a0a0a', fontFamily: font, overflow: 'hidden' }}>
    {photo && <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3) saturate(0.7)' }} />}
    <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      {/* Pulsing red dot */}
      <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#EF4444', marginBottom: 10, boxShadow: '0 0 20px #EF4444' }} />
      <p style={{ color: '#EF4444', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 6px' }}>
        ⚠️ Últimas Unidades
      </p>
      <p style={{ color: '#fff', fontSize: 22, fontWeight: 900, lineHeight: 1.1, margin: '0 0 8px' }}>
        {data.title || 'Não perca essa chance!'}
      </p>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, margin: '0 0 4px' }}>{data.neighborhood} • {data.city}</p>
      {data.parcelas && <p style={{ color: ORANGE, fontSize: 14, fontWeight: 800, margin: '8px 0' }}>{data.parcelas}</p>}
      {data.entrada && <p style={{ color: GREEN, fontSize: 12, fontWeight: 700, margin: '0 0 12px' }}>{data.entrada}</p>}
      <div style={{ background: `linear-gradient(135deg, #EF4444, #DC2626)`, borderRadius: 10, padding: '10px 28px' }}>
        <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>GARANTA A SUA →</span>
      </div>
    </div>
  </div>
);

// ────────────────────────────────────────────
// 7. SOCIAL PROOF — "Mais de X famílias já realizaram..."
// ────────────────────────────────────────────
export const MCMV7 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: W, height: H, backgroundColor: '#fff', fontFamily: font, overflow: 'hidden' }}>
    {/* Left strip photo */}
    <div style={{ position: 'absolute', left: 0, top: 0, width: 140, height: H }}>
      {photo && <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      <div style={{ position: 'absolute', top: 0, right: -20, width: 40, height: '100%', background: 'linear-gradient(to right, transparent, #fff)' }} />
    </div>

    {/* Right content */}
    <div style={{ position: 'absolute', right: 0, top: 0, width: 230, height: H, padding: '18px 16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <Logo width={70} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <p style={{ color: '#9CA3AF', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Conquiste seu lar</p>
        <p style={{ color: DARK, fontSize: 14, fontWeight: 900, lineHeight: 1.2, margin: '0 0 10px' }}>
          Mais de 500 famílias já realizaram o sonho da casa própria
        </p>
        <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
          {['⭐', '⭐', '⭐', '⭐', '⭐'].map((s, i) => <span key={i} style={{ fontSize: 14 }}>{s}</span>)}
        </div>
        <p style={{ color: '#6B7280', fontSize: 9, lineHeight: 1.4, margin: '0 0 10px' }}>
          "{data.title || 'Apartamento'} — {data.parcelas || 'parcelas que cabem no bolso'}"
        </p>
        {data.isMCMV && (
          <div style={{ display: 'inline-flex', background: '#DCFCE7', borderRadius: 4, padding: '3px 8px', marginBottom: 8, alignSelf: 'flex-start' }}>
            <span style={{ fontSize: 7, fontWeight: 800, color: '#166534' }}>🏠 MINHA CASA MINHA VIDA</span>
          </div>
        )}
      </div>
      <div style={{ background: BLUE, borderRadius: 8, padding: '8px 14px', textAlign: 'center' }}>
        <span style={{ color: '#fff', fontSize: 10, fontWeight: 800 }}>EU TAMBÉM QUERO →</span>
      </div>
    </div>
  </div>
);

// ────────────────────────────────────────────
// 8. CHECKLIST — "Tudo que você precisa"
// ────────────────────────────────────────────
export const MCMV8 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => {
  const items = data.highlights.length > 0 ? data.highlights : ['Condomínio completo', 'Área de lazer', 'Segurança 24h', 'Próximo ao centro'];
  return (
    <div style={{ position: 'relative', width: W, height: H, backgroundColor: '#fff', fontFamily: font, overflow: 'hidden' }}>
      {/* Top strip */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: `linear-gradient(to right, ${BLUE}, ${ORANGE})` }} />

      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <Logo width={70} />
          {data.isMCMV && (
            <div style={{ background: GREEN, borderRadius: 4, padding: '3px 8px' }}>
              <span style={{ fontSize: 7, fontWeight: 800, color: '#fff' }}>MCMV</span>
            </div>
          )}
        </div>

        <p style={{ color: DARK, fontSize: 15, fontWeight: 900, lineHeight: 1.2, margin: '0 0 4px' }}>
          Tudo isso por {data.parcelas || fmt(data.salePrice) || 'parcelas acessíveis'}
        </p>
        <p style={{ color: '#9CA3AF', fontSize: 9, margin: '0 0 14px' }}>
          {data.title} • {data.neighborhood}
        </p>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
          {items.slice(0, 6).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: i % 2 === 0 ? BLUE : ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#374151' }}>{item}</span>
            </div>
          ))}
        </div>

        <div style={{ background: ORANGE, borderRadius: 10, padding: '10px', textAlign: 'center', marginTop: 8 }}>
          <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>AGENDE SUA VISITA →</span>
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────
// 9. CONDIÇÕES ESPECIAIS — Layout split
// ────────────────────────────────────────────
export const MCMV9 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: W, height: H, fontFamily: font, overflow: 'hidden' }}>
    {/* Left photo */}
    <div style={{ position: 'absolute', left: 0, top: 0, width: W / 2, height: H }}>
      {photo ? <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', backgroundColor: '#ccc' }} />}
    </div>
    {/* Right panel */}
    <div style={{ position: 'absolute', right: 0, top: 0, width: W / 2, height: H, background: `linear-gradient(135deg, ${DARK} 0%, #0f2744 100%)`, padding: '18px 14px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <Logo width={65} white />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <p style={{ color: ORANGE, fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>Condições Especiais</p>
        {data.entrada && (
          <div style={{ background: 'rgba(34,197,94,0.15)', border: `1px solid ${GREEN}55`, borderRadius: 8, padding: '6px 10px', marginBottom: 8 }}>
            <span style={{ color: GREEN, fontSize: 12, fontWeight: 800 }}>{data.entrada}</span>
          </div>
        )}
        {data.parcelas && (
          <div style={{ background: 'rgba(244,121,32,0.15)', border: `1px solid ${ORANGE}55`, borderRadius: 8, padding: '6px 10px', marginBottom: 8 }}>
            <span style={{ color: ORANGE, fontSize: 11, fontWeight: 800 }}>{data.parcelas}</span>
          </div>
        )}
        {data.subsidio && (
          <div style={{ background: 'rgba(27,94,166,0.15)', border: `1px solid ${BLUE}55`, borderRadius: 8, padding: '6px 10px', marginBottom: 8 }}>
            <span style={{ color: '#93C5FD', fontSize: 10, fontWeight: 700 }}>{data.subsidio}</span>
          </div>
        )}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
          {data.acceptsFGTS && <span style={{ fontSize: 7, fontWeight: 700, color: '#93C5FD', background: 'rgba(147,197,253,0.15)', borderRadius: 4, padding: '2px 6px' }}>FGTS ✓</span>}
          {data.acceptsFinancing && <span style={{ fontSize: 7, fontWeight: 700, color: '#93C5FD', background: 'rgba(147,197,253,0.15)', borderRadius: 4, padding: '2px 6px' }}>Financ. ✓</span>}
        </div>
      </div>
      <div style={{ background: ORANGE, borderRadius: 8, padding: '8px', textAlign: 'center' }}>
        <span style={{ color: '#fff', fontSize: 9, fontWeight: 800 }}>CONSULTE →</span>
      </div>
    </div>
  </div>
);

// ────────────────────────────────────────────
// 10. CTA FINAL — WhatsApp & contato direto
// ────────────────────────────────────────────
export const MCMV10 = ({ data, photo }: { data: TrafegoPropertyData; photo?: string }) => (
  <div style={{ position: 'relative', width: W, height: H, fontFamily: font, overflow: 'hidden' }}>
    {/* Top photo */}
    <div style={{ position: 'absolute', top: 0, left: 0, width: W, height: 150 }}>
      {photo && <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: `linear-gradient(to top, ${DARK}, transparent)` }} />
    </div>

    {/* Bottom section */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 230, backgroundColor: DARK, padding: '20px 20px 14px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Logo width={90} white />
      <p style={{ color: '#fff', fontSize: 14, fontWeight: 800, textAlign: 'center', margin: '10px 0 4px' }}>
        Fale agora com um consultor
      </p>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, textAlign: 'center', margin: '0 0 10px' }}>
        {data.title} • {data.neighborhood} • {data.city}
      </p>

      {data.brokerName && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 14px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg, ${BLUE}, ${ORANGE})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
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
        <div style={{ flex: 1, background: `linear-gradient(135deg, ${ORANGE}, #e85d10)`, borderRadius: 8, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
          <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>Ligar</span>
        </div>
      </div>

      {data.creci && (
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 6.5, marginTop: 6 }}>CRECI: {data.creci}</span>
      )}
    </div>
  </div>
);
