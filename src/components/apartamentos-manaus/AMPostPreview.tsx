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

// Max slides per format (feed: cover + details + 3 photos + contact + info = 7, story: cover + details + 2 photos + contact = 5)
const MAX_FEED  = 7;
const MAX_STORY = 5;

export function AMPostPreview({ data, photos }: AMPostPreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [format, setFormat] = useState<FormatType>('feed');
  const [isExporting, setIsExporting] = useState(false);

  // Fixed refs — never inside .map()
  const feedRefs  = [
    useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const storyRefs = [
    useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  // ── Build slide list ──────────────────────────────────────────────────────
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
    { id: 'story-cover',   name: 'Capa',     el: <AMCoverSlide   data={data} photo={photos[0]} /> },
    { id: 'story-details', name: 'Detalhes', el: <AMDetailsSlide data={data} /> },
    ...photos.slice(1, 3).map((photo, i) => ({
      id: `story-photo-${i + 2}`,
      name: `Foto ${i + 2}`,
      el: <AMPhotoSlide data={data} photo={photo} photoIndex={i + 2} />,
    })),
    { id: 'story-contact', name: 'Contato',  el: <AMContactSlide data={data} /> },
  ];

  const slides      = format === 'feed' ? feedSlides : storySlides;
  const totalSlides = slides.length;
  const safeIndex   = Math.min(currentSlide, totalSlides - 1);

  // ── Dimensions ────────────────────────────────────────────────────────────
  const isFeed   = format === 'feed';
  const previewW = isFeed ? 280 : 175;
  const previewH = isFeed ? 280 : 311;
  const exportW  = 1080;
  const exportH  = isFeed ? 1080 : 1920;
  const previewScale = previewW / exportW;
  const thumbW   = isFeed ? 72 : 46;
  const thumbH   = isFeed ? 72 : 82;
  const thumbScale = thumbW / exportW;

  const prev = () => setCurrentSlide((p) => (p === 0 ? totalSlides - 1 : p - 1));
  const next = () => setCurrentSlide((p) => (p === totalSlides - 1 ? 0 : p + 1));

  // ── Export single ─────────────────────────────────────────────────────────
  const handleExportSingle = async () => {
    const refs = format === 'feed' ? feedRefs : storyRefs;
    const ref  = refs[safeIndex];
    if (!ref?.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(ref.current, { quality: 1, pixelRatio: 2, cacheBust: true });
      const a = document.createElement('a');
      a.download = `am-${format}-${safeIndex + 1}-${slides[safeIndex].name.toLowerCase()}.png`;
      a.href = dataUrl;
      a.click();
      toast.success('Slide exportado!');
    } catch {
      toast.error('Erro ao exportar slide');
    } finally {
      setIsExporting(false);
    }
  };

  // ── Export group as ZIP ───────────────────────────────────────────────────
  const exportGroup = async (refs: React.RefObject<HTMLDivElement>[], list: typeof feedSlides, zip: JSZip, folderName: string) => {
    const folder = zip.folder(folderName) as JSZip;
    for (let i = 0; i < list.length; i++) {
      const ref = refs[i];
      if (!ref?.current) continue;
      const dataUrl = await toPng(ref.current, { quality: 1, pixelRatio: 2, cacheBust: true });
      folder.file(`${String(i + 1).padStart(2, '0')}-${list[i].name.toLowerCase()}.png`, dataUrl.split(',')[1], { base64: true });
    }
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const zip  = new JSZip();
      const refs = format === 'feed' ? feedRefs : storyRefs;
      const list = format === 'feed' ? feedSlides : storySlides;
      await exportGroup(refs, list, zip, `am-${format}`);
      const blob = await zip.generateAsync({ type: 'blob' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `am-${format}-${data.title || 'imovel'}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${list.length} slides exportados!`);
    } catch {
      toast.error('Erro ao exportar');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportBoth = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      await exportGroup(feedRefs,  feedSlides,  zip, 'feed');
      await exportGroup(storyRefs, storySlides, zip, 'story');
      const blob = await zip.generateAsync({ type: 'blob' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
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

  return (
    <div className="space-y-4">
      {/* ── Format selector ── */}
      <div className="flex items-center gap-1 rounded-lg p-1 self-start" style={{ backgroundColor: '#F3F4F6' }}>
        {(['feed', 'story'] as FormatType[]).map((f) => (
          <button
            key={f}
            onClick={() => { setFormat(f); setCurrentSlide(0); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all"
            style={format === f
              ? { backgroundColor: '#1B5EA6', color: '#FFFFFF' }
              : { color: '#6B7280' }}
          >
            {f === 'feed' ? <Square className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            {f === 'feed' ? 'Feed' : 'Story'}
          </button>
        ))}
      </div>

      {/* ── Export buttons ── */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleExportAll} disabled={isExporting} className="flex-1 gap-1.5 text-xs">
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          {isFeed ? `Feed (${feedSlides.length})` : `Story (${storySlides.length})`}
        </Button>
        <Button size="sm" onClick={handleExportBoth} disabled={isExporting} className="flex-1 gap-1.5 text-xs text-white"
          style={{ backgroundColor: '#F47920' }}>
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          Tudo ({feedSlides.length + storySlides.length})
        </Button>
      </div>

      {/* ── Slide name tabs ── */}
      <div className="flex items-center gap-1 flex-wrap">
        {slides.map((slide, index) => (
          <button key={slide.id} onClick={() => setCurrentSlide(index)}
            className="px-2 py-1 rounded-full text-xs font-medium transition-all"
            style={safeIndex === index
              ? { backgroundColor: '#1B5EA6', color: '#FFFFFF' }
              : { backgroundColor: '#F3F4F6', color: '#6B7280' }}>
            {slide.name}
          </button>
        ))}
      </div>

      {/* ── Main preview with arrows ── */}
      <div className="flex items-center justify-center gap-3">
        <button onClick={prev} className="p-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#F3F4F6' }}>
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>

        <div className="relative rounded-xl overflow-hidden shadow-lg flex-shrink-0"
          style={{ width: previewW, height: previewH }}>
          <div className="origin-top-left"
            style={{ width: exportW, height: exportH, transform: `scale(${previewScale})` }}>
            {slides[safeIndex]?.el}
          </div>
        </div>

        <button onClick={next} className="p-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#F3F4F6' }}>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Export single */}
      <div className="flex justify-center">
        <Button variant="outline" size="sm" onClick={handleExportSingle} disabled={isExporting} className="gap-1.5 text-xs">
          <Download className="w-3.5 h-3.5" />
          Exportar este slide
        </Button>
      </div>

      {/* ── Thumbnails ── */}
      <div className="flex gap-2 flex-wrap justify-center">
        {slides.map((slide, index) => (
          <button key={slide.id} onClick={() => setCurrentSlide(index)}
            className="relative rounded-lg overflow-hidden transition-all flex-shrink-0"
            style={{
              width: thumbW, height: thumbH,
              outline: safeIndex === index ? '2px solid #1B5EA6' : '2px solid transparent',
              outlineOffset: '2px',
              opacity: safeIndex === index ? 1 : 0.5,
            }}>
            <div className="origin-top-left pointer-events-none"
              style={{ width: exportW, height: exportH, transform: `scale(${thumbScale})` }}>
              {slide.el}
            </div>
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400">📷 Feed 1:1 &nbsp;•&nbsp; 📱 Story 9:16</p>

      {/* ── Hidden export elements (off-screen) ── */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden>
        {/* Feed export elements */}
        {feedSlides.map((slide, i) => (
          <div key={`feed-exp-${i}`} ref={feedRefs[i]}
            style={{ width: 1080, height: 1080, overflow: 'hidden', position: 'relative' }}>
            <div style={{ transform: `scale(${1080 / 360})`, transformOrigin: 'top left', width: 360, height: 360 }}>
              {slide.el}
            </div>
          </div>
        ))}
        {/* Empty placeholders for unused feed refs */}
        {Array.from({ length: MAX_FEED - feedSlides.length }).map((_, i) => (
          <div key={`feed-ph-${i}`} ref={feedRefs[feedSlides.length + i]} />
        ))}
        {/* Story export elements */}
        {storySlides.map((slide, i) => (
          <div key={`story-exp-${i}`} ref={storyRefs[i]}
            style={{ width: 1080, height: 1920, overflow: 'hidden', position: 'relative' }}>
            <div style={{ transform: `scale(${1080 / 360})`, transformOrigin: 'top left', width: 360, height: 640 }}>
              {slide.el}
            </div>
          </div>
        ))}
        {/* Empty placeholders for unused story refs */}
        {Array.from({ length: MAX_STORY - storySlides.length }).map((_, i) => (
          <div key={`story-ph-${i}`} ref={storyRefs[storySlides.length + i]} />
        ))}
      </div>
    </div>
  );
}
