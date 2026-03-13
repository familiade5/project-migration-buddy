import { useState } from 'react';
import { AMPropertyData, defaultAMPropertyData } from '@/types/apartamentosManaus';
import { AMPostPreview } from '@/components/apartamentos-manaus/AMPostPreview';
import { AMStoriesPreview } from '@/components/apartamentos-manaus/AMStoriesPreview';
import { AMPropertyForm } from '@/components/apartamentos-manaus/AMPropertyForm';
import { AMCaptionGenerator } from '@/components/apartamentos-manaus/AMCaptionGenerator';
import { AMPhotoManager } from '@/components/apartamentos-manaus/AMPhotoManager';
import { AMLayout } from '@/components/layout/AMLayout';
import { Image, Edit3, Sparkles, FileText, LayoutGrid, Smartphone } from 'lucide-react';

const ApartamentosManausPage = () => {
  const [propertyData, setPropertyData] = useState<AMPropertyData>(defaultAMPropertyData);
  const [photos, setPhotos] = useState<string[]>([]);

  return (
    <AMLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Gerador de Posts</h1>
            <p className="text-sm text-gray-500">Crie criativos profissionais para Instagram</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-medium shadow"
            style={{ backgroundColor: '#1B5EA6' }}>
            <Sparkles className="w-4 h-4" />
            <span>Feed + Story + Legenda</span>
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
                     <p className="text-xs text-gray-500">Adicione fotos — arraste para reordenar slides</p>
                   </div>
                 </div>
               </div>
               <div className="p-6">
                 <AMPhotoManager photos={photos} onChange={setPhotos} />
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

            {/* Caption */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100" style={{ backgroundColor: '#F0F6FF' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg text-white" style={{ backgroundColor: '#1B5EA6' }}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Legenda do Post</h2>
                    <p className="text-xs text-gray-500">Gerada automaticamente — edite conforme necessário</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <AMCaptionGenerator data={propertyData} />
              </div>
            </div>
          </div>

          {/* Right – Preview */}
          <div className="lg:sticky lg:top-6 self-start">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100" style={{ backgroundColor: '#F0F6FF' }}>
                <h2 className="font-semibold text-gray-900">Preview dos Criativos</h2>
                <p className="text-xs text-gray-500">Visualize e baixe os slides prontos</p>
              </div>
              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
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
