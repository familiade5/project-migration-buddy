import { PropertyData } from '@/types/property';
import { MapPin, Bed, Maximize2, Car, CheckCircle2 } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';
import logoCaixa from '@/assets/logo-caixa.png';

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

  const getCity = () => {
    const parts = [];
    if (data.city) parts.push(data.city);
    if (data.state) parts.push(data.state);
    return parts.join(' - ');
  };

  const getNeighborhood = () => data.neighborhood || null;

  const title = data.propertyName?.trim() || data.type || 'Imóvel';

  // Format price nicely
  const formatPrice = (val: string) => {
    if (!val) return null;
    if (val.includes('R$')) return val;
    return `R$ ${val}`;
  };

  const price = formatPrice(data.minimumValue) || formatPrice(data.evaluationValue);

  const acceptsFinancing = data.acceptsFinancing || data.paymentMethod?.toLowerCase().includes('financ');
  const acceptsFGTS = data.acceptsFGTS || data.canUseFGTS;

  return (
    <div className="post-template-story relative overflow-hidden" style={{ background: '#0d0d0d' }}>

      {/* ── PHOTO LAYER ── */}
      {photo ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${photo})`, filter: 'brightness(0.55) saturate(1.1)' }}
          />
          {/* Cinematic gradient: dark top + very dark bottom */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 38%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.92) 100%)',
            }}
          />
        </>
      ) : (
        /* No photo: rich geometric background */
        <>
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(145deg, #0f1923 0%, #0d1520 40%, #070d14 100%)',
            }}
          />
          {/* Decorative circles */}
          <div
            className="absolute rounded-full"
            style={{
              width: '900px', height: '900px',
              top: '-200px', right: '-300px',
              background: 'radial-gradient(circle, rgba(232,119,34,0.12) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: '600px', height: '600px',
              bottom: '-100px', left: '-200px',
              background: 'radial-gradient(circle, rgba(232,119,34,0.07) 0%, transparent 70%)',
            }}
          />
          {/* Fine grid lines */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
        </>
      )}

      {/* ── TOP BAR: Logo VDH + Caixa badge ── */}
      <div
        className="absolute z-20 flex items-center justify-between"
        style={{ top: '52px', left: '52px', right: '52px' }}
      >
        {/* VDH Logo pill */}
        <div
          className="flex items-center gap-3"
          style={{
            background: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(12px)',
            borderRadius: '100px',
            padding: '14px 28px',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <img src={logoVDH} alt="VDH" style={{ height: '38px', width: '38px', borderRadius: '6px', objectFit: 'cover' }} />
          <span style={{ fontSize: '22px', color: 'rgba(255,255,255,0.9)', fontWeight: 600, letterSpacing: '0.03em' }}>
            Venda Direta Hoje
          </span>
        </div>

        {/* Caixa badge */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f5a623 0%, #e87722 100%)',
            borderRadius: '14px',
            padding: '12px 22px',
            boxShadow: '0 8px 32px rgba(232,119,34,0.5)',
          }}
        >
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', fontWeight: 600, lineHeight: 1, marginBottom: '2px' }}>IMÓVEL</p>
          <p style={{ fontSize: '30px', color: '#fff', fontWeight: 900, lineHeight: 1 }}>CAIXA</p>
        </div>
      </div>

      {/* ── DISCOUNT HERO (when discount exists) ── */}
      {hasDiscount && (
        <div
          className="absolute z-20 flex flex-col items-center justify-center"
          style={{
            top: '180px',
            right: '52px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff6b1a 0%, #e84500 100%)',
            boxShadow: '0 0 0 6px rgba(232,69,0,0.25), 0 20px 60px rgba(232,69,0,0.5)',
          }}
        >
          <p style={{ fontSize: '19px', color: 'rgba(255,255,255,0.8)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1 }}>
            até
          </p>
          <p style={{ fontSize: '72px', color: '#fff', fontWeight: 900, lineHeight: 0.9 }}>
            {discountNum}%
          </p>
          <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.9)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            OFF
          </p>
        </div>
      )}

      {/* ── MAIN CONTENT BOTTOM ── */}
      <div
        className="absolute z-10 flex flex-col"
        style={{ bottom: 0, left: 0, right: 0, padding: '0 52px 64px' }}
      >
        {/* Type chip */}
        <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
          <div
            style={{
              height: '4px',
              width: '48px',
              borderRadius: '100px',
              background: '#e87722',
            }}
          />
          <span
            style={{
              fontSize: '22px',
              color: '#e87722',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            {data.type || 'Imóvel'}
          </span>
        </div>

        {/* Property name / title */}
        <h1
          style={{
            fontSize: title.length > 22 ? '58px' : '72px',
            color: '#ffffff',
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: '20px',
            textShadow: '0 4px 24px rgba(0,0,0,0.6)',
          }}
        >
          {title}
        </h1>

        {/* Location */}
        {(getNeighborhood() || getCity()) && (
          <div className="flex items-center gap-3" style={{ marginBottom: '36px' }}>
            <MapPin style={{ width: '28px', height: '28px', color: '#e87722', flexShrink: 0 }} />
            <div>
              {getNeighborhood() && (
                <p style={{ fontSize: '30px', color: '#fff', fontWeight: 600, lineHeight: 1.1 }}>
                  {getNeighborhood()}
                </p>
              )}
              {getCity() && (
                <p style={{ fontSize: '24px', color: 'rgba(255,255,255,0.65)', fontWeight: 400, lineHeight: 1.2 }}>
                  {getCity()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Specs row */}
        {(data.bedrooms || getArea() || data.garageSpaces) && (
          <div
            className="flex items-center gap-0"
            style={{
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(16px)',
              borderRadius: '18px',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '24px 32px',
              marginBottom: '28px',
              gap: '0',
            }}
          >
            {data.bedrooms && data.bedrooms !== '0' && (
              <div className="flex flex-col items-center flex-1">
                <Bed style={{ width: '34px', height: '34px', color: '#e87722', marginBottom: '8px' }} />
                <p style={{ fontSize: '32px', color: '#fff', fontWeight: 700, lineHeight: 1 }}>{data.bedrooms}</p>
                <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>quartos</p>
              </div>
            )}
            {data.bedrooms && data.bedrooms !== '0' && getArea() && (
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.12)', alignSelf: 'stretch', margin: '0 8px' }} />
            )}
            {getArea() && (
              <div className="flex flex-col items-center flex-1">
                <Maximize2 style={{ width: '34px', height: '34px', color: '#e87722', marginBottom: '8px' }} />
                <p style={{ fontSize: '32px', color: '#fff', fontWeight: 700, lineHeight: 1 }}>{getArea()}</p>
                <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>área</p>
              </div>
            )}
            {getArea() && data.garageSpaces && data.garageSpaces !== '0' && (
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.12)', alignSelf: 'stretch', margin: '0 8px' }} />
            )}
            {data.garageSpaces && data.garageSpaces !== '0' && (
              <div className="flex flex-col items-center flex-1">
                <Car style={{ width: '34px', height: '34px', color: '#e87722', marginBottom: '8px' }} />
                <p style={{ fontSize: '32px', color: '#fff', fontWeight: 700, lineHeight: 1 }}>{data.garageSpaces}</p>
                <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>vagas</p>
              </div>
            )}
          </div>
        )}

        {/* Badges row: FGTS + Financiamento + Preço */}
        <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: '8px' }}>
          {acceptsFGTS && (
            <div
              className="flex items-center gap-2"
              style={{
                background: 'rgba(34,197,94,0.15)',
                border: '1.5px solid rgba(34,197,94,0.5)',
                borderRadius: '100px',
                padding: '12px 22px',
              }}
            >
              <CheckCircle2 style={{ width: '22px', height: '22px', color: '#22c55e' }} />
              <span style={{ fontSize: '22px', color: '#22c55e', fontWeight: 700 }}>Aceita FGTS</span>
            </div>
          )}
          {acceptsFinancing && (
            <div
              className="flex items-center gap-2"
              style={{
                background: 'rgba(59,130,246,0.15)',
                border: '1.5px solid rgba(59,130,246,0.5)',
                borderRadius: '100px',
                padding: '12px 22px',
              }}
            >
              <CheckCircle2 style={{ width: '22px', height: '22px', color: '#3b82f6' }} />
              <span style={{ fontSize: '22px', color: '#3b82f6', fontWeight: 700 }}>Financiável</span>
            </div>
          )}
          {price && (
            <div
              style={{
                marginLeft: 'auto',
                textAlign: 'right',
              }}
            >
              <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.45)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                a partir de
              </p>
              <p style={{ fontSize: '42px', color: '#e87722', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.01em' }}>
                {price}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
