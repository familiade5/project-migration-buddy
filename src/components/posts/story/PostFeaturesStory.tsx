import { PropertyData } from '@/types/property';
import { Check } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface PostFeaturesStoryProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostFeaturesStory = ({ data, photo }: PostFeaturesStoryProps) => {
  const getHighlightFeatures = () => {
    const features: string[] = [];
    
    if (data.hasEasyEntry) {
      features.push('Entrada facilitada e parcelada');
    } else {
      features.push('Condições especiais de pagamento');
    }
    
    if (data.canUseFGTS) {
      features.push('Use seu saldo do FGTS');
    } else {
      features.push('Financiamento com as melhores taxas');
    }
    
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
    <div className="post-template-story bg-[#1a1f2e] relative overflow-hidden">
      {/* Foto no topo - 55% da altura */}
      <div className="absolute top-0 left-0 right-0 h-[55%]">
        {photo ? (
          <div
            className="absolute inset-0 bg-cover bg-center brightness-110"
            style={{ backgroundImage: `url(${photo})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a3142] to-[#1a1f2e]" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white/15 text-6xl font-bold tracking-wider">VDH</p>
        </div>
      </div>

      {/* Painel de diferenciais na parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-[#2a3142] p-6 flex flex-col justify-center">
        {/* Marca d'água VDH sutil */}
        <div className="absolute top-4 right-4 opacity-5">
          <p className="text-4xl font-bold tracking-wider text-white">VDH</p>
        </div>
        
        <div className="relative z-10 space-y-5">
          {highlightFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded bg-[#d4a44c] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-5 h-5 text-[#1a1f2e]" />
              </div>
              <span className="text-white text-lg font-semibold leading-tight">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logo VDH */}
      <div className="absolute bottom-4 right-4 z-10">
        <img src={logoVDH} alt="VDH" className="h-10 w-auto rounded" />
      </div>
    </div>
  );
};
