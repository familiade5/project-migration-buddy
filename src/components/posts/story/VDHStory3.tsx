import { PropertyData } from '@/types/property';
import logoVDH from '@/assets/logo-vdh.jpg';

interface VDHStory3Props {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const VDHStory3 = ({ data, photo, photos }: VDHStory3Props) => {
  const getPhoto = (index: number) => {
    if (photos && photos[index]) return photos[index];
    if (photo) return photo;
    return null;
  };

  const p0 = getPhoto(0);
  const p1 = getPhoto(1);

  const getFinancingText = () => {
    if (data.acceptsFinancing) return { text: 'Aceita Financiamento', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' };
    return { text: 'Somente à Vista', color: '#f97316', bg: 'rgba(249,115,22,0.12)' };
  };

  const financing = getFinancingText();
  const GOLD = '#D4AF37';

  return (
    <div className="post-template-story relative overflow-hidden" style={{ background: '#0d1420' }}>

      {/* ── BLOCO DE FOTOS — exatamente 65% do topo ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '65%' }}>

        {/* Foto 1 — ocupa tudo mas com corte diagonal na base direita */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: 'polygon(0 0, 100% 0, 100% 72%, 0 100%)',
            overflow: 'hidden',
          }}
        >
          {p0 ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${p0})`, transform: 'scale(1.04)' }}
            />
          ) : (
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #2a3a55, #1a2535)' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.5) 100%)' }} />
        </div>

        {/* Foto 2 — corte diagonal oposto no topo esquerdo */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: 'polygon(0 36%, 100% 0, 100% 100%, 0 100%)',
            overflow: 'hidden',
          }}
        >
          {p1 ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${p1})`, transform: 'scale(1.04)' }}
            />
          ) : (
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a2535, #0d1420)' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)' }} />
        </div>

        {/* Faixa dourada diagonal entre as fotos */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {/* Linha principal dourada */}
          <div style={{
            position: 'absolute',
            top: '53%',
            left: '-10%',
            right: '-10%',
            height: '3px',
            background: `linear-gradient(90deg, transparent 0%, ${GOLD} 20%, #F0D870 50%, ${GOLD} 80%, transparent 100%)`,
            transform: 'rotate(-17deg)',
            boxShadow: `0 0 16px 4px rgba(212,175,55,0.4)`,
          }} />
          {/* Linha secundária sutil */}
          <div style={{
            position: 'absolute',
            top: 'calc(53% + 8px)',
            left: '-10%',
            right: '-10%',
            height: '1px',
            background: `linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.35) 20%, rgba(212,175,55,0.5) 50%, rgba(212,175,55,0.35) 80%, transparent 100%)`,
            transform: 'rotate(-17deg)',
          }} />
        </div>

        {/* Gradiente de transição suave para o painel */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '30%',
            background: 'linear-gradient(to bottom, transparent, #0d1420)',
            zIndex: 5,
          }}
        />
      </div>

      {/* ── PAINEL DE INFORMAÇÕES — 35% inferior ── */}
      <div
        style={{
          position: 'absolute',
          top: '65%',
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 44px 44px',
          zIndex: 20,
        }}
      >
        {/* Card de preço */}
        <div
          style={{
            background: 'rgba(10,16,28,0.92)',
            border: `1px solid rgba(212,175,55,0.3)`,
            borderRadius: '20px',
            padding: '20px 32px 18px',
            marginBottom: '14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          {data.evaluationValue && (
            <p style={{ fontSize: '19px', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through', textAlign: 'center', marginBottom: '4px' }}>
              {data.evaluationValue}
            </p>
          )}
          <p style={{ fontSize: '18px', color: GOLD, textAlign: 'center', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 500 }}>
            Valor de Venda
          </p>
          <p style={{ fontSize: '58px', fontWeight: 800, color: '#ffffff', textAlign: 'center', lineHeight: 1, textShadow: `0 0 30px rgba(212,175,55,0.25)` }}>
            {data.minimumValue || 'R$ --'}
          </p>
          {data.discount && parseFloat(data.discount.replace(',', '.')) > 0 && (
            <div style={{ marginTop: '12px', background: 'linear-gradient(135deg, #e87722, #f59e0b)', borderRadius: '12px', padding: '8px 20px', textAlign: 'center' }}>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '22px' }}>Economia de {data.discount}%</p>
            </div>
          )}
        </div>

        {/* Pills lado a lado */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '18px' }}>
          <div style={{ flex: 1, background: financing.bg, border: `1px solid ${financing.color}44`, borderRadius: '14px', padding: '12px 14px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: '3px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Pagamento</p>
            <p style={{ fontSize: '18px', fontWeight: 700, color: financing.color, lineHeight: 1.2 }}>{financing.text}</p>
          </div>
          <div style={{ flex: 1, background: data.acceptsFGTS ? 'rgba(34,197,94,0.12)' : 'rgba(249,115,22,0.12)', border: `1px solid ${data.acceptsFGTS ? '#22c55e' : '#f97316'}44`, borderRadius: '14px', padding: '12px 14px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: '3px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>FGTS</p>
            <p style={{ fontSize: '18px', fontWeight: 700, color: data.acceptsFGTS ? '#22c55e' : '#f97316', lineHeight: 1.2 }}>{data.acceptsFGTS ? 'Pode usar FGTS' : 'Não aceita FGTS'}</p>
          </div>
        </div>

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto' }}>
          <img src={logoVDH} alt="VDH" style={{ height: '44px', objectFit: 'contain', borderRadius: '6px' }} />
        </div>
      </div>

    </div>
  );
};
