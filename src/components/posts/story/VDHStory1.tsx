import { PropertyData } from '@/types/property';
import logoVDH from '@/assets/logo-vdh.jpg';

interface VDHStory1Props {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

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
  const price = formatPrice(data.minimumValue) || formatPrice(data.evaluationValue);

  const locationLine = [data.neighborhood, data.city, data.state]
    .filter(Boolean)
    .join(' · ');

  const cityState = [data.city, data.state].filter(Boolean).join(' - ');
  const propertyType = data.type || 'Imóvel';
  const title = data.propertyName?.trim() || propertyType;

  const financingLabel = isCashOnly
    ? ['SOMENTE', 'À VISTA']
    : acceptsFGTS && acceptsFinancing
    ? ['FGTS +', 'FINANCIAMENTO']
    : acceptsFGTS
    ? ['ACEITA', 'FGTS']
    : ['ACEITA', 'FINANCIAMENTO'];

  const financingBg = isCashOnly
    ? 'linear-gradient(135deg, #d4580a, #f07020)'
    : 'linear-gradient(135deg, #1daa5c, #2dd46e)';

  return (
    <div
      className="post-template-story relative overflow-hidden"
      style={{ background: '#000', fontFamily: 'Arial, Helvetica, sans-serif' }}
    >
      {/* ── BACKGROUND IMAGE ── */}
      {photo ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${photo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
          }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(160deg, #1a3020 0%, #0e2018 60%, #080e04 100%)',
          }}
        />
      )}

      {/* Subtle dark vignette so top/bottom cards stay readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.0) 28%, rgba(0,0,0,0.0) 60%, rgba(0,0,0,0.72) 100%)',
        }}
      />

      {/* ── TOP ROW: DISCOUNT CARD (left) + CAIXA BADGE (right) ── */}
      <div
        className="absolute z-20 flex items-start justify-between"
        style={{ top: '52px', left: '36px', right: '36px' }}
      >
        {/* Discount card */}
        <div
          style={{
            background: 'rgba(18,52,36,0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '2px solid rgba(180,145,40,0.55)',
            borderRadius: '20px',
            padding: '22px 30px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            maxWidth: '62%',
          }}
        >
          <p
            style={{
              fontSize: '17px',
              color: 'rgba(255,255,255,0.75)',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}
          >
            Desconto Imperdível
          </p>

          {hasDiscount && (
            <p
              style={{
                fontSize: '68px',
                fontWeight: 900,
                color: '#f0d060',
                lineHeight: 1,
                letterSpacing: '-0.01em',
              }}
            >
              {discountNum}% OFF
            </p>
          )}

          {locationLine && (
            <p
              style={{
                fontSize: '18px',
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 500,
                marginTop: '6px',
              }}
            >
              {propertyType} · {cityState}
            </p>
          )}
        </div>

        {/* Caixa badge */}
        <div
          style={{
            background: 'linear-gradient(135deg, #c8960a, #e8b830)',
            border: '2px solid rgba(255,220,80,0.35)',
            borderRadius: '18px',
            padding: '14px 22px',
            textAlign: 'center',
            boxShadow: '0 6px 24px rgba(200,150,10,0.45)',
          }}
        >
          <p
            style={{
              fontSize: '15px',
              color: 'rgba(20,14,0,0.75)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              lineHeight: 1,
              marginBottom: '2px',
            }}
          >
            Imóvel
          </p>
          <p
            style={{
              fontSize: '30px',
              color: '#0d1a08',
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            CAIXA
          </p>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div
        className="absolute z-20 bottom-0 left-0 right-0"
        style={{
          background: 'rgba(28,32,22,0.97)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderTop: '1px solid rgba(180,145,40,0.3)',
        }}
      >
        {/* Top strip of bottom bar: VDH logo | Financing badge | Info | Price */}
        <div
          className="flex items-center justify-between"
          style={{ padding: '22px 32px', gap: '16px' }}
        >
          {/* VDH brand */}
          <div className="flex flex-col items-center" style={{ gap: '6px', flexShrink: 0 }}>
            <img
              src={logoVDH}
              alt="VDH"
              style={{ height: '44px', width: '44px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <span
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.55)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              VDH
            </span>
          </div>

          {/* Financing badge */}
          <div
            style={{
              background: financingBg,
              borderRadius: '14px',
              padding: '14px 18px',
              textAlign: 'center',
              flexShrink: 0,
              boxShadow: isCashOnly
                ? '0 4px 16px rgba(210,88,10,0.4)'
                : '0 4px 16px rgba(29,170,92,0.4)',
            }}
          >
            <p
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                lineHeight: 1,
                marginBottom: '2px',
              }}
            >
              Imóvel Caixa
            </p>
            <p style={{ fontSize: '16px', color: '#fff', fontWeight: 900, lineHeight: 1 }}>
              {financingLabel[0]}
            </p>
            <p style={{ fontSize: '16px', color: '#fff', fontWeight: 900, lineHeight: 1 }}>
              {financingLabel[1]}
            </p>
          </div>

          {/* Property info */}
          <div style={{ flex: 1, padding: '0 6px' }}>
            <p
              style={{
                fontSize: '18px',
                color: '#fff',
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: '4px',
              }}
            >
              {title}
            </p>
            {locationLine && (
              <p
                style={{
                  fontSize: '15px',
                  color: 'rgba(255,255,255,0.6)',
                  fontWeight: 400,
                  lineHeight: 1.3,
                }}
              >
                {locationLine}
              </p>
            )}
          </div>
        </div>

        {/* Price row */}
        {price && (
          <div
            style={{
              borderTop: '1px solid rgba(180,145,40,0.2)',
              padding: '16px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.45)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              A partir de
            </span>
            <span
              style={{
                fontSize: '46px',
                color: '#f0d060',
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              {price}
            </span>
          </div>
        )}

        {/* CTA */}
        <div
          className="flex items-center justify-center gap-3"
          style={{
            background: 'linear-gradient(90deg, #1e4020, #2a5828)',
            borderTop: '1px solid rgba(180,145,40,0.25)',
            padding: '22px 32px',
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#4ade80">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span style={{ fontSize: '26px', color: '#fff', fontWeight: 800, letterSpacing: '0.04em' }}>
            Falar com o Corretor
          </span>
        </div>
      </div>
    </div>
  );
};
