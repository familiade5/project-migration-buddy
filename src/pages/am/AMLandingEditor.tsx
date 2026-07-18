import { useEffect, useMemo, useState } from 'react';
import { AMLayout } from '@/components/layout/AMLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { makeLandingSlug } from '@/lib/landingSlug';
import { toast } from '@/hooks/use-toast';
import { Sparkles, Save, ExternalLink, Loader2, Plus, X, Trash2, RefreshCw, Copy } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const DEFAULT_DATA = {
  propertyName: '',
  propertyType: 'Apartamento',
  neighborhood: '',
  city: 'Manaus',
  state: 'AM',
  address: '',
  bedrooms: 3,
  bathrooms: 2,
  suites: 1,
  area: 65,
  garageSpaces: 1,
  salePrice: 0,
  rentalPrice: 0,
  isRental: false,
};

export default function AMLandingEditor() {
  const { user } = useAuth();
  const [list, setList] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [data, setData] = useState<any>(DEFAULT_DATA);
  const [code, setCode] = useState('');
  const [slug, setSlug] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoInput, setPhotoInput] = useState('');
  const [copy, setCopy] = useState<any>({ benefits: [] });
  const [broker, setBroker] = useState<any>({
    name: 'Iury Sampaio',
    phone: '(92) 98839-1098',
    creci: 'CRECI 3968 AM PF',
  });
  const [accent, setAccent] = useState('#1B5EA6');
  const [whatsappMsg, setWhatsappMsg] = useState('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  const previewSlug = useMemo(
    () => slug || makeLandingSlug({ propertyName: data.propertyName, neighborhood: data.neighborhood, code }),
    [slug, data.propertyName, data.neighborhood, code]
  );

  const loadList = async () => {
    const { data: rows } = await supabase
      .from('am_landing_pages')
      .select('id, slug, code, data, is_active, view_count, whatsapp_click_count, updated_at')
      .order('updated_at', { ascending: false })
      .limit(50);
    setList(rows || []);
  };

  useEffect(() => { loadList(); }, []);

  const loadOne = async (id: string) => {
    const { data: row } = await supabase.from('am_landing_pages').select('*').eq('id', id).maybeSingle();
    if (!row) return;
    setEditingId(row.id);
    setSlug(row.slug);
    setCode(row.code);
    setData(row.data || DEFAULT_DATA);
    setPhotos((row.photos as any) || []);
    setCopy((row.copy as any) || { benefits: [] });
    setBroker((row.broker as any) || {});
    setAccent(row.accent_color || '#1B5EA6');
    setWhatsappMsg(row.whatsapp_message || '');
  };

  const resetForm = () => {
    setEditingId(null); setSlug(''); setCode(''); setData(DEFAULT_DATA); setPhotos([]);
    setCopy({ benefits: [] }); setWhatsappMsg('');
  };

  const addPhoto = () => {
    if (photoInput.trim()) { setPhotos((p) => [...p, photoInput.trim()]); setPhotoInput(''); }
  };

  const generateCopy = async () => {
    if (!data.propertyName && !data.neighborhood) {
      toast({ title: 'Preencha ao menos nome ou bairro', variant: 'destructive' });
      return;
    }
    setGenerating(true);
    try {
      const { data: resp, error } = await supabase.functions.invoke('generate-landing-copy', { body: { data } });
      if (error) throw error;
      if (resp?.copy) {
        setCopy(resp.copy);
        toast({ title: 'Texto gerado com IA!' });
      }
    } catch (e: any) {
      toast({ title: 'Erro ao gerar texto', description: e.message, variant: 'destructive' });
    } finally { setGenerating(false); }
  };

  const save = async (publish = true) => {
    setSaving(true);
    try {
      const finalCode = code || `AM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const finalSlug = slug || makeLandingSlug({ propertyName: data.propertyName, neighborhood: data.neighborhood, code: finalCode });
      const payload = {
        code: finalCode,
        slug: finalSlug,
        data, photos, copy, broker,
        accent_color: accent,
        whatsapp_message: whatsappMsg,
        is_active: publish,
        sections: ['hero', 'specs', 'gallery', 'description', 'benefits', 'location', 'contact'],
        created_by: user?.id,
      };
      let error;
      if (editingId) {
        ({ error } = await supabase.from('am_landing_pages').update(payload).eq('id', editingId));
      } else {
        const { data: inserted, error: err } = await supabase.from('am_landing_pages').insert(payload).select('id').maybeSingle();
        error = err;
        if (inserted) setEditingId(inserted.id);
      }
      if (error) throw error;
      setSlug(finalSlug); setCode(finalCode);
      toast({ title: publish ? 'Landing publicada!' : 'Rascunho salvo' });
      loadList();
    } catch (e: any) {
      toast({ title: 'Erro ao salvar', description: e.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm('Excluir esta landing page?')) return;
    await supabase.from('am_landing_pages').delete().eq('id', id);
    if (editingId === id) resetForm();
    loadList();
  };

  const publicUrl = `${window.location.origin}/imovel/${previewSlug}`;

  return (
    <AMLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Landing Pages de Imóveis</h1>
            <p className="text-sm text-gray-500">Crie páginas de apresentação para captar leads via WhatsApp</p>
          </div>
          <Button onClick={resetForm} variant="outline"><Plus className="w-4 h-4 mr-1" />Nova landing</Button>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr_1fr] gap-4">
          {/* Lista */}
          <div className="bg-white rounded-2xl border border-gray-200 p-3 space-y-2 max-h-[80vh] overflow-y-auto">
            <p className="text-xs font-semibold text-gray-500 uppercase px-2 pb-2">Suas landings ({list.length})</p>
            {list.length === 0 && <p className="text-sm text-gray-400 px-2">Nenhuma landing criada ainda.</p>}
            {list.map((r) => (
              <div key={r.id}
                className={`p-3 rounded-xl border cursor-pointer transition ${editingId === r.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                onClick={() => loadOne(r.id)}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{(r.data as any)?.propertyName || r.code}</p>
                    <p className="text-xs text-gray-500 truncate">{(r.data as any)?.neighborhood}</p>
                    <p className="text-[10px] text-gray-400 mt-1">👁 {r.view_count} • 💬 {r.whatsapp_click_count}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); del(r.id); }} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Editor */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Editor</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={generateCopy} disabled={generating}>
                  {generating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
                  Gerar texto IA
                </Button>
                <Button size="sm" onClick={() => save(true)} disabled={saving} style={{ backgroundColor: '#1B5EA6' }}>
                  {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                  Publicar
                </Button>
              </div>
            </div>

            <details className="border rounded-xl p-3" open>
              <summary className="font-semibold text-sm cursor-pointer">📋 Dados do imóvel</summary>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Field label="Nome do empreendimento" v={data.propertyName} on={(v) => setData({ ...data, propertyName: v })} full />
                <Field label="Bairro" v={data.neighborhood} on={(v) => setData({ ...data, neighborhood: v })} />
                <Field label="Cidade" v={data.city} on={(v) => setData({ ...data, city: v })} />
                <Field label="Endereço" v={data.address} on={(v) => setData({ ...data, address: v })} full />
                <Field label="Quartos" type="number" v={data.bedrooms} on={(v) => setData({ ...data, bedrooms: +v })} />
                <Field label="Banheiros" type="number" v={data.bathrooms} on={(v) => setData({ ...data, bathrooms: +v })} />
                <Field label="Área (m²)" type="number" v={data.area} on={(v) => setData({ ...data, area: +v })} />
                <Field label="Vagas" type="number" v={data.garageSpaces} on={(v) => setData({ ...data, garageSpaces: +v })} />
                <Field label="Preço venda" type="number" v={data.salePrice} on={(v) => setData({ ...data, salePrice: +v })} />
                <Field label="Preço aluguel" type="number" v={data.rentalPrice} on={(v) => setData({ ...data, rentalPrice: +v })} />
                <div className="col-span-2 flex items-center gap-2">
                  <input type="checkbox" checked={data.isRental} onChange={(e) => setData({ ...data, isRental: e.target.checked })} id="rental" />
                  <label htmlFor="rental" className="text-sm">É aluguel?</label>
                </div>
              </div>
            </details>

            <details className="border rounded-xl p-3">
              <summary className="font-semibold text-sm cursor-pointer">🖼️ Fotos ({photos.length})</summary>
              <div className="mt-3 space-y-2">
                <div className="flex gap-2">
                  <Input value={photoInput} onChange={(e) => setPhotoInput(e.target.value)} placeholder="URL da imagem (https://...)" />
                  <Button size="sm" onClick={addPhoto}>Adicionar</Button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {photos.map((p, i) => (
                    <div key={i} className="relative aspect-square rounded overflow-hidden border">
                      <img src={p} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => setPhotos(photos.filter((_, k) => k !== i))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </details>

            <details className="border rounded-xl p-3" open>
              <summary className="font-semibold text-sm cursor-pointer">✍️ Textos da landing</summary>
              <div className="space-y-3 mt-3">
                <Field label="Título principal (hero)" v={copy.heroHeadline || ''} on={(v) => setCopy({ ...copy, heroHeadline: v })} full />
                <Field label="Subtítulo" v={copy.heroSubtitle || ''} on={(v) => setCopy({ ...copy, heroSubtitle: v })} full />
                <div>
                  <Label className="text-xs">Descrição emocional</Label>
                  <Textarea rows={6} value={copy.description || ''} onChange={(e) => setCopy({ ...copy, description: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Diferenciais (um por linha)</Label>
                  <Textarea rows={5}
                    value={(copy.benefits || []).join('\n')}
                    onChange={(e) => setCopy({ ...copy, benefits: e.target.value.split('\n').filter(Boolean) })} />
                </div>
                <Field label="Texto do botão WhatsApp" v={copy.ctaText || ''} on={(v) => setCopy({ ...copy, ctaText: v })} full />
              </div>
            </details>

            <details className="border rounded-xl p-3">
              <summary className="font-semibold text-sm cursor-pointer">👤 Corretor & CTA</summary>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Field label="Nome" v={broker.name} on={(v) => setBroker({ ...broker, name: v })} />
                <Field label="Telefone WhatsApp" v={broker.phone} on={(v) => setBroker({ ...broker, phone: v })} />
                <Field label="CRECI" v={broker.creci} on={(v) => setBroker({ ...broker, creci: v })} />
                <div className="col-span-2">
                  <Label className="text-xs">Mensagem WhatsApp pré-preenchida</Label>
                  <Textarea rows={3} value={whatsappMsg} onChange={(e) => setWhatsappMsg(e.target.value)}
                    placeholder="Deixe em branco para usar mensagem padrão" />
                </div>
                <div>
                  <Label className="text-xs">Cor de destaque</Label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="h-9 w-16 rounded" />
                    <Input value={accent} onChange={(e) => setAccent(e.target.value)} />
                  </div>
                </div>
              </div>
            </details>

            {editingId && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-green-800">URL pública</p>
                  <p className="text-xs text-green-700 truncate">{publicUrl}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(publicUrl); toast({ title: 'Copiado!' }); }}>
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => window.open(publicUrl, '_blank')}>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden max-h-[80vh] flex flex-col">
            <div className="px-4 py-2 border-b bg-gray-50 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Preview ao vivo</p>
              {editingId && (
                <button onClick={() => { const iframe = document.getElementById('landing-preview') as HTMLIFrameElement; if (iframe) iframe.src = iframe.src; }}
                  className="text-gray-500 hover:text-gray-800"><RefreshCw className="w-4 h-4" /></button>
              )}
            </div>
            {editingId ? (
              <iframe id="landing-preview" src={publicUrl} className="w-full flex-1" title="Preview" />
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8 text-gray-400">
                Salve a landing para visualizar o preview ao vivo
              </div>
            )}
          </div>
        </div>
      </div>
    </AMLayout>
  );
}

function Field({ label, v, on, type = 'text', full = false }: any) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <Label className="text-xs">{label}</Label>
      <Input type={type} value={v ?? ''} onChange={(e) => on(e.target.value)} />
    </div>
  );
}