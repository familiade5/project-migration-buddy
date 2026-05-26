import { useMemo, useState } from 'react';
import { z } from 'zod';
import { Loader2, Send, ImageIcon, PencilLine, CheckCircle2, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyData } from '@/types/property';
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
import { useCrecis } from '@/hooks/useCrecis';
import { buildVdhCaption } from '@/lib/vdhCaption';
import { sanitizeCaptionForOlx } from '@/lib/olxCaption';

interface PreparedPublishPayload {
  imageUrls: string[];
  previewDataUrls: string[];
  storyImageUrl?: string;
  storyPreviewDataUrl?: string;
}

interface VDHInstagramPublishDialogProps {
  data: PropertyData;
  photos?: string[];
  disabled?: boolean;
  onPrepare: () => Promise<PreparedPublishPayload>;
  publishOlx: boolean;
  onPublishOlxChange?: (value: boolean) => void;
  olxTxType: 'venda' | 'aluguel' | 'lancamento';
  onOlxTxTypeChange?: (value: 'venda' | 'aluguel' | 'lancamento') => void;
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
  photos = [],
  disabled = false,
  onPrepare,
  publishOlx,
  onPublishOlxChange,
  olxTxType,
  onOlxTxTypeChange,
}: VDHInstagramPublishDialogProps) => {
  const { crecis, formatCreci } = useCrecis();

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

  const defaultCaption = useMemo(
    () => buildVdhCaption(data, crecis, formatCreci),
    [data, crecis, formatCreci],
  );

  const resetState = () => {
    setStep('images');
    setCaptionError(null);
    setCaption(defaultCaption);
    setOlxCaption(sanitizeCaptionForOlx(defaultCaption));
    setOlxCaptionEdited(false);
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
      setOlxCaption(sanitizeCaptionForOlx(defaultCaption));
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
      toast.error(
        captionMessage ||
          validation.error.flatten().fieldErrors.image_urls?.[0] ||
          'Revise a legenda e as imagens antes de publicar.',
      );
      return;
    }

    // Validação OLX se marcado
    if (publishOlx) {
      if (!data.cep?.trim()) {
        toast.error('CEP é obrigatório para publicar na OLX. Preencha no formulário.');
        return;
      }
      const addr = (data.fullAddress || `${data.street || ''} ${data.number || ''}`).trim();
      if (!addr || !data.neighborhood?.trim() || !data.city?.trim()) {
        toast.error('Endereço, bairro e cidade são obrigatórios para a OLX.');
        return;
      }
      if (photos.length === 0) {
        toast.error('Adicione pelo menos 1 foto do imóvel para publicar na OLX.');
        return;
      }
      if (!data.contactName?.trim() || !data.contactPhone?.trim()) {
        toast.error('Nome e telefone do corretor são obrigatórios para a OLX.');
        return;
      }
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

      // Salvar no catálogo OLX se marcado
      if (publishOlx) {
        try {
          const parseCurrency = (s: string): number | null => {
            if (!s) return null;
            const n = Number(String(s).replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.'));
            return Number.isFinite(n) && n > 0 ? n : null;
          };
          const code = `VDH-${Date.now().toString(36).toUpperCase()}`;
          const title = `${data.type || 'Imóvel'}${data.bedrooms ? ` ${data.bedrooms} quartos` : ''} - ${data.neighborhood || data.city}`;
          const address = (data.fullAddress || `${data.street || ''} ${data.number || ''}`).trim();
          const payload = {
            code,
            transaction_type: olxTxType,
            property_type: data.type || 'Casa',
            title,
            description: (olxCaption || sanitizeCaptionForOlx(caption)).slice(0, 4000),
            address,
            address_number: data.number || null,
            zip_code: data.cep.replace(/\D/g, ''),
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state || 'MS',
            area: parseCurrency(data.area) || null,
            bedrooms: parseInt(data.bedrooms) || 0,
            bathrooms: parseInt(data.bathrooms) || 0,
            suites: 0,
            garage_spaces: parseInt(data.garageSpaces) || 0,
            floor: null,
            furnished: false,
            sale_price: olxTxType === 'aluguel' ? null : parseCurrency(data.minimumValue),
            rental_price: olxTxType === 'aluguel' ? parseCurrency(data.minimumValue) : null,
            condominium_fee: 0,
            iptu: 0,
            accepts_financing: data.acceptsFinancing,
            accepts_fgts: data.acceptsFGTS,
            photos: (() => {
              const sobreNosUrl = `${window.location.origin}/vdh-sobre-nos.png`;
              // Inserir "Sobre nós" como slide 2 (índice 1) apenas no OLX
              const out = [...photos];
              if (out.length > 0) {
                out.splice(1, 0, sobreNosUrl);
              } else {
                out.push(sobreNosUrl);
              }
              return out;
            })(),
            broker_name: data.contactName,
            broker_phone: data.contactPhone,
            creci: data.creci,
            is_active: true,
          };
          const { error: olxError } = await supabase.from('vdh_olx_listings').insert(payload);
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
                  const v = event.target.value;
                  setCaption(v);
                  if (!olxCaptionEdited) setOlxCaption(sanitizeCaptionForOlx(v));
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

              {/* OLX publish option */}
              <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d' }}>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="publish-olx-vdh"
                    checked={publishOlx}
                    onCheckedChange={(v) => setPublishOlx(v === true)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <Label htmlFor="publish-olx-vdh" className="text-sm font-semibold cursor-pointer" style={{ color: '#78350f' }}>
                      <Tag className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                      Publicar também na OLX / ZAP / VivaReal
                    </Label>
                    <p className="text-xs mt-1" style={{ color: '#92400e' }}>
                      O imóvel será adicionado ao catálogo XML. A OLX sincroniza automaticamente nas próximas horas.
                    </p>
                  </div>
                </div>

                {publishOlx && (
                  <div className="pl-7 space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#78350f' }}>
                      Tipo de anúncio
                    </Label>
                    <div className="flex items-center gap-1 p-1 bg-white rounded-lg" style={{ border: '1px solid #fcd34d' }}>
                      {(['venda', 'aluguel', 'lancamento'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setOlxTxType(t)}
                          className="flex-1 py-1.5 rounded-md text-xs font-semibold transition-all capitalize"
                          style={olxTxType === t
                            ? { backgroundColor: '#c9a84c', color: 'white' }
                            : { color: '#92400e', backgroundColor: 'transparent' }}
                        >
                          {t === 'lancamento' ? 'Lançamento' : t}
                        </button>
                      ))}
                    </div>
                    {!data.cep && (
                      <p className="text-xs font-medium" style={{ color: '#dc2626' }}>
                        ⚠ CEP obrigatório — preencha no formulário antes de continuar.
                      </p>
                    )}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between gap-2">
                        <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#78350f' }}>
                          Legenda da OLX (sem emojis e sem telefone)
                        </Label>
                        <button
                          type="button"
                          onClick={() => { setOlxCaption(sanitizeCaptionForOlx(caption)); setOlxCaptionEdited(false); }}
                          className="text-[11px] font-semibold underline"
                          style={{ color: '#78350f' }}
                        >
                          Regenerar a partir do Instagram
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
