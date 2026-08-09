import { useState, useEffect, useRef, useCallback } from 'react';
import { AFPropertyData, defaultAFPropertyData } from '@/types/apartamentosFortaleza';
import { AFPostPreview } from '@/components/apartamentos-fortaleza/AFPostPreview';
import { AFStoriesPreview } from '@/components/apartamentos-fortaleza/AFStoriesPreview';
import { AFPropertyForm } from '@/components/apartamentos-fortaleza/AFPropertyForm';
import { AFCaptionGenerator } from '@/components/apartamentos-fortaleza/AFCaptionGenerator';
import { AFPhotoManager } from '@/components/apartamentos-fortaleza/AFPhotoManager';
import { AFLayout } from '@/components/layout/AFLayout';
import { Image, Edit3, Sparkles, FileText, LayoutGrid, Smartphone, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { PublishToOlxButton } from '@/components/canal-pro/PublishToOlxButton';

const PRIMARY = '#0C7B8E';
const ACCENT = '#E8562A';
const STORAGE_KEY_DATA = 'af_property_data';
const STORAGE_KEY_PHOTOS = 'af_photos';

const ApartamentosFortalezaPage = () => {
  // Igual ao AM: sempre começa limpo ao entrar na página (sem cache local)
  const [propertyData, setPropertyData] = useState<AFPropertyData>(defaultAFPropertyData);
  const [photos, setPhotos] = useState<string[]>([]);
  const [previewTab, setPreviewTab] = useState<'feed' | 'stories'>('feed');

  // Limpa qualquer cache antigo de sessões anteriores
  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_KEY_PHOTOS);
      localStorage.removeItem(STORAGE_KEY_DATA);
    } catch { /* ignore */ }
  }, []);

  // Capturador de slides desenhados (registrado pelo AFPostPreview).
  // Usado pelo PublishToOlxButton para enviar à OLX as mesmas imagens do Instagram.
  const prepareOlxSlidesRef = useRef<(() => Promise<string[]>) | null>(null);
  const registerPrepareSlides = useCallback((fn: (() => Promise<string[]>) | null) => {
    prepareOlxSlidesRef.current = fn;
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

            {/* Publish to OLX / Canal Pro */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100" style={{ backgroundColor: '#FFF8F0' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: ACCENT }}>
                    <Tag className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Publicar no Canal Pro</h2>
                    <p className="text-xs text-gray-500">Envia para OLX / ZAP / VivaReal via feed XML</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <PublishToOlxButton
                  tableName="af_olx_listings"
                  accentColor={ACCENT}
                  codePrefix="AF"
                  initialCaption={propertyData.infoMessage || propertyData.title || ''}
                  prepareSlides={async () => {
                    if (!prepareOlxSlidesRef.current) {
                      throw new Error('Abra a aba "Feed" do preview antes de publicar para que os criativos sejam capturados.');
                    }
                    return prepareOlxSlidesRef.current();
                  }}
                  buildPayload={() => {
                    const isRental = propertyData.isRental;
                    return {
                      code: `AF-${Date.now().toString(36).toUpperCase()}`,
                      transaction_type: isRental ? 'aluguel' : 'venda',
                      property_type: propertyData.propertyType || 'Apartamento',
                      title: propertyData.title || `${propertyData.propertyType} ${propertyData.bedrooms} quartos - ${propertyData.neighborhood}`,
                      address: propertyData.address,
                      zip_code: (propertyData as unknown as { zipCode?: string }).zipCode || '',
                      neighborhood: propertyData.neighborhood,
                      city: propertyData.city,
                      state: propertyData.state || 'CE',
                      area: propertyData.area || null,
                      bedrooms: propertyData.bedrooms || 0,
                      bathrooms: propertyData.bathrooms || 0,
                      suites: propertyData.suites || 0,
                      garage_spaces: propertyData.garageSpaces || 0,
                      floor: propertyData.floor || null,
                      furnished: propertyData.furnished,
                      sale_price: isRental ? null : (propertyData.salePrice || null),
                      rental_price: isRental ? (propertyData.rentalPrice || null) : null,
                      condominium_fee: propertyData.condominiumFee || 0,
                      iptu: propertyData.iptu || 0,
                      accepts_financing: propertyData.acceptsFinancing,
                      accepts_fgts: propertyData.acceptsFGTS,
                      photos,
                      broker_name: propertyData.brokerName,
                      broker_phone: propertyData.brokerPhone,
                      creci: propertyData.creci,
                    };
                  }}
                />
              </div>
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
