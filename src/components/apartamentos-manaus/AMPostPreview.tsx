import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { Download, ChevronLeft, ChevronRight, Loader2, Square, Smartphone } from 'lucide-react';
import { AMPropertyData } from '@/types/apartamentosManaus';
import {
  AMCoverSlide,
  AMSpecsSlide,
  AMLocationSlide,
  AMPhotoSlide,
  AMInfoSlide,
} from './slides/AMSlides';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AMPostPreviewProps {
  data: AMPropertyData;
  photos: string[];
}

type FormatType = 'feed' | 'story';

// Native slide dimensions
const SLIDE_W = 360;
const FEED_H  = 360;
const STORY_H = 640;

// Max slides we'll ever support (drives fixed ref pool)
const MAX_SLIDES = 20;

export function AMPostPreview({ data, photos }: AMPostPreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [format, setFormat] = useState<FormatType>('feed');
  const [isExporting, setIsExporting] = useState(false);

  // Fixed-size ref pool at top level (20 refs each, satisfies hooks rules)
  const f0=useRef<HTMLDivElement>(null),f1=useRef<HTMLDivElement>(null),f2=useRef<HTMLDivElement>(null),f3=useRef<HTMLDivElement>(null),f4=useRef<HTMLDivElement>(null);
  const f5=useRef<HTMLDivElement>(null),f6=useRef<HTMLDivElement>(null),f7=useRef<HTMLDivElement>(null),f8=useRef<HTMLDivElement>(null),f9=useRef<HTMLDivElement>(null);
  const f10=useRef<HTMLDivElement>(null),f11=useRef<HTMLDivElement>(null),f12=useRef<HTMLDivElement>(null),f13=useRef<HTMLDivElement>(null),f14=useRef<HTMLDivElement>(null);
  const f15=useRef<HTMLDivElement>(null),f16=useRef<HTMLDivElement>(null),f17=useRef<HTMLDivElement>(null),f18=useRef<HTMLDivElement>(null),f19=useRef<HTMLDivElement>(null);
  const s0=useRef<HTMLDivElement>(null),s1=useRef<HTMLDivElement>(null),s2=useRef<HTMLDivElement>(null),s3=useRef<HTMLDivElement>(null),s4=useRef<HTMLDivElement>(null);
  const s5=useRef<HTMLDivElement>(null),s6=useRef<HTMLDivElement>(null),s7=useRef<HTMLDivElement>(null),s8=useRef<HTMLDivElement>(null),s9=useRef<HTMLDivElement>(null);
  const s10=useRef<HTMLDivElement>(null),s11=useRef<HTMLDivElement>(null),s12=useRef<HTMLDivElement>(null),s13=useRef<HTMLDivElement>(null),s14=useRef<HTMLDivElement>(null);
  const s15=useRef<HTMLDivElement>(null),s16=useRef<HTMLDivElement>(null),s17=useRef<HTMLDivElement>(null),s18=useRef<HTMLDivElement>(null),s19=useRef<HTMLDivElement>(null);
  const feedRefs = [f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13,f14,f15,f16,f17,f18,f19];
  const storyRefs = [s0,s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13,s14,s15,s16,s17,s18,s19];

  // ── Build FEED slide list ─────────────────────────────────────────────────
  // Structure:
  //   Slide 1:    Cover  (photos[0])
  //   Slide 2:    Specs  (photos[1])
  //   Slide 3:    Location (photos[2])
  //   Slides 4+:  Photo slides (photos[3..last-1])
  //   Last slide: Info   (uses last photo as background)
  const buildFeedSlides = () => {
    const p = photos;
    const slides = [];

    // Slide 1 – Capa
    slides.push({
      id: 'cover',
      name: 'Capa',
      el: <AMCoverSlide data={data} photo={p[0]} />,
    });

    // Slide 2 – Specs
    slides.push({
      id: 'specs',
      name: 'Especif.',
      el: <AMSpecsSlide data={data} photo={p[1] ?? p[0]} photo2={p[2] ?? p[0]} />,
    });

    // Slide 3 – Location
    slides.push({
      id: 'location',
      name: 'Local',
      el: <AMLocationSlide data={data} photo={p[2] ?? p[1] ?? p[0]} />,
    });

    // Photo slides (4 to n-1) — from index 3 up
    const photoSliceEnd = Math.max(3, p.length - 1);
    for (let i = 3; i < photoSliceEnd; i++) {
      slides.push({
        id: `photo-${i}`,
        name: `Foto ${i - 1}`,
        el: <AMPhotoSlide data={data} photo={p[i]} photoIndex={i} />,
      });
    }

    // Last slide – Info
    const lastPhoto = p[p.length - 1] ?? p[0];
    slides.push({
      id: 'info',
      name: 'Info',
      el: <AMInfoSlide data={data} photo={lastPhoto} />,
    });

    return slides;
  };

  // ── Build STORY slide list ────────────────────────────────────────────────
  const buildStorySlides = () => {
    const p = photos;
    const slides = [];

    slides.push({
      id: 'story-cover',
      name: 'Capa',
      el: <AMCoverSlide data={data} photo={p[0]} />,
    });
    slides.push({
      id: 'story-specs',
      name: 'Especif.',
      el: <AMSpecsSlide data={data} photo={p[1] ?? p[0]} photo2={p[2] ?? p[0]} />,
    });
    slides.push({
      id: 'story-location',
      name: 'Local',
      el: <AMLocationSlide data={data} photo={p[2] ?? p[1] ?? p[0]} />,
    });

    const photoSliceEnd = Math.max(3, p.length - 1);
    for (let i = 3; i < photoSliceEnd; i++) {
      slides.push({
        id: `story-photo-${i}`,
        name: `Foto ${i - 1}`,
        el: <AMPhotoSlide data={data} photo={p[i]} photoIndex={i} />,
      });
    }

    const lastPhoto = p[p.length - 1] ?? p[0];
    slides.push({
      id: 'story-info',
      name: 'Info',
      el: <AMInfoSlide data={data} photo={lastPhoto} />,
    });

    return slides;
  };

  const feedSlides  = buildFeedSlides();
  const storySlides = buildStorySlides();

  const slides      = format === 'feed' ? feedSlides : storySlides;
  const totalSlides = slides.length;
  const safeIndex   = Math.min(currentSlide, totalSlides - 1);

  // ── Preview dimensions ────────────────────────────────────────────────────
  const nativeH      = format === 'feed' ? FEED_H : STORY_H;
  const previewW     = format === 'feed' ? 280 : 180;
  const previewH     = format === 'feed' ? 280 : 320;
  const previewScale = previewW / SLIDE_W;

  const thumbW     = format === 'feed' ? 72 : 48;
  const thumbH     = format === 'feed' ? 72 : 85;
  const thumbScale = thumbW / SLIDE_W;

  // ── Navigation ────────────────────────────────────────────────────────────
  const prev = () => setCurrentSlide((p) => (p === 0 ? totalSlides - 1 : p - 1));
  const next = () => setCurrentSlide((p) => (p === totalSlides - 1 ? 0 : p + 1));

  // ── Export helpers ────────────────────────────────────────────────────────
  const captureRef = async (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return null;
    return toPng(ref.current, { quality: 1, pixelRatio: 3, cacheBust: true });
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
    <div className="space-y-4 overflow-hidden">
      {/* ── Header + Format selector ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="font-semibold text-base text-gray-800">Preview do Carrossel</h3>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 self-start">
          <button
            onClick={() => { setFormat('feed'); setCurrentSlide(0); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${format === 'feed' ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
            style={format === 'feed' ? { backgroundColor: '#1B5EA6' } : {}}
          >
            <Square className="w-3.5 h-3.5" /><span>Feed</span>
          </button>
          <button
            onClick={() => { setFormat('story'); setCurrentSlide(0); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${format === 'story' ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
            style={format === 'story' ? { backgroundColor: '#1B5EA6' } : {}}
          >
            <Smartphone className="w-3.5 h-3.5" /><span>Story</span>
          </button>
        </div>
      </div>

      {/* ── Export buttons ── */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleExportAll} disabled={isExporting} className="gap-1.5 flex-1 text-xs">
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          Exportar {format === 'feed' ? 'Feed' : 'Story'} ({slides.length})
        </Button>
        <Button size="sm" onClick={handleExportBoth} disabled={isExporting} className="gap-1.5 flex-1 text-xs text-white" style={{ backgroundColor: '#F47920' }}>
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          Tudo ({feedSlides.length + storySlides.length})
        </Button>
      </div>

      {/* ── Slide name pills ── */}
      <div className="flex items-center gap-1 flex-wrap">
        {slides.map((slide, index) => (
          <button key={slide.id} onClick={() => setCurrentSlide(index)}
            className="px-2 py-1 rounded-full text-xs transition-all"
            style={safeIndex === index
              ? { backgroundColor: '#1B5EA6', color: '#fff' }
              : { backgroundColor: '#F3F4F6', color: '#6B7280' }}>
            {index + 1}. {slide.name}
          </button>
        ))}
      </div>

      {/* ── Main preview + arrows ── */}
      <div className="flex items-center justify-center gap-3">
        <button onClick={prev} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0">
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>

        <div className="relative rounded-xl overflow-hidden shadow-2xl flex-shrink-0"
          style={{ width: previewW, height: previewH }}>
          <div className="origin-top-left"
            style={{ width: SLIDE_W, height: nativeH, transform: `scale(${previewScale})` }}>
            {slides[safeIndex]?.el}
          </div>
        </div>

        <button onClick={next} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0">
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
      <div className="flex gap-1.5 flex-wrap justify-center">
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
        {totalSlides} slides • {photos.length} foto{photos.length !== 1 ? 's' : ''}
      </p>

      {/* ── Hidden full-res export DOM ── */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden="true">
        {feedSlides.map((slide, i) => (
          <div key={`fexp-${i}`} ref={feedRefs[i]}
            style={{ width: SLIDE_W, height: FEED_H, overflow: 'hidden' }}>
            {slide.el}
          </div>
        ))}
        {/* Pad remaining refs */}
        {Array.from({ length: MAX_SLIDES - feedSlides.length }).map((_, i) => (
          <div key={`fpad-${i}`} ref={feedRefs[feedSlides.length + i]} />
        ))}
        {storySlides.map((slide, i) => (
          <div key={`sexp-${i}`} ref={storyRefs[i]}
            style={{ width: SLIDE_W, height: STORY_H, overflow: 'hidden' }}>
            {slide.el}
          </div>
        ))}
        {Array.from({ length: MAX_SLIDES - storySlides.length }).map((_, i) => (
          <div key={`spad-${i}`} ref={storyRefs[storySlides.length + i]} />
        ))}
      </div>
    </div>
  );
}
