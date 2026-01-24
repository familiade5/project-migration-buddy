import { useState, useRef } from 'react';
import { LocacaoPropertyData, LocacaoManagementData, LocacaoCategorizedPhoto, LocacaoCreativeType, locacaoPhotoCategoryLabels, LocacaoPhotoCategory } from '@/types/locacao';
import { LocacaoCoverFeed } from './feed/LocacaoCoverFeed';
import { LocacaoPhotoFeed } from './feed/LocacaoPhotoFeed';
import { LocacaoDetailsFeed } from './feed/LocacaoDetailsFeed';
import { LocacaoPricingFeed } from './feed/LocacaoPricingFeed';
import { LocacaoContactFeed } from './feed/LocacaoContactFeed';
import { LocacaoManagementFeed } from './feed/LocacaoManagementFeed';
import { LocacaoCoverStory } from './story/LocacaoCoverStory';
import { LocacaoDetailsStory } from './story/LocacaoDetailsStory';
import { LocacaoPricingStory } from './story/LocacaoPricingStory';
import { LocacaoContactStory } from './story/LocacaoContactStory';
import { LocacaoManagementStory } from './story/LocacaoManagementStory';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download, Layers, Image as ImageIcon } from 'lucide-react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface LocacaoPostPreviewProps {
  creativeType: LocacaoCreativeType;
  propertyData: LocacaoPropertyData;
  managementData: LocacaoManagementData;
  photos: LocacaoCategorizedPhoto[];
}

type PostFormat = 'feed' | 'story';

interface SlideDefinition {
  name: string;
  component: React.ReactNode;
}

