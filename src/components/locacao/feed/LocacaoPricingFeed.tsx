// Feed slide: Pricing with property info
import { LocacaoPropertyData } from '@/types/locacao';
import { LocacaoLogoBar } from '../LocacaoLogo';

interface LocacaoPricingFeedProps {
  data: LocacaoPropertyData;
}

export const LocacaoPricingFeed = ({ data }: LocacaoPricingFeedProps) => {
  const hasCondominium = data.condominiumFee && data.condominiumFee !== '';
  const hasIptu = data.iptu && data.iptu !== '';
  
  // Determine property description
  const isApartment = data.type === 'Apartamento' || data.type === 'Cobertura' || data.type === 'Kitnet' || data.type === 'Studio' || data.type === 'Loft';
  const propertyTitle = data.propertyName || data.type;
  const addressLine = data.fullAddress || `${data.neighborhood}, ${data.city}`;

  return (
    <div 
      className="relative w-[1080px] h-[1080px] overflow-hidden flex flex-col justify-center"
      style={{ backgroundColor: '#1f2937' }}
    >
      {/* Content */}
      <div className="px-16 text-center">
        {/* Property Info Header */}
        <div className="mb-12">
          <p 
            className="text-xl mb-2"
            style={{ color: '#9ca3af' }}
          >
            {data.type}
          </p>
          <h2 
            className="text-4xl font-semibold mb-3"
            style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
          >
            {propertyTitle}
          </h2>
          <p 
            className="text-lg"
            style={{ color: '#6b7280' }}
          >
            {addressLine}
          </p>
        </div>

        {/* Divider */}
        <div 
          className="w-24 h-px mx-auto mb-12"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        />

        {/* Main Price */}
        <div className="mb-12">
          <p 
            className="text-2xl mb-3"
            style={{ color: '#d1d5db' }}
          >
            Aluguel Mensal
          </p>
          <p 
            className="text-7xl font-bold"
            style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
          >
            {data.rentPrice || 'Consulte'}
          </p>
        </div>

        {/* Cost Breakdown */}
        {(hasCondominium || hasIptu) && (
          <div 
            className="inline-block p-8 rounded-2xl mb-10"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          >
            <div className="space-y-4">
              {hasCondominium && (
                <div className="flex justify-between gap-20">
                  <span className="text-lg" style={{ color: '#9ca3af' }}>Condomínio</span>
                  <span className="text-lg font-medium" style={{ color: '#ffffff' }}>{data.condominiumFee}</span>
                </div>
              )}
              {hasIptu && (
                <div className="flex justify-between gap-20">
                  <span className="text-lg" style={{ color: '#9ca3af' }}>IPTU</span>
                  <span className="text-lg font-medium" style={{ color: '#ffffff' }}>{data.iptu}</span>
                </div>
              )}
              {data.totalMonthly && (
                <>
                  <div 
                    className="w-full h-px my-4"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  />
                  <div className="flex justify-between gap-20">
                    <span className="text-xl font-medium" style={{ color: '#d1d5db' }}>Total Mensal</span>
                    <span className="text-xl font-bold" style={{ color: '#ffffff' }}>{data.totalMonthly}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Contract Info */}
        <div className="flex justify-center gap-12">
          {data.depositMonths && (
            <div className="text-center">
              <p className="text-sm" style={{ color: '#6b7280' }}>Caução</p>
              <p className="text-2xl font-medium" style={{ color: '#d1d5db' }}>{data.depositMonths} meses</p>
            </div>
          )}
          {data.contractDuration && (
            <div className="text-center">
              <p className="text-sm" style={{ color: '#6b7280' }}>Contrato</p>
              <p className="text-2xl font-medium" style={{ color: '#d1d5db' }}>{data.contractDuration}</p>
            </div>
          )}
        </div>
      </div>

      {/* Logo */}
      <LocacaoLogoBar />
    </div>
  );
};
