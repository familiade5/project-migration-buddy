import { useState, useCallback } from 'react';
import { Upload, X, GripVertical, Plus, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  CategorizedPhoto, 
  PhotoCategory, 
  photoCategoryLabels, 
  photoCategoryOrder 
} from '@/types/revenda';
import { cn } from '@/lib/utils';

interface RevendaPhotoUploadProps {
  photos: CategorizedPhoto[];
  onChange: (photos: CategorizedPhoto[]) => void;
  onClear: () => void;
}

export const RevendaPhotoUpload = ({ photos, onChange, onClear }: RevendaPhotoUploadProps) => {
  const [activeCategory, setActiveCategory] = useState<PhotoCategory>('fachada');
  const [draggedPhoto, setDraggedPhoto] = useState<string | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const newPhoto: CategorizedPhoto = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: result,
          category: activeCategory,
          order: photos.filter(p => p.category === activeCategory).length,
        };
        onChange([...photos, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
    
    e.target.value = '';
  }, [photos, onChange, activeCategory]);

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
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {photoCategoryOrder.map((category) => {
          const count = categoryCount(category);
          const isActive = activeCategory === category;
          
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5",
                isActive 
                  ? "bg-sky-500 text-white shadow-sm"
                  : count > 0
                    ? "bg-sky-100 text-sky-700 hover:bg-sky-200"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              )}
            >
              {photoCategoryLabels[category]}
              {count > 0 && (
                <span className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
                  isActive ? "bg-white/20" : "bg-sky-500/10"
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Upload Area */}
      <label className={cn(
        "flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all",
        "border-slate-200 hover:border-sky-400 hover:bg-sky-50/50"
      )}>
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <Upload className="w-8 h-8" />
          <p className="text-sm">
            Adicionar fotos em <span className="text-sky-600 font-medium">{photoCategoryLabels[activeCategory]}</span>
          </p>
          <p className="text-xs text-slate-400">Arraste ou clique para selecionar</p>
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

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
      {totalPhotos === 0 && (
        <div className="text-center py-6 text-slate-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nenhuma foto adicionada ainda</p>
          <p className="text-xs">Adicione fotos por categoria para organizar seu post</p>
        </div>
      )}
    </div>
  );
};
