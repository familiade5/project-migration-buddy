// Feed slide 5: Pricing - clear, no pressure
import { LocacaoPropertyData } from '@/types/locacao';
import { LocacaoLogoBar } from '../LocacaoLogo';

interface LocacaoPricingFeedProps {
  data: LocacaoPropertyData;
}

export const LocacaoPricingFeed = ({ data }: LocacaoPricingFeedProps) => {
  const hasCondominium = data.condominiumFee && data.condominiumFee !== '';
  const hasIptu = data.iptu && data.iptu !== '';

  return (
    <div 
      className="relative w-[1080px] h-[1080px] overflow-hidden flex flex-col justify-center"
      style={{ backgroundColor: '#1f2937' }}
    >
      {/* Content */}
      <div className="px-16 text-center">
        {/* Header */}
        <p 
          className="text-xl mb-4"
          style={{ color: '#9ca3af' }}
        >
          Valores
        </p>

        {/* Main Price */}
        <div className="mb-12">
          <p 
            className="text-2xl mb-2"
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
            className="inline-block p-8 rounded-xl mb-12"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
          >
            <div className="space-y-4">
              {hasCondominium && (
                <div className="flex justify-between gap-16">
                  <span style={{ color: '#9ca3af' }}>Condomínio</span>
                  <span style={{ color: '#ffffff' }}>{data.condominiumFee}</span>
                </div>
              )}
              {hasIptu && (
                <div className="flex justify-between gap-16">
                  <span style={{ color: '#9ca3af' }}>IPTU</span>
                  <span style={{ color: '#ffffff' }}>{data.iptu}</span>
                </div>
              )}
              {data.totalMonthly && (
                <>
                  <div 
                    className="w-full h-px my-4"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  />
                  <div className="flex justify-between gap-16">
                    <span className="font-medium" style={{ color: '#d1d5db' }}>Total Mensal</span>
                    <span className="font-semibold" style={{ color: '#ffffff' }}>{data.totalMonthly}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Contract Info */}
        <div className="flex justify-center gap-8">
          {data.depositMonths && (
            <div className="text-center">
              <p className="text-sm" style={{ color: '#6b7280' }}>Caução</p>
              <p className="text-lg font-medium" style={{ color: '#d1d5db' }}>{data.depositMonths} meses</p>
            </div>
          )}
          {data.contractDuration && (
            <div className="text-center">
              <p className="text-sm" style={{ color: '#6b7280' }}>Contrato</p>
              <p className="text-lg font-medium" style={{ color: '#d1d5db' }}>{data.contractDuration}</p>
            </div>
          )}
        </div>
      </div>

      {/* Logo */}
      <LocacaoLogoBar />
    </div>
  );
};
