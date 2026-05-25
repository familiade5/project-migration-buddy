import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, ExternalLink, Tag, Copy, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface OlxListing {
  id: string;
  code: string;
  transaction_type: 'venda' | 'aluguel' | 'lancamento';
  title: string;
  city: string;
  neighborhood: string;
  sale_price: number | null;
  rental_price: number | null;
  photos: string[];
  is_active: boolean;
  created_at: string;
}

const FEED_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/vdh-olx-feed`;

const txLabel: Record<string, { label: string; color: string }> = {
  venda: { label: 'Venda', color: '#c9a84c' },
  aluguel: { label: 'Aluguel', color: '#1a3a6b' },
  lancamento: { label: 'Lançamento', color: '#7C3AED' },
};

const fmtCurrency = (v: number | null) =>
  v ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }) : '—';

export default function VDHOlxCatalog() {
  const [listings, setListings] = useState<OlxListing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('vdh_olx_listings')
      .select('id, code, transaction_type, title, city, neighborhood, sale_price, rental_price, photos, is_active, created_at')
      .order('created_at', { ascending: false });
    if (error) toast.error('Erro ao carregar catálogo');
    setListings((data as OlxListing[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchListings(); }, []);

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from('vdh_olx_listings').update({ is_active: !current }).eq('id', id);
    if (error) return toast.error('Erro ao atualizar');
    toast.success(current ? 'Imóvel desativado' : 'Imóvel reativado');
    fetchListings();
  };

  const removeListing = async (id: string) => {
    if (!confirm('Remover este imóvel do catálogo OLX?')) return;
    const { error } = await supabase.from('vdh_olx_listings').delete().eq('id', id);
    if (error) return toast.error('Erro ao remover');
    toast.success('Removido do catálogo');
    fetchListings();
  };

  const copyFeedUrl = () => {
    navigator.clipboard.writeText(FEED_URL);
    toast.success('URL copiada! Cole no Canal Pro → Integração de anúncios');
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Catálogo OLX — VDH</h1>
          <p className="text-sm text-gray-500">Imóveis publicados no feed XML que a OLX/ZAP/VivaReal sincronizam</p>
        </div>

        <div className="mb-6 rounded-2xl p-5 bg-white border border-gray-200 shadow-sm">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#fef3c7' }}>
              <Tag className="w-5 h-5" style={{ color: '#92400e' }} />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900 text-sm">URL de Integração (cole no Canal Pro)</h2>
              <p className="text-xs text-gray-500 mb-3">No Canal Pro → Configurações → Integração de anúncios → cole esta URL</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg font-mono text-gray-700 break-all">
                  {FEED_URL}
                </code>
                <Button size="sm" onClick={copyFeedUrl} className="text-white" style={{ backgroundColor: '#c9a84c' }}>
                  <Copy className="w-3.5 h-3.5 mr-1.5" /> Copiar
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={FEED_URL} target="_blank" rel="noreferrer">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 text-sm">{listings.length} imóvel(is) no catálogo</h2>
            <span className="text-xs text-gray-500">{listings.filter(l => l.is_active).length} ativo(s)</span>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            </div>
          ) : listings.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-500">
              Nenhum imóvel no catálogo ainda. Use "Postar no Instagram" no VDH e marque "Publicar também na OLX".
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {listings.map((l) => {
                const tx = txLabel[l.transaction_type];
                const price = l.transaction_type === 'aluguel' ? l.rental_price : l.sale_price;
                return (
                  <div key={l.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition">
                    <img src={l.photos?.[0] || '/placeholder.svg'} alt={l.title}
                      className="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase text-white" style={{ backgroundColor: tx.color }}>
                          {tx.label}
                        </span>
                        <code className="text-[10px] text-gray-400 font-mono">{l.code}</code>
                      </div>
                      <h3 className="font-semibold text-sm text-gray-900 truncate">{l.title}</h3>
                      <p className="text-xs text-gray-500 truncate">{l.neighborhood} · {l.city}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{fmtCurrency(price)}</div>
                      <div className="text-xs text-gray-400">{new Date(l.created_at).toLocaleDateString('pt-BR')}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => toggleActive(l.id, l.is_active)}
                        title={l.is_active ? 'Desativar' : 'Ativar'}>
                        {l.is_active
                          ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                          : <XCircle className="w-4 h-4 text-gray-400" />}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => removeListing(l.id)} title="Remover">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}