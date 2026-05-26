import { PropertyData } from '@/types/property';
import logoVDH from '@/assets/logo-vdh-transparent-cropped.png';
import logoCaixaAqui from '@/assets/caixa-aqui-logo-cropped.png';
import { useLogoBase64 } from '@/hooks/useLogoBase64';

interface Props {
  data?: PropertyData;
  photo?: string | null;
  photos?: string[];
}

const BG = '#093C1E';
const GOLD = '#d4af37';

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
        background: BG,
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
      <div style={{ position: 'absolute', top: 40, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 36, zIndex: 10 }}>
        <img src={logoBase64} alt="VDH" style={{ height: 50, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', display: 'block' }} />
        <div style={{ width: 2, height: 100, backgroundColor: 'rgba(212,175,55,0.65)' }} />
        <img src={caixaBase64} alt="CAIXA AQUI" style={{ height: 140, width: 'auto', objectFit: 'contain', display: 'block' }} />
      </div>

      {/* Eyebrow */}
      <div style={{ position: 'absolute', top: 212, left: 0, right: 0, textAlign: 'center' }}>
        <span style={{ display: 'inline-block', padding: '10px 36px', border: `1.5px solid ${GOLD}`, borderRadius: 999, color: GOLD, fontSize: 18, letterSpacing: '0.42em', fontWeight: 600, textTransform: 'uppercase', background: 'rgba(0,0,0,0.12)' }}>
          Quem somos
        </span>
      </div>

      {/* Headline */}
      <div style={{ position: 'absolute', top: 280, left: 60, right: 60, textAlign: 'center' }}>
        <h2 style={{ color: '#ffffff', fontSize: 64, fontWeight: 500, lineHeight: 1.0, letterSpacing: '-0.01em', margin: 0, fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>
          Iury Sampaio
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: 26, marginTop: 14, fontWeight: 400, lineHeight: 1.3 }}>
          Corretor & Correspondente <span style={{ color: GOLD, fontWeight: 600 }}>Caixa credenciado</span>
        </p>
      </div>

      {/* Stats */}
      <div style={{ position: 'absolute', top: 402, left: 50, right: 50, display: 'flex', justifyContent: 'center', gap: 16 }}>
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
          <div key={i} style={{ flex: 1, border: `1.5px solid rgba(212,175,55,0.55)`, borderRadius: 20, padding: '18px 10px 20px', textAlign: 'center', height: 208, background: 'rgba(0,0,0,0.12)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>{s.icon}</div>
            <div style={{ color: GOLD, fontSize: 58, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em' }}>{s.n}</div>
            <div style={{ color: '#ffffff', fontSize: 21, marginTop: 10, lineHeight: 1.22, whiteSpace: 'pre-line', fontWeight: 500 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Services */}
      <div style={{ position: 'absolute', top: 632, left: 60, right: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <span style={{ color: GOLD, fontSize: 17, letterSpacing: '0.34em', fontWeight: 700, textTransform: 'uppercase' }}>
            O que oferecemos
          </span>
          <span style={{ flex: 1, height: 1, backgroundColor: 'rgba(212,175,55,0.45)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 28px' }}>
          {SERVICES.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#ffffff', fontSize: 23, fontWeight: 600, lineHeight: 1.25 }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12.5l2.5 2.5L16 9.5" />
              </svg>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* States */}
      <div style={{ position: 'absolute', top: 760, left: 50, right: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <span style={{ flex: 1, height: 1, backgroundColor: 'rgba(212,175,55,0.45)' }} />
          <span style={{ color: GOLD, fontSize: 17, letterSpacing: '0.34em', fontWeight: 700, textTransform: 'uppercase' }}>
            Atuamos nos estados
          </span>
          <span style={{ flex: 1, height: 1, backgroundColor: 'rgba(212,175,55,0.45)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'nowrap' }}>
            {ESTADOS.slice(0, 4).map((e) => (
              <span key={e} style={{ padding: '9px 22px', border: '1.5px solid rgba(212,175,55,0.55)', borderRadius: 999, color: '#ffffff', fontSize: 18, fontWeight: 600, background: 'rgba(0,0,0,0.12)' }}>
                {e}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'nowrap' }}>
            {ESTADOS.slice(4).map((e) => (
              <span key={e} style={{ padding: '9px 22px', border: '1.5px solid rgba(212,175,55,0.55)', borderRadius: 999, color: '#ffffff', fontSize: 18, fontWeight: 600, background: 'rgba(0,0,0,0.12)' }}>
                {e}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom commitment cards */}
      <div style={{ position: 'absolute', bottom: 32, left: 50, right: 50, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '22px 24px', border: `1.5px solid rgba(212,175,55,0.5)`, borderRadius: 18, background: 'rgba(0,0,0,0.12)' }}>
          <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" />
          </svg>
          <div style={{ color: '#ffffff', fontSize: 22, fontWeight: 500, lineHeight: 1.3 }}>
            Seu sonho,<br /><span style={{ color: GOLD, fontWeight: 700 }}>nosso compromisso.</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '22px 24px', border: `1.5px solid rgba(212,175,55,0.5)`, borderRadius: 18, background: 'rgba(0,0,0,0.12)' }}>
          <div style={{ color: '#ffffff', fontSize: 20, fontWeight: 500, lineHeight: 1.3, flex: 1 }}>
            Segurança, confiança e <span style={{ color: GOLD, fontWeight: 700 }}>agilidade</span> para realizar o seu sonho.
          </div>
          <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M4 13c1.5-1.5 3-1.5 4.5 0L12 16l3.5-3c1.5-1.5 3-1.5 4.5 0" />
            <path d="M5 17c1.5-1.5 3-1.5 4.5 0L12 19l2.5-2c1.5-1.5 3-1.5 4.5 0" />
            <path d="M9 10c0-1.5 1.5-3 3-3s3 1.5 3 3" />
            <circle cx="12" cy="5" r="1.2" fill={GOLD} stroke="none" />
          </svg>
        </div>
      </div>
    </div>
  );
};
