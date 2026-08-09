import { useState } from 'react';
import { z } from 'zod';
import { Loader2, Send, ImageIcon, PencilLine, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AFPropertyData } from '@/types/apartamentosFortaleza';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface PreparedPublishPayload {
  imageUrls: string[];
  previewDataUrls: string[];
  storyImageUrl?: string;
  storyPreviewDataUrl?: string;
  caption: string;
}

interface AFInstagramPublishDialogProps {
  data: AFPropertyData;
  photos: string[];
  disabled?: boolean;
  onPrepare: () => Promise<PreparedPublishPayload>;
}

/**
 * A edge function `publish-social-media` resolve valores não numéricos como
 * nome de secret, então passamos o nome do secret configurado com o ID da
 * conta do Instagram do Apartamentos Fortaleza.
 */
const AF_INSTAGRAM_ACCOUNT = 'AF_INSTAGRAM_BUSINESS_ACCOUNT_ID';
const AF_FACEBOOK_PAGE = 'AF_FACEBOOK_PAGE_ID';

const preparedImagesSchema = z.object({
  image_urls: z.array(z.string().url()).min(1).max(15),
});

const publishSchema = z.object({
  image_urls: z.array(z.string().url()).min(1).max(15),
  caption: z.string().trim().min(1).max(2200),
});

const getInstagramErrorMessage = (instagramResult: unknown): string => {
  if (!instagramResult || typeof instagramResult !== 'object') {
    return 'Não foi possível publicar no Instagram.';
  }
  const result = instagramResult as {
    error?: string | { message?: string; error_user_msg?: string; error_user_title?: string };
  };
  if (typeof result.error === 'string') return result.error;
  if (result.error?.error_user_title) return result.error.error_user_title;
  if (result.error?.error_user_msg) return result.error.error_user_msg;
  if (result.error?.message) return result.error.message;
  return 'Não foi possível publicar no Instagram.';
};

