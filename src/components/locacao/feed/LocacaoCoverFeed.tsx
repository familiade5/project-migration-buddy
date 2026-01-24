// Feed slide 1: Cover - Clean, professional intro
import { LocacaoPropertyData } from '@/types/locacao';
import { LocacaoWatermark } from '../LocacaoLogo';
import { MapPin } from 'lucide-react';

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
      {/* Background Photo with subtle overlay */}
      {photo && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${photo})`,
            }}
          />
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(to bottom, rgba(17,24,39,0.5) 0%, rgba(17,24,39,0.7) 50%, rgba(17,24,39,0.9) 100%)'
            }}
          />
        </>
      )}

      {/* Logo - top left, subtle */}
      <LocacaoWatermark position="top-left" size="sm" variant="light" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-16">
        {/* Badge - simple, no color */}
        <div 
          className="inline-block px-4 py-2 rounded-md text-sm font-medium mb-6"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: '#ffffff',
          }}
        >
          Disponível para Locação
        </div>

        {/* Title */}
        <h1 
          className="text-6xl font-semibold leading-tight mb-4"
          style={{ 
            color: '#ffffff',
            fontFamily: 'Georgia, serif',
          }}
        >
          {title}
        </h1>

        {/* Location */}
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5" style={{ color: '#9ca3af' }} />
          <span 
            className="text-xl"
            style={{ color: '#d1d5db' }}
          >
            {location}
          </span>
        </div>
      </div>
    </div>
  );
};
