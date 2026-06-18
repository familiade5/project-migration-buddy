import { useState } from 'react';
import { Tag, Loader2, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { CanalProExtraData } from '@/types/canalProExtra';
import { uploadOlxPhotos } from '@/lib/olxPhotos';

export interface OlxListingPayload {
  code: string;
  transaction_type: 'venda' | 'aluguel' | 'lancamento';
  property_type: string;
  title: string;
  description?: string;
  address: string;
  address_number?: string | null;
  zip_code: string;
  neighborhood: string;
  city: string;
  state: string;
  area?: number | null;
  bedrooms?: number;
  bathrooms?: number;
  suites?: number;
  garage_spaces?: number;
  floor?: string | null;
  furnished?: boolean;
  sale_price?: number | null;
  rental_price?: number | null;
  condominium_fee?: number;
  iptu?: number;
  accepts_financing?: boolean;
  accepts_fgts?: boolean;
  photos: string[];
  broker_name: string;
  broker_phone: string;
  creci?: string | null;
}

interface Props {
  /** Nome da tabela onde inserir (vdh_olx_listings | af_olx_listings | am_olx_listings) */
  tableName: 'vdh_olx_listings' | 'af_olx_listings' | 'am_olx_listings';
  /** Função que monta o payload a partir do estado atual do form/preview */
  buildPayload: () => OlxListingPayload | null;
  /** Legenda inicial */
  initialCaption?: string;
  /** Cor do botão/destaque */
  accentColor?: string;
  /** Prefixo padrão do código (ex: VDH, AF) */
  codePrefix?: string;
  /** Validação adicional retornando string de erro ou null */
  validate?: () => string | null;
  /** Dados extras do Canal Pro (opcional — para futuro mapeamento) */
  extraData?: CanalProExtraData;
  /** Label do botão */
  label?: string;
  /**
   * Captura a capa + slides desenhados do criador de post e devolve URLs HTTPS.
   * OBRIGATÓRIO: sem isso a publicação OLX é abortada — nunca enviamos apenas
   * as fotos originais sem os criativos editados.
   */
  prepareSlides?: () => Promise<string[]>;
}

export function PublishToOlxButton({
  tableName,
  buildPayload,
  initialCaption = '',
  accentColor = '#1B5EA6',
  codePrefix = 'IM',
  validate,
  label = 'Publicar no Canal Pro (OLX / ZAP / VivaReal)',
  prepareSlides,
}: Props) {
  const [open, setOpen] = useState(false);
  const [txType, setTxType] = useState<'venda' | 'aluguel' | 'lancamento'>('venda');
  const [description, setDescription] = useState(initialCaption);
  const [isPublishing, setIsPublishing] = useState(false);
  const [draft, setDraft] = useState<OlxListingPayload | null>(null);

  const handleStart = () => {
    const customError = validate?.();
    if (customError) {
      toast.error(customError);
      return;
    }
    const payload = buildPayload();
    if (!payload) return;
    if (!payload.zip_code?.trim()) {
      toast.error('CEP é obrigatório — preencha no formulário antes de continuar.');
      return;
    }
    if (!payload.address?.trim() || !payload.neighborhood?.trim() || !payload.city?.trim()) {
      toast.error('Endereço, bairro e cidade são obrigatórios para a OLX.');
      return;
    }
    if (!payload.photos || payload.photos.length === 0) {
      toast.error('Adicione pelo menos 1 foto do imóvel para publicar na OLX.');
      return;
    }
    if (!payload.broker_name?.trim() || !payload.broker_phone?.trim()) {
      toast.error('Nome e telefone do corretor são obrigatórios.');
      return;
    }
    setDraft(payload);
    setTxType(payload.transaction_type || 'venda');
    setDescription(initialCaption || payload.description || '');
    setOpen(true);
  };

  const handlePublish = async () => {
    if (!draft) return;
    setIsPublishing(true);
    try {
      const code = draft.code?.trim() || `${codePrefix}-${Date.now().toString(36).toUpperCase()}`;

      // 1) Captura obrigatória dos slides desenhados
      if (!prepareSlides) {
        toast.error('Pré-visualização indisponível. Recarregue a página e tente novamente.');
        return;
      }
      let slideUrls: string[] = [];
      try {
        slideUrls = await prepareSlides();
      } catch (e) {
        console.error('[PublishToOlxButton] prepareSlides failed', e);
        const m = e instanceof Error ? e.message : 'Erro desconhecido';
        toast.error(`Falha ao gerar a capa/slides do criador de post: ${m}. Tente novamente.`);
        return;
      }
      if (!slideUrls.length) {
        toast.error('Nenhum slide foi gerado. Confirme que o preview está carregado e tente novamente.');
        return;
      }

      // 2) Upload das fotos originais como extras
      const uploadedPhotos = await uploadOlxPhotos(draft.photos, codePrefix.toLowerCase(), code);

      // 3) Slides desenhados primeiro (capa do anúncio = capa desenhada), depois fotos originais
      const finalPhotos = [...slideUrls, ...uploadedPhotos];

      const payload = {
        ...draft,
        code,
        transaction_type: txType,
        description: description.slice(0, 4000),
        sale_price: txType === 'aluguel' ? null : (draft.sale_price ?? null),
        rental_price: txType === 'aluguel' ? (draft.rental_price ?? null) : null,
        zip_code: draft.zip_code.replace(/\D/g, ''),
        photos: finalPhotos,
        is_active: true,
      };
      const { error } = await (supabase as unknown as { from: (t: string) => { insert: (p: unknown) => Promise<{ error: { message: string } | null }> } })
        .from(tableName).insert(payload);
      if (error) throw error;
      toast.success(`Imóvel adicionado ao catálogo OLX (${code})! Os portais sincronizam nas próximas horas.`);
      setOpen(false);
    } catch (err) {
      const m = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error(`Falha ao adicionar ao catálogo: ${m}`, {
        duration: 15000,
        action: { label: 'Tentar novamente', onClick: () => handlePublish() },
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <>
      <Button type="button" onClick={handleStart} className="flex w-full gap-2 text-white"
        style={{ backgroundColor: accentColor }}>
        <Tag className="w-4 h-4" />
        {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl sm:rounded-lg"
          style={{ backgroundColor: '#ffffff', color: '#111827', borderColor: '#e5e7eb' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: '#111827' }}>
              <Tag className="w-5 h-5" />
              Confirme a publicação no Canal Pro
            </DialogTitle>
            <DialogDescription style={{ color: '#6b7280' }}>
              O imóvel será adicionado ao feed XML que OLX, ZAP e VivaReal sincronizam.
            </DialogDescription>
          </DialogHeader>

          {draft && (
            <div className="space-y-4">
              <div className="rounded-xl p-3 text-sm border" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
                <p className="font-semibold text-gray-900">{draft.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {draft.neighborhood} · {draft.city}/{draft.state} · {draft.photos.length} foto(s)
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Tipo de anúncio</Label>
                <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                  {(['venda', 'aluguel', 'lancamento'] as const).map((t) => (
                    <button key={t} type="button" onClick={() => setTxType(t)}
                      className="flex-1 py-1.5 rounded-md text-xs font-semibold transition-all capitalize"
                      style={txType === t
                        ? { backgroundColor: accentColor, color: 'white' }
                        : { color: '#6B7280', backgroundColor: 'transparent' }}>
                      {t === 'lancamento' ? 'Lançamento' : t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Descrição (vai para o portal)
                </Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  rows={6} maxLength={4000}
                  placeholder="Descreva o imóvel, comodidades, diferenciais..."
                  className="resize-y bg-white text-gray-900 border-gray-300" />
                <p className="text-[11px] text-gray-400 text-right">{description.length}/4000</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPublishing}>
              Cancelar
            </Button>
            <Button type="button" onClick={handlePublish} disabled={isPublishing} className="text-white"
              style={{ backgroundColor: accentColor }}>
              {isPublishing ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <Send className="mr-2 w-4 h-4" />}
              {isPublishing ? 'Publicando...' : 'Confirmar e enviar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}