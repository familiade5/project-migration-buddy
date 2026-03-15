import { PropertyData } from '@/types/property';
import logoVDH from '@/assets/logo-vdh.jpg';
import logoCaixa from '@/assets/logo-caixa.png';
import { useLogoBase64 } from '@/hooks/useLogoBase64';

interface VDHStory1Props {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const VDHStory1 = ({ data, photo }: VDHStory1Props) => {
  const logoBase64 = useLogoBase64(logoVDH);
  const logoCaixaBase64 = useLogoBase64(logoCaixa);

  const discountRaw = data.discount ?? '';
  const discountNum = discountRaw ? parseFloat(discountRaw.replace(',', '.')) : 0;
  const hasDiscount = discountNum > 0;
  const discountDisplay = discountRaw ? discountRaw.replace('.', ',') : String(discountNum);

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
  const entryFormatted = data.entryValue ? formatPrice(data.entryValue) : null;

  const propertyType = data.type || 'Imóvel';

  // Endereço: bairro · cidade · estado maiúsculo
  const stateUpper = (data.state || '').trim().toUpperCase();
  const displayAddress = [data.neighborhood, data.city, stateUpper].filter(Boolean).join(' · ');

  const GOLD        = '#D4AF37';
  const GOLD_BRIGHT = '#F5D060';
  const GOLD_GLOW   = 'rgba(212,175,55,0.45)';
  const GREEN_DEEP  = '#0d2210';

  return (
    <div
      className="post-template-story relative overflow-hidden"
      style={{ background: GREEN_DEEP, fontFamily: 'Arial, Helvetica, sans-serif' }}
    >
      {/* Background photo */}
      {photo ? (
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url(${photo})`, backgroundSize: 'cover', backgroundPosition: 'center 20%' }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(160deg, ${GREEN_DEEP} 0%, #040e06 100%)` }}
        />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(4,12,6,0.80) 0%, rgba(4,12,6,0.20) 18%, rgba(4,12,6,0.0) 36%, rgba(4,12,6,0.60) 58%, rgba(4,12,6,0.97) 100%)',
        }}
      />

      {/* Gold glow bottom */}
      <div
        className="absolute"
        style={{
          bottom: '-60px', left: '50%', transform: 'translateX(-50%)',
          width: '900px', height: '600px',
          background: `radial-gradient(ellipse, ${GOLD_GLOW} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* 1 · ACHADO DO DIA */}
      <div className="absolute z-20 flex justify-center" style={{ top: '64px', left: 0, right: 0 }}>
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
          <span style={{ fontSize: '72px', fontWeight: 900, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1, textShadow: `0 2px 16px rgba(0,0,0,0.5)` }}>
            ACHADO DO DIA!
          </span>
        </div>
      </div>

      {/* 2 · DESCONTO */}
      {hasDiscount && (
        <div className="absolute z-20" style={{ top: '226px', left: '64px' }}>
          <div
            style={{
              background: 'rgba(6,14,8,0.95)',
              border: `2.5px solid ${GOLD}`,
              borderRadius: '22px',
              padding: '30px 50px 26px',
              boxShadow: `0 0 0 5px rgba(212,175,55,0.08), 0 16px 60px rgba(0,0,0,0.55), 0 0 30px ${GOLD_GLOW}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, transparent, ${GOLD_BRIGHT}, transparent)`, opacity: 0.7 }} />
            <p style={{ fontSize: '92px', fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em', textShadow: `0 4px 20px rgba(0,0,0,0.4)` }}>
              {discountDisplay}% OFF
            </p>
            {displayAddress && (
              <p style={{ fontSize: '28px', color: '#fff', fontWeight: 500, marginTop: '8px', letterSpacing: '0.03em' }}>
                {displayAddress}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 3 · CARD CENTRAL — premium glass gold */}
      <div className="absolute z-20" style={{ bottom: '210px', left: '52px', right: '52px' }}>
        <div style={{ position: 'relative' }}>
          {/* Animated gradient border */}
          <div style={{
            position: 'absolute', inset: '-2px',
            borderRadius: '30px',
            background: `linear-gradient(135deg, ${GOLD_BRIGHT} 0%, rgba(212,175,55,0.2) 40%, rgba(212,175,55,0.2) 60%, ${GOLD_BRIGHT} 100%)`,
          }} />

          <div style={{
            position: 'relative',
            background: 'rgba(4, 7, 5, 0.92)',
            backdropFilter: 'blur(24px)',
            borderRadius: '28px',
            overflow: 'hidden',
          }}>

            {/* Top shimmer */}
            <div style={{
              height: '3px',
              background: `linear-gradient(90deg, transparent 0%, ${GOLD} 25%, ${GOLD_BRIGHT} 50%, ${GOLD} 75%, transparent 100%)`,
            }} />

            {/* Header: logos + financing badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 28px 16px',
              borderBottom: `1px solid rgba(212,175,55,0.12)`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img src={logoBase64} alt="VDH"
                  style={{ height: '34px', objectFit: 'contain' }} />
                <div style={{ width: '1px', height: '28px', background: 'rgba(212,175,55,0.25)' }} />
                <img src={logoCaixaBase64} alt="Caixa"
                  style={{ height: '22px', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.65 }} />
              </div>
              {/* Financing pill */}
              <div style={{
                background: isCashOnly
                  ? 'linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)'
                  : 'linear-gradient(135deg, #14532d 0%, #15803d 100%)',
                borderRadius: '50px',
                padding: '10px 24px',
                boxShadow: isCashOnly
                  ? '0 0 20px rgba(234,88,12,0.35)'
                  : '0 0 20px rgba(21,128,61,0.35)',
              }}>
                <span style={{
                  fontSize: '21px', fontWeight: 800, color: '#fff',
                  letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}>
                  {isCashOnly ? 'SOMENTE À VISTA' : 'ACEITA FINANCIAMENTO'}
                </span>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '26px 28px 22px' }}>

              {/* Property type + address */}
              <p style={{
                fontSize: '54px', fontWeight: 900, color: GOLD_BRIGHT,
                lineHeight: 1, letterSpacing: '-0.01em',
                textShadow: `0 0 30px rgba(245,208,96,0.3)`,
              }}>
                {propertyType}
              </p>

              {displayAddress && (
                <p style={{
                  fontSize: '26px', color: 'rgba(255,255,255,0.55)',
                  fontWeight: 400, letterSpacing: '0.06em',
                  marginTop: '6px', textTransform: 'uppercase',
                }}>
                  {displayAddress}
                </p>
              )}

              {/* Gold rule */}
              <div style={{
                height: '1px', marginTop: '20px', marginBottom: '20px',
                background: `linear-gradient(90deg, ${GOLD} 0%, rgba(212,175,55,0.15) 70%, transparent 100%)`,
              }} />

              {/* Price */}
              {price && (
                <div style={{ marginBottom: '18px' }}>
                  <p style={{
                    fontSize: '18px', color: 'rgba(212,175,55,0.6)',
                    fontWeight: 700, letterSpacing: '0.14em',
                    textTransform: 'uppercase', marginBottom: '2px',
                  }}>
                    VALOR DE VENDA
                  </p>
                  <p style={{
                    fontSize: '68px', fontWeight: 900, color: '#ffffff',
                    lineHeight: 1, letterSpacing: '-0.02em',
                    textShadow: '0 4px 32px rgba(255,255,255,0.12)',
                  }}>
                    {price}
                  </p>
                </div>
              )}

              {/* Tags */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {acceptsFGTS && (
                  <div style={{
                    background: 'rgba(212,175,55,0.10)',
                    border: `1px solid rgba(212,175,55,0.30)`,
                    borderRadius: '50px', padding: '7px 20px',
                  }}>
                    <span style={{ fontSize: '22px', color: GOLD_BRIGHT, fontWeight: 700 }}>✓ FGTS</span>
                  </div>
                )}
                {acceptsFinancing && (
                  <div style={{
                    background: 'rgba(212,175,55,0.10)',
                    border: `1px solid rgba(212,175,55,0.30)`,
                    borderRadius: '50px', padding: '7px 20px',
                  }}>
                    <span style={{ fontSize: '22px', color: GOLD_BRIGHT, fontWeight: 700 }}>✓ Financiamento</span>
                  </div>
                )}
                {acceptsFinancing && entryFormatted && (
                  <div style={{
                    background: 'rgba(212,175,55,0.10)',
                    border: `1px solid rgba(212,175,55,0.30)`,
                    borderRadius: '50px', padding: '7px 20px',
                  }}>
                    <span style={{ fontSize: '22px', color: GOLD_BRIGHT, fontWeight: 700 }}>Entrada {entryFormatted}</span>
                  </div>
                )}
              </div>

              {/* CRECI */}
              <p style={{
                fontSize: '18px', color: 'rgba(255,255,255,0.28)',
                marginTop: '16px', letterSpacing: '0.10em', textTransform: 'uppercase',
              }}>
                VENDA DIRETA · {data.creci}
              </p>
            </div>

            {/* Bottom shimmer */}
            <div style={{
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
              opacity: 0.35,
            }} />
          </div>
        </div>
      </div>

      {/* 4 · CTA — dourado premium, zero verde */}
      <div className="absolute z-20 flex justify-center" style={{ bottom: '52px', left: '52px', right: '52px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          {/* Gold glow border */}
          <div style={{
            position: 'absolute', inset: '-2px',
            borderRadius: '100px',
            background: `linear-gradient(135deg, ${GOLD_BRIGHT}, ${GOLD}, ${GOLD_BRIGHT})`,
            opacity: 0.55,
          }} />
          <div style={{
            position: 'relative',
            background: `linear-gradient(135deg, #17120a 0%, #2e2010 50%, #17120a 100%)`,
            borderRadius: '100px',
            padding: '28px 0',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            boxShadow: `0 8px 40px rgba(0,0,0,0.65), 0 0 50px rgba(212,175,55,0.18)`,
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
              background: `linear-gradient(90deg, transparent, ${GOLD_BRIGHT}, transparent)`,
            }} />
            {/* WhatsApp icon in gold */}
            <svg width="46" height="46" viewBox="0 0 24 24" fill={GOLD_BRIGHT}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span style={{
              fontSize: '48px', color: GOLD_BRIGHT, fontWeight: 800,
              letterSpacing: '0.04em',
              textShadow: `0 0 24px rgba(245,208,96,0.45)`,
            }}>
              Falar com o Corretor
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
