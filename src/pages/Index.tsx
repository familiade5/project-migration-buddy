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

const Index = () => {
  const [propertyData, setPropertyData] = useState<PropertyData>(defaultPropertyData);
  const [photos, setPhotos] = useState<string[]>([]);

  // Handler for extracted data from screenshot
  const handleExtractedData = useCallback((extractedData: Partial<PropertyData>) => {
    setPropertyData(prev => ({
      ...prev,
      ...extractedData
    }));
  }, []);

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground">Criar Post</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Gere posts profissionais para Instagram</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-gold">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">8 posts + legenda</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6 min-w-0">
            {/* 1. Screenshot Extractor - FIRST */}
            <div className="glass-card rounded-2xl p-4 sm:p-6 overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-gold" />
                <h2 className="font-semibold text-foreground">Extração Automática</h2>
              </div>
              <ScreenshotExtractor onExtract={handleExtractedData} />
            </div>

            {/* 2. Photos - Upload and Search - SECOND */}
            <div className="glass-card rounded-2xl p-4 sm:p-6 overflow-hidden">
              <Tabs defaultValue="upload" className="w-full">
                <div className="flex items-center gap-2 mb-4">
                  <Image className="w-5 h-5 text-gold" />
                  <h2 className="font-semibold text-foreground">Fotos do Imóvel</h2>
                </div>
                <TabsList className="grid w-full grid-cols-2 bg-surface mb-4">
                  <TabsTrigger 
                    value="upload" 
                    className="gap-2 text-xs sm:text-sm data-[state=active]:bg-gold data-[state=active]:text-primary-foreground"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Manual
                  </TabsTrigger>
                  <TabsTrigger 
                    value="search" 
                    className="gap-2 text-xs sm:text-sm data-[state=active]:bg-gold data-[state=active]:text-primary-foreground"
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

            {/* 3. Manual Property Form - THIRD */}
            <div className="glass-card rounded-2xl p-4 sm:p-6 overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <Edit3 className="w-5 h-5 text-gold" />
                <h2 className="font-semibold text-foreground">Preenchimento Manual</h2>
              </div>
              <PropertyForm data={propertyData} onChange={setPropertyData} />
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-4 space-y-6 min-w-0">
            <Tabs defaultValue="images" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-surface">
                <TabsTrigger value="images" className="gap-2 text-xs sm:text-sm data-[state=active]:bg-gold data-[state=active]:text-primary-foreground">
                  <Image className="w-4 h-4" />
                  Imagens
                </TabsTrigger>
                <TabsTrigger value="caption" className="gap-2 text-xs sm:text-sm data-[state=active]:bg-gold data-[state=active]:text-primary-foreground">
                  <FileText className="w-4 h-4" />
                  Legenda
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="images" className="mt-4 lg:mt-6">
                <div className="glass-card rounded-2xl p-4 sm:p-6 overflow-hidden">
                  <PostPreview data={propertyData} photos={photos} />
                </div>
              </TabsContent>
              
              <TabsContent value="caption" className="mt-4 lg:mt-6">
                <div className="glass-card rounded-2xl p-4 sm:p-6 overflow-hidden">
                  <CaptionGenerator data={propertyData} />
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Mobile indicator */}
            <div className="sm:hidden flex items-center justify-center gap-2 text-gold py-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">8 posts + legenda</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
