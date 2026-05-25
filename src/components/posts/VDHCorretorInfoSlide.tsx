import { PropertyData } from '@/types/property';
import logoVDH from '@/assets/logo-vdh-transparent.png';
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
  'Notificação para desocupação',
];

export const VDHCorretorInfoSlide = ({}: Props) => {
  const logoBase64 = useLogoBase64(logoVDH);

  return (
    <div className="post-template" style={{ backgroundColor: BG, width: 1080, height: 1080, position: 'relative', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      {/* Decorative gold corners */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 220, height: 220, borderTop: `3px solid ${GOLD}`, borderLeft: `3px solid ${GOLD}`, opacity: 0.6 }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 220, height: 220, borderBottom: `3px solid ${GOLD}`, borderRight: `3px solid ${GOLD}`, opacity: 0.6 }} />

      {/* Logo */}
      <div style={{ position: 'absolute', top: 50, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <img src={logoBase64} alt="VDH" style={{ height: 130, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
      </div>

      {/* Eyebrow */}
      <div style={{ position: 'absolute', top: 215, left: 0, right: 0, textAlign: 'center' }}>
        <span style={{ display: 'inline-block', padding: '8px 22px', border: `1px solid ${GOLD}`, borderRadius: 999, color: GOLD, fontSize: 18, letterSpacing: '0.32em', fontWeight: 600, textTransform: 'uppercase' }}>
          Quem somos
        </span>
      </div>

      {/* Headline */}
      <div style={{ position: 'absolute', top: 280, left: 80, right: 80, textAlign: 'center' }}>
        <h2 style={{ color: '#ffffff', fontSize: 60, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', margin: 0 }}>
          Iury Sampaio
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 26, marginTop: 12, fontWeight: 500, lineHeight: 1.3 }}>
          Corretor & Correspondente <span style={{ color: GOLD, fontWeight: 700 }}>Caixa credenciado</span>
        </p>
      </div>

      {/* Stats */}
      <div style={{ position: 'absolute', top: 440, left: 80, right: 80, display: 'flex', justifyContent: 'center', gap: 28 }}>
        {[
          { n: '+9', l: 'anos de\nexperiência' },
          { n: '+1.000', l: 'imóveis adjudicados\nvendidos' },
          { n: '24h', l: 'análise de\ncrédito Caixa' },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,168,76,0.35)', borderRadius: 18, padding: '24px 14px', textAlign: 'center' }}>
            <div style={{ color: GOLD, fontSize: 52, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>{s.n}</div>
            <div style={{ color: 'rgba(255,255,255,0.88)', fontSize: 18, marginTop: 10, lineHeight: 1.25, whiteSpace: 'pre-line', fontWeight: 500 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Services */}
      <div style={{ position: 'absolute', top: 640, left: 80, right: 80 }}>
        <div style={{ color: GOLD, fontSize: 16, letterSpacing: '0.28em', fontWeight: 700, marginBottom: 14, textTransform: 'uppercase' }}>
          O que oferecemos
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
          {SERVICES.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#ffffff', fontSize: 22, fontWeight: 500, lineHeight: 1.25 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: GOLD, flexShrink: 0 }} />
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* States */}
      <div style={{ position: 'absolute', bottom: 70, left: 60, right: 60 }}>
        <div style={{ color: GOLD, fontSize: 16, letterSpacing: '0.28em', fontWeight: 700, marginBottom: 14, textTransform: 'uppercase', textAlign: 'center' }}>
          Atuamos nos estados
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {ESTADOS.map((e) => (
            <span key={e} style={{ padding: '10px 20px', border: '1px solid rgba(255,255,255,0.35)', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 999, color: '#ffffff', fontSize: 20, fontWeight: 600 }}>
              {e}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
