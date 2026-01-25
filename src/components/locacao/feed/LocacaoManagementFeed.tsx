// Management service creative - institutional, authority-building
import { LocacaoManagementData } from '@/types/locacao';
import { LocacaoLogoBar } from '../LocacaoLogo';
import { Check } from 'lucide-react';
import { managementDefaultBackgroundBySlide } from '../management/managementBackgrounds';

interface LocacaoManagementFeedProps {
  data: LocacaoManagementData;
  slide: 'intro' | 'benefits' | 'trust' | 'contact';
}

export const LocacaoManagementFeed = ({ data, slide }: LocacaoManagementFeedProps) => {
  const backgroundUrl = data.useBackgroundPhoto
    ? (data.backgroundPhoto || managementDefaultBackgroundBySlide[slide])
    : null;

  if (slide === 'intro') {
    return (
      <div 
        className="relative w-[1080px] h-[1080px] overflow-hidden"
        style={{ backgroundColor: '#111827' }}
      >
        {/* Background subtle pattern */}
        {backgroundUrl && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${backgroundUrl})`,
                opacity: 0.35,
                filter: 'blur(10px)',
                transform: 'scale(1.05)',
              }}
            />
            <div 
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(17,24,39,0.72)' }}
            />
          </>
        )}

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-16 text-center">
          {/* Logo */}
          <div className="mb-12 opacity-80">
            <svg width="200" height="75" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
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
            className="text-2xl max-w-3xl"
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
        className="relative w-[1080px] h-[1080px] overflow-hidden flex flex-col justify-center"
        style={{ backgroundColor: '#f9fafb' }}
      >
        {/* Background (light) */}
        {backgroundUrl && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${backgroundUrl})`,
                opacity: 0.18,
                filter: 'blur(10px)',
                transform: 'scale(1.05)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(249,250,251,0.90)' }}
            />
          </>
        )}

        <div className="relative z-10 px-16">
          <h2 
            className="text-4xl font-semibold text-center mb-16"
            style={{ color: '#111827', fontFamily: 'Georgia, serif' }}
          >
            Como funciona
          </h2>

          <div className="space-y-6">
            {data.benefits.map((benefit, i) => (
              <div 
                key={i}
                className="flex items-center gap-6 p-6 rounded-xl"
                style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#e5e7eb' }}
                >
                  <Check className="w-6 h-6" style={{ color: '#374151' }} />
                </div>
                <p className="text-2xl" style={{ color: '#374151' }}>{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Logo - larger to match other slides */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center opacity-70 z-10">
          <svg width="220" height="82" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
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
        className="relative w-[1080px] h-[1080px] overflow-hidden flex flex-col items-center justify-center"
        style={{ backgroundColor: '#111827' }}
      >
        {/* Background (dark) */}
        {backgroundUrl && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${backgroundUrl})`,
                opacity: 0.32,
                filter: 'blur(10px)',
                transform: 'scale(1.05)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(17,24,39,0.75)' }}
            />
          </>
        )}

        <div className="relative z-10 text-center">
          <p 
            className="text-xl mb-8"
            style={{ color: '#6b7280' }}
          >
            Por que confiar na VDH Revenda+
          </p>

          <div className="flex gap-16 mb-16">
            <div>
              <p 
                className="text-7xl font-bold"
                style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
              >
                {data.yearsExperience}
              </p>
              <p className="text-xl mt-2" style={{ color: '#9ca3af' }}>anos de experiência</p>
            </div>
            <div>
              <p 
                className="text-7xl font-bold"
                style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
              >
                {data.propertiesManaged}
              </p>
              <p className="text-xl mt-2" style={{ color: '#9ca3af' }}>imóveis administrados</p>
            </div>
          </div>

          <p 
            className="text-2xl max-w-2xl mx-auto"
            style={{ color: '#d1d5db' }}
          >
            Profissionalismo e transparência em cada etapa da administração do seu imóvel.
          </p>
        </div>

        <div className="relative z-10 w-full">
          <LocacaoLogoBar />
        </div>
      </div>
    );
  }

  // Contact slide
  return (
    <div 
      className="relative w-[1080px] h-[1080px] overflow-hidden flex flex-col items-center justify-center"
      style={{ backgroundColor: '#1f2937' }}
    >
      {/* Background (dark) */}
      {backgroundUrl && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundUrl})`,
              opacity: 0.32,
              filter: 'blur(10px)',
              transform: 'scale(1.05)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(31,41,55,0.75)' }}
          />
        </>
      )}

      <div className="relative z-10 text-center px-16">
        <p 
          className="text-xl mb-4"
          style={{ color: '#9ca3af' }}
        >
          Fale com um especialista
        </p>

        <h2 
          className="text-5xl font-semibold mb-12"
          style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
        >
          Solicite uma proposta
        </h2>

        <div 
          className="inline-block p-10 rounded-2xl"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <p className="text-2xl font-medium mb-2" style={{ color: '#ffffff' }}>
            {data.contactName}
          </p>
          {data.creci && (
            <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>{data.creci}</p>
          )}
          <p className="text-4xl font-semibold" style={{ color: '#ffffff' }}>
            {data.contactPhone}
          </p>
        </div>
      </div>

      <div className="relative z-10 w-full">
        <LocacaoLogoBar />
      </div>
    </div>
  );
};