export const LocacaoPostPreview = ({ 
  creativeType, 
  propertyData, 
  managementData, 
  photos 
}: LocacaoPostPreviewProps) => {
  const [format, setFormat] = useState<PostFormat>('feed');
  const [currentSlide, setCurrentSlide] = useState(0);
  const postRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useIsMobile();

  // Photo helpers
  const getPhotoByCategory = (category: LocacaoPhotoCategory): string | null => {
    const photo = photos.find(p => p.category === category);
    return photo?.url || null;
  };

  const getFacadePhoto = () => getPhotoByCategory('fachada') || photos[0]?.url || null;
  const getLivingPhoto = () => getPhotoByCategory('sala') || photos[1]?.url || null;
  const getBedroomPhoto = () => getPhotoByCategory('quarto') || photos[2]?.url || null;

  // Build slides for Property rental
  const buildPropertyFeedSlides = (): SlideDefinition[] => {
    return [
      { name: 'Capa', component: <LocacaoCoverFeed data={propertyData} photo={getFacadePhoto()} /> },
      { name: 'Ambiente 1', component: <LocacaoPhotoFeed data={propertyData} photo={getLivingPhoto()} label="Sala" /> },
      { name: 'Ambiente 2', component: <LocacaoPhotoFeed data={propertyData} photo={getBedroomPhoto()} label="Quarto" /> },
      { name: 'Detalhes', component: <LocacaoDetailsFeed data={propertyData} /> },
      { name: 'Valores', component: <LocacaoPricingFeed data={propertyData} /> },
      { name: 'Contato', component: <LocacaoContactFeed data={propertyData} photo={getFacadePhoto()} /> },
    ];
  };

  const buildPropertyStorySlides = (): SlideDefinition[] => {
    return [
      { name: 'Capa', component: <LocacaoCoverStory data={propertyData} photo={getFacadePhoto()} /> },
      { name: 'Detalhes', component: <LocacaoDetailsStory data={propertyData} photo={getLivingPhoto()} /> },
      { name: 'Valores', component: <LocacaoPricingStory data={propertyData} /> },
      { name: 'Contato', component: <LocacaoContactStory data={propertyData} photo={getFacadePhoto()} /> },
    ];
  };

  // Build slides for Management service
  const buildManagementFeedSlides = (): SlideDefinition[] => {
    return [
      { name: 'Introdução', component: <LocacaoManagementFeed data={managementData} slide="intro" /> },
      { name: 'Serviços', component: <LocacaoManagementFeed data={managementData} slide="benefits" /> },
      { name: 'Credibilidade', component: <LocacaoManagementFeed data={managementData} slide="trust" /> },
      { name: 'Contato', component: <LocacaoManagementFeed data={managementData} slide="contact" /> },
    ];
  };

  const buildManagementStorySlides = (): SlideDefinition[] => {
    return [
      { name: 'Introdução', component: <LocacaoManagementStory data={managementData} slide="intro" /> },
      { name: 'Serviços', component: <LocacaoManagementStory data={managementData} slide="benefits" /> },
      { name: 'Credibilidade', component: <LocacaoManagementStory data={managementData} slide="trust" /> },
      { name: 'Contato', component: <LocacaoManagementStory data={managementData} slide="contact" /> },
    ];
  };

  const slides = creativeType === 'property'
    ? (format === 'feed' ? buildPropertyFeedSlides() : buildPropertyStorySlides())
    : (format === 'feed' ? buildManagementFeedSlides() : buildManagementStorySlides());

  const totalSlides = slides.length;

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
    }
  };

  const handleFormatChange = (newFormat: PostFormat) => {
    setFormat(newFormat);
    setCurrentSlide(0);
  };

  const handleExportSingle = async (index: number) => {
    const ref = postRefs.current[index];
    if (!ref) return;

    try {
      const dataUrl = await toPng(ref, { quality: 1, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `locacao-${format}-${index + 1}.png`;
      link.href = dataUrl;
      link.click();
      toast({ title: 'Exportado!', description: `Slide ${index + 1} exportado.` });
    } catch (err) {
      toast({ title: 'Erro', description: 'Falha ao exportar.', variant: 'destructive' });
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
          zip.file(`locacao-${format}-${i + 1}.png`, base64Data, { base64: true });
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.download = `locacao-${format}-completo.zip`;
      link.href = URL.createObjectURL(content);
      link.click();
      toast({ title: 'Exportado!', description: `${slides.length} slides exportados.` });
    } catch (err) {
      toast({ title: 'Erro', description: 'Falha ao exportar.', variant: 'destructive' });
    }
  };

  const templateWidth = 1080;
  const templateHeight = format === 'feed' ? 1080 : 1920;
  const maxPreviewWidth = isMobile ? 260 : 380;
  const previewScale = maxPreviewWidth / templateWidth;
  const previewHeight = templateHeight * previewScale;

  return (
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      {/* Format Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1 sm:gap-2">
          <Button
            variant={format === 'feed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFormatChange('feed')}
            className={cn(
              "text-xs sm:text-sm px-2 sm:px-3",
              format === 'feed' 
                ? 'bg-gray-700 hover:bg-gray-800 text-white' 
                : 'border-gray-300 text-gray-600'
            )}
          >
            <Layers className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Feed
          </Button>
          <Button
            variant={format === 'story' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFormatChange('story')}
            className={cn(
              "text-xs sm:text-sm px-2 sm:px-3",
              format === 'story' 
                ? 'bg-gray-700 hover:bg-gray-800 text-white' 
                : 'border-gray-300 text-gray-600'
            )}
          >
            <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Stories
          </Button>
        </div>

        <div className="flex gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportSingle(currentSlide)}
            className="border-gray-300 text-gray-600 text-xs sm:text-sm px-2 sm:px-3"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">Slide</span>
          </Button>
          <Button
            size="sm"
            onClick={handleExportAll}
            className="bg-gray-700 hover:bg-gray-800 text-white text-xs sm:text-sm px-2 sm:px-3"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
        </div>
      </div>

      {/* Preview Container */}
      <div 
        className="relative rounded-xl overflow-hidden w-full max-w-full mx-auto"
        style={{ backgroundColor: '#374151', border: '1px solid #4b5563' }}
      >
        {/* Navigation */}
        <div 
          className="flex items-center justify-between px-4 py-2"
          style={{ borderBottom: '1px solid #4b5563' }}
        >
          <button
            onClick={() => goToSlide(currentSlide - 1)}
            disabled={currentSlide === 0}
            className="p-2 rounded-full hover:bg-gray-600 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-300" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-200">
              {slides[currentSlide]?.name}
            </span>
            <span className="text-xs text-gray-500">
              {currentSlide + 1} / {totalSlides}
            </span>
          </div>
          
          <button
            onClick={() => goToSlide(currentSlide + 1)}
            disabled={currentSlide === totalSlides - 1}
            className="p-2 rounded-full hover:bg-gray-600 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* Preview Area */}
        <div 
          className="flex items-start justify-center p-4 overflow-hidden"
          style={{ height: previewHeight + 32 }}
        >
          <div
            style={{
              transform: `scale(${previewScale})`,
              transformOrigin: 'top center',
              width: templateWidth,
              height: templateHeight,
              flexShrink: 0,
            }}
          >
            {slides[currentSlide]?.component}
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 -mx-2 px-2">
        {slides.map((slide, index) => {
          const thumbScale = isMobile 
            ? (format === 'feed' ? 0.045 : 0.028)
            : (format === 'feed' ? 0.059 : 0.035);
          const thumbWidth = templateWidth * thumbScale;
          const thumbHeight = templateHeight * thumbScale;
          
          return (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "flex-shrink-0 rounded-lg overflow-hidden transition-all",
                currentSlide === index 
                  ? "ring-2 ring-gray-500 ring-offset-1 sm:ring-offset-2 ring-offset-gray-800" 
                  : "opacity-70 hover:opacity-100"
              )}
              style={{ 
                width: thumbWidth, 
                height: thumbHeight,
                backgroundColor: '#374151',
              }}
            >
              <div
                style={{
                  transform: `scale(${thumbScale})`,
                  transformOrigin: 'top left',
                  width: templateWidth,
                  height: templateHeight,
                }}
              >
                {slide.component}
              </div>
            </button>
          );
        })}
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
