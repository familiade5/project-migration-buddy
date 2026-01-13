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
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onChange([...photos, result]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  }, [photos, onChange]);

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg text-gold">Fotos do Imóvel</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden bg-surface group"
          >
            <img
              src={photo}
              alt={`Foto ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => removePhoto(index)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-background/80 text-xs text-foreground">
              Foto {index + 1}
            </div>
          </div>
        ))}
        
        {photos.length < 4 && (
          <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gold/50 hover:bg-surface transition-all group">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload className="w-8 h-8 text-muted-foreground group-hover:text-gold transition-colors" />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              Adicionar foto
            </span>
          </label>
        )}
      </div>

      {photos.length === 0 && (
        <div className="flex items-center gap-2 text-muted-foreground text-sm p-3 rounded-lg bg-surface">
          <ImageIcon className="w-4 h-4" />
          <span>Adicione até 4 fotos do imóvel</span>
        </div>
      )}

      {photos.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {photos.length}/4 fotos adicionadas
          </p>
          {onClear && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              className="gap-2 text-destructive hover:text-destructive"
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
