// Feed slide 1: Cover - Clean, professional intro (no shadow at top)
import { LocacaoPropertyData } from '@/types/locacao';
import { LocacaoLogo } from '../LocacaoLogo';
import { MapPin, Bed, Bath, Maximize } from 'lucide-react';

interface LocacaoCoverFeedProps {
  data: LocacaoPropertyData;
  photo: string | null;
}

export const LocacaoCoverFeed = ({ data, photo }: LocacaoCoverFeedProps) => {
  const title = data.propertyName || `${data.type} para Locação`;
  const location = data.neighborhood 
    ? `${data.neighborhood}${data.city ? `, ${data.city}` : ''}`
    : 'Localização';

  return (
    <div 
      className="relative w-[1080px] h-[1080px] overflow-hidden"
      style={{ backgroundColor: '#1f2937' }}
    >
      {/* Background Photo - full bleed, clean */}
      {photo && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${photo})` }}
          />
          {/* Gradient only at bottom where text is */}
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(17,24,39,0.6) 70%, rgba(17,24,39,0.95) 100%)'
            }}
          />
        </>
      )}

      {/* Logo - top left, matching Revenda+ size */}
      <div className="absolute top-10 left-10">
        <LocacaoLogo size="xxl" variant="light" />
      </div>

      {/* Badge - top right, solid gray box like "Imóvel Caixa" */}
      <div className="absolute z-20" style={{ top: '20px', right: '20px' }}>
        <div className="relative overflow-hidden rounded-lg shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4b5563] via-[#374151] to-[#1f2937]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent h-1/2" />
          <div className="relative text-center" style={{ padding: '16px 28px' }}>
            <p className="text-white font-semibold leading-tight" style={{ fontSize: '20px' }}>Disponível para</p>
            <p className="text-white font-black leading-none tracking-tight" style={{ fontSize: '42px' }}>Locação</p>
          </div>
        </div>
      </div>

      {/* Content at bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-12 pb-12">

        {/* Title - large, editorial */}
        <h1 
          className="font-bold leading-[0.95] mb-6"
          style={{ 
            fontSize: '72px',
            color: '#ffffff',
            fontFamily: 'Georgia, serif',
            textShadow: '0 4px 30px rgba(0,0,0,0.5)',
          }}
        >
          {title}
        </h1>

        {/* Location */}
        <div className="flex items-center gap-3 mb-8">
          <MapPin className="w-6 h-6" style={{ color: '#9ca3af' }} />
          <span 
            className="text-xl font-light tracking-wide"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            {location}
          </span>
        </div>

        {/* Specs row */}
        <div 
          className="flex items-center gap-8 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
        >
          {data.bedrooms && (
            <div className="flex items-center gap-3">
              <Bed className="w-6 h-6" style={{ color: '#9ca3af' }} />
              <span className="text-lg font-light" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {data.bedrooms} quartos
              </span>
            </div>
          )}
          {data.bathrooms && (
            <div className="flex items-center gap-3">
              <Bath className="w-6 h-6" style={{ color: '#9ca3af' }} />
              <span className="text-lg font-light" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {data.bathrooms} banheiros
              </span>
            </div>
          )}
          {data.area && (
            <div className="flex items-center gap-3">
              <Maximize className="w-6 h-6" style={{ color: '#9ca3af' }} />
              <span className="text-lg font-light" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {data.area} m²
              </span>
            </div>
          )}
          
          {/* Rent Price */}
          {data.rentPrice && (
            <div className="ml-auto text-right">
              <p 
                className="font-bold"
                style={{ fontSize: '32px', color: '#ffffff' }}
              >
                {data.rentPrice}
              </p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                /mês
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
