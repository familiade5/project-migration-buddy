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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-slate-900">PostGen</h1>
                <p className="text-xs text-slate-500">Gerador de Posts Imobiliários</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Sparkles className="h-4 w-4 text-amber-500" />
              8 posts + legenda
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <div className="lg:sticky lg:top-24">
              <PhotoUpload photos={photos} onPhotosChange={setPhotos} />
            </div>
            <div className="lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto lg:pr-2">
              <PropertyForm data={propertyData} onChange={setPropertyData} />
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Tabs defaultValue="images" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="images" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Imagens
                </TabsTrigger>
                <TabsTrigger value="caption" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Legenda
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="images" className="mt-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                  <PostPreview data={propertyData} photos={photos} />
                </div>
              </TabsContent>
              
              <TabsContent value="caption" className="mt-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                  <CaptionGenerator data={propertyData} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-sm text-slate-500">
            Upload fotos + preencha dados → 8 imagens (Feed + Story) + legenda pronta para o Instagram
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
