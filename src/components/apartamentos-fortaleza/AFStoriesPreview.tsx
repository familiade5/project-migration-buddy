/**
 * AFStoriesPreview — 5 slides fixos no estilo Padrão (T4), igual ao preview carrossel do AM.
 */

import { useState, useRef } from 'react';
import { safePixelRatio } from '@/lib/exportUtils';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { Download, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { AFPropertyData } from '@/types/apartamentosFortaleza';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import {
  AFStory4_T4_Slide1,
  AFStory4_T4_Slide2,
  AFStory4_T4_Slide3,
  AFStory4_T4_Slide4,
  AFStory4_T4_Slide5,
} from './stories/AFStoryTheme4';

const STORY_W = 360;
const STORY_H = 640;

interface AFStoriesPreviewProps {
  data: AFPropertyData;
  photos: string[];
}

const SLIDE_LABELS = ['Card 1', 'Card 2', 'Card 3', 'Card 4', 'Card 5'];

export function AFStoriesPreview({ data, photos }: AFStoriesPreviewProps) {
  const [currentStory, setCurrentStory] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const r0 = useRef<HTMLDivElement>(null);
  const r1 = useRef<HTMLDivElement>(null);
  const r2 = useRef<HTMLDivElement>(null);
  const r3 = useRef<HTMLDivElement>(null);
  const r4 = useRef<HTMLDivElement>(null);
  const refs = [r0, r1, r2, r3, r4];

  const p0 = photos[0];
  const pLast = photos[photos.length - 1] ?? photos[0];

  const slides = [
    <AFStory4_T4_Slide1 data={data} photos={photos} />,
    <AFStory4_T4_Slide2 data={data} photo={p0} photos={photos} />,
    <AFStory4_T4_Slide3 data={data} photo={p0} photos={photos} />,
    <AFStory4_T4_Slide4 data={data} photos={photos} />,
    <AFStory4_T4_Slide5 data={data} photo={pLast} photos={photos} />,
  ];

  const slideCount = slides.length;
  const safeStory = Math.min(currentStory, slideCount - 1);

  const previewW = 200;
  const previewH = 356;
  const previewScale = previewW / STORY_W;
  const thumbW = 56;
  const thumbH = 100;
  const thumbScale = thumbW / STORY_W;

  const captureRef = async (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return null;
    const opts = { quality: 1, pixelRatio: safePixelRatio(), cacheBust: true };
    await toPng(ref.current, opts);
    await new Promise(r => setTimeout(r, 120));
    return toPng(ref.current, opts);
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('af-stories') as JSZip;
      for (let i = 0; i < refs.length; i++) {
        const url = await captureRef(refs[i]);
        if (!url) continue;
        folder.file(
          `${String(i + 1).padStart(2, '0')}-${SLIDE_LABELS[i].toLowerCase().replace(' ', '-')}.png`,
          url.split(',')[1],
          { base64: true },
        );
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `af-stories-${data.title || 'imovel'}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
      toast.success(`${refs.length} stories exportados!`);
    } catch {
      toast.error('Erro ao exportar stories');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportSingle = async () => {
    setIsExporting(true);
    try {
      const url = await captureRef(refs[safeStory]);
      if (!url) return;
      const a = document.createElement('a');
      a.href = url;
      a.download = `af-story-${String(safeStory + 1).padStart(2, '0')}-${SLIDE_LABELS[safeStory].toLowerCase().replace(' ', '-')}.png`;
      a.click();
      toast.success('Slide exportado!');
    } catch {
      toast.error('Erro ao exportar');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Slide pills */}
      <div className="flex items-center gap-1 flex-wrap">
        {SLIDE_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => setCurrentStory(i)}
            className="px-2 py-0.5 rounded-full text-xs transition-all"
            style={safeStory === i
              ? { backgroundColor: '#0C7B8E', color: '#fff' }
              : { backgroundColor: '#F3F4F6', color: '#6B7280' }}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {/* Main preview */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setCurrentStory(s => (s === 0 ? slideCount - 1 : s - 1))}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>

        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl flex-shrink-0"
          style={{ width: previewW, height: previewH }}
        >
          <div
            className="origin-top-left"
            style={{ width: STORY_W, height: STORY_H, transform: `scale(${previewScale})` }}
          >
            {slides[safeStory]}
          </div>
        </div>

        <button
          onClick={() => setCurrentStory(s => (s === slideCount - 1 ? 0 : s + 1))}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
        >
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-1.5 justify-center">
        {slides.map((slide, i) => (
          <button
            key={i}
            onClick={() => setCurrentStory(i)}
            className="relative rounded-lg overflow-hidden flex-shrink-0 transition-all"
            style={{
              width: thumbW, height: thumbH,
              outline: safeStory === i ? '2px solid #0C7B8E' : '2px solid transparent',
              outlineOffset: '2px',
              opacity: safeStory === i ? 1 : 0.55,
            }}
          >
            <div className="origin-top-left pointer-events-none"
              style={{ width: STORY_W, height: STORY_H, transform: `scale(${thumbScale})` }}>
              {slide}
            </div>
          </button>
        ))}
      </div>

      {/* Export buttons */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={isExporting} onClick={handleExportSingle} className="flex-1 gap-1.5 text-xs">
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          Este slide
        </Button>
        <Button size="sm" onClick={handleExportAll} disabled={isExporting} className="flex-1 gap-1.5 text-xs text-white" style={{ backgroundColor: '#E8562A' }}>
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          Todos ({slideCount})
        </Button>
      </div>

      {/* Hidden full-res DOM */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden="true">
        <div ref={r0} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AFStory4_T4_Slide1 data={data} photos={photos} />
        </div>
        <div ref={r1} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AFStory4_T4_Slide2 data={data} photo={p0} photos={photos} />
        </div>
        <div ref={r2} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AFStory4_T4_Slide3 data={data} photo={p0} photos={photos} />
        </div>
        <div ref={r3} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AFStory4_T4_Slide4 data={data} photos={photos} />
        </div>
        <div ref={r4} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AFStory4_T4_Slide5 data={data} photo={pLast} photos={photos} />
        </div>
      </div>
    </div>
  );
}
