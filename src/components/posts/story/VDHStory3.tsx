import { PropertyData } from '@/types/property';
import logoVDH from '@/assets/logo-vdh.jpg';

interface VDHStory3Props {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const VDHStory3 = ({ data, photo }: VDHStory3Props) => {
  // Texto de financiamento com cores
  const getFinancingText = () => {
    if (data.acceptsFinancing) {
      return { text: 'Aceita Financiamento', color: '#22c55e' }; // verde
    }
    return { text: 'Somente à Vista', color: '#f97316' }; // laranja
  };

  const financing = getFinancingText();

  return (
    <div className="post-template-story bg-[#2a3444] relative overflow-hidden">
      {/* Foto na parte superior - 45% */}
      <div className="absolute top-0 left-0 right-0 h-[45%]">
        {photo ? (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${photo})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#4a5565] to-[#3a4555]" />
        )}
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2a3444]" />
      </div>

      {/* Marca d'água VDH */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <p className="text-white font-bold tracking-wider" style={{ fontSize: '250px' }}>VDH</p>
      </div>

      {/* Conteúdo de preço e condições */}
      <div className="absolute z-10" style={{ top: '48%', left: '50px', right: '50px' }}>
        {/* Comparação de valores - destaque principal */}
        <div className="bg-[#1a2433]/95 backdrop-blur rounded-2xl mb-6" style={{ padding: '40px' }}>
          {/* Valor de avaliação (riscado) */}
          {data.evaluationValue && (
            <div className="text-center mb-4">
              <p className="text-white/60 mb-1" style={{ fontSize: '24px' }}>Valor de avaliação</p>
              <p className="text-white/50 line-through" style={{ fontSize: '48px' }}>
                {data.evaluationValue}
              </p>
            </div>
          )}
          
          {/* Valor de venda - grande destaque */}
          <div className="text-center">
            <p className="text-[#22c55e] font-medium mb-2" style={{ fontSize: '28px' }}>Valor de Venda</p>
            <p className="text-[#f5d485] font-bold" style={{ fontSize: '72px' }}>
              {data.minimumValue || 'R$ --'}
            </p>
          </div>

          {/* Economia */}
          {data.discount && parseFloat(data.discount.replace(',', '.')) > 0 && (
            <div className="text-center mt-4 bg-[#e87722] rounded-xl" style={{ padding: '15px 30px' }}>
              <p className="text-white font-bold" style={{ fontSize: '32px' }}>
                Economia de {data.discount}%
              </p>
            </div>
          )}
        </div>

        {/* Card de condições */}
        <div className="bg-[#3a4555]/90 backdrop-blur rounded-2xl" style={{ padding: '30px 40px' }}>
          {/* Financiamento */}
          <div className="flex items-center justify-between mb-5 pb-5 border-b border-white/10">
            <span className="text-white/80" style={{ fontSize: '28px' }}>Pagamento</span>
            <span className="font-bold" style={{ fontSize: '28px', color: financing.color }}>
              {financing.text}
            </span>
          </div>

          {/* FGTS */}
          <div className="flex items-center justify-between">
            <span className="text-white/80" style={{ fontSize: '28px' }}>FGTS</span>
            <span 
              className="font-bold" 
              style={{ 
                fontSize: '28px', 
                color: data.acceptsFGTS ? '#22c55e' : '#f97316' 
              }}
            >
              {data.acceptsFGTS ? 'Pode usar FGTS' : 'Não aceita FGTS'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer com logo */}
      <div className="absolute bottom-0 left-0 right-0 z-10" style={{ padding: '40px' }}>
        <div className="flex items-center justify-center">
          <img 
            src={logoVDH} 
            alt="VDH" 
            className="object-contain rounded"
            style={{ height: '70px' }}
          />
        </div>
      </div>
    </div>
  );
};
