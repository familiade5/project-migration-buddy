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
import { PropertyData } from '@/types/property';
import { sanitizeCaptionForOlx } from '@/lib/olxCaption';

interface Props {
  data: PropertyData;
  photos: string[];
  disabled?: boolean;
}

const parseCurrency = (s: string): number | null => {
  if (!s) return null;
  const n = Number(String(s).replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : null;
};

function buildDefaultDescription(d: PropertyData): string {
  const parts: string[] = [];
  parts.push(`${d.type || 'Imóvel'}${d.bedrooms ? ` com ${d.bedrooms} quartos` : ''} em ${d.neighborhood || d.city}`);
  parts.push('');
  const specs: string[] = [];
  if (d.bedrooms) specs.push(`${d.bedrooms} quarto(s)`);
  if (d.bathrooms) specs.push(`${d.bathrooms} banheiro(s)`);
  if (d.area) specs.push(`${d.area}m²`);
  if (d.garageSpaces) specs.push(`${d.garageSpaces} vaga(s)`);
  if (specs.length) parts.push(specs.join(' · '));
  if (d.acceptsFinancing) parts.push('Aceita financiamento.');
  if (d.acceptsFGTS) parts.push('Aceita FGTS.');
  parts.push('');
  const address = (d.fullAddress || `${d.street || ''} ${d.number || ''}`).trim();
  parts.push(`${address}${d.neighborhood ? ' - ' + d.neighborhood : ''}, ${d.city}/${d.state}`);
  return sanitizeCaptionForOlx(parts.join('\n'));
}

export function VDHPublishOlxOnlyButton({ data, photos, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [txType, setTxType] = useState<'venda' | 'aluguel' | 'lancamento'>('venda');
  const [description, setDescription] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const validate = (): string | null => {
    if (!data.cep?.trim()) return 'CEP é obrigatório — preencha no formulário.';
    const address = (data.fullAddress || `${data.street || ''} ${data.number || ''}`).trim();
    if (!address || !data.neighborhood?.trim() || !data.city?.trim())
      return 'Endereço, bairro e cidade são obrigatórios para a OLX.';
    if (!photos || photos.length === 0) return 'Adicione pelo menos 1 foto do imóvel.';
    if (!data.contactName?.trim() || !data.contactPhone?.trim()) return 'Nome e telefone do corretor são obrigatórios.';
    return null;
  };

  const handleStart = () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setTxType('venda');
    setDescription(buildDefaultDescription(data));
    setOpen(true);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const code = `VDH-${Date.now().toString(36).toUpperCase()}`;
      const title = `${data.type || 'Imóvel'}${data.bedrooms ? ` ${data.bedrooms} quartos` : ''} - ${data.neighborhood || data.city}`;
      const address = (data.fullAddress || `${data.street || ''} ${data.number || ''}`).trim();
      const { uploadOlxPhotos } = await import('@/lib/olxPhotos');
      const uploaded = await uploadOlxPhotos(photos, 'vdh', code);
      if (!uploaded.length) {
        toast.error('Falha ao subir as fotos do imóvel. Tente novamente.');
        return;
      }
      const sobreNosUrl = `${window.location.origin}/vdh-sobre-nos.png`;
      const out = [...uploaded];
      if (out.length > 0) out.splice(1, 0, sobreNosUrl);
      else out.push(sobreNosUrl);

      const payload = {
        code,
        transaction_type: txType,
        property_type: data.type || 'Casa',
        title,
        description: description.slice(0, 4000),
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
        sale_price: txType === 'aluguel' ? null : parseCurrency(data.minimumValue),
        rental_price: txType === 'aluguel' ? parseCurrency(data.minimumValue) : null,
        condominium_fee: 0,
        iptu: 0,
        accepts_financing: data.acceptsFinancing,
        accepts_fgts: data.acceptsFGTS,
        photos: out,
        broker_name: data.contactName,
        broker_phone: data.contactPhone,
        creci: data.creci,
        is_active: true,
      };
      const { error } = await supabase.from('vdh_olx_listings').insert(payload);
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
        style={{ borderColor: '#006633', color: '#006633' }}
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
              <p className="font-semibold text-gray-900">
                {data.type} {data.bedrooms ? `· ${data.bedrooms} quartos` : ''}
              </p>
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
                        ? { backgroundColor: '#006633', color: 'white' }
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
              style={{ backgroundColor: '#006633' }}
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