import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  LocacaoCategorizedPhoto, 
  LocacaoPhotoCategory, 
  locacaoPhotoCategoryLabels 
} from '@/types/locacao';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LocacaoPhotoUploadProps {
  photos: LocacaoCategorizedPhoto[];
  onChange: (photos: LocacaoCategorizedPhoto[]) => void;
  onClear: () => void;
  maxPhotos?: number;
}

export const LocacaoPhotoUpload = ({ photos, onChange, onClear, maxPhotos }: LocacaoPhotoUploadProps) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectingCount, setDetectingCount] = useState(0);

  const isMaxReached = maxPhotos !== undefined && photos.length >= maxPhotos;

  const detectPhotoCategory = async (imageBase64: string): Promise<LocacaoPhotoCategory> => {
    try {
      const { data, error } = await supabase.functions.invoke('detect-photo-category', {
        body: { imageBase64 }
      });
      
      if (error) {
        console.error('Detection error:', error);
        return 'outros';
      }
      
      return (data?.category as LocacaoPhotoCategory) || 'outros';
    } catch (err) {
      console.error('Failed to detect category:', err);
      return 'outros';
    }
  };

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setIsDetecting(true);
    setDetectingCount(fileArray.length);
    
    toast.info(`Analisando ${fileArray.length} foto(s)...`, { duration: 2000 });

    const processFile = async (file: File): Promise<LocacaoCategorizedPhoto> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const result = event.target?.result as string;
          const category = await detectPhotoCategory(result);
          
          resolve({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url: result,
            category,
            order: 0,
          });
        };
        reader.readAsDataURL(file);
      });
    };

    try {
      const newPhotos = await Promise.all(fileArray.map(processFile));
      
      const updatedPhotos = [...photos];
      newPhotos.forEach(photo => {
        const categoryCount = updatedPhotos.filter(p => p.category === photo.category).length;
        photo.order = categoryCount;
        updatedPhotos.push(photo);
      });
      
      onChange(updatedPhotos);
      toast.success(`${newPhotos.length} foto(s) adicionada(s)`, { duration: 2000 });
    } catch (err) {
      console.error('Error processing photos:', err);
      toast.error('Erro ao processar fotos');
    } finally {
      setIsDetecting(false);
      setDetectingCount(0);
      e.target.value = '';
    }
  }, [photos, onChange]);

  const removePhoto = (id: string) => {
    onChange(photos.filter(p => p.id !== id));
  };

  const updateCategory = (id: string, category: LocacaoPhotoCategory) => {
    onChange(photos.map(p => p.id === id ? { ...p, category } : p));
  };

  const categories: LocacaoPhotoCategory[] = ['fachada', 'sala', 'quarto', 'cozinha', 'banheiro', 'area-externa', 'outros'];

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <label 
        className={cn(
          "relative flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all",
          isDetecting || isMaxReached ? "opacity-50 pointer-events-none" : "hover:border-gray-400"
        )}
        style={{ borderColor: '#d1d5db', backgroundColor: '#f9fafb' }}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          disabled={isDetecting || isMaxReached}
        />
        {isMaxReached ? (
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="w-8 h-8" style={{ color: '#9ca3af' }} />
            <span className="text-sm" style={{ color: '#6b7280' }}>
              Limite de {maxPhotos} foto(s) atingido
            </span>
          </div>
        ) : isDetecting ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#6b7280' }} />
            <span className="text-sm" style={{ color: '#6b7280' }}>
              Processando {detectingCount} foto(s)...
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" style={{ color: '#9ca3af' }} />
              <Upload className="w-5 h-5" style={{ color: '#9ca3af' }} />
            </div>
            <span className="text-sm font-medium" style={{ color: '#374151' }}>
              Arraste fotos ou clique para selecionar
            </span>
            <span className="text-xs" style={{ color: '#9ca3af' }}>
              Detecção automática de cômodos
            </span>
          </>
        )}
      </label>

      {/* Photos Grid */}
      {photos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: '#374151' }}>
              {photos.length} foto(s)
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-xs"
              style={{ color: '#6b7280' }}
            >
              Limpar todas
            </Button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {photos.map((photo) => (
              <div 
                key={photo.id} 
                className="relative group rounded-lg overflow-hidden"
                style={{ aspectRatio: '1/1' }}
              >
                <img
                  src={photo.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                >
                  <X className="w-3 h-3 text-white" />
                </button>
                <select
                  value={photo.category}
                  onChange={(e) => updateCategory(photo.id, e.target.value as LocacaoPhotoCategory)}
                  className="absolute bottom-0 left-0 right-0 text-xs py-1 px-1 bg-black/70 text-white border-none focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {locacaoPhotoCategoryLabels[cat]}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {photos.length === 0 && !isDetecting && (
        <div className="flex flex-col items-center justify-center py-8">
          <ImageIcon className="w-10 h-10 mb-2" style={{ color: '#d1d5db' }} />
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            Nenhuma foto adicionada ainda
          </p>
        </div>
      )}
    </div>
  );
};
