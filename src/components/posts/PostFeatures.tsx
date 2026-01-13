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
    
    // Primeiro: mostrar características do imóvel se disponíveis
    if (data.bedrooms && data.bedrooms !== '' && data.bedrooms !== '0') {
      features.push(`${data.bedrooms} quarto${Number(data.bedrooms) > 1 ? 's' : ''}`);
    }
    if (data.bathrooms && data.bathrooms !== '' && data.bathrooms !== '0') {
      features.push(`${data.bathrooms} banheiro${Number(data.bathrooms) > 1 ? 's' : ''}`);
    }
    if (data.area && data.area !== '') {
      features.push(`${data.area}m² de área útil`);
    }
    
    // Se ainda não tem 3 features, adiciona condições de pagamento
    if (features.length < 3) {
      if (data.hasEasyEntry) {
        features.push('Entrada facilitada e parcelada');
      } else if (data.canUseFGTS) {
        features.push('Use seu saldo do FGTS');
      } else if (data.acceptsFinancing) {
        features.push('Aprovação rápida de crédito');
      } else if (data.discount && parseFloat(data.discount.replace(',', '.')) > 30) {
        features.push('Desconto imperdível');
      }
    }
    
    // Adicionar features selecionadas do imóvel
    if (features.length < 3 && data.features.length > 0) {
      data.features.forEach(f => {
        if (features.length < 3) features.push(f);
      });
    }
    
    // Se ainda não tem nada, adiciona mensagens genéricas
    if (features.length === 0) {
      features.push('Oportunidade única');
      features.push('Condições especiais');
      features.push('Investimento seguro');
    }
    
    return features.slice(0, 3);
  };

  const highlightFeatures = getHighlightFeatures();

  return (
    <div className="post-template bg-[#1a1f2e] relative overflow-hidden">
      {/* Layout dividido - Texto à esquerda, foto à direita */}
      <div className="absolute inset-0 flex">
        {/* Painel de texto à esquerda */}
        <div className="w-[50%] h-full flex flex-col justify-center bg-[#2a3142]" style={{ padding: '80px' }}>
          {/* Marca d'água VDH sutil no fundo */}
          <div className="absolute opacity-5" style={{ top: '25%', left: '80px' }}>
            <p className="font-bold tracking-wider text-white" style={{ fontSize: '160px' }}>VDH</p>
          </div>
          
          <div className="relative z-10" style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
            {highlightFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-start"
                style={{ gap: '40px' }}
              >
                <div className="rounded bg-[#d4a44c] flex items-center justify-center flex-shrink-0" style={{ width: '80px', height: '80px', marginTop: '4px' }}>
                  <Check className="text-[#1a1f2e]" style={{ width: '50px', height: '50px' }} />
                </div>
                <span className="text-white font-semibold leading-tight" style={{ fontSize: '52px' }}>{feature}</span>
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
            <p className="text-white/15 font-bold tracking-wider" style={{ fontSize: '140px' }}>VDH</p>
          </div>
        </div>
      </div>

      {/* Logo VDH no canto inferior direito */}
      <div className="absolute z-10" style={{ bottom: '40px', right: '40px' }}>
        <img src={logoVDH} alt="VDH" className="rounded" style={{ height: '100px' }} />
      </div>
    </div>
  );
};
