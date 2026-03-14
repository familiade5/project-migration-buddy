/**
 * TEMA 4 — "PADRÃO"
 * 5 slides INDEPENDENTES — cada um é único, sem continuação narrativa.
 *
 * Slide 1: Grade de fotos + header de bairro + preço (referência do modelo)
 * Slide 2: Hero foto centralizada + badge de preço grande
 * Slide 3: Ficha técnica clean — especificações em cards modernos
 * Slide 4: Galeria mosaico com preço em destaque
 * Slide 5: Contato / CTA clean e direto
 */

import { AMPropertyData } from '@/types/apartamentosManaus';
import logoAM from '@/assets/logo-apartamentos-manaus.png';
import logoCaixa from '@/assets/logo-caixa.png';

const STORY_W = 360;
const STORY_H = 640;

const Logo = ({ size = 90, white = false }: { size?: number; white?: boolean }) => (
  <img
    src={logoAM}
    alt="Apartamentos Manaus"
    width={size}
    style={white ? { filter: 'brightness(0) invert(1)' } : undefined}
  />
);

const formatPrice = (v: number) =>
  v > 0
    ? `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    : 'Consulte';

const formatPriceParts = (v: number): { prefix: string; main: string; cents: string } => {
  if (!v || v === 0) return { prefix: '', main: 'Consulte', cents: '' };
  const formatted = v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const parts = formatted.split(',');
  return { prefix: 'R$', main: parts[0], cents: `,${parts[1]}` };
};

/* ─────────────────────────────────────────────────────────────────
   SLIDE 1 — Grade de fotos (modelo da referência)
   Layout: endereço no topo · header laranja + banco · 4 fotos · preço · logo
   ───────────────────────────────────────────────────────────────── */
export const AMStory4_T4_Slide1 = ({
  data,
  photos,
}: {
  data: AMPropertyData;
  photos?: string[];
}) => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const priceParts = formatPriceParts(price);
  const imgs = photos && photos.length > 0 ? photos : [];
  const img = (i: number) => imgs[i] ?? imgs[0] ?? undefined;

  const floorLabel = data.floor ? (data.floor === '0' || data.floor.toLowerCase() === 'térreo' ? 'Térreo' : `${data.floor}° Andar`) : null;

  return (
    <div style={{
      position: 'relative', width: STORY_W, height: STORY_H,
      backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', overflow: 'hidden',
    }}>
      {/* ── Endereço topo ── */}
      {data.address && (
        <div style={{ padding: '16px 18px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#F47920', fontSize: 13 }}>📍</span>
          <p style={{ color: '#555', fontSize: 11, margin: 0, fontWeight: 500 }}>
            {data.address}
          </p>
        </div>
      )}

      {/* ── Header row: título + banco ── */}
      <div style={{ padding: '10px 18px 0', display: 'flex', alignItems: 'stretch', gap: 10 }}>
        {/* Orange title card */}
        <div style={{
          flex: 1, backgroundColor: '#F47920', borderRadius: 10, padding: '10px 14px',
        }}>
          <p style={{ color: 'white', fontSize: 16, fontWeight: 900, margin: '0 0 5px', lineHeight: 1.2 }}>
            {data.title || 'Apartamento'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap' }}>
            {data.area > 0 && (
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 10, display: 'flex', alignItems: 'center', gap: 3, whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: 11 }}>📐</span> {data.area} m²
              </span>
            )}
            {floorLabel && (
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 10, display: 'flex', alignItems: 'center', gap: 3, whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: 11 }}>🏢</span> {floorLabel}
              </span>
            )}
            {data.bedrooms > 0 && (
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 10, display: 'flex', alignItems: 'center', gap: 3, whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: 11 }}>🛏</span> {data.bedrooms} Quarto{data.bedrooms > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* CAIXA — mesmo height do card laranja, sem fundo extra */}
        {data.acceptsFinancing && (
          <div style={{
            width: 108, alignSelf: 'stretch', borderRadius: 10, overflow: 'hidden',
            flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img
              src={logoCaixa}
              alt="CAIXA"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}
      </div>

      {/* ── Fotos ── */}
      <div style={{ padding: '10px 18px 0' }}>
        {/* Foto grande topo */}
        <div style={{ height: 170, borderRadius: 10, overflow: 'hidden', marginBottom: 6 }}>
          {img(0) ? (
            <img src={img(0)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#e2e8f0' }} />
          )}
        </div>
        {/* Linha de 2 fotos */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <div style={{ flex: 1, height: 108, borderRadius: 10, overflow: 'hidden' }}>
            {img(1) ? (
              <img src={img(1)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: '#e2e8f0' }} />
            )}
          </div>
          <div style={{ flex: 1, height: 108, borderRadius: 10, overflow: 'hidden' }}>
            {img(2) ? (
              <img src={img(2)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: '#e2e8f0' }} />
            )}
          </div>
        </div>
        {/* Linha final: foto menor + preço */}
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ flex: 1, height: 100, borderRadius: 10, overflow: 'hidden' }}>
            {img(3) ? (
              <img src={img(3)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: '#e2e8f0' }} />
            )}
          </div>
          {/* Price card azul — idêntico ao feed */}
          <div style={{
            flex: 1, height: 100, backgroundColor: '#1B5EA6', borderRadius: 10,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8px 12px',
          }}>
            {/* Pill VENDA/LOCAÇÃO */}
            <div style={{
              display: 'inline-block', alignSelf: 'flex-start',
              color: 'white', fontWeight: 700, fontSize: 8, letterSpacing: '0.08em',
              backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: 20, padding: '1px 8px', marginBottom: 4,
            }}>
              {data.isRental ? 'LOCAÇÃO' : 'VENDA'}
            </div>
            {/* Preço */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 1, color: 'white' }}>
              <span style={{ fontSize: 10, opacity: 0.75, marginRight: 1 }}>R$</span>
              <span style={{ fontSize: 19, fontWeight: 700, lineHeight: 1 }}>
                {priceParts.main || 'Consulte'}
              </span>
              {priceParts.cents && <span style={{ fontSize: 10, opacity: 0.75 }}>{priceParts.cents}</span>}
            </div>
            {/* Separador + linha de pagamento — igual ao feed */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', marginTop: 4, paddingTop: 3 }}>
              <p style={{ color: 'white', fontSize: 8, opacity: 0.9, margin: 0, lineHeight: 1.3 }}>
                {data.isRental
                  ? 'Locação'
                  : [
                      'À vista',
                      data.acceptsFinancing && 'Aceita financiamento',
                    ].filter(Boolean).join(' | ')
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Logo rodapé ── */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
        <Logo size={85} />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   SLIDE 2 — Composição triangular de 5 fotos + preço em destaque
   Layout: hero diagonal topo · 2x2 grid embaixo · fundo branco fotos · fundo preto info
   ───────────────────────────────────────────────────────────────── */
export const AMStory4_T4_Slide2 = ({
  data,
  photo,
  photos,
}: {
  data: AMPropertyData;
  photo?: string;
  photos?: string[];
}) => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const imgs = photos && photos.length > 0 ? photos : photo ? [photo] : [];
  const img = (i: number) => imgs[i] ?? imgs[0] ?? undefined;

  // Zona de fotos: 0 a ~370px (branco)
  // Zona de informações: ~370px até 640px (preto)
  const INFO_TOP = 368;

  return (
    <div style={{
      position: 'relative', width: STORY_W, height: STORY_H,
      fontFamily: 'Arial, sans-serif', overflow: 'hidden',
    }}>

      {/* ── FUNDO BRANCO — zona de fotos ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: INFO_TOP, backgroundColor: '#ffffff' }} />

      {/* ── FUNDO PRETO — zona de informações ── */}
      <div style={{ position: 'absolute', top: INFO_TOP, left: 0, right: 0, bottom: 0, backgroundColor: '#0a0f1e' }} />

      {/* ── Logo topo — sem fundo, logo colorida sobre branco ── */}
      <div style={{ position: 'absolute', top: 14, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 20 }}>
        <Logo size={72} />
      </div>

      {/* ── Foto 0 — hero topo, corte diagonal na base ── */}
      <div style={{
        position: 'absolute', top: 56, left: 0, right: 0, height: 180,
        clipPath: 'polygon(0 0, 100% 0, 100% 82%, 50% 100%, 0 82%)',
        overflow: 'hidden',
      }}>
        {img(0) ? (
          <img src={img(0)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#e2e8f0' }} />
        )}
      </div>

      {/* ── Grade 2x2 de fotos abaixo do hero ── */}
      <div style={{
        position: 'absolute', top: 248, left: 14, right: 14,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
        zIndex: 10,
      }}>
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} style={{ height: 96, borderRadius: 10, overflow: 'hidden' }}>
            {img(idx) ? (
              <img src={img(idx)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: '#e2e8f0' }} />
            )}
          </div>
        ))}
      </div>

      {/* ── Bairro pill — sobreposto no topo da foto hero ── */}
      {data.neighborhood && (
        <div style={{ position: 'absolute', top: 70, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 30 }}>
          <div style={{ backgroundColor: '#F47920', borderRadius: 30, padding: '4px 16px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 10 }}>📍</span>
            <span style={{ color: 'white', fontSize: 10, fontWeight: 700 }}>
              {data.neighborhood}
            </span>
          </div>
        </div>
      )}

      {/* ── Bloco de conteúdo (sobre fundo preto) ── */}
      <div style={{ position: 'absolute', bottom: 22, left: 0, right: 0, zIndex: 10, padding: '0 18px' }}>
        {/* Título */}
        <p style={{ color: 'white', fontSize: 18, fontWeight: 900, textAlign: 'center', margin: '0 0 8px', lineHeight: 1.2 }}>
          {data.title || 'Apartamento Disponível'}
        </p>

        {/* Especificações em linha */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
          {data.bedrooms > 0 && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '3px 9px' }}>
              <span style={{ color: 'white', fontSize: 9, fontWeight: 600 }}>🛏 {data.bedrooms} Qto{data.bedrooms > 1 ? 's' : ''}</span>
            </div>
          )}
          {data.area > 0 && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '3px 9px' }}>
              <span style={{ color: 'white', fontSize: 9, fontWeight: 600 }}>📐 {data.area}m²</span>
            </div>
          )}
          {data.garageSpaces > 0 && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '3px 9px' }}>
              <span style={{ color: 'white', fontSize: 9, fontWeight: 600 }}>🚗 {data.garageSpaces} Vaga{data.garageSpaces > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Card de preço */}
        <div style={{
          backgroundColor: 'white', borderRadius: 14, padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ color: '#64748b', fontSize: 9, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {data.isRental ? 'Aluguel' : 'Valor de Venda'}
            </p>
            <p style={{ color: '#1B5EA6', fontSize: 22, fontWeight: 900, margin: 0, lineHeight: 1 }}>
              {formatPrice(price)}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end' }}>
            {data.acceptsFinancing && (
              <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>✓ Financiamento</span>
            )}
            {data.acceptsFGTS && (
              <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>✓ FGTS</span>
            )}
            {data.subsidy > 0 && (
              <span style={{ backgroundColor: '#fef9c3', color: '#854d0e', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>Subsídio até {formatPrice(data.subsidy)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   SLIDE 3 — Galeria split + ficha técnica
   Layout: coluna esq — 1 foto vertical grande · coluna dir — 4 células 2x2
            sobreposição inferior com specs + preço + logo
   ───────────────────────────────────────────────────────────────── */
export const AMStory4_T4_Slide3 = ({
  data,
  photo,
  photos,
}: {
  data: AMPropertyData;
  photo?: string;
  photos?: string[];
}) => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const imgs = photos && photos.length > 0 ? photos : photo ? [photo] : [];
  const img = (i: number) => imgs[i] ?? imgs[0] ?? undefined;

  const specCards = [
    data.bedrooms > 0 && { icon: '🛏', label: 'Quartos', value: String(data.bedrooms) },
    data.bathrooms > 0 && { icon: '🚿', label: 'Banheiros', value: String(data.bathrooms) },
    data.area > 0 && { icon: '📐', label: 'Área', value: `${data.area}m²` },
    data.garageSpaces > 0 && { icon: '🚗', label: 'Vagas', value: String(data.garageSpaces) },
    data.suites > 0 && { icon: '🛁', label: 'Suítes', value: String(data.suites) },
    data.floor && { icon: '🏢', label: 'Andar', value: data.floor === '0' ? 'Térreo' : `${data.floor}°` },
  ].filter(Boolean) as { icon: string; label: string; value: string }[];

  // Fotos zone height
  const PHOTO_H = 370;
  const GAP = 4;
  const LEFT_W = 160;

  return (
    <div style={{
      position: 'relative', width: STORY_W, height: STORY_H,
      backgroundColor: '#0a0f1e', fontFamily: 'Arial, sans-serif', overflow: 'hidden',
    }}>

      {/* ═══ ZONA DE FOTOS (topo) ═══ */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: PHOTO_H, display: 'flex', gap: GAP }}>

        {/* Coluna esquerda — 1 foto alta, bordas arredondadas apenas na base direita */}
        <div style={{ width: LEFT_W, flexShrink: 0, overflow: 'hidden', borderBottomRightRadius: 18 }}>
          {img(0) ? (
            <img src={img(0)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#1e293b' }} />
          )}
        </div>

        {/* Coluna direita — grid 2x2 de 4 fotos */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: GAP,
        }}>
          {[1, 2, 3, 4].map((idx, i) => (
            <div key={idx} style={{
              overflow: 'hidden',
              borderRadius: i === 1 ? '0 0 0 0' : i === 3 ? '0 0 18px 0' : 0,
            }}>
              {img(idx) ? (
                <img src={img(idx)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: `hsl(${220 + i * 12}, 28%, ${14 + i * 4}%)` }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Gradiente de transição fotos → conteúdo */}
      <div style={{
        position: 'absolute', left: 0, right: 0,
        top: PHOTO_H - 60, height: 80,
        background: 'linear-gradient(to bottom, transparent, #0a0f1e)',
        zIndex: 5,
        pointerEvents: 'none',
      }} />

      {/* ═══ ZONA DE CONTEÚDO (rodapé) ═══ */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: STORY_H - PHOTO_H + 50,
        zIndex: 10,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '0 16px 14px',
        gap: 10,
      }}>

        {/* Título + bairro */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'white', fontSize: 16, fontWeight: 900, margin: '0 0 4px', lineHeight: 1.2 }}>
            {data.title || 'Apartamento Disponível'}
          </p>
          {data.neighborhood && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, backgroundColor: '#F47920', borderRadius: 20, padding: '3px 12px' }}>
              <span style={{ fontSize: 9 }}>📍</span>
              <span style={{ color: 'white', fontSize: 9, fontWeight: 700 }}>{data.neighborhood}</span>
            </div>
          )}
        </div>

        {/* Specs em linha horizontal */}
        {specCards.length > 0 && (
          <div style={{ display: 'flex', gap: 5, justifyContent: 'center', flexWrap: 'wrap' }}>
            {specCards.slice(0, 4).map((s, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 10, padding: '5px 9px', textAlign: 'center', minWidth: 52,
              }}>
                <div style={{ fontSize: 13, lineHeight: 1 }}>{s.icon}</div>
                <p style={{ color: '#fff', fontSize: 11, fontWeight: 800, margin: '2px 0 1px', lineHeight: 1 }}>{s.value}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 7, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Card preço + badges */}
        <div style={{
          backgroundColor: 'white', borderRadius: 14, padding: '11px 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ color: '#64748b', fontSize: 8, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {data.isRental ? 'Aluguel/mês' : 'Valor de Venda'}
            </p>
            <p style={{ color: '#1B5EA6', fontSize: 20, fontWeight: 900, margin: 0, lineHeight: 1 }}>
              {formatPrice(price)}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end' }}>
            {data.acceptsFinancing && (
              <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: 8, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>✓ Financiamento</span>
            )}
            {data.acceptsFGTS && (
              <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: 8, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>✓ FGTS</span>
            )}
            {data.subsidy > 0 && (
              <span style={{ backgroundColor: '#fef9c3', color: '#854d0e', fontSize: 8, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>Subsídio {formatPrice(data.subsidy)}</span>
            )}
          </div>
        </div>

        {/* Logo + telefone */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo size={68} white />
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9, margin: 0, fontWeight: 500 }}>
            {data.brokerPhone || '(92) 98839-1098'}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   SLIDE 4 — Galeria mosaico com preço lateral
   Layout: strip branca topo (logo + bairro) · mosaico de fotos · card preço sobreponível
   ───────────────────────────────────────────────────────────────── */
export const AMStory4_T4_Slide4 = ({
  data,
  photos,
}: {
  data: AMPropertyData;
  photos?: string[];
}) => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const imgs = photos && photos.length > 0 ? photos : [];
  const img = (i: number) => imgs[i] ?? imgs[0] ?? undefined;

  return (
    <div style={{
      position: 'relative', width: STORY_W, height: STORY_H,
      backgroundColor: '#111827', fontFamily: 'Arial, sans-serif', overflow: 'hidden',
    }}>
      {/* ── Top strip branca ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 68, zIndex: 20,
        backgroundColor: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
      }}>
        <Logo size={75} />
        {data.neighborhood && (
          <div style={{ backgroundColor: '#F47920', borderRadius: 8, padding: '5px 12px' }}>
            <p style={{ color: 'white', fontSize: 10, fontWeight: 700, margin: 0 }}>📍 {data.neighborhood}</p>
          </div>
        )}
      </div>

      {/* ── Mosaico de fotos — ocupa tudo menos o topo e rodapé ── */}
      <div style={{ position: 'absolute', top: 68, left: 0, right: 0, bottom: 110, overflow: 'hidden' }}>
        {/* Layout: col esq 60% + col dir 40% */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', gap: 3 }}>
          {/* Coluna esquerda: 1 foto grande */}
          <div style={{ flex: 3, overflow: 'hidden' }}>
            {img(0) ? (
              <img src={img(0)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: '#1e293b' }} />
            )}
          </div>
          {/* Coluna direita: 3 fotos empilhadas */}
          <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {[1, 2, 3].map((idx) => (
              <div key={idx} style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                {img(idx) ? (
                  <img src={img(idx)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', backgroundColor: `hsl(${220 + idx * 10}, 30%, ${15 + idx * 3}%)` }} />
                )}
                {imgs.length > 4 && idx === 3 && (
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: 'white', fontSize: 20, fontWeight: 900, margin: 0 }}>+{imgs.length - 4}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Gradient bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, background: 'linear-gradient(to bottom, transparent, #111827)' }} />
      </div>

      {/* ── Rodapé: info + preço ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 110,
        backgroundColor: '#111827', padding: '10px 16px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'white', fontSize: 13, fontWeight: 800, margin: '0 0 4px', lineHeight: 1.2 }}>
              {data.title || 'Apartamento Disponível'}
            </p>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {data.bedrooms > 0 && <span style={{ color: '#93c5fd', fontSize: 10 }}>🛏 {data.bedrooms} Qtos</span>}
              {data.area > 0 && <span style={{ color: '#93c5fd', fontSize: 10 }}>• 📐 {data.area}m²</span>}
              {data.garageSpaces > 0 && <span style={{ color: '#93c5fd', fontSize: 10 }}>• 🚗 {data.garageSpaces} Vaga{data.garageSpaces > 1 ? 's' : ''}</span>}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, margin: '0 0 2px', textTransform: 'uppercase' }}>{data.isRental ? 'Aluguel' : 'Venda'}</p>
            <p style={{ color: '#F47920', fontSize: 18, fontWeight: 900, margin: 0, lineHeight: 1 }}>{formatPrice(price)}</p>
          </div>
        </div>

        {/* Payment badges row */}
        <div style={{ display: 'flex', gap: 5 }}>
          {data.acceptsFinancing && (
            <span style={{ backgroundColor: 'rgba(27,94,166,0.35)', border: '1px solid rgba(27,94,166,0.5)', color: '#93c5fd', fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>✓ Financiamento</span>
          )}
          {data.acceptsFGTS && (
            <span style={{ backgroundColor: 'rgba(27,94,166,0.35)', border: '1px solid rgba(27,94,166,0.5)', color: '#93c5fd', fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>✓ FGTS</span>
          )}
          {data.subsidy > 0 && (
            <span style={{ backgroundColor: 'rgba(253,230,138,0.15)', color: '#fde68a', fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>Subsídio {formatPrice(data.subsidy)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   SLIDE 5 — Contato / CTA clean
   Layout: fundo branco · grande card laranja de contato · broker info · website
   ───────────────────────────────────────────────────────────────── */
export const AMStory4_T4_Slide5 = ({
  data,
  photo,
}: {
  data: AMPropertyData;
  photo?: string;
}) => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;

  return (
    <div style={{
      position: 'relative', width: STORY_W, height: STORY_H,
      backgroundColor: '#f8fafc', fontFamily: 'Arial, sans-serif', overflow: 'hidden',
    }}>
      {/* Diagonal orange shape decorativa no topo */}
      <div style={{
        position: 'absolute', top: -60, right: -40, width: 240, height: 340,
        backgroundColor: '#F47920', borderRadius: '0 0 0 80%', opacity: 0.08, zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', bottom: -80, left: -60, width: 280, height: 280,
        backgroundColor: '#1B5EA6', borderRadius: '50%', opacity: 0.06, zIndex: 0,
      }} />

      {/* Conteúdo */}
      <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 22px 22px' }}>

        {/* Logo centralizada */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <Logo size={100} />
        </div>

        {/* Resumo do imóvel */}
        <div style={{
          backgroundColor: 'white', borderRadius: 16, padding: '14px 18px', marginBottom: 14,
          border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <p style={{ color: '#0f172a', fontSize: 14, fontWeight: 800, margin: 0, lineHeight: 1.2, flex: 1 }}>
              {data.title || 'Apartamento Disponível'}
            </p>
            {data.neighborhood && (
              <div style={{ backgroundColor: '#fff7ed', borderRadius: 8, padding: '3px 8px', border: '1px solid #fed7aa', marginLeft: 8 }}>
                <span style={{ color: '#F47920', fontSize: 9, fontWeight: 700 }}>📍 {data.neighborhood}</span>
              </div>
            )}
          </div>
          {/* Especificações em linha */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
            {data.bedrooms > 0 && <span style={{ color: '#475569', fontSize: 10, fontWeight: 600 }}>🛏 {data.bedrooms} Qto{data.bedrooms > 1 ? 's' : ''}</span>}
            {data.area > 0 && <span style={{ color: '#475569', fontSize: 10, fontWeight: 600 }}>📐 {data.area}m²</span>}
            {data.garageSpaces > 0 && <span style={{ color: '#475569', fontSize: 10, fontWeight: 600 }}>🚗 {data.garageSpaces} Vaga{data.garageSpaces > 1 ? 's' : ''}</span>}
            {data.floor && <span style={{ color: '#475569', fontSize: 10, fontWeight: 600 }}>🏢 {data.floor}° And.</span>}
          </div>
        </div>

        {/* Preço destaque */}
        <div style={{
          backgroundColor: '#1B5EA6', borderRadius: 14, padding: '14px 18px', marginBottom: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 6px 20px rgba(27,94,166,0.3)',
        }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {data.isRental ? 'Aluguel mensal' : 'Valor de Venda'}
            </p>
            <p style={{ color: 'white', fontSize: 24, fontWeight: 900, margin: 0, lineHeight: 1 }}>
              {formatPrice(price)}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {data.acceptsFinancing && <span style={{ backgroundColor: 'rgba(134,239,172,0.2)', color: '#86efac', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(134,239,172,0.3)' }}>✓ Financiamento</span>}
            {data.acceptsFGTS && <span style={{ backgroundColor: 'rgba(134,239,172,0.2)', color: '#86efac', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(134,239,172,0.3)' }}>✓ FGTS</span>}
          </div>
        </div>

        {/* Card corretor */}
        <div style={{
          backgroundColor: '#F47920', borderRadius: 16, padding: '16px 18px', marginBottom: 12,
          boxShadow: '0 8px 24px rgba(244,121,32,0.35)',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Fale com o Corretor</p>
          <p style={{ color: 'white', fontSize: 16, fontWeight: 900, margin: '0 0 10px' }}>{data.brokerName || 'Iury Sampaio'}</p>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>💬</span>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 9, margin: '0 0 1px', textTransform: 'uppercase' }}>WhatsApp</p>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 900, margin: 0 }}>{data.brokerPhone || '(92) 98839-1098'}</p>
            </div>
          </div>
        </div>

        {/* Website + CRECI */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: 10, margin: '0 0 2px' }}>🌐 www.apartamentosmanaus.com</p>
          <p style={{ color: '#cbd5e1', fontSize: 9, margin: 0 }}>Creci 3968 PF • facebook.com/ApartamentosManaus</p>
        </div>
      </div>
    </div>
  );
};
