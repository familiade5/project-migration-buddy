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

// Native slide dimensions (design units) — slides are authored at 360px
const SLIDE_W = 360;
const FEED_H  = 360;
const STORY_H = 640;

export function AMPostPreview({ data, photos }: AMPostPreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [format, setFormat] = useState<FormatType>('feed');
  const [isExporting, setIsExporting] = useState(false);

  // Fixed refs – never inside .map()
  const feedRefs: React.RefObject<HTMLDivElement>[] = [
    useRef(null), useRef(null), useRef(null),
    useRef(null), useRef(null), useRef(null), useRef(null),
  ];
  const storyRefs: React.RefObject<HTMLDivElement>[] = [
    useRef(null), useRef(null), useRef(null), useRef(null), useRef(null),
  ];

  // ── Build slide lists ─────────────────────────────────────────────────────
  const photoSlidesFeed  = photos.slice(1, 4).map((p, i) => ({
    id: `photo-${i + 2}`, name: `Foto ${i + 2}`,
    el: <AMPhotoSlide data={data} photo={p} photoIndex={i + 2} />,
  }));
  const photoSlidesStory = photos.slice(1, 3).map((p, i) => ({
    id: `sphoto-${i + 2}`, name: `Foto ${i + 2}`,
    el: <AMPhotoSlide data={data} photo={p} photoIndex={i + 2} />,
  }));

  const feedSlides = [
    { id: 'cover',   name: 'Capa',        el: <AMCoverSlide   data={data} photo={photos[0]} /> },
    { id: 'details', name: 'Detalhes',    el: <AMDetailsSlide data={data} /> },
    ...photoSlidesFeed,
    { id: 'contact', name: 'Contato',     el: <AMContactSlide data={data} /> },
    { id: 'info',    name: 'Informativo', el: <AMInfoSlide    data={data} /> },
  ];

  const storySlides = [
    { id: 'story-cover',   name: 'Capa',     el: <AMCoverSlide   data={data} photo={photos[0]} /> },
    { id: 'story-details', name: 'Detalhes', el: <AMDetailsSlide data={data} /> },
    ...photoSlidesStory,
    { id: 'story-contact', name: 'Contato',  el: <AMContactSlide data={data} /> },
  ];

  const slides      = format === 'feed' ? feedSlides : storySlides;
  const totalSlides = slides.length;
  const safeIndex   = Math.min(currentSlide, totalSlides - 1);

  // ── Preview dimensions — identical logic to PostPreview ──────────────────
  const nativeH    = format === 'feed' ? FEED_H : STORY_H;
  // Feed: preview 280×280; Story: preview 180×320
  const previewW   = format === 'feed' ? 280 : 180;
  const previewH   = format === 'feed' ? 280 : 320;
  const previewScale = format === 'feed' ? (280 / SLIDE_W) : (180 / SLIDE_W);

  // Thumbnails
  const thumbW     = format === 'feed' ? 80 : 54;
  const thumbH     = format === 'feed' ? 80 : 96;
  const thumbScale = format === 'feed' ? (80 / SLIDE_W) : (54 / SLIDE_W);

  // ── Navigation ────────────────────────────────────────────────────────────
  const prev = () => setCurrentSlide((p) => (p === 0 ? totalSlides - 1 : p - 1));
  const next = () => setCurrentSlide((p) => (p === totalSlides - 1 ? 0 : p + 1));

  // ── Export helpers ────────────────────────────────────────────────────────
  const captureRef = async (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return null;
    return toPng(ref.current, { quality: 1, pixelRatio: 1, cacheBust: true });
  };

  const buildZip = async (
    refs: React.RefObject<HTMLDivElement>[],
    list: typeof feedSlides,
    folderName: string,
    zip: JSZip,
  ) => {
    const folder = zip.folder(folderName) as JSZip;
    for (let i = 0; i < list.length; i++) {
      const url = await captureRef(refs[i]);
      if (!url) continue;
      folder.file(
        `${String(i + 1).padStart(2, '0')}-${list[i].name.toLowerCase()}.png`,
        url.split(',')[1],
        { base64: true },
      );
    }
  };

  const downloadZip = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportSingle = async () => {
    setIsExporting(true);
    try {
      const refs = format === 'feed' ? feedRefs : storyRefs;
      const url = await captureRef(refs[safeIndex]);
      if (!url) return;
      const a = document.createElement('a');
      a.download = `am-${format}-${safeIndex + 1}-${slides[safeIndex].name.toLowerCase()}.png`;
      a.href = url; a.click();
      toast.success('Slide exportado!');
    } finally { setIsExporting(false); }
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      const refs = format === 'feed' ? feedRefs : storyRefs;
      const list = format === 'feed' ? feedSlides : storySlides;
      await buildZip(refs, list, `am-${format}`, zip);
      const blob = await zip.generateAsync({ type: 'blob' });
      downloadZip(blob, `am-${format}-${data.title || 'imovel'}.zip`);
      toast.success(`${list.length} slides exportados!`);
    } catch { toast.error('Erro ao exportar'); }
    finally { setIsExporting(false); }
  };

  const handleExportBoth = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      await buildZip(feedRefs,  feedSlides,  'feed',  zip);
      await buildZip(storyRefs, storySlides, 'story', zip);
      const blob = await zip.generateAsync({ type: 'blob' });
      downloadZip(blob, `am-feed-story-${data.title || 'imovel'}.zip`);
      toast.success('Feed + Story exportados!');
    } catch { toast.error('Erro ao exportar'); }
    finally { setIsExporting(false); }
  };

  return (
    <div className="space-y-4 sm:space-y-6 overflow-hidden">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="font-semibold text-base sm:text-lg text-gray-800">Preview do Carrossel</h3>

        {/* Format selector */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 self-start">
          <button
            onClick={() => { setFormat('feed'); setCurrentSlide(0); }}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm transition-all ${
              format === 'feed' ? 'text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
            style={format === 'feed' ? { backgroundColor: '#1B5EA6' } : {}}
          >
            <Square className="w-3 h-3 sm:w-4 sm:h-4" /><span>Feed</span>
          </button>
          <button
            onClick={() => { setFormat('story'); setCurrentSlide(0); }}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm transition-all ${
              format === 'story' ? 'text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
            style={format === 'story' ? { backgroundColor: '#1B5EA6' } : {}}
          >
            <Smartphone className="w-3 h-3 sm:w-4 sm:h-4" /><span>Story</span>
          </button>
        </div>
      </div>

      {/* ── Export buttons ── */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button variant="outline" size="sm" onClick={handleExportAll} disabled={isExporting}
          className="gap-2 flex-1 text-xs sm:text-sm">
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Exportar {format === 'feed' ? `Feed (${feedSlides.length})` : `Story (${storySlides.length})`}
        </Button>
        <Button size="sm" onClick={handleExportBoth} disabled={isExporting}
          className="gap-2 flex-1 text-xs sm:text-sm text-white"
          style={{ backgroundColor: '#F47920' }}>
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Exportar Tudo ({feedSlides.length + storySlides.length})
        </Button>
      </div>

      {/* ── Slide name navigation ── */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
        {slides.map((slide, index) => (
          <button key={slide.id} onClick={() => setCurrentSlide(index)}
            className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm transition-all"
            style={safeIndex === index
              ? { backgroundColor: '#1B5EA6', color: '#FFFFFF' }
              : { backgroundColor: '#F3F4F6', color: '#6B7280' }}>
            {slide.name}
          </button>
        ))}
      </div>

      {/* ── Main preview + arrows ── */}
      <div className="relative">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <button onClick={prev}
            className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0">
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>

          {/* Preview container — clips the scaled slide */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl flex-shrink-0"
            style={{ width: previewW, height: previewH }}>
            <div className="origin-top-left"
              style={{ width: SLIDE_W, height: nativeH, transform: `scale(${previewScale})` }}>
              {slides[safeIndex]?.el}
            </div>
          </div>

          <button onClick={next}
            className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0">
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>

        {/* Export single */}
        <div className="flex justify-center mt-4">
          <Button variant="outline" size="sm" onClick={handleExportSingle} disabled={isExporting}
            className="gap-2 text-xs sm:text-sm">
            <Download className="w-4 h-4" />
            Exportar este slide
          </Button>
        </div>
      </div>

      {/* ── Thumbnails ── */}
      <div className="hidden sm:flex gap-2 flex-wrap justify-center">
        {slides.map((slide, index) => (
          <button key={slide.id} onClick={() => setCurrentSlide(index)}
            className="relative rounded-lg overflow-hidden transition-all flex-shrink-0"
            style={{
              width: thumbW, height: thumbH,
              outline: safeIndex === index ? '2px solid #1B5EA6' : '2px solid transparent',
              outlineOffset: '2px',
              opacity: safeIndex === index ? 1 : 0.6,
            }}>
            <div className="origin-top-left pointer-events-none"
              style={{ width: SLIDE_W, height: nativeH, transform: `scale(${thumbScale})` }}>
              {slide.el}
            </div>
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400">
        📷 <strong>Feed:</strong> 1:1 &nbsp;•&nbsp; 📱 <strong>Story:</strong> 9:16
      </p>

      {/* ── Hidden full-resolution export elements ── */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden="true">
        {/* Feed – 1080×1080 */}
        {feedSlides.map((slide, i) => (
          <div key={`fexp-${i}`} ref={feedRefs[i]}
            style={{ width: SLIDE_W, height: FEED_H, overflow: 'hidden' }}>
            {slide.el}
          </div>
        ))}
        {Array.from({ length: 7 - feedSlides.length }).map((_, i) => (
          <div key={`fph-${i}`} ref={feedRefs[feedSlides.length + i]} />
        ))}
        {/* Story – 1080×1920 */}
        {storySlides.map((slide, i) => (
          <div key={`sexp-${i}`} ref={storyRefs[i]}
            style={{ width: SLIDE_W, height: STORY_H, overflow: 'hidden' }}>
            {slide.el}
          </div>
        ))}
        {Array.from({ length: 5 - storySlides.length }).map((_, i) => (
          <div key={`sph-${i}`} ref={storyRefs[storySlides.length + i]} />
        ))}
      </div>
    </div>
  );
}
