import { PropertyData } from '@/types/property';
import { Check, Sparkles, TrendingDown, Zap } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';
import { useState, useEffect } from 'react';

interface PostCoverProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostCover = ({ data, photo }: PostCoverProps) => {
  const [logoBase64, setLogoBase64] = useState<string>(logoVDH);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        setLogoBase64(canvas.toDataURL('image/jpeg'));
      }
    };
    img.src = logoVDH;
  }, []);

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
          <span className="text-white font-semibold" style={{ fontSize: '32px' }}>
            {[data.city, (data.state || '').trim().length > 2 ? (data.state || '').trim().slice(0, 2).toUpperCase() : data.state].filter(Boolean).join(' - ')}
          </span>
        </div>
      </div>

      {/* Logo VDH no topo direito - base64 para garantir export */}
      <div className="absolute z-20" style={{ top: '20px', right: '20px' }}>
        <div className="rounded-lg overflow-hidden shadow-2xl" style={{ background: 'rgba(0,0,0,0.55)', padding: '8px 16px' }}>
          <img 
            src={logoBase64} 
            alt="VDH" 
            className="object-contain"
            style={{ height: '72px' }}
          />
        </div>
      </div>

      {/* Rodapé */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#2a3142] z-10">
        <div className="flex items-stretch" style={{ minHeight: '200px' }}>

          {/* Badge financiamento - ocupa toda altura */}
          <div 
            className="flex-shrink-0 relative overflow-hidden flex flex-col items-center justify-center text-center"
            style={{ minWidth: '200px' }}
          >
            <div 
              className="absolute inset-0" 
              style={{ 
                background: data.acceptsFinancing 
                  ? 'linear-gradient(160deg, #15803d 0%, #22c55e 40%, #16a34a 100%)'
                  : 'linear-gradient(160deg, #c2410c 0%, #f97316 40%, #ea580c 100%)'
              }} 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            <div 
              className="absolute inset-0" 
              style={{ 
                boxShadow: data.acceptsFinancing 
                  ? 'inset 0 0 20px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.25)'
                  : 'inset 0 0 20px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.2)'
              }} 
            />
            <div className="relative flex flex-col items-center" style={{ padding: '16px 24px', gap: '6px' }}>
              <div className="flex items-center gap-2">
                {data.acceptsFinancing && <Check style={{ width: '22px', height: '22px', color: '#ffffff', flexShrink: 0 }} />}
                <span className="text-white font-black tracking-wide drop-shadow-md leading-tight text-center" style={{ fontSize: '26px' }}>
                  {data.acceptsFinancing ? <>ACEITA<br/>FINANCIAMENTO</> : <>SOMENTE<br/>À VISTA</>}
                </span>
              </div>
            </div>
          </div>

          {/* Separador vertical */}
          <div className="self-stretch w-px bg-white/20 flex-shrink-0 my-3" />

          {/* Informações do imóvel */}
          <div className="flex-1 flex flex-col justify-center" style={{ padding: '14px 18px', gap: '4px' }}>
            <p className="text-white font-bold truncate" style={{ fontSize: '26px' }}>
              {(data.propertyName && data.propertyName.trim()) || `${data.type || 'Casa'} - Ótima localização`}
            </p>
            <p className="text-white/80" style={{ fontSize: '20px' }}>
              {[data.neighborhood, data.city, (data.state || '').trim().length > 2 ? (data.state || '').trim().slice(0, 2).toUpperCase() : data.state]
                .filter(Boolean)
                .join(' - ')}
            </p>
            <p className="text-white/80" style={{ fontSize: '19px' }}>
              {propertySummary}
            </p>
            <p className="text-white/60" style={{ fontSize: '16px' }}>
              VENDA DIRETA HOJE {data.creci}
            </p>
          </div>

          {/* Separador vertical */}
          <div className="self-stretch w-px bg-white/20 flex-shrink-0 my-3" />

          {/* Valores e formas de pagamento */}
          <div className="flex-shrink-0 text-right flex flex-col justify-center" style={{ padding: '14px 20px', gap: '4px' }}>
            <p className="text-[#f5d485] font-bold" style={{ fontSize: '28px' }}>{data.minimumValue}</p>
            <p className="text-white/80" style={{ fontSize: '18px' }}>Formas de pagamento</p>
            <p className="text-white/80" style={{ fontSize: '18px' }}>Recursos próprios</p>
            {data.acceptsFGTS && (
              <p className="text-white/80" style={{ fontSize: '18px' }}>Aceita FGTS</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
