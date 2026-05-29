import { useMemo, useState } from 'react';
import { z } from 'zod';
import { Loader2, Send, ImageIcon, PencilLine, CheckCircle2, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AMPropertyData } from '@/types/apartamentosManaus';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { sanitizeCaptionForOlx, buildOlxDescription } from '@/lib/olxCaption';

interface PreparedPublishPayload {
  imageUrls: string[];
  previewDataUrls: string[];
  storyImageUrl?: string;
  storyPreviewDataUrl?: string;
  caption: string;
}

interface AMInstagramPublishDialogProps {
  data: AMPropertyData;
  photos: string[];
  disabled?: boolean;
  onPrepare: () => Promise<PreparedPublishPayload>;
  publishOlx: boolean;
  onPublishOlxChange: (value: boolean) => void;
  olxTxType: 'venda' | 'aluguel' | 'lancamento';
  onOlxTxTypeChange: (value: 'venda' | 'aluguel' | 'lancamento') => void;
}

const AM_INSTAGRAM_ACCOUNT_ID = '17841402886222668';

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

export const AMInstagramPublishDialog = ({
  data,
  photos,
  disabled = false,
  onPrepare,
  publishOlx,
  onPublishOlxChange,
  olxTxType,
  onOlxTxTypeChange,
}: AMInstagramPublishDialogProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'images' | 'caption'>('images');
  const [caption, setCaption] = useState('');
  const [captionError, setCaptionError] = useState<string | null>(null);
  const [olxCaption, setOlxCaption] = useState('');
  const [olxCaptionEdited, setOlxCaptionEdited] = useState(false);
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
    setOlxCaption('');
    setOlxCaptionEdited(false);
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
        throw new Error(validation.error.flatten().fieldErrors.image_urls?.[0] || 'Não foi possível preparar as imagens.');
      }
      setPreviewDataUrls(prepared.previewDataUrls);
      setImageUrls(prepared.imageUrls);
      setStoryImageUrl(prepared.storyImageUrl);
      setStoryPreviewDataUrl(prepared.storyPreviewDataUrl);
      setCaption(prepared.caption);
      setOlxCaption(buildOlxDescription(data, olxTxType));
      setOlxCaptionEdited(false);
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

    // Validação OLX se marcado
    if (publishOlx) {
      if (!data.zipCode?.trim()) {
        toast.error('CEP é obrigatório para publicar na OLX. Preencha no formulário.');
        return;
      }
      if (!data.address?.trim() || !data.neighborhood?.trim() || !data.city?.trim()) {
        toast.error('Endereço, bairro e cidade são obrigatórios para a OLX.');
        return;
      }
      if (photos.length === 0) {
        toast.error('Adicione pelo menos 1 foto do imóvel para publicar na OLX.');
        return;
      }
    }

    setCaptionError(null);
    setIsPublishing(true);

    try {
      // Publish carousel to AM Instagram + Facebook
      const { data: publishResponse, error } = await supabase.functions.invoke('publish-social-media', {
        body: {
          ...validation.data,
          instagram_account_id: AM_INSTAGRAM_ACCOUNT_ID,
          facebook_page_id: 'AM_FACEBOOK_PAGE_ID',
        },
      });

      if (error) throw error;

      const instagramResult =
        publishResponse && typeof publishResponse === 'object'
          ? (publishResponse as { instagram?: { success?: boolean }; facebook?: { success?: boolean; skipped?: boolean } }).instagram
          : null;
      const facebookResult =
        publishResponse && typeof publishResponse === 'object'
          ? (publishResponse as { facebook?: { success?: boolean; skipped?: boolean } }).facebook
          : null;

      if (!instagramResult?.success) {
        throw new Error(getInstagramErrorMessage(instagramResult));
      }

      // Facebook feedback
      if (facebookResult?.success) {
        toast.success('Também publicado na página do Facebook!');
      } else if (facebookResult && !facebookResult.skipped) {
        toast.warning('Instagram OK, mas o Facebook falhou.');
      }

      // Publish Story if available
      if (storyImageUrl) {
        try {
          const { data: storyResponse, error: storyError } = await supabase.functions.invoke('publish-social-media', {
            body: {
              story_image_url: storyImageUrl,
              instagram_account_id: AM_INSTAGRAM_ACCOUNT_ID,
            },
          });
          if (storyError) {
            console.error('AM Story publish error:', storyError);
            toast.warning('Carrossel publicado, mas o Story não foi postado.');
          } else {
            const storyResult = storyResponse?.instagram_story;
            if (storyResult?.success) {
              toast.success('Story do AM também publicado!');
            } else {
              toast.warning('Carrossel publicado, mas o Story falhou.');
            }
          }
        } catch (storyErr) {
          console.error('AM Story publish error:', storyErr);
          toast.warning('Carrossel publicado, mas o Story não foi postado.');
        }
      }

      toast.success('Carrossel do AM publicado no Instagram com sucesso!');

      // Salvar/atualizar no catálogo OLX se marcado
      if (publishOlx) {
        try {
          const code = `AM-${Date.now().toString(36).toUpperCase()}`;
          const payload = {
            code,
            transaction_type: olxTxType,
            property_type: data.propertyType,
            title: data.title,
            description: (olxCaption || sanitizeCaptionForOlx(caption)).slice(0, 4000),
            address: data.address,
            zip_code: data.zipCode.replace(/\D/g, ''),
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state || 'AM',
            area: data.area || null,
            bedrooms: data.bedrooms || 0,
            bathrooms: data.bathrooms || 0,
            suites: data.suites || 0,
            garage_spaces: data.garageSpaces || 0,
            floor: data.floor || null,
            furnished: data.furnished,
            sale_price: olxTxType === 'aluguel' ? null : (data.salePrice || null),
            rental_price: olxTxType === 'aluguel' ? (data.rentalPrice || null) : null,
            condominium_fee: data.condominiumFee || 0,
            iptu: data.iptu || 0,
            accepts_financing: data.acceptsFinancing,
            accepts_fgts: data.acceptsFGTS,
            photos,
            broker_name: data.brokerName,
            broker_phone: data.brokerPhone,
            creci: data.creci,
            is_active: true,
          };
          const { error: olxError } = await supabase.from('am_olx_listings').insert(payload);
          if (olxError) throw olxError;
          toast.success(`Imóvel adicionado ao catálogo OLX (${code})! A OLX irá sincronizar nas próximas horas.`);
        } catch (olxErr) {
          const m = olxErr instanceof Error ? olxErr.message : 'Erro desconhecido';
          toast.warning(`Instagram OK, mas falhou ao adicionar na OLX: ${m}`);
        }
      }

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
        style={{ backgroundColor: '#1B5EA6' }}
      >
        {isPreparing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {isPreparing ? 'Preparando publicação...' : 'Postar no Instagram AM'}
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
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1"
              style={step === 'images'
                ? { backgroundColor: '#fef3c7', color: '#92400e' }
                : { backgroundColor: '#d1fae5', color: '#065f46' }}>
              {step === 'images' ? <ImageIcon className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              1. Imagens
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1"
              style={step === 'caption'
                ? { backgroundColor: '#fef3c7', color: '#92400e' }
                : { backgroundColor: '#f3f4f6', color: '#6b7280' }}>
              <PencilLine className="w-3.5 h-3.5" />
              2. Legenda
            </span>
          </div>

          {step === 'images' ? (
            <div className="space-y-4">
              <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: '#e0f2fe', color: '#0c4a6e', border: '1px solid #bae6fd' }}>
                Você está prestes a publicar <strong>{previewDataUrls.length} imagem(ns)</strong> no Instagram do Apartamentos Manaus.
                {storyPreviewDataUrl && <> + <strong>1 Story</strong>.</>}
              </div>
              <div className="grid max-h-[60vh] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                {previewDataUrls.map((url, index) => (
                  <div key={index} className="overflow-hidden rounded-xl" style={{ border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                    <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wide" style={{ borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>
                      <span>Slide {index + 1}</span>
                      <span>Feed</span>
                    </div>
                    <img src={url} alt={`Slide ${index + 1}`} className="block h-auto w-full" loading="lazy" />
                  </div>
                ))}
                {storyPreviewDataUrl && (
                  <div className="overflow-hidden rounded-xl" style={{ border: '1px solid #1B5EA6', backgroundColor: '#f0f6ff' }}>
                    <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wide" style={{ borderBottom: '1px solid #1B5EA6', color: '#1B5EA6' }}>
                      <span>Story AM</span>
                      <span>9:16</span>
                    </div>
                    <img src={storyPreviewDataUrl} alt="Story AM" className="block h-auto w-full" loading="lazy" />
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
                onChange={(e) => {
                  const v = e.target.value;
                  setCaption(v);
                  // OLX description is built from the structured property data, not from
                  // the Instagram caption — keep them independent unless user regenerates.
                  if (captionError) setCaptionError(null);
                }}
                maxLength={2200}
                className="min-h-[300px] resize-y"
                style={{ backgroundColor: '#ffffff', color: '#1f2937', borderColor: '#d1d5db' }}
                placeholder="Digite a legenda do Instagram"
              />
              <div className="flex items-center justify-between gap-3 text-xs">
                <span style={{ color: captionError ? '#dc2626' : '#6b7280' }}>
                  {captionError || 'A legenda será usada na descrição da publicação.'}
                </span>
                <span className="font-medium" style={{ color: '#6b7280' }}>{caption.trim().length}/2200</span>
              </div>

              {publishOlx && (
                <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d' }}>
                  <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#78350f' }}>
                    <Tag className="w-4 h-4" />
                    Também será publicado na OLX / ZAP / VivaReal ({olxTxType === 'lancamento' ? 'Lançamento' : olxTxType})
                  </div>
                  {!data.zipCode && (
                    <p className="text-xs font-medium" style={{ color: '#dc2626' }}>
                      ⚠ CEP obrigatório — preencha no formulário antes de continuar.
                    </p>
                  )}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#78350f' }}>
                        Legenda da OLX (sem emojis e sem telefone)
                      </Label>
                      <button
                        type="button"
                        onClick={() => { setOlxCaption(buildOlxDescription(data, olxTxType)); setOlxCaptionEdited(false); }}
                        className="text-[11px] font-semibold underline"
                        style={{ color: '#78350f' }}
                      >
                        Regenerar descrição padrão OLX
                      </button>
                    </div>
                    <Textarea
                      value={olxCaption}
                      onChange={(e) => { setOlxCaption(e.target.value); setOlxCaptionEdited(true); }}
                      maxLength={4000}
                      className="min-h-[160px] resize-y bg-white"
                      style={{ color: '#1f2937', borderColor: '#fcd34d' }}
                      placeholder="Texto que vai para OLX / ZAP / VivaReal"
                    />
                    <p className="text-[11px] text-right" style={{ color: '#92400e' }}>{olxCaption.length}/4000</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {step === 'images' ? (
              <>
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} style={{ backgroundColor: '#ffffff', color: '#374151', borderColor: '#d1d5db' }}>
                  Cancelar
                </Button>
                <Button type="button" onClick={() => setStep('caption')} className="text-white" style={{ backgroundColor: '#1B5EA6' }}>
                  As imagens estão corretas
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={() => setStep('images')} disabled={isPublishing} style={{ backgroundColor: '#ffffff', color: '#374151', borderColor: '#d1d5db' }}>
                  Voltar para imagens
                </Button>
                <Button type="button" onClick={handlePublish} disabled={isPublishing} className="text-white" style={{ backgroundColor: '#1B5EA6' }}>
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
