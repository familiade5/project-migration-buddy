import { useState } from 'react';
import { PropertyData, defaultPropertyData } from '@/types/property';
import { PropertyForm } from '@/components/PropertyForm';
import { PhotoUpload } from '@/components/PhotoUpload';
import { PostPreview } from '@/components/PostPreview';
import { CaptionGenerator } from '@/components/CaptionGenerator';
import { Sparkles, Image, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppLayout } from '@/components/layout/AppLayout';

const Index = () => {
  const [propertyData, setPropertyData] = useState<PropertyData>(defaultPropertyData);
  const [photos, setPhotos] = useState<string[]>([]);

  return (
    <AppLayout>
      <div className="p-4 lg:p-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-semibold text-foreground">Criar Post</h1>
            <p className="text-sm text-muted-foreground">Gere posts profissionais para Instagram</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-gold">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">8 posts + legenda</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-4 lg:p-6">
              <PhotoUpload photos={photos} onChange={setPhotos} />
            </div>
            
            <div className="glass-card rounded-2xl p-4 lg:p-6">
              <PropertyForm data={propertyData} onChange={setPropertyData} />
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <Tabs defaultValue="images" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-surface">
                <TabsTrigger value="images" className="gap-2 data-[state=active]:bg-gold data-[state=active]:text-primary-foreground">
                  <Image className="w-4 h-4" />
                  <span className="hidden sm:inline">Imagens</span>
                  <span className="sm:hidden">Imgs</span>
                </TabsTrigger>
                <TabsTrigger value="caption" className="gap-2 data-[state=active]:bg-gold data-[state=active]:text-primary-foreground">
                  <FileText className="w-4 h-4" />
                  Legenda
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="images" className="mt-4 lg:mt-6">
                <div className="glass-card rounded-2xl p-4 lg:p-6">
                  <PostPreview data={propertyData} photos={photos} />
                </div>
              </TabsContent>
              
              <TabsContent value="caption" className="mt-4 lg:mt-6">
                <div className="glass-card rounded-2xl p-4 lg:p-6">
                  <CaptionGenerator data={propertyData} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Mobile indicator */}
        <div className="sm:hidden mt-6 flex items-center justify-center gap-2 text-gold">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">8 posts + legenda</span>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
