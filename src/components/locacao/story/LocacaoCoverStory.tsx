// Story slide 1: Cover - Introduction
import { LocacaoPropertyData } from '@/types/locacao';
import { LocacaoWatermark } from '../LocacaoLogo';
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
      {/* Background Photo */}
      {photo && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${photo})` }}
          />
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(to bottom, rgba(17,24,39,0.4) 0%, rgba(17,24,39,0.6) 50%, rgba(17,24,39,0.95) 85%)'
            }}
          />
        </>
      )}

      {/* Logo */}
      <LocacaoWatermark position="top-left" size="md" variant="light" />

      {/* Content at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-12 text-center">
        {/* Badge */}
        <div 
          className="inline-block px-5 py-2 rounded-md text-lg mb-6"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: '#ffffff',
          }}
        >
          Para Locação
        </div>

        {/* Title */}
        <h1 
          className="text-6xl font-semibold mb-6 leading-tight"
          style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
        >
          {title}
        </h1>

        {/* Location */}
        {data.neighborhood && (
          <div className="flex items-center justify-center gap-2 mb-20">
            <MapPin className="w-5 h-5" style={{ color: '#9ca3af' }} />
            <span className="text-xl" style={{ color: '#d1d5db' }}>
              {data.neighborhood}{data.city ? `, ${data.city}` : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
