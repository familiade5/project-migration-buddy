import { useState, useEffect, useRef, useCallback } from 'react';
import { AFPropertyData, defaultAFPropertyData } from '@/types/apartamentosFortaleza';
import { AFPostPreview } from '@/components/apartamentos-fortaleza/AFPostPreview';
import { AFStoriesPreview } from '@/components/apartamentos-fortaleza/AFStoriesPreview';
import { AFPropertyForm } from '@/components/apartamentos-fortaleza/AFPropertyForm';
import { AFCaptionGenerator } from '@/components/apartamentos-fortaleza/AFCaptionGenerator';
import { AFPhotoManager } from '@/components/apartamentos-fortaleza/AFPhotoManager';
import { AFLayout } from '@/components/layout/AFLayout';
import { Image, Edit3, Sparkles, FileText, LayoutGrid, Smartphone, Tag } from 'lucide-react';
import { Label } from '@/components/ui/label';

const PRIMARY = '#0C7B8E';
const ACCENT = '#E8562A';
const STORAGE_KEY_DATA = 'af_property_data';
const STORAGE_KEY_PHOTOS = 'af_photos';

const ApartamentosFortalezaPage = () => {
  // Igual ao AM: sempre começa limpo ao entrar na página (sem cache local)
  const [propertyData, setPropertyData] = useState<AFPropertyData>(defaultAFPropertyData);
  const [photos, setPhotos] = useState<string[]>([]);
  const [previewTab, setPreviewTab] = useState<'feed' | 'stories'>('feed');
  const [publishOlx, setPublishOlx] = useState(true);
  const [olxTxType, setOlxTxType] = useState<'venda' | 'aluguel' | 'lancamento'>('venda');


  // Limpa qualquer cache antigo de sessões anteriores
  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_KEY_PHOTOS);
      localStorage.removeItem(STORAGE_KEY_DATA);
    } catch { /* ignore */ }
  }, []);


  return (
    <AFLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Gerador de Posts</h1>
            <p className="text-sm text-gray-500">Crie criativos profissionais para Instagram</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-medium shadow"
              style={{ backgroundColor: PRIMARY }}>
              <Sparkles className="w-4 h-4" />
              <span>Feed + Story + Legenda</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 lg:gap-8">
          <div className="space-y-4">
            {/* OLX publish option (top) */}
            <div className="rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm" style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d' }}>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 flex-shrink-0" style={{ color: '#78350f' }} />
                <p className="text-sm font-semibold" style={{ color: '#78350f' }}>
                  Publicar também na OLX / ZAP / VivaReal?
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPublishOlx(true)}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={publishOlx
                    ? { backgroundColor: ACCENT, color: 'white' }
                    : { backgroundColor: 'white', color: '#92400e', border: '1px solid #fcd34d' }}
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => setPublishOlx(false)}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={!publishOlx
                    ? { backgroundColor: PRIMARY, color: 'white' }
                    : { backgroundColor: 'white', color: '#92400e', border: '1px solid #fcd34d' }}
                >
                  Não
                </button>
              </div>
              <p className="text-xs" style={{ color: '#92400e' }}>
                Ao postar no Instagram, o imóvel também será adicionado ao catálogo XML. A OLX sincroniza nas próximas horas.
              </p>
              {publishOlx && (
                <div className="space-y-2 pt-1">
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
                          ? { backgroundColor: ACCENT, color: 'white' }
                          : { color: '#92400e', backgroundColor: 'transparent' }}
                      >
                        {t === 'lancamento' ? 'Lançamento' : t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Photos */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100" style={{ backgroundColor: '#EDF7F9' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: PRIMARY }}>
                    <Image className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Fotos do Imóvel</h2>
                    <p className="text-xs text-gray-500 truncate">Adicione fotos — arraste para reordenar slides</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6"><AFPhotoManager photos={photos} onChange={setPhotos} /></div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100" style={{ backgroundColor: '#FFF5ED' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: ACCENT }}>
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Dados do Imóvel</h2>
                    <p className="text-xs text-gray-500">Preencha as informações para gerar os posts</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6"><AFPropertyForm data={propertyData} onChange={setPropertyData} /></div>
            </div>

            {/* Caption */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100" style={{ backgroundColor: '#EDF7F9' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: PRIMARY }}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Legenda do Post</h2>
                    <p className="text-xs text-gray-500">Gerada automaticamente — edite conforme necessário</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6"><AFCaptionGenerator data={propertyData} /></div>
            </div>

          </div>


          {/* Preview */}
          <div className="lg:sticky lg:top-6 self-start">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100" style={{ backgroundColor: '#EDF7F9' }}>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Preview dos Criativos</h2>
                    <p className="text-xs text-gray-500 hidden sm:block">Visualize e baixe os slides prontos</p>
                  </div>
                  <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-200 shadow-sm flex-shrink-0">
                    <button onClick={() => setPreviewTab('feed')}
                      className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                      style={previewTab === 'feed' ? { backgroundColor: PRIMARY, color: 'white' } : { color: '#6B7280' }}>
                      <LayoutGrid className="w-3.5 h-3.5" />Feed
                    </button>
                    <button onClick={() => setPreviewTab('stories')}
                      className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                      style={previewTab === 'stories' ? { backgroundColor: ACCENT, color: 'white' } : { color: '#6B7280' }}>
                      <Smartphone className="w-3.5 h-3.5" />Stories
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {previewTab === 'feed' ? (
                  <AFPostPreview data={propertyData} photos={photos} onRegisterPrepareSlides={registerPrepareSlides} />
                ) : (
                  <AFStoriesPreview data={propertyData} photos={photos} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AFLayout>
  );
};

export default ApartamentosFortalezaPage;
