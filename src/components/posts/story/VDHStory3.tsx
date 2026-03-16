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
  const p2 = getPhoto(2);

  const getFinancingText = () => {
    if (data.acceptsFinancing) return { text: 'Aceita Financiamento', color: '#22c55e', bg: 'rgba(34,197,94,0.10)' };
    return { text: 'Somente à Vista', color: '#f97316', bg: 'rgba(249,115,22,0.10)' };
  };

  const financing = getFinancingText();
  const GOLD = '#D4AF37';
  const BORDER = `2px solid ${GOLD}`;

  const photoStyle = (src: string) => ({
    position: 'absolute' as const,
    inset: 0,
    backgroundImage: `url(${src})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  });

  return (
    <div className="post-template-story relative overflow-hidden" style={{ background: '#06090f' }}>

      {/* ══ GRADE DE FOTOS — 62% superior ══════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          height: 'calc(62% - 12px)',
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gridTemplateRows: '1fr 1fr',
          gap: '6px',
        }}
      >
        {/* Foto 1 — hero, ocupa 2 linhas à esquerda */}
        <div
          style={{
            gridRow: '1 / 3',
            gridColumn: '1',
            overflow: 'hidden',
            position: 'relative',
            borderRadius: '12px',
            border: BORDER,
            boxShadow: `0 0 24px rgba(212,175,55,0.18)`,
          }}
        >
          {p0 ? (
            <div style={photoStyle(p0)} />
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: '#1a2535' }} />
          )}
          {/* Shine corner */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to bottom, rgba(212,175,55,0.08), transparent)', pointerEvents: 'none' }} />
        </div>

        {/* Foto 2 — topo direita */}
        <div
          style={{
            gridRow: '1',
            gridColumn: '2',
            overflow: 'hidden',
            position: 'relative',
            borderRadius: '12px',
            border: BORDER,
            boxShadow: `0 0 16px rgba(212,175,55,0.14)`,
          }}
        >
          {p1 ? (
            <div style={photoStyle(p1)} />
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: '#1e2c42' }} />
          )}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to bottom, rgba(212,175,55,0.07), transparent)', pointerEvents: 'none' }} />
        </div>

        {/* Foto 3 — base direita */}
        <div
          style={{
            gridRow: '2',
            gridColumn: '2',
            overflow: 'hidden',
            position: 'relative',
            borderRadius: '12px',
            border: BORDER,
            boxShadow: `0 0 16px rgba(212,175,55,0.14)`,
          }}
        >
          {p2 ? (
            <div style={photoStyle(p2)} />
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: '#151f30' }} />
          )}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to bottom, rgba(212,175,55,0.07), transparent)', pointerEvents: 'none' }} />
          {/* Badge fotos */}
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              background: 'rgba(6,9,15,0.82)',
              border: `1px solid ${GOLD}55`,
              borderRadius: '6px',
              padding: '3px 8px',
            }}
          >
            <span style={{ color: GOLD, fontSize: '16px', fontWeight: 700, letterSpacing: '0.04em' }}>3 fotos</span>
          </div>
        </div>
      </div>

      {/* ══ PAINEL DE INFORMAÇÕES — 38% inferior ═══════════════════════ */}
      <div
        style={{
          position: 'absolute',
          top: '62%',
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '14px 20px 20px',
          zIndex: 20,
        }}
      >
        {/* Divisor dourado com label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${GOLD}99)` }} />
          <span style={{ color: GOLD, fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 600 }}>
            ✦ Oportunidade ✦
          </span>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(to left, transparent, ${GOLD}99)` }} />
        </div>

        {/* Card de preço com borda dourada */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(14,20,36,0.98), rgba(8,12,22,0.98))',
            border: `1.5px solid ${GOLD}55`,
            borderRadius: '16px',
            padding: '14px 24px 12px',
            marginBottom: '10px',
            boxShadow: `0 2px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,175,55,0.12), 0 0 0 1px rgba(212,175,55,0.06)`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle gold shimmer line top */}
          <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', background: `linear-gradient(to right, transparent, ${GOLD}88, transparent)` }} />

          {data.evaluationValue && (
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through', textAlign: 'center', marginBottom: '2px' }}>
              {data.evaluationValue}
            </p>
          )}
          <p style={{ fontSize: '11px', color: GOLD, textAlign: 'center', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '3px', fontWeight: 600, opacity: 0.9 }}>
            Valor de Venda
          </p>
          <p style={{ fontSize: '48px', fontWeight: 900, color: '#ffffff', textAlign: 'center', lineHeight: 1, letterSpacing: '-0.02em', textShadow: `0 0 40px rgba(212,175,55,0.2)` }}>
            {data.minimumValue || 'R$ --'}
          </p>
          {data.discount && parseFloat(data.discount.replace(',', '.')) > 0 && (
            <div style={{ marginTop: '8px', background: 'linear-gradient(135deg, #e87722, #f59e0b)', borderRadius: '8px', padding: '5px 14px', textAlign: 'center' }}>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: '17px', letterSpacing: '0.04em' }}>🏷 Economia de {data.discount}%</p>
            </div>
          )}
        </div>

        {/* Pills de condições com bordas */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <div
            style={{
              flex: 1,
              background: financing.bg,
              border: `1.5px solid ${financing.color}55`,
              borderRadius: '12px',
              padding: '9px 10px',
              textAlign: 'center',
              boxShadow: `0 0 12px ${financing.color}18`,
            }}
          >
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.38)', marginBottom: '2px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Pagamento</p>
            <p style={{ fontSize: '14px', fontWeight: 700, color: financing.color, lineHeight: 1.2 }}>{financing.text}</p>
          </div>
          <div
            style={{
              flex: 1,
              background: data.acceptsFGTS ? 'rgba(34,197,94,0.10)' : 'rgba(249,115,22,0.10)',
              border: `1.5px solid ${data.acceptsFGTS ? '#22c55e' : '#f97316'}55`,
              borderRadius: '12px',
              padding: '9px 10px',
              textAlign: 'center',
              boxShadow: `0 0 12px ${data.acceptsFGTS ? '#22c55e' : '#f97316'}18`,
            }}
          >
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.38)', marginBottom: '2px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>FGTS</p>
            <p style={{ fontSize: '14px', fontWeight: 700, color: data.acceptsFGTS ? '#22c55e' : '#f97316', lineHeight: 1.2 }}>
              {data.acceptsFGTS ? 'Pode usar FGTS' : 'Não aceita FGTS'}
            </p>
          </div>
        </div>

        {/* Logo com borda dourada */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto' }}>
          <div style={{ border: `1.5px solid ${GOLD}55`, borderRadius: '10px', padding: '4px 14px', boxShadow: `0 0 16px rgba(212,175,55,0.12)` }}>
            <img src={logoVDH} alt="VDH" style={{ height: '34px', objectFit: 'contain', borderRadius: '6px', display: 'block' }} />
          </div>
        </div>
      </div>

    </div>
  );
};

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
  const p2 = getPhoto(2);

  const getFinancingText = () => {
    if (data.acceptsFinancing) return { text: 'Aceita Financiamento', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' };
    return { text: 'Somente à Vista', color: '#f97316', bg: 'rgba(249,115,22,0.12)' };
  };

  const financing = getFinancingText();
  const GOLD = '#D4AF37';
  const GAP = 3; // px entre fotos

  return (
    <div className="post-template-story relative overflow-hidden" style={{ background: '#080e18' }}>

      {/* ══ GRADE DE FOTOS — 65% superior ══════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '65%',
          display: 'flex',
          gap: `${GAP}px`,
          padding: `${GAP}px`,
          background: GOLD,           // o gap dourado vem do fundo
        }}
      >
        {/* ── Foto 1 — hero à esquerda, full height ── */}
        <div style={{ flex: '1.15', overflow: 'hidden', position: 'relative' }}>
          {p0 ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${p0})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: '#1a2535' }} />
          )}
        </div>

        {/* ── Coluna direita: 2 fotos empilhadas ── */}
        <div style={{ flex: '0.85', display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
          {/* Foto 2 */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            {p1 ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${p1})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            ) : (
              <div style={{ position: 'absolute', inset: 0, background: '#1e2c42' }} />
            )}
          </div>

          {/* Foto 3 */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            {p2 ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${p2})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            ) : (
              <div style={{ position: 'absolute', inset: 0, background: '#151f30' }} />
            )}

            {/* Badge de canto com nº de fotos */}
            <div
              style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                background: 'rgba(8,14,24,0.75)',
                border: `1px solid ${GOLD}66`,
                borderRadius: '8px',
                padding: '5px 10px',
                backdropFilter: 'blur(6px)',
              }}
            >
              <span style={{ color: GOLD, fontSize: '20px', fontWeight: 600, letterSpacing: '0.05em' }}>3 fotos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gradiente suave de transição foto → painel */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(65% - 60px)',
          left: 0,
          right: 0,
          height: '80px',
          background: 'linear-gradient(to bottom, transparent, #080e18)',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />

      {/* ══ PAINEL DE INFORMAÇÕES — 35% inferior ═══════════════════════ */}
      <div
        style={{
          position: 'absolute',
          top: '65%',
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '18px 44px 46px',
          zIndex: 20,
        }}
      >
        {/* Linha decorativa dourada */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${GOLD}88)` }} />
          <span style={{ color: GOLD, fontSize: '18px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 500, opacity: 0.7 }}>
            Oportunidade
          </span>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(to left, transparent, ${GOLD}88)` }} />
        </div>

        {/* Card de preço */}
        <div
          style={{
            background: 'rgba(10,16,28,0.95)',
            border: `1px solid ${GOLD}44`,
            borderRadius: '20px',
            padding: '18px 30px 16px',
            marginBottom: '14px',
            boxShadow: `0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,175,55,0.1)`,
          }}
        >
          {data.evaluationValue && (
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.38)', textDecoration: 'line-through', textAlign: 'center', marginBottom: '2px' }}>
              {data.evaluationValue}
            </p>
          )}
          <p style={{ fontSize: '16px', color: GOLD, textAlign: 'center', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 500, opacity: 0.85 }}>
            Valor de Venda
          </p>
          <p style={{ fontSize: '56px', fontWeight: 800, color: '#ffffff', textAlign: 'center', lineHeight: 1, letterSpacing: '-0.01em' }}>
            {data.minimumValue || 'R$ --'}
          </p>
          {data.discount && parseFloat(data.discount.replace(',', '.')) > 0 && (
            <div style={{ marginTop: '10px', background: 'linear-gradient(135deg, #e87722, #f59e0b)', borderRadius: '10px', padding: '7px 18px', textAlign: 'center' }}>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '20px' }}>Economia de {data.discount}%</p>
            </div>
          )}
        </div>

        {/* Pills de condições */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <div
            style={{
              flex: 1,
              background: financing.bg,
              border: `1px solid ${financing.color}44`,
              borderRadius: '14px',
              padding: '11px 12px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '3px', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Pagamento</p>
            <p style={{ fontSize: '17px', fontWeight: 700, color: financing.color, lineHeight: 1.2 }}>{financing.text}</p>
          </div>
          <div
            style={{
              flex: 1,
              background: data.acceptsFGTS ? 'rgba(34,197,94,0.12)' : 'rgba(249,115,22,0.12)',
              border: `1px solid ${data.acceptsFGTS ? '#22c55e' : '#f97316'}44`,
              borderRadius: '14px',
              padding: '11px 12px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '3px', letterSpacing: '0.07em', textTransform: 'uppercase' }}>FGTS</p>
            <p style={{ fontSize: '17px', fontWeight: 700, color: data.acceptsFGTS ? '#22c55e' : '#f97316', lineHeight: 1.2 }}>
              {data.acceptsFGTS ? 'Pode usar FGTS' : 'Não aceita FGTS'}
            </p>
          </div>
        </div>

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto' }}>
          <img src={logoVDH} alt="VDH" style={{ height: '42px', objectFit: 'contain', borderRadius: '6px' }} />
        </div>
      </div>

    </div>
  );
};
