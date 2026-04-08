import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TrafegoPropertyData, defaultTrafegoData } from '@/types/trafegoPago';
import { TrafegoForm } from '@/components/trafego-pago/TrafegoForm';
import { TrafegoPreview } from '@/components/trafego-pago/TrafegoPreview';
import { AMPhotoManager } from '@/components/apartamentos-manaus/AMPhotoManager';
import { AMLayout } from '@/components/layout/AMLayout';
import { Image, Edit3, Sparkles, Zap } from 'lucide-react';

const MASTER_EMAIL = 'neto@vendadiretahoje.com.br';

const TrafegoPagoPage = () => {
  const [propertyData, setPropertyData] = useState<TrafegoPropertyData>(defaultTrafegoData);
  const [photos, setPhotos] = useState<string[]>([]);

  return (
    <AMLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Criativos para Tráfego Pago</h1>
            <p className="text-sm text-gray-500">Gere 10 criativos únicos para suas campanhas</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-medium shadow"
            style={{ background: 'linear-gradient(135deg, #F47920, #e85d10)' }}>
            <Zap className="w-4 h-4" />
            <span>10 Criativos Únicos</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Left – Input */}
          <div className="space-y-4">
            {/* Photos */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100" style={{ backgroundColor: '#F0F6FF' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: '#1B5EA6' }}>
                    <Image className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Fotos do Imóvel</h2>
                    <p className="text-xs text-gray-500 truncate">Quanto mais fotos, mais variados os criativos</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <AMPhotoManager photos={photos} onChange={setPhotos} />
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100" style={{ backgroundColor: '#FFF5ED' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: '#F47920' }}>
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Dados do Imóvel & Campanha</h2>
                    <p className="text-xs text-gray-500">Preencha as informações para gerar os criativos</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <TrafegoForm data={propertyData} onChange={setPropertyData} />
              </div>
            </div>
          </div>

          {/* Right – Preview */}
          <div className="lg:sticky lg:top-6 self-start">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100" style={{ backgroundColor: '#F0F6FF' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: '#1B5EA6' }}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Preview dos Criativos</h2>
                    <p className="text-xs text-gray-500 hidden sm:block">Escolha o design e exporte os criativos prontos</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <TrafegoPreview data={propertyData} photos={photos} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AMLayout>
  );
};

export default TrafegoPagoPage;
