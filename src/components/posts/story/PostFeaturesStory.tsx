import { PropertyData } from '@/types/property';
import { Check } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface PostFeaturesStoryProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostFeaturesStory = ({ data, photo }: PostFeaturesStoryProps) => {
  // SLIDE 2 STORY - Foco: BENEFÍCIOS E CONDIÇÕES (Gatilhos: Facilidade, Oportunidade)
  const getHighlightFeatures = () => {
    const features: string[] = [];
    
    // Prioridade 1: Condições de pagamento (maior gatilho de conversão)
    if (data.discount && parseFloat(data.discount.replace(',', '.')) > 0) {
      const discountValue = parseFloat(data.discount.replace(',', '.'));
      if (discountValue >= 40) {
        features.push(`Economia de ${data.discount}% garantida`);
      } else if (discountValue >= 20) {
        features.push(`${data.discount}% abaixo da avaliação`);
      } else {
        features.push(`Desconto real de ${data.discount}%`);
      }
    }
    
    if (features.length < 3 && data.canUseFGTS) {
      features.push('FGTS aceito como entrada');
    }
    
    if (features.length < 3 && data.hasEasyEntry) {
      features.push('Entrada parcelada em até 48x');
    }
    
    if (features.length < 3 && data.acceptsFinancing) {
      features.push('Financiamento em até 420 meses');
    }
    
    // Prioridade 2: Características transformadas em benefícios
    if (features.length < 3 && data.area && data.area !== '' && data.area !== '0') {
      const areaNum = parseFloat(data.area);
      if (areaNum >= 200) {
        features.push('Amplo espaço para toda família');
      } else if (areaNum >= 100) {
        features.push('Metragem ideal para seu conforto');
      } else {
        features.push('Planta otimizada e funcional');
      }
    }
    
    if (features.length < 3 && data.garageSpaces && data.garageSpaces !== '' && data.garageSpaces !== '0') {
      features.push('Segurança para seu veículo');
    }
    
    // Prioridade 3: Features selecionadas
    if (features.length < 3 && data.features.length > 0) {
      data.features.forEach(f => {
        if (features.length < 3) features.push(f);
      });
    }
    
    // Fallback: Gatilhos de conversão
    const conversionTriggers = [
      'Documentação 100% regularizada',
      'Pronto para escriturar hoje',
      'Sem burocracia para financiar',
      'Oportunidade exclusiva de leilão',
      'Valor abaixo do mercado',
    ];
    
    let triggerIndex = 0;
    while (features.length < 3 && triggerIndex < conversionTriggers.length) {
      features.push(conversionTriggers[triggerIndex]);
      triggerIndex++;
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
