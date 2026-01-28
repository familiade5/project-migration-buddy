import { useState, useCallback } from 'react';
import { PropertyData, defaultPropertyData } from '@/types/property';
import { PropertyForm } from '@/components/PropertyForm';
import { PhotoUpload } from '@/components/PhotoUpload';
import { ElitePostPreview } from '@/components/elite/ElitePostPreview';
import { CaptionGenerator } from '@/components/CaptionGenerator';
import { ScreenshotExtractor } from '@/components/ScreenshotExtractor';
import { PhotoSearcher } from '@/components/PhotoSearcher';
import { Home, Image, FileText, Upload, Edit3, Search, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EliteLayout } from '@/components/layout/EliteLayout';
import { useModuleActivity } from '@/hooks/useModuleActivity';
import logoPatrimoniar from '@/assets/logo-patrimoniar.svg';

const ElitePostGenerator = () => {
  // Log module access
  useModuleActivity('Patrimoniar Imóveis');
  
  const [propertyData, setPropertyData] = useState<PropertyData>(defaultPropertyData);
  const [photos, setPhotos] = useState<string[]>([]);

  const handleExtractedData = useCallback((extractedData: Partial<PropertyData>) => {
    setPropertyData(prev => ({
      ...prev,
      ...extractedData
    }));
  }, []);

  return (
    <EliteLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img src={logoPatrimoniar} alt="Patrimoniar" className="h-12 w-auto" />
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 tracking-tight">
                Patrimoniar Imóveis
              </h1>
            </div>
            <p className="text-sm text-gray-500 ml-14">Gerador de Posts Premium para Imóveis de Alto Padrão</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2B4D]/5 border border-[#2D2B4D]/10">
            <Sparkles className="w-4 h-4 text-[#BA9E72]" />
            <span className="text-sm font-medium text-[#2D2B4D]">10 posts + legenda</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6 min-w-0">
            {/* 1. Screenshot Extractor */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-[#BA9E72]" />
                <h2 className="font-semibold text-gray-900">Extração Automática</h2>
              </div>
              <ScreenshotExtractor onExtract={handleExtractedData} />
            </div>

            {/* 2. Photos */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 overflow-hidden shadow-sm">
              <Tabs defaultValue="upload" className="w-full">
                <div className="flex items-center gap-2 mb-4">
                  <Image className="w-5 h-5 text-[#BA9E72]" />
                  <h2 className="font-semibold text-gray-900">Fotos do Imóvel</h2>
                </div>
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 mb-4">
                  <TabsTrigger 
                    value="upload" 
                    className="gap-2 text-xs sm:text-sm data-[state=active]:bg-[#2D2B4D] data-[state=active]:text-white"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Manual
                  </TabsTrigger>
                  <TabsTrigger 
                    value="search" 
                    className="gap-2 text-xs sm:text-sm data-[state=active]:bg-[#2D2B4D] data-[state=active]:text-white"
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
                      setPhotos(prev => [...prev, ...selectedPhotos].slice(0, 10));
                    }}
                    onCondominiumFound={(name) => {
                      setPropertyData(prev => ({
                        ...prev,
                        propertyName: name
                      }));
                    }}
                    onClear={() => setPhotos([])}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* 3. Manual Form */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Edit3 className="w-5 h-5 text-[#BA9E72]" />
                <h2 className="font-semibold text-gray-900">Preenchimento Manual</h2>
              </div>
              <PropertyForm data={propertyData} onChange={setPropertyData} />
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-4 space-y-6 min-w-0">
            <Tabs defaultValue="images" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger 
                  value="images" 
                  className="gap-2 text-xs sm:text-sm data-[state=active]:bg-[#2D2B4D] data-[state=active]:text-white"
                >
                  <Image className="w-4 h-4" />
                  Imagens
                </TabsTrigger>
                <TabsTrigger 
                  value="caption" 
                  className="gap-2 text-xs sm:text-sm data-[state=active]:bg-[#2D2B4D] data-[state=active]:text-white"
                >
                  <FileText className="w-4 h-4" />
                  Legenda
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="images" className="mt-4 lg:mt-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 overflow-hidden shadow-sm">
                  <ElitePostPreview data={propertyData} photos={photos} />
                </div>
              </TabsContent>
              
              <TabsContent value="caption" className="mt-4 lg:mt-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 overflow-hidden shadow-sm">
                  <CaptionGenerator data={propertyData} />
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Mobile indicator */}
            <div className="sm:hidden flex items-center justify-center gap-2 py-2">
              <div className="px-4 py-2 rounded-full bg-[#2D2B4D]/5 border border-[#2D2B4D]/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#BA9E72]" />
                  <span className="text-sm font-medium text-[#2D2B4D]">10 posts + legenda</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EliteLayout>
  );
};

export default ElitePostGenerator;
