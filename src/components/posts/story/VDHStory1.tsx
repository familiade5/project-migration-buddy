import { PropertyData } from '@/types/property';
import { MapPin, Bed, Maximize2, Car, ChevronRight } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface VDHStory1Props {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const VDHStory1 = ({ data, photo }: VDHStory1Props) => {
  const discountNum = data.discount ? parseFloat(data.discount.replace(',', '.')) : 0;
  const hasDiscount = discountNum > 0;

  const getArea = () => {
    const area = data.area || data.areaTotal || data.areaPrivativa;
    return area ? `${area}m²` : null;
  };

  const title = data.propertyName?.trim() || data.type || 'Imóvel';
  const acceptsFGTS = data.acceptsFGTS || data.canUseFGTS;
  const acceptsFinancing = data.acceptsFinancing || data.paymentMethod?.toLowerCase().includes('financ');

  const formatPrice = (val: string) => {
    if (!val) return null;
    if (val.includes('R$')) return val;
    return `R$ ${val}`;
  };
  const price = formatPrice(data.minimumValue) || formatPrice(data.evaluationValue);

  const specs = [
    data.bedrooms && data.bedrooms !== '0' ? { icon: Bed, value: data.bedrooms, label: 'quartos' } : null,
    getArea() ? { icon: Maximize2, value: getArea()!, label: 'área' } : null,
    data.garageSpaces && data.garageSpaces !== '0' ? { icon: Car, value: data.garageSpaces, label: 'vagas' } : null,
  ].filter(Boolean) as { icon: any; value: string; label: string }[];

  const locationLine = [data.neighborhood, data.city, data.state].filter(Boolean).join(' · ');

  return (
    <div className="post-template-story relative overflow-hidden" style={{ background: '#080c14' }}>

      {/* ══════════════════════════════════
          FULL-BLEED PHOTO
      ══════════════════════════════════ */}
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
            background: 'linear-gradient(160deg, #1a2a3a 0%, #0d1a28 45%, #060c14 100%)',
          }}
        >
          {/* Subtle texture when no photo */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                rgba(255,255,255,0.5) 0px,
                rgba(255,255,255,0.5) 1px,
                transparent 1px,
                transparent 60px
              )`,
            }}
          />
          <div
            className="absolute"
            style={{
              width: '700px', height: '700px',
              borderRadius: '50%',
              top: '100px', right: '-200px',
              background: 'radial-gradient(circle, rgba(232,119,34,0.18) 0%, transparent 70%)',
            }}
          />
        </div>
      )}

      {/* PHOTO gradient — dark on top + very heavy at bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: photo
            ? 'linear-gradient(to bottom, rgba(8,12,20,0.7) 0%, rgba(8,12,20,0.05) 30%, rgba(8,12,20,0.1) 50%, rgba(8,12,20,0.88) 72%, rgba(8,12,20,1) 100%)'
            : 'none',
        }}
      />

      {/* ══════════════════════════════════
          TOP: BRAND BAR
      ══════════════════════════════════ */}
      <div
        className="absolute z-20 flex items-center justify-between"
        style={{ top: '50px', left: '50px', right: '50px' }}
      >
        {/* VDH logo */}
        <div
          className="flex items-center gap-3"
          style={{
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: '100px',
            padding: '14px 26px 14px 18px',
          }}
        >
          <img
            src={logoVDH}
            alt="VDH"
            style={{ height: '36px', width: '36px', borderRadius: '8px', objectFit: 'cover' }}
          />
          <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.85)', fontWeight: 600, letterSpacing: '0.02em' }}>
            Venda Direta Hoje
          </span>
        </div>

        {/* Caixa badge */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f5a623, #d4660f)',
            borderRadius: '14px',
            padding: '12px 24px',
            boxShadow: '0 6px 28px rgba(232,100,15,0.5)',
          }}
        >
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', fontWeight: 600, lineHeight: 1, letterSpacing: '0.1em' }}>IMÓVEL</p>
          <p style={{ fontSize: '28px', color: '#fff', fontWeight: 900, lineHeight: 1 }}>CAIXA</p>
        </div>
      </div>

      {/* ══════════════════════════════════
          MIDDLE: DISCOUNT HERO
      ══════════════════════════════════ */}
      {hasDiscount && (
        <div
          className="absolute z-20 flex flex-col items-center justify-center"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -62%)',
          }}
        >
          {/* Glow ring */}
          <div
            style={{
              position: 'relative',
              width: '340px',
              height: '340px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(232,100,15,0.22), rgba(245,166,35,0.12))',
              border: '2px solid rgba(232,100,15,0.35)',
              boxShadow: '0 0 80px rgba(232,100,15,0.3), inset 0 0 60px rgba(232,100,15,0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <p style={{ fontSize: '22px', color: '#f5a623', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', lineHeight: 1, marginBottom: '4px' }}>
              desconto de
            </p>
            <p style={{
              fontSize: '140px',
              color: '#fff',
              fontWeight: 900,
              lineHeight: 0.85,
              textShadow: '0 0 60px rgba(232,100,15,0.6)',
            }}>
              {discountNum}%
            </p>
            <p style={{ fontSize: '26px', color: '#f5a623', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', lineHeight: 1, marginTop: '6px' }}>
              OFF
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════
          BOTTOM INFO CARD
      ══════════════════════════════════ */}
      <div
        className="absolute z-20"
        style={{
          bottom: '50px',
          left: '44px',
          right: '44px',
        }}
      >
        <div
          style={{
            background: 'rgba(8,12,20,0.82)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '28px',
            border: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Top content padding */}
          <div style={{ padding: '36px 40px 0' }}>

            {/* Type tag */}
            <div className="flex items-center gap-3" style={{ marginBottom: '10px' }}>
              <div style={{ width: '28px', height: '3px', background: '#e87722', borderRadius: '100px' }} />
              <span style={{ fontSize: '18px', color: '#e87722', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                {data.type || 'Imóvel'}
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: title.length > 22 ? '46px' : '58px',
              color: '#fff',
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: '14px',
            }}>
              {title}
            </h1>

            {/* Location */}
            {locationLine && (
              <div className="flex items-center gap-2" style={{ marginBottom: '24px' }}>
                <MapPin style={{ width: '22px', height: '22px', color: '#e87722', flexShrink: 0 }} />
                <span style={{ fontSize: '22px', color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>
                  {locationLine}
                </span>
              </div>
            )}

            {/* Specs */}
            {specs.length > 0 && (
              <div className="flex items-center gap-4" style={{ marginBottom: '28px' }}>
                {specs.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      {i > 0 && (
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', marginRight: '8px' }} />
                      )}
                      <Icon style={{ width: '26px', height: '26px', color: '#e87722' }} />
                      <span style={{ fontSize: '26px', color: '#fff', fontWeight: 700 }}>{s.value}</span>
                      <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '24px' }} />

            {/* Price + badges */}
            <div className="flex items-center justify-between" style={{ marginBottom: '28px' }}>
              <div>
                {price ? (
                  <>
                    <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.35)', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>
                      a partir de
                    </p>
                    <p style={{ fontSize: '50px', color: '#e87722', fontWeight: 900, lineHeight: 1 }}>
                      {price}
                    </p>
                  </>
                ) : (
                  <p style={{ fontSize: '28px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Consulte condições</p>
                )}
              </div>

              <div className="flex flex-col gap-2 items-end">
                {acceptsFGTS && (
                  <span style={{
                    fontSize: '19px', color: '#4ade80', fontWeight: 700,
                    background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
                    borderRadius: '100px', padding: '6px 16px',
                  }}>
                    ✓ Aceita FGTS
                  </span>
                )}
                {acceptsFinancing && (
                  <span style={{
                    fontSize: '19px', color: '#60a5fa', fontWeight: 700,
                    background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.3)',
                    borderRadius: '100px', padding: '6px 16px',
                  }}>
                    ✓ Financiável
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* CTA button full-width */}
          <div
            className="flex items-center justify-center gap-3"
            style={{
              background: 'linear-gradient(90deg, #e87722 0%, #f5a623 100%)',
              padding: '30px 40px',
            }}
          >
            <span style={{ fontSize: '26px', color: '#fff', fontWeight: 800, letterSpacing: '0.05em' }}>
              QUERO SABER MAIS
            </span>
            <ChevronRight style={{ width: '30px', height: '30px', color: '#fff' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
