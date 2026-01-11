import { PropertyData } from '@/types/property';
import { Check } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface PostFeaturesProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostFeatures = ({ data, photo }: PostFeaturesProps) => {
  // Features dinâmicas baseadas nas opções
  const getHighlightFeatures = () => {
    const features: string[] = [];
    
    // Entrada facilitada ou alternativa
    if (data.hasEasyEntry) {
      features.push('Entrada facilitada e parcelada');
    } else {
      features.push('Condições especiais de pagamento');
    }
    
    // FGTS ou alternativa
    if (data.canUseFGTS) {
      features.push('Use seu saldo do FGTS');
    } else {
      features.push('Financiamento com as melhores taxas');
    }
    
    // Adicionar mais um diferencial baseado nos dados
    if (data.acceptsFinancing) {
      features.push('Aprovação rápida de crédito');
    } else if (data.discount && parseFloat(data.discount.replace(',', '.')) > 30) {
      features.push('Desconto imperdível');
    } else {
      features.push('Oportunidade única de investimento');
    }
    
    return features;
  };

  const highlightFeatures = getHighlightFeatures();

  return (
    <div className="post-template bg-[#1a1f2e] relative overflow-hidden">
      {/* Layout dividido - Texto à esquerda, foto à direita */}
      <div className="absolute inset-0 flex">
        {/* Painel de texto à esquerda */}
        <div className="w-[50%] h-full flex flex-col justify-center p-8 bg-[#2a3142]">
          {/* Marca d'água VDH sutil no fundo */}
          <div className="absolute top-1/4 left-8 opacity-5">
            <p className="text-6xl font-bold tracking-wider text-white">VDH</p>
          </div>
          
          <div className="relative z-10 space-y-6">
            {highlightFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded bg-[#d4a44c] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-5 h-5 text-[#1a1f2e]" />
                </div>
                <span className="text-white text-xl font-semibold leading-tight">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Foto à direita */}
        <div className="w-[50%] h-full relative">
          {photo ? (
            <div
              className="absolute inset-0 bg-cover bg-center brightness-110"
              style={{ backgroundImage: `url(${photo})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2a3142] to-[#1a1f2e]" />
          )}
          {/* Marca d'água VDH sutil */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/15 text-5xl font-bold tracking-wider">VDH</p>
          </div>
        </div>
      </div>

      {/* Logo VDH no canto inferior direito */}
      <div className="absolute bottom-4 right-4 z-10">
        <img src={logoVDH} alt="VDH" className="h-10 w-auto rounded" />
      </div>
    </div>
  );
};
