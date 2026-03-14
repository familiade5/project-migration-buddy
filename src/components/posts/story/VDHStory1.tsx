import { PropertyData } from '@/types/property';
import { MapPin, Bed, Maximize2, Car, Zap } from 'lucide-react';
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

  const getCity = () => {
    const parts = [];
    if (data.city) parts.push(data.city);
    if (data.state) parts.push(data.state);
    return parts.join(' – ');
  };

  const title = data.propertyName?.trim() || data.type || 'Imóvel';
  const acceptsFinancing = data.acceptsFinancing || data.paymentMethod?.toLowerCase().includes('financ');
  const acceptsFGTS = data.acceptsFGTS || data.canUseFGTS;

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

  return (
    <div
      className="post-template-story relative overflow-hidden flex flex-col"
      style={{ background: '#f2ede6' }}
    >
      {/* ══ TOP HEADER BAND ══ */}
      <div
        className="relative flex items-center justify-between flex-shrink-0"
        style={{
          background: '#0a1628',
          padding: '42px 52px',
          zIndex: 10,
        }}
      >
        {/* VDH identity */}
        <div className="flex items-center gap-4">
          <img
            src={logoVDH}
            alt="VDH"
            style={{ height: '52px', width: '52px', borderRadius: '10px', objectFit: 'cover' }}
          />
          <div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Venda Direta
            </p>
            <p style={{ fontSize: '24px', color: '#fff', fontWeight: 700, lineHeight: 1 }}>
              Hoje
            </p>
          </div>
        </div>

        {/* Caixa pill */}
        <div
          style={{
            background: '#e87722',
            borderRadius: '100px',
            padding: '14px 32px',
          }}
        >
          <p style={{ fontSize: '24px', color: '#fff', fontWeight: 800, letterSpacing: '0.04em' }}>
            IMÓVEL CAIXA
          </p>
        </div>
      </div>

      {/* ══ PHOTO AREA ══ */}
      <div
        className="relative flex-shrink-0"
        style={{ height: '740px', overflow: 'hidden', background: '#c8bfb0' }}
      >
        {photo ? (
          <img
            src={photo}
            alt="Imóvel"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #2a3a50 0%, #1a2535 50%, #0a1628 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ textAlign: 'center', opacity: 0.35 }}>
              <p style={{ fontSize: '120px' }}>🏠</p>
              <p style={{ fontSize: '28px', color: '#fff', fontWeight: 500 }}>Foto do imóvel</p>
            </div>
          </div>
        )}

        {/* Discount badge — floating over photo */}
        {hasDiscount && (
          <div
            style={{
              position: 'absolute',
              top: '36px',
              right: '40px',
              background: '#e87722',
              borderRadius: '20px',
              padding: '20px 30px',
              boxShadow: '0 12px 48px rgba(232,119,34,0.55)',
              textAlign: 'center',
              transform: 'rotate(3deg)',
            }}
          >
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1 }}>
              desconto
            </p>
            <p style={{ fontSize: '80px', color: '#fff', fontWeight: 900, lineHeight: 0.9 }}>
              {discountNum}%
            </p>
          </div>
        )}

        {/* Bottom shadow fade into content */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '160px',
            background: 'linear-gradient(to bottom, transparent, #f2ede6)',
          }}
        />
      </div>

      {/* ══ CONTENT CARD ══ */}
      <div
        className="flex flex-col flex-1"
        style={{ padding: '12px 52px 0', background: '#f2ede6' }}
      >
        {/* Type label */}
        <div className="flex items-center gap-3" style={{ marginBottom: '12px' }}>
          <div style={{ width: '36px', height: '3px', background: '#e87722', borderRadius: '100px' }} />
          <p style={{ fontSize: '20px', color: '#e87722', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            {data.type || 'Imóvel'}
          </p>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: title.length > 20 ? '54px' : '68px',
            color: '#0a1628',
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: '16px',
          }}
        >
          {title}
        </h1>

        {/* Location */}
        {(data.neighborhood || getCity()) && (
          <div className="flex items-center gap-2" style={{ marginBottom: '28px' }}>
            <MapPin style={{ width: '26px', height: '26px', color: '#e87722', flexShrink: 0 }} />
            <p style={{ fontSize: '26px', color: '#4a5568', fontWeight: 500, lineHeight: 1.2 }}>
              {[data.neighborhood, getCity()].filter(Boolean).join(' · ')}
            </p>
          </div>
        )}

        {/* Specs */}
        {specs.length > 0 && (
          <div className="flex items-center gap-6" style={{ marginBottom: '28px' }}>
            {specs.map((spec, i) => {
              const Icon = spec.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2"
                  style={{
                    background: '#fff',
                    borderRadius: '14px',
                    padding: '16px 24px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                  }}
                >
                  <Icon style={{ width: '28px', height: '28px', color: '#e87722' }} />
                  <span style={{ fontSize: '26px', color: '#0a1628', fontWeight: 700 }}>{spec.value}</span>
                  <span style={{ fontSize: '20px', color: '#94a3b8', fontWeight: 400 }}>{spec.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Price + badges */}
        <div
          className="flex items-end justify-between"
          style={{
            background: '#0a1628',
            borderRadius: '22px',
            padding: '30px 36px',
            marginBottom: '28px',
          }}
        >
          <div>
            {price && (
              <>
                <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  a partir de
                </p>
                <p style={{ fontSize: '52px', color: '#e87722', fontWeight: 900, lineHeight: 1 }}>
                  {price}
                </p>
              </>
            )}
            {!price && (
              <p style={{ fontSize: '28px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                Consulte o valor
              </p>
            )}
          </div>

          {/* Flags */}
          <div className="flex flex-col items-end gap-2">
            {acceptsFGTS && (
              <div
                style={{
                  background: 'rgba(34,197,94,0.2)',
                  border: '1px solid rgba(34,197,94,0.5)',
                  borderRadius: '100px',
                  padding: '8px 18px',
                }}
              >
                <span style={{ fontSize: '20px', color: '#4ade80', fontWeight: 700 }}>✓ FGTS</span>
              </div>
            )}
            {acceptsFinancing && (
              <div
                style={{
                  background: 'rgba(96,165,250,0.2)',
                  border: '1px solid rgba(96,165,250,0.4)',
                  borderRadius: '100px',
                  padding: '8px 18px',
                }}
              >
                <span style={{ fontSize: '20px', color: '#93c5fd', fontWeight: 700 }}>✓ Financiável</span>
              </div>
            )}
          </div>
        </div>

        {/* CTA strip */}
        <div
          className="flex items-center justify-center gap-3"
          style={{
            background: '#e87722',
            borderRadius: '16px',
            padding: '26px',
          }}
        >
          <Zap style={{ width: '30px', height: '30px', color: '#fff' }} />
          <p style={{ fontSize: '28px', color: '#fff', fontWeight: 800, letterSpacing: '0.04em' }}>
            ENTRE EM CONTATO AGORA
          </p>
        </div>
      </div>
    </div>
  );
};
