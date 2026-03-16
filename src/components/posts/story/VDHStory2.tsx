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

  /* ── Tags de condições ───────────────────────────────────────────────────── */
  const tags: { label: string; color: string; bg: string }[] = [];
  if (acceptsFinancing)  tags.push({ label: 'Financiamento', color: '#bbf7d0', bg: 'rgba(22,163,74,0.18)' });
  else                   tags.push({ label: 'Somente à Vista', color: '#fca5a5', bg: 'rgba(220,38,38,0.18)' });
  if (acceptsFGTS)       tags.push({ label: 'FGTS', color: '#93c5fd', bg: 'rgba(37,99,235,0.18)' });

  /* Story dimensions: 1080x1920 rendered at 540x960 → 50% = 480px */
  const PHOTO_HEIGHT = '50%';

  return (
    <div
      className="post-template-story relative overflow-hidden"
      style={{ background: BG, fontFamily: 'system-ui, sans-serif' }}
    >

      {/* ── LINHA DE ACENTO DOURADA (TOPO) ──────────────────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 z-20"
        style={{ height: '4px', background: `linear-gradient(90deg, transparent 0%, ${GOLD} 40%, ${GOLD_LT} 60%, transparent 100%)` }}
      />

      {/* ── BLOCO DE FOTOS — ocupa exatamente 50% do slide ─────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: PHOTO_HEIGHT,
          display: 'flex',
          gap: '3px',
          overflow: 'hidden',
        }}
      >
        {/* Foto grande esquerda */}
        <div style={{ flex: '0 0 60%', position: 'relative', overflow: 'hidden' }}>
          {p0 ? (
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p0})` }} />
          ) : (
            <div className="absolute inset-0" style={{ background: '#1a2235' }} />
          )}
        </div>
        {/* Fotos direita empilhadas */}
        <div className="flex flex-col" style={{ flex: 1, gap: '3px' }}>
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

        {/* Badge de desconto sobre a foto — proporcional ao tamanho da foto */}
        {discountPct > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              borderRadius: '16px',
              padding: '14px 24px',
              boxShadow: '0 6px 24px rgba(220,38,38,0.6)',
              zIndex: 10,
            }}
          >
            <p style={{ fontSize: '22px', color: 'rgba(255,255,255,0.85)', fontWeight: 600, lineHeight: 1 }}>desconto</p>
            <p style={{ fontSize: '62px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>-{discountPct}%</p>
          </div>
        )}

        {/* Localização no rodapé das fotos */}
        {locationLine && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '32px 24px 16px',
              background: 'linear-gradient(to top, rgba(7,8,12,0.92) 0%, transparent 100%)',
              zIndex: 10,
            }}
          >
            <p style={{ fontSize: '28px', color: GOLD, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              📍 {locationLine}
            </p>
          </div>
        )}
      </div>

      {/* ── PAINEL DE INFORMAÇÕES — ocupa os 50% inferiores ─────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: PHOTO_HEIGHT,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 40px 32px',
        }}
      >
        {/* Logos */}
        <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
          <img src={logoVDH} alt="VDH" className="rounded-xl" style={{ height: '52px', opacity: 0.95 }} />
          {isCaixa && (
            <img src={logoCaixa} alt="Caixa" className="rounded-lg" style={{ height: '58px', filter: 'brightness(0) invert(1)', opacity: 0.85 }} />
          )}
        </div>

        {/* Divisor dourado */}
        <div style={{ height: '1px', background: `linear-gradient(90deg, ${GOLD} 0%, rgba(212,175,55,0.1) 100%)`, marginBottom: '18px' }} />

        {/* TIPO + AVALIAÇÃO */}
        <div style={{ marginBottom: '10px' }}>
          <p style={{ fontSize: '34px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
            {data.type || 'Imóvel'} · Oportunidade
          </p>

          {evalLabel && (
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '32px', color: 'rgba(255,255,255,0.28)', fontWeight: 500, textDecoration: 'line-through' }}>
                {evalLabel}
              </span>
              <span style={{ fontSize: '28px', color: 'rgba(255,255,255,0.28)', fontWeight: 500 }}>valor avaliado</span>
            </div>
          )}
        </div>

        {/* PREÇO DE VENDA */}
        <div style={{ marginBottom: '10px' }}>
          <p style={{ fontSize: '26px', color: 'rgba(212,175,55,0.65)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>
            Preço de Venda
          </p>
          <p
            className="font-black"
            style={{
              fontSize: '78px',
              color: '#ffffff',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              textShadow: `0 0 40px rgba(212,175,55,0.2)`,
            }}
          >
            {minLabel || 'Sob consulta'}
          </p>
          {savingsLabel && (
            <p style={{ fontSize: '28px', color: '#4ade80', fontWeight: 700, marginTop: '6px' }}>
              💰 Você economiza {savingsLabel}
            </p>
          )}
        </div>

        {/* SPECS + TAGS */}
        <div className="flex items-end justify-between" style={{ marginTop: 'auto' }}>
          {/* Specs */}
          <div className="flex gap-5">
            {bedroomsNum > 0 && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '54px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{bedroomsNum}</p>
                <p style={{ fontSize: '26px', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>🛏 quarto{bedroomsNum > 1 ? 's' : ''}</p>
              </div>
            )}
            {bathroomsNum > 0 && (
              <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.12)', paddingLeft: '20px' }}>
                <p style={{ fontSize: '54px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{bathroomsNum}</p>
                <p style={{ fontSize: '26px', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>🚿 banh.</p>
              </div>
            )}
            {garageNum > 0 && (
              <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.12)', paddingLeft: '20px' }}>
                <p style={{ fontSize: '54px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{garageNum}</p>
                <p style={{ fontSize: '26px', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>🚗 vaga{garageNum > 1 ? 's' : ''}</p>
              </div>
            )}
            {areaValue && areaValue !== '0' && (
              <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.12)', paddingLeft: '20px' }}>
                <p style={{ fontSize: '54px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{areaValue}</p>
                <p style={{ fontSize: '26px', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>📐 m²</p>
              </div>
            )}
          </div>

          {/* Tags de condições */}
          <div className="flex flex-col gap-2" style={{ alignItems: 'flex-end' }}>
            {tags.map((tag, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 22px',
                  borderRadius: '100px',
                  background: tag.bg,
                  border: `1px solid ${tag.color}40`,
                }}
              >
                <span style={{ fontSize: '26px', color: tag.color, fontWeight: 700 }}>{tag.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── LINHA DE ACENTO DOURADA (BAIXO) ─────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20"
        style={{ height: '3px', background: `linear-gradient(90deg, transparent 0%, ${GOLD} 40%, ${GOLD_LT} 60%, transparent 100%)` }}
      />

    </div>
  );
};
