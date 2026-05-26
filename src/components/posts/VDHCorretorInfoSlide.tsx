import { PropertyData } from '@/types/property';
import logoVDH from '@/assets/logo-vdh-transparent.png';
import logoCaixaAqui from '@/assets/caixa-aqui-logo.png';
import { useLogoBase64 } from '@/hooks/useLogoBase64';

interface Props {
  data?: PropertyData;
  photo?: string | null;
  photos?: string[];
}

const BG = '#006633';
const GOLD = '#c9a84c';

const ESTADOS = ['Amazonas', 'Ceará', 'Paraíba', 'Mato Grosso do Sul', 'Rio Grande do Norte', 'Santa Catarina'];

const SERVICES = [
  'Assessoria 100% gratuita',
  'Auxílio na documentação do imóvel',
  'Acompanhamento do financiamento',
  'Análise de crédito grátis',
];

export const VDHCorretorInfoSlide = ({}: Props) => {
  const logoBase64 = useLogoBase64(logoVDH);
  const caixaBase64 = useLogoBase64(logoCaixaAqui);

  return (
    <div
      className="post-template"
      style={{
        background: 'radial-gradient(ellipse at center, #00773b 0%, #005a2c 60%, #003d1e 100%)',
        backgroundColor: BG,
        width: 1080,
        height: 1080,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Decorative gold corner brackets */}
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ position: 'absolute', top: 14, left: 14 }}>
        <path d="M120 4 H30 Q4 4 4 30 V120" stroke={GOLD} strokeWidth="3" fill="none" />
      </svg>
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ position: 'absolute', bottom: 14, right: 14 }}>
        <path d="M0 116 H90 Q116 116 116 90 V0" stroke={GOLD} strokeWidth="3" fill="none" />
      </svg>

      {/* Logos: VDH + CAIXA AQUI */}
      <div style={{ position: 'absolute', top: 70, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 30 }}>
        <img src={logoBase64} alt="VDH" style={{ height: 105, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
        <div style={{ width: 1.5, height: 70, backgroundColor: 'rgba(201,168,76,0.65)' }} />
        <img src={caixaBase64} alt="CAIXA AQUI" style={{ height: 110, objectFit: 'contain' }} />
      </div>

      {/* Eyebrow */}
      <div style={{ position: 'absolute', top: 230, left: 0, right: 0, textAlign: 'center' }}>
        <span style={{ display: 'inline-block', padding: '12px 42px', border: `1.5px solid ${GOLD}`, borderRadius: 999, color: GOLD, fontSize: 20, letterSpacing: '0.42em', fontWeight: 600, textTransform: 'uppercase' }}>
          Quem somos
        </span>
      </div>

      {/* Headline */}
      <div style={{ position: 'absolute', top: 310, left: 60, right: 60, textAlign: 'center' }}>
        <h2 style={{ color: '#ffffff', fontSize: 78, fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.01em', margin: 0, fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>
          Iury Sampaio
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: 28, marginTop: 18, fontWeight: 400, lineHeight: 1.3 }}>
          Corretor & Correspondente <span style={{ color: GOLD, fontWeight: 600 }}>Caixa credenciado</span>
        </p>
      </div>

      {/* Stats */}
      <div style={{ position: 'absolute', top: 500, left: 60, right: 60, display: 'flex', justifyContent: 'center', gap: 22 }}>
        {[
          {
            n: '+9', l: 'anos de\nexperiência',
            icon: (
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="9" r="5.5" />
                <path d="M12 6.5l.9 1.8 2 .3-1.45 1.4.34 2L12 11.1l-1.79.9.34-2L9.1 8.6l2-.3z" fill={GOLD} stroke="none" />
                <path d="M8.5 13.5L6.5 21l3.5-1.8 2 1.3 2-1.3 3.5 1.8-2-7.5" />
              </svg>
            ),
          },
          {
            n: '+1.000', l: 'imóveis adjudicados\nvendidos',
            icon: (
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" />
              </svg>
            ),
          },
          {
            n: '24h', l: 'análise de\ncrédito Caixa',
            icon: (
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" />
              </svg>
            ),
          },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, border: `1.5px solid rgba(201,168,76,0.55)`, borderRadius: 22, padding: '24px 14px 26px', textAlign: 'center', minHeight: 240 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>{s.icon}</div>
            <div style={{ color: GOLD, fontSize: 64, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em' }}>{s.n}</div>
            <div style={{ color: 'rgba(255,255,255,0.92)', fontSize: 22, marginTop: 14, lineHeight: 1.22, whiteSpace: 'pre-line', fontWeight: 400 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Services */}
      <div style={{ position: 'absolute', top: 790, left: 60, right: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <span style={{ color: GOLD, fontSize: 17, letterSpacing: '0.32em', fontWeight: 700, textTransform: 'uppercase' }}>
            O que oferecemos
          </span>
          <span style={{ flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.45)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 30px' }}>
          {SERVICES.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, color: '#ffffff', fontSize: 23, fontWeight: 600, lineHeight: 1.25 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12.5l2.5 2.5L16 9.5" />
              </svg>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* States */}
      <div style={{ position: 'absolute', top: 1020, left: 60, right: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <span style={{ flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.45)' }} />
          <span style={{ color: GOLD, fontSize: 17, letterSpacing: '0.32em', fontWeight: 700, textTransform: 'uppercase' }}>
            Atuamos nos estados
          </span>
          <span style={{ flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.45)' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          {ESTADOS.map((e) => (
            <span key={e} style={{ padding: '11px 26px', border: '1.5px solid rgba(201,168,76,0.55)', borderRadius: 999, color: '#ffffff', fontSize: 21, fontWeight: 500 }}>
              {e}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom commitment cards */}
      <div style={{ position: 'absolute', bottom: 50, left: 60, right: 60, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '22px 24px', border: `1.5px solid rgba(201,168,76,0.5)`, borderRadius: 18 }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" />
          </svg>
          <div style={{ color: '#ffffff', fontSize: 20, fontWeight: 400, lineHeight: 1.3 }}>
            Seu sonho,<br />nosso compromisso.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '22px 24px', border: `1.5px solid rgba(201,168,76,0.5)`, borderRadius: 18 }}>
          <div style={{ color: '#ffffff', fontSize: 19, fontWeight: 400, lineHeight: 1.3, flex: 1 }}>
            Segurança, confiança<br />e agilidade para<br />realizar o seu sonho.
          </div>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M3 12l3-3 3 1 3-2 3 2 3-1 3 3-4 4-2-1-2 1-2-1-2 1z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
