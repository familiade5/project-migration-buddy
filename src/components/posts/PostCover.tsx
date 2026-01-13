import { PropertyData } from '@/types/property';
import { MapPin, Home, Check, Sparkles, TrendingDown, Zap } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface PostCoverProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostCover = ({ data, photo }: PostCoverProps) => {
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
    <div className="post-template relative overflow-hidden">
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
        <p className="text-white/15 font-bold tracking-wider" style={{ fontSize: '180px' }}>VDH</p>
      </div>

      {/* Header - Entrada ou Texto Chamativo */}
      <div className="absolute z-10" style={{ top: '20px', left: '20px' }}>
        {data.hasEasyEntry && data.entryValue ? (
          // Com entrada facilitada
          <div className="bg-[#1e3a2f] rounded-t-lg" style={{ padding: '12px 40px' }}>
            <p className="text-white font-medium leading-tight" style={{ fontSize: '28px' }}>Entrada a partir de</p>
            <p className="text-white font-bold tracking-tight leading-none" style={{ fontSize: '72px' }}>
              {data.entryValue}
            </p>
          </div>
        ) : (
          // Sem entrada - Texto chamativo
          <div className="bg-gradient-to-r from-[#1e3a2f] to-[#2d5a4f] rounded-t-lg" style={{ padding: '12px 40px' }}>
            <div className="flex items-center gap-3">
              <NoEntryIcon className="text-[#f5d485]" style={{ width: '28px', height: '28px' }} />
              <p className="text-[#f5d485] font-medium leading-tight" style={{ fontSize: '28px' }}>{noEntryContent.title}</p>
            </div>
            <p className="text-white font-bold tracking-tight leading-none" style={{ fontSize: '72px' }}>
              {noEntryContent.subtitle}
            </p>
          </div>
        )}
        
        {/* Subtítulo com tipo e cidade */}
        <div className="bg-[#2d4a3f] flex items-center rounded-b-lg" style={{ padding: '8px 40px', gap: '20px' }}>
          <span className="text-white font-medium" style={{ fontSize: '28px' }}>
            {data.bedrooms && data.bedrooms !== '' && data.bedrooms !== '0' 
              ? `${data.type} de ${data.bedrooms} quarto${Number(data.bedrooms) > 1 ? 's' : ''}` 
              : data.type}
          </span>
          <span className="text-white/50">|</span>
          <span className="text-white" style={{ fontSize: '28px' }}>{data.city}</span>
        </div>
      </div>

      {/* Badge Imóvel Caixa - design moderno */}
      <div className="absolute z-20" style={{ top: '20px', right: '20px' }}>
        <div className="relative overflow-hidden rounded-lg shadow-2xl">
          {/* Gradiente de fundo dourado */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#f5d485] via-[#d4a44c] to-[#b8862d]" />
          {/* Brilho superior */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent h-1/2" />
          {/* Conteúdo */}
          <div className="relative" style={{ padding: '20px 40px' }}>
            <p className="text-[#2a1810] font-semibold leading-tight drop-shadow-sm" style={{ fontSize: '28px' }}>{data.propertySource?.split(' ')[0] || 'Imóvel'}</p>
            <p className="text-[#1a0f08] font-black leading-none tracking-tight drop-shadow-sm" style={{ fontSize: '72px' }}>{data.propertySource?.split(' ')[1] || 'Caixa'}</p>
          </div>
        </div>
      </div>

      {/* Rodapé reorganizado */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#2a3142] z-10" style={{ padding: '16px 24px' }}>
        {/* Linha principal com logo, valores e tags */}
        <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
          {/* Logo VDH */}
          <div className="flex-shrink-0">
            <img 
              src={logoVDH} 
              alt="VDH" 
              className="object-contain"
              style={{ height: '70px' }}
            />
          </div>
          
          {/* Valores centralizados */}
          <div className="flex items-center" style={{ gap: '32px' }}>
            <div className="text-center">
              <p className="text-white/70" style={{ fontSize: '20px' }}>Avaliação</p>
              <p className="text-[#f5d485] font-bold" style={{ fontSize: '36px' }}>{data.evaluationValue}</p>
            </div>
            <div className="text-center">
              <p className="text-white/70" style={{ fontSize: '20px' }}>Mínimo</p>
              <p className="text-[#f5d485] font-bold" style={{ fontSize: '36px' }}>{data.minimumValue}</p>
            </div>
            {data.discount && (
              <div className="bg-gradient-to-r from-[#dc2626] to-[#ef4444] rounded-lg text-center" style={{ padding: '8px 20px' }}>
                <p className="text-white/80" style={{ fontSize: '16px' }}>Desconto</p>
                <p className="text-white font-bold" style={{ fontSize: '32px' }}>🔥 {data.discount}%</p>
              </div>
            )}
          </div>

          {/* Tags FGTS/Financiamento */}
          <div className="flex flex-col flex-shrink-0" style={{ gap: '6px' }}>
            {data.acceptsFGTS && (
              <div className="flex items-center bg-[#1e3a2f] rounded-lg" style={{ gap: '8px', padding: '8px 16px' }}>
                <Check className="text-[#4ade80]" style={{ width: '20px', height: '20px' }} />
                <span className="text-white font-medium" style={{ fontSize: '22px' }}>Aceita FGTS</span>
              </div>
            )}
            <div className={`flex items-center rounded-lg ${data.acceptsFinancing ? 'bg-[#1e3a2f]' : 'bg-[#4a2c2c]'}`} style={{ gap: '8px', padding: '8px 16px' }}>
              <Check className={data.acceptsFinancing ? 'text-[#4ade80]' : 'text-[#f87171]'} style={{ width: '20px', height: '20px' }} />
              <span className="text-white font-medium" style={{ fontSize: '22px' }}>
                {data.acceptsFinancing ? 'Aceita Financiamento' : 'Sem Financiamento'}
              </span>
            </div>
          </div>
        </div>

        {/* Linha de localização */}
        <div className="flex items-center justify-between border-t border-white/10" style={{ paddingTop: '12px' }}>
          <div className="flex items-center" style={{ gap: '24px' }}>
            <div className="flex items-center text-white/90" style={{ gap: '10px' }}>
              <MapPin className="text-[#f5d485] flex-shrink-0" style={{ width: '24px', height: '24px' }} />
              <span className="font-medium" style={{ fontSize: '24px' }}>{displayAddress}</span>
            </div>
          </div>
          <div className="flex items-center" style={{ gap: '24px' }}>
            <div className="flex items-center text-white/90" style={{ gap: '10px' }}>
              <Home className="text-[#f5d485] flex-shrink-0" style={{ width: '24px', height: '24px' }} />
              <span style={{ fontSize: '24px' }}>{propertySummary}</span>
            </div>
            <p className="text-white/50" style={{ fontSize: '20px' }}>VDH • {data.creci}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
