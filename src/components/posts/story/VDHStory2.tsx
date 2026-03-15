import { PropertyData } from '@/types/property';
import logoVDH from '@/assets/logo-vdh.jpg';

interface VDHStory2Props {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const VDHStory2 = ({ data, photo, photos }: VDHStory2Props) => {
  const getPhoto = (index: number) => {
    if (photos && photos[index]) return photos[index];
    if (photo) return photo;
    return null;
  };

  const p0 = getPhoto(0);
  const p1 = getPhoto(1);
  const p2 = getPhoto(2);

  const bedroomsNum = Number(data.bedrooms || 0);
  const garageNum = Number(data.garageSpaces || 0);
  const bathroomsNum = Number(data.bathrooms || 0);
  const areaValue = (data.area || data.areaPrivativa || data.areaTotal || '').trim();

  const specs = [
    bedroomsNum > 0  ? { label: 'Quartos',   value: `${bedroomsNum}` }  : null,
    bathroomsNum > 0 ? { label: 'Banheiros', value: `${bathroomsNum}` } : null,
    garageNum > 0    ? { label: 'Vagas',     value: `${garageNum}` }    : null,
    areaValue && areaValue !== '0' ? { label: 'Área', value: `${areaValue}m²` } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const locationStr = [data.neighborhood, data.city]
    .filter(Boolean).join(' · ');

  const paymentBadge = data.acceptsFGTS && data.acceptsFinancing
    ? { text: 'FGTS + Financiamento', color: '#22c55e' }
    : data.acceptsFinancing
    ? { text: 'Aceita Financiamento', color: '#22c55e' }
    : data.acceptsFGTS
    ? { text: 'Usa FGTS', color: '#3b82f6' }
    : { text: 'Somente à Vista', color: '#D4AF37' };

  const formatPrice = (val: string) => {
    if (!val) return null;
    const cleaned = val.replace(/\D/g, '');
    if (!cleaned) return null;
    const num = parseInt(cleaned, 10) / 100;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  };

  const price = formatPrice(data.minimumValue || '');

  return (
    <div className="post-template-story relative overflow-hidden" style={{ background: '#080b10' }}>

      {/* ── MOSAICO DE 3 FOTOS ── */}
      {/* Hero: ocupa 62% da largura, altura total */}
      <div className="absolute top-0 left-0 bottom-0" style={{ width: '62%' }}>
        {p0 ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p0})` }} />
        ) : (
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a2235, #080b10)' }} />
        )}
        {/* Fade para o lado direito para integrar com o painel */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 55%, #080b10 100%)' }} />
        {/* Fade superior para conteúdo */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #080b10 0%, transparent 22%, transparent 70%, #080b10 100%)' }} />
      </div>

      {/* Coluna direita: 2 fotos empilhadas, 38% da largura */}
      <div className="absolute top-0 right-0 bottom-0 flex flex-col" style={{ width: '38%', gap: '4px' }}>
        <div className="relative overflow-hidden" style={{ flex: 1 }}>
          {p1 ? (
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p1})` }} />
          ) : (
            <div className="absolute inset-0" style={{ background: '#111520' }} />
          )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, transparent 40%, #080b10 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #080b10 0%, transparent 30%)' }} />
        </div>
        <div className="relative overflow-hidden" style={{ flex: 1 }}>
          {p2 ? (
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p2})` }} />
          ) : (
            <div className="absolute inset-0" style={{ background: '#111520' }} />
          )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, transparent 40%, #080b10 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #080b10 0%, transparent 30%)' }} />
        </div>
      </div>

      {/* Linha dourada vertical separando fotos do conteúdo — decoração sutil */}
      <div
        className="absolute z-20"
        style={{
          left: '58%',
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'linear-gradient(to bottom, transparent, #D4AF37 30%, #D4AF37 70%, transparent)',
          opacity: 0.5,
        }}
      />

      {/* ── CONTEÚDO SOBREPOSTO ── */}
      <div className="absolute inset-0 z-30 flex flex-col justify-between" style={{ padding: '80px 60px 80px 72px' }}>

        {/* TOPO: Logo + badge de pagamento */}
        <div className="flex items-start justify-between">
          <img src={logoVDH} alt="VDH" className="rounded-xl" style={{ height: '88px', opacity: 0.95 }} />

          <div
            className="flex items-center gap-2 rounded-full"
            style={{
              padding: '14px 28px',
              background: `${paymentBadge.color}22`,
              border: `2px solid ${paymentBadge.color}`,
            }}
          >
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: paymentBadge.color, flexShrink: 0 }} />
            <span className="font-bold" style={{ fontSize: '26px', color: paymentBadge.color }}>
              {paymentBadge.text}
            </span>
          </div>
        </div>

        {/* MEIO: Preço + localização */}
        <div>
          {locationStr && (
            <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '2px', background: '#D4AF37', flexShrink: 0 }} />
              <span
                className="font-semibold uppercase tracking-widest"
                style={{ fontSize: '26px', color: '#D4AF37', letterSpacing: '0.18em' }}
              >
                {locationStr}
              </span>
            </div>
          )}

          <h2
            className="font-black uppercase leading-none"
            style={{
              fontSize: '100px',
              color: '#ffffff',
              letterSpacing: '-0.03em',
              textShadow: '0 4px 40px rgba(0,0,0,0.9)',
              lineHeight: 0.88,
            }}
          >
            {data.type || 'Imóvel'}<br />
            <span style={{ color: '#D4AF37', fontSize: '78px' }}>
              {data.neighborhood || 'Exclusivo'}
            </span>
          </h2>

          {price && (
            <div style={{ marginTop: '32px' }}>
              <p style={{ fontSize: '24px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', fontWeight: 500 }}>
                A partir de
              </p>
              <p className="font-black" style={{ fontSize: '72px', color: '#ffffff', lineHeight: 1 }}>
                {price}
              </p>
            </div>
          )}
        </div>

        {/* RODAPÉ: Grid de specs */}
        {specs.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {specs.map((spec, i) => (
              <div
                key={i}
                style={{
                  padding: '22px 32px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1.5px solid rgba(212,175,55,0.3)',
                  borderRadius: '18px',
                  backdropFilter: 'none',
                  minWidth: '150px',
                  textAlign: 'center',
                }}
              >
                <p className="font-black" style={{ fontSize: '52px', color: '#ffffff', lineHeight: 1 }}>
                  {spec.value}
                </p>
                <p style={{ fontSize: '22px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: '6px' }}>
                  {spec.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
