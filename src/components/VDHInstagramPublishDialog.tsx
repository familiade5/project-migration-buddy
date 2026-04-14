import { useMemo, useState } from 'react';
import { z } from 'zod';
import { Loader2, Send, ImageIcon, PencilLine, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyData } from '@/types/property';
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
import { useCrecis } from '@/hooks/useCrecis';
import { buildVdhCaption } from '@/lib/vdhCaption';

interface PreparedPublishPayload {
  imageUrls: string[];
  previewDataUrls: string[];
  storyImageUrl?: string;
  storyPreviewDataUrl?: string;
}

interface VDHInstagramPublishDialogProps {
  data: PropertyData;
  disabled?: boolean;
  onPrepare: () => Promise<PreparedPublishPayload>;
}

const preparedImagesSchema = z.object({
  image_urls: z.array(z.string().url('Uma das imagens preparadas é inválida.')).min(1, 'Nenhuma imagem foi gerada.').max(10, 'O Instagram aceita no máximo 10 imagens por publicação.'),
});

const publishSchema = z.object({
  image_urls: z.array(z.string().url('Uma das imagens enviadas é inválida.')).min(1, 'Nenhuma imagem pronta para publicação.').max(10, 'O Instagram aceita no máximo 10 imagens por publicação.'),
  caption: z.string().trim().min(1, 'A legenda não pode ficar vazia.').max(2200, 'A legenda pode ter no máximo 2200 caracteres.'),
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

export const VDHInstagramPublishDialog = ({
  data,
  disabled = false,
  onPrepare,
}: VDHInstagramPublishDialogProps) => {
  const { crecis, formatCreci } = useCrecis();

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

  const defaultCaption = useMemo(
    () => buildVdhCaption(data, crecis, formatCreci),
    [data, crecis, formatCreci],
  );

  const resetState = () => {
    setStep('images');
    setCaptionError(null);
    setCaption(defaultCaption);
    setImageUrls([]);
    setPreviewDataUrls([]);
    setStoryImageUrl(undefined);
    setStoryPreviewDataUrl(undefined);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetState();
    }
  };

  const handleStartPublish = async () => {
    setIsPreparing(true);

    try {
      const prepared = await onPrepare();
      const validation = preparedImagesSchema.safeParse({ image_urls: prepared.imageUrls });

      if (!validation.success) {
        throw new Error(validation.error.flatten().fieldErrors.image_urls?.[0] || 'Não foi possível preparar as imagens.');
      }

      if (prepared.previewDataUrls.length !== prepared.imageUrls.length) {
        throw new Error('As imagens geradas não conferem com as URLs públicas preparadas para publicação.');
      }

      setPreviewDataUrls(prepared.previewDataUrls);
      setImageUrls(prepared.imageUrls);
      setStoryImageUrl(prepared.storyImageUrl);
      setStoryPreviewDataUrl(prepared.storyPreviewDataUrl);
      setCaption(defaultCaption);
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
      toast.error(
        captionMessage ||
          validation.error.flatten().fieldErrors.image_urls?.[0] ||
          'Revise a legenda e as imagens antes de publicar.',
      );
      return;
    }

    setCaptionError(null);
    setIsPublishing(true);

    try {
      // Publish carousel
      const { data: publishResponse, error } = await supabase.functions.invoke('publish-social-media', {
        body: validation.data,
      });

      if (error) throw error;

      const instagramResult =
        publishResponse && typeof publishResponse === 'object'
          ? (publishResponse as { instagram?: { success?: boolean } }).instagram
          : null;

      if (!instagramResult?.success) {
        throw new Error(getInstagramErrorMessage(instagramResult));
      }

      // Publish VDH Story 1 if available
      if (storyImageUrl) {
        try {
          const { data: storyResponse, error: storyError } = await supabase.functions.invoke('publish-social-media', {
            body: { story_image_url: storyImageUrl },
          });

          if (storyError) {
            console.error('Story publish error:', storyError);
            toast.warning('Carrossel publicado, mas o Story não foi postado.');
          } else {
            const storyResult = storyResponse?.instagram_story;
            if (storyResult?.success) {
              toast.success('Story do VDH também publicado!');
            } else {
              toast.warning('Carrossel publicado, mas o Story falhou.');
            }
          }
        } catch (storyErr) {
          console.error('Story publish error:', storyErr);
          toast.warning('Carrossel publicado, mas o Story não foi postado.');
        }
      }

      toast.success('Carrossel do VDH publicado no Instagram com sucesso!');
      handleOpenChange(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível publicar no Instagram.';
      toast.error(message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={handleStartPublish}
        disabled={disabled || isPreparing || isPublishing}
        className="flex w-full gap-2 text-white"
        style={{ backgroundColor: '#C94F3D' }}
      >
        {isPreparing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {isPreparing ? 'Preparando publicação...' : 'Postar no Instagram'}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="max-w-4xl sm:rounded-lg"
          style={{
            backgroundColor: '#ffffff',
            color: '#111827',
            borderColor: '#e5e7eb',
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: '#111827' }}>
              {step === 'images' ? <ImageIcon className="w-5 h-5" /> : <PencilLine className="w-5 h-5" />}
              {step === 'images' ? 'Confirme as imagens do carrossel' : 'Revise a legenda do Instagram'}
            </DialogTitle>
            <DialogDescription style={{ color: '#6b7280' }}>
              {step === 'images'
                ? 'Confira a ordem, os cortes e o visual dos slides do VDH antes de seguir.'
                : 'A legenda já veio preenchida. Se quiser, ajuste o texto antes de publicar.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2 text-xs font-medium">
            <span
              className="inline-flex items-center gap-1 rounded-full px-3 py-1"
              style={step === 'images'
                ? { backgroundColor: '#fef3c7', color: '#92400e' }
                : { backgroundColor: '#d1fae5', color: '#065f46' }
              }
            >
              {step === 'images' ? <ImageIcon className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              1. Imagens
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-full px-3 py-1"
              style={step === 'caption'
                ? { backgroundColor: '#fef3c7', color: '#92400e' }
                : { backgroundColor: '#f3f4f6', color: '#6b7280' }
              }
            >
              <PencilLine className="w-3.5 h-3.5" />
              2. Legenda
            </span>
          </div>

          {step === 'images' ? (
            <div className="space-y-4">
              <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                Você está prestes a publicar <strong>{previewDataUrls.length} imagem(ns)</strong> do VDH no Instagram.
                {storyPreviewDataUrl && <> + <strong>1 Story VDH</strong>.</>}
              </div>

              <div className="grid max-h-[60vh] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                {previewDataUrls.map((previewDataUrl, index) => (
                  <div key={`${index}-${previewDataUrl.slice(0, 32)}`} className="overflow-hidden rounded-xl" style={{ border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                    <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wide" style={{ borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>
                      <span>Slide {index + 1}</span>
                      <span>Feed</span>
                    </div>
                    <img
                      src={previewDataUrl}
                      alt={`Prévia do slide ${index + 1} do carrossel do VDH`}
                      className="block h-auto w-full"
                      loading="lazy"
                    />
                  </div>
                ))}
                {storyPreviewDataUrl && (
                  <div className="overflow-hidden rounded-xl" style={{ border: '1px solid #a78bfa', backgroundColor: '#f5f3ff' }}>
                    <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wide" style={{ borderBottom: '1px solid #a78bfa', color: '#7c3aed' }}>
                      <span>Story VDH</span>
                      <span>9:16</span>
                    </div>
                    <img
                      src={storyPreviewDataUrl}
                      alt="Prévia do Story VDH"
                      className="block h-auto w-full"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: '#e0f2fe', color: '#0c4a6e', border: '1px solid #bae6fd' }}>
                Se a legenda estiver certa, basta confirmar. Se precisar, edite livremente antes do envio.
              </div>

              <Textarea
                value={caption}
                onChange={(event) => {
                  setCaption(event.target.value);
                  if (captionError) setCaptionError(null);
                }}
                maxLength={2200}
                className="min-h-[300px] resize-y"
                style={{ backgroundColor: '#ffffff', color: '#1f2937', borderColor: '#d1d5db' }}
                placeholder="Digite a legenda que será enviada para o Instagram"
              />

              <div className="flex items-center justify-between gap-3 text-xs">
                <span style={{ color: captionError ? '#dc2626' : '#6b7280' }}>
                  {captionError || 'A legenda será usada na descrição da publicação.'}
                </span>
                <span className="font-medium" style={{ color: '#6b7280' }}>{caption.trim().length}/2200</span>
              </div>
            </div>
          )}

          <DialogFooter>
            {step === 'images' ? (
              <>
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} style={{ backgroundColor: '#ffffff', color: '#374151', borderColor: '#d1d5db' }}>
                  Cancelar
                </Button>
                <Button type="button" onClick={() => setStep('caption')} className="text-white" style={{ backgroundColor: '#1A3A6B' }}>
                  As imagens estão corretas
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={() => setStep('images')} disabled={isPublishing} style={{ backgroundColor: '#ffffff', color: '#374151', borderColor: '#d1d5db' }}>
                  Voltar para imagens
                </Button>
                <Button type="button" onClick={handlePublish} disabled={isPublishing} className="text-white" style={{ backgroundColor: '#1A3A6B' }}>
                  {isPublishing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  {isPublishing ? 'Publicando...' : 'Confirmar e postar'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
