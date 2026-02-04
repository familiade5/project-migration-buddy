import { useState, useRef } from 'react';
import { EducationalPostData } from '@/types/educational';
import { EducationalCoverSlide } from './slides/EducationalCoverSlide';
import { EducationalContentSlide } from './slides/EducationalContentSlide';
import { EducationalHighlightSlide } from './slides/EducationalHighlightSlide';
import { EducationalCTASlide } from './slides/EducationalCTASlide';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, Download, Loader2, LayoutGrid, Smartphone } from 'lucide-react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { toast } from 'sonner';

interface EducationalPostPreviewProps {
  data: EducationalPostData;
}

export const EducationalPostPreview = ({ data }: EducationalPostPreviewProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [format, setFormat] = useState<'feed' | 'story'>('feed');
  const [isExporting, setIsExporting] = useState(false);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);

  const totalSlides = data.slides.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const renderSlide = (slide: typeof data.slides[0], index: number) => {
    const slideNumber = index + 1;
    
    switch (slide.type) {
      case 'cover':
        return (
          <EducationalCoverSlide 
            slide={slide} 
            category={data.category} 
            format={format} 
          />
        );
      case 'content':
        return (
          <EducationalContentSlide 
            slide={slide} 
            slideNumber={slideNumber}
            totalSlides={totalSlides}
            format={format} 
          />
        );
      case 'highlight':
        return (
          <EducationalHighlightSlide 
            slide={slide} 
            slideNumber={slideNumber}
            totalSlides={totalSlides}
            format={format} 
          />
        );
      case 'cta':
        return (
          <EducationalCTASlide 
            slide={slide} 
            slideNumber={slideNumber}
            totalSlides={totalSlides}
            format={format}
            contactName={data.contactName}
            contactPhone={data.contactPhone}
            creci={data.creci}
          />
        );
      default:
        return null;
    }
  };

  const exportAllSlides = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder(`educativo-${format}`);
      
      for (let i = 0; i < data.slides.length; i++) {
        const slideElement = slidesRef.current[i];
        if (slideElement) {
          const dataUrl = await toPng(slideElement, {
            quality: 1,
            pixelRatio: 2,
          });
          const base64Data = dataUrl.split(',')[1];
          folder?.file(`slide-${i + 1}.png`, base64Data, { base64: true });
        }
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `educativo-${format}-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`${data.slides.length} slides exportados com sucesso!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Erro ao exportar slides');
    } finally {
      setIsExporting(false);
    }
  };

  const previewScale = format === 'story' ? 0.22 : 0.38;

  return (
    <div className="space-y-4">
      {/* Format tabs */}
      <Tabs value={format} onValueChange={(v) => setFormat(v as 'feed' | 'story')}>
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="feed" 
            className="gap-2 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <LayoutGrid className="w-4 h-4" />
            Feed
          </TabsTrigger>
          <TabsTrigger 
            value="story" 
            className="gap-2 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Smartphone className="w-4 h-4" />
            Story
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Preview area */}
      <div className="relative bg-gray-100 rounded-xl p-4 flex items-center justify-center overflow-hidden" style={{ minHeight: format === 'story' ? '450px' : '420px' }}>
        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Current slide preview */}
        <div 
          className="overflow-hidden rounded-lg shadow-xl"
          style={{ 
            transform: `scale(${previewScale})`,
            transformOrigin: 'center center',
          }}
        >
          <div ref={(el) => (slidesRef.current[currentSlide] = el)}>
            {renderSlide(data.slides[currentSlide], currentSlide)}
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="flex items-center justify-center gap-2">
        {data.slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-[#BA9E72] w-6' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Slide counter & export */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Slide {currentSlide + 1} de {totalSlides}
        </p>
        <Button
          onClick={exportAllSlides}
          disabled={isExporting}
          className="bg-[#BA9E72] hover:bg-[#a68d64] text-white"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Exportando...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Baixar todos ({format})
            </>
          )}
        </Button>
      </div>

      {/* Hidden render area for export */}
      <div className="fixed -left-[9999px] -top-[9999px]">
        {data.slides.map((slide, index) => (
          <div key={index} ref={(el) => (slidesRef.current[index] = el)}>
            {renderSlide(slide, index)}
          </div>
        ))}
      </div>
    </div>
  );
};
