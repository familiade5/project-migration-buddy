// Story slide: Details - Quick specs
import { LocacaoPropertyData } from '@/types/locacao';
import { LocacaoLogoBarStory } from '../LocacaoLogo';
import { Bed, Bath, Car, Maximize } from 'lucide-react';

interface LocacaoDetailsStoryProps {
  data: LocacaoPropertyData;
  photo: string | null;
}

export const LocacaoDetailsStory = ({ data, photo }: LocacaoDetailsStoryProps) => {
  const specs = [
    { icon: Bed, label: 'Quartos', value: data.bedrooms || '—' },
    { icon: Bath, label: 'Banheiros', value: data.bathrooms || '—' },
    { icon: Car, label: 'Vagas', value: data.garageSpaces || '—' },
    { icon: Maximize, label: 'Área', value: data.area ? `${data.area}m²` : '—' },
  ];

  return (
    <div 
      className="relative w-[1080px] h-[1920px] overflow-hidden"
      style={{ backgroundColor: '#1f2937' }}
    >
      {/* Background Photo - no shadows, clean */}
      {photo && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${photo})` }}
          />
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(17,24,39,0.88)' }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-12">
        <h2 
          className="text-5xl font-semibold text-center mb-20"
          style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
        >
          Características
        </h2>

        {/* Specs */}
        <div className="w-full max-w-lg space-y-6">
          {specs.map((spec, i) => (
            <div 
              key={i}
              className="flex items-center gap-6 p-8 rounded-2xl"
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <spec.icon className="w-8 h-8" style={{ color: '#d1d5db' }} />
              </div>
              <div>
                <p className="text-xl" style={{ color: '#9ca3af' }}>{spec.label}</p>
                <p className="text-4xl font-semibold" style={{ color: '#ffffff' }}>{spec.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex gap-4 mt-16">
          {data.furnished && (
            <span 
              className="px-6 py-3 rounded-full text-lg"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#d1d5db' }}
            >
              Mobiliado
            </span>
          )}
          {data.acceptsPets && (
            <span 
              className="px-6 py-3 rounded-full text-lg"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#d1d5db' }}
            >
              Aceita Pets
            </span>
          )}
        </div>
      </div>

      {/* Logo */}
      <LocacaoLogoBarStory />
    </div>
  );
};
