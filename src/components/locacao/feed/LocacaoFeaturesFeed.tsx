// Feed slide: Features list
import { LocacaoPropertyData } from '@/types/locacao';
import { LocacaoLogoBar } from '../LocacaoLogo';
import { Check } from 'lucide-react';

interface LocacaoFeaturesFeedProps {
  data: LocacaoPropertyData;
}

export const LocacaoFeaturesFeed = ({ data }: LocacaoFeaturesFeedProps) => {
  // Only show features that were actually selected - NO defaults
  const displayFeatures = data.features.slice(0, 8);

  return (
    <div 
      className="relative w-[1080px] h-[1080px] overflow-hidden flex flex-col justify-center"
      style={{ backgroundColor: '#f9fafb' }}
    >
      {/* Content */}
      <div className="px-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 
            className="text-5xl font-semibold mb-4"
            style={{ color: '#111827', fontFamily: 'Georgia, serif' }}
          >
            Diferenciais
          </h2>
          <p 
            className="text-2xl"
            style={{ color: '#6b7280' }}
          >
            {data.propertyName || data.type}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4">
          {displayFeatures.map((feature, i) => (
            <div 
              key={i}
              className="flex items-center gap-4 p-6 rounded-xl"
              style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#374151' }}
              >
                <Check className="w-5 h-5" style={{ color: '#ffffff' }} />
              </div>
              <span className="text-xl font-medium" style={{ color: '#374151' }}>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logo */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div style={{ opacity: 0.6 }}>
          <svg width="220" height="82" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
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
