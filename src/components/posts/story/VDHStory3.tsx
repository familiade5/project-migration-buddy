import { PropertyData } from '@/types/property';
import logoVDH from '@/assets/logo-vdh.jpg';

interface VDHStory3Props {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const VDHStory3 = ({ data, photo, photos }: VDHStory3Props) => {
  const getPhoto = (index: number) => {
    if (photos && photos[index]) return photos[index];
    if (photo) return photo;
    return null;
  };

  const p0 = getPhoto(0);
  const p1 = getPhoto(1);

  const getFinancingText = () => {
    if (data.acceptsFinancing) return { text: 'Aceita Financiamento', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' };
    return { text: 'Somente à Vista', color: '#f97316', bg: 'rgba(249,115,22,0.12)' };
  };

  const financing = getFinancingText();
  const GOLD = '#D4AF37';

  return (
    <div className="post-template-story relative overflow-hidden" style={{ background: '#0d1420' }}>

      {/* ── FOTO 1 — diagonal top (65% da altura, corte diagonal na base) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '68%',
          clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)',
          overflow: 'hidden',
        }}
      >
        {p0 ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${p0})`, transform: 'scale(1.05)' }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #2a3a55 0%, #1a2535 100%)' }}
          />
        )}
        {/* Overlay escuro sutil na base para contraste */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.55) 100%)',
          }}
        />
      </div>

      {/* ── FOTO 2 — diagonal bottom (a partir do meio, corte diagonal no topo) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          clipPath: 'polygon(0 28%, 100% 0, 100% 100%, 0 100%)',
          overflow: 'hidden',
        }}
      >
        {p1 ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${p1})`, transform: 'scale(1.05)' }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #1a2535 0%, #0d1420 100%)' }}
          />
        )}
        {/* Overlay escuro sutil no topo para contraste */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* ── FAIXA DOURADA DIAGONAL no centro ─── */}
      <div
        style={{
          position: 'absolute',
          top: '37%',
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, transparent 0%, ${GOLD} 20%, #F0D870 50%, ${GOLD} 80%, transparent 100%)`,
          transform: 'rotate(-8deg) scaleX(1.3)',
          zIndex: 20,
          boxShadow: `0 0 18px 4px rgba(212,175,55,0.45)`,
        }}
      />
      {/* segunda linha sutil */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(37% + 10px)',
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.4) 25%, rgba(212,175,55,0.6) 50%, rgba(212,175,55,0.4) 75%, transparent 100%)`,
          transform: 'rotate(-8deg) scaleX(1.3)',
          zIndex: 20,
        }}
      />

      {/* ── PAINEL DE INFORMAÇÕES — flutuando no centro-baixo ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          padding: '0 44px 52px',
        }}
      >
        {/* Card principal de preço */}
        <div
          style={{
            background: 'rgba(10,16,28,0.88)',
            border: `1px solid rgba(212,175,55,0.35)`,
            borderRadius: '24px',
            padding: '28px 36px 24px',
            marginBottom: '18px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          }}
        >
          {data.evaluationValue && (
            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
              <span
                style={{
                  fontSize: '20px',
                  color: 'rgba(255,255,255,0.45)',
                  textDecoration: 'line-through',
                  letterSpacing: '0.03em',
                }}
              >
                {data.evaluationValue}
              </span>
            </div>
          )}

          <p
            style={{
              fontSize: '22px',
              color: `${GOLD}`,
              textAlign: 'center',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '6px',
              fontWeight: 500,
            }}
          >
            Valor de Venda
          </p>
          <p
            style={{
              fontSize: '66px',
              fontWeight: 800,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1,
              letterSpacing: '-0.01em',
              textShadow: `0 0 40px rgba(212,175,55,0.3)`,
            }}
          >
            {data.minimumValue || 'R$ --'}
          </p>

          {data.discount && parseFloat(data.discount.replace(',', '.')) > 0 && (
            <div
              style={{
                marginTop: '16px',
                background: 'linear-gradient(135deg, #e87722, #f59e0b)',
                borderRadius: '14px',
                padding: '10px 24px',
                textAlign: 'center',
              }}
            >
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '26px', letterSpacing: '0.02em' }}>
                Economia de {data.discount}%
              </p>
            </div>
          )}
        </div>

        {/* Pills de condições lado a lado */}
        <div style={{ display: 'flex', gap: '14px', marginBottom: '22px' }}>
          {/* Financiamento */}
          <div
            style={{
              flex: 1,
              background: financing.bg,
              border: `1px solid ${financing.color}55`,
              borderRadius: '16px',
              padding: '16px 18px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Pagamento
            </p>
            <p style={{ fontSize: '22px', fontWeight: 700, color: financing.color, lineHeight: 1.2 }}>
              {financing.text}
            </p>
          </div>

          {/* FGTS */}
          <div
            style={{
              flex: 1,
              background: data.acceptsFGTS ? 'rgba(34,197,94,0.12)' : 'rgba(249,115,22,0.12)',
              border: `1px solid ${data.acceptsFGTS ? '#22c55e' : '#f97316'}55`,
              borderRadius: '16px',
              padding: '16px 18px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              FGTS
            </p>
            <p
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: data.acceptsFGTS ? '#22c55e' : '#f97316',
                lineHeight: 1.2,
              }}
            >
              {data.acceptsFGTS ? 'Pode usar FGTS' : 'Não aceita FGTS'}
            </p>
          </div>
        </div>

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src={logoVDH}
            alt="VDH"
            style={{ height: '48px', objectFit: 'contain', borderRadius: '6px' }}
          />
        </div>
      </div>

    </div>
  );
};
