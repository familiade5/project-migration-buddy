/**
 * AMPhotoManager
 * - Upload + drag-and-drop reordering of photos
 * - Buttons to move left/right and promote to cover
 * - The order here drives the slide order in AMPostPreview
 */
import { useRef } from 'react';
import { GripVertical, X, Upload, ChevronLeft, ChevronRight, Star } from 'lucide-react';

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
    onChange(photos.filter((_, i) => i !== index));
  };

  const movePhoto = (from: number, to: number) => {
    if (to < 0 || to >= photos.length) return;
    const next = [...photos];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  const makeCover = (index: number) => {
    if (index === 0) return;
    const next = [...photos];
    const [photo] = next.splice(index, 1);
    next.unshift(photo);
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
            ? `${photos.length} foto${photos.length > 1 ? 's' : ''} adicionada${photos.length > 1 ? 's' : ''}`
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

      {/* Photo grid with reorder controls */}
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

              {/* Overlay on hover with controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-between p-1">
                {/* Top row: move left/right + grip */}
                <div className="flex items-center justify-between w-full">
                  {/* Move left */}
                  <button
                    onClick={(e) => { e.stopPropagation(); movePhoto(index, index - 1); }}
                    disabled={index === 0}
                    className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center disabled:opacity-30 hover:bg-white transition-colors"
                    title="Mover para esquerda"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-gray-700" />
                  </button>

                  {/* Grip center */}
                  <GripVertical className="w-5 h-5 text-white/80" />

                  {/* Move right */}
                  <button
                    onClick={(e) => { e.stopPropagation(); movePhoto(index, index + 1); }}
                    disabled={index === photos.length - 1}
                    className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center disabled:opacity-30 hover:bg-white transition-colors"
                    title="Mover para direita"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-gray-700" />
                  </button>
                </div>

                {/* Middle: Make cover button */}
                {index !== 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); makeCover(index); }}
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-semibold transition-colors"
                    style={{ backgroundColor: '#F47920' }}
                    title="Usar como capa"
                  >
                    <Star className="w-3 h-3 fill-white" />
                    Capa
                  </button>
                )}

                {/* Bottom: remove */}
                <div className="flex justify-end w-full">
                  <button
                    onClick={(e) => { e.stopPropagation(); removePhoto(index); }}
                    className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors z-20"
                    title="Remover foto"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
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

              {/* Cover star badge */}
              {index === 0 && (
                <div className="absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F47920' }}>
                  <Star className="w-2.5 h-2.5 fill-white text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <p className="text-xs text-gray-400 text-center">
          💡 Passe o mouse sobre a foto para mover, definir capa ou remover
        </p>
      )}
    </div>
  );
}
