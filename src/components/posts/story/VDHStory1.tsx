import { PropertyData } from '@/types/property';
import logoVDH from '@/assets/logo-vdh.jpg';
import { useLogoBase64 } from '@/hooks/useLogoBase64';

interface VDHStory1Props {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const VDHStory1 = ({ data, photo }: VDHStory1Props) => {
  const logoBase64 = useLogoBase64(logoVDH);

  const discountRaw = data.discount ?? '';
  const discountNum = discountRaw ? parseFloat(discountRaw.replace(',', '.')) : 0;
  const hasDiscount = discountNum > 0;
  const discountDisplay = discountRaw ? discountRaw.replace('.', ',') : String(discountNum);

  const acceptsFGTS = data.acceptsFGTS || data.canUseFGTS;
  const acceptsFinancing =
    data.acceptsFinancing || data.paymentMethod?.toLowerCase().includes('financ');
  const isCashOnly =
    !acceptsFinancing && data.paymentMethod?.toLowerCase().includes('vista');

  const formatPrice = (val: string) => {
    if (!val) return null;
    if (val.includes('R$')) return val;
    return `R$ ${val}`;
  };
  const price = formatPrice(data.minimumValue) || formatPrice(data.evaluationValue);
  const entryFormatted = data.entryValue ? formatPrice(data.entryValue) : null;

  const propertyType = data.type || 'Imóvel';
  const title = data.propertyName?.trim() || propertyType;
  const propertySource = data.propertySource || 'Imóvel Caixa';

  // Endereço completo automático
  const displayAddress = data.fullAddress ||
    (data.street
      ? `${data.street}${data.number ? `, ${data.number}` : ''}${data.complement ? ` ${data.complement}` : ''} - ${data.neighborhood}, ${data.city}/${(data.state || '').trim().slice(0, 2).toUpperCase()}`
      : [data.neighborhood, data.city, (data.state || '').trim().slice(0, 2).toUpperCase()].filter(Boolean).join(' - '));

  const GOLD        = '#D4AF37';
  const GOLD_BRIGHT = '#F5D060';
  const GOLD_GLOW   = 'rgba(212,175,55,0.45)';
  const GREEN_DEEP  = '#0d2210';

  const financingBg = isCashOnly
    ? 'linear-gradient(160deg, #c2410c 0%, #f97316 40%, #ea580c 100%)'
    : 'linear-gradient(160deg, #15803d 0%, #22c55e 40%, #16a34a 100%)';

