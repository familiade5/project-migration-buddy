import { PropertyData } from '@/types/property';
import logoCaixa from '@/assets/logo-caixa.png';

interface VDHStory1Props {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

const GOLD = '#D6A84E';
const GOLD_LIGHT = '#F2C25A';
const DARK_GREEN = '#1F4E3D';
const CARD_BG = 'rgba(14, 28, 18, 0.93)';
const GOLD_BORDER = `2px solid ${GOLD}`;

export const VDHStory1 = ({ data, photo }: VDHStory1Props) => {
  const discountNum = data.discount ? parseFloat(data.discount.replace(',', '.')) : 0;
  const hasDiscount = discountNum > 0;

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
  const price = formatPrice(data.minimumValue) || formatFormat(data.evaluationValue);

  const locationParts = [data.neighborhood, data.city, data.state].filter(Boolean);
  const locationLine = locationParts.join('  ·  ');
  const propertyType = data.type || 'Imóvel';
  const title = data.propertyName?.trim() || propertyType;

  const financingText = isCashOnly
    ? 'Somente à vista'
    : acceptsFGTS && acceptsFinancing
    ? 'Aceita FGTS + Financiamento'
    : acceptsFGTS
    ? 'Aceita FGTS'
    : 'Aceita financiamento';

  const financingColor = isCashOnly ? '#f97316' : '#22c55e';

  return (
    <div
      className="post-template-story relative overflow-hidden"
      style={{ background: '#0a1208', fontFamily: 'Arial, Helvetica, sans-serif' }}
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
          style={{ background: 'linear-gradient(160deg, #1a3020 0%, #0a1810 100%)' }}
        />
      )}

      {/* Top dark fade */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 22%, rgba(0,0,0,0.0) 38%, rgba(0,0,0,0.55) 62%, rgba(6,14,4,0.97) 100%)',
        }}
      />

      {/* ── 1. "ACHADO DO DIA!" BADGE — centered top ── */}
      <div
        className="absolute z-20 flex justify-center"
        style={{ top: '72px', left: 0, right: 0 }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(14,30,18,0.97), rgba(20,42,24,0.97))',
            border: GOLD_BORDER,
            borderRadius: '60px',
            padding: '20px 60px',
            boxShadow: `0 0 40px rgba(214,168,78,0.35), inset 0 1px 0 rgba(242,194,90,0.15)`,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <span style={{ fontSize: '52px', lineHeight: 1 }}>🔥</span>
          <span
            style={{
              fontSize: '68px',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            ACHADO DO DIA!
          </span>
        </div>
      </div>

      {/* ── 2. DISCOUNT CARD — top left ── */}
      {hasDiscount && (
        <div
          className="absolute z-20"
          style={{ top: '220px', left: '64px' }}
        >
          <div
            style={{
              background: 'rgba(10,24,14,0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: GOLD_BORDER,
              borderRadius: '20px',
              padding: '28px 44px 24px',
              boxShadow: `0 12px 48px rgba(0,0,0,0.5), 0 0 24px rgba(214,168,78,0.2)`,
            }}
          >
            <p
              style={{
                fontSize: '84px',
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1,
                letterSpacing: '-0.01em',
              }}
            >
              {data.discount ? data.discount.replace('.', ',') : discountNum}% OFF
            </p>
            {locationLine && (
              <p
                style={{
                  fontSize: '30px',
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 500,
                  marginTop: '8px',
                  letterSpacing: '0.02em',
                }}
              >
                {locationLine}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── 3. CENTRAL INFO CARD ── */}
      <div
        className="absolute z-20"
        style={{ bottom: '220px', left: '60px', right: '60px' }}
      >
        <div
          style={{
            background: CARD_BG,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: GOLD_BORDER,
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: `0 16px 64px rgba(0,0,0,0.6), 0 0 32px rgba(214,168,78,0.15)`,
          }}
        >
          {/* CAIXA header row */}
          <div
            style={{
              background: `linear-gradient(90deg, ${DARK_GREEN}, #2a6048)`,
              padding: '22px 36px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              borderBottom: `1px solid rgba(214,168,78,0.3)`,
            }}
          >
            <span
              style={{
                fontSize: '36px',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '0.04em',
              }}
            >
              Imóvel
            </span>
            <img
              src={logoCaixa}
              alt="CAIXA"
              style={{ height: '44px', objectFit: 'contain', filter: 'brightness(1.1)' }}
            />
          </div>

          {/* Property info */}
          <div style={{ padding: '28px 36px 24px' }}>
            {/* Type + title */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '18px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  flexShrink: 0,
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${DARK_GREEN}, #2a6048)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '4px',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill={GOLD_LIGHT}>
                  <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z" />
                </svg>
              </div>
              <div>
                <p
                  style={{
                    fontSize: '36px',
                    fontWeight: 800,
                    color: '#fff',
                    lineHeight: 1.2,
                  }}
                >
                  <strong>{propertyType}</strong>
                  {title !== propertyType && (
                    <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.8)' }}>
                      {' '}
                      {title}
                    </span>
                  )}
                </p>
                {locationLine && (
                  <p
                    style={{
                      fontSize: '28px',
                      color: 'rgba(255,255,255,0.65)',
                      marginTop: '4px',
                    }}
                  >
                    {locationLine}
                  </p>
                )}
              </div>
            </div>

            {/* Financing row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                marginBottom: '28px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: financingColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <span style={{ fontSize: '32px', color: '#fff', fontWeight: 500 }}>
                <strong style={{ fontWeight: 800 }}>
                  {isCashOnly ? 'Somente' : 'Aceita'}
                </strong>{' '}
                {isCashOnly ? 'à vista' : acceptsFGTS && acceptsFinancing ? 'FGTS + financiamento' : acceptsFGTS ? 'FGTS' : 'financiamento'}
              </span>
            </div>

            {/* Price pill */}
            {price && (
              <div
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: GOLD_BORDER,
                  borderRadius: '60px',
                  padding: '18px 40px',
                  textAlign: 'center',
                  boxShadow: `inset 0 1px 0 rgba(242,194,90,0.1)`,
                }}
              >
                <span
                  style={{
                    fontSize: '60px',
                    fontWeight: 900,
                    color: '#fff',
                    letterSpacing: '-0.01em',
                    lineHeight: 1,
                  }}
                >
                  {price}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 4. WHATSAPP CTA BUTTON ── */}
      <div
        className="absolute z-20 flex justify-center"
        style={{ bottom: '80px', left: '60px', right: '60px' }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #1a3d1a, #245c28)',
            border: GOLD_BORDER,
            borderRadius: '100px',
            padding: '28px 80px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(214,168,78,0.2)`,
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#4ade80">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span
            style={{
              fontSize: '46px',
              color: '#fff',
              fontWeight: 800,
              letterSpacing: '0.03em',
            }}
          >
            Falar com o Corretor
          </span>
        </div>
      </div>
    </div>
  );
};
