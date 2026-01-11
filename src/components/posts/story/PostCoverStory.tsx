import { PropertyData } from '@/types/property';
import { MapPin, Home, Check } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface PostCoverStoryProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostCoverStory = ({ data, photo }: PostCoverStoryProps) => {
  const propertySummary = `${data.type} de ${data.bedrooms} quartos${data.garageSpaces ? ` e ${data.garageSpaces} vaga${Number(data.garageSpaces) > 1 ? 's' : ''} de garagem` : ''}`;

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
        <p className="text-white/15 text-8xl font-bold tracking-wider">VDH</p>
      </div>

      {/* Header Verde Escuro - topo */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-[#1e3a2f] px-5 py-2 rounded-t-xl">
          <p className="text-white text-xs font-medium leading-tight">Entrada a partir de</p>
          <p className="text-white text-3xl font-bold tracking-tight leading-none">
            {data.entryValue || 'R$ 7.500'}
          </p>
        </div>
        
        {/* Subtítulo com tipo e cidade */}
        <div className="bg-[#2d4a3f] px-5 py-1 flex items-center gap-2 rounded-b-xl">
          <span className="text-white text-xs font-medium">
            {data.type} de {data.bedrooms} quartos
          </span>
          <span className="text-white/50">|</span>
          <span className="text-white text-xs">{data.city}</span>
        </div>
      </div>

      {/* Badge Imóvel Caixa */}
      <div className="absolute top-28 right-4 z-20">
        <div className="relative overflow-hidden rounded-lg shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f5d485] via-[#d4a44c] to-[#b8862d]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent h-1/2" />
          <div className="relative px-4 py-2">
            <p className="text-[#2a1810] text-xs font-semibold leading-tight drop-shadow-sm">{data.propertySource?.split(' ')[0] || 'Imóvel'}</p>
            <p className="text-[#1a0f08] text-2xl font-black leading-none tracking-tight drop-shadow-sm">{data.propertySource?.split(' ')[1] || 'Caixa'}</p>
          </div>
        </div>
      </div>

      {/* Rodapé expandido para story */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#2a3142] z-10">
        {/* Logo VDH */}
        <div className="flex justify-center py-3 border-b border-white/10">
          <img 
            src={logoVDH} 
            alt="VDH - Venda Direta Hoje" 
            className="h-10 w-auto object-contain"
          />
        </div>
        
        {/* Valores */}
        <div className="py-3 px-4 flex flex-col items-center gap-1 border-b border-white/10">
          <div className="flex items-baseline gap-2">
            <span className="text-white/80 text-xs font-semibold">Valor de Avaliação:</span>
            <span className="text-[#f5d485] text-sm font-bold">{data.evaluationValue}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-white/80 text-xs font-semibold">Valor Mínimo de Venda:</span>
            <span className="text-[#f5d485] text-sm font-bold">{data.minimumValue}</span>
          </div>
          {/* Desconto destacado */}
          <div className="mt-1 bg-gradient-to-r from-[#dc2626] to-[#ef4444] px-4 py-1 rounded-full">
            <span className="text-white text-sm font-bold tracking-wide">🔥 DESCONTO DE {data.discount}%</span>
          </div>
        </div>

        {/* Tags e localização */}
        <div className="px-4 py-3 space-y-2">
          {/* Tags FGTS e Financiamento */}
          <div className="flex justify-center gap-2">
            {data.acceptsFGTS && (
              <div className="flex items-center gap-1 bg-[#1e3a2f] px-2 py-1 rounded">
                <Check className="w-3 h-3 text-[#4ade80]" />
                <span className="text-white text-xs font-medium">Aceita FGTS</span>
              </div>
            )}
            {data.acceptsFinancing && (
              <div className="flex items-center gap-1 bg-[#1e3a2f] px-2 py-1 rounded">
                <Check className="w-3 h-3 text-[#4ade80]" />
                <span className="text-white text-xs font-medium">Aceita Financiamento</span>
              </div>
            )}
          </div>

          {/* Informações de localização */}
          <div className="flex flex-col items-center text-center gap-0.5">
            <div className="flex items-center gap-1 text-white/90">
              <MapPin className="w-3 h-3 text-[#f5d485] flex-shrink-0" />
              <span className="text-xs font-medium">{data.neighborhood} {data.city} • {data.state}</span>
            </div>
            <div className="flex items-center gap-1 text-white/90">
              <Home className="w-3 h-3 text-[#f5d485] flex-shrink-0" />
              <span className="text-xs">{propertySummary}</span>
            </div>
            <p className="text-white/60 text-xs">Venda Direta Hoje • {data.creci}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
