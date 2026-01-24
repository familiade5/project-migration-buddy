import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  CategorizedPhoto, 
  PhotoCategory, 
  photoCategoryLabels, 
  photoCategoryOrder 
} from '@/types/revenda';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RevendaPhotoUploadProps {
  photos: CategorizedPhoto[];
  onChange: (photos: CategorizedPhoto[]) => void;
  onClear: () => void;
}

export const RevendaPhotoUpload = ({ photos, onChange, onClear }: RevendaPhotoUploadProps) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectingCount, setDetectingCount] = useState(0);

  const detectPhotoCategory = async (imageBase64: string): Promise<PhotoCategory> => {
    try {
      const { data, error } = await supabase.functions.invoke('detect-photo-category', {
        body: { imageBase64 }
      });
      
      if (error) {
        console.error('Detection error:', error);
        return 'outros';
      }
      
      return (data?.category as PhotoCategory) || 'outros';
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
    
    toast.info(`Analisando ${fileArray.length} foto(s) com IA...`, { duration: 2000 });

    const processFile = async (file: File): Promise<CategorizedPhoto> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const result = event.target?.result as string;
          const category = await detectPhotoCategory(result);
          
          resolve({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url: result,
            category,
            order: 0, // Will be set after all photos are processed
          });
        };
        reader.readAsDataURL(file);
      });
    };

    try {
      const newPhotos = await Promise.all(fileArray.map(processFile));
      
      // Set correct order for each category
      const updatedPhotos = [...photos];
      newPhotos.forEach(photo => {
        const categoryCount = updatedPhotos.filter(p => p.category === photo.category).length;
        photo.order = categoryCount;
        updatedPhotos.push(photo);
      });
      
      onChange(updatedPhotos);
      
      const categorySummary = newPhotos.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const summaryText = Object.entries(categorySummary)
        .map(([cat, count]) => `${count} ${photoCategoryLabels[cat as PhotoCategory]}`)
        .join(', ');
      
      toast.success(`Fotos categorizadas: ${summaryText}`, { duration: 3000 });
    } catch (err) {
      console.error('Error processing photos:', err);
      toast.error('Erro ao processar fotos');
    } finally {
      setIsDetecting(false);
      setDetectingCount(0);
      e.target.value = '';
    }
  }, [photos, onChange]);

  const removePhoto = useCallback((id: string) => {
    onChange(photos.filter(p => p.id !== id));
  }, [photos, onChange]);

  const changeCategory = useCallback((photoId: string, newCategory: PhotoCategory) => {
    onChange(photos.map(p => 
      p.id === photoId 
        ? { ...p, category: newCategory, order: photos.filter(x => x.category === newCategory).length }
        : p
    ));
  }, [photos, onChange]);

  const getPhotosByCategory = (category: PhotoCategory) => {
    return photos
      .filter(p => p.category === category)
      .sort((a, b) => a.order - b.order);
  };

  const movePhoto = useCallback((photoId: string, direction: 'up' | 'down') => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;
    
    const categoryPhotos = getPhotosByCategory(photo.category);
    const currentIndex = categoryPhotos.findIndex(p => p.id === photoId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= categoryPhotos.length) return;
    
    const reordered = [...categoryPhotos];
    [reordered[currentIndex], reordered[newIndex]] = [reordered[newIndex], reordered[currentIndex]];
    
    const updatedPhotos = photos.map(p => {
      const idx = reordered.findIndex(r => r.id === p.id);
      if (idx !== -1) {
        return { ...p, order: idx };
      }
      return p;
    });
    
    onChange(updatedPhotos);
  }, [photos, onChange]);

  const totalPhotos = photos.length;
  const categoryCount = (category: PhotoCategory) => photos.filter(p => p.category === category).length;

  return (
    <div className="space-y-4">
      {/* AI Detection Status */}
      {isDetecting && (
        <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-xl border border-sky-200">
          <Loader2 className="w-5 h-5 text-sky-600 animate-spin" />
          <div>
            <p className="text-sm font-medium text-sky-900">Analisando {detectingCount} foto(s)...</p>
            <p className="text-xs text-sky-600">A IA está detectando os cômodos automaticamente</p>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <label className={cn(
        "flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed cursor-pointer transition-all",
        isDetecting ? "opacity-50 pointer-events-none" : "",
        "border-slate-200 hover:border-sky-400 hover:bg-sky-50/50"
      )}>
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-500" />
            <Upload className="w-8 h-8" />
          </div>
          <p className="text-sm font-medium text-slate-600">
            Arraste fotos ou clique para selecionar
          </p>
          <p className="text-xs text-sky-600 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Detecção automática de cômodos com IA
          </p>
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          disabled={isDetecting}
        />
      </label>

      {/* Category Summary Pills */}
      {totalPhotos > 0 && (
        <div className="flex flex-wrap gap-2">
          {photoCategoryOrder.map((category) => {
            const count = categoryCount(category);
            if (count === 0) return null;
            
            return (
              <span
                key={category}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-sky-100 text-sky-700 flex items-center gap-1.5"
              >
                {photoCategoryLabels[category]}
                <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px]">
                  {count}
                </span>
              </span>
            );
          })}
        </div>
      )}

      {/* Photos Grid by Category */}
      {photoCategoryOrder.map((category) => {
        const categoryPhotos = getPhotosByCategory(category);
        if (categoryPhotos.length === 0) return null;
        
        return (
          <div key={category} className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-slate-700">
                {photoCategoryLabels[category]}
              </h4>
              <span className="text-xs text-slate-400">({categoryPhotos.length} fotos)</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {categoryPhotos.map((photo, index) => (
                <div 
                  key={photo.id}
                  className="relative group aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200"
                >
                  <img 
                    src={photo.url} 
                    alt={`${photoCategoryLabels[category]} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Order Badge */}
                  <div className="absolute top-1 left-1 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center text-xs font-medium text-slate-700 shadow-sm">
                    {index + 1}
                  </div>
                  
                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="p-1.5 bg-white/90 rounded-full hover:bg-red-100 transition-colors"
                      title="Remover"
                    >
                      <X className="w-3 h-3 text-red-600" />
                    </button>
                  </div>
                  
                  {/* Category Change Dropdown */}
                  <select
                    value={photo.category}
                    onChange={(e) => changeCategory(photo.id, e.target.value as PhotoCategory)}
                    className="absolute bottom-1 left-1 right-1 text-[10px] bg-white/90 rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {photoCategoryOrder.map(cat => (
                      <option key={cat} value={cat}>{photoCategoryLabels[cat]}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Footer Stats */}
      {totalPhotos > 0 && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <ImageIcon className="w-4 h-4" />
            <span>{totalPhotos} fotos adicionadas</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-slate-500 hover:text-red-600 text-xs"
          >
            Limpar tudo
          </Button>
        </div>
      )}

      {/* Empty State */}
      {totalPhotos === 0 && !isDetecting && (
        <div className="text-center py-6 text-slate-400">
          <div className="flex justify-center gap-2 mb-2">
            <Sparkles className="w-8 h-8 opacity-50 text-sky-400" />
            <ImageIcon className="w-12 h-12 opacity-50" />
          </div>
          <p className="text-sm font-medium text-slate-600">Nenhuma foto adicionada ainda</p>
          <p className="text-xs text-slate-400">Adicione fotos e a IA detectará automaticamente cada cômodo</p>
        </div>
      )}
    </div>
  );
};
