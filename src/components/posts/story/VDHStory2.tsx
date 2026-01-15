import { PropertyData } from '@/types/property';
import logoVDH from '@/assets/logo-vdh.jpg';

interface VDHStory2Props {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const VDHStory2 = ({ data, photo, photos }: VDHStory2Props) => {
  // Pegar fotos para o layout
  const getPhoto = (index: number) => {
    if (photos && photos[index]) return photos[index];
    if (photo) return photo;
    return null;
  };

  const mainPhoto = getPhoto(0);
  const secondPhoto = getPhoto(1);
  const thirdPhoto = getPhoto(2);

  return (
    <div className="post-template-story bg-[#2a3444] relative overflow-hidden">
      {/* Layout de fotos moderno - formato angular/dinâmico */}
      <div className="absolute inset-0">
        {/* Foto principal grande - diagonal */}
        <div 
          className="absolute bg-cover bg-center"
          style={{ 
            top: '0',
            left: '0',
            right: '0',
            height: '55%',
            clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)'
          }}
        >
          {mainPhoto ? (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${mainPhoto})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#4a5565] to-[#3a4555]" />
          )}
        </div>

        {/* Duas fotos menores na parte inferior */}
        <div 
          className="absolute flex gap-3"
          style={{ 
            bottom: '220px',
            left: '40px',
            right: '40px',
            height: '35%'
          }}
        >
          {/* Foto esquerda - formato retangular com cantos arredondados */}
          <div 
            className="relative overflow-hidden rounded-2xl flex-1"
            style={{ 
              clipPath: 'polygon(0 15%, 100% 0, 100% 100%, 0 100%)'
            }}
          >
            {secondPhoto ? (
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${secondPhoto})` }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#4a5565] to-[#3a4555]" />
            )}
          </div>

          {/* Foto direita */}
          <div 
            className="relative overflow-hidden rounded-2xl flex-1"
            style={{ 
              clipPath: 'polygon(0 0, 100% 15%, 100% 100%, 0 100%)'
            }}
          >
            {thirdPhoto ? (
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${thirdPhoto})` }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#4a5565] to-[#3a4555]" />
            )}
          </div>
        </div>
      </div>

      {/* Marca d'água VDH */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <p className="text-white font-bold tracking-wider" style={{ fontSize: '300px' }}>VDH</p>
      </div>

      {/* Benefícios principais no topo */}
      <div className="absolute z-20 flex flex-wrap gap-3" style={{ top: '50px', left: '40px', right: '40px' }}>
        {data.acceptsFinancing && (
          <div className="bg-[#22c55e]/90 backdrop-blur rounded-full flex items-center gap-2" style={{ padding: '12px 24px' }}>
            <span className="text-white font-semibold" style={{ fontSize: '22px' }}>✓ Aceita Financiamento</span>
          </div>
        )}
        {data.acceptsFGTS && (
          <div className="bg-[#3b82f6]/90 backdrop-blur rounded-full flex items-center gap-2" style={{ padding: '12px 24px' }}>
            <span className="text-white font-semibold" style={{ fontSize: '22px' }}>✓ Usa FGTS</span>
          </div>
        )}
        {data.bedrooms && data.bedrooms !== '0' && (
          <div className="bg-white/20 backdrop-blur rounded-full flex items-center gap-2" style={{ padding: '12px 24px' }}>
            <span className="text-white font-semibold" style={{ fontSize: '22px' }}>{data.bedrooms} Quartos</span>
          </div>
        )}
        {(data.area || data.areaTotal) && (
          <div className="bg-white/20 backdrop-blur rounded-full flex items-center gap-2" style={{ padding: '12px 24px' }}>
            <span className="text-white font-semibold" style={{ fontSize: '22px' }}>{data.area || data.areaTotal} m²</span>
          </div>
        )}
      </div>

      {/* Footer com localização e logo */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#2a3444] z-10" style={{ padding: '40px' }}>
        <div className="flex items-center justify-between">
          {/* Localização */}
          <div>
            {data.propertyName && (
              <p className="text-white font-semibold mb-1" style={{ fontSize: '32px' }}>
                {data.propertyName}
              </p>
            )}
            <p className="text-white/80" style={{ fontSize: '28px' }}>
              {data.neighborhood && `${data.neighborhood}, `}
              {data.city} - {data.state}
            </p>
          </div>
          
          {/* Logo VDH */}
          <img 
            src={logoVDH} 
            alt="VDH" 
            className="object-contain rounded"
            style={{ height: '70px' }}
          />
        </div>
      </div>
    </div>
  );
};
