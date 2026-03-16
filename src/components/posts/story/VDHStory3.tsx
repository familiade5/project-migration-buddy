import { PropertyData } from '@/types/property';
import logoVDH from '@/assets/logo-vdh.jpg';

interface VDHStory3Props {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

// Hexágono flat-top: width% e height% são iguais na proporção do story (9:16 × 65% ≈ 0.866)
const HEX = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
const GOLD = '#D4AF37';

const HexPhoto = ({
  src,
  size,
  style,
}: {
  src: string | null;
  size: string; // ex: '46%'
  style?: React.CSSProperties;
}) => (
  // Camada externa dourada (borda)
  <div
    style={{
      position: 'absolute',
      width: size,
      aspectRatio: '1 / 0.866',
      clipPath: HEX,
      background: `linear-gradient(135deg, ${GOLD}, #F0D870 50%, ${GOLD})`,
      filter: `drop-shadow(0 0 18px rgba(212,175,55,0.55))`,
      ...style,
    }}
  >
    {/* Camada interna — foto (92% do hex) */}
    <div
      style={{
        position: 'absolute',
        top: '4%',
        left: '4%',
        width: '92%',
        height: '92%',
        clipPath: HEX,
        overflow: 'hidden',
        background: '#0d1420',
      }}
    >
      {src ? (
        <div
          style={{
            position: 'absolute',
            inset: '-8%',
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a2535, #0d1420)' }} />
      )}
    </div>
  </div>
);

export const VDHStory3 = ({ data, photo, photos }: VDHStory3Props) => {
  const getPhoto = (index: number) => {
    if (photos && photos[index]) return photos[index];
    if (photo) return photo;
    return null;
  };

  const p0 = getPhoto(0);
  const p1 = getPhoto(1);
  const p2 = getPhoto(2);

  const getFinancingText = () => {
    if (data.acceptsFinancing) return { text: 'Aceita Financiamento', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' };
    return { text: 'Somente à Vista', color: '#f97316', bg: 'rgba(249,115,22,0.12)' };
  };

  const financing = getFinancingText();

  return (
    <div className="post-template-story relative overflow-hidden" style={{ background: '#07101c' }}>

      {/* ── Fundo: padrão de pontos suave ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(212,175,55,0.08) 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
          zIndex: 0,
        }}
      />

      {/* ── Halo central ── */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '55%',
          background: 'radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* ══ ÁREA DE HEXÁGONOS — 65% superior ══ */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '65%',
          zIndex: 2,
        }}
      >
        {/*
          Layout em pirâmide invertida:
          - Hex 1 (grande, centro-topo): 46% wide, top: 2%
          - Hex 2 (médio, esq-baixo):   36% wide, bottom: 2%
          - Hex 3 (médio, dir-baixo):   36% wide, bottom: 2%
          Linha dourada conectando os 3 centros
        */}

        {/* Linha conectora: hex1 → hex2 */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Centro do hex1 ≈ (50, 25), hex2 ≈ (22, 76), hex3 ≈ (78, 76) */}
          <line x1="50" y1="25" x2="22" y2="76" stroke={`${GOLD}55`} strokeWidth="0.4" strokeDasharray="1.5 2" />
          <line x1="50" y1="25" x2="78" y2="76" stroke={`${GOLD}55`} strokeWidth="0.4" strokeDasharray="1.5 2" />
          <line x1="22" y1="76" x2="78" y2="76" stroke={`${GOLD}33`} strokeWidth="0.3" strokeDasharray="1.5 2" />
          {/* Pontos nos vértices */}
          <circle cx="50" cy="25" r="0.8" fill={GOLD} opacity="0.6" />
          <circle cx="22" cy="76" r="0.8" fill={GOLD} opacity="0.6" />
          <circle cx="78" cy="76" r="0.8" fill={GOLD} opacity="0.6" />
        </svg>

        {/* Hex 1 — grande, topo centro */}
        <HexPhoto
          src={p0}
          size="48%"
          style={{ left: '26%', top: '1%' }}
        />

        {/* Hex 2 — médio, esquerda baixo */}
        <HexPhoto
          src={p1}
          size="37%"
          style={{ left: '4%', bottom: '2%' }}
        />

        {/* Hex 3 — médio, direita baixo */}
        <HexPhoto
          src={p2}
          size="37%"
          style={{ right: '4%', bottom: '2%' }}
        />
      </div>

      {/* Fade suave para o painel */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(65% - 50px)',
          left: 0,
          right: 0,
          height: '60px',
          background: 'linear-gradient(to bottom, transparent, #07101c)',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />

      {/* ══ PAINEL DE INFORMAÇÕES — 35% inferior ══ */}
      <div
        style={{
          position: 'absolute',
          top: '65%',
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '14px 42px 44px',
          zIndex: 10,
        }}
      >
        {/* Divisor dourado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${GOLD}70)` }} />
          <div style={{ width: 6, height: 6, background: GOLD, transform: 'rotate(45deg)', opacity: 0.8 }} />
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(to left, transparent, ${GOLD}70)` }} />
        </div>

        {/* Card de preço */}
        <div
          style={{
            background: 'rgba(7,16,28,0.96)',
            border: `1px solid ${GOLD}40`,
            borderRadius: '18px',
            padding: '16px 28px 14px',
            marginBottom: '12px',
            boxShadow: `0 6px 28px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,175,55,0.08)`,
          }}
        >
          {data.evaluationValue && (
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through', textAlign: 'center', marginBottom: '2px' }}>
              {data.evaluationValue}
            </p>
          )}
          <p style={{ fontSize: '15px', color: GOLD, textAlign: 'center', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 500, opacity: 0.8 }}>
            Valor de Venda
          </p>
          <p style={{ fontSize: '54px', fontWeight: 800, color: '#ffffff', textAlign: 'center', lineHeight: 1, letterSpacing: '-0.01em' }}>
            {data.minimumValue || 'R$ --'}
          </p>
          {data.discount && parseFloat(data.discount.replace(',', '.')) > 0 && (
            <div style={{ marginTop: '10px', background: 'linear-gradient(135deg, #e87722, #f59e0b)', borderRadius: '10px', padding: '7px 18px', textAlign: 'center' }}>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '19px' }}>Economia de {data.discount}%</p>
            </div>
          )}
        </div>

        {/* Pills lado a lado */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
          <div style={{ flex: 1, background: financing.bg, border: `1px solid ${financing.color}44`, borderRadius: '13px', padding: '10px 12px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '3px', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Pagamento</p>
            <p style={{ fontSize: '16px', fontWeight: 700, color: financing.color, lineHeight: 1.2 }}>{financing.text}</p>
          </div>
          <div style={{ flex: 1, background: data.acceptsFGTS ? 'rgba(34,197,94,0.12)' : 'rgba(249,115,22,0.12)', border: `1px solid ${data.acceptsFGTS ? '#22c55e' : '#f97316'}44`, borderRadius: '13px', padding: '10px 12px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '3px', letterSpacing: '0.07em', textTransform: 'uppercase' }}>FGTS</p>
            <p style={{ fontSize: '16px', fontWeight: 700, color: data.acceptsFGTS ? '#22c55e' : '#f97316', lineHeight: 1.2 }}>
              {data.acceptsFGTS ? 'Pode usar FGTS' : 'Não aceita FGTS'}
            </p>
          </div>
        </div>

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto' }}>
          <img src={logoVDH} alt="VDH" style={{ height: '40px', objectFit: 'contain', borderRadius: '6px' }} />
        </div>
      </div>

    </div>
  );
};
