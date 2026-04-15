/**
 * AMPhotoManager
 * - Upload + drag-and-drop reordering of photos
 * - Buttons to move left/right and promote to cover
 * - Per-photo position adjustment (objectPosition)
 * - The order here drives the slide order in AMPostPreview
 */
import { useRef, useState } from 'react';
import { GripVertical, X, Upload, ChevronLeft, ChevronRight, Star, Move, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface AMPhotoManagerProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  photoPositions?: Record<number, { x: number; y: number }>;
  onPositionsChange?: (positions: Record<number, { x: number; y: number }>) => void;
  photoScales?: Record<number, number>;
  onScalesChange?: (scales: Record<number, number>) => void;
}

const STEP = 10; // % per click

export function AMPhotoManager({ photos, onChange, photoPositions = {}, onPositionsChange, photoScales = {}, onScalesChange }: AMPhotoManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);
  const [adjustingIndex, setAdjustingIndex] = useState<number | null>(null);

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
    // Reindex positions
    if (onPositionsChange) {
      const newPos: Record<number, { x: number; y: number }> = {};
      Object.entries(photoPositions).forEach(([k, v]) => {
        const ki = parseInt(k);
        if (ki < index) newPos[ki] = v;
        else if (ki > index) newPos[ki - 1] = v;
      });
      onPositionsChange(newPos);
    }
    if (adjustingIndex === index) setAdjustingIndex(null);
    else if (adjustingIndex !== null && adjustingIndex > index) setAdjustingIndex(adjustingIndex - 1);
  };

  const movePhoto = (from: number, to: number) => {
    if (to < 0 || to >= photos.length) return;
    const next = [...photos];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
    // Swap positions
    if (onPositionsChange) {
      const newPos = { ...photoPositions };
      const fromPos = newPos[from];
      const toPos = newPos[to];
      if (fromPos) newPos[to] = fromPos; else delete newPos[to];
      if (toPos) newPos[from] = toPos; else delete newPos[from];
      onPositionsChange(newPos);
    }
    if (adjustingIndex === from) setAdjustingIndex(to);
    else if (adjustingIndex === to) setAdjustingIndex(from);
  };

  const makeCover = (index: number) => {
    if (index === 0) return;
    const next = [...photos];
    const [photo] = next.splice(index, 1);
    next.unshift(photo);
    onChange(next);
    // Reindex positions
    if (onPositionsChange) {
      const newPos: Record<number, { x: number; y: number }> = {};
      Object.entries(photoPositions).forEach(([k, v]) => {
        const ki = parseInt(k);
        if (ki === index) newPos[0] = v;
        else if (ki < index) newPos[ki + 1] = v;
        else newPos[ki] = v;
      });
      onPositionsChange(newPos);
    }
    setAdjustingIndex(null);
  };

  // Drag-to-reorder
  const onDragStart = (index: number) => { dragItem.current = index; };
  const onDragEnter = (index: number) => { dragOver.current = index; };
  const onDragEnd = () => {
    if (dragItem.current === null || dragOver.current === null) return;
    if (dragItem.current === dragOver.current) return;
    const from = dragItem.current;
    const to = dragOver.current;
    const next = [...photos];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    dragItem.current = null;
    dragOver.current = null;
    onChange(next);
  };

  const adjustPosition = (index: number, dx: number, dy: number) => {
    if (!onPositionsChange) return;
    const current = photoPositions[index] || { x: 50, y: 50 };
    const newPos = {
      ...photoPositions,
      [index]: {
        x: Math.max(0, Math.min(100, current.x + dx)),
        y: Math.max(0, Math.min(100, current.y + dy)),
      },
    };
    onPositionsChange(newPos);
  };

  const resetPosition = (index: number) => {
    if (onPositionsChange) {
      const newPos = { ...photoPositions };
      delete newPos[index];
      onPositionsChange(newPos);
    }
    if (onScalesChange) {
      const newScales = { ...photoScales };
      delete newScales[index];
      onScalesChange(newScales);
    }
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
                borderColor: index === 0 ? '#F47920' : adjustingIndex === index ? '#1B5EA6' : '#e5e7eb',
                aspectRatio: '1',
              }}
            >
              <img
                src={photo}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover"
                style={{
                  objectPosition: photoPositions[index]
                    ? `${photoPositions[index].x}% ${photoPositions[index].y}%`
                    : '50% 50%',
                  transform: `scale(${photoScales[index] || 1})`,
                }}
              />

              {/* Remove button */}
              <button
                onClick={(e) => { e.stopPropagation(); removePhoto(index); }}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                style={{ zIndex: 30 }}
                title="Remover foto"
              >
                <X className="w-3 h-3 text-white" />
              </button>

              {/* Position adjust button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAdjustingIndex(adjustingIndex === index ? null : index);
                }}
                className="absolute top-1 left-7 w-6 h-6 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                style={{
                  zIndex: 30,
                  backgroundColor: adjustingIndex === index ? '#1B5EA6' : 'rgba(0,0,0,0.6)',
                }}
                title="Ajustar posição da foto"
              >
                <Move className="w-3 h-3 text-white" />
              </button>

              {/* Overlay on hover with controls */}
              {adjustingIndex !== index && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-between p-1" style={{ zIndex: 10 }}>
                  <div className="flex items-center justify-between w-full">
                    <button
                      onClick={(e) => { e.stopPropagation(); movePhoto(index, index - 1); }}
                      disabled={index === 0}
                      className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center disabled:opacity-30 hover:bg-white transition-colors"
                      title="Mover para esquerda"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 text-gray-700" />
                    </button>
                    <GripVertical className="w-5 h-5 text-white/80" />
                    <button
                      onClick={(e) => { e.stopPropagation(); movePhoto(index, index + 1); }}
                      disabled={index === photos.length - 1}
                      className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center disabled:opacity-30 hover:bg-white transition-colors"
                      title="Mover para direita"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-gray-700" />
                    </button>
                  </div>
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
                  <div />
                </div>
              )}

              {/* Position adjustment overlay */}
              {adjustingIndex === index && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1" style={{ zIndex: 20 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); adjustPosition(index, 0, -STEP); }}
                    className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center hover:bg-white"
                    title="Mover foto para cima"
                  >
                    <ArrowUp className="w-4 h-4 text-gray-800" />
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); adjustPosition(index, -STEP, 0); }}
                      className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center hover:bg-white"
                      title="Mover foto para esquerda"
                    >
                      <ArrowLeft className="w-4 h-4 text-gray-800" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); resetPosition(index); }}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/90"
                      style={{ backgroundColor: 'rgba(244,121,32,0.9)' }}
                      title="Resetar posição"
                    >
                      <span className="text-white text-xs font-bold">↺</span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); adjustPosition(index, STEP, 0); }}
                      className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center hover:bg-white"
                      title="Mover foto para direita"
                    >
                      <ArrowRight className="w-4 h-4 text-gray-800" />
                    </button>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); adjustPosition(index, 0, STEP); }}
                    className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center hover:bg-white"
                    title="Mover foto para baixo"
                  >
                    <ArrowDown className="w-4 h-4 text-gray-800" />
                  </button>
                  <p className="text-white text-[8px] mt-0.5 opacity-80">
                    {photoPositions[index] ? `${photoPositions[index].x}% × ${photoPositions[index].y}%` : '50% × 50%'}
                  </p>
                </div>
              )}

              {/* Slide label badge */}
              <div
                className="absolute bottom-0 left-0 right-0 text-center py-1 text-white text-xs font-medium"
                style={{
                  backgroundColor: index === 0 ? 'rgba(244,121,32,0.9)' : 'rgba(27,94,166,0.85)',
                  fontSize: 9,
                  zIndex: 5,
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
          💡 Passe o mouse sobre a foto para mover, definir capa ou ajustar posição
        </p>
      )}
    </div>
  );
}
