import { PropertyData } from '@/types/property';
import { MapPin, Home, Check, Sparkles, Zap, TrendingDown } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface PostCoverStoryProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostCoverStory = ({ data, photo }: PostCoverStoryProps) => {
  // Formatar resumo do imóvel (só mostra quartos/garagem se especificado)
  const getPropertySummary = () => {
    let summary = data.type;
    if (data.bedrooms) {
      summary += ` de ${data.bedrooms} quarto${Number(data.bedrooms) > 1 ? 's' : ''}`;
    }
    if (data.garageSpaces) {
      summary += ` e ${data.garageSpaces} vaga${Number(data.garageSpaces) > 1 ? 's' : ''} de garagem`;
    }
    return summary;
  };
  const propertySummary = getPropertySummary();
  
  // Endereço completo ou fallback para bairro + cidade
  const displayAddress = data.fullAddress || (data.street ? `${data.street}${data.number ? `, ${data.number}` : ''} - ${data.neighborhood}, ${data.city} - ${data.state}` : `${data.neighborhood} ${data.city} • ${data.state}`);

  // Textos chamativos para quando não há entrada
  const noEntryTexts = [
    { title: 'Oportunidade Única', subtitle: 'Abaixo do Mercado', icon: Sparkles },
    { title: 'Desconto Imperdível', subtitle: `${data.discount}% OFF`, icon: TrendingDown },
    { title: 'Preço Exclusivo', subtitle: 'Venda Direta', icon: Zap },
  ];
  
  // Seleciona texto baseado no desconto
  const getNoEntryContent = () => {
    if (data.discount && parseFloat(data.discount) >= 30) {
      return noEntryTexts[1]; // Desconto Imperdível
    }
    return noEntryTexts[0]; // Oportunidade Única
  };

  const noEntryContent = getNoEntryContent();
  const NoEntryIcon = noEntryContent.icon;

  return (
    <div className="post-template-story relative overflow-hidden">
      {/* Foto do imóvel como fundo completo */}
      {photo ? (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${photo})` }}
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[#3a3f4a] via-[#2a2f38] to-[#1a1f28]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
        </>
      )}
      
      {/* Marca d'água VDH central */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
        <p className="text-white/15 font-bold tracking-wider" style={{ fontSize: '200px' }}>VDH</p>
      </div>

      {/* Header - Entrada ou Texto Chamativo */}
      <div className="absolute z-10" style={{ top: '40px', left: '40px', right: '40px' }}>
        {data.hasEasyEntry && data.entryValue ? (
          // Com entrada facilitada
          <div className="bg-[#1e3a2f] rounded-t-xl" style={{ padding: '20px 50px' }}>
            <p className="text-white font-medium leading-tight" style={{ fontSize: '32px' }}>Entrada a partir de</p>
            <p className="text-white font-bold tracking-tight leading-none" style={{ fontSize: '80px' }}>
              {data.entryValue}
            </p>
          </div>
        ) : (
          // Sem entrada - Texto chamativo
          <div className="bg-gradient-to-r from-[#1e3a2f] to-[#2d5a4f] rounded-t-xl" style={{ padding: '20px 50px' }}>
            <div className="flex items-center gap-3">
              <NoEntryIcon className="text-[#f5d485]" style={{ width: '36px', height: '36px' }} />
              <p className="text-[#f5d485] font-medium leading-tight" style={{ fontSize: '32px' }}>{noEntryContent.title}</p>
            </div>
            <p className="text-white font-bold tracking-tight leading-none" style={{ fontSize: '80px' }}>
              {noEntryContent.subtitle}
            </p>
          </div>
        )}
        
        {/* Subtítulo com tipo e cidade */}
        <div className="bg-[#2d4a3f] flex items-center rounded-b-xl" style={{ padding: '16px 50px', gap: '20px' }}>
          <span className="text-white font-medium" style={{ fontSize: '32px' }}>
            {data.bedrooms ? `${data.type} de ${data.bedrooms} quartos` : data.type}
          </span>
          <span className="text-white/50">|</span>
          <span className="text-white" style={{ fontSize: '32px' }}>{data.city}</span>
        </div>
      </div>

      {/* Badge Imóvel Caixa */}
      <div className="absolute z-20" style={{ top: '280px', right: '40px' }}>
        <div className="relative overflow-hidden rounded-lg shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f5d485] via-[#d4a44c] to-[#b8862d]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent h-1/2" />
          <div className="relative" style={{ padding: '24px 48px' }}>
            <p className="text-[#2a1810] font-semibold leading-tight drop-shadow-sm" style={{ fontSize: '32px' }}>{data.propertySource?.split(' ')[0] || 'Imóvel'}</p>
            <p className="text-[#1a0f08] font-black leading-none tracking-tight drop-shadow-sm" style={{ fontSize: '72px' }}>{data.propertySource?.split(' ')[1] || 'Caixa'}</p>
          </div>
        </div>
      </div>

      {/* Rodapé expandido para story */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#2a3142] z-10">
        {/* Logo VDH */}
        <div className="flex justify-center border-b border-white/10" style={{ padding: '30px' }}>
          <img 
            src={logoVDH} 
            alt="VDH - Venda Direta Hoje" 
            className="object-contain"
            style={{ height: '100px' }}
          />
        </div>
        
        {/* Valores */}
        <div className="flex flex-col items-center border-b border-white/10" style={{ padding: '30px 40px', gap: '12px' }}>
          <div className="flex items-baseline" style={{ gap: '20px' }}>
            <span className="text-white/80 font-semibold" style={{ fontSize: '32px' }}>Valor de Avaliação:</span>
            <span className="text-[#f5d485] font-bold" style={{ fontSize: '38px' }}>{data.evaluationValue}</span>
          </div>
          <div className="flex items-baseline" style={{ gap: '20px' }}>
            <span className="text-white/80 font-semibold" style={{ fontSize: '32px' }}>Valor Mínimo de Venda:</span>
            <span className="text-[#f5d485] font-bold" style={{ fontSize: '38px' }}>{data.minimumValue}</span>
          </div>
          {/* Desconto destacado */}
          <div className="bg-gradient-to-r from-[#dc2626] to-[#ef4444] rounded-full" style={{ marginTop: '12px', padding: '10px 40px' }}>
            <span className="text-white font-bold tracking-wide" style={{ fontSize: '36px' }}>🔥 DESCONTO DE {data.discount}%</span>
          </div>
        </div>

        {/* Tags e localização */}
        <div style={{ padding: '30px 40px' }}>
          {/* Tags FGTS e Financiamento */}
          <div className="flex justify-center" style={{ gap: '20px', marginBottom: '20px' }}>
            {data.acceptsFGTS && (
              <div className="flex items-center bg-[#1e3a2f] rounded" style={{ gap: '12px', padding: '12px 24px' }}>
                <Check className="text-[#4ade80]" style={{ width: '28px', height: '28px' }} />
                <span className="text-white font-medium" style={{ fontSize: '28px' }}>Aceita FGTS</span>
              </div>
            )}
            <div className={`flex items-center rounded ${data.acceptsFinancing ? 'bg-[#1e3a2f]' : 'bg-[#4a2c2c]'}`} style={{ gap: '12px', padding: '12px 24px' }}>
              <Check className={data.acceptsFinancing ? 'text-[#4ade80]' : 'text-[#f87171]'} style={{ width: '28px', height: '28px' }} />
              <span className="text-white font-medium" style={{ fontSize: '28px' }}>
                {data.acceptsFinancing ? 'Aceita Financiamento' : 'Não Aceita Financiamento'}
              </span>
            </div>
          </div>

          {/* Informações de localização */}
          <div className="flex flex-col items-center text-center" style={{ gap: '8px' }}>
            <div className="flex items-center text-white/90" style={{ gap: '12px' }}>
              <MapPin className="text-[#f5d485] flex-shrink-0" style={{ width: '28px', height: '28px' }} />
              <span className="font-medium" style={{ fontSize: '28px' }}>{displayAddress}</span>
            </div>
            <div className="flex items-center text-white/90" style={{ gap: '12px' }}>
              <Home className="text-[#f5d485] flex-shrink-0" style={{ width: '28px', height: '28px' }} />
              <span style={{ fontSize: '28px' }}>{propertySummary}</span>
            </div>
            <p className="text-white/60" style={{ fontSize: '26px' }}>Venda Direta Hoje • {data.creci}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
