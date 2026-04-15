import { useState, useMemo, useRef } from 'react';
import { flushSync } from 'react-dom';
import { toPng } from 'html-to-image';
import { AutoPostQueueItem } from '@/hooks/useAutoPostQueue';
import { PropertyData } from '@/types/property';
import { PostCover } from '@/components/posts/PostCover';
import { PostContact } from '@/components/posts/PostContact';
import { VDHFeedPhotoSlide } from '@/components/posts/VDHFeedPhotoSlide';
import { VDHStory1 } from '@/components/posts/story/VDHStory1';
import { useCrecis } from '@/hooks/useCrecis';
import { buildVdhCaption } from '@/lib/vdhCaption';
import { supabase } from '@/integrations/supabase/client';
import { safePixelRatio, isIOS } from '@/lib/exportUtils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  ImageIcon, PencilLine, CheckCircle2, XCircle,
  Loader2, Send, ChevronLeft, ChevronRight,
} from 'lucide-react';

// Helper to convert data URL to Blob
const dataURLtoBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
};

const convertToJpeg = (pngDataUrl: string, quality = 0.92): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext('2d');
      if (!ctx) { reject(new Error('No ctx')); return; }
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0);
      resolve(c.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('img load failed'));
    img.src = pngDataUrl;
  });

interface Props {
  item: AutoPostQueueItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActionComplete: () => void;
}

