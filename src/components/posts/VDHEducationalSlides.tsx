import { Building2, CheckCircle2, FileCheck2, Handshake, KeyRound, ShieldCheck } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh-transparent.png';
import { useLogoBase64 } from '@/hooks/useLogoBase64';
import { PropertyData } from '@/types/property';

interface Props {
  data: PropertyData;
  photo?: string | null;
  photos?: string[];
}

const COLORS = {
  green: '#006633',
  greenDark: '#003f25',
  greenSoft: '#e8f4ed',
  gold: '#d4a44c',
  ink: '#15372b',
  white: '#ffffff',
};

function SlideBrand({ number, label }: { number: string; label: string }) {
  const logo = useLogoBase64(logoVDH);
  return (
    <div style={{ position: 'absolute', top: 46, left: 64, right: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 3 }}>
      <img src={logo} alt="VDH" style={{ width: 220, height: 100, objectFit: 'contain', objectPosition: 'left center', filter: 'brightness(0) invert(1)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: COLORS.white }}>
        <span style={{ fontSize: 20, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0 }}>{label}</span>
        <span style={{ width: 48, height: 48, border: `1px solid ${COLORS.gold}`, display: 'grid', placeItems: 'center', borderRadius: 24, fontSize: 20, fontWeight: 800 }}>{number}</span>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div style={{ position: 'absolute', left: 64, right: 64, bottom: 48, display: 'flex', alignItems: 'center', gap: 16, color: 'rgba(255,255,255,0.78)', fontSize: 21 }}>
      <div style={{ height: 2, width: 70, backgroundColor: COLORS.gold }} />
      Venda Direta Hoje • Assessoria especializada em imóveis CAIXA
    </div>
  );
}

export const VDHRetakenPropertySlide = ({}: Props) => (
  <div className="post-template" style={{ backgroundColor: COLORS.green, color: COLORS.white }}>
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(145deg, ${COLORS.green} 0%, ${COLORS.greenDark} 100%)` }} />
    <div style={{ position: 'absolute', right: -120, bottom: -160, width: 600, height: 600, border: '2px solid rgba(212,164,76,0.22)', borderRadius: 300 }} />
    <div style={{ position: 'absolute', right: -30, bottom: -70, width: 420, height: 420, border: '2px solid rgba(212,164,76,0.35)', borderRadius: 210 }} />
    <SlideBrand number="02" label="Entenda a oportunidade" />

    <div style={{ position: 'absolute', left: 70, top: 218, width: 810, zIndex: 2 }}>
      <div style={{ width: 92, height: 92, borderRadius: 18, backgroundColor: COLORS.gold, display: 'grid', placeItems: 'center', marginBottom: 42 }}>
        <Building2 style={{ width: 48, height: 48, color: COLORS.greenDark }} />
      </div>
      <p style={{ margin: 0, color: COLORS.gold, fontSize: 26, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0 }}>Imóvel retomado</p>
      <h2 style={{ margin: '18px 0 30px', fontSize: 70, lineHeight: 1.04, fontWeight: 900, letterSpacing: 0, color: COLORS.white }}>
        Uma oportunidade de compra pela CAIXA
      </h2>
      <p style={{ margin: 0, maxWidth: 790, fontSize: 34, lineHeight: 1.42, color: 'rgba(255,255,255,0.88)' }}>
        Este imóvel foi retomado após um financiamento anterior e voltou a ser disponibilizado para venda pela CAIXA.
      </p>
    </div>
    <Footer />
  </div>
);

const supportItems = [
  { icon: FileCheck2, text: 'Conferência da documentação' },
  { icon: ShieldCheck, text: 'Orientação durante a compra' },
  { icon: KeyRound, text: 'Acompanhamento até as chaves' },
];

export const VDHFullSupportSlide = ({}: Props) => (
  <div className="post-template" style={{ backgroundColor: COLORS.greenSoft, color: COLORS.ink }}>
    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 330, backgroundColor: COLORS.green }} />
    <div style={{ position: 'absolute', left: 110, top: 246, width: 110, height: 110, borderRadius: 55, backgroundColor: COLORS.gold, display: 'grid', placeItems: 'center', zIndex: 3 }}>
      <Handshake style={{ width: 58, height: 58, color: COLORS.greenDark }} />
    </div>
    <SlideBrand number="03" label="Assessoria completa" />

    <div style={{ position: 'absolute', left: 390, right: 70, top: 210 }}>
      <p style={{ margin: 0, color: COLORS.green, fontSize: 26, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0 }}>Você não compra sozinho</p>
      <h2 style={{ margin: '18px 0 48px', fontSize: 66, lineHeight: 1.04, fontWeight: 900, letterSpacing: 0, color: COLORS.ink }}>
        Do primeiro passo à entrega das chaves
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {supportItems.map(({ icon: Icon, text }) => (
          <div key={text} style={{ minHeight: 108, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 24, backgroundColor: COLORS.white, border: '1px solid rgba(0,102,51,0.15)', borderRadius: 14 }}>
            <div style={{ width: 62, height: 62, borderRadius: 31, backgroundColor: COLORS.green, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Icon style={{ width: 32, height: 32, color: COLORS.white }} />
            </div>
            <span style={{ fontSize: 30, lineHeight: 1.2, fontWeight: 750 }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
    <div style={{ position: 'absolute', left: 390, right: 64, bottom: 48, display: 'flex', alignItems: 'center', gap: 16, color: COLORS.green, fontSize: 21 }}>
      <div style={{ height: 2, width: 70, backgroundColor: COLORS.gold }} />
      Venda Direta Hoje • Assessoria especializada em imóveis CAIXA
    </div>
  </div>
);

export const VDHNoCostSlide = ({}: Props) => {
  const logo = useLogoBase64(logoVDH);
  return (
    <div className="post-template" style={{ backgroundColor: COLORS.green, color: COLORS.white }}>
      <div style={{ position: 'absolute', inset: 34, border: `2px solid ${COLORS.gold}`, borderRadius: 22 }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '110px 100px 100px', textAlign: 'center' }}>
        <img src={logo} alt="VDH" style={{ width: 270, height: 120, objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: 36 }} />
        <div style={{ width: 104, height: 104, borderRadius: 52, backgroundColor: COLORS.gold, display: 'grid', placeItems: 'center', marginBottom: 34 }}>
          <CheckCircle2 style={{ width: 58, height: 58, color: COLORS.greenDark }} />
        </div>
        <p style={{ margin: 0, color: COLORS.gold, fontSize: 27, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0 }}>Credenciados CAIXA</p>
        <h2 style={{ margin: '20px 0 30px', maxWidth: 820, fontSize: 76, lineHeight: 1.02, fontWeight: 900, letterSpacing: 0, color: COLORS.white }}>
          Nossa assessoria não tem custo para você
        </h2>
        <p style={{ margin: 0, maxWidth: 790, fontSize: 32, lineHeight: 1.4, color: 'rgba(255,255,255,0.86)' }}>
          Somos credenciados CAIXA e acompanhamos o processo de compra com orientação especializada.
        </p>
      </div>
      <Footer />
    </div>
  );
};