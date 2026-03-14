import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Check, X, Loader2, MapPin, Image, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PhotoSearcherProps {
  address: string;
  propertyType: string;
  onPhotosSelected: (photos: string[]) => void;
  onCondominiumFound?: (name: string) => void;
  onClear?: () => void;
}

interface PhotoResult {
  url: string;
  reference: string;
  selected?: boolean;
}

export const PhotoSearcher = ({ 
  address, 
  propertyType, 
  onPhotosSelected,
  onCondominiumFound,
  onClear
}: PhotoSearcherProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [photos, setPhotos] = useState<PhotoResult[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [condominiumName, setCondominiumName] = useState('');
  const [searchAddress, setSearchAddress] = useState(address);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchAddress.trim()) {
      toast.error('Digite um endereço para buscar');
      return;
    }

    setIsSearching(true);
    setPhotos([]);
    setSelectedPhotos([]);
    setCondominiumName('');
    setHasSearched(true);

    try {
      const { data, error } = await supabase.functions.invoke('search-property-photos', {
        body: { 
          address: searchAddress,
          propertyType 
        }
      });

      if (error) throw error;

      if (data.condominiumName) {
        setCondominiumName(data.condominiumName);
        onCondominiumFound?.(data.condominiumName);
        toast.success(`Condomínio encontrado: ${data.condominiumName}`);
      }

      if (data.photos && data.photos.length > 0) {
        setPhotos(data.photos.map((p: { url: string; reference: string }) => ({
          ...p,
          selected: false
        })));
        toast.success(`${data.photos.length} fotos encontradas!`);
      } else {
        toast.info('Nenhuma foto encontrada para este endereço');
      }

    } catch (error) {
      console.error('Error searching photos:', error);
      toast.error('Erro ao buscar fotos. Verifique a configuração da API.');
    } finally {
      setIsSearching(false);
    }
  };

  const togglePhotoSelection = (photoUrl: string) => {
    setSelectedPhotos(prev => {
      if (prev.includes(photoUrl)) {
        return prev.filter(p => p !== photoUrl);
      }
      if (prev.length >= 10) {
        toast.warning('Você pode selecionar no máximo 10 fotos');
        return prev;
      }
      return [...prev, photoUrl];
    });
  };

  const handleConfirmSelection = () => {
    if (selectedPhotos.length === 0) {
      toast.error('Selecione pelo menos uma foto');
      return;
    }
    onPhotosSelected(selectedPhotos);
    toast.success(`${selectedPhotos.length} foto(s) adicionada(s)!`);
  };

  const getSelectionOrder = (photoUrl: string) => {
    const index = selectedPhotos.indexOf(photoUrl);
    return index >= 0 ? index + 1 : null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2" style={{ color: '#c9a84c' }}>
        <Image className="w-5 h-5" />
        <h3 className="font-semibold text-base text-gray-800">Buscar Fotos do Imóvel</h3>
      </div>

      {/* Campo de busca */}
      <div className="space-y-2">
        <Label htmlFor="search-address" className="text-sm text-gray-500">
          Endereço para busca
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="search-address"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Digite o endereço completo..."
              className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={isSearching}
            className="gap-2 text-white"
            style={{ backgroundColor: '#1a3a6b' }}
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Buscar
          </Button>
        </div>
      </div>

      {/* Nome do condomínio encontrado */}
      {condominiumName && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <Building2 className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Condomínio identificado:</p>
            <p className="font-semibold text-green-700">{condominiumName}</p>
          </div>
        </div>
      )}

      {/* Grid de fotos */}
      {photos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Selecione até 10 fotos (clique para selecionar na ordem)
            </p>
            <span className="text-sm font-medium" style={{ color: '#c9a84c' }}>
              {selectedPhotos.length}/10 selecionadas
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto p-1">
            {photos.map((photo, index) => {
              const selectionOrder = getSelectionOrder(photo.url);
              const isSelected = selectionOrder !== null;

              return (
                <div
                  key={photo.reference || index}
                  onClick={() => togglePhotoSelection(photo.url)}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'ring-4 ring-amber-400 scale-[0.98]' 
                      : 'hover:ring-2 hover:ring-amber-300'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  {isSelected && (
                    <div className="absolute inset-0 bg-amber-400/20 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg text-white" style={{ backgroundColor: '#c9a84c' }}>
                        {selectionOrder}
                      </div>
                    </div>
                  )}

                  {!isSelected && (
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2">
            <Button
              onClick={handleConfirmSelection}
              disabled={selectedPhotos.length === 0}
              className="flex-1 gap-2 text-white"
              style={{ backgroundColor: '#1a3a6b' }}
            >
              <Check className="w-4 h-4" />
              Usar {selectedPhotos.length} foto(s) selecionada(s)
            </Button>
            {selectedPhotos.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setSelectedPhotos([])}
                className="gap-2 border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
                Limpar seleção
              </Button>
            )}
            {onClear && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedPhotos([]);
                  onClear();
                }}
                className="gap-2 border-red-200 text-red-500 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
                Limpar slides
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Estado vazio após busca */}
      {hasSearched && !isSearching && photos.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Image className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-gray-500">Nenhuma foto encontrada para este endereço.</p>
          <p className="text-sm mt-1">Tente buscar com um endereço diferente.</p>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        💡 As fotos são obtidas do Google Maps e podem incluir imagens do Street View e contribuições de usuários
      </p>
    </div>
  );
};
