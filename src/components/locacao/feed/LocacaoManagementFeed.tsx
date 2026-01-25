// Management service creative - institutional, authority-building
import { LocacaoManagementData } from '@/types/locacao';
import { LocacaoLogoBar } from '../LocacaoLogo';
import { Check, Shield, Clock, Users, Phone } from 'lucide-react';
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
        {/* Background with elegant gradient */}
        {backgroundUrl && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${backgroundUrl})`,
                opacity: 0.5,
              }}
            />
            <div 
              className="absolute inset-0"
              style={{ 
                background: 'linear-gradient(135deg, rgba(17,24,39,0.9) 0%, rgba(17,24,39,0.6) 50%, rgba(17,24,39,0.85) 100%)'
              }}
            />
          </>
        )}

        {/* Top section - Logo and badge */}
        <div className="absolute top-10 left-0 right-0 flex justify-between items-start px-12 z-10">
          {/* Logo */}
          <svg width="160" height="60" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
            <g fill="#ffffff">
              <path d="M200 120 L400 40 L600 120 L585 120 L400 55 L215 120 Z"/>
              <text x="400" y="180" textAnchor="middle" fontFamily="Georgia, serif" fontSize="120" fontWeight="600">VDH</text>
              <text x="400" y="235" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="42" letterSpacing="6">REVENDA +</text>
            </g>
          </svg>

          {/* Badge */}
          <div className="relative overflow-hidden rounded-lg shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4b5563] via-[#374151] to-[#1f2937]" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent h-1/2" />
            <div className="relative text-center py-3 px-6">
              <p className="text-white font-semibold leading-tight text-base">Gestão</p>
              <p className="text-white font-black leading-none tracking-tight text-2xl">Profissional</p>
            </div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-16 text-center">
          {/* Icon/Symbol */}
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mb-8"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
              border: '2px solid rgba(255,255,255,0.2)'
            }}
          >
            <Shield className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>

          <h1 
            className="text-5xl font-semibold mb-6 leading-tight max-w-4xl"
            style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
          >
            {data.headline}
          </h1>

          <p 
            className="text-xl max-w-3xl mb-10"
            style={{ color: '#d1d5db' }}
          >
            {data.subheadline}
          </p>

          {/* Trust indicators */}
          <div className="flex gap-10">
            <div className="text-center">
              <p className="text-4xl font-bold" style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}>
                {data.yearsExperience}
              </p>
              <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>anos de mercado</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-4xl font-bold" style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}>
                {data.propertiesManaged}
              </p>
              <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>imóveis gerenciados</p>
            </div>
          </div>
        </div>

        {/* Bottom hint */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
          <div className="flex items-center gap-2" style={{ color: '#6b7280' }}>
            <span className="text-sm">Arraste para conhecer nossos serviços</span>
            <span>→</span>
          </div>
        </div>
      </div>
    );
  }

  if (slide === 'benefits') {
    const benefitIcons = [Clock, Shield, Users, Check, Check, Check];
    
    return (
      <div 
        className="relative w-[1080px] h-[1080px] overflow-hidden"
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Subtle background pattern */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 50%, #f9fafb 100%)'
          }}
        />

        {/* Decorative elements */}
        <div 
          className="absolute top-0 right-0 w-96 h-96 rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(17,24,39,0.03) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)'
          }}
        />

        {/* Header */}
        <div className="relative z-10 pt-14 px-16">
          <p className="text-center text-sm font-medium tracking-widest uppercase mb-3" style={{ color: '#6b7280' }}>
            O que fazemos por você
          </p>
          <h2 
            className="text-4xl font-semibold text-center mb-2"
            style={{ color: '#111827', fontFamily: 'Georgia, serif' }}
          >
            Nossos Serviços
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: '#374151' }} />
        </div>

        {/* Benefits grid */}
        <div className="relative z-10 px-14 mt-10">
          <div className="grid grid-cols-2 gap-4">
            {data.benefits.map((benefit, i) => {
              const IconComponent = benefitIcons[i] || Check;
              return (
                <div 
                  key={i}
                  className="flex items-center gap-4 p-5 rounded-xl transition-all"
                  style={{ 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                >
                  <div 
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#111827' }}
                  >
                    <IconComponent className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <p className="text-lg font-medium" style={{ color: '#374151' }}>{benefit}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="flex justify-center pb-4 opacity-60">
            <svg width="180" height="67" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
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
  }

  if (slide === 'trust') {
    return (
      <div 
        className="relative w-[1080px] h-[1080px] overflow-hidden"
        style={{ backgroundColor: '#111827' }}
      >
        {/* Background (dark) */}
        {backgroundUrl && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${backgroundUrl})`,
                opacity: 0.35,
              }}
            />
            <div
              className="absolute inset-0"
              style={{ 
                background: 'linear-gradient(180deg, rgba(17,24,39,0.85) 0%, rgba(17,24,39,0.7) 50%, rgba(17,24,39,0.9) 100%)'
              }}
            />
          </>
        )}

        {/* Header */}
        <div className="relative z-10 pt-16 text-center">
          <p className="text-sm font-medium tracking-widest uppercase mb-2" style={{ color: '#6b7280' }}>
            Credibilidade comprovada
          </p>
          <h2 
            className="text-3xl font-semibold"
            style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
          >
            Por que confiar na VDH Revenda+
          </h2>
        </div>

        {/* Main stats */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center -mt-10">
          <div className="flex gap-20 mb-12">
            <div className="text-center">
              <div 
                className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '2px solid rgba(255,255,255,0.15)'
                }}
              >
                <p 
                  className="text-6xl font-bold"
                  style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
                >
                  {data.yearsExperience}
                </p>
              </div>
              <p className="text-lg" style={{ color: '#9ca3af' }}>anos de<br />experiência</p>
            </div>
            
            <div className="text-center">
              <div 
                className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '2px solid rgba(255,255,255,0.15)'
                }}
              >
                <p 
                  className="text-5xl font-bold"
                  style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
                >
                  {data.propertiesManaged}
                </p>
              </div>
              <p className="text-lg" style={{ color: '#9ca3af' }}>imóveis<br />administrados</p>
            </div>
          </div>

          {/* Trust message */}
          <div 
            className="max-w-2xl mx-auto text-center p-6 rounded-xl"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <p 
              className="text-xl"
              style={{ color: '#d1d5db' }}
            >
              "Profissionalismo e transparência em cada etapa da administração do seu imóvel."
            </p>
          </div>
        </div>

        {/* Logo bar fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <LocacaoLogoBar />
        </div>
      </div>
    );
  }

  // Contact slide - Strong CTA
  return (
    <div 
      className="relative w-[1080px] h-[1080px] overflow-hidden"
      style={{ backgroundColor: '#1f2937' }}
    >
      {/* Background (dark) */}
      {backgroundUrl && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundUrl})`,
              opacity: 0.35,
            }}
          />
          <div
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(180deg, rgba(31,41,55,0.85) 0%, rgba(31,41,55,0.7) 50%, rgba(31,41,55,0.9) 100%)'
            }}
          />
        </>
      )}

      {/* Main content centered */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-16">
        {/* Icon */}
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mb-8"
          style={{ 
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            boxShadow: '0 8px 32px rgba(34,197,94,0.3)'
          }}
        >
          <Phone className="w-10 h-10 text-white" strokeWidth={2} />
        </div>

        <p 
          className="text-lg font-medium tracking-widest uppercase mb-3"
          style={{ color: '#9ca3af' }}
        >
          Próximo passo
        </p>

        <h2 
          className="text-5xl font-semibold mb-10 text-center"
          style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
        >
          Fale com um<br />especialista agora
        </h2>

        {/* Contact card */}
        <div 
          className="p-10 rounded-2xl text-center min-w-[400px]"
          style={{ 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}
        >
          <p className="text-2xl font-medium mb-1" style={{ color: '#ffffff' }}>
            {data.contactName}
          </p>
          {data.creci && (
            <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>{data.creci}</p>
          )}
          <div 
            className="inline-block px-8 py-4 rounded-xl"
            style={{ backgroundColor: '#22c55e' }}
          >
            <p className="text-3xl font-bold" style={{ color: '#ffffff' }}>
              {data.contactPhone}
            </p>
          </div>
        </div>

        {/* Urgency text */}
        <p className="mt-8 text-base" style={{ color: '#6b7280' }}>
          Atendimento personalizado • Resposta em até 24h
        </p>
      </div>

      {/* Logo bar fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <LocacaoLogoBar />
      </div>
    </div>
  );
};