export const AFInstagramPublishDialog = ({
  data,
  photos,
  disabled = false,
  onPrepare,
}: AFInstagramPublishDialogProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'images' | 'caption'>('images');
  const [caption, setCaption] = useState('');
  const [captionError, setCaptionError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [previewDataUrls, setPreviewDataUrls] = useState<string[]>([]);
  const [storyImageUrl, setStoryImageUrl] = useState<string | undefined>();
  const [storyPreviewDataUrl, setStoryPreviewDataUrl] = useState<string | undefined>();
  const [isPreparing, setIsPreparing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const resetState = () => {
    setStep('images');
    setCaptionError(null);
    setCaption('');
    setImageUrls([]);
    setPreviewDataUrls([]);
    setStoryImageUrl(undefined);
    setStoryPreviewDataUrl(undefined);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) resetState();
  };

  const handleStartPublish = async () => {
    setIsPreparing(true);
    try {
      const prepared = await onPrepare();
      const validation = preparedImagesSchema.safeParse({ image_urls: prepared.imageUrls });
      if (!validation.success) {
        throw new Error(
          validation.error.flatten().fieldErrors.image_urls?.[0] || 'Não foi possível preparar as imagens.',
        );
      }
      setPreviewDataUrls(prepared.previewDataUrls);
      setImageUrls(prepared.imageUrls);
      setStoryImageUrl(prepared.storyImageUrl);
      setStoryPreviewDataUrl(prepared.storyPreviewDataUrl);
      setCaption(prepared.caption);
      setCaptionError(null);
      setStep('images');
      setOpen(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível preparar a publicação.';
      toast.error(message);
    } finally {
      setIsPreparing(false);
    }
  };

  const handlePublish = async () => {
    const validation = publishSchema.safeParse({ image_urls: imageUrls, caption });
    if (!validation.success) {
      const captionMessage = validation.error.flatten().fieldErrors.caption?.[0] || null;
      setCaptionError(captionMessage);
      toast.error(captionMessage || 'Revise a legenda e as imagens antes de publicar.');
      return;
    }

    setCaptionError(null);
    setIsPublishing(true);
    try {
      const { data: publishResponse, error } = await supabase.functions.invoke('publish-social-media', {
        body: {
          ...validation.data,
          instagram_account_id: AF_INSTAGRAM_ACCOUNT,
          facebook_page_id: AF_FACEBOOK_PAGE,
        },
      });
      if (error) throw error;

      const instagramResult =
        publishResponse && typeof publishResponse === 'object'
          ? (publishResponse as { instagram?: { success?: boolean } }).instagram
          : null;
      const facebookResult =
        publishResponse && typeof publishResponse === 'object'
          ? (publishResponse as { facebook?: { success?: boolean; skipped?: boolean } }).facebook
          : null;

      if (!instagramResult?.success) {
        throw new Error(getInstagramErrorMessage(instagramResult));
      }

      if (facebookResult?.success) {
        toast.success('Também publicado na página do Facebook do AF!');
      } else if (facebookResult && !facebookResult.skipped) {
        toast.warning('Instagram OK, mas o Facebook falhou.');
      }

      // Story (mesmo fluxo do AM)
      if (storyImageUrl) {
        try {
          const { data: storyResponse, error: storyError } = await supabase.functions.invoke('publish-social-media', {
            body: {
              story_image_url: storyImageUrl,
              instagram_account_id: AF_INSTAGRAM_ACCOUNT,
            },
          });
          if (storyError || !storyResponse?.instagram_story?.success) {
            console.error('AF Story publish error:', storyError);
            toast.warning('Carrossel publicado, mas o Story falhou.');
          } else {
            toast.success('Story do AF também publicado!');
          }
        } catch (storyErr) {
          console.error('AF Story publish error:', storyErr);
          toast.warning('Carrossel publicado, mas o Story não foi postado.');
        }
      }

      toast.success('Carrossel do AF publicado no Instagram com sucesso!');
      handleOpenChange(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível publicar no Instagram.';
      toast.error(message, {
        duration: 20000,
        action: { label: 'Tentar novamente', onClick: () => { void handlePublish(); } },
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={handleStartPublish}
        disabled={disabled || isPreparing || isPublishing || photos.length === 0}
        className="flex w-full gap-2 text-white"
        style={{ backgroundColor: '#0C7B8E' }}
      >
        {isPreparing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {isPreparing ? 'Preparando publicação...' : 'Postar no Instagram AF'}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="max-w-4xl sm:rounded-lg"
          style={{ backgroundColor: '#ffffff', color: '#111827', borderColor: '#e5e7eb' }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: '#111827' }}>
              {step === 'images' ? <ImageIcon className="w-5 h-5" /> : <PencilLine className="w-5 h-5" />}
              {step === 'images' ? 'Confirme as imagens do carrossel' : 'Revise a legenda do Instagram'}
            </DialogTitle>
            <DialogDescription style={{ color: '#6b7280' }}>
              {step === 'images'
                ? 'Confira a ordem e o visual dos slides antes de seguir.'
                : 'A legenda já veio preenchida. Ajuste o texto antes de publicar.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2 text-xs font-medium">
            <span
              className="inline-flex items-center gap-1 rounded-full px-3 py-1"
              style={step === 'images'
                ? { backgroundColor: '#fef3c7', color: '#92400e' }
                : { backgroundColor: '#d1fae5', color: '#065f46' }}
            >
              {step === 'images' ? <ImageIcon className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              1. Imagens
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-full px-3 py-1"
              style={step === 'caption'
                ? { backgroundColor: '#fef3c7', color: '#92400e' }
                : { backgroundColor: '#f3f4f6', color: '#6b7280' }}
            >
              <PencilLine className="w-3.5 h-3.5" />
              2. Legenda
            </span>
          </div>

          {step === 'images' ? (
            <div className="space-y-4">
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{ backgroundColor: '#e0f2fe', color: '#0c4a6e', border: '1px solid #bae6fd' }}
              >
                Você está prestes a publicar <strong>{previewDataUrls.length} imagem(ns)</strong> no Instagram do
                Apartamentos Fortaleza.{storyPreviewDataUrl && <> + <strong>1 Story</strong>.</>}
              </div>
              <div className="grid max-h-[60vh] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                {previewDataUrls.map((url, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-xl"
                    style={{ border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}
                  >
                    <div
                      className="flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wide"
                      style={{ borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}
                    >
                      <span>Slide {index + 1}</span>
                      <span>Feed</span>
                    </div>
                    <img src={url} alt={`Slide ${index + 1}`} className="block h-auto w-full" loading="lazy" />
                  </div>
                ))}
                {storyPreviewDataUrl && (
                  <div className="overflow-hidden rounded-xl" style={{ border: '1px solid #0C7B8E', backgroundColor: '#f0fbfd' }}>
                    <div
                      className="flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wide"
                      style={{ borderBottom: '1px solid #0C7B8E', color: '#0C7B8E' }}
                    >
                      <span>Story AF</span>
                      <span>9:16</span>
                    </div>
                    <img src={storyPreviewDataUrl} alt="Story AF" className="block h-auto w-full" loading="lazy" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: '#e0f2fe', color: '#0c4a6e', border: '1px solid #bae6fd' }}>
                Se a legenda estiver certa, confirme. Se precisar, edite antes do envio.
              </div>
              <Textarea
                value={caption}
                onChange={(event) => { setCaption(event.target.value); if (captionError) setCaptionError(null); }}
                maxLength={2200}
                className="min-h-[300px] resize-y text-sm"
                style={{ backgroundColor: '#ffffff', color: '#111827', borderColor: '#d1d5db' }}
                placeholder="Digite a legenda do Instagram"
              />
              <div className="flex items-center justify-between gap-3 text-xs">
                <span style={{ color: captionError ? '#dc2626' : '#6b7280' }}>
                  {captionError || 'A legenda será usada na descrição da publicação.'}
                </span>
                <span className="font-medium" style={{ color: '#6b7280' }}>{caption.trim().length}/2200</span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-between">
            {step === 'images' ? (
              <>
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep('caption')}
                  className="text-white"
                  style={{ backgroundColor: '#0C7B8E' }}
                >
                  Confirmar imagens
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={() => setStep('images')} disabled={isPublishing}>
                  Voltar
                </Button>
                <Button
                  type="button"
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="gap-2 text-white"
                  style={{ backgroundColor: '#E8562A' }}
                >
                  {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {isPublishing ? 'Publicando...' : 'Publicar no Instagram AF'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
