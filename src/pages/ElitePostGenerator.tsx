import { useState, useCallback } from 'react';
import { PropertyData, defaultPropertyData } from '@/types/property';
import { PropertyForm } from '@/components/PropertyForm';
import { PhotoUpload } from '@/components/PhotoUpload';
import { ElitePostPreview } from '@/components/elite/ElitePostPreview';
import { CaptionGenerator } from '@/components/CaptionGenerator';
import { ScreenshotExtractor } from '@/components/ScreenshotExtractor';
import { PhotoSearcher } from '@/components/PhotoSearcher';
import { Crown, Image, FileText, Upload, Edit3, Search, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EliteLayout } from '@/components/layout/EliteLayout';

const ElitePostGenerator = () => {
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
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-950" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
                Élite Imóveis
              </h1>
            </div>
            <p className="text-sm text-muted-foreground ml-14">Gerador de Posts Premium para Imóveis de Alto Padrão</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">8 posts + legenda</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6 min-w-0">
            {/* 1. Screenshot Extractor */}
            <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-card to-card/80 p-4 sm:p-6 overflow-hidden shadow-xl shadow-amber-500/5">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-amber-400" />
                <h2 className="font-semibold text-foreground">Extração Automática</h2>
              </div>
              <ScreenshotExtractor onExtract={handleExtractedData} />
            </div>

            {/* 2. Photos */}
            <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-card to-card/80 p-4 sm:p-6 overflow-hidden shadow-xl shadow-amber-500/5">
              <Tabs defaultValue="upload" className="w-full">
                <div className="flex items-center gap-2 mb-4">
                  <Image className="w-5 h-5 text-amber-400" />
                  <h2 className="font-semibold text-foreground">Fotos do Imóvel</h2>
                </div>
                <TabsList className="grid w-full grid-cols-2 bg-background/50 mb-4">
                  <TabsTrigger 
                    value="upload" 
                    className="gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-amber-950"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Manual
                  </TabsTrigger>
                  <TabsTrigger 
                    value="search" 
                    className="gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-amber-950"
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
            <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-card to-card/80 p-4 sm:p-6 overflow-hidden shadow-xl shadow-amber-500/5">
              <div className="flex items-center gap-2 mb-4">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h2 className="font-semibold text-foreground">Preenchimento Manual</h2>
              </div>
              <PropertyForm data={propertyData} onChange={setPropertyData} />
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-4 space-y-6 min-w-0">
            <Tabs defaultValue="images" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-background/50">
                <TabsTrigger 
                  value="images" 
                  className="gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-amber-950"
                >
                  <Image className="w-4 h-4" />
                  Imagens
                </TabsTrigger>
                <TabsTrigger 
                  value="caption" 
                  className="gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-amber-950"
                >
                  <FileText className="w-4 h-4" />
                  Legenda
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="images" className="mt-4 lg:mt-6">
                <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-card to-card/80 p-4 sm:p-6 overflow-hidden shadow-xl shadow-amber-500/5">
                  <ElitePostPreview data={propertyData} photos={photos} />
                </div>
              </TabsContent>
              
              <TabsContent value="caption" className="mt-4 lg:mt-6">
                <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-card to-card/80 p-4 sm:p-6 overflow-hidden shadow-xl shadow-amber-500/5">
                  <CaptionGenerator data={propertyData} />
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Mobile indicator */}
            <div className="sm:hidden flex items-center justify-center gap-2 py-2">
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-amber-400">8 posts + legenda</span>
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
