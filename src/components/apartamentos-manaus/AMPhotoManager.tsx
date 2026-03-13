/**
 * AMPhotoManager
 * - Upload + drag-and-drop reordering of photos
 * - The order here drives the slide order in AMPostPreview
 */
import { useRef } from 'react';
import { GripVertical, X, Upload } from 'lucide-react';

interface AMPhotoManagerProps {
  photos: string[];
  onChange: (photos: string[]) => void;
}

export function AMPhotoManager({ photos, onChange }: AMPhotoManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);

  const handleFiles = (files: FileList) => {
    const readers = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        }),
    );
    Promise.all(readers).then((results) => onChange([...photos, ...results]));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removePhoto = (index: number) => {
    const next = photos.filter((_, i) => i !== index);
    onChange(next);
  };

  // Drag-to-reorder
  const onDragStart = (index: number) => { dragItem.current = index; };
  const onDragEnter = (index: number) => { dragOver.current = index; };
  const onDragEnd = () => {
    if (dragItem.current === null || dragOver.current === null) return;
    if (dragItem.current === dragOver.current) return;
    const next = [...photos];
    const [moved] = next.splice(dragItem.current, 1);
    next.splice(dragOver.current, 0, moved);
    dragItem.current = null;
    dragOver.current = null;
    onChange(next);
  };

  const slideLabel = (index: number) => {
    if (index === 0) return 'Slide 1 – Capa';
    if (index === 1) return 'Slide 2 – Specs';
    if (index === 2) return 'Slide 3 – Local';
    if (index === photos.length - 1 && photos.length > 3) return `Slide ${index + 2} – Info`;
    return `Slide ${index + 2}`;
  };

  return (
    <div className="space-y-3">
      {/* Upload area */}
      <div
        className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors hover:border-blue-400 hover:bg-blue-50"
        style={{ borderColor: '#1B5EA6', backgroundColor: '#F0F6FF' }}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Upload className="w-6 h-6 mx-auto mb-2" style={{ color: '#1B5EA6' }} />
        <p className="text-sm font-semibold" style={{ color: '#1B5EA6' }}>
          Clique ou arraste fotos aqui
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {photos.length > 0
            ? `${photos.length} foto${photos.length > 1 ? 's' : ''} adicionada${photos.length > 1 ? 's' : ''} — arraste para reordenar`
            : 'A capa usa a 1ª foto; slides 2 e 3 usam a 2ª e 3ª foto'}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {/* Photo grid with drag-to-reorder */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => onDragStart(index)}
              onDragEnter={() => onDragEnter(index)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className="relative group rounded-xl overflow-hidden cursor-grab active:cursor-grabbing border-2 transition-all"
              style={{
                borderColor: index === 0 ? '#F47920' : '#e5e7eb',
                aspectRatio: '1',
              }}
            >
              <img src={photo} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <GripVertical className="w-6 h-6 text-white" />
              </div>

              {/* Slide label badge */}
              <div
                className="absolute bottom-0 left-0 right-0 text-center py-1 text-white text-xs font-medium"
                style={{
                  backgroundColor: index === 0 ? 'rgba(244,121,32,0.9)' : 'rgba(27,94,166,0.85)',
                  fontSize: 9,
                }}
              >
                {slideLabel(index)}
              </div>

              {/* Remove button */}
              <button
                onClick={(e) => { e.stopPropagation(); removePhoto(index); }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <p className="text-xs text-gray-400 text-center">
          💡 Arraste as fotos para mudar a ordem dos slides
        </p>
      )}
    </div>
  );
}