  return (
    <div
      className="post-template-story relative overflow-hidden"
      style={{ background: GREEN_DEEP, fontFamily: 'Arial, Helvetica, sans-serif' }}
    >
      {/* Background photo */}
      {photo ? (
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url(${photo})`, backgroundSize: 'cover', backgroundPosition: 'center 20%' }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(160deg, ${GREEN_DEEP} 0%, #040e06 100%)` }}
        />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(4,12,6,0.80) 0%, rgba(4,12,6,0.20) 18%, rgba(4,12,6,0.0) 36%, rgba(4,12,6,0.60) 58%, rgba(4,12,6,0.97) 100%)',
        }}
      />

      {/* Gold glow bottom */}
      <div
        className="absolute"
        style={{
          bottom: '-60px', left: '50%', transform: 'translateX(-50%)',
          width: '900px', height: '600px',
          background: `radial-gradient(ellipse, ${GOLD_GLOW} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* 1 · ACHADO DO DIA */}
      <div className="absolute z-20 flex justify-center" style={{ top: '64px', left: 0, right: 0 }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${GREEN_DEEP}, #163620)`,
            border: `2.5px solid ${GOLD}`,
            borderRadius: '100px',
            padding: '22px 68px',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            boxShadow: `0 0 0 6px rgba(212,175,55,0.10), 0 8px 48px rgba(0,0,0,0.55), 0 0 40px ${GOLD_GLOW}`,
          }}
        >
          <span style={{ fontSize: '56px', lineHeight: 1 }}>🔥</span>
          <span style={{ fontSize: '72px', fontWeight: 900, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1, textShadow: `0 2px 16px rgba(0,0,0,0.5)` }}>
            ACHADO DO DIA!
          </span>
        </div>
      </div>

      {/* 2 · DESCONTO */}
      {hasDiscount && (
        <div className="absolute z-20" style={{ top: '226px', left: '64px' }}>
          <div
            style={{
              background: 'rgba(6,14,8,0.95)',
              border: `2.5px solid ${GOLD}`,
              borderRadius: '22px',
              padding: '30px 50px 26px',
              boxShadow: `0 0 0 5px rgba(212,175,55,0.08), 0 16px 60px rgba(0,0,0,0.55), 0 0 30px ${GOLD_GLOW}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, transparent, ${GOLD_BRIGHT}, transparent)`, opacity: 0.7 }} />
            <p style={{ fontSize: '92px', fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em', textShadow: `0 4px 20px rgba(0,0,0,0.4)` }}>
              {discountDisplay}% OFF
            </p>
            {displayAddress && (
              <p style={{ fontSize: '28px', color: 'rgba(255,255,255,0.75)', fontWeight: 500, marginTop: '8px', letterSpacing: '0.03em' }}>
                {displayAddress}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 3 · CARD CENTRAL — cinza + badge colorido */}
      <div className="absolute z-20" style={{ bottom: '230px', left: '52px', right: '52px' }}>
        <div
          style={{
            background: '#2a3142',
            border: `2.5px solid ${GOLD}`,
            borderRadius: '28px',
            overflow: 'hidden',
            boxShadow: `0 0 0 6px rgba(212,175,55,0.08), 0 24px 80px rgba(0,0,0,0.65), 0 0 48px ${GOLD_GLOW}`,
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent 0%, ${GOLD_BRIGHT} 50%, transparent 100%)` }} />

          <div style={{ display: 'flex', minHeight: '280px' }}>

            {/* Badge financiamento */}
            <div
              style={{
                flexShrink: 0,
                minWidth: '240px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <div className="absolute inset-0" style={{ background: financingBg }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.20) 0%, transparent 100%)' }} />
              <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.25)' }} />
              <div className="relative" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                {/* Fonte do imóvel — MAIOR e DESTACADA */}
                <span style={{ fontSize: '30px', fontWeight: 900, color: '#fff', letterSpacing: '0.02em', lineHeight: 1.2, display: 'block', marginBottom: '8px', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                  {propertySource}
                </span>
                {/* Divider */}
                <div style={{ width: '80%', height: '2px', background: 'rgba(255,255,255,0.4)', marginBottom: '10px' }} />
                {/* Linhas de financiamento */}
                {isCashOnly ? (
                  <>
                    <span style={{ fontSize: '34px', fontWeight: 900, color: '#fff', letterSpacing: '0.04em', lineHeight: 1.1, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>SOMENTE</span>
                    <span style={{ fontSize: '34px', fontWeight: 900, color: '#fff', letterSpacing: '0.04em', lineHeight: 1.1, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>À VISTA</span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '32px', fontWeight: 900, color: '#fff', letterSpacing: '0.04em', lineHeight: 1.1, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>ACEITA</span>
                    <span style={{ fontSize: '32px', fontWeight: 900, color: '#fff', letterSpacing: '0.04em', lineHeight: 1.1, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>FINANCIAMENTO</span>
                    <span style={{ fontSize: '28px', fontWeight: 700, color: 'rgba(255,255,255,0.95)', letterSpacing: '0.04em', lineHeight: 1.1, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>BANCÁRIO</span>
                  </>
                )}
              </div>
            </div>

            {/* Separador */}
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)', alignSelf: 'stretch', margin: '12px 0' }} />

            {/* Informações do imóvel */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px 24px', gap: '4px' }}>
              {/* Logo VDH */}
              <img src={logoBase64} alt="VDH" style={{ height: '46px', objectFit: 'contain', objectPosition: 'left', marginBottom: '8px' }} />

              {/* Nome do condomínio — DESTAQUE, primeira linha — alinhado com preço */}
              <p style={{ fontSize: '38px', fontWeight: 900, color: GOLD_BRIGHT, lineHeight: 1.1, letterSpacing: '-0.01em' }}>
                {title}
              </p>

              {/* Tipo do imóvel */}
              <p style={{ fontSize: '26px', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
                {propertyType}
                {data.bedrooms && data.bedrooms !== '' && data.bedrooms !== '0'
                  ? ` · ${data.bedrooms} quarto${Number(data.bedrooms) > 1 ? 's' : ''}`
                  : ''}
              </p>

              {/* Endereço completo automático */}
              {displayAddress && (
                <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.80)', lineHeight: 1.3 }}>
                  {displayAddress}
                </p>
              )}

              {/* Divider */}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.15)', margin: '6px 0' }} />

              {/* Preço de venda — DESTAQUE — alinhado com nome */}
              {price && (
                <p style={{ fontSize: '44px', fontWeight: 900, color: GOLD_BRIGHT, letterSpacing: '-0.01em', lineHeight: 1 }}>{price}</p>
              )}

              {/* Entrada a partir de — na mesma linha */}
              {entryFormatted && (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '20px', color: '#fff', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
                    Entrada a partir de
                  </span>
                  <span style={{ fontSize: '30px', fontWeight: 800, color: '#fff', lineHeight: 1, whiteSpace: 'nowrap' }}>
                    {entryFormatted}
                  </span>
                </div>
              )}

              {/* FGTS */}
              {acceptsFGTS && (
                <p style={{ fontSize: '22px', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>✓ Aceita FGTS</p>
              )}

              {/* CRECI */}
              <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.40)', marginTop: '2px' }}>VENDA DIRETA {data.creci}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 · CTA WHATSAPP */}
      <div className="absolute z-20 flex justify-center" style={{ bottom: '72px', left: '52px', right: '52px' }}>
        <div
          style={{
            background: `linear-gradient(135deg, #0f3318, #1a5228)`,
            border: `2.5px solid ${GOLD}`,
            borderRadius: '100px',
            padding: '30px 0',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '22px',
            boxShadow: `0 0 0 5px rgba(212,175,55,0.08), 0 12px 40px rgba(0,0,0,0.55), 0 0 32px ${GOLD_GLOW}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${GOLD_BRIGHT}, transparent)` }} />
          <svg width="50" height="50" viewBox="0 0 24 24" fill="#4ade80">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span style={{ fontSize: '48px', color: '#fff', fontWeight: 800, letterSpacing: '0.04em', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            Falar com o Corretor
          </span>
        </div>
      </div>
    </div>
  );
};
