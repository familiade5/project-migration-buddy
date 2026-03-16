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
    if (data.acceptsFinancing) return { text: 'Aceita Financiamento', color: '#22c55e' };
    return { text: 'Somente à Vista', color: '#f97316' };
  };

  const financing = getFinancingText();

  const PHOTO_HEIGHT = '62%';
  const GOLD = '#D4AF37';

  return (
    <div className="post-template-story bg-[#2a3444] relative overflow-hidden">

      {/* ── BLOCO DE IMAGENS — 62% do topo ─────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: PHOTO_HEIGHT,
        }}
      >
        {/* Imagem principal esquerda — 63% */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 'calc(63% - 2px)',
            bottom: 0,
            overflow: 'hidden',
          }}
        >
          {p0 ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${p0})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#4a5565] to-[#3a4555]" />
          )}
        </div>

        {/* Separador dourado vertical */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            bottom: '12px',
            left: 'calc(63% - 2px)',
            width: '4px',
            background: `linear-gradient(180deg, transparent 0%, ${GOLD} 30%, ${GOLD} 70%, transparent 100%)`,
            zIndex: 10,
          }}
        />

        {/* Imagem secundária direita — 37% */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 'calc(37% - 2px)',
            bottom: 0,
            overflow: 'hidden',
          }}
        >
          {p1 ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${p1})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#3a4555] to-[#2a3444]" />
          )}

          {/* Overlay leve no canto da imagem menor para profundidade */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(0,0,0,0.18) 0%, transparent 60%)',
            }}
          />
        </div>

        {/* Linha dourada inferior separando imagem do conteúdo */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, transparent 0%, ${GOLD} 30%, #F0D060 60%, transparent 100%)`,
            zIndex: 10,
          }}
        />
      </div>

      {/* Marca d'água VDH */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5" style={{ top: PHOTO_HEIGHT }}>
        <p className="text-white font-bold tracking-wider" style={{ fontSize: '220px' }}>VDH</p>
      </div>

      {/* ── PAINEL DE INFORMAÇÕES — 38% inferior ────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: PHOTO_HEIGHT,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 50px 48px',
        }}
      >
        {/* Bloco preços */}
        <div className="bg-[#1a2433]/95 backdrop-blur rounded-2xl mb-5" style={{ padding: '28px 36px' }}>
          {data.evaluationValue && (
            <div className="text-center mb-3">
              <p className="text-white/60 mb-1" style={{ fontSize: '22px' }}>Valor de avaliação</p>
              <p className="text-white/50 line-through" style={{ fontSize: '42px' }}>
                {data.evaluationValue}
              </p>
            </div>
          )}

          <div className="text-center">
            <p className="text-[#22c55e] font-medium mb-1" style={{ fontSize: '24px' }}>Valor de Venda</p>
            <p className="text-[#f5d485] font-bold" style={{ fontSize: '64px', lineHeight: 1 }}>
              {data.minimumValue || 'R$ --'}
            </p>
          </div>

          {data.discount && parseFloat(data.discount.replace(',', '.')) > 0 && (
            <div className="text-center mt-3 bg-[#e87722] rounded-xl" style={{ padding: '12px 24px' }}>
              <p className="text-white font-bold" style={{ fontSize: '28px' }}>
                Economia de {data.discount}%
              </p>
            </div>
          )}
        </div>

        {/* Card condições */}
        <div className="bg-[#3a4555]/90 backdrop-blur rounded-2xl" style={{ padding: '22px 36px' }}>
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
            <span className="text-white/80" style={{ fontSize: '26px' }}>Pagamento</span>
            <span className="font-bold" style={{ fontSize: '26px', color: financing.color }}>
              {financing.text}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/80" style={{ fontSize: '26px' }}>FGTS</span>
            <span
              className="font-bold"
              style={{ fontSize: '26px', color: data.acceptsFGTS ? '#22c55e' : '#f97316' }}
            >
              {data.acceptsFGTS ? 'Pode usar FGTS' : 'Não aceita FGTS'}
            </span>
          </div>
        </div>

        {/* Footer logo */}
        <div className="flex items-center justify-center mt-auto">
          <img
            src={logoVDH}
            alt="VDH"
            className="object-contain rounded"
            style={{ height: '52px' }}
          />
        </div>
      </div>

    </div>
  );
};
