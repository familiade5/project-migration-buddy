// Management service Story slides
import { LocacaoManagementData } from '@/types/locacao';
import { LocacaoLogoBarStory } from '../LocacaoLogo';
import { Check } from 'lucide-react';
import { managementDefaultBackgroundBySlide } from '../management/managementBackgrounds';

interface LocacaoManagementStoryProps {
  data: LocacaoManagementData;
  slide: 'intro' | 'benefits' | 'trust' | 'contact';
}

export const LocacaoManagementStory = ({ data, slide }: LocacaoManagementStoryProps) => {
  const backgroundUrl = data.useBackgroundPhoto
    ? (data.backgroundPhoto || managementDefaultBackgroundBySlide[slide])
    : null;

  if (slide === 'intro') {
    return (
      <div 
        className="relative w-[1080px] h-[1920px] overflow-hidden"
        style={{ backgroundColor: '#111827' }}
      >
        {/* Background with elegant gradient */}
        {backgroundUrl && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${backgroundUrl})`,
                opacity: 0.45,
              }}
            />
            <div 
              className="absolute inset-0"
              style={{ 
                background: 'linear-gradient(180deg, rgba(17,24,39,0.85) 0%, rgba(17,24,39,0.5) 40%, rgba(17,24,39,0.7) 70%, rgba(17,24,39,0.95) 100%)'
              }}
            />
          </>
        )}

        {/* Top section - Logo and badge */}
        <div className="absolute top-16 left-0 right-0 flex justify-between items-start px-12 z-10">
          {/* Logo */}
          <svg width="200" height="75" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
            <g fill="#ffffff">
              <path d="M200 120 L400 40 L600 120 L585 120 L400 55 L215 120 Z"/>
              <text x="400" y="180" textAnchor="middle" fontFamily="Georgia, serif" fontSize="120" fontWeight="600">VDH</text>
              <text x="400" y="235" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="42" letterSpacing="6">REVENDA +</text>
            </g>
          </svg>

          {/* Badge */}
          <div className="relative overflow-hidden rounded-xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4b5563] via-[#374151] to-[#1f2937]" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent h-1/2" />
            <div className="relative text-center py-4 px-8">
              <p className="text-white font-semibold leading-tight text-xl">Gestão</p>
              <p className="text-white font-black leading-none tracking-tight text-3xl">Profissional</p>
            </div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-12 text-center">
          {/* Icon/Symbol */}
          <div 
            className="w-28 h-28 rounded-full flex items-center justify-center mb-10"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
              border: '2px solid rgba(255,255,255,0.2)'
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 10h.01M15 10h.01M9 14h.01M15 14h.01" />
            </svg>
          </div>

          <h1 
            className="text-6xl font-semibold mb-6 leading-tight max-w-4xl"
            style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
          >
            {data.headline}
          </h1>

          <p 
            className="text-2xl max-w-3xl mb-12"
            style={{ color: '#d1d5db' }}
          >
            {data.subheadline}
          </p>

          {/* Trust indicators */}
          <div className="flex gap-12 mt-4">
            <div className="text-center">
              <p className="text-5xl font-bold" style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}>
                {data.yearsExperience}
              </p>
              <p className="text-base mt-1" style={{ color: '#9ca3af' }}>anos de mercado</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-5xl font-bold" style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}>
                {data.propertiesManaged}
              </p>
              <p className="text-base mt-1" style={{ color: '#9ca3af' }}>imóveis gerenciados</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA hint */}
        <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center z-10">
          <p className="text-lg mb-3" style={{ color: '#9ca3af' }}>Arraste para saber mais</p>
          <div className="w-12 h-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
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

        <div className="relative z-10 px-12">
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

        {/* Logo - larger to match other slides */}
        <div className="absolute bottom-20 left-0 right-0 flex justify-center opacity-70 z-10">
          <svg width="240" height="90" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
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
        className="relative w-[1080px] h-[1920px] overflow-hidden"
        style={{ backgroundColor: '#111827' }}
      >
        {/* Background (dark) */}
        {backgroundUrl && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${backgroundUrl})`,
                opacity: 0.30,
                filter: 'blur(10px)',
                transform: 'scale(1.05)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(17,24,39,0.78)' }}
            />
          </>
        )}

        {/* Main content centered */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-12">
          <p className="text-xl mb-12" style={{ color: '#6b7280' }}>
            Confie em quem entende
          </p>

          <div className="space-y-12 mb-16 text-center">
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

        {/* Logo bar fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <LocacaoLogoBarStory />
        </div>
      </div>
    );
  }

  // Contact
  return (
    <div 
      className="relative w-[1080px] h-[1920px] overflow-hidden"
      style={{ backgroundColor: '#1f2937' }}
    >
      {/* Background (dark) */}
      {backgroundUrl && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundUrl})`,
              opacity: 0.30,
              filter: 'blur(10px)',
              transform: 'scale(1.05)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(31,41,55,0.78)' }}
          />
        </>
      )}

      {/* Main content centered */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-12">
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
          className="p-10 rounded-2xl text-center"
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

      {/* Logo bar fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <LocacaoLogoBarStory />
      </div>
    </div>
  );
};
