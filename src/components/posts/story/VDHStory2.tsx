import { PropertyData } from '@/types/property';
import logoVDH from '@/assets/logo-vdh.jpg';
import logoCaixa from '@/assets/logo-caixa.png';
import { resolveUF } from '@/lib/stateUF';

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
  const stateShort = resolveUF(data.state);
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

  /* Fotos ocupam 70% do slide — info panel preenche os 30% restantes */
  const PHOTO_HEIGHT = '70%';

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

      {/* ── PAINEL DE INFORMAÇÕES — ocupa os 30% inferiores ─────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: PHOTO_HEIGHT,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '14px 36px 48px',
        }}
      >
        {/* Logos — VDH + "Imóvel Caixa" em texto */}
        <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
          <img src={logoVDH} alt="VDH" className="rounded-xl" style={{ height: '44px', opacity: 0.95 }} />
          {isCaixa && (
            <p style={{ fontSize: '28px', color: '#fff', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1 }}>IMÓVEL CAIXA</p>
          )}
        </div>

        {/* Divisor dourado */}
        <div style={{ height: '1px', background: `linear-gradient(90deg, ${GOLD} 0%, rgba(212,175,55,0.1) 100%)`, marginBottom: '12px' }} />

        {/* TIPO + AVALIAÇÃO */}
        <div style={{ marginBottom: '8px' }}>
          <p style={{ fontSize: '36px', color: '#ffffff', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
            {data.type || 'Imóvel'} · Oportunidade
          </p>

          {evalLabel && (
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '30px', color: '#ffffff', fontWeight: 600, textDecoration: 'line-through' }}>
                {evalLabel}
              </span>
              <span style={{ fontSize: '26px', color: '#ffffff', fontWeight: 600 }}>valor avaliado</span>
            </div>
          )}
        </div>

        {/* PREÇO DE VENDA */}
        <div style={{ marginBottom: '8px' }}>
          <p style={{ fontSize: '24px', color: GOLD_LT, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1px' }}>
            Preço de Venda
          </p>
          <p
            className="font-black"
            style={{
              fontSize: '68px',
              color: '#ffffff',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              textShadow: `0 0 40px rgba(212,175,55,0.2)`,
            }}
          >
            {minLabel || 'Sob consulta'}
          </p>
          {savingsLabel && (
            <p style={{ fontSize: '28px', color: '#22c55e', fontWeight: 800, marginTop: '5px' }}>
              💰 Você economiza {savingsLabel}
            </p>
          )}
        </div>

        {/* SPECS + TAGS */}
        <div className="flex items-end justify-between" style={{ marginTop: 'auto' }}>
          {/* Specs */}
          <div className="flex gap-4">
            {bedroomsNum > 0 && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '46px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{bedroomsNum}</p>
                <p style={{ fontSize: '22px', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>🛏 quarto{bedroomsNum > 1 ? 's' : ''}</p>
              </div>
            )}
            {bathroomsNum > 0 && (
              <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '16px' }}>
                <p style={{ fontSize: '46px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{bathroomsNum}</p>
                <p style={{ fontSize: '22px', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>🚿 banh.</p>
              </div>
            )}
            {garageNum > 0 && (
              <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '16px' }}>
                <p style={{ fontSize: '46px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{garageNum}</p>
                <p style={{ fontSize: '22px', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>🚗 vaga{garageNum > 1 ? 's' : ''}</p>
              </div>
            )}
            {areaValue && areaValue !== '0' && (
              <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '16px' }}>
                <p style={{ fontSize: '46px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{areaValue}</p>
                <p style={{ fontSize: '22px', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>📐 m²</p>
              </div>
            )}
          </div>

          {/* Tags de condições */}
          <div className="flex flex-col gap-2" style={{ alignItems: 'flex-end' }}>
            {tags.map((tag, i) => (
              <div
                key={i}
                style={{
                  padding: '8px 18px',
                  borderRadius: '100px',
                  background: tag.bg,
                  border: `1px solid ${tag.color}60`,
                }}
              >
                <span style={{ fontSize: '24px', color: tag.color, fontWeight: 800 }}>{tag.label}</span>
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
