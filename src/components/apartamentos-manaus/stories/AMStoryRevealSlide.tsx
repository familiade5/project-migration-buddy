/**
 * AMStoryRevealSlide — Slide 2 (Imóvel) compartilhado entre os 3 temas
 *
 * Layout baseado no modelo Modelo_Story_1.png:
 *  ┌──────────────────────────────┐
 *  │  📍 Endereço — Cidade, UF    │  ← linha localização
 *  ├───────────────┬──────────────┤
 *  │  Card Laranja │  Logo AM     │  ← título + specs | logo
 *  ├───────────────┴──────────────┤
 *  │          Foto grande         │  ← 1 foto larga
 *  ├──────────────┬───────────────┤
 *  │   Foto 2     │   Foto 3      │  ← 2 fotos iguais
 *  ├──────────────┼───────────────┤
 *  │   Foto 4     │  Preço (azul) │  ← 1 foto + card preço
 *  ├──────────────┴───────────────┤
 *  │    🏠 Logo Apartamentos      │  ← rodapé logo
 *  └──────────────────────────────┘
 */

import { AMPropertyData } from '@/types/apartamentosManaus';
import logoAM from '@/assets/logo-apartamentos-manaus.png';

const STORY_W = 360;
const STORY_H = 640;

const formatPrice = (v: number) =>
  v > 0
    ? v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    : 'Consulte';

interface RevealSlideProps {
  data: AMPropertyData;
  photos?: string[];
  /** slide counter label, e.g. "2 / 3" */
  counter?: string;
  /** bg color behind logo footer */
  footerBg?: string;
  /** footer text color */
  footerColor?: string;
}

