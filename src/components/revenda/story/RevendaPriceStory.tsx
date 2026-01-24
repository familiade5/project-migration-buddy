import { RevendaPropertyData } from '@/types/revenda';
import { RevendaLogo, RevendaWatermark } from '../RevendaLogo';
import { Bed, Bath, Car, Maximize, MapPin } from 'lucide-react';

interface RevendaPriceStoryProps {
  data: RevendaPropertyData;
  photo: string | null;
}

export const RevendaPriceStory = ({ data, photo }: RevendaPriceStoryProps) => {
  const getLocationText = () => {
    const parts = [data.neighborhood, data.city, data.state].filter(Boolean);
    return parts.join(' • ');
  };

  return (
    <div 
      className="relative w-[1080px] h-[1920px] overflow-hidden"
      style={{ backgroundColor: '#fafafa' }}
    >
      {/* Top Photo - 40% */}
      <div className="absolute top-0 left-0 right-0 h-[40%] relative">
        {photo ? (
          <>
            <img 
              src={photo} 
              alt="Property"
              className="w-full h-full object-cover"
            />
            <RevendaWatermark position="top-right" size="md" />
          </>
        ) : (
          <div 
            className="w-full h-full"
            style={{ backgroundColor: '#e2e8f0' }}
          />
        )}
        
        {/* Bottom fade */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: 'linear-gradient(to top, #fafafa, transparent)',
          }}
        />
      </div>

      {/* Content */}
      <div className="absolute top-[38%] left-0 right-0 bottom-0 px-12 flex flex-col">
        {/* Property type badge */}
        <div className="flex justify-center mb-6">
          <div 
            className="px-6 py-2 rounded-full"
            style={{ backgroundColor: 'rgba(14,165,233,0.1)' }}
          >
            <span 
              className="text-sm font-medium uppercase tracking-widest"
              style={{ color: '#0ea5e9' }}
            >
              {data.type}
            </span>
          </div>
        </div>

        {/* Property Name */}
        <h2 
          className="font-display font-bold text-center leading-tight mb-4"
          style={{ fontSize: '48px', color: '#0f172a' }}
        >
          {data.propertyName || `${data.type} em ${data.neighborhood}`}
        </h2>

        {/* Location */}
        {getLocationText() && (
          <div className="flex items-center justify-center gap-2 mb-10">
            <MapPin className="w-5 h-5" style={{ color: '#94a3b8' }} />
            <span className="text-lg" style={{ color: '#64748b' }}>
              {getLocationText()}
            </span>
          </div>
        )}

        {/* Specs Grid */}
        <div 
          className="grid grid-cols-2 gap-6 p-8 rounded-2xl mb-10"
          style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
        >
          {data.bedrooms && (
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#f0f9ff' }}
              >
                <Bed className="w-7 h-7" style={{ color: '#0ea5e9' }} />
              </div>
              <div>
                <p className="text-2xl font-semibold" style={{ color: '#0f172a' }}>{data.bedrooms}</p>
                <p className="text-sm" style={{ color: '#64748b' }}>Quartos</p>
              </div>
            </div>
          )}
          {data.bathrooms && (
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#f0f9ff' }}
              >
                <Bath className="w-7 h-7" style={{ color: '#0ea5e9' }} />
              </div>
              <div>
                <p className="text-2xl font-semibold" style={{ color: '#0f172a' }}>{data.bathrooms}</p>
                <p className="text-sm" style={{ color: '#64748b' }}>Banheiros</p>
              </div>
            </div>
          )}
          {data.garageSpaces && (
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#f0f9ff' }}
              >
                <Car className="w-7 h-7" style={{ color: '#0ea5e9' }} />
              </div>
              <div>
                <p className="text-2xl font-semibold" style={{ color: '#0f172a' }}>{data.garageSpaces}</p>
                <p className="text-sm" style={{ color: '#64748b' }}>Vagas</p>
              </div>
            </div>
          )}
          {data.area && (
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#f0f9ff' }}
              >
                <Maximize className="w-7 h-7" style={{ color: '#0ea5e9' }} />
              </div>
              <div>
                <p className="text-2xl font-semibold" style={{ color: '#0f172a' }}>{data.area}</p>
                <p className="text-sm" style={{ color: '#64748b' }}>m² úteis</p>
              </div>
            </div>
          )}
        </div>

        {/* Price Box */}
        <div 
          className="p-10 rounded-2xl text-center flex-grow flex flex-col justify-center"
          style={{ 
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          }}
        >
          <p 
            className="text-lg font-medium uppercase tracking-widest mb-4"
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            Investimento
          </p>
          <p 
            className="font-display font-bold"
            style={{ fontSize: '64px', color: '#ffffff' }}
          >
            {data.price || 'Consulte'}
          </p>
          {data.condominiumFee && (
            <p 
              className="text-lg mt-4"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Condomínio: {data.condominiumFee}
            </p>
          )}
        </div>

        {/* Logo */}
        <div className="flex justify-center py-8">
          <RevendaLogo size="lg" />
        </div>
      </div>
    </div>
  );
};
