import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { Download, ChevronLeft, ChevronRight, Loader2, Square, Smartphone } from 'lucide-react';
import { AMPropertyData } from '@/types/apartamentosManaus';
import {
  AMCoverSlide,
  AMDetailsSlide,
  AMPhotoSlide,
  AMContactSlide,
  AMInfoSlide,
} from './slides/AMSlides';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AMPostPreviewProps {
  data: AMPropertyData;
  photos: string[];
}

type FormatType = 'feed' | 'story';

export function AMPostPreview({ data, photos }: AMPostPreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [format, setFormat] = useState<FormatType>('feed');
  const [isExporting, setIsExporting] = useState(false);

  // ── Build slide list dynamically ──────────────────────────────────────────
  const feedSlides = [
    { id: 'cover',   name: 'Capa',        el: <AMCoverSlide   data={data} photo={photos[0]} /> },
    { id: 'details', name: 'Detalhes',    el: <AMDetailsSlide data={data} /> },
    ...photos.slice(1, 4).map((photo, i) => ({
      id: `photo-${i + 2}`,
      name: `Foto ${i + 2}`,
      el: <AMPhotoSlide data={data} photo={photo} photoIndex={i + 2} />,
    })),
    { id: 'contact', name: 'Contato',     el: <AMContactSlide data={data} /> },
    { id: 'info',    name: 'Informativo', el: <AMInfoSlide    data={data} /> },
  ];

  const storySlides = [
    { id: 'story-cover',   name: 'Capa',      el: <AMCoverSlide   data={data} photo={photos[0]} /> },
    { id: 'story-details', name: 'Detalhes',  el: <AMDetailsSlide data={data} /> },
    ...photos.slice(1, 3).map((photo, i) => ({
      id: `story-photo-${i + 2}`,
      name: `Foto ${i + 2}`,
      el: <AMPhotoSlide data={data} photo={photo} photoIndex={i + 2} />,
    })),
    { id: 'story-contact', name: 'Contato',   el: <AMContactSlide data={data} /> },
  ];

  const slides     = format === 'feed' ? feedSlides : storySlides;
  const totalSlides = slides.length;
  const safeIndex  = Math.min(currentSlide, totalSlides - 1);

  // ── Refs for hidden export elements ──────────────────────────────────────
  const feedRefs  = feedSlides.map(() => useRef<HTMLDivElement>(null));
  const storyRefs = storySlides.map(() => useRef<HTMLDivElement>(null));
  const currentRefs = format === 'feed' ? feedRefs : storyRefs;

  // ── Dimensions ────────────────────────────────────────────────────────────
  const isFeed   = format === 'feed';
  // Preview container size
  const previewW = isFeed ? 280 : 175;
  const previewH = isFeed ? 280 : 311;
  // Full export size
  const exportW  = isFeed ? 1080 : 1080;
  const exportH  = isFeed ? 1080 : 1920;
  // Scale factor for preview
  const scale    = isFeed ? previewW / exportW : previewW / exportW;
  // Thumbnail size
  const thumbW   = isFeed ? 72 : 46;
  const thumbH   = isFeed ? 72 : 82;
  const thumbScale = isFeed ? thumbW / exportW : thumbW / exportW;

  // ── Helpers ───────────────────────────────────────────────────────────────
  const prev = () => setCurrentSlide((p) => (p === 0 ? totalSlides - 1 : p - 1));
  const next = () => setCurrentSlide((p) => (p === totalSlides - 1 ? 0 : p + 1));

  // ── Export single ─────────────────────────────────────────────────────────
  const handleExportSingle = async () => {
    const ref = currentRefs[safeIndex];
    if (!ref?.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(ref.current, { quality: 1, pixelRatio: 2, cacheBust: true });
      const link = document.createElement('a');
      link.download = `am-${format}-${safeIndex + 1}-${slides[safeIndex].name.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Slide exportado!');
    } catch {
      toast.error('Erro ao exportar slide');
    } finally {
      setIsExporting(false);
    }
  };

  // ── Export all as ZIP ─────────────────────────────────────────────────────
  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder(`apartamentos-manaus-${format}`) as JSZip;
      const refs = format === 'feed' ? feedRefs : storyRefs;
      const list = format === 'feed' ? feedSlides : storySlides;

      for (let i = 0; i < refs.length; i++) {
        const ref = refs[i];
        if (!ref?.current) continue;
        const dataUrl = await toPng(ref.current, { quality: 1, pixelRatio: 2, cacheBust: true });
        const base64 = dataUrl.split(',')[1];
        folder.file(`${String(i + 1).padStart(2, '0')}-${list[i].name.toLowerCase()}.png`, base64, { base64: true });
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `am-${format}-${data.title || 'imovel'}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${list.length} slides exportados!`);
    } catch {
      toast.error('Erro ao exportar slides');
    } finally {
      setIsExporting(false);
    }
  };

  // ── Export both formats ───────────────────────────────────────────────────
  const handleExportBoth = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();

      const exportGroup = async (refs: React.RefObject<HTMLDivElement>[], list: typeof feedSlides, label: string) => {
        const folder = zip.folder(label) as JSZip;
        for (let i = 0; i < refs.length; i++) {
          const ref = refs[i];
          if (!ref?.current) continue;
          const dataUrl = await toPng(ref.current, { quality: 1, pixelRatio: 2, cacheBust: true });
          const base64 = dataUrl.split(',')[1];
          folder.file(`${String(i + 1).padStart(2, '0')}-${list[i].name.toLowerCase()}.png`, base64, { base64: true });
        }
      };

      await exportGroup(feedRefs, feedSlides, 'feed');
      await exportGroup(storyRefs, storySlides, 'story');

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `am-feed-story-${data.title || 'imovel'}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Feed + Story exportados!`);
    } catch {
      toast.error('Erro ao exportar');
    } finally {
      setIsExporting(false);
    }
  };

  const CurrentEl = slides[safeIndex]?.el;

  return (
    <div className="space-y-4">
      {/* ── Format selector ── */}
      <div className="flex items-center gap-1 rounded-lg p-1 self-start" style={{ backgroundColor: '#F3F4F6' }}>
        <button
          onClick={() => { setFormat('feed'); setCurrentSlide(0); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all"
          style={format === 'feed'
            ? { backgroundColor: '#1B5EA6', color: '#FFFFFF' }
            : { color: '#6B7280' }}
        >
          <Square className="w-3.5 h-3.5" />
          Feed
        </button>
        <button
          onClick={() => { setFormat('story'); setCurrentSlide(0); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all"
          style={format === 'story'
            ? { backgroundColor: '#1B5EA6', color: '#FFFFFF' }
            : { color: '#6B7280' }}
        >
          <Smartphone className="w-3.5 h-3.5" />
          Story
        </button>
      </div>

      {/* ── Export buttons ── */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportAll}
          disabled={isExporting}
          className="flex-1 gap-1.5 text-xs"
        >
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          {format === 'feed' ? `Feed (${feedSlides.length})` : `Story (${storySlides.length})`}
        </Button>
        <Button
          size="sm"
          onClick={handleExportBoth}
          disabled={isExporting}
          className="flex-1 gap-1.5 text-xs text-white"
          style={{ backgroundColor: '#F47920' }}
        >
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          Tudo ({feedSlides.length + storySlides.length})
        </Button>
      </div>

      {/* ── Slide name tabs ── */}
      <div className="flex items-center gap-1 flex-wrap">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(index)}
            className="px-2 py-1 rounded-full text-xs font-medium transition-all"
            style={
              safeIndex === index
                ? { backgroundColor: '#1B5EA6', color: '#FFFFFF' }
                : { backgroundColor: '#F3F4F6', color: '#6B7280' }
            }
          >
            {slide.name}
          </button>
        ))}
      </div>

      {/* ── Main preview with arrows ── */}
      <div className="relative">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={prev}
            className="p-1.5 rounded-full transition-colors flex-shrink-0"
            style={{ backgroundColor: '#F3F4F6' }}
          >
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>

          <div
            className="relative rounded-xl overflow-hidden shadow-lg flex-shrink-0"
            style={{ width: previewW, height: previewH }}
          >
            <div
              className="origin-top-left"
              style={{ width: exportW, height: exportH, transform: `scale(${scale})` }}
            >
              {CurrentEl}
            </div>
          </div>

          <button
            onClick={next}
            className="p-1.5 rounded-full transition-colors flex-shrink-0"
            style={{ backgroundColor: '#F3F4F6' }}
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Export this slide */}
        <div className="flex justify-center mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportSingle}
            disabled={isExporting}
            className="gap-1.5 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar este slide
          </Button>
        </div>
      </div>

      {/* ── Thumbnails ── */}
      <div className="flex gap-2 flex-wrap justify-center">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(index)}
            className="relative rounded-lg overflow-hidden transition-all flex-shrink-0"
            style={{
              width: thumbW,
              height: thumbH,
              outline: safeIndex === index ? '2px solid #1B5EA6' : '2px solid transparent',
              outlineOffset: '2px',
              opacity: safeIndex === index ? 1 : 0.55,
            }}
          >
            <div
              className="origin-top-left"
              style={{ width: exportW, height: exportH, transform: `scale(${thumbScale})` }}
            >
              {slide.el}
            </div>
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400">
        📷 Feed 1:1 &nbsp;•&nbsp; 📱 Story 9:16
      </p>

      {/* ── Hidden export elements ── */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none">
        {feedSlides.map((slide, i) => (
          <div key={`feed-export-${slide.id}`} ref={feedRefs[i]}
            style={{ width: 1080, height: 1080 }}>
            <div style={{ transform: `scale(${1080 / 360})`, transformOrigin: 'top left', width: 360, height: 360 }}>
              {slide.el}
            </div>
          </div>
        ))}
        {storySlides.map((slide, i) => (
          <div key={`story-export-${slide.id}`} ref={storyRefs[i]}
            style={{ width: 1080, height: 1920 }}>
            <div style={{ transform: `scale(${1080 / 360})`, transformOrigin: 'top left', width: 360, height: 640 }}>
              {slide.el}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
