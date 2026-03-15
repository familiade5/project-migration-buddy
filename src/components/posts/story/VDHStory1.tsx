import { PropertyData } from '@/types/property';
import logoCaixa from '@/assets/logo-caixa.png';

interface VDHStory1Props {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const VDHStory1 = ({ data, photo }: VDHStory1Props) => {
  const discountRaw = data.discount ?? '';
  const discountNum = discountRaw ? parseFloat(discountRaw.replace(',', '.')) : 0;
  const hasDiscount = discountNum > 0;
  const discountDisplay = discountRaw
    ? discountRaw.replace('.', ',')
    : String(discountNum);

  const acceptsFGTS = data.acceptsFGTS || data.canUseFGTS;
  const acceptsFinancing =
    data.acceptsFinancing || data.paymentMethod?.toLowerCase().includes('financ');
  const isCashOnly =
    !acceptsFinancing && data.paymentMethod?.toLowerCase().includes('vista');

  const formatPrice = (val: string) => {
    if (!val) return null;
    if (val.includes('R$')) return val;
    return `R$ ${val}`;
  };
  const price = formatPrice(data.minimumValue) || formatPrice(data.evaluationValue);

  const locationParts = [data.neighborhood, data.city, data.state].filter(Boolean);
  const locationLine = locationParts.join('  ·  ');
  const propertyType = data.type || 'Imóvel';
  const title = data.propertyName?.trim() || propertyType;

  // Color system
  const GOLD        = '#D4AF37';
  const GOLD_BRIGHT = '#F5D060';
  const GOLD_GLOW   = 'rgba(212,175,55,0.45)';
  const DARK        = 'rgba(6,14,8,0.95)';
  const GREEN_DEEP  = '#0d2210';
  const financingBg = isCashOnly
    ? 'linear-gradient(135deg, #b33a00, #e85500)'
    : 'linear-gradient(135deg, #0d5c2a, #15913f)';
  const financingGlow = isCashOnly
    ? 'rgba(232,85,0,0.5)'
    : 'rgba(21,145,63,0.5)';
  const financingBorder = isCashOnly
    ? 'rgba(255,120,50,0.5)'
    : 'rgba(50,220,100,0.45)';

  const financingLine1 = isCashOnly ? 'SOMENTE' : acceptsFGTS && acceptsFinancing ? 'FGTS +' : acceptsFGTS ? 'ACEITA' : 'ACEITA';
  const financingLine2 = isCashOnly ? 'À VISTA' : acceptsFGTS && acceptsFinancing ? 'FINANCIAMENTO' : acceptsFGTS ? 'FGTS' : 'FINANCIAMENTO';

