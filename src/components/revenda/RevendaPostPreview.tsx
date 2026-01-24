import { useState, useRef } from 'react';
import { RevendaPropertyData, CategorizedPhoto, photoCategoryOrder, photoCategoryLabels } from '@/types/revenda';
import { RevendaCoverFeed } from './feed/RevendaCoverFeed';
import { RevendaPhotoFeed } from './feed/RevendaPhotoFeed';
import { RevendaFeaturesFeed } from './feed/RevendaFeaturesFeed';
import { RevendaContactFeed } from './feed/RevendaContactFeed';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download, Layers, Image as ImageIcon } from 'lucide-react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface RevendaPostPreviewProps {
  data: RevendaPropertyData;
  photos: CategorizedPhoto[];
}

type PostFormat = 'feed' | 'story';

interface SlideDefinition {
  name: string;
  component: React.ReactNode;
  category?: string;
}

export const RevendaPostPreview = ({ data, photos }: RevendaPostPreviewProps) => {
  const [format, setFormat] = useState<PostFormat>('feed');
  const [currentSlide, setCurrentSlide] = useState(0);
  const postRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Get photos organized by category
  const getPhotosByCategory = (category: string): string[] => {
    return photos
      .filter(p => p.category === category)
      .sort((a, b) => a.order - b.order)
      .map(p => p.url);
  };

  // Get best photo for each purpose
  const getFacadePhoto = () => getPhotosByCategory('fachada')[0] || getPhotosByCategory('area-externa')[0] || photos[0]?.url || null;
  const getLivingPhoto = () => getPhotosByCategory('sala')[0] || getPhotosByCategory('outros')[0] || null;
  const getBedroomPhoto = () => getPhotosByCategory('quarto')[0] || null;
  const getKitchenPhoto = () => getPhotosByCategory('cozinha')[0] || null;

  // Build slides for Feed (5 slides max)
  const buildFeedSlides = (): SlideDefinition[] => {
    const slides: SlideDefinition[] = [];
    
    // Slide 1: Cover with facade
    slides.push({
      name: 'Capa',
      component: <RevendaCoverFeed data={data} photo={getFacadePhoto()} />,
      category: 'fachada',
    });

    // Slide 2: Living room or best interior
    const livingPhoto = getLivingPhoto();
    if (livingPhoto) {
      slides.push({
        name: 'Sala',
        component: <RevendaPhotoFeed data={data} photo={livingPhoto} label="Sala de Estar" />,
        category: 'sala',
      });
    }

    // Slide 3: Features
    slides.push({
      name: 'Diferenciais',
      component: <RevendaFeaturesFeed data={data} photo={getBedroomPhoto() || getKitchenPhoto()} />,
    });

    // Slide 4: Another interior photo
    const kitchenPhoto = getKitchenPhoto();
    if (kitchenPhoto) {
      slides.push({
        name: 'Cozinha',
        component: <RevendaPhotoFeed data={data} photo={kitchenPhoto} label="Cozinha" />,
        category: 'cozinha',
      });
    }

    // Slide 5: Contact
    slides.push({
      name: 'Contato',
      component: <RevendaContactFeed data={data} photo={getFacadePhoto()} />,
    });

    return slides;
  };

  const slides = buildFeedSlides();
  const totalSlides = slides.length;

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
    }
  };

  const handleExportSingle = async (index: number) => {
    const ref = postRefs.current[index];
    if (!ref) return;

    try {
      const dataUrl = await toPng(ref, { quality: 1, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `revenda-${format}-${index + 1}.png`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: 'Exportado!',
        description: `Slide ${index + 1} exportado com sucesso.`,
      });
    } catch (err) {
      console.error('Export error:', err);
      toast({
        title: 'Erro',
        description: 'Não foi possível exportar a imagem.',
        variant: 'destructive',
      });
    }
  };

  const handleExportAll = async () => {
    const zip = new JSZip();
    
    try {
      for (let i = 0; i < slides.length; i++) {
        const ref = postRefs.current[i];
        if (ref) {
          const dataUrl = await toPng(ref, { quality: 1, pixelRatio: 2 });
          const base64Data = dataUrl.split(',')[1];
          zip.file(`revenda-${format}-${i + 1}.png`, base64Data, { base64: true });
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.download = `revenda-${format}-completo.zip`;
      link.href = URL.createObjectURL(content);
      link.click();

      toast({
        title: 'Exportado!',
        description: `${slides.length} slides exportados com sucesso.`,
      });
    } catch (err) {
      console.error('Export all error:', err);
      toast({
        title: 'Erro',
        description: 'Não foi possível exportar os slides.',
        variant: 'destructive',
      });
    }
  };

  // Scale for preview
  const previewScale = 0.35;
  const templateWidth = 1080;
  const templateHeight = 1080;

  return (
    <div className="space-y-4">
      {/* Format Selector */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={format === 'feed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFormat('feed')}
            className={cn(
              format === 'feed' 
                ? 'bg-sky-500 hover:bg-sky-600 text-white' 
                : 'border-slate-200 text-slate-600'
            )}
          >
            <Layers className="w-4 h-4 mr-2" />
            Feed
          </Button>
          <Button
            variant={format === 'story' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFormat('story')}
            disabled
            className="border-slate-200 text-slate-400"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Stories (em breve)
          </Button>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportSingle(currentSlide)}
            className="border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <Download className="w-4 h-4 mr-1" />
            Slide
          </Button>
          <Button
            size="sm"
            onClick={handleExportAll}
            className="bg-sky-500 hover:bg-sky-600 text-white"
          >
            <Download className="w-4 h-4 mr-1" />
            Exportar Tudo
          </Button>
        </div>
      </div>

      {/* Preview Container */}
      <div 
        className="relative rounded-xl overflow-hidden mx-auto"
        style={{ 
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Navigation */}
        <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: '#e2e8f0' }}>
          <button
            onClick={() => goToSlide(currentSlide - 1)}
            disabled={currentSlide === 0}
            className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">
              {slides[currentSlide]?.name}
            </span>
            <span className="text-xs text-slate-400">
              {currentSlide + 1} / {totalSlides}
            </span>
          </div>
          
          <button
            onClick={() => goToSlide(currentSlide + 1)}
            disabled={currentSlide === totalSlides - 1}
            className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Preview Area */}
        <div 
          className="flex items-center justify-center p-4"
          style={{ 
            width: templateWidth * previewScale + 32, 
            height: templateHeight * previewScale + 32,
          }}
        >
          <div
            style={{
              transform: `scale(${previewScale})`,
              transformOrigin: 'center',
              width: templateWidth,
              height: templateHeight,
            }}
          >
            {slides[currentSlide]?.component}
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "flex-shrink-0 rounded-lg overflow-hidden transition-all",
              currentSlide === index 
                ? "ring-2 ring-sky-500 ring-offset-2" 
                : "opacity-70 hover:opacity-100"
            )}
            style={{ 
              width: 64, 
              height: 64,
              backgroundColor: '#f1f5f9',
            }}
          >
            <div
              style={{
                transform: 'scale(0.059)',
                transformOrigin: 'top left',
                width: templateWidth,
                height: templateHeight,
              }}
            >
              {slide.component}
            </div>
          </button>
        ))}
      </div>

      {/* Hidden refs for export */}
      <div className="hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            ref={el => postRefs.current[index] = el}
            style={{ width: templateWidth, height: templateHeight }}
          >
            {slide.component}
          </div>
        ))}
      </div>
    </div>
  );
};
