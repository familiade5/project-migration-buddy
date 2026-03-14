import { useState, useCallback } from 'react';
import { PropertyData, defaultPropertyData } from '@/types/property';
import { PropertyForm } from '@/components/PropertyForm';
import { PhotoUpload } from '@/components/PhotoUpload';
import { PostPreview } from '@/components/PostPreview';
import { CaptionGenerator } from '@/components/CaptionGenerator';
import { ScreenshotExtractor } from '@/components/ScreenshotExtractor';
import { PhotoSearcher } from '@/components/PhotoSearcher';
import { Sparkles, Image, FileText, Upload, Edit3, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppLayout } from '@/components/layout/AppLayout';
import { useModuleActivity } from '@/hooks/useModuleActivity';

const BRAND_BLUE = '#1a3a6b';
const BRAND_GOLD = '#c9a84c';

const Index = () => {
  useModuleActivity('Criar Post');
  
  const [propertyData, setPropertyData] = useState<PropertyData>(defaultPropertyData);
  const [photos, setPhotos] = useState<string[]>([]);

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
          {/* Left Column - Input */}
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

            {/* 2. Photos */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100" style={{ backgroundColor: '#FEF9EE' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: BRAND_GOLD }}>
                    <Image className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Fotos do Imóvel</h2>
                    <p className="text-xs text-gray-500">Adicione fotos ou busque online</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4" style={{ backgroundColor: '#F3F4F6' }}>
                    <TabsTrigger
                      value="upload"
                      className="gap-2 text-xs sm:text-sm data-[state=active]:text-white"
                      style={{ '--tw-ring-color': BRAND_BLUE } as React.CSSProperties}
                    >
                      <Upload className="w-4 h-4" />
                      Upload Manual
                    </TabsTrigger>
                    <TabsTrigger
                      value="search"
                      className="gap-2 text-xs sm:text-sm data-[state=active]:text-white"
                    >
                      <Search className="w-4 h-4" />
                      Buscar Fotos
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="mt-0">
                    <PhotoUpload photos={photos} onChange={setPhotos} onClear={() => setPhotos([])} />
                  </TabsContent>
                  <TabsContent value="search" className="mt-0">
                    <PhotoSearcher
                      address={propertyData.fullAddress || `${propertyData.street}, ${propertyData.neighborhood}, ${propertyData.city} - ${propertyData.state}`}
                      propertyType={propertyData.type}
                      onPhotosSelected={(selectedPhotos) => {
                        setPhotos(prev => [...prev, ...selectedPhotos].slice(0, 4));
                      }}
                      onCondominiumFound={(name) => {
                        setPropertyData(prev => ({ ...prev, propertyName: name }));
                      }}
                      onClear={() => setPhotos([])}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* 3. Manual Form */}
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
          <div className="lg:sticky lg:top-6 self-start space-y-4 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100" style={{ backgroundColor: '#EEF2FF' }}>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Preview dos Criativos</h2>
                    <p className="text-xs text-gray-500 hidden sm:block">Visualize e baixe os slides prontos</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs font-medium"
                    style={{ backgroundColor: BRAND_GOLD }}>
                    <Sparkles className="w-3.5 h-3.5" />
                    8 posts + legenda
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <Tabs defaultValue="images" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4" style={{ backgroundColor: '#F3F4F6' }}>
                    <TabsTrigger value="images" className="gap-2 text-xs sm:text-sm">
                      <Image className="w-4 h-4" />
                      Imagens
                    </TabsTrigger>
                    <TabsTrigger value="caption" className="gap-2 text-xs sm:text-sm">
                      <FileText className="w-4 h-4" />
                      Legenda
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="images" className="mt-0">
                    <PostPreview data={propertyData} photos={photos} />
                  </TabsContent>
                  <TabsContent value="caption" className="mt-0">
                    <CaptionGenerator data={propertyData} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Mobile indicator */}
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