  return (
    <div
      className="post-template-story relative overflow-hidden"
      style={{ background: GREEN_DEEP, fontFamily: 'Arial, Helvetica, sans-serif' }}
    >
      {/* ── BACKGROUND PHOTO ── */}
      {photo ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${photo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
          }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, ${GREEN_DEEP} 0%, #040e06 100%)`,
          }}
        />
      )}

      {/* Gradient overlays — top vignette + bottom dark ramp */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(4,12,6,0.80) 0%, rgba(4,12,6,0.20) 18%, rgba(4,12,6,0.0) 36%, rgba(4,12,6,0.60) 58%, rgba(4,12,6,0.97) 100%)',
        }}
      />

      {/* Subtle warm gold radial glow at bottom */}
      <div
        className="absolute"
        style={{
          bottom: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '600px',
          background: `radial-gradient(ellipse, ${GOLD_GLOW} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* ══════════════════════════════════
          1 · "ACHADO DO DIA!" — top center
          ══════════════════════════════════ */}
      <div
        className="absolute z-20 flex justify-center"
        style={{ top: '64px', left: 0, right: 0 }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${GREEN_DEEP}, #163620)`,
            border: `2.5px solid ${GOLD}`,
            borderRadius: '100px',
            padding: '22px 68px',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            boxShadow: `0 0 0 6px rgba(212,175,55,0.10), 0 8px 48px rgba(0,0,0,0.55), 0 0 40px ${GOLD_GLOW}`,
          }}
        >
          <span style={{ fontSize: '56px', lineHeight: 1 }}>🔥</span>
          <span
            style={{
              fontSize: '72px',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              lineHeight: 1,
              textShadow: `0 2px 16px rgba(0,0,0,0.5)`,
            }}
          >
            ACHADO DO DIA!
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════
          2 · DISCOUNT CARD — upper left
          ══════════════════════════════════ */}
      {hasDiscount && (
        <div
          className="absolute z-20"
          style={{ top: '226px', left: '64px' }}
        >
          <div
            style={{
            background: DARK,
            border: `2.5px solid ${GOLD}`,
            borderRadius: '22px',
            padding: '30px 50px 26px',
            boxShadow: `0 0 0 5px rgba(212,175,55,0.08), 0 16px 60px rgba(0,0,0,0.55), 0 0 30px ${GOLD_GLOW}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Inner shimmer stripe */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, transparent, ${GOLD_BRIGHT}, transparent)`,
                opacity: 0.7,
              }}
            />
            <p
              style={{
                fontSize: '92px',
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                textShadow: `0 4px 20px rgba(0,0,0,0.4)`,
              }}
            >
              {discountDisplay}% OFF
            </p>
            {locationLine && (
              <p
                style={{
                  fontSize: '30px',
                  color: 'rgba(255,255,255,0.75)',
                  fontWeight: 500,
                  marginTop: '8px',
                  letterSpacing: '0.03em',
                }}
              >
                {locationLine}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════
          3 · CENTRAL INFO CARD
          ══════════════════════════════════ */}
      <div
        className="absolute z-20"
        style={{ bottom: '230px', left: '52px', right: '52px' }}
      >
        <div
          style={{
          background: DARK,
          border: `2.5px solid ${GOLD}`,
            borderRadius: '28px',
            overflow: 'hidden',
            boxShadow: `0 0 0 6px rgba(212,175,55,0.08), 0 24px 80px rgba(0,0,0,0.65), 0 0 48px ${GOLD_GLOW}`,
            position: 'relative',
          }}
        >
          {/* Top shimmer */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `linear-gradient(90deg, transparent 0%, ${GOLD_BRIGHT} 50%, transparent 100%)`,
            }}
          />

          {/* CAIXA header */}
          <div
            style={{
              background: `linear-gradient(90deg, #163a1e, #1f5028)`,
              padding: '24px 40px',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              borderBottom: `1.5px solid rgba(212,175,55,0.25)`,
            }}
          >
            <span
              style={{
                fontSize: '38px',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.9)',
                letterSpacing: '0.05em',
              }}
            >
              Imóvel
            </span>
            <img
              src={logoCaixa}
              alt="CAIXA"
              style={{ height: '46px', objectFit: 'contain' }}
            />
            {/* Financing pill — right side */}
            <div style={{ marginLeft: 'auto' }}>
              <div
                style={{
                  background: financingBg,
                  border: `1.5px solid ${financingBorder}`,
                  borderRadius: '14px',
                  padding: '10px 24px',
                  textAlign: 'center',
                  boxShadow: `0 4px 20px ${financingGlow}`,
                }}
              >
                <p style={{ fontSize: '22px', color: '#fff', fontWeight: 900, lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {financingLine1}
                </p>
                <p style={{ fontSize: '22px', color: '#fff', fontWeight: 900, lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {financingLine2}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '28px 40px 32px' }}>
            {/* Type + location */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px',
                marginBottom: '22px',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  flexShrink: 0,
                  borderRadius: '14px',
                  background: `linear-gradient(135deg, #163a1e, #1f5028)`,
                  border: `1.5px solid rgba(212,175,55,0.3)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '4px',
                }}
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill={GOLD_BRIGHT}>
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: '40px',
                    fontWeight: 800,
                    color: '#fff',
                    lineHeight: 1.15,
                    marginBottom: '4px',
                  }}
                >
                  {title !== propertyType ? (
                    <>
                      <span style={{ color: GOLD_BRIGHT }}>{propertyType}</span>{' '}
                      <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.85)' }}>{title}</span>
                    </>
                  ) : (
                    <span style={{ color: GOLD_BRIGHT }}>{propertyType}</span>
                  )}
                </p>
                {locationLine && (
                  <p
                    style={{
                      fontSize: '28px',
                      color: 'rgba(255,255,255,0.6)',
                      lineHeight: 1.3,
                    }}
                  >
                    {locationLine}
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                height: '1px',
                background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)`,
                marginBottom: '22px',
              }}
            />

            {/* Financing check row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '28px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: isCashOnly
                    ? 'linear-gradient(135deg, #b33a00, #e85500)'
                    : 'linear-gradient(135deg, #0d5c2a, #15913f)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 3px 12px ${financingGlow}`,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <span style={{ fontSize: '34px', color: '#fff', lineHeight: 1.2 }}>
                <strong style={{ fontWeight: 800 }}>
                  {isCashOnly ? 'Somente' : 'Aceita'}
                </strong>{' '}
                <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.85)' }}>
                  {isCashOnly
                    ? 'à vista'
                    : acceptsFGTS && acceptsFinancing
                    ? 'FGTS + financiamento'
                    : acceptsFGTS
                    ? 'FGTS'
                    : 'financiamento'}
                </span>
              </span>
            </div>

            {/* Price pill */}
            {price && (
              <div
                style={{
                  background: `linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.06))`,
                  border: `2px solid ${GOLD}`,
                  borderRadius: '100px',
                  padding: '20px 48px',
                  textAlign: 'center',
                  boxShadow: `0 0 32px ${GOLD_GLOW}, inset 0 1px 0 rgba(245,208,96,0.15)`,
                }}
              >
                <span
                  style={{
                    fontSize: '64px',
                    fontWeight: 900,
                    color: '#fff',
                    letterSpacing: '-0.01em',
                    lineHeight: 1,
                    textShadow: `0 2px 12px rgba(0,0,0,0.4)`,
                  }}
                >
                  {price}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          4 · WHATSAPP CTA
          ══════════════════════════════════ */}
      <div
        className="absolute z-20 flex justify-center"
        style={{ bottom: '72px', left: '52px', right: '52px' }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, #0f3318, #1a5228)`,
            border: `2.5px solid ${GOLD}`,
            borderRadius: '100px',
            padding: '30px 0',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '22px',
            boxShadow: `0 0 0 5px rgba(212,175,55,0.08), 0 12px 40px rgba(0,0,0,0.55), 0 0 32px ${GOLD_GLOW}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Inner shimmer */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${GOLD_BRIGHT}, transparent)`,
            }}
          />
          <svg width="50" height="50" viewBox="0 0 24 24" fill="#4ade80">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span
            style={{
              fontSize: '48px',
              color: '#fff',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)',
            }}
          >
            Falar com o Corretor
          </span>
        </div>
      </div>
    </div>
  );
};
