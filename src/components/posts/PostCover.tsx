import { PropertyData } from '@/types/property';
import { MapPin, Home, Check } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface PostCoverProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostCover = ({ data, photo }: PostCoverProps) => {
  // Formatar resumo do imóvel
  const propertySummary = `${data.type} de ${data.bedrooms} quartos${data.garageSpaces ? ` e ${data.garageSpaces} vaga${Number(data.garageSpaces) > 1 ? 's' : ''} de garagem` : ''}`;

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
        <p className="text-white/15 text-7xl font-bold tracking-wider">VDH</p>
      </div>

      {/* Header Verde Escuro - com cantos arredondados */}
      <div className="absolute top-2 left-2 z-10">
        <div className="bg-[#1e3a2f] px-4 py-1 rounded-t-lg">
          <p className="text-white text-[10px] font-medium leading-tight">Entrada a partir de</p>
          <p className="text-white text-2xl font-bold tracking-tight leading-none">
            {data.entryValue || 'R$ 7.500'}
          </p>
        </div>
        
        {/* Subtítulo com tipo e cidade */}
        <div className="bg-[#2d4a3f] px-4 py-0.5 flex items-center gap-2 rounded-b-lg">
          <span className="text-white text-[10px] font-medium">
            {data.type} de {data.bedrooms} quartos
          </span>
          <span className="text-white/50">|</span>
          <span className="text-white text-[10px]">{data.city}</span>
        </div>
      </div>

      {/* Badge Imóvel Caixa - design moderno */}
      <div className="absolute top-2 right-2 z-20">
        <div className="relative overflow-hidden rounded-lg shadow-2xl">
          {/* Gradiente de fundo dourado */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#f5d485] via-[#d4a44c] to-[#b8862d]" />
          {/* Brilho superior */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent h-1/2" />
          {/* Conteúdo */}
          <div className="relative px-4 py-2">
            <p className="text-[#2a1810] text-[10px] font-semibold leading-tight drop-shadow-sm">{data.propertySource?.split(' ')[0] || 'Imóvel'}</p>
            <p className="text-[#1a0f08] text-2xl font-black leading-none tracking-tight drop-shadow-sm">{data.propertySource?.split(' ')[1] || 'Caixa'}</p>
          </div>
        </div>
      </div>

      {/* Rodapé - mesmo cinza da logo/outras imagens */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#2a3142] z-10">
        {/* Linha superior com logo e valores */}
        <div className="flex border-b border-white/10">
          {/* Logo VDH */}
          <div className="w-[24%] py-1 px-1.5 flex items-center justify-center border-r border-white/10">
            <img 
              src={logoVDH} 
              alt="VDH - Venda Direta Hoje" 
              className="h-7 w-auto object-contain"
            />
          </div>
          
          {/* Valores - alinhados à direita */}
          <div className="flex-1 py-0.5 px-3 flex flex-col items-end justify-center">
            <div className="flex items-baseline gap-1.5">
              <span className="text-white/80 text-[9px] font-semibold">Valor de Avaliação:</span>
              <span className="text-[#f5d485] text-[11px] font-bold">{data.evaluationValue}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-white/80 text-[9px] font-semibold">Valor Mínimo de Venda:</span>
              <span className="text-[#f5d485] text-[11px] font-bold">{data.minimumValue}</span>
            </div>
            {/* Desconto destacado */}
            <div className="mt-0.5 bg-gradient-to-r from-[#dc2626] to-[#ef4444] px-2 py-0.5 rounded-full">
              <span className="text-white text-[9px] font-bold tracking-wide">🔥 DESCONTO DE {data.discount}%</span>
            </div>
          </div>
        </div>

        {/* Linha inferior com tag e localização */}
        <div className="flex items-start px-1.5 py-1 gap-1.5">
          {/* Tags FGTS e Financiamento */}
          <div className="flex flex-col gap-0.5">
            {data.acceptsFGTS && (
              <div className="flex items-center gap-1 bg-[#1e3a2f] px-1.5 py-0.5 rounded">
                <Check className="w-2 h-2 text-[#4ade80]" />
                <span className="text-white text-[9px] font-medium">Aceita FGTS</span>
              </div>
            )}
            {data.acceptsFinancing && (
              <div className="flex items-center gap-1 bg-[#1e3a2f] px-1.5 py-0.5 rounded">
                <Check className="w-2 h-2 text-[#4ade80]" />
                <span className="text-white text-[9px] font-medium">Aceita Financiamento</span>
              </div>
            )}
          </div>

          {/* Informações de localização - alinhadas à direita */}
          <div className="flex-1 flex flex-col items-end text-right">
            <div className="flex items-center gap-1 text-white/90">
              <MapPin className="w-2.5 h-2.5 text-[#f5d485] flex-shrink-0" />
              <span className="text-[9px] font-medium">{data.neighborhood} {data.city} • {data.state}</span>
            </div>
            <div className="flex items-center gap-1 text-white/90">
              <Home className="w-2.5 h-2.5 text-[#f5d485] flex-shrink-0" />
              <span className="text-[9px]">{propertySummary}</span>
            </div>
            <p className="text-white/60 text-[9px]">Venda Direta Hoje • {data.creci}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
