import { PropertyData } from '@/types/property';
import { Bed, Maximize2, Car, CheckCircle2, Building2 } from 'lucide-react';
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
  const propertyType = data.type || 'Imóvel';

  // Gold border style reused
  const goldBorder = '2px solid rgba(212,175,55,0.7)';
  const goldShadow = '0 4px 24px rgba(180,140,20,0.35), inset 0 1px 0 rgba(255,220,80,0.18)';

  return (
    <div className="post-template-story relative overflow-hidden" style={{ background: '#1a2415', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── FULL-BLEED PHOTO ── */}
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
            background: 'linear-gradient(160deg, #2a3d1a 0%, #1a2a10 50%, #0e1a08 100%)',
          }}
        />
      )}

      {/* Gradient overlays: top dark + bottom heavy */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(15,22,8,0.82) 0%, rgba(15,22,8,0.2) 22%, rgba(15,22,8,0.15) 45%, rgba(15,22,8,0.75) 65%, rgba(12,18,6,0.97) 100%)',
        }}
      />

      {/* ── TOP: ACHADO DO DIA + VDH LOGO ── */}
      <div
        className="absolute z-20 flex flex-col items-center"
        style={{ top: '52px', left: '44px', right: '44px', gap: '18px' }}
      >
        {/* VDH brand row */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2"
            style={{
              background: 'rgba(10,16,6,0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(212,175,55,0.35)',
              borderRadius: '100px',
              padding: '10px 20px 10px 12px',
            }}
          >
            <img src={logoVDH} alt="VDH" style={{ height: '30px', width: '30px', borderRadius: '6px', objectFit: 'cover' }} />
            <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)', fontWeight: 600, letterSpacing: '0.02em' }}>
              Venda Direta Hoje
            </span>
          </div>
          {/* Imóvel Caixa badge */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1a2a12, #243318)',
              border: goldBorder,
              borderRadius: '14px',
              padding: '10px 20px',
              boxShadow: goldShadow,
            }}
          >
            <p style={{ fontSize: '11px', color: 'rgba(212,175,55,0.7)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1, marginBottom: '3px' }}>
              Imóvel
            </p>
            <p style={{ fontSize: '22px', color: '#d4b84a', fontWeight: 900, lineHeight: 1 }}>CAIXA</p>
          </div>
        </div>

        {/* 🔥 ACHADO DO DIA pill */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1b2a10, #243318)',
            border: goldBorder,
            borderRadius: '100px',
            padding: '16px 36px',
            boxShadow: goldShadow,
            alignSelf: 'center',
          }}
        >
          <span style={{ fontSize: '34px', color: '#f0d060', fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            🔥 ACHADO DO DIA!
          </span>
        </div>

        {/* Discount row */}
        {hasDiscount && (
          <div
            style={{
              background: 'linear-gradient(135deg, #1b2a10, #243318)',
              border: goldBorder,
              borderRadius: '18px',
              padding: '16px 40px',
              boxShadow: goldShadow,
              alignSelf: 'center',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '72px', color: '#f5d060', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.01em' }}>
              {discountNum}% OFF
            </p>
            {locationLine && (
              <p style={{ fontSize: '22px', color: 'rgba(255,255,255,0.7)', fontWeight: 500, marginTop: '4px' }}>
                {locationLine}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── BOTTOM CARD ── */}
      <div
        className="absolute z-20"
        style={{ bottom: '44px', left: '44px', right: '44px' }}
      >
        <div
          style={{
            background: 'linear-gradient(160deg, rgba(18,28,10,0.96), rgba(12,20,6,0.98))',
            border: goldBorder,
            borderRadius: '28px',
            overflow: 'hidden',
            boxShadow: goldShadow,
          }}
        >
          {/* Inner content */}
          <div style={{ padding: '30px 36px 24px' }}>

            {/* Property type + specs row */}
            <div className="flex items-center gap-3" style={{ marginBottom: '18px' }}>
              <Building2 style={{ width: '34px', height: '34px', color: '#d4b84a', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '22px', color: '#d4b84a', fontWeight: 700, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {propertyType}
                </p>
                {specs.length > 0 && (
                  <div className="flex items-center gap-3" style={{ marginTop: '6px' }}>
                    {specs.map((s, i) => {
                      const Icon = s.icon;
                      return (
                        <span key={i} className="flex items-center gap-1">
                          {i > 0 && <span style={{ color: 'rgba(212,175,55,0.3)', fontSize: '18px' }}>·</span>}
                          <Icon style={{ width: '18px', height: '18px', color: 'rgba(212,175,55,0.7)' }} />
                          <span style={{ fontSize: '20px', color: '#fff', fontWeight: 600 }}>{s.value} {s.label}</span>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* FGTS / Financing badges */}
            {(acceptsFGTS || acceptsFinancing) && (
              <div className="flex flex-col gap-2" style={{ marginBottom: '18px' }}>
                {acceptsFGTS && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 style={{ width: '24px', height: '24px', color: '#7ed348', flexShrink: 0 }} />
                    <span style={{ fontSize: '22px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                      <strong style={{ color: '#a8e070' }}>Aceita</strong> FGTS
                    </span>
                  </div>
                )}
                {acceptsFinancing && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 style={{ width: '24px', height: '24px', color: '#7ed348', flexShrink: 0 }} />
                    <span style={{ fontSize: '22px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                      <strong style={{ color: '#a8e070' }}>Aceita</strong> financiamento
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Price pill */}
            {price && (
              <div
                style={{
                  background: 'linear-gradient(135deg, #c8a832, #e8c840)',
                  borderRadius: '100px',
                  padding: '18px 36px',
                  display: 'inline-block',
                  marginBottom: '20px',
                  boxShadow: '0 4px 20px rgba(200,168,50,0.4)',
                }}
              >
                <span style={{ fontSize: '46px', color: '#1a2410', fontWeight: 900, lineHeight: 1 }}>
                  {price}
                </span>
              </div>
            )}
          </div>

          {/* CTA full-width */}
          <div
            className="flex items-center justify-center gap-3"
            style={{
              background: 'linear-gradient(135deg, #1e3a12, #2a4d18)',
              borderTop: goldBorder,
              padding: '26px 36px',
            }}
          >
            {/* WhatsApp icon */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#4ade80">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span style={{ fontSize: '28px', color: '#fff', fontWeight: 800, letterSpacing: '0.05em' }}>
              Falar com o Corretor
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
