import { useState } from 'react';
import { Tag, Loader2, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
import { AMPropertyData } from '@/types/apartamentosManaus';
import { buildOlxDescription } from '@/lib/olxCaption';
import { uploadOlxPhotos } from '@/lib/olxPhotos';

interface Props {
  data: AMPropertyData;
  photos: string[];
  disabled?: boolean;
  /**
   * Optional callback to capture the designed feed slides (cover + slides do criador de post),
   * upload them as JPEG and return their public HTTPS URLs. When provided, these slides are
   * prepended to the original property photos so that the OLX/ZAP/VivaReal listing leads with
   * the designed creatives instead of only the raw uploaded photos.
   */
  prepareSlides?: () => Promise<string[]>;
}

function buildDefaultDescription(
  d: AMPropertyData,
  txType: 'venda' | 'aluguel' | 'lancamento',
): string {
  return buildOlxDescription(d, txType);
}

export function AMPublishOlxOnlyButton({ data, photos, disabled, prepareSlides }: Props) {
  const [open, setOpen] = useState(false);
  const [txType, setTxType] = useState<'venda' | 'aluguel' | 'lancamento'>(data.isRental ? 'aluguel' : 'venda');
  const [description, setDescription] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const validate = (): string | null => {
    if (!data.zipCode?.trim()) return 'CEP é obrigatório — preencha no formulário.';
    if (!data.address?.trim() || !data.neighborhood?.trim() || !data.city?.trim())
      return 'Endereço, bairro e cidade são obrigatórios para a OLX.';
    if (!photos || photos.length === 0) return 'Adicione pelo menos 1 foto do imóvel.';
    if (!data.brokerName?.trim() || !data.brokerPhone?.trim()) return 'Nome e telefone do corretor são obrigatórios.';
    return null;
  };

  const handleStart = () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setTxType(data.isRental ? 'aluguel' : 'venda');
    setDescription(buildDefaultDescription(data, data.isRental ? 'aluguel' : 'venda'));
    setOpen(true);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const code = `AM-${Date.now().toString(36).toUpperCase()}`;

      // 1) Capture designed feed slides (cover + slides) and upload as HTTPS JPEGs
      let slideUrls: string[] = [];
      if (prepareSlides) {
        try {
          slideUrls = await prepareSlides();
        } catch (e) {
          console.error('[AMPublishOlxOnlyButton] prepareSlides failed', e);
          toast.error('Não foi possível gerar a capa/slides. Publicando apenas com fotos originais.');
        }
      }

      // 2) Upload the original property photos (data URIs → HTTPS)
      const uploadedPhotos = await uploadOlxPhotos(photos, 'am', code);

      // 3) Designed slides first (capa + slides), then the original photos.
      //    OLX/ZAP/VivaReal use the first image as the cover.
      const finalPhotos = [...slideUrls, ...uploadedPhotos];

      if (!finalPhotos.length) {
        toast.error('Falha ao subir as fotos do imóvel. Tente novamente.');
        return;
      }
      const payload = {
        code,
        transaction_type: txType,
        property_type: data.propertyType,
        title: data.title,
        description: description.slice(0, 4000),
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
        sale_price: txType === 'aluguel' ? null : (data.salePrice || null),
        rental_price: txType === 'aluguel' ? (data.rentalPrice || null) : null,
        condominium_fee: data.condominiumFee || 0,
        iptu: data.iptu || 0,
        accepts_financing: data.acceptsFinancing,
        accepts_fgts: data.acceptsFGTS,
        photos: finalPhotos,
        broker_name: data.brokerName,
        broker_phone: data.brokerPhone,
        creci: data.creci,
        is_active: true,
      };
      const { error } = await supabase.from('am_olx_listings').insert(payload);
      if (error) throw error;
      toast.success(`Imóvel adicionado ao catálogo OLX (${code})! Os portais sincronizam nas próximas horas.`);
      setOpen(false);
    } catch (err) {
      const m = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error(`Falha ao adicionar ao catálogo: ${m}`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={handleStart}
        disabled={disabled}
        variant="outline"
        className="w-full gap-2 border-2"
        style={{ borderColor: '#1B5EA6', color: '#1B5EA6' }}
      >
        <Tag className="w-4 h-4" />
        Publicar somente na OLX / ZAP / VivaReal
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl sm:rounded-lg" style={{ backgroundColor: '#ffffff', color: '#111827' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: '#111827' }}>
              <Tag className="w-5 h-5" />
              Publicar no Canal Pro (sem postar no Instagram)
            </DialogTitle>
            <DialogDescription style={{ color: '#6b7280' }}>
              O imóvel será adicionado ao feed XML que OLX, ZAP e VivaReal sincronizam.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-xl p-3 text-sm border" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
              <p className="font-semibold text-gray-900">{data.title}</p>
              <p className="text-gray-500 text-xs mt-0.5">
                {data.neighborhood} · {data.city}/{data.state} · {photos.length} foto(s)
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Tipo de anúncio</Label>
              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                {(['venda', 'aluguel', 'lancamento'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTxType(t)}
                    className="flex-1 py-1.5 rounded-md text-xs font-semibold transition-all capitalize"
                    style={
                      txType === t
                        ? { backgroundColor: '#1B5EA6', color: 'white' }
                        : { color: '#6B7280', backgroundColor: 'transparent' }
                    }
                  >
                    {t === 'lancamento' ? 'Lançamento' : t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                Descrição (vai para os portais)
              </Label>
              <button
                type="button"
                onClick={() => setDescription(buildDefaultDescription(data, txType))}
                className="text-[11px] font-semibold underline text-gray-500 hover:text-gray-700"
              >
                Regenerar descrição padrão
              </button>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                maxLength={4000}
                className="resize-y bg-white text-gray-900 border-gray-300"
              />
              <p className="text-[11px] text-gray-400 text-right">{description.length}/4000</p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPublishing}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="text-white"
              style={{ backgroundColor: '#1B5EA6' }}
            >
              {isPublishing ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <Send className="mr-2 w-4 h-4" />}
              {isPublishing ? 'Enviando...' : 'Enviar para OLX'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}