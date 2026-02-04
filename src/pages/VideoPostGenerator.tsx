import { useState } from 'react';
import { Video, Play, Download, Sparkles, Clock, FileVideo, Info, Loader2 } from 'lucide-react';
import { EliteLayout } from '@/components/layout/EliteLayout';
import { useModuleActivity } from '@/hooks/useModuleActivity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import logoVDH from '@/assets/logo-vdh-revenda.png';
import testVideo from '@/assets/videos/venda-direta-caixa-educational.mp4';

type VideoFormat = 'story' | 'reel' | 'feed';
type VideoCategory = 'tips' | 'process' | 'testimonial' | 'showcase';

interface VideoConfig {
  format: VideoFormat;
  category: VideoCategory;
  title: string;
  description: string;
  duration: 5 | 10;
  resolution: '480p' | '1080p';
}

const formatConfigs: Record<VideoFormat, { label: string; aspectRatio: string; dimensions: string }> = {
  story: { label: 'Stories (9:16)', aspectRatio: '9:16', dimensions: '1080x1920' },
  reel: { label: 'Reels (9:16)', aspectRatio: '9:16', dimensions: '1080x1920' },
  feed: { label: 'Feed (1:1)', aspectRatio: '1:1', dimensions: '1080x1080' },
};

const categoryTemplates: Record<VideoCategory, { label: string; prompts: string[] }> = {
  tips: {
    label: 'Dicas Educativas',
    prompts: [
      'Ambiente de escritório moderno com pessoa explicando conceitos no quadro, iluminação profissional, movimento suave de câmera',
      'Interior de casa moderna com realtor mostrando detalhes, transição suave entre ambientes',
      'Pessoa confiante apresentando slides em tela, ambiente corporativo sofisticado',
    ],
  },
  process: {
    label: 'Nosso Processo',
    prompts: [
      'Sequência profissional de assinatura de contrato, aperto de mãos, entrega de chaves, transições elegantes',
      'Reunião de equipe imobiliária, planejamento estratégico, movimento dinâmico de câmera',
      'Tour virtual por imóvel de luxo, câmera flutuante revelando cada ambiente',
    ],
  },
  testimonial: {
    label: 'Depoimentos',
    prompts: [
      'Família feliz recebendo chaves de casa nova, abraços emocionados, iluminação dourada',
      'Casal jovem sorrindo em frente à nova casa, expressões de realização e felicidade',
      'Cliente satisfeito agradecendo ao corretor, ambiente acolhedor de escritório',
    ],
  },
  showcase: {
    label: 'Showcase Imóveis',
    prompts: [
      'Tour cinematográfico por apartamento de luxo, iluminação natural, movimento suave revelando cada detalhe',
      'Vista aérea de condomínio exclusivo descendo para mostrar piscina e área de lazer',
      'Interior de casa contemporânea, transições elegantes entre sala, cozinha e suíte master',
    ],
  },
};

// Credit cost estimates (approximate)
const creditEstimates = {
  '5s-480p': { credits: 15, description: 'Vídeo curto, baixa resolução' },
  '5s-1080p': { credits: 25, description: 'Vídeo curto, alta resolução' },
  '10s-480p': { credits: 30, description: 'Vídeo longo, baixa resolução' },
  '10s-1080p': { credits: 50, description: 'Vídeo longo, alta resolução' },
};