export function AutoPostApprovalDialog({ item, open, onOpenChange, onActionComplete }: Props) {
  const { crecis, formatCreci } = useCrecis();
  const data = item.property_data as PropertyData;
  const photos = item.photos || [];

  const [step, setStep] = useState<'preview' | 'caption'>('preview');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [caption, setCaption] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [exportSlideEl, setExportSlideEl] = useState<React.ReactNode>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const defaultCaption = useMemo(
    () => buildVdhCaption(data, crecis, formatCreci),
    [data, crecis, formatCreci],
  );

  // Feed slides
  const feedSlides = useMemo(() => {
    const slides: { name: string; component: React.ComponentType<any>; photoIndex: number; slideIndex?: number }[] = [
      { name: 'Capa', component: PostCover, photoIndex: 0 },
      ...Array.from({ length: Math.max(0, photos.length - 2) }, (_, i) => ({
        name: `Foto ${i + 1}`,
        component: VDHFeedPhotoSlide,
        photoIndex: 1 + i,
        slideIndex: i,
      })),
      { name: 'Contato', component: PostContact, photoIndex: Math.max(0, photos.length - 1) },
    ];
    return slides;
  }, [photos.length]);

  const CurrentComponent = feedSlides[currentSlide]?.component;
  const currentPhoto = photos[feedSlides[currentSlide]?.photoIndex] || photos[0] || null;

  // Reset state on open
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setStep('preview');
      setCurrentSlide(0);
      setCaption('');
      setExportSlideEl(null);
    } else {
      setCaption(defaultCaption);
    }
    onOpenChange(nextOpen);
  };

  // Capture a single slide
  const captureSlide = async (
    Component: React.ComponentType<any>,
    photo: string | null,
    allPhotos: string[],
    extraProps?: any,
  ): Promise<string> => {
    flushSync(() => setExportSlideEl(
      <Component data={data} photo={photo} photos={allPhotos} {...extraProps} />
    ));
    await new Promise(r => setTimeout(r, isIOS() ? 1200 : 400));
    if (!exportRef.current) throw new Error('exportRef not mounted');
    return toPng(exportRef.current, { quality: 1, pixelRatio: safePixelRatio(), cacheBust: true });
  };

  // Upload image to storage
  const uploadImage = async (dataUrl: string, index: number, asJpeg = false): Promise<string> => {
    let finalDataUrl = dataUrl;
    let contentType = 'image/png';
    let ext = 'png';
    if (asJpeg) {
      finalDataUrl = await convertToJpeg(dataUrl);
      contentType = 'image/jpeg';
      ext = 'jpg';
    }
    const blob = dataURLtoBlob(finalDataUrl);
    const fileName = `auto-post/${item.id}/feed-${index + 1}.${ext}`;
    const { error } = await supabase.storage
      .from('exported-creatives')
      .upload(fileName, blob, { contentType, upsert: true });
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage
      .from('exported-creatives')
      .getPublicUrl(fileName);
    return publicUrl;
  };

  const handleApproveAndPublish = async () => {
    setIsPublishing(true);
    try {
      // 1. Capture all feed slides
      const imageUrls: string[] = [];
      for (let i = 0; i < feedSlides.length; i++) {
        const slide = feedSlides[i];
        const photo = photos[slide.photoIndex] || photos[0] || null;
        const dataUrl = await captureSlide(slide.component, photo, photos, {
          slideIndex: slide.slideIndex,
          totalSlides: feedSlides.length,
        });
        const publicUrl = await uploadImage(dataUrl, i);
        imageUrls.push(publicUrl);
      }

      // 2. Capture VDH Story 1
      let storyImageUrl: string | undefined;
      if (photos.length > 0) {
        const storyDataUrl = await captureSlide(VDHStory1, photos[0] || null, photos, {});
        storyImageUrl = await uploadImage(storyDataUrl, 0, true);
      }

      // 3. Publish carousel
      const { data: publishResponse, error: pubError } = await supabase.functions.invoke('publish-social-media', {
        body: { image_urls: imageUrls, caption },
      });
      if (pubError) throw pubError;
      const instagramResult = publishResponse?.instagram;
      if (!instagramResult?.success) {
        throw new Error(instagramResult?.error?.message || 'Falha ao publicar no Instagram');
      }

      // 4. Publish story
      if (storyImageUrl) {
        try {
          await supabase.functions.invoke('publish-social-media', {
            body: { story_image_url: storyImageUrl },
          });
        } catch (storyErr) {
          console.error('Story publish error:', storyErr);
          toast.warning('Carrossel publicado, mas o Story falhou.');
        }
      }

      // 5. Update queue status
      await supabase.from('auto_post_queue').update({
        status: 'published',
        generated_caption: caption,
        published_at: new Date().toISOString(),
        approved_by_user_id: (await supabase.auth.getUser()).data.user?.id,
      }).eq('id', item.id);

      toast.success('Post publicado com sucesso no Instagram!');
      handleOpenChange(false);
      onActionComplete();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao publicar';
      toast.error(msg);
      console.error(err);
    } finally {
      setIsPublishing(false);
      setExportSlideEl(null);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      await supabase.from('auto_post_queue').update({
        status: 'rejected',
      }).eq('id', item.id);
      toast.success('Imóvel rejeitado');
      handleOpenChange(false);
      onActionComplete();
    } catch {
      toast.error('Erro ao rejeitar');
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-4xl sm:rounded-lg"
        style={{ backgroundColor: '#ffffff', color: '#111827', borderColor: '#e5e7eb' }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ color: '#111827' }}>
            {step === 'preview' ? <ImageIcon className="w-5 h-5" /> : <PencilLine className="w-5 h-5" />}
            {step === 'preview' ? 'Revise o post gerado' : 'Revise a legenda'}
          </DialogTitle>
          <DialogDescription style={{ color: '#6b7280' }}>
            {step === 'preview'
              ? `${data.type || 'Imóvel'} em ${data.city || ''} - ${data.neighborhood || ''}`
              : 'Ajuste a legenda se necessário antes de publicar'}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="inline-flex items-center gap-1 rounded-full px-3 py-1"
            style={step === 'preview'
              ? { backgroundColor: '#fef3c7', color: '#92400e' }
              : { backgroundColor: '#d1fae5', color: '#065f46' }
            }>
            {step === 'preview' ? <ImageIcon className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            1. Imagens
          </span>
          <span className="inline-flex items-center gap-1 rounded-full px-3 py-1"
            style={step === 'caption'
              ? { backgroundColor: '#fef3c7', color: '#92400e' }
              : { backgroundColor: '#f3f4f6', color: '#6b7280' }
            }>
            <PencilLine className="w-3.5 h-3.5" />
            2. Legenda
          </span>
        </div>

        {step === 'preview' ? (
          <div className="space-y-4">
            {/* Property summary */}
            <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
              <strong>{feedSlides.length} slides</strong> do Feed + <strong>1 Story</strong> serão publicados.
              <br />
              <span className="text-xs">Valor mínimo: {data.minimumValue} ({data.discount}% de desconto)</span>
            </div>

            {/* Slide preview */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentSlide(p => p === 0 ? feedSlides.length - 1 : p - 1)}
                className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 shadow-sm"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="relative rounded-xl overflow-hidden flex-shrink-0"
                style={{ width: '280px', height: '280px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
                <div className="origin-top-left" style={{ width: '1080px', height: '1080px', transform: 'scale(0.2593)' }}>
                  {CurrentComponent && (
                    <CurrentComponent
                      data={data}
                      photo={currentPhoto}
                      photos={photos}
                      slideIndex={feedSlides[currentSlide]?.slideIndex}
                      totalSlides={feedSlides.length}
                    />
                  )}
                </div>
              </div>

              <button
                onClick={() => setCurrentSlide(p => p === feedSlides.length - 1 ? 0 : p + 1)}
                className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 shadow-sm"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Slide tabs */}
            <div className="flex items-center justify-center gap-1 flex-wrap">
              {feedSlides.map((s, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                  style={currentSlide === i
                    ? { backgroundColor: '#c9a84c', color: 'white', borderColor: '#c9a84c' }
                    : { backgroundColor: 'white', color: '#6b7280', borderColor: '#e5e7eb' }
                  }>
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: '#e0f2fe', color: '#0c4a6e', border: '1px solid #bae6fd' }}>
              Confira a legenda e clique em "Publicar" para postar no Instagram.
            </div>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={2200}
              className="min-h-[300px] resize-y"
              style={{ backgroundColor: '#ffffff', color: '#1f2937', borderColor: '#d1d5db' }}
            />
            <div className="flex justify-end text-xs" style={{ color: '#6b7280' }}>
              {caption.trim().length}/2200
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {item.status === 'pending' && (
            <Button
              variant="outline"
              onClick={handleReject}
              disabled={isPublishing || isRejecting}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              {isRejecting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
              Rejeitar
            </Button>
          )}

          {step === 'preview' ? (
            <>
              <Button variant="outline" onClick={() => handleOpenChange(false)}
                style={{ backgroundColor: '#ffffff', color: '#374151', borderColor: '#d1d5db' }}>
                Cancelar
              </Button>
              {item.status === 'pending' && (
                <Button onClick={() => { setCaption(defaultCaption); setStep('caption'); }}
                  className="text-white" style={{ backgroundColor: '#1A3A6B' }}>
                  Imagens OK, revisar legenda
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep('preview')} disabled={isPublishing}
                style={{ backgroundColor: '#ffffff', color: '#374151', borderColor: '#d1d5db' }}>
                Voltar
              </Button>
              <Button onClick={handleApproveAndPublish} disabled={isPublishing || !caption.trim()}
                className="text-white" style={{ backgroundColor: '#1A3A6B' }}>
                {isPublishing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                {isPublishing ? 'Publicando...' : 'Aprovar e Publicar'}
              </Button>
            </>
          )}
        </DialogFooter>

        {/* Hidden export element */}
        <div aria-hidden="true" style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: -9999, clipPath: 'inset(0 0 0 100%)' }}>
          <div ref={exportRef}>{exportSlideEl}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
