import { useState, useRef, useEffect } from 'react';
import { RevendaPropertyData, CategorizedPhoto, photoCategoryLabels, PhotoCategory } from '@/types/revenda';
import { RevendaCoverFeed } from './feed/RevendaCoverFeed';
import { RevendaPhotoFeed } from './feed/RevendaPhotoFeed';
import { RevendaMultiPhotoFeed } from './feed/RevendaMultiPhotoFeed';
import { RevendaFeaturesFeed } from './feed/RevendaFeaturesFeed';
import { RevendaContactFeed } from './feed/RevendaContactFeed';
import { RevendaDescriptionFeed } from './feed/RevendaDescriptionFeed';
import { RevendaCoverStory } from './story/RevendaCoverStory';
import { RevendaLifestyleStory } from './story/RevendaLifestyleStory';
import { RevendaMultiPhotoStory } from './story/RevendaMultiPhotoStory';
import { RevendaPriceStory } from './story/RevendaPriceStory';
import { RevendaContactStory } from './story/RevendaContactStory';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download, Layers, Image as ImageIcon, Save } from 'lucide-react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { createCrmPropertyFromCreative, copyImageToCrmStorage } from '@/services/crmIntegration';
import { useActivityLog } from '@/hooks/useActivityLog';
import type { Json } from '@/integrations/supabase/types';

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
  const [isSaving, setIsSaving] = useState(false);
  const postRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { logActivity } = useActivityLog();

  // Get all photos as URLs in order
  const getAllPhotos = (): string[] => {
    return photos.sort((a, b) => a.order - b.order).map(p => p.url);
  };

  // Get photos organized by category - returns CategorizedPhoto array
  const getPhotosByCategoryFull = (category: string): CategorizedPhoto[] => {
    return photos
      .filter(p => p.category === category)
      .sort((a, b) => a.order - b.order);
  };

  // Get photos organized by category - returns URLs only
  const getPhotosByCategory = (category: string): string[] => {
    return getPhotosByCategoryFull(category).map(p => p.url);
  };

  // Get category label for a photo URL
  const getCategoryLabelForUrl = (url: string): string => {
    const normalize = (u: string) => {
      // Evita mismatch por query params (ex: URLs assinadas / cache bust)
      try {
        return u.split('?')[0];
      } catch {
        return u;
      }
    };

    const target = normalize(url);
    const photo = photos.find(p => normalize(p.url) === target);
    if (photo) {
      return photoCategoryLabels[photo.category as PhotoCategory] || 'Ambiente';
    }
    return 'Ambiente';
  };

  // Get best photo for each purpose
  const getFacadePhoto = () => getPhotosByCategory('fachada')[0] || getPhotosByCategory('area-externa')[0] || photos[0]?.url || null;
  const getLivingPhoto = () => getPhotosByCategory('sala')[0] || getPhotosByCategory('outros')[0] || null;
  const getBedroomPhoto = () => getPhotosByCategory('quarto')[0] || null;
  const getKitchenPhoto = () => getPhotosByCategory('cozinha')[0] || null;
  const getBathroomPhoto = () => getPhotosByCategory('banheiro')[0] || null;
  const getExternalPhoto = () => getPhotosByCategory('area-externa')[0] || null;

  // Get multiple photos for multi-photo slides
  const getInteriorPhotos = (): string[] => {
    const interiors = [
      ...getPhotosByCategory('sala'),
      ...getPhotosByCategory('quarto'),
      ...getPhotosByCategory('cozinha'),
      ...getPhotosByCategory('banheiro'),
      ...getPhotosByCategory('outros'),
    ];
    return interiors.slice(0, 4);
  };

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

    // Slide 2: Multi-photo split layout (1 left, 2 right)
    const livingPhoto = getLivingPhoto();
    if (livingPhoto || allPhotos.length > 1) {
      if (hasMultiplePhotos || allPhotos.length >= 3) {
        // Multi-photo layout - SPLIT variant (1 left, 2 right)
        const photosForSlide = [
          getLivingPhoto(),
          getPhotosByCategory('sala')[1] || getBedroomPhoto(),
          getPhotosByCategory('quarto')[1] || getKitchenPhoto(),
        ].filter(Boolean) as string[];

        const labelsForSlide = photosForSlide.map((url) => getCategoryLabelForUrl(url));
        
        slides.push({
          name: 'Ambientes',
          component: <RevendaMultiPhotoFeed 
            data={data} 
            photos={photosForSlide.slice(0, 3)} 
            photoLabels={labelsForSlide.slice(0, 3)}
            label="Interiores" 
            variant="rounded-boxes" 
          />,
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

    // Slide 3: Multi-photo TRIANGLE layout (different from slide 2)
    const bedroomPhoto = getBedroomPhoto();
    if (bedroomPhoto || allPhotos.length > 2) {
      if (hasMultiplePhotos || allPhotos.length >= 4) {
        // Multi-photo layout - TRIANGLE variant
        const bedroomPhotos = getPhotosByCategory('quarto');
        const photosForSlide = bedroomPhotos.length >= 2 
          ? [bedroomPhotos[0], bedroomPhotos[1] || getKitchenPhoto(), getBathroomPhoto() || getExternalPhoto()]
          : [bedroomPhoto || allPhotos[2], getKitchenPhoto() || allPhotos[3], getBathroomPhoto() || allPhotos[4]];

        const labelsForSlide = (photosForSlide.filter(Boolean) as string[]).map((url) => getCategoryLabelForUrl(url));
        
        slides.push({
          name: 'Quartos',
          component: <RevendaMultiPhotoFeed 
            data={data} 
            photos={photosForSlide.filter(Boolean).slice(0, 3) as string[]} 
            photoLabels={labelsForSlide.slice(0, 3)}
            label="Acomodações" 
            variant="split-left" 
          />,
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

    // Slide 7: Description (emotional text)
    slides.push({
      name: 'Descrição',
      component: <RevendaDescriptionFeed data={data} photo={getFacadePhoto()} />,
    });

    // Slide 8: Contact
    slides.push({
      name: 'Contato',
      component: <RevendaContactFeed data={data} photo={getFacadePhoto()} />,
    });

    return slides.slice(0, 8);
  };

  // Build slides for Story (5 slides - fixed sequence with multi-photo support)
  const buildStorySlides = (): SlideDefinition[] => {
    const slides: SlideDefinition[] = [];
    const allPhotos = getAllPhotos();
    
    // Story 1: Cover - Introduction, create interest
    slides.push({
      name: 'Introdução',
      component: <RevendaCoverStory data={data} photo={getFacadePhoto()} />,
    });

    // Story 2: Multi-photo slide - TRIANGLE layout with 3 photos
    const photosForSlide2 = [
      getLivingPhoto() || allPhotos[1],
      getBedroomPhoto() || allPhotos[2],
      getPhotosByCategory('sala')[1] || getKitchenPhoto() || allPhotos[3],
    ].filter(Boolean) as string[];
    
    // Get the correct labels based on actual photo categories
    const labelsForSlide2 = photosForSlide2.map(url => getCategoryLabelForUrl(url));
    
    slides.push({
      name: 'Tour Visual',
      component: <RevendaMultiPhotoStory 
        data={data} 
        photos={photosForSlide2.slice(0, 3)} 
        photoLabels={labelsForSlide2.slice(0, 3)}
        label="Conheça" 
        variant="rounded-boxes" 
      />,
    });

    // Story 3: Multi-photo slide - ROUNDED BOXES layout with 3 photos
    const photosForSlide3 = [
      getBedroomPhoto() || allPhotos[2],
      getKitchenPhoto() || allPhotos[3],
      getBathroomPhoto() || getExternalPhoto() || allPhotos[4],
    ].filter(Boolean) as string[];
    
    // Get the correct labels based on actual photo categories
    const labelsForSlide3 = photosForSlide3.map(url => getCategoryLabelForUrl(url));
    
    slides.push({
      name: 'Ambientes',
      component: <RevendaMultiPhotoStory 
        data={data} 
        photos={photosForSlide3.slice(0, 3)} 
        photoLabels={labelsForSlide3.slice(0, 3)}
        label="Lifestyle" 
        variant="split-bottom" 
      />,
    });

    // Story 4: Price - Decision making elements
    slides.push({
      name: 'Detalhes',
      component: <RevendaPriceStory data={data} photo={getExternalPhoto() || getFacadePhoto()} />,
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
      const exportedImages: { dataUrl: string; index: number }[] = [];
      
      for (let i = 0; i < slides.length; i++) {
        const ref = postRefs.current[i];
        if (ref) {
          const dataUrl = await toPng(ref, { quality: 1, pixelRatio: 2 });
          const base64Data = dataUrl.split(',')[1];
          zip.file(`revenda-${format}-${i + 1}.png`, base64Data, { base64: true });
          exportedImages.push({ dataUrl, index: i });
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.download = `revenda-${format}-completo.zip`;
      link.href = URL.createObjectURL(content);
      link.click();

      // Save to library and CRM
      if (user && exportedImages.length > 0) {
        await saveCreativeAndCrm(exportedImages);
      }

      toast({
        title: 'Exportado!',
        description: `${slides.length} slides exportados e salvos na biblioteca.`,
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

  // Helper to save creative to database and create CRM entry
  const saveCreativeAndCrm = async (exportedImages: { dataUrl: string; index: number }[]) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const title = `${data.type} - ${data.neighborhood || data.city || 'Revenda'}`;
      
      // Convert data URLs to blobs and upload
      const uploadedUrls: string[] = [];
      for (const img of exportedImages) {
        const blob = await (await fetch(img.dataUrl)).blob();
        const fileName = `${user.id}/${Date.now()}-${img.index}.png`;
        
        const { error: uploadError } = await supabase.storage
          .from('exported-creatives')
          .upload(fileName, blob, { contentType: 'image/png' });
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('exported-creatives')
          .getPublicUrl(fileName);
        
        uploadedUrls.push(urlData.publicUrl);
      }
      
      // Create creative entry
      const { data: creative, error } = await supabase
        .from('creatives')
        .insert({
          user_id: user.id,
          title,
          property_data: data as unknown as Json,
          photos: photos.map(p => p.url),
          thumbnail_url: uploadedUrls[0] || null,
          exported_images: uploadedUrls,
          format,
        })
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await logActivity('create_creative', 'creative', creative.id, {
        title,
        type: data.type,
        city: data.city,
        neighborhood: data.neighborhood,
        photos_count: photos.length,
        exported_count: uploadedUrls.length,
        format,
      });

      // CRM Integration
      if (uploadedUrls[0]) {
        const propertyCode = `REV-${creative.id.slice(0, 8).toUpperCase()}`;
        const crmCoverUrl = await copyImageToCrmStorage(uploadedUrls[0], propertyCode);
        
        const parsePrice = (priceStr: string): number => {
          if (!priceStr) return 0;
          const numericStr = priceStr.replace(/\D/g, '');
          return numericStr ? parseInt(numericStr, 10) / 100 : 0;
        };

        await createCrmPropertyFromCreative({
          code: propertyCode,
          propertyType: mapPropertyType(data.type),
          city: data.city || 'Campo Grande',
          state: data.state || 'MS',
          neighborhood: data.neighborhood || undefined,
          saleValue: parsePrice(data.price),
          coverImageUrl: crmCoverUrl || uploadedUrls[0],
          sourceCreativeId: creative.id,
          createdByUserId: user.id,
        });
      }
    } catch (error) {
      console.error('Error saving creative:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to map property type
  const mapPropertyType = (type?: string): 'casa' | 'apartamento' | 'terreno' | 'comercial' | 'rural' | 'outro' => {
    if (!type) return 'casa';
    const lower = type.toLowerCase();
    if (lower.includes('casa') || lower.includes('sobrado')) return 'casa';
    if (lower.includes('apart') || lower.includes('cobertura') || lower.includes('duplex') || lower.includes('loft') || lower.includes('studio')) return 'apartamento';
    if (lower.includes('terr') || lower.includes('lote')) return 'terreno';
    if (lower.includes('comercial') || lower.includes('sala') || lower.includes('loja')) return 'comercial';
    if (lower.includes('rural') || lower.includes('chac') || lower.includes('sitio') || lower.includes('fazenda')) return 'rural';
    return 'outro';
  };

  // Scale and dimensions based on format - responsive for mobile
  const templateWidth = 1080;
  const templateHeight = format === 'feed' ? 1080 : 1920;
  // Use smaller preview on mobile
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
                ? 'bg-sky-500 hover:bg-sky-600 text-white' 
                : 'border-slate-200 text-slate-600'
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
                ? 'bg-sky-500 hover:bg-sky-600 text-white' 
                : 'border-slate-200 text-slate-600'
            )}
          >
            <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Stories
          </Button>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportSingle(currentSlide)}
            className="border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm px-2 sm:px-3"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">Slide</span>
          </Button>
          <Button
            size="sm"
            onClick={handleExportAll}
            className="bg-sky-500 hover:bg-sky-600 text-white text-xs sm:text-sm px-2 sm:px-3"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
        </div>
      </div>

      {/* Preview Container */}
      <div 
        className="relative rounded-xl overflow-hidden w-full max-w-full mx-auto"
        style={{ 
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
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

        {/* Preview Area */}
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
                  ? "ring-2 ring-sky-500 ring-offset-1 sm:ring-offset-2 ring-offset-slate-900" 
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