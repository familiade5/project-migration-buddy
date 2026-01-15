import { PropertyData } from '@/types/property';
import { MapPin, Bed, Grid2x2, Wallet } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface VDHStory1Props {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const VDHStory1 = ({ data, photo }: VDHStory1Props) => {
  // Formatar quartos
  const getBedroomsText = () => {
    if (!data.bedrooms || data.bedrooms === '' || data.bedrooms === '0') return '';
    return `${data.bedrooms} Quartos`;
  };

  // Formatar localização
  const getLocation = () => {
    const parts = [];
    if (data.neighborhood) parts.push(data.neighborhood);
    if (data.city) parts.push(data.city);
    if (data.state) parts.push(data.state);
    return parts.join(' – ');
  };

  // Formatar área
  const getArea = () => {
    const area = data.area || data.areaTotal || data.areaPrivativa;
    if (!area) return '';
    return `${area} m²`;
  };

  return (
    <div className="post-template-story relative overflow-hidden">
      {/* Foto do imóvel como fundo completo */}
      {photo ? (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${photo})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#3a4555] via-[#2a3444] to-[#1a2433]" />
      )}
      
      {/* Overlay gradiente escuro nas bordas para legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Localização no topo com pin laranja */}
      <div className="absolute z-10 flex items-center gap-3" style={{ top: '60px', left: '50px' }}>
        <MapPin className="text-[#e87722] flex-shrink-0" style={{ width: '40px', height: '40px' }} />
        <span className="text-white font-medium drop-shadow-lg" style={{ fontSize: '36px' }}>
          {getLocation()}
        </span>
      </div>

      {/* Card principal com tipo do imóvel e badge Imóvel Caixa */}
      <div className="absolute z-10" style={{ top: '140px', left: '50px', right: '50px' }}>
        <div className="flex items-stretch gap-3">
          {/* Tipo do imóvel e quartos */}
          <div className="bg-[#3a4555]/95 backdrop-blur-sm rounded-xl flex-1" style={{ padding: '30px 40px' }}>
            <p className="text-white font-semibold leading-tight" style={{ fontSize: '48px' }}>
              {data.type || 'Apartamento'}
            </p>
            {getBedroomsText() && (
              <p className="text-white font-semibold" style={{ fontSize: '48px' }}>
                {getBedroomsText()}
              </p>
            )}
          </div>
          
          {/* Badge Imóvel Caixa */}
          <div className="relative overflow-hidden rounded-xl shadow-xl flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f5a623] via-[#e87722] to-[#d4660f]" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent h-1/2" />
            <div className="relative flex flex-col justify-center h-full" style={{ padding: '20px 35px' }}>
              <p className="text-white font-semibold leading-tight" style={{ fontSize: '32px' }}>Imóvel</p>
              <p className="text-white font-black leading-none" style={{ fontSize: '56px' }}>Caixa</p>
            </div>
          </div>
        </div>

        {/* Info bar abaixo do card */}
        <div className="flex items-center justify-start gap-8 mt-4" style={{ paddingLeft: '10px' }}>
          {/* Quartos */}
          {data.bedrooms && data.bedrooms !== '' && data.bedrooms !== '0' && (
            <div className="flex items-center gap-3">
              <Bed className="text-white/80" style={{ width: '36px', height: '36px' }} />
              <span className="text-white font-medium" style={{ fontSize: '28px' }}>
                {data.bedrooms} quartos
              </span>
            </div>
          )}
          
          {/* Área */}
          {getArea() && (
            <div className="flex items-center gap-3">
              <Grid2x2 className="text-white/80" style={{ width: '36px', height: '36px' }} />
              <span className="text-white font-medium" style={{ fontSize: '28px' }}>
                {getArea()}
              </span>
            </div>
          )}
          
          {/* FGTS */}
          {data.acceptsFGTS && (
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded px-2 py-1">
                <span className="text-white font-bold" style={{ fontSize: '20px' }}>FGC</span>
              </div>
              <span className="text-white font-medium" style={{ fontSize: '28px' }}>
                Aceita FGTS
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Badge de desconto no canto superior direito */}
      {data.discount && parseFloat(data.discount.replace(',', '.')) > 0 && (
        <div className="absolute z-20" style={{ top: '60px', right: '50px' }}>
          <div className="bg-[#e87722] rounded-2xl shadow-2xl text-center" style={{ padding: '25px 35px' }}>
            <p className="text-white font-black" style={{ fontSize: '64px', lineHeight: '1' }}>
              {data.discount}%
            </p>
            <p className="text-white/90 font-bold" style={{ fontSize: '28px' }}>DESCONTO</p>
          </div>
        </div>
      )}

      {/* Logo VDH na parte inferior */}
      <div className="absolute z-10 flex items-center justify-center" style={{ bottom: '60px', left: '0', right: '0' }}>
        <div className="flex items-center gap-4">
          <img 
            src={logoVDH} 
            alt="VDH" 
            className="object-contain rounded"
            style={{ height: '80px' }}
          />
          <span className="text-white font-semibold tracking-wide" style={{ fontSize: '28px' }}>Venda Direta Hoje</span>
        </div>
      </div>
    </div>
  );
};
