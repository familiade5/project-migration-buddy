/**
 * TEMA 1 — "ENIGMA"
 * Story 1: Curiosidade — foto ocupa 50% inferior + texto superior impactante
 * Story 2: Revelação   — fotos ocupam 68% da tela + card info no rodapé
 * Story 3: CTA         — frase única do imóvel + contato
 */

import { AFPropertyData } from '@/types/apartamentosFortaleza';
import logoAF from '@/assets/logo-apartamentos-fortaleza.png';

const STORY_W = 360;
const STORY_H = 640;

const Logo = ({ variant = 'white' }: { variant?: 'white' | 'color' }) => (
  <img
    src={logoAF}
    alt="Apartamentos Fortaleza"
    width={110}
    style={variant === 'white' ? { filter: 'brightness(0) invert(1)' } : undefined}
  />
);

const formatPrice = (v: number) =>
  v > 0
    ? `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    : 'Consulte';

/* ── Story 1: Curiosidade ─── Foto ocupa 50% inferior, texto acima ──────────── */
export const AFStory1_T1_Curiosity = ({
  data,
  photo,
}: {
  data: AFPropertyData;
  photo?: string;
}) => (
  <div
    style={{
      position: 'relative',
      width: STORY_W,
      height: STORY_H,
      backgroundColor: '#0a0f1e',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden',
    }}
  >
    {/* Radial glow top */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse 80% 40% at 50% 20%, rgba(27,94,166,0.55) 0%, transparent 70%)',
    }} />

    {/* Top section — logo + texto (50% superior) */}
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'space-evenly', padding: '20px 32px 16px', zIndex: 10,
    }}>
      <Logo variant="white" />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          backgroundColor: '#F47920', borderRadius: 30, padding: '5px 20px', marginBottom: 14,
          fontSize: 11, fontWeight: 700, color: 'white', letterSpacing: '0.15em', textTransform: 'uppercase',
        }}>
          Você viu esse imóvel?
        </div>

        <p style={{
          color: 'white', fontSize: 28, fontWeight: 900, textAlign: 'center',
          lineHeight: 1.2, margin: '0 0 12px',
          textShadow: '0 2px 20px rgba(0,0,0,0.6)',
        }}>
          {data.bedrooms > 0 ? `${data.bedrooms} quartos` : 'Apartamento'}{' '}
          <span style={{ color: '#F47920' }}>em {data.neighborhood || 'Fortaleza'}</span>{' '}
          por um preço que vai te surpreender
        </p>

        <div style={{ width: 48, height: 3, backgroundColor: '#F47920', borderRadius: 2, margin: '0 0 10px' }} />

        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
          Deslize para ver o imóvel completo 👇
        </p>
      </div>
    </div>

    {/* Bottom section — foto real ocupa exatamente 50% */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', overflow: 'hidden', zIndex: 5,
    }}>
      {photo ? (
        <img
          src={photo}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#1e293b' }} />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, #0a0f1e 0%, transparent 35%, transparent 80%, rgba(0,0,0,0.4) 100%)',
      }} />
      <div style={{
        position: 'absolute', top: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10,
      }}>
        <div style={{
          backgroundColor: 'rgba(244,121,32,0.95)', borderRadius: 20, padding: '4px 16px',
        }}>
          <p style={{ color: 'white', fontSize: 10, fontWeight: 700, margin: 0, letterSpacing: '0.1em' }}>
            📸 VER IMÓVEL ↑
          </p>
        </div>
      </div>
    </div>

    {/* Bottom counter */}
    <div style={{
      position: 'absolute', bottom: 18, right: 20, zIndex: 20,
      backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20,
      padding: '5px 14px', border: '1px solid rgba(255,255,255,0.2)',
    }}>
      <p style={{ color: 'white', fontSize: 11, margin: 0, fontWeight: 600 }}>1 / 3</p>
    </div>
  </div>
);

/* ── Story 2: Revelação — fotos ocupam 68%, card info no rodapé ─────────────── */
export const AFStory1_T1_Reveal = ({
  data,
  photos,
}: {
  data: AFPropertyData;
  photos?: string[];
}) => {
  const price = data.isRental ? data.rentalPrice : data.salePrice;
  const specs = [
    data.bedrooms > 0 && `${data.bedrooms} Quarto${data.bedrooms > 1 ? 's' : ''}`,
    data.area > 0 && `${data.area}m²`,
    data.garageSpaces > 0 && `${data.garageSpaces} Vaga${data.garageSpaces > 1 ? 's' : ''}`,
    data.floor && `${data.floor}° Andar`,
  ].filter(Boolean) as string[];

  const imgs = photos && photos.length > 0 ? photos : [];
  const img = (i: number) => imgs[i] ?? imgs[0] ?? undefined;

  const PHOTO_H = 435;
  const CARD_TOP = PHOTO_H - 20;

  return (
    <div style={{ position: 'relative', width: STORY_W, height: STORY_H, backgroundColor: '#0a0f1e', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: PHOTO_H, zIndex: 1 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: 208, height: PHOTO_H, overflow: 'hidden' }}>
          {img(0) ? (
            <img src={img(0)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#1e293b' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, #0a0f1e 100%)' }} />
        </div>

        <div style={{ position: 'absolute', top: 0, right: 0, width: 148, height: PHOTO_H, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[1, 2, 3].map((idx) => (
            <div key={idx} style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              {img(idx) ? (
                <img src={img(idx)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: idx === 1 ? '#1e293b' : idx === 2 ? '#172033' : '#111827' }} />
              )}
            </div>
          ))}
          {imgs.length > 4 && (
            <div style={{
              position: 'absolute', bottom: 0, right: 0, width: 148, height: '33.3%',
              backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <p style={{ color: 'white', fontSize: 18, fontWeight: 900, margin: 0 }}>+{imgs.length - 4}</p>
            </div>
          )}
        </div>

        <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
          <Logo variant="white" />
        </div>
        {data.neighborhood && (
          <div style={{
            position: 'absolute', top: 16, right: 8, zIndex: 10,
            backgroundColor: '#F47920', borderRadius: 20, padding: '4px 12px',
          }}>
            <p style={{ color: 'white', fontSize: 10, fontWeight: 700, margin: 0 }}>📍 {data.neighborhood}</p>
          </div>
        )}

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
          background: 'linear-gradient(to bottom, transparent, #0a0f1e)',
        }} />
      </div>

      <div style={{
        position: 'absolute', top: CARD_TOP, left: 12, right: 12, bottom: 12, zIndex: 20,
        backgroundColor: '#111827', borderRadius: 20, padding: '16px 18px',
        border: '1px solid rgba(27,94,166,0.35)',
        boxShadow: '0 0 40px rgba(27,94,166,0.2)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 8px', lineHeight: 1.3 }}>
          {data.title || 'Apartamento Disponível'}
        </p>

        {specs.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
            {specs.map((s, i) => (
              <span key={i} style={{
                backgroundColor: 'rgba(27,94,166,0.25)', border: '1px solid rgba(27,94,166,0.4)',
                borderRadius: 20, padding: '3px 10px', color: '#93c5fd', fontSize: 10, fontWeight: 600,
              }}>
                {s}
              </span>
            ))}
          </div>
        )}

        <div style={{
          backgroundColor: '#1B5EA6', borderRadius: 14, padding: '10px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {data.isRental ? 'Aluguel' : 'Valor de Venda'}
            </p>
            <p style={{ color: 'white', fontSize: 22, fontWeight: 900, margin: 0, lineHeight: 1 }}>
              {formatPrice(price)}
            </p>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end' }}>
            {data.acceptsFinancing && (
              <p style={{ color: '#86efac', fontSize: 10, margin: 0, fontWeight: 600 }}>✓ Financiamento</p>
            )}
            {data.acceptsFGTS && (
              <p style={{ color: '#86efac', fontSize: 10, margin: 0, fontWeight: 600 }}>✓ FGTS</p>
            )}
            {data.subsidy > 0 && (
              <p style={{ color: '#fde68a', fontSize: 10, margin: 0, fontWeight: 600 }}>Subsídio até {formatPrice(data.subsidy)}</p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: '3px 12px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <p style={{ color: 'white', fontSize: 10, margin: 0, fontWeight: 600 }}>2 / 3</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Story 3: CTA — frase personalizada do imóvel ────────────────────────────── */
export const AFStory1_T1_CTA = ({
  data,
  photo,
}: {
  data: AFPropertyData;
  photo?: string;
}) => {
  const buildHeadline = () => {
    if (data.neighborhood && data.bedrooms > 0) {
      return { line1: `Seu novo lar em`, line2: `${data.neighborhood}`, line3: `está esperando por você` };
    }
    if (data.bedrooms > 0 && data.area > 0) {
      return { line1: `${data.bedrooms} quartos,`, line2: `${data.area}m² de`, line3: `vida nova` };
    }
    if (data.neighborhood) {
      return { line1: `A sua vida muda`, line2: `em ${data.neighborhood}`, line3: `começa aqui` };
    }
    return { line1: `O imóvel que você`, line2: `procurou`, line3: `está aqui` };
  };
  const hl = buildHeadline();

  return (
    <div style={{ position: 'relative', width: STORY_W, height: STORY_H, fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      {photo && (
        <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35)' }} />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, #0a1628 0%, #1B5EA6 50%, #0a1628 100%)',
        opacity: photo ? 0.82 : 1,
      }} />

      <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%', border: '2px solid rgba(244,121,32,0.2)', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', border: '2px solid rgba(244,121,32,0.35)', zIndex: 2 }} />
      <div style={{ position: 'absolute', bottom: -100, left: -60, width: 300, height: 300, borderRadius: '50%', border: '2px solid rgba(27,94,166,0.25)', zIndex: 2 }} />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 28px 40px',
      }}>
        <Logo variant="white" />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            backgroundColor: 'rgba(244,121,32,0.15)', border: '1px solid rgba(244,121,32,0.5)',
            borderRadius: 30, padding: '5px 20px', marginBottom: 20,
          }}>
            <p style={{ color: '#F47920', fontSize: 11, fontWeight: 700, margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Fale conosco hoje
            </p>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: 600, textAlign: 'center', lineHeight: 1.2, margin: '0 0 4px' }}>
            {hl.line1}
          </p>
          <p style={{ color: '#F47920', fontSize: 36, fontWeight: 900, textAlign: 'center', lineHeight: 1.1, margin: '0 0 4px' }}>
            {hl.line2}
          </p>
          <p style={{ color: 'white', fontSize: 22, fontWeight: 700, textAlign: 'center', lineHeight: 1.2, margin: '0 0 28px' }}>
            {hl.line3}
          </p>

          {data.address && (
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 16px',
              marginBottom: 20, width: '100%',
            }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Endereço</p>
              <p style={{ color: 'white', fontSize: 12, margin: 0, lineHeight: 1.4 }}>{data.address}</p>
            </div>
          )}

          <div style={{
            width: '100%', backgroundColor: '#F47920', borderRadius: 16, padding: '14px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14,
            boxShadow: '0 8px 24px rgba(244,121,32,0.4)',
          }}>
            <span style={{ fontSize: 22 }}>📱</span>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Fale agora via WhatsApp</p>
              <p style={{ color: 'white', fontSize: 18, fontWeight: 900, margin: 0 }}>{data.brokerPhone || '(85) 9XXXX-XXXX'}</p>
            </div>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, textAlign: 'center', margin: '0 0 4px' }}>
            {data.brokerName || 'Corretor de Imóveis'}
          </p>
          {data.creci && (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, textAlign: 'center', margin: 0 }}>
              {data.creci}
            </p>
          )}
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '5px 14px', border: '1px solid rgba(255,255,255,0.15)' }}>
          <p style={{ color: 'white', fontSize: 11, margin: 0, fontWeight: 600 }}>3 / 3</p>
        </div>
      </div>
    </div>
  );
};
