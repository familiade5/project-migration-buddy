import { useState, useCallback, useEffect } from 'react';
import { 
  EducationalPostData, 
  defaultEducationalPostData, 
  EducationalTopic,
  EducationalCategory,
  EducationalSlide,
  defaultTopics 
} from '@/types/educational';
import { EducationalTopicSelector } from '@/components/educational/EducationalTopicSelector';
import { EducationalSlideEditor } from '@/components/educational/EducationalSlideEditor';
import { EducationalPostPreview } from '@/components/educational/EducationalPostPreview';
import { EducationalCaptionGenerator } from '@/components/educational/EducationalCaptionGenerator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, Edit3, LayoutGrid, FileText, User, Phone, BadgeCheck, Sparkles, Save, Check, RefreshCw, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { EliteLayout } from '@/components/layout/EliteLayout';
import { useModuleActivity } from '@/hooks/useModuleActivity';
import { useCrecis } from '@/hooks/useCrecis';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import logoVDH from '@/assets/logo-vdh-revenda.png';

const STORAGE_KEY = 'educational-contact-defaults';

const EducationalPostGenerator = () => {
  useModuleActivity('Posts Educativos');
  
  const { profile } = useAuth();
  const { crecis, defaultCreci, formatCreci } = useCrecis();
  
  const [postData, setPostData] = useState<EducationalPostData>(defaultEducationalPostData);
  const [saved, setSaved] = useState(false);
  const [agencyPhone, setAgencyPhone] = useState('');
  
  // History for content generation
  const [slideHistory, setSlideHistory] = useState<EducationalSlide[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Fetch agency data for phone
  useEffect(() => {
    const fetchAgency = async () => {
      const { data } = await supabase.from('real_estate_agency').select('phone').limit(1).single();
      if (data?.phone) setAgencyPhone(data.phone);
    };
    fetchAgency();
  }, []);

  // Auto-fill contact info from profile, agency and default CRECI
  useEffect(() => {
    if (profile?.full_name || agencyPhone || defaultCreci) {
      setPostData(prev => ({
        ...prev,
        contactName: prev.contactName || profile?.full_name?.split(' - ')[0] || '',
        contactPhone: prev.contactPhone || agencyPhone || '',
        creci: prev.creci || (defaultCreci ? `CRECI ${defaultCreci}` : ''),
      }));
    }
  }, [profile, agencyPhone, defaultCreci]);

  const handleCategoryChange = useCallback((category: EducationalCategory) => {
    setPostData(prev => ({ ...prev, category }));
  }, []);

  const handleTopicChange = useCallback((topic: EducationalTopic) => {
    // Reset history when topic changes
    setSlideHistory([]);
    setHistoryIndex(-1);
    setPostData(prev => ({
      ...prev,
      topicId: topic.id,
      slides: [...topic.defaultSlides],
    }));
  }, []);

  const handleSaveDefaults = () => {
    const dataToSave = {
      contactName: postData.contactName,
      contactPhone: postData.contactPhone,
      creci: postData.creci,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    setSaved(true);
    toast.success('Dados de contato salvos como padrão!');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleGenerateNewContent = () => {
    // Save current slides to history before generating new
    const currentSlides = [...postData.slides];
    setSlideHistory(prev => [...prev.slice(0, historyIndex + 1), currentSlides]);
    setHistoryIndex(prev => prev + 1);

    // Find other topics in the same category to rotate content
    const sameCategoryTopics = defaultTopics.filter(t => t.category === postData.category && t.id !== postData.topicId);
    
    if (sameCategoryTopics.length > 0) {
      // Randomly pick another topic from same category
      const randomTopic = sameCategoryTopics[Math.floor(Math.random() * sameCategoryTopics.length)];
      setPostData(prev => ({
        ...prev,
        topicId: randomTopic.id,
        slides: [...randomTopic.defaultSlides],
      }));
      toast.success('Novo conteúdo gerado!');
    } else {
      toast.info('Não há outros temas nesta categoria');
    }
  };

  const handlePreviousContent = () => {
    if (historyIndex > 0) {
      // Save current before going back
      if (historyIndex === slideHistory.length - 1) {
        setSlideHistory(prev => [...prev, [...postData.slides]]);
      }
      setHistoryIndex(prev => prev - 1);
      setPostData(prev => ({ ...prev, slides: [...slideHistory[historyIndex - 1]] }));
      toast.success('Conteúdo anterior restaurado');
    } else if (historyIndex === 0 && slideHistory.length > 0) {
      setPostData(prev => ({ ...prev, slides: [...slideHistory[0]] }));
    }
  };

  const handleNextContent = () => {
    if (historyIndex < slideHistory.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setPostData(prev => ({ ...prev, slides: [...slideHistory[historyIndex + 1]] }));
      toast.success('Próximo conteúdo restaurado');
    }
  };

  const handleCreciChange = (value: string) => {
    setPostData(prev => ({ ...prev, creci: value }));
  };

  return (
    <EliteLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={logoVDH} alt="VDH - Venda Direta Hoje" className="h-12 w-auto" />
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
                  <div className="p-2 rounded-lg bg-amber-600 text-white">
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-900 text-white">
                      <Edit3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">Editar Conteúdo</h2>
                      <p className="text-xs text-gray-500">Personalize os slides do seu post</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousContent}
                      disabled={historyIndex < 0}
                      className="gap-1 px-2"
                      title="Conteúdo anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleGenerateNewContent}
                      className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Gerar Novo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextContent}
                      disabled={historyIndex >= slideHistory.length - 1}
                      className="gap-1 px-2"
                      title="Próximo conteúdo"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-900 text-white">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">Informações de Contato</h2>
                      <p className="text-xs text-gray-500">Exibidas no slide final</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveDefaults}
                    className="gap-2"
                  >
                    {saved ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        Salvo!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Salvar Padrão
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-700 flex items-center gap-2">
                      <User className="w-3.5 h-3.5" />
                      Nome
                    </Label>
                    <Input
                      value={postData.contactName}
                      onChange={(e) => setPostData(prev => ({ ...prev, contactName: e.target.value }))}
                      placeholder="Seu nome"
                      className="border-gray-300 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-700 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" />
                      Telefone
                    </Label>
                    <Input
                      value={postData.contactPhone}
                      onChange={(e) => setPostData(prev => ({ ...prev, contactPhone: e.target.value }))}
                      placeholder="(67) 99999-9999"
                      className="border-gray-300 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-700 flex items-center gap-2">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    CRECI
                  </Label>
                  <Select value={postData.creci} onValueChange={handleCreciChange}>
                    <SelectTrigger className="border-gray-300 text-gray-900">
                      <SelectValue placeholder="Selecione o CRECI" />
                    </SelectTrigger>
                    <SelectContent>
                      {crecis.map((creci) => (
                        <SelectItem key={creci.id} value={`CRECI ${formatCreci(creci)}`}>
                          CRECI {formatCreci(creci)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      className="gap-2 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600"
                    >
                      <LayoutGrid className="w-4 h-4" />
                      Visualização
                    </TabsTrigger>
                    <TabsTrigger 
                      value="caption" 
                      className="gap-2 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600"
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
