/**
 * AMStandardStoriesViewer — exibe os 5 slides do tema Padrão (T4)
 * diretamente no espaço ao lado do feed, sem alterar nada no AMStoriesPreview.
 */

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { Download, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { AMPropertyData } from '@/types/apartamentosManaus';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  AMStory4_T4_Slide1,
  AMStory4_T4_Slide2,
  AMStory4_T4_Slide3,
  AMStory4_T4_Slide4,
  AMStory4_T4_Slide5,
} from './stories/AMStoryTheme4';

const STORY_W = 360;
const STORY_H = 640;

const LABELS = ['Card 1', 'Card 2', 'Card 3', 'Card 4', 'Card 5'];

interface Props {
  data: AMPropertyData;
  photos: string[];
}

export function AMStandardStoriesViewer({ data, photos }: Props) {
  const [current, setCurrent] = useState(0);
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
    <AMStory4_T4_Slide1 data={data} photos={photos} />,
    <AMStory4_T4_Slide2 data={data} photo={p0} photos={photos} />,
    <AMStory4_T4_Slide3 data={data} photo={p0} photos={photos} />,
    <AMStory4_T4_Slide4 data={data} photos={photos} />,
    <AMStory4_T4_Slide5 data={data} photo={pLast} photos={photos} />,
  ];

  const previewW = 200;
  const previewH = 356;
  const previewScale = previewW / STORY_W;
  const thumbW = 56;
  const thumbH = 100;
  const thumbScale = thumbW / STORY_W;

  const capture = async (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return null;
    return toPng(ref.current, { quality: 1, pixelRatio: 3, cacheBust: true });
  };

  const exportCurrent = async () => {
    setIsExporting(true);
    try {
      const url = await capture(refs[current]);
      if (!url) return;
      const a = document.createElement('a');
      a.href = url;
      a.download = `story-${String(current + 1).padStart(2, '0')}-${LABELS[current].toLowerCase().replace(' ', '-')}.png`;
      a.click();
      toast.success('Slide exportado!');
    } catch {
      toast.error('Erro ao exportar');
    } finally {
      setIsExporting(false);
    }
  };

  const exportAll = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('stories-padrao') as JSZip;
      for (let i = 0; i < refs.length; i++) {
        const url = await capture(refs[i]);
        if (!url) continue;
        folder.file(
          `${String(i + 1).padStart(2, '0')}-${LABELS[i].toLowerCase().replace(' ', '-')}.png`,
          url.split(',')[1],
          { base64: true },
        );
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `stories-padrao-${data.title || 'imovel'}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
      toast.success('5 stories exportados!');
    } catch {
      toast.error('Erro ao exportar');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Step pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
        {LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="flex-shrink-0 py-1.5 px-3 rounded-lg text-xs font-medium transition-all"
            style={{
              backgroundColor: current === i ? '#1B5EA6' : '#F3F4F6',
              color: current === i ? 'white' : '#6B7280',
            }}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {/* Main preview */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setCurrent((s) => (s === 0 ? slides.length - 1 : s - 1))}
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
            {slides[current]}
          </div>
        </div>

        <button
          onClick={() => setCurrent((s) => (s === slides.length - 1 ? 0 : s + 1))}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
        >
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-1.5 justify-center overflow-x-auto pb-0.5">
        {LABELS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="relative rounded-lg overflow-hidden flex-shrink-0 transition-all"
            style={{
              width: thumbW, height: thumbH,
              outline: current === i ? '2px solid #1B5EA6' : '2px solid transparent',
              outlineOffset: '2px',
              opacity: current === i ? 1 : 0.55,
            }}
          >
            <div
              className="origin-top-left pointer-events-none"
              style={{ width: STORY_W, height: STORY_H, transform: `scale(${thumbScale})` }}
            >
              {slides[i]}
            </div>
          </button>
        ))}
      </div>

      {/* Export buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={isExporting}
          onClick={exportCurrent}
          className="flex-1 gap-1.5 text-xs"
        >
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          Este slide
        </Button>
        <Button
          size="sm"
          disabled={isExporting}
          onClick={exportAll}
          className="flex-1 gap-1.5 text-xs text-white"
          style={{ backgroundColor: '#F47920' }}
        >
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          Todos (ZIP)
        </Button>
      </div>

      {/* Hidden full-res DOM for export */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden="true">
        <div ref={r0} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AMStory4_T4_Slide1 data={data} photos={photos} />
        </div>
        <div ref={r1} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AMStory4_T4_Slide2 data={data} photo={p0} photos={photos} />
        </div>
        <div ref={r2} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AMStory4_T4_Slide3 data={data} photo={p0} photos={photos} />
        </div>
        <div ref={r3} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AMStory4_T4_Slide4 data={data} photos={photos} />
        </div>
        <div ref={r4} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AMStory4_T4_Slide5 data={data} photo={pLast} photos={photos} />
        </div>
      </div>
    </div>
  );
}
