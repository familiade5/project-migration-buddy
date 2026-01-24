// Management service Story slides
import { LocacaoManagementData } from '@/types/locacao';
import { LocacaoLogoBarStory } from '../LocacaoLogo';
import { Check } from 'lucide-react';

interface LocacaoManagementStoryProps {
  data: LocacaoManagementData;
  slide: 'intro' | 'benefits' | 'trust' | 'contact';
}

export const LocacaoManagementStory = ({ data, slide }: LocacaoManagementStoryProps) => {
  if (slide === 'intro') {
    return (
      <div 
        className="relative w-[1080px] h-[1920px] overflow-hidden"
        style={{ backgroundColor: '#111827' }}
      >
        {data.backgroundPhoto && data.useBackgroundPhoto && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${data.backgroundPhoto})` }}
            />
            <div 
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(17,24,39,0.9)' }}
            />
          </>
        )}

        <div className="relative h-full flex flex-col items-center justify-center px-12 text-center">
          {/* Logo */}
          <div className="mb-16 opacity-80">
            <svg width="240" height="90" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
              <g fill="#ffffff">
                <path d="M200 120 L400 40 L600 120 L585 120 L400 55 L215 120 Z"/>
                <text x="400" y="180" textAnchor="middle" fontFamily="Georgia, serif" fontSize="120" fontWeight="600">VDH</text>
                <text x="400" y="235" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="42" letterSpacing="6">REVENDA +</text>
              </g>
            </svg>
          </div>

          <h1 
            className="text-6xl font-semibold mb-8 leading-tight"
            style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
          >
            {data.headline}
          </h1>

          <p 
            className="text-2xl"
            style={{ color: '#9ca3af' }}
          >
            {data.subheadline}
          </p>
        </div>
      </div>
    );
  }

  if (slide === 'benefits') {
    return (
      <div 
        className="relative w-[1080px] h-[1920px] overflow-hidden flex flex-col justify-center"
        style={{ backgroundColor: '#f9fafb' }}
      >
        <div className="px-12">
          <h2 
            className="text-5xl font-semibold text-center mb-16"
            style={{ color: '#111827', fontFamily: 'Georgia, serif' }}
          >
            Nossos Serviços
          </h2>

          <div className="space-y-6">
            {data.benefits.map((benefit, i) => (
              <div 
                key={i}
                className="flex items-center gap-6 p-6 rounded-xl"
                style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
              >
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#e5e7eb' }}
                >
                  <Check className="w-7 h-7" style={{ color: '#374151' }} />
                </div>
                <p className="text-2xl" style={{ color: '#374151' }}>{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Logo */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-center opacity-60">
          <svg width="200" height="75" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
            <g fill="#374151">
              <path d="M200 120 L400 40 L600 120 L585 120 L400 55 L215 120 Z"/>
              <text x="400" y="180" textAnchor="middle" fontFamily="Georgia, serif" fontSize="120" fontWeight="600">VDH</text>
              <text x="400" y="235" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="42" letterSpacing="6">REVENDA +</text>
            </g>
          </svg>
        </div>
      </div>
    );
  }

  if (slide === 'trust') {
    return (
      <div 
        className="relative w-[1080px] h-[1920px] overflow-hidden flex flex-col items-center justify-center"
        style={{ backgroundColor: '#111827' }}
      >
        <div className="text-center px-12">
          <p className="text-xl mb-12" style={{ color: '#6b7280' }}>
            Confie em quem entende
          </p>

          <div className="space-y-12 mb-16">
            <div>
              <p 
                className="text-8xl font-bold"
                style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
              >
                {data.yearsExperience}
              </p>
              <p className="text-2xl mt-2" style={{ color: '#9ca3af' }}>anos de experiência</p>
            </div>
            <div>
              <p 
                className="text-8xl font-bold"
                style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
              >
                {data.propertiesManaged}
              </p>
              <p className="text-2xl mt-2" style={{ color: '#9ca3af' }}>imóveis administrados</p>
            </div>
          </div>
        </div>

        <LocacaoLogoBarStory />
      </div>
    );
  }

  // Contact
  return (
    <div 
      className="relative w-[1080px] h-[1920px] overflow-hidden flex flex-col items-center justify-center"
      style={{ backgroundColor: '#1f2937' }}
    >
      <div className="text-center px-12">
        <p className="text-xl mb-4" style={{ color: '#9ca3af' }}>
          Fale conosco
        </p>

        <h2 
          className="text-5xl font-semibold mb-16"
          style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
        >
          Solicite uma proposta
        </h2>

        <div 
          className="p-10 rounded-2xl"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <p className="text-3xl font-medium mb-2" style={{ color: '#ffffff' }}>
            {data.contactName}
          </p>
          {data.creci && (
            <p className="text-base mb-8" style={{ color: '#9ca3af' }}>{data.creci}</p>
          )}
          <p className="text-4xl font-semibold" style={{ color: '#ffffff' }}>
            {data.contactPhone}
          </p>
        </div>
      </div>

      <LocacaoLogoBarStory />
    </div>
  );
};
