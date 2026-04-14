import { useState, useCallback } from 'react';
import { PropertyData, defaultPropertyData } from '@/types/property';
import { PropertyForm } from '@/components/PropertyForm';
import { PhotoUpload } from '@/components/PhotoUpload';
import { PostPreview } from '@/components/PostPreview';
import { CaptionGenerator } from '@/components/CaptionGenerator';
import { ScreenshotExtractor } from '@/components/ScreenshotExtractor';
import { PhotoSearcher } from '@/components/PhotoSearcher';
import { Sparkles, Image, FileText, Upload, Edit3, Search } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useModuleActivity } from '@/hooks/useModuleActivity';

const BRAND_BLUE = '#1a3a6b';
const BRAND_GOLD = '#c9a84c';

const Index = () => {
  useModuleActivity('Criar Post');
  
  const [propertyData, setPropertyData] = useState<PropertyData>(defaultPropertyData);
  const [photos, setPhotos] = useState<string[]>([]);
  const [photosTab, setPhotosTab] = useState<'upload' | 'search'>('upload');
  const [previewTab, setPreviewTab] = useState<'images' | 'caption'>('images');

  const handleExtractedData = useCallback((extractedData: Partial<PropertyData>) => {
    setPropertyData(prev => ({ ...prev, ...extractedData }));
  }, []);

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: BRAND_BLUE }}>
              Criar Post
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">Gere posts profissionais para Instagram</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium shadow"
            style={{ backgroundColor: BRAND_GOLD }}>
            <Sparkles className="w-4 h-4" />
            <span>8 posts + legenda</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="space-y-4 min-w-0">

            {/* 1. Screenshot Extractor */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100" style={{ backgroundColor: '#EEF2FF' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: BRAND_BLUE }}>
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Extração Automática</h2>
                    <p className="text-xs text-gray-500">Cole screenshot de anúncio para preencher automaticamente</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <ScreenshotExtractor onExtract={handleExtractedData} />
              </div>
            </div>

            {/* 2. Fotos */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100" style={{ backgroundColor: '#FEF9EE' }}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: BRAND_GOLD }}>
                      <Image className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Fotos do Imóvel</h2>
                      <p className="text-xs text-gray-500">Adicione fotos ou busque online</p>
                    </div>
                  </div>
                  {/* Tab toggle */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 flex-shrink-0">
                    <button
                      onClick={() => setPhotosTab('upload')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                      style={photosTab === 'upload'
                        ? { backgroundColor: BRAND_BLUE, color: 'white' }
                        : { color: '#6B7280' }}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload
                    </button>
                    <button
                      onClick={() => setPhotosTab('search')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                      style={photosTab === 'search'
                        ? { backgroundColor: BRAND_BLUE, color: 'white' }
                        : { color: '#6B7280' }}
                    >
                      <Search className="w-3.5 h-3.5" />
                      Buscar
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {photosTab === 'upload' ? (
                  <PhotoUpload photos={photos} onChange={setPhotos} onClear={() => setPhotos([])} />
                ) : (
                  <PhotoSearcher
                    address={propertyData.fullAddress || [
                      propertyData.street,
                      propertyData.number,
                      propertyData.neighborhood,
                      propertyData.city,
                      propertyData.state
                    ].filter(Boolean).join(', ')}
                    propertyType={propertyData.type}
                    onPhotosSelected={(selectedPhotos) => {
                      setPhotos(prev => [...prev, ...selectedPhotos].slice(0, 10));
                    }}
                    onCondominiumFound={(name) => {
                      setPropertyData(prev => ({ ...prev, propertyName: name }));
                    }}
                    onClear={() => setPhotos([])}
                  />
                )}
              </div>
            </div>

            {/* 3. Formulário */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100" style={{ backgroundColor: '#EEF2FF' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: BRAND_BLUE }}>
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Preenchimento Manual</h2>
                    <p className="text-xs text-gray-500">Preencha as informações do imóvel</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <PropertyForm data={propertyData} onChange={setPropertyData} />
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-6 self-start space-y-4 min-w-0 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100" style={{ backgroundColor: '#EEF2FF' }}>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Preview dos Criativos</h2>
                    <p className="text-xs text-gray-500 hidden sm:block">Visualize e baixe os slides prontos</p>
                  </div>
                  {/* Preview tab toggle */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 flex-shrink-0">
                    <button
                      onClick={() => setPreviewTab('images')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                      style={previewTab === 'images'
                        ? { backgroundColor: BRAND_BLUE, color: 'white' }
                        : { color: '#6B7280' }}
                    >
                      <Image className="w-3.5 h-3.5" />
                      Imagens
                    </button>
                    <button
                      onClick={() => setPreviewTab('caption')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                      style={previewTab === 'caption'
                        ? { backgroundColor: BRAND_GOLD, color: 'white' }
                        : { color: '#6B7280' }}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Legenda
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {previewTab === 'images' ? (
                  <PostPreview data={propertyData} photos={photos} />
                ) : (
                  <CaptionGenerator data={propertyData} />
                )}
              </div>
            </div>

            {/* Mobile badge */}
            <div className="sm:hidden flex items-center justify-center gap-2 py-2 text-sm font-medium"
              style={{ color: BRAND_GOLD }}>
              <Sparkles className="w-4 h-4" />
              <span>8 posts + legenda</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
