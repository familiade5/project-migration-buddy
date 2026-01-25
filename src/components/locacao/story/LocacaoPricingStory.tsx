// Story slide: Pricing with property info
import { LocacaoPropertyData } from '@/types/locacao';
import { LocacaoLogoBarStory } from '../LocacaoLogo';

interface LocacaoPricingStoryProps {
  data: LocacaoPropertyData;
}

export const LocacaoPricingStory = ({ data }: LocacaoPricingStoryProps) => {
  const propertyTitle = data.propertyName || data.type;
  const addressLine = data.fullAddress || `${data.neighborhood}, ${data.city}`;

  return (
    <div 
      className="relative w-[1080px] h-[1920px] overflow-hidden flex flex-col items-center justify-center"
      style={{ backgroundColor: '#1f2937' }}
    >
      {/* Content */}
      <div className="text-center px-12">
        {/* Property Info Header */}
        <div className="mb-16">
          <p 
            className="text-2xl mb-3"
            style={{ color: '#9ca3af' }}
          >
            {data.type}
          </p>
          <h2 
            className="text-5xl font-semibold mb-4"
            style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
          >
            {propertyTitle}
          </h2>
          <p 
            className="text-xl"
            style={{ color: '#6b7280' }}
          >
            {addressLine}
          </p>
        </div>

        {/* Divider */}
        <div 
          className="w-24 h-px mx-auto mb-16"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        />

        {/* Main Price */}
        <p 
          className="text-3xl mb-4"
          style={{ color: '#9ca3af' }}
        >
          Aluguel Mensal
        </p>

        <p 
          className="text-8xl font-bold mb-16"
          style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
        >
          {data.rentPrice || 'Consulte'}
        </p>

        {/* Cost Details */}
        <div 
          className="inline-block p-10 rounded-2xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
        >
          {data.condominiumFee && (
            <div className="flex justify-between gap-16 mb-4">
              <span className="text-xl" style={{ color: '#9ca3af' }}>Condomínio</span>
              <span className="text-xl font-medium" style={{ color: '#ffffff' }}>{data.condominiumFee}</span>
            </div>
          )}
          {data.iptu && (
            <div className="flex justify-between gap-16 mb-4">
              <span className="text-xl" style={{ color: '#9ca3af' }}>IPTU</span>
              <span className="text-xl font-medium" style={{ color: '#ffffff' }}>{data.iptu}</span>
            </div>
          )}
          {data.totalMonthly && (
            <>
              <div className="w-full h-px my-5" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <div className="flex justify-between gap-16">
                <span className="text-xl font-medium" style={{ color: '#d1d5db' }}>Total</span>
                <span className="text-2xl font-bold" style={{ color: '#ffffff' }}>{data.totalMonthly}</span>
              </div>
            </>
          )}
        </div>

        {/* Contract */}
        <div className="flex justify-center gap-16 mt-16">
          {data.depositMonths && (
            <div>
              <p className="text-lg" style={{ color: '#6b7280' }}>Caução</p>
              <p className="text-2xl font-medium" style={{ color: '#d1d5db' }}>{data.depositMonths} meses</p>
            </div>
          )}
          {data.contractDuration && (
            <div>
              <p className="text-lg" style={{ color: '#6b7280' }}>Contrato</p>
              <p className="text-2xl font-medium" style={{ color: '#d1d5db' }}>{data.contractDuration}</p>
            </div>
          )}
        </div>
      </div>

      {/* Logo */}
      <LocacaoLogoBarStory />
    </div>
  );
};
