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
  const discountPct = data.discount
    ? parseFloat(data.discount.replace(',', '.'))
    : (evalNum > 0 && minNum > 0)
      ? Math.round((1 - minNum / evalNum) * 100)
      : 0;
  const savings  = evalNum > 0 && minNum > 0 ? evalNum - minNum : 0;

  const evalLabel    = evalNum  > 0 ? formatBRL(evalNum)  : data.evaluationValue  || null;
  const minLabel     = minNum   > 0 ? formatBRL(minNum)   : data.minimumValue     || null;
  const savingsLabel = savings  > 0 ? formatBRL(savings)  : null;

  const bedroomsNum  = Number(data.bedrooms || 0);
  const garageNum    = Number(data.garageSpaces || 0);
  const bathroomsNum = Number(data.bathrooms || 0);
  const areaValue    = (data.area || data.areaPrivativa || data.areaTotal || '').trim();

  const neighborhood = data.neighborhood || '';
  const city = data.city || '';
  const stateShort = (data.state || '').trim().slice(0, 2).toUpperCase();
  const locationLine = [neighborhood, city, stateShort].filter(Boolean).join(' · ');

  const isCaixa = (data.propertySource || '').toLowerCase().includes('caixa');
  const acceptsFGTS = data.acceptsFGTS;
  const acceptsFinancing = data.acceptsFinancing;

  /* ── Cores tema ─────────────────────────────────────────────────────────── */
  const GOLD    = '#D4AF37';
  const GOLD_LT = '#F0D060';
  const BG      = '#07080c';
  const CARD_BG = 'rgba(255,255,255,0.04)';

  /* ── Tags de condições ───────────────────────────────────────────────────── */
  const tags: { label: string; color: string; bg: string }[] = [];
  if (acceptsFinancing)  tags.push({ label: 'Financiamento', color: '#bbf7d0', bg: 'rgba(22,163,74,0.18)' });
  else                   tags.push({ label: 'Somente à Vista', color: '#fca5a5', bg: 'rgba(220,38,38,0.18)' });
  if (acceptsFGTS)       tags.push({ label: 'FGTS', color: '#93c5fd', bg: 'rgba(37,99,235,0.18)' });

  return (
    <div
      className="post-template-story relative overflow-hidden"
      style={{ background: BG, fontFamily: 'system-ui, sans-serif' }}
    >

      {/* ── FUNDO COM FOTO DESFOCADA ─────────────────────────────────────────── */}
      {p0 && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${p0})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(22px) brightness(0.18) saturate(0.4)',
            transform: 'scale(1.1)',
          }}
        />
      )}

      {/* ── OVERLAY GRADIENTE ───────────────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(170deg, rgba(7,8,12,0.55) 0%, rgba(7,8,12,0.82) 45%, rgba(7,8,12,0.98) 100%)`,
        }}
      />

      {/* ── LINHA DE ACENTO DOURADA (TOPO) ──────────────────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: '4px', background: `linear-gradient(90deg, transparent 0%, ${GOLD} 40%, ${GOLD_LT} 60%, transparent 100%)` }}
      />

      {/* ── CONTEÚDO ─────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col" style={{ padding: '52px 44px 48px' }}>

        {/* HEADER: logos */}
        <div className="flex items-center justify-between" style={{ marginBottom: '36px' }}>
          <img src={logoVDH} alt="VDH" className="rounded-xl" style={{ height: '56px', opacity: 0.95 }} />
          {isCaixa && (
            <img src={logoCaixa} alt="Caixa" className="rounded-lg" style={{ height: '64px', filter: 'brightness(0) invert(1)', opacity: 0.85 }} />
          )}
        </div>

        {/* FOTO PRINCIPAL — moldura de destaque */}
        <div
          style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            border: `2px solid rgba(212,175,55,0.4)`,
            boxShadow: `0 0 60px rgba(212,175,55,0.12), 0 24px 60px rgba(0,0,0,0.7)`,
            marginBottom: '28px',
            flex: '0 0 auto',
            height: '320px',
          }}
        >
          {/* Fotos em grid 2+1 */}
          <div className="absolute inset-0 flex" style={{ gap: '2px' }}>
            {/* Foto grande esquerda */}
            <div style={{ flex: '0 0 60%', position: 'relative', overflow: 'hidden' }}>
              {p0 ? (
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p0})` }} />
              ) : (
                <div className="absolute inset-0" style={{ background: '#1a2235' }} />
              )}
            </div>
            {/* Fotos direita empilhadas */}
            <div className="flex flex-col" style={{ flex: 1, gap: '2px' }}>
              {[p1, p2].map((p, i) => (
                <div key={i} style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                  {p ? (
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p})` }} />
                  ) : (
                    <div className="absolute inset-0" style={{ background: i === 0 ? '#121824' : '#0e131c' }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Badge de desconto sobre a foto */}
          {discountPct > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                borderRadius: '12px',
                padding: '10px 18px',
                boxShadow: '0 4px 16px rgba(220,38,38,0.5)',
              }}
            >
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', fontWeight: 600, lineHeight: 1 }}>desconto</p>
              <p style={{ fontSize: '44px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>-{discountPct}%</p>
            </div>
          )}

          {/* Localização sobre a foto (bottom) */}
          {locationLine && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '28px 20px 14px',
                background: 'linear-gradient(to top, rgba(7,8,12,0.95) 0%, transparent 100%)',
              }}
            >
              <p style={{ fontSize: '22px', color: GOLD, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                📍 {locationLine}
              </p>
            </div>
          )}
        </div>

        {/* TIPO + AVALIAÇÃO */}
        <div style={{ marginBottom: '18px' }}>
          <p style={{ fontSize: '28px', color: 'rgba(255,255,255,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
            {data.type || 'Imóvel'} · Oportunidade
          </p>

          {evalLabel && (
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '26px', color: 'rgba(255,255,255,0.28)', fontWeight: 500, textDecoration: 'line-through' }}>
                {evalLabel}
              </span>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
              <span style={{ fontSize: '22px', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>valor avaliado</span>
            </div>
          )}
        </div>

        {/* PREÇO DE VENDA */}
        <div style={{ marginBottom: '18px' }}>
          <p style={{ fontSize: '20px', color: 'rgba(212,175,55,0.6)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
            Preço de Venda
          </p>
          <p
            className="font-black"
            style={{
              fontSize: '72px',
              color: '#ffffff',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              textShadow: `0 0 40px rgba(212,175,55,0.2)`,
            }}
          >
            {minLabel || 'Sob consulta'}
          </p>
          {savingsLabel && (
            <p style={{ fontSize: '22px', color: '#4ade80', fontWeight: 700, marginTop: '6px' }}>
              💰 Você economiza {savingsLabel}
            </p>
          )}
        </div>

        {/* SPECS + TAGS */}
        <div className="flex items-end justify-between" style={{ marginTop: 'auto' }}>
          {/* Specs */}
          <div className="flex gap-3">
            {bedroomsNum > 0 && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '30px', fontWeight: 900, color: '#fff' }}>{bedroomsNum}</p>
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>🛏 quarto{bedroomsNum > 1 ? 's' : ''}</p>
              </div>
            )}
            {bathroomsNum > 0 && (
              <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '12px' }}>
                <p style={{ fontSize: '30px', fontWeight: 900, color: '#fff' }}>{bathroomsNum}</p>
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>🚿 banh.</p>
              </div>
            )}
            {garageNum > 0 && (
              <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '12px' }}>
                <p style={{ fontSize: '30px', fontWeight: 900, color: '#fff' }}>{garageNum}</p>
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>🚗 vaga{garageNum > 1 ? 's' : ''}</p>
              </div>
            )}
            {areaValue && areaValue !== '0' && (
              <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '12px' }}>
                <p style={{ fontSize: '30px', fontWeight: 900, color: '#fff' }}>{areaValue}</p>
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>📐 m²</p>
              </div>
            )}
          </div>

          {/* Tags de condições */}
          <div className="flex flex-col gap-2" style={{ alignItems: 'flex-end' }}>
            {tags.map((tag, i) => (
              <div
                key={i}
                style={{
                  padding: '7px 16px',
                  borderRadius: '100px',
                  background: tag.bg,
                  border: `1px solid ${tag.color}40`,
                }}
              >
                <span style={{ fontSize: '20px', color: tag.color, fontWeight: 700 }}>{tag.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── LINHA DE ACENTO DOURADA (BAIXO) ─────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '3px', background: `linear-gradient(90deg, transparent 0%, ${GOLD} 40%, ${GOLD_LT} 60%, transparent 100%)` }}
      />

    </div>
  );
};
