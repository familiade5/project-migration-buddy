import { useState, useCallback } from 'react';
import { AMPropertyData, defaultAMPropertyData } from '@/types/apartamentosManaus';
import { AMPostPreview } from '@/components/apartamentos-manaus/AMPostPreview';
import { AMPropertyForm } from '@/components/apartamentos-manaus/AMPropertyForm';
import { AMLayout } from '@/components/layout/AMLayout';
import { PhotoUpload } from '@/components/PhotoUpload';
import { Image, Edit3, Sparkles, FileText, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AMLogoSVG } from '@/components/apartamentos-manaus/AMLogo';

const ApartamentosManausPage = () => {
  const [propertyData, setPropertyData] = useState<AMPropertyData>(defaultAMPropertyData);
  const [photos, setPhotos] = useState<string[]>([]);

  return (
    <AMLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <AMLogoSVG width={180} variant="color" />
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-medium shadow"
              style={{ backgroundColor: '#1B5EA6' }}
            >
              <Sparkles className="w-4 h-4" />
              <span>5 slides + story</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left – Input */}
          <div className="space-y-6">
            {/* Photos */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100" style={{ backgroundColor: '#F0F6FF' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg text-white" style={{ backgroundColor: '#1B5EA6' }}>
                    <Image className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Fotos do Imóvel</h2>
                    <p className="text-xs text-gray-500">Adicione até 6 fotos para os criativos</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <PhotoUpload photos={photos} onChange={setPhotos} onClear={() => setPhotos([])} />
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100" style={{ backgroundColor: '#FFF5ED' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg text-white" style={{ backgroundColor: '#F47920' }}>
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Dados do Imóvel</h2>
                    <p className="text-xs text-gray-500">Preencha as informações para gerar os posts</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <AMPropertyForm data={propertyData} onChange={setPropertyData} />
              </div>
            </div>
          </div>

          {/* Right – Preview */}
          <div className="lg:sticky lg:top-4 self-start">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100" style={{ backgroundColor: '#F0F6FF' }}>
                <h2 className="font-semibold text-gray-900">Preview dos Criativos</h2>
                <p className="text-xs text-gray-500">Visualize e baixe os slides prontos</p>
              </div>
              <div className="p-6 max-h-screen overflow-y-auto">
                <AMPostPreview data={propertyData} photos={photos} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AMLayout>
  );
};

export default ApartamentosManausPage;
