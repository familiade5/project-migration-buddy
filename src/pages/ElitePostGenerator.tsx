import { useState, useCallback } from 'react';
import { PropertyData, defaultPropertyData } from '@/types/property';
import { PropertyForm } from '@/components/PropertyForm';
import { PhotoUpload } from '@/components/PhotoUpload';
import { ElitePostPreview } from '@/components/elite/ElitePostPreview';
import { CaptionGenerator } from '@/components/CaptionGenerator';
import { ScreenshotExtractor } from '@/components/ScreenshotExtractor';
import { PhotoSearcher } from '@/components/PhotoSearcher';
import { Image, FileText, Upload, Edit3, Search, Sparkles, LayoutGrid } from 'lucide-react';
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
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={logoPatrimoniar} alt="Patrimoniar Imóveis" className="h-14 w-auto" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  Patrimoniar Imóveis
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">Gerador de Posts Premium para Imóveis de Alto Padrão</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-900 text-white shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">10 posts + legenda</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* 1. Screenshot Extractor */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-900 text-white">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Extração Automática</h2>
                    <p className="text-xs text-gray-500">Envie um screenshot para preenchimento automático</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ScreenshotExtractor onExtract={handleExtractedData} />
              </div>
            </div>

            {/* 2. Photos */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-900 text-white">
                    <Image className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Fotos do Imóvel</h2>
                    <p className="text-xs text-gray-500">Adicione até 10 fotos para os criativos</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg mb-4">
                    <TabsTrigger 
                      value="upload" 
                      className="gap-2 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Manual
                    </TabsTrigger>
                    <TabsTrigger 
                      value="search" 
                      className="gap-2 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
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
            </div>

            {/* 3. Manual Form */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-900 text-white">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Dados do Imóvel</h2>
                    <p className="text-xs text-gray-500">Preencha ou ajuste as informações manualmente</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <PropertyForm data={propertyData} onChange={setPropertyData} />
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-4 space-y-6 self-start">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <Tabs defaultValue="images" className="w-full">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger 
                      value="images" 
                      className="gap-2 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                    >
                      <LayoutGrid className="w-4 h-4" />
                      Criativos
                    </TabsTrigger>
                    <TabsTrigger 
                      value="caption" 
                      className="gap-2 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Legenda
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="images" className="mt-0 p-6">
                  <ElitePostPreview data={propertyData} photos={photos} />
                </TabsContent>
                
                <TabsContent value="caption" className="mt-0 p-6">
                  <CaptionGenerator data={propertyData} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </EliteLayout>
  );
};

export default ElitePostGenerator;
