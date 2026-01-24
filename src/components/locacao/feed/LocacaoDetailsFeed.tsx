// Feed slide 4: Details - practical info
import { LocacaoPropertyData } from '@/types/locacao';
import { LocacaoLogoBar } from '../LocacaoLogo';
import { Bed, Bath, Car, Maximize } from 'lucide-react';

interface LocacaoDetailsFeedProps {
  data: LocacaoPropertyData;
}

export const LocacaoDetailsFeed = ({ data }: LocacaoDetailsFeedProps) => {
  const specs = [
    { icon: Bed, label: 'Quartos', value: data.bedrooms || '—' },
    { icon: Bath, label: 'Banheiros', value: data.bathrooms || '—' },
    { icon: Car, label: 'Vagas', value: data.garageSpaces || '—' },
    { icon: Maximize, label: 'Área', value: data.area ? `${data.area} m²` : '—' },
  ];

  return (
    <div 
      className="relative w-[1080px] h-[1080px] overflow-hidden flex flex-col justify-center"
      style={{ backgroundColor: '#f9fafb' }}
    >
      {/* Content */}
      <div className="px-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl font-semibold mb-4"
            style={{ color: '#111827', fontFamily: 'Georgia, serif' }}
          >
            Características do Imóvel
          </h2>
          <p 
            className="text-xl"
            style={{ color: '#6b7280' }}
          >
            {data.type} • {data.neighborhood || 'Localização'}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-8 mb-16">
          {specs.map((spec, i) => (
            <div 
              key={i}
              className="flex items-center gap-4 p-6 rounded-xl"
              style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
            >
              <div 
                className="w-14 h-14 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#f3f4f6' }}
              >
                <spec.icon className="w-7 h-7" style={{ color: '#374151' }} />
              </div>
              <div>
                <p className="text-lg" style={{ color: '#6b7280' }}>{spec.label}</p>
                <p className="text-3xl font-semibold" style={{ color: '#111827' }}>{spec.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="flex justify-center gap-8">
          {data.furnished && (
            <span 
              className="px-4 py-2 rounded-full text-sm"
              style={{ backgroundColor: '#e5e7eb', color: '#374151' }}
            >
              Mobiliado
            </span>
          )}
          {data.acceptsPets && (
            <span 
              className="px-4 py-2 rounded-full text-sm"
              style={{ backgroundColor: '#e5e7eb', color: '#374151' }}
            >
              Aceita Pets
            </span>
          )}
        </div>
      </div>

      {/* Logo */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="opacity-60">
          <svg width="160" height="60" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
            <g fill="#374151">
              <path d="M200 120 L400 40 L600 120 L585 120 L400 55 L215 120 Z"/>
              <text x="400" y="180" textAnchor="middle" fontFamily="Georgia, serif" fontSize="120" fontWeight="600">VDH</text>
              <text x="400" y="235" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="42" letterSpacing="6">REVENDA +</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
