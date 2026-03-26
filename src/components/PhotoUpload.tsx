import { useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoUploadProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  onClear?: () => void;
}

export const PhotoUpload = ({ photos, onChange, onClear }: PhotoUploadProps) => {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const readers = files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.readAsDataURL(file);
        }),
    );

    Promise.all(readers).then((results) => {
      onChange([...photos, ...results]);
    });

    e.target.value = '';
  }, [photos, onChange]);

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group border border-gray-200"
          >
            <img
              src={photo}
              alt={`Foto ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => removePhoto(index)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500 shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-white/90 text-xs text-gray-700 shadow-sm">
              Foto {index + 1}
            </div>
          </div>
        ))}
        
        {photos.length < 10 && (
          <label className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-all group">
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/heic,image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload className="w-8 h-8 text-gray-300 group-hover:text-gray-400 transition-colors" />
            <span className="text-sm text-gray-400 group-hover:text-gray-500 transition-colors">
              Adicionar foto
            </span>
          </label>
        )}
      </div>

      {photos.length === 0 && (
        <div className="flex items-center gap-2 text-gray-400 text-sm p-3 rounded-lg bg-gray-50 border border-gray-200">
          <ImageIcon className="w-4 h-4" />
          <span>Adicione até 10 fotos do imóvel</span>
        </div>
      )}

      {photos.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-gray-500 text-sm">
            {photos.length}/10 fotos adicionadas
          </p>
          {onClear && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              className="gap-2 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
              Limpar todas
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
