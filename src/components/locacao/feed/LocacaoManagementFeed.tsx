// Management service creative - institutional, authority-building
import { LocacaoManagementData } from '@/types/locacao';
import { LocacaoLogoBar } from '../LocacaoLogo';
import { Check, Shield, Clock, Users, Phone, FileText, Headphones } from 'lucide-react';
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

        {/* Header */}
        <div className="relative z-10 pt-10 px-12">
          <p className="text-center text-sm font-medium tracking-widest uppercase mb-2" style={{ color: '#6b7280' }}>
            O que fazemos por você
          </p>
          <h2 
            className="text-3xl font-semibold text-center mb-1"
            style={{ color: '#111827', fontFamily: 'Georgia, serif' }}
          >
            Nossos Serviços
          </h2>
          <div className="w-12 h-0.5 mx-auto rounded-full" style={{ backgroundColor: '#374151' }} />
        </div>

        {/* Benefits grid - compact */}
        <div className="relative z-10 px-10 mt-6">
          <div className="grid grid-cols-2 gap-3">
            {data.benefits.map((benefit, i) => {
              const IconComponent = benefitIcons[i] || Check;
              return (
                <div 
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                >
                  <div 
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#111827' }}
                  >
                    <IconComponent className="w-4 h-4 text-white" strokeWidth={2} />
                  </div>
                  <p className="text-base font-medium leading-tight" style={{ color: '#374151' }}>{benefit}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust triggers section */}
        <div className="relative z-10 px-10 mt-6">
          <div className="grid grid-cols-3 gap-4">
            <div 
              className="text-center p-4 rounded-xl"
              style={{ backgroundColor: '#f3f4f6' }}
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: '#22c55e' }}>
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              <p className="text-sm font-semibold" style={{ color: '#111827' }}>Contrato</p>
              <p className="text-xs" style={{ color: '#6b7280' }}>Transparente</p>
            </div>
            <div 
              className="text-center p-4 rounded-xl"
              style={{ backgroundColor: '#f3f4f6' }}
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: '#3b82f6' }}>
                <Shield className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <p className="text-sm font-semibold" style={{ color: '#111827' }}>Documentação</p>
              <p className="text-xs" style={{ color: '#6b7280' }}>Completa</p>
            </div>
            <div 
              className="text-center p-4 rounded-xl"
              style={{ backgroundColor: '#f3f4f6' }}
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f59e0b' }}>
                <Clock className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <p className="text-sm font-semibold" style={{ color: '#111827' }}>Suporte</p>
              <p className="text-xs" style={{ color: '#6b7280' }}>24 horas</p>
            </div>
          </div>
        </div>

        {/* Bottom guarantee */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div 
            className="mx-10 mb-4 p-4 rounded-xl text-center"
            style={{ 
              background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)'
            }}
          >
            <p className="text-white text-sm font-medium">
              ✓ Sem taxas escondidas • ✓ Relatórios mensais • ✓ Repasse garantido
            </p>
          </div>
          <div className="flex justify-center pb-3 opacity-50">
            <svg width="140" height="52" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
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
        <div className="relative z-10 pt-12 text-center">
          <p className="text-sm font-medium tracking-widest uppercase mb-2" style={{ color: '#6b7280' }}>
            Compromisso com você
          </p>
          <h2 
            className="text-3xl font-semibold"
            style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
          >
            Nossa Garantia
          </h2>
        </div>

        {/* Main content - Guarantees grid */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full -mt-16 px-12">
          <div className="grid grid-cols-2 gap-6 mb-10">
            <div 
              className="text-center p-6 rounded-2xl"
              style={{ 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: '#22c55e' }}
              >
                <Check className="w-7 h-7 text-white" strokeWidth={3} />
              </div>
              <p className="text-lg font-semibold mb-1" style={{ color: '#ffffff' }}>Repasse Pontual</p>
              <p className="text-sm" style={{ color: '#9ca3af' }}>Aluguel na sua conta todo mês, sem atrasos</p>
            </div>
            
            <div 
              className="text-center p-6 rounded-2xl"
              style={{ 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: '#3b82f6' }}
              >
                <Shield className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <p className="text-lg font-semibold mb-1" style={{ color: '#ffffff' }}>Inquilino Qualificado</p>
              <p className="text-sm" style={{ color: '#9ca3af' }}>Análise criteriosa de crédito e referências</p>
            </div>
            
            <div 
              className="text-center p-6 rounded-2xl"
              style={{ 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: '#f59e0b' }}
              >
                <FileText className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <p className="text-lg font-semibold mb-1" style={{ color: '#ffffff' }}>Transparência Total</p>
              <p className="text-sm" style={{ color: '#9ca3af' }}>Relatórios detalhados todo mês</p>
            </div>
            
            <div 
              className="text-center p-6 rounded-2xl"
              style={{ 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: '#8b5cf6' }}
              >
                <Headphones className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <p className="text-lg font-semibold mb-1" style={{ color: '#ffffff' }}>Suporte Dedicado</p>
              <p className="text-sm" style={{ color: '#9ca3af' }}>Atendimento exclusivo para proprietários</p>
            </div>
          </div>

          {/* Trust quote */}
          <div 
            className="max-w-2xl text-center p-5 rounded-xl"
            style={{ 
              background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)',
              border: '1px solid rgba(34,197,94,0.2)'
            }}
          >
            <p className="text-base" style={{ color: '#d1d5db' }}>
              "Seu imóvel em boas mãos. Cuide do que importa, nós cuidamos do resto."
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
