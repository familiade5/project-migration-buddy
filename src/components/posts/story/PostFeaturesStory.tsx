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
          <p className="text-white/15 font-bold tracking-wider" style={{ fontSize: '180px' }}>VDH</p>
        </div>
      </div>

      {/* Painel de diferenciais na parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-[#2a3142] flex flex-col justify-center" style={{ padding: '60px' }}>
        {/* Marca d'água VDH sutil */}
        <div className="absolute opacity-5" style={{ top: '40px', right: '40px' }}>
          <p className="font-bold tracking-wider text-white" style={{ fontSize: '120px' }}>VDH</p>
        </div>
        
        <div className="relative z-10" style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
          {highlightFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-start"
              style={{ gap: '40px' }}
            >
              <div className="rounded bg-[#d4a44c] flex items-center justify-center flex-shrink-0" style={{ width: '80px', height: '80px', marginTop: '4px' }}>
                <Check className="text-[#1a1f2e]" style={{ width: '50px', height: '50px' }} />
              </div>
              <span className="text-white font-semibold leading-tight" style={{ fontSize: '48px' }}>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logo VDH */}
      <div className="absolute z-10" style={{ bottom: '40px', right: '40px' }}>
        <img src={logoVDH} alt="VDH" className="rounded" style={{ height: '100px' }} />
      </div>
    </div>
  );
};
