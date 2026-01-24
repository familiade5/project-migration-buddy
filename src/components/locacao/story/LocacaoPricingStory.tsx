// Story slide 3: Pricing
import { LocacaoPropertyData } from '@/types/locacao';
import { LocacaoLogoBarStory } from '../LocacaoLogo';

interface LocacaoPricingStoryProps {
  data: LocacaoPropertyData;
}

export const LocacaoPricingStory = ({ data }: LocacaoPricingStoryProps) => {
  return (
    <div 
      className="relative w-[1080px] h-[1920px] overflow-hidden flex flex-col items-center justify-center"
      style={{ backgroundColor: '#1f2937' }}
    >
      {/* Content */}
      <div className="text-center px-12">
        <p 
          className="text-2xl mb-4"
          style={{ color: '#9ca3af' }}
        >
          Aluguel Mensal
        </p>

        <p 
          className="text-8xl font-bold mb-12"
          style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
        >
          {data.rentPrice || 'Consulte'}
        </p>

        {/* Cost Details */}
        <div 
          className="inline-block p-8 rounded-xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        >
          {data.condominiumFee && (
            <div className="flex justify-between gap-12 mb-4">
              <span style={{ color: '#9ca3af' }}>Condomínio</span>
              <span style={{ color: '#ffffff' }}>{data.condominiumFee}</span>
            </div>
          )}
          {data.iptu && (
            <div className="flex justify-between gap-12 mb-4">
              <span style={{ color: '#9ca3af' }}>IPTU</span>
              <span style={{ color: '#ffffff' }}>{data.iptu}</span>
            </div>
          )}
          {data.totalMonthly && (
            <>
              <div className="w-full h-px my-4" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <div className="flex justify-between gap-12">
                <span className="font-medium" style={{ color: '#d1d5db' }}>Total</span>
                <span className="font-semibold" style={{ color: '#ffffff' }}>{data.totalMonthly}</span>
              </div>
            </>
          )}
        </div>

        {/* Contract */}
        <div className="flex justify-center gap-12 mt-12">
          {data.depositMonths && (
            <div>
              <p className="text-sm" style={{ color: '#6b7280' }}>Caução</p>
              <p className="text-xl font-medium" style={{ color: '#d1d5db' }}>{data.depositMonths} meses</p>
            </div>
          )}
          {data.contractDuration && (
            <div>
              <p className="text-sm" style={{ color: '#6b7280' }}>Contrato</p>
              <p className="text-xl font-medium" style={{ color: '#d1d5db' }}>{data.contractDuration}</p>
            </div>
          )}
        </div>
      </div>

      {/* Logo */}
      <LocacaoLogoBarStory />
    </div>
  );
};
