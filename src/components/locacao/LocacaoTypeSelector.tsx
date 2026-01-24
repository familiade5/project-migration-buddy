import { LocacaoCreativeType } from '@/types/locacao';
import { Home, Building2 } from 'lucide-react';
import { LocacaoLogo } from './LocacaoLogo';

interface LocacaoTypeSelectorProps {
  onSelect: (type: LocacaoCreativeType) => void;
}

export const LocacaoTypeSelector = ({ onSelect }: LocacaoTypeSelectorProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: '#f9fafb' }}>
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <LocacaoLogo size="xl" variant="dark" className="justify-center mx-auto" />
          <div className="mt-6">
            <h1 className="text-2xl font-semibold" style={{ color: '#111827' }}>
              Locação & Gestão
            </h1>
            <p className="mt-2 text-base" style={{ color: '#6b7280' }}>
              Comunicação profissional para locação de imóveis
            </p>
          </div>
        </div>

        {/* Selection */}
        <div className="bg-white rounded-2xl p-8 shadow-sm" style={{ border: '1px solid #e5e7eb' }}>
          <h2 className="text-lg font-medium text-center mb-6" style={{ color: '#374151' }}>
            O que você deseja criar?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Property for Rent */}
            <button
              onClick={() => onSelect('property')}
              className="group p-6 rounded-xl text-left transition-all hover:shadow-md"
              style={{ 
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
              }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors group-hover:bg-gray-200"
                style={{ backgroundColor: '#e5e7eb' }}
              >
                <Home className="w-6 h-6" style={{ color: '#374151' }} />
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: '#111827' }}>
                Imóvel para Locação
              </h3>
              <p className="text-sm" style={{ color: '#6b7280' }}>
                Divulgue um imóvel disponível para aluguel com clareza e profissionalismo.
              </p>
            </button>

            {/* Management Service */}
            <button
              onClick={() => onSelect('management')}
              className="group p-6 rounded-xl text-left transition-all hover:shadow-md"
              style={{ 
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
              }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors group-hover:bg-gray-200"
                style={{ backgroundColor: '#e5e7eb' }}
              >
                <Building2 className="w-6 h-6" style={{ color: '#374151' }} />
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: '#111827' }}>
                Serviço de Gestão
              </h3>
              <p className="text-sm" style={{ color: '#6b7280' }}>
                Promova seu serviço de administração de locação para proprietários e investidores.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
