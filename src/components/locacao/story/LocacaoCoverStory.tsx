// Story slide 1: Cover - Introduction (no shadow at top)
import { LocacaoPropertyData } from '@/types/locacao';
import { LocacaoLogo } from '../LocacaoLogo';
import { MapPin } from 'lucide-react';

interface LocacaoCoverStoryProps {
  data: LocacaoPropertyData;
  photo: string | null;
}

export const LocacaoCoverStory = ({ data, photo }: LocacaoCoverStoryProps) => {
  const title = data.propertyName || data.type || 'Imóvel';

  return (
    <div 
      className="relative w-[1080px] h-[1920px] overflow-hidden"
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
              background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(17,24,39,0.7) 75%, rgba(17,24,39,0.98) 100%)'
            }}
          />
        </>
      )}

      {/* Logo - top left, larger */}
      <div className="absolute top-16 left-12">
        <LocacaoLogo size="xxl" variant="light" />
      </div>

      {/* Content at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-16 text-center">
        {/* Badge - larger */}
        <div 
          className="inline-block px-8 py-4 rounded-lg text-xl mb-8"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            color: '#ffffff',
          }}
        >
          Disponível para Locação
        </div>

        {/* Title - larger */}
        <h1 
          className="text-7xl font-semibold mb-8 leading-tight"
          style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
        >
          {title}
        </h1>

        {/* Location */}
        {data.neighborhood && (
          <div className="flex items-center justify-center gap-3 mb-24">
            <MapPin className="w-6 h-6" style={{ color: '#9ca3af' }} />
            <span className="text-2xl" style={{ color: '#d1d5db' }}>
              {data.neighborhood}{data.city ? `, ${data.city}` : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
