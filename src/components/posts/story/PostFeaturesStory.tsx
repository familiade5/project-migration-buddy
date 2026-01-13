import { PropertyData } from '@/types/property';
import { Check } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface PostFeaturesStoryProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostFeaturesStory = ({ data, photo }: PostFeaturesStoryProps) => {
  // Features dinâmicas baseadas nas opções - sempre mostra 3 itens
  const getHighlightFeatures = () => {
    const features: string[] = [];
    
    // Primeiro: mostrar características do imóvel se disponíveis
    if (data.bedrooms && data.bedrooms !== '' && data.bedrooms !== '0') {
      features.push(`${data.bedrooms} quarto${Number(data.bedrooms) > 1 ? 's' : ''} espaçoso${Number(data.bedrooms) > 1 ? 's' : ''}`);
    }
    if (data.bathrooms && data.bathrooms !== '' && data.bathrooms !== '0') {
      features.push(`${data.bathrooms} banheiro${Number(data.bathrooms) > 1 ? 's' : ''} completo${Number(data.bathrooms) > 1 ? 's' : ''}`);
    }
    if (data.area && data.area !== '') {
      features.push(`${data.area}m² de área útil`);
    }
    
    // Adiciona condições de pagamento se relevantes
    if (features.length < 3 && data.hasEasyEntry) {
      features.push('Entrada facilitada e parcelada');
    }
    if (features.length < 3 && data.canUseFGTS) {
      features.push('Use seu saldo do FGTS');
    }
    if (features.length < 3 && data.acceptsFinancing) {
      features.push('Financiamento facilitado');
    }
    if (features.length < 3 && data.discount && parseFloat(data.discount.replace(',', '.')) > 30) {
      features.push(`${data.discount}% de desconto`);
    }
    
    // Adicionar features selecionadas do imóvel
    if (features.length < 3 && data.features.length > 0) {
      data.features.forEach(f => {
        if (features.length < 3) features.push(f);
      });
    }
    
    // Fallback: textos de venda atraentes
    const sellingPoints = [
      'Realize o sonho da casa própria',
      'Oportunidade única de investimento',
      'Abaixo do valor de mercado',
      'Documentação regularizada',
      'Pronto para financiar',
    ];
    
    let sellingIndex = 0;
    while (features.length < 3 && sellingIndex < sellingPoints.length) {
      features.push(sellingPoints[sellingIndex]);
      sellingIndex++;
    }
    
    return features.slice(0, 3);
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