const VideoPostGenerator = () => {
  useModuleActivity('Vídeos Educativos');

  const [config, setConfig] = useState<VideoConfig>({
    format: 'story',
    category: 'tips',
    title: '',
    description: '',
    duration: 5,
    resolution: '1080p',
  });

  const [generatedVideo, setGeneratedVideo] = useState<string | null>(testVideo);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [customPrompt, setCustomPrompt] = useState('');

  const handleGenerateVideo = async () => {
    const promptToUse = customPrompt || categoryTemplates[config.category].prompts[selectedPromptIndex];
    
    if (!promptToUse.trim()) {
      toast.error('Por favor, descreva o vídeo que você quer gerar.');
      return;
    }
    
    setIsGenerating(true);
    
    const aspectRatio = formatConfigs[config.format].aspectRatio;
    
    toast.info('Gerando vídeo... Isso pode levar alguns minutos.');
    
    // Simulate video generation delay (in real implementation, this would call the video generation API)
    setTimeout(() => {
      setIsGenerating(false);
      toast.success('Vídeo gerado com sucesso!');
      // In real implementation, setGeneratedVideo would receive the actual video URL
      setGeneratedVideo('/placeholder-video.mp4');
    }, 3000);
  };

  const getEstimatedCredits = () => {
    const key = `${config.duration}s-${config.resolution}` as keyof typeof creditEstimates;
    return creditEstimates[key];
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
                  Vídeos Educativos
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Crie vídeos para Stories e Reels que educam e convertem
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
              <Video className="w-4 h-4" />
              <span className="text-sm font-medium">IA Video Generator</span>
            </div>
          </div>
        </div>

        {/* Credit Cost Info Card */}
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
              <Info className="w-5 h-5" />
              Estimativa de Créditos
            </CardTitle>
            <CardDescription className="text-amber-700">
              Confira abaixo os custos aproximados por vídeo gerado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(creditEstimates).map(([key, value]) => (
                <div key={key} className="bg-white rounded-lg p-3 border border-amber-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{key.replace('-', ' / ')}</span>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      ~{value.credits} créditos
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{value.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg border border-amber-200">
              <h4 className="font-medium text-amber-800 mb-2">💡 Exemplos Práticos de Gastos:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li><strong>Uso Leve:</strong> 4 vídeos/semana (5s, 1080p) = ~100 créditos/semana</li>
                <li><strong>Uso Médio:</strong> 2 vídeos/dia (5s, 1080p) = ~350 créditos/semana</li>
                <li><strong>Uso Intenso:</strong> 4 vídeos/dia (mix de durações) = ~700 créditos/semana</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Format Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileVideo className="w-5 h-5 text-purple-600" />
                  Formato do Vídeo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(formatConfigs).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setConfig(prev => ({ ...prev, format: key as VideoFormat }))}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        config.format === key
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`mx-auto mb-2 rounded ${
                          key === 'feed' ? 'w-10 h-10' : 'w-6 h-10'
                        } bg-gradient-to-br from-purple-400 to-pink-400`} />
                        <span className="text-sm font-medium">{value.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category & Template */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Categoria & Template
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Categoria do Vídeo</Label>
                  <Select
                    value={config.category}
                    onValueChange={(v) => {
                      setConfig(prev => ({ ...prev, category: v as VideoCategory }));
                      setSelectedPromptIndex(0);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryTemplates).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Template Base (clique para usar como inspiração)</Label>
                  <div className="space-y-2">
                    {categoryTemplates[config.category].prompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedPromptIndex(index);
                          setCustomPrompt(prompt);
                        }}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          selectedPromptIndex === index && !customPrompt
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                            selectedPromptIndex === index && !customPrompt
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {index + 1}
                          </span>
                          <p className="text-sm text-gray-600 line-clamp-2">{prompt}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descreva seu Vídeo (edite como quiser)</Label>
                  <Textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Descreva a cena que você quer no vídeo. Ex: Corretor profissional explicando o processo de venda direta da Caixa em escritório moderno, movimento de câmera suave..."
                    className="min-h-[100px] resize-none"
                  />
                  <p className="text-xs text-gray-500">
                    💡 Seja específico: mencione ambiente, ações, estilo visual e movimento de câmera desejado.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Duration & Quality */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  Duração & Qualidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Duração</Label>
                    <Select
                      value={config.duration.toString()}
                      onValueChange={(v) => setConfig(prev => ({ ...prev, duration: parseInt(v) as 5 | 10 }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 segundos</SelectItem>
                        <SelectItem value="10">10 segundos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Resolução</Label>
                    <Select
                      value={config.resolution}
                      onValueChange={(v) => setConfig(prev => ({ ...prev, resolution: v as '480p' | '1080p' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="480p">480p (Econômico)</SelectItem>
                        <SelectItem value="1080p">1080p (Alta Qualidade)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Credit Estimate */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Custo estimado:</span>
                    <Badge className="bg-purple-600">
                      ~{getEstimatedCredits().credits} créditos
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateVideo}
              disabled={isGenerating}
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Gerando Vídeo...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Gerar Vídeo
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-4 space-y-6 self-start">
            <Card>
              <CardHeader>
                <CardTitle>Pré-visualização</CardTitle>
                <CardDescription>
                  {formatConfigs[config.format].label} • {config.duration}s • {config.resolution}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`relative mx-auto bg-gray-900 rounded-2xl overflow-hidden ${
                  config.format === 'feed' ? 'aspect-square max-w-[400px]' : 'aspect-[9/16] max-w-[280px]'
                }`}>
                  {generatedVideo ? (
                    <video
                      src={generatedVideo}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                      <Video className="w-16 h-16 mb-4" />
                      <p className="text-sm text-center px-4">
                        Configure e gere seu vídeo para visualizar aqui
                      </p>
                    </div>
                  )}
                </div>

                {generatedVideo && (
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setGeneratedVideo(null)}
                    >
                      Novo Vídeo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-purple-800">💡 Dicas para Melhores Vídeos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-purple-700 space-y-2">
                  <li>• Use vídeos de 5s para Stories rápidos e impactantes</li>
                  <li>• Vídeos de 10s são ideais para Reels com mais contexto</li>
                  <li>• A resolução 1080p é recomendada para qualidade profissional</li>
                  <li>• Combine com legendas e CTAs para maior conversão</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </EliteLayout>
  );
};

export default VideoPostGenerator;
