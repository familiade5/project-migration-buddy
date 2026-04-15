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
  const [photoPositions, setPhotoPositions] = useState<Record<number, { x: number; y: number }>>({});
  const [photoScales, setPhotoScales] = useState<Record<number, number>>({});
  const [previewTab, setPreviewTab] = useState<'feed' | 'stories'>('feed');

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
                    <p className="text-xs text-gray-500 truncate">Adicione fotos — arraste para reordenar slides</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <AMPhotoManager photos={photos} onChange={setPhotos} photoPositions={photoPositions} onPositionsChange={setPhotoPositions} photoScales={photoScales} onScalesChange={setPhotoScales} />
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
                    <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Dados do Imóvel</h2>
                    <p className="text-xs text-gray-500">Preencha as informações para gerar os posts</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <AMPropertyForm data={propertyData} onChange={setPropertyData} />
              </div>
            </div>

            {/* Caption */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100" style={{ backgroundColor: '#F0F6FF' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: '#1B5EA6' }}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Legenda do Post</h2>
                    <p className="text-xs text-gray-500">Gerada automaticamente — edite conforme necessário</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <AMCaptionGenerator data={propertyData} />
              </div>
            </div>
          </div>

          {/* Right – Preview */}
          <div className="lg:sticky lg:top-6 self-start">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Tab selector */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100" style={{ backgroundColor: '#F0F6FF' }}>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Preview dos Criativos</h2>
                    <p className="text-xs text-gray-500 hidden sm:block">Visualize e baixe os slides prontos</p>
                  </div>
                  {/* Feed / Stories toggle */}
                  <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-200 shadow-sm flex-shrink-0">
                    <button
                      onClick={() => setPreviewTab('feed')}
                      className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                      style={previewTab === 'feed'
                        ? { backgroundColor: '#1B5EA6', color: 'white' }
                        : { color: '#6B7280' }}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      Feed
                    </button>
                    <button
                      onClick={() => setPreviewTab('stories')}
                      className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                      style={previewTab === 'stories'
                        ? { backgroundColor: '#F47920', color: 'white' }
                        : { color: '#6B7280' }}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      Stories
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {previewTab === 'feed' ? (
                  <AMPostPreview data={propertyData} photos={photos} photoPositions={photoPositions} photoScales={photoScales} />
                ) : (
                  <AMStoriesPreview data={propertyData} photos={photos} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AMLayout>
  );
};

export default ApartamentosManausPage;
