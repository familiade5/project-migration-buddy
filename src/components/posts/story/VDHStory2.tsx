import { PropertyData } from '@/types/property';
import logoVDH from '@/assets/logo-vdh.jpg';
import logoCaixa from '@/assets/logo-caixa.png';

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

  const parseNum = (val: string): number => {
    if (!val) return 0;
    const cleaned = val.replace(/\D/g, '');
    return cleaned ? parseInt(cleaned, 10) / 100 : 0;
  };

  const formatBRL = (num: number): string =>
    num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

  const evalNum  = parseNum(data.evaluationValue || '');
  const minNum   = parseNum(data.minimumValue || '');
  const discount = data.discount
    ? `${data.discount}%`
    : (evalNum > 0 && minNum > 0)
      ? `${Math.round((1 - minNum / evalNum) * 100)}%`
      : null;
  const savings  = evalNum > 0 && minNum > 0 ? evalNum - minNum : 0;

  const evalLabel    = evalNum  > 0 ? formatBRL(evalNum)  : data.evaluationValue  || null;
  const minLabel     = minNum   > 0 ? formatBRL(minNum)   : data.minimumValue     || null;
  const savingsLabel = savings  > 0 ? formatBRL(savings)  : null;

  const bedroomsNum  = Number(data.bedrooms || 0);
  const garageNum    = Number(data.garageSpaces || 0);
  const bathroomsNum = Number(data.bathrooms || 0);
  const areaValue    = (data.area || data.areaPrivativa || data.areaTotal || '').trim();

  const specs = [
    bedroomsNum  > 0 ? { icon: '🛏', label: bedroomsNum === 1 ? 'Quarto' : 'Quartos', value: `${bedroomsNum}` } : null,
    bathroomsNum > 0 ? { icon: '🚿', label: bathroomsNum === 1 ? 'Banheiro' : 'Banheiros', value: `${bathroomsNum}` } : null,
    garageNum    > 0 ? { icon: '🚗', label: garageNum === 1 ? 'Vaga' : 'Vagas', value: `${garageNum}` } : null,
    areaValue && areaValue !== '0' ? { icon: '📐', label: 'Área', value: `${areaValue}m²` } : null,
  ].filter(Boolean) as { icon: string; label: string; value: string }[];

  const locationStr = [data.neighborhood, data.city].filter(Boolean).join(' · ');
  const isCaixa = (data.propertySource || '').toLowerCase().includes('caixa');

  return (
    <div className="post-template-story relative overflow-hidden" style={{ background: '#06090f' }}>

      {/* ── TOPO: 3 FOTOS IGUAIS ─────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 flex" style={{ height: '44%', gap: '3px' }}>
        {[p0, p1, p2].map((p, i) => (
          <div key={i} className="relative overflow-hidden" style={{ flex: 1 }}>
            {p ? (
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p})` }} />
            ) : (
              <div className="absolute inset-0" style={{ background: i === 0 ? '#1a2235' : '#0e131c' }} />
            )}
            {/* fade bottom para transição suave */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(6,9,15,0.95) 100%)' }} />
          </div>
        ))}
      </div>

      {/* ── PAINEL DE INFORMAÇÕES ────────────────────────────────────────────── */}
      <div
        className="absolute left-0 right-0 bottom-0 flex flex-col"
        style={{
          top: 'calc(44% - 2px)',
          background: '#06090f',
          padding: '52px 52px 64px',
        }}
      >
        {/* Logos */}
        <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
          <img src={logoVDH} alt="VDH" className="rounded-xl" style={{ height: '64px', opacity: 0.95 }} />
          {isCaixa && (
            <img src={logoCaixa} alt="Caixa" className="rounded-lg" style={{ height: '50px', opacity: 0.92 }} />
          )}
        </div>

        {/* Localização + tipo */}
        <div style={{ marginBottom: '28px' }}>
          {locationStr && (
            <div className="flex items-center gap-3" style={{ marginBottom: '10px' }}>
              <div style={{ width: '28px', height: '2.5px', background: '#D4AF37', flexShrink: 0, borderRadius: '2px' }} />
              <span style={{ fontSize: '24px', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {locationStr}
              </span>
            </div>
          )}
          <p style={{ fontSize: '30px', color: 'rgba(255,255,255,0.55)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {data.type || 'Imóvel'} · Oportunidade
          </p>
        </div>

        {/* Bloco de preços */}
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1.5px solid rgba(212,175,55,0.2)',
            borderRadius: '20px',
            padding: '32px 36px',
            marginBottom: '28px',
          }}
        >
          {/* Avaliação riscada + desconto */}
          {evalLabel && (
            <div className="flex items-center gap-4" style={{ marginBottom: '14px' }}>
              <span style={{ fontSize: '26px', color: 'rgba(255,255,255,0.35)', fontWeight: 500, textDecoration: 'line-through' }}>
                Avaliado em {evalLabel}
              </span>
              {discount && (
                <div style={{ padding: '5px 16px', borderRadius: '100px', background: '#dc2626', fontWeight: 800, fontSize: '24px', color: '#fff' }}>
                  -{discount}
                </div>
              )}
            </div>
          )}

          {/* Preço de venda */}
          {minLabel && (
            <div style={{ marginBottom: savingsLabel ? '20px' : '0' }}>
              <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, marginBottom: '4px' }}>Preço de venda</p>
              <p className="font-black" style={{ fontSize: '76px', color: '#ffffff', lineHeight: 0.95, letterSpacing: '-0.02em', textShadow: '0 4px 24px rgba(0,0,0,0.6)' }}>
                {minLabel}
              </p>
            </div>
          )}

          {/* Economia */}
          {savingsLabel && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 24px',
                borderRadius: '14px',
                background: 'rgba(34,197,94,0.1)',
                border: '1.5px solid rgba(34,197,94,0.5)',
              }}
            >
              <span style={{ fontSize: '28px' }}>💰</span>
              <div>
                <p style={{ fontSize: '18px', color: '#86efac', fontWeight: 600 }}>Você economiza</p>
                <p className="font-black" style={{ fontSize: '40px', color: '#22c55e', lineHeight: 1 }}>{savingsLabel}</p>
              </div>
            </div>
          )}
        </div>

        {/* Specs */}
        {specs.length > 0 && (
          <div className="flex gap-3">
            {specs.map((spec, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: '14px 10px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(212,175,55,0.25)',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '28px' }}>{spec.icon}</span>
                <p className="font-black" style={{ fontSize: '34px', color: '#ffffff', lineHeight: 1, marginTop: '4px' }}>{spec.value}</p>
                <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.45)', fontWeight: 600, marginTop: '3px' }}>{spec.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
