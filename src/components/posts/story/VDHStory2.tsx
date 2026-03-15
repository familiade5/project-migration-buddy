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

  // ── Parsing de valores ───────────────────────────────────────────────────
  const parseNum = (val: string): number => {
    if (!val) return 0;
    const cleaned = val.replace(/\D/g, '');
    return cleaned ? parseInt(cleaned, 10) / 100 : 0;
  };

  const formatBRL = (num: number): string =>
    num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

  const evalNum   = parseNum(data.evaluationValue || '');
  const minNum    = parseNum(data.minimumValue || '');
  const discount  = data.discount ? `${data.discount}%` : (evalNum > 0 && minNum > 0)
    ? `${Math.round((1 - minNum / evalNum) * 100)}%`
    : null;
  const savings   = evalNum > 0 && minNum > 0 ? evalNum - minNum : 0;

  const evalLabel  = evalNum  > 0 ? formatBRL(evalNum)  : data.evaluationValue  || null;
  const minLabel   = minNum   > 0 ? formatBRL(minNum)   : data.minimumValue     || null;
  const savingsLabel = savings > 0 ? formatBRL(savings) : null;

  // ── Specs do imóvel ──────────────────────────────────────────────────────
  const bedroomsNum  = Number(data.bedrooms || 0);
  const garageNum    = Number(data.garageSpaces || 0);
  const bathroomsNum = Number(data.bathrooms || 0);
  const areaValue    = (data.area || data.areaPrivativa || data.areaTotal || '').trim();

  const specs = [
    bedroomsNum  > 0 ? { label: 'Quartos',  value: `${bedroomsNum}` }   : null,
    bathroomsNum > 0 ? { label: 'Banh.',    value: `${bathroomsNum}` }  : null,
    garageNum    > 0 ? { label: 'Vagas',    value: `${garageNum}` }     : null,
    areaValue && areaValue !== '0' ? { label: 'Área', value: `${areaValue}m²` } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const locationStr = [data.neighborhood, data.city].filter(Boolean).join(' · ');
  const isCaixa = (data.propertySource || '').toLowerCase().includes('caixa');

  return (
    <div className="post-template-story relative overflow-hidden" style={{ background: '#06090f' }}>

      {/* ── MOSAICO DE 3 FOTOS ────────────────────────────────────────────── */}
      {/* Hero à esquerda — ocupa 58% da largura e altura total */}
      <div className="absolute top-0 left-0 bottom-0" style={{ width: '58%' }}>
        {p0 ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p0})` }} />
        ) : (
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a2235, #06090f)' }} />
        )}
        {/* Escurece só nas bordas onde há texto, sem mancha no centro */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(6,9,15,0.75) 0%, transparent 28%, transparent 65%, rgba(6,9,15,0.85) 100%)' }} />
      </div>

      {/* Coluna direita — 2 fotos empilhadas */}
      <div
        className="absolute top-0 right-0 bottom-0 flex flex-col"
        style={{ width: '42%', gap: '3px', paddingLeft: '3px' }}
      >
        <div className="relative overflow-hidden" style={{ flex: 1 }}>
          {p1 ? (
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p1})` }} />
          ) : (
            <div className="absolute inset-0" style={{ background: '#0e131c' }} />
          )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(6,9,15,0.7) 0%, transparent 35%)' }} />
        </div>
        <div className="relative overflow-hidden" style={{ flex: 1 }}>
          {p2 ? (
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p2})` }} />
          ) : (
            <div className="absolute inset-0" style={{ background: '#0e131c' }} />
          )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,9,15,0.7) 0%, transparent 35%)' }} />
        </div>
      </div>

      {/* ── CONTEÚDO SOBREPOSTO ───────────────────────────────────────────── */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between" style={{ padding: '64px 52px 68px 60px' }}>

        {/* TOPO: Logos */}
        <div className="flex items-center justify-between">
          <img src={logoVDH} alt="VDH" className="rounded-xl" style={{ height: '76px', opacity: 0.95 }} />
          {isCaixa && (
            <img src={logoCaixa} alt="Caixa" className="rounded-lg" style={{ height: '58px', opacity: 0.92 }} />
          )}
        </div>

        {/* CENTRO: Bloco de preços — o coração do slide */}
        <div>
          {/* Localização */}
          {locationStr && (
            <div className="flex items-center gap-3" style={{ marginBottom: '24px' }}>
              <div style={{ width: '32px', height: '2px', background: '#D4AF37', flexShrink: 0 }} />
              <span style={{ fontSize: '26px', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {locationStr}
              </span>
            </div>
          )}

          {/* Tipo do imóvel */}
          <p style={{ fontSize: '36px', color: 'rgba(255,255,255,0.65)', fontWeight: 600, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {data.type || 'Imóvel'} · Oportunidade
          </p>

          {/* Valor de avaliação riscado */}
          {evalLabel && (
            <div className="flex items-center gap-4" style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '30px', color: 'rgba(255,255,255,0.35)', fontWeight: 500, textDecoration: 'line-through' }}>
                Avaliado em {evalLabel}
              </span>
              {discount && (
                <div
                  style={{
                    padding: '6px 18px',
                    borderRadius: '100px',
                    background: '#ef4444',
                    fontWeight: 800,
                    fontSize: '26px',
                    color: '#fff',
                  }}
                >
                  -{discount}
                </div>
              )}
            </div>
          )}

          {/* Preço de venda em destaque */}
          {minLabel && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '24px', color: 'rgba(255,255,255,0.45)', marginBottom: '4px', fontWeight: 500 }}>
                Preço de venda
              </p>
              <p className="font-black" style={{ fontSize: '88px', color: '#ffffff', lineHeight: 0.9, letterSpacing: '-0.02em', textShadow: '0 4px 32px rgba(0,0,0,0.8)' }}>
                {minLabel}
              </p>
            </div>
          )}

          {/* Economia em destaque */}
          {savingsLabel && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                padding: '18px 32px',
                borderRadius: '18px',
                background: 'rgba(34,197,94,0.12)',
                border: '2px solid #22c55e',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: '32px' }}>💰</span>
              <div>
                <p style={{ fontSize: '20px', color: '#86efac', fontWeight: 600 }}>Você economiza</p>
                <p className="font-black" style={{ fontSize: '46px', color: '#22c55e', lineHeight: 1 }}>{savingsLabel}</p>
              </div>
            </div>
          )}
        </div>

        {/* RODAPÉ: Specs do imóvel */}
        {specs.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {specs.map((spec, i) => (
              <div
                key={i}
                style={{
                  padding: '16px 28px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1.5px solid rgba(212,175,55,0.35)',
                  textAlign: 'center',
                  minWidth: '130px',
                }}
              >
                <p className="font-black" style={{ fontSize: '44px', color: '#ffffff', lineHeight: 1 }}>{spec.value}</p>
                <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: '4px' }}>{spec.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
