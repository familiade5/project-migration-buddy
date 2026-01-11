import { useState } from 'react';
import { PropertyData, defaultPropertyData } from '@/types/property';
import { PropertyForm } from '@/components/PropertyForm';
import { PhotoUpload } from '@/components/PhotoUpload';
import { PostPreview } from '@/components/PostPreview';
import { CaptionGenerator } from '@/components/CaptionGenerator';
import { Building2, Sparkles, Image, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [propertyData, setPropertyData] = useState<PropertyData>(defaultPropertyData);
  const [photos, setPhotos] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold text-foreground">PostGen</h1>
              <p className="text-xs text-muted-foreground">Gerador de Posts Imobiliários</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gold">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">8 posts + legenda</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Input */}
          <div className="space-y-8">
            <div className="glass-card rounded-2xl p-6">
              <PhotoUpload photos={photos} onChange={setPhotos} />
            </div>
            
            <div className="glass-card rounded-2xl p-6">
              <PropertyForm data={propertyData} onChange={setPropertyData} />
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <Tabs defaultValue="images" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-surface">
                <TabsTrigger value="images" className="gap-2 data-[state=active]:bg-gold data-[state=active]:text-primary-foreground">
                  <Image className="w-4 h-4" />
                  Imagens
                </TabsTrigger>
                <TabsTrigger value="caption" className="gap-2 data-[state=active]:bg-gold data-[state=active]:text-primary-foreground">
                  <FileText className="w-4 h-4" />
                  Legenda
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="images" className="mt-6">
                <div className="glass-card rounded-2xl p-6">
                  <PostPreview data={propertyData} photos={photos} />
                </div>
              </TabsContent>
              
              <TabsContent value="caption" className="mt-6">
                <div className="glass-card rounded-2xl p-6">
                  <CaptionGenerator data={propertyData} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Upload fotos + preencha dados → 8 imagens (Feed + Story) + legenda pronta para o Instagram</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
