// Story slide 2: Details - Quick specs
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
      {/* Background Photo */}
      {photo && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${photo})` }}
          />
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(17,24,39,0.85)' }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-12">
        <h2 
          className="text-4xl font-semibold text-center mb-16"
          style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
        >
          Características
        </h2>

        {/* Specs */}
        <div className="w-full max-w-lg space-y-6">
          {specs.map((spec, i) => (
            <div 
              key={i}
              className="flex items-center gap-6 p-6 rounded-xl"
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div 
                className="w-14 h-14 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <spec.icon className="w-7 h-7" style={{ color: '#d1d5db' }} />
              </div>
              <div>
                <p className="text-lg" style={{ color: '#9ca3af' }}>{spec.label}</p>
                <p className="text-3xl font-semibold" style={{ color: '#ffffff' }}>{spec.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex gap-4 mt-12">
          {data.furnished && (
            <span 
              className="px-4 py-2 rounded-full text-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#d1d5db' }}
            >
              Mobiliado
            </span>
          )}
          {data.acceptsPets && (
            <span 
              className="px-4 py-2 rounded-full text-sm"
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
