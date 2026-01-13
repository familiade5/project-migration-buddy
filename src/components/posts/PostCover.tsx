import { PropertyData } from '@/types/property';
import { MapPin, Home, Check, Sparkles, TrendingDown, Zap } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface PostCoverProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostCover = ({ data, photo }: PostCoverProps) => {
  // Formatar resumo do imóvel
  const propertySummary = `${data.type} de ${data.bedrooms} quartos${data.garageSpaces ? ` e ${data.garageSpaces} vaga${Number(data.garageSpaces) > 1 ? 's' : ''} de garagem` : ''}`;
  
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
            {data.type} de {data.bedrooms} quartos
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

      {/* Rodapé - mesmo cinza da logo/outras imagens */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#2a3142] z-10">
        {/* Linha superior com logo e valores */}
        <div className="flex border-b border-white/10">
          {/* Logo VDH */}
          <div className="w-[24%] flex items-center justify-center border-r border-white/10" style={{ padding: '16px' }}>
            <img 
              src={logoVDH} 
              alt="VDH - Venda Direta Hoje" 
              className="object-contain"
              style={{ height: '80px' }}
            />
          </div>
          
          {/* Valores - alinhados à direita */}
          <div className="flex-1 flex flex-col items-end justify-center" style={{ padding: '12px 40px' }}>
            <div className="flex items-baseline" style={{ gap: '16px' }}>
              <span className="text-white/80 font-semibold" style={{ fontSize: '26px' }}>Valor de Avaliação:</span>
              <span className="text-[#f5d485] font-bold" style={{ fontSize: '32px' }}>{data.evaluationValue}</span>
            </div>
            <div className="flex items-baseline" style={{ gap: '16px' }}>
              <span className="text-white/80 font-semibold" style={{ fontSize: '26px' }}>Valor Mínimo de Venda:</span>
              <span className="text-[#f5d485] font-bold" style={{ fontSize: '32px' }}>{data.minimumValue}</span>
            </div>
            {/* Desconto destacado */}
            <div className="bg-gradient-to-r from-[#dc2626] to-[#ef4444] rounded-full" style={{ marginTop: '8px', padding: '6px 24px' }}>
              <span className="text-white font-bold tracking-wide" style={{ fontSize: '26px' }}>🔥 DESCONTO DE {data.discount}%</span>
            </div>
          </div>
        </div>

        {/* Linha inferior com tag e localização */}
        <div className="flex items-start" style={{ padding: '16px 20px', gap: '20px' }}>
          {/* Tags FGTS e Financiamento */}
          <div className="flex flex-col" style={{ gap: '8px' }}>
            {data.acceptsFGTS && (
              <div className="flex items-center bg-[#1e3a2f] rounded" style={{ gap: '12px', padding: '8px 20px' }}>
                <Check className="text-[#4ade80]" style={{ width: '24px', height: '24px' }} />
                <span className="text-white font-medium" style={{ fontSize: '26px' }}>Aceita FGTS</span>
              </div>
            )}
            <div className={`flex items-center rounded ${data.acceptsFinancing ? 'bg-[#1e3a2f]' : 'bg-[#4a2c2c]'}`} style={{ gap: '12px', padding: '8px 20px' }}>
              <Check className={data.acceptsFinancing ? 'text-[#4ade80]' : 'text-[#f87171]'} style={{ width: '24px', height: '24px' }} />
              <span className="text-white font-medium" style={{ fontSize: '26px' }}>
                {data.acceptsFinancing ? 'Aceita Financiamento' : 'Não Aceita Financiamento'}
              </span>
            </div>
          </div>

          {/* Informações de localização - alinhadas à direita */}
          <div className="flex-1 flex flex-col items-end text-right">
            <div className="flex items-center text-white/90" style={{ gap: '12px' }}>
              <MapPin className="text-[#f5d485] flex-shrink-0" style={{ width: '28px', height: '28px' }} />
              <span className="font-medium" style={{ fontSize: '26px' }}>{displayAddress}</span>
            </div>
            <div className="flex items-center text-white/90" style={{ gap: '12px' }}>
              <Home className="text-[#f5d485] flex-shrink-0" style={{ width: '28px', height: '28px' }} />
              <span style={{ fontSize: '26px' }}>{propertySummary}</span>
            </div>
            <p className="text-white/60" style={{ fontSize: '24px' }}>Venda Direta Hoje • {data.creci}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