export const AMStoryRevealSlide = ({
  data,
  photos = [],
  counter = '2 / 3',
  footerBg = '#ffffff',
  footerColor = '#1B5EA6',
}: RevealSlideProps) => {
  const img = (i: number) => photos[i] ?? photos[0] ?? undefined;

  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const priceLabel = data.isRental ? 'LOCAÇÃO' : 'VENDA';

  // Specs compactos para o card laranja
  const specItems = [
    data.area > 0 && `${data.area} m²`,
    data.floor ? `${data.floor}° And.` : null,
    data.bedrooms > 0 && `${data.bedrooms} ${data.bedrooms === 1 ? 'Quarto' : 'Quartos'}`,
  ].filter(Boolean) as string[];

  // Localização no topo
  const locationLine = [
    data.address || data.neighborhood,
    data.city && data.state ? `${data.city}, ${data.state}` : data.city || data.state,
  ]
    .filter(Boolean)
    .join(' — ');

  // Alturas das seções (total = 640)
  const LOC_H = 28;   // linha de localização
  const HDR_H = 72;   // cards laranja+logo
  const BIG_H = 148;  // foto grande
  const MID_H = 118;  // linha 2 fotos
  const BOT_H = 118;  // linha foto+preço
  const FOO_H = STORY_H - LOC_H - HDR_H - BIG_H - MID_H - BOT_H; // ~156 → usamos 52 fixo

  // Para garantir 640 exato:
  const FOOTER_H = 640 - LOC_H - HDR_H - BIG_H - MID_H - BOT_H;

  const GAP = 3;

  return (
    <div
      style={{
        position: 'relative',
        width: STORY_W,
        height: STORY_H,
        backgroundColor: '#f8f9fa',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── 1. LOCALIZAÇÃO ── */}
      <div
        style={{
          height: LOC_H,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 14,
          paddingRight: 14,
          backgroundColor: '#f0f4f8',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 10, marginRight: 5 }}>📍</span>
        <p
          style={{
            color: '#374151',
            fontSize: 10,
            fontWeight: 600,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {locationLine || 'Manaus, AM'}
        </p>
      </div>

      {/* ── 2. CARD LARANJA + LOGO ── */}
      <div
        style={{
          height: HDR_H,
          display: 'flex',
          gap: GAP,
          padding: `${GAP}px ${GAP}px 0`,
          flexShrink: 0,
        }}
      >
        {/* Card laranja — título + specs */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#F47920',
            borderRadius: 10,
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <p
            style={{
              color: 'white',
              fontSize: 14,
              fontWeight: 800,
              margin: '0 0 5px',
              lineHeight: 1.2,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as const,
            }}
          >
            {data.title || 'Apartamento Disponível'}
          </p>
          {specItems.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 8px' }}>
              {specItems.map((s, i) => (
                <span
                  key={i}
                  style={{
                    color: 'rgba(255,255,255,0.92)',
                    fontSize: 9,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  {i === 0 && (
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="rgba(255,255,255,0.7)">
                      <path d="M0 0v5l2-2 3 3 2-2-3-3 2-2H0zm12 12V7l-2 2-3-3-2 2 3 3-2 2h6z" />
                    </svg>
                  )}
                  {i === 1 && <span style={{ fontSize: 8 }}>🏢</span>}
                  {i === 2 && <span style={{ fontSize: 8 }}>🛏</span>}
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Card logo */}
        <div
          style={{
            width: 100,
            backgroundColor: '#ffffff',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
            boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
            flexShrink: 0,
          }}
        >
          <img src={logoAM} alt="Apartamentos Manaus" width={82} />
        </div>
      </div>

      {/* ── 3. FOTO GRANDE ── */}
      <div
        style={{
          height: BIG_H,
          margin: `${GAP}px ${GAP}px 0`,
          borderRadius: 10,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {img(0) ? (
          <img
            src={img(0)}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#d1d5db' }} />
        )}
      </div>

      {/* ── 4. 2 FOTOS MÉDIAS ── */}
      <div
        style={{
          height: MID_H,
          display: 'flex',
          gap: GAP,
          margin: `${GAP}px ${GAP}px 0`,
          flexShrink: 0,
        }}
      >
        {[1, 2].map((idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            {img(idx) ? (
              <img
                src={img(idx)}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: '#e5e7eb' }} />
            )}
          </div>
        ))}
      </div>

      {/* ── 5. FOTO PEQUENA + PREÇO ── */}
      <div
        style={{
          height: BOT_H,
          display: 'flex',
          gap: GAP,
          margin: `${GAP}px ${GAP}px 0`,
          flexShrink: 0,
        }}
      >
        {/* Foto 4 */}
        <div
          style={{
            flex: 1,
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          {img(3) ? (
            <img
              src={img(3)}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#e5e7eb' }} />
          )}
        </div>

        {/* Card preço azul */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#1B5EA6',
            borderRadius: 10,
            padding: '12px 12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          {/* Label pill */}
          <div
            style={{
              display: 'inline-block',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 20,
              padding: '2px 8px',
              width: 'fit-content',
            }}
          >
            <p style={{ color: 'white', fontSize: 8, fontWeight: 700, margin: 0, letterSpacing: '0.06em' }}>
              {priceLabel}
            </p>
          </div>

          {/* Preço */}
          <div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 9, margin: '0 0 1px' }}>R$</p>
            <p
              style={{
                color: 'white',
                fontSize: price > 999999 ? 18 : 22,
                fontWeight: 900,
                margin: 0,
                lineHeight: 1,
              }}
            >
              {formatPrice(price)}
              {price > 0 && (
                <span style={{ fontSize: 10, fontWeight: 400, opacity: 0.75 }}>,00</span>
              )}
            </p>
          </div>

          {/* Tags pagamento */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
            {!data.isRental && !data.cashOnly && (
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 8, margin: 0, fontWeight: 600 }}>
                À vista
              </p>
            )}
            {data.acceptsFinancing && (
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 8, margin: 0, fontWeight: 600 }}>
                Apto para financiamento
              </p>
            )}
            {data.acceptsFGTS && (
              <p style={{ color: 'rgba(134,239,172,0.9)', fontSize: 8, margin: 0, fontWeight: 600 }}>
                ✓ FGTS
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── 6. RODAPÉ LOGO ── */}
      <div
        style={{
          flex: 1,
          backgroundColor: footerBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          marginTop: GAP,
          position: 'relative',
        }}
      >
        <img
          src={logoAM}
          alt="Apartamentos Manaus"
          width={110}
          style={footerBg === '#0a0f1e' || footerBg === '#0c0c0c' ? { filter: 'brightness(0) invert(1)' } : undefined}
        />
        {/* Counter */}
        <div
          style={{
            position: 'absolute',
            right: 14,
            backgroundColor: footerColor === '#ffffff' ? 'rgba(255,255,255,0.15)' : 'rgba(27,94,166,0.12)',
            borderRadius: 20,
            padding: '3px 10px',
          }}
        >
          <p style={{ color: footerColor, fontSize: 9, margin: 0, fontWeight: 700 }}>{counter}</p>
        </div>
      </div>
    </div>
  );
};
