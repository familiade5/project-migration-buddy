import { useState, useCallback } from 'react';
import { 
  EducationalPostData, 
  defaultEducationalPostData, 
  defaultTopics,
  EducationalTopic,
  EducationalCategory 
} from '@/types/educational';
import { EducationalTopicSelector } from '@/components/educational/EducationalTopicSelector';
import { EducationalSlideEditor } from '@/components/educational/EducationalSlideEditor';
import { EducationalPostPreview } from '@/components/educational/EducationalPostPreview';
import { EducationalCaptionGenerator } from '@/components/educational/EducationalCaptionGenerator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, Edit3, LayoutGrid, FileText, User, Phone, BadgeCheck, Sparkles 
} from 'lucide-react';
import { EliteLayout } from '@/components/layout/EliteLayout';
import { useModuleActivity } from '@/hooks/useModuleActivity';
import logoVDH from '@/assets/logo-vdh-revenda.png';

const EducationalPostGenerator = () => {
  useModuleActivity('Posts Educativos');
  
  const [postData, setPostData] = useState<EducationalPostData>(defaultEducationalPostData);

  const handleCategoryChange = useCallback((category: EducationalCategory) => {
    setPostData(prev => ({ ...prev, category }));
  }, []);

  const handleTopicChange = useCallback((topic: EducationalTopic) => {
    setPostData(prev => ({
      ...prev,
      topicId: topic.id,
      slides: [...topic.defaultSlides],
    }));
  }, []);

  return (
    <EliteLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={logoVDH} alt="Venda Direta Hoje" className="h-12 w-auto" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  Posts Educativos
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Conteúdo educacional e institucional para Instagram
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-900 text-white shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Carrossel + Stories</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Topic Selector */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#BA9E72] text-white">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Escolha o Tema</h2>
                    <p className="text-xs text-gray-500">Selecione a categoria e o tópico do post</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <EducationalTopicSelector
                  selectedCategory={postData.category}
                  selectedTopicId={postData.topicId}
                  onCategoryChange={handleCategoryChange}
                  onTopicChange={handleTopicChange}
                />
              </div>
            </div>

            {/* Slide Editor */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-900 text-white">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Editar Conteúdo</h2>
                    <p className="text-xs text-gray-500">Personalize os slides do seu post</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <EducationalSlideEditor
                  slides={postData.slides}
                  onChange={(slides) => setPostData(prev => ({ ...prev, slides }))}
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-900 text-white">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Informações de Contato</h2>
                    <p className="text-xs text-gray-500">Exibidas no slide final</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600 flex items-center gap-2">
                      <User className="w-3.5 h-3.5" />
                      Nome
                    </Label>
                    <Input
                      value={postData.contactName}
                      onChange={(e) => setPostData(prev => ({ ...prev, contactName: e.target.value }))}
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" />
                      Telefone
                    </Label>
                    <Input
                      value={postData.contactPhone}
                      onChange={(e) => setPostData(prev => ({ ...prev, contactPhone: e.target.value }))}
                      placeholder="(67) 99999-9999"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600 flex items-center gap-2">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    CRECI
                  </Label>
                  <Input
                    value={postData.creci}
                    onChange={(e) => setPostData(prev => ({ ...prev, creci: e.target.value }))}
                    placeholder="CRECI-MS 00000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-4 space-y-6 self-start">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <Tabs defaultValue="preview" className="w-full">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger 
                      value="preview" 
                      className="gap-2 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                    >
                      <LayoutGrid className="w-4 h-4" />
                      Visualização
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
                
                <TabsContent value="preview" className="mt-0 p-6">
                  <EducationalPostPreview data={postData} />
                </TabsContent>
                
                <TabsContent value="caption" className="mt-0 p-6">
                  <EducationalCaptionGenerator data={postData} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </EliteLayout>
  );
};

export default EducationalPostGenerator;
