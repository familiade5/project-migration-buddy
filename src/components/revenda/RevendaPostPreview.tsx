import { useState, useRef } from 'react';
import { RevendaPropertyData, CategorizedPhoto } from '@/types/revenda';
import { RevendaCoverFeed } from './feed/RevendaCoverFeed';
import { RevendaPhotoFeed } from './feed/RevendaPhotoFeed';
import { RevendaMultiPhotoFeed } from './feed/RevendaMultiPhotoFeed';
import { RevendaFeaturesFeed } from './feed/RevendaFeaturesFeed';
import { RevendaContactFeed } from './feed/RevendaContactFeed';
import { RevendaCoverStory } from './story/RevendaCoverStory';
import { RevendaLifestyleStory } from './story/RevendaLifestyleStory';
import { RevendaPhotoStory } from './story/RevendaPhotoStory';
import { RevendaPriceStory } from './story/RevendaPriceStory';
import { RevendaContactStory } from './story/RevendaContactStory';
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

  // Get all photos as URLs in order
  const getAllPhotos = (): string[] => {
    return photos.sort((a, b) => a.order - b.order).map(p => p.url);
  };

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
  const getBathroomPhoto = () => getPhotosByCategory('banheiro')[0] || null;
  const getExternalPhoto = () => getPhotosByCategory('area-externa')[0] || null;

  // Build slides for Feed (7 slides - with multi-photo support)
  const buildFeedSlides = (): SlideDefinition[] => {
    const slides: SlideDefinition[] = [];
    const allPhotos = getAllPhotos();
    const hasMultiplePhotos = allPhotos.length > 7;
    
    // Slide 1: Cover with facade
    slides.push({
      name: 'Capa',
      component: <RevendaCoverFeed data={data} photo={getFacadePhoto()} />,
      category: 'fachada',
    });

    // Slide 2: Living room or best interior
    const livingPhoto = getLivingPhoto();
    if (livingPhoto || allPhotos.length > 1) {
      if (hasMultiplePhotos) {
        // Multi-photo layout for slide 2
        const photosForSlide = [
          getLivingPhoto(),
          getPhotosByCategory('sala')[1],
          getBedroomPhoto(),
        ].filter(Boolean) as string[];
        
        slides.push({
          name: 'Ambientes',
          component: <RevendaMultiPhotoFeed data={data} photos={photosForSlide.slice(0, 3)} label="Interiores" />,
          category: 'sala',
        });
      } else {
        slides.push({
          name: 'Sala',
          component: <RevendaPhotoFeed data={data} photo={livingPhoto || allPhotos[1]} label="Sala de Estar" />,
          category: 'sala',
        });
      }
    }

    // Slide 3: Bedroom or multi-photo
    const bedroomPhoto = getBedroomPhoto();
    if (bedroomPhoto || allPhotos.length > 2) {
      if (hasMultiplePhotos) {
        // Multi-photo layout for slide 3
        const bedroomPhotos = getPhotosByCategory('quarto');
        const photosForSlide = bedroomPhotos.length >= 2 
          ? bedroomPhotos.slice(0, 4)
          : [bedroomPhoto, getKitchenPhoto(), getBathroomPhoto()].filter(Boolean) as string[];
        
        slides.push({
          name: 'Quartos',
          component: <RevendaMultiPhotoFeed data={data} photos={photosForSlide.slice(0, 4)} label="Acomodações" />,
          category: 'quarto',
        });
      } else {
        slides.push({
          name: 'Quarto',
          component: <RevendaPhotoFeed data={data} photo={bedroomPhoto || allPhotos[2]} label="Quarto" />,
          category: 'quarto',
        });
      }
    }

    // Slide 4: Kitchen
    const kitchenPhoto = getKitchenPhoto();
    if (kitchenPhoto || allPhotos.length > 3) {
      slides.push({
        name: 'Cozinha',
        component: <RevendaPhotoFeed data={data} photo={kitchenPhoto || allPhotos[3]} label="Cozinha" />,
        category: 'cozinha',
      });
    }

    // Slide 5: Bathroom or external area
    const bathroomPhoto = getBathroomPhoto();
    const externalPhoto = getExternalPhoto();
    if (bathroomPhoto || externalPhoto || allPhotos.length > 4) {
      slides.push({
        name: externalPhoto ? 'Área Externa' : 'Banheiro',
        component: <RevendaPhotoFeed 
          data={data} 
          photo={externalPhoto || bathroomPhoto || allPhotos[4]} 
          label={externalPhoto ? 'Área Externa' : 'Banheiro'} 
        />,
        category: externalPhoto ? 'area-externa' : 'banheiro',
      });
    }

    // Slide 6: Features
    slides.push({
      name: 'Diferenciais',
      component: <RevendaFeaturesFeed data={data} photo={getBedroomPhoto() || getKitchenPhoto()} />,
    });

    // Slide 7: Contact
    slides.push({
      name: 'Contato',
      component: <RevendaContactFeed data={data} photo={getFacadePhoto()} />,
    });

    return slides.slice(0, 7);
  };

  // Build slides for Story (5 slides - fixed sequence)
  const buildStorySlides = (): SlideDefinition[] => {
    const slides: SlideDefinition[] = [];
    
    // Story 1: Cover - Introduction, create interest
    slides.push({
      name: 'Introdução',
      component: <RevendaCoverStory data={data} photo={getFacadePhoto()} />,
    });

    // Story 2: Photo slide - Show the best interior
    slides.push({
      name: 'Tour',
      component: <RevendaPhotoStory data={data} photo={getLivingPhoto() || getBedroomPhoto()} label="Conheça" />,
    });

    // Story 3: Lifestyle - Benefits, comfort, minimal text
    slides.push({
      name: 'Lifestyle',
      component: <RevendaLifestyleStory data={data} photo={getBedroomPhoto() || getKitchenPhoto()} />,
    });

    // Story 4: Price - Decision making elements
    slides.push({
      name: 'Detalhes',
      component: <RevendaPriceStory data={data} photo={getKitchenPhoto() || getBathroomPhoto() || getFacadePhoto()} />,
    });

    // Story 5: Contact - CTA
    slides.push({
      name: 'Contato',
      component: <RevendaContactStory data={data} photo={getFacadePhoto()} />,
    });

    return slides;
  };

  const slides = format === 'feed' ? buildFeedSlides() : buildStorySlides();
  const totalSlides = slides.length;

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
    }
  };

  // Reset slide when format changes
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

  // Scale and dimensions based on format - FIXED to not crop
  const templateWidth = 1080;
  const templateHeight = format === 'feed' ? 1080 : 1920;
  const maxPreviewWidth = 380;
  const previewScale = maxPreviewWidth / templateWidth;
  const previewHeight = templateHeight * previewScale;

  return (
    <div className="space-y-4">
      {/* Format Selector */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={format === 'feed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFormatChange('feed')}
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
            onClick={() => handleFormatChange('story')}
            className={cn(
              format === 'story' 
                ? 'bg-sky-500 hover:bg-sky-600 text-white' 
                : 'border-slate-200 text-slate-600'
            )}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Stories
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

      {/* Preview Container - FIXED sizing */}
      <div 
        className="relative rounded-xl overflow-hidden"
        style={{ 
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          width: maxPreviewWidth + 32,
        }}
      >
        {/* Navigation */}
        <div 
          className="flex items-center justify-between px-4 py-2"
          style={{ borderBottom: '1px solid #334155' }}
        >
          <button
            onClick={() => goToSlide(currentSlide - 1)}
            disabled={currentSlide === 0}
            className="p-2 rounded-full hover:bg-slate-700 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-300" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-200">
              {slides[currentSlide]?.name}
            </span>
            <span className="text-xs text-slate-500">
              {currentSlide + 1} / {totalSlides}
            </span>
          </div>
          
          <button
            onClick={() => goToSlide(currentSlide + 1)}
            disabled={currentSlide === totalSlides - 1}
            className="p-2 rounded-full hover:bg-slate-700 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        {/* Preview Area - FIXED to show full canvas */}
        <div 
          className="flex items-start justify-center p-4 overflow-hidden"
          style={{ 
            height: previewHeight + 32,
          }}
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
      <div className="flex gap-2 overflow-x-auto pb-2">
        {slides.map((slide, index) => {
          const thumbScale = format === 'feed' ? 0.059 : 0.035;
          const thumbWidth = templateWidth * thumbScale;
          const thumbHeight = templateHeight * thumbScale;
          
          return (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "flex-shrink-0 rounded-lg overflow-hidden transition-all",
                currentSlide === index 
                  ? "ring-2 ring-sky-500 ring-offset-2 ring-offset-slate-900" 
                  : "opacity-70 hover:opacity-100"
              )}
              style={{ 
                width: thumbWidth, 
                height: thumbHeight,
                backgroundColor: '#1e293b',
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
