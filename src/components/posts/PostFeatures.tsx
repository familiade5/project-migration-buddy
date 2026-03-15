import { PropertyData } from '@/types/property';
import { Bed, Car, Bath, Maximize2, MapPin, Zap, CheckCircle } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface PostFeaturesProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostFeatures = ({ data, photo, photos = [] }: PostFeaturesProps) => {
  const getPhoto = (index: number) => {
    if (photos.length > 0) return photos[index % photos.length] || photo;
    return photo;
  };

  const bedroomsNum = Number(data.bedrooms || 0);
  const garageNum = Number(data.garageSpaces || 0);
  const bathroomsNum = Number(data.bathrooms || 0);
  const areaValue = (data.area || data.areaPrivativa || data.areaTotal || '').trim();

  // Custom slide 2 texts override
  const getFeatureItems = () => {
    const customs = data.customSlide2Texts?.filter(t => t && t.trim() !== '') || [];
    const auto = [
      bedroomsNum > 0 ? { icon: Bed, label: 'Quartos', value: `${bedroomsNum}`, unit: '' } : null,
      garageNum > 0 ? { icon: Car, label: 'Vagas', value: `${garageNum}`, unit: '' } : null,
      bathroomsNum > 0 ? { icon: Bath, label: 'Banheiros', value: `${bathroomsNum}`, unit: '' } : null,
      areaValue && areaValue !== '0' ? { icon: Maximize2, label: 'Área', value: areaValue, unit: 'm²' } : null,
    ].filter(Boolean) as { icon: React.ElementType; label: string; value: string; unit: string }[];

    if (customs.length > 0) {
      return customs.slice(0, 4).map((text, i) => {
        const icons = [Bed, Car, Bath, Maximize2];
        const parts = text.split(':');
        return { icon: icons[i % icons.length], label: parts[0]?.trim() || text, value: parts[1]?.trim() || '', unit: '' };
      });
    }
    return auto.slice(0, 4);
  };

  const featureItems = getFeatureItems();

  const hasFinancing = data.acceptsFinancing;
  const hasFGTS = data.acceptsFGTS;

  const locationStr = [data.neighborhood, data.city]
    .filter(Boolean).join(' · ');

  const photo0 = getPhoto(0);
  const photo1 = getPhoto(1);
  const photo2 = getPhoto(2);

  return (
    <div className="post-template relative overflow-hidden" style={{ background: '#0b0d10' }}>

      {/* ── FULL-BLEED PHOTO MOSAIC ── */}
      {/* Left: large hero photo */}
      <div
        className="absolute"
        style={{ top: 0, left: 0, width: '62%', bottom: 0 }}
      >
        {photo0 ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${photo0})` }}
          />
        ) : (
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a2235, #0b0d10)' }} />
        )}
        {/* Left edge fade to black */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 60%, #0b0d10 100%)' }} />
        {/* Bottom fade */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0b0d10 0%, transparent 50%)' }} />
        {/* Top fade */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #0b0d10 0%, transparent 25%)' }} />
      </div>

      {/* Right column: 2 stacked photos */}
      <div
        className="absolute flex flex-col"
        style={{ top: 0, right: 0, width: '38%', bottom: 0, gap: '6px' }}
      >
        <div className="relative overflow-hidden" style={{ flex: 1 }}>
          {photo1 ? (
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${photo1})` }} />
          ) : (
            <div className="absolute inset-0" style={{ background: '#141820' }} />
          )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, transparent 50%, #0b0d10 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #0b0d10 0%, transparent 30%)' }} />
        </div>
        <div className="relative overflow-hidden" style={{ flex: 1 }}>
          {photo2 ? (
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${photo2})` }} />
          ) : (
            <div className="absolute inset-0" style={{ background: '#141820' }} />
          )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, transparent 50%, #0b0d10 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0b0d10 0%, transparent 30%)' }} />
        </div>
      </div>

      {/* ── THIN GOLD ACCENT LINE ── */}
      <div
        className="absolute z-20"
        style={{
          left: '56px',
          top: 0,
          bottom: 0,
          width: '3px',
          background: 'linear-gradient(to bottom, transparent, #D4AF37 30%, #D4AF37 70%, transparent)',
          opacity: 0.7,
        }}
      />

      {/* ── CONTENT LAYER ── */}
      <div className="absolute inset-0 z-30 flex flex-col justify-between" style={{ padding: '64px 60px 60px 80px' }}>

        {/* TOP: Logo + badge */}
        <div className="flex items-start justify-between">
          <div>
            {/* Thin label */}
            <div
              className="flex items-center gap-2"
              style={{ marginBottom: '12px' }}
            >
              <div style={{ width: '28px', height: '2px', background: '#D4AF37' }} />
              <span
                className="uppercase tracking-[0.25em] font-semibold"
                style={{ fontSize: '18px', color: '#D4AF37', letterSpacing: '0.25em' }}
              >
                Detalhes do Imóvel
              </span>
            </div>

            {/* Main headline */}
            <h2
              className="font-black uppercase"
              style={{
                fontSize: '68px',
                lineHeight: '0.9',
                color: '#ffffff',
                textShadow: '0 4px 30px rgba(0,0,0,0.8)',
                letterSpacing: '-0.02em',
              }}
            >
              {data.type || 'Imóvel'}<br />
              <span style={{ color: '#D4AF37' }}>por dentro</span>
            </h2>
          </div>

          {/* Logo */}
          <img
            src={logoVDH}
            alt="VDH"
            className="rounded-xl flex-shrink-0"
            style={{ height: '90px', opacity: 0.95 }}
          />
        </div>

        {/* MIDDLE: Feature stats grid */}
        <div
          className="grid grid-cols-2"
          style={{ gap: '16px', maxWidth: '600px' }}
        >
          {featureItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4"
              style={{
                padding: '24px 28px',
              background: 'rgba(20,24,32,0.85)',
                border: '1px solid rgba(212,175,55,0.25)',
                borderRadius: '16px',
              }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #D4AF37, #f5d485)',
                }}
              >
                <item.icon style={{ width: '26px', height: '26px', color: '#0b0d10' }} />
              </div>
              <div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                  {item.label}
                </p>
                <p className="font-black" style={{ fontSize: '40px', color: '#ffffff', lineHeight: 1 }}>
                  {item.value}<span style={{ fontSize: '22px', color: '#D4AF37' }}>{item.unit}</span>
                </p>
              </div>
            </div>
          ))}

          {/* If fewer than 4 items, fill with area or a payment badge */}
          {featureItems.length < 3 && (hasFinancing || hasFGTS) && (
            <div
              className="flex items-center gap-4 col-span-1"
              style={{
                padding: '24px 28px',
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.35)',
                borderRadius: '16px',
              }}
            >
              <CheckCircle style={{ width: '36px', height: '36px', color: '#22c55e', flexShrink: 0 }} />
              <p className="font-bold" style={{ fontSize: '26px', color: '#ffffff' }}>
                {hasFGTS && hasFinancing ? 'FGTS + Financiamento' : hasFGTS ? 'Usa FGTS' : 'Financiamento'}
              </p>
            </div>
          )}
        </div>

        {/* BOTTOM: Location + payment tags */}
        <div className="flex items-end justify-between">
          {/* Location */}
          <div>
            {locationStr && (
              <div className="flex items-center gap-3" style={{ marginBottom: '12px' }}>
                <MapPin style={{ width: '22px', height: '22px', color: '#D4AF37', flexShrink: 0 }} />
                <span
                  className="font-semibold"
                  style={{ fontSize: '28px', color: 'rgba(255,255,255,0.85)' }}
                >
                  {locationStr}
                </span>
              </div>
            )}

            {/* Payment badges */}
            <div className="flex flex-wrap gap-3">
              {hasFinancing && (
                <div
                  className="flex items-center gap-2"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '100px',
                    background: 'rgba(34,197,94,0.15)',
                    border: '1.5px solid #22c55e',
                  }}
                >
                  <Zap style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                  <span className="font-bold" style={{ fontSize: '20px', color: '#22c55e' }}>Aceita Financiamento</span>
                </div>
              )}
              {hasFGTS && (
                <div
                  className="flex items-center gap-2"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '100px',
                    background: 'rgba(59,130,246,0.15)',
                    border: '1.5px solid #3b82f6',
                  }}
                >
                  <CheckCircle style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
                  <span className="font-bold" style={{ fontSize: '20px', color: '#3b82f6' }}>Usa FGTS</span>
                </div>
              )}
              {!hasFinancing && !hasFGTS && (
                <div
                  style={{
                    padding: '10px 20px',
                    borderRadius: '100px',
                    background: 'rgba(212,175,55,0.12)',
                    border: '1.5px solid rgba(212,175,55,0.5)',
                  }}
                >
                  <span className="font-bold" style={{ fontSize: '20px', color: '#D4AF37' }}>Somente à Vista</span>
                </div>
              )}
            </div>
          </div>

          {/* Photo count indicator */}
          <div
            className="flex gap-2 items-center"
            style={{
              padding: '10px 18px',
              borderRadius: '100px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            {[0,1,2].map(i => (
              <div
                key={i}
                style={{
                  width: i === 0 ? '28px' : '8px',
                  height: '8px',
                  borderRadius: '100px',
                  background: i === 0 ? '#D4AF37' : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
