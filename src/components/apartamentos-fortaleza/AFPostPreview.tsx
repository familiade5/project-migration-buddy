import { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { safePixelRatio } from '@/lib/exportUtils';
import JSZip from 'jszip';
import { Download, ChevronLeft, ChevronRight, Loader2, FileText } from 'lucide-react';
import { AFPropertyData } from '@/types/apartamentosFortaleza';
import { AFCoverSlide, AFSpecsSlide, AFLocationSlide, AFPhotoSlide, AFInfoSlide } from './slides/AFSlides';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { generateAFPropertyPDF } from '@/lib/af/generatePropertyPDF';
import logoAF from '@/assets/logo-apartamentos-fortaleza.png';

const PRIMARY = '#0C7B8E';
const ACCENT  = '#E8562A';

interface AFPostPreviewProps {
  data: AFPropertyData;
  photos: string[];
}

type FormatType = 'feed' | 'story';
const SLIDE_W = 360;
const FEED_H  = 360;
const MAX_SLIDES = 20;

export function AFPostPreview({ data, photos }: AFPostPreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [format, setFormat] = useState<FormatType>('feed');
  const [isExporting, setIsExporting] = useState(false);
  const [containerW, setContainerW] = useState(320);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => { if (containerRef.current) setContainerW(containerRef.current.offsetWidth); };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const f0=useRef<HTMLDivElement>(null),f1=useRef<HTMLDivElement>(null),f2=useRef<HTMLDivElement>(null),f3=useRef<HTMLDivElement>(null),f4=useRef<HTMLDivElement>(null);
  const f5=useRef<HTMLDivElement>(null),f6=useRef<HTMLDivElement>(null),f7=useRef<HTMLDivElement>(null),f8=useRef<HTMLDivElement>(null),f9=useRef<HTMLDivElement>(null);
  const f10=useRef<HTMLDivElement>(null),f11=useRef<HTMLDivElement>(null),f12=useRef<HTMLDivElement>(null),f13=useRef<HTMLDivElement>(null),f14=useRef<HTMLDivElement>(null);
  const f15=useRef<HTMLDivElement>(null),f16=useRef<HTMLDivElement>(null),f17=useRef<HTMLDivElement>(null),f18=useRef<HTMLDivElement>(null),f19=useRef<HTMLDivElement>(null);
  const feedRefs = [f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13,f14,f15,f16,f17,f18,f19];

  const buildFeedSlides = () => {
    const p = photos;
    const slides = [];
    slides.push({ id: 'cover', name: 'Capa', el: <AFCoverSlide data={data} photo={p[0]} /> });
    slides.push({ id: 'specs', name: 'Especif.', el: <AFSpecsSlide data={data} photo={p[1] ?? p[0]} /> });
    slides.push({ id: 'location', name: 'Local', el: <AFLocationSlide data={data} photo={p[2] ?? p[1] ?? p[0]} /> });
    const photoSliceEnd = Math.max(3, p.length - 1);
    for (let i = 3; i < photoSliceEnd; i++) {
      slides.push({ id: `photo-${i}`, name: `Foto ${i - 1}`, el: <AFPhotoSlide data={data} photo={p[i]} photoIndex={i} /> });
    }
    const lastPhoto = p[p.length - 1] ?? p[0];
    slides.push({ id: 'info', name: 'Info', el: <AFInfoSlide data={data} photo={lastPhoto} /> });
    return slides;
  };

  const feedSlides = buildFeedSlides();
  const slides = feedSlides;
  const totalSlides = slides.length;
  const safeIndex = Math.min(currentSlide, totalSlides - 1);

  const availableW = Math.max(160, containerW - 80);
  const previewW = Math.min(availableW, availableW);
  const previewH = previewW;
  const previewScale = previewW / SLIDE_W;

  const thumbW = 60;
  const thumbH = 60;
  const thumbScale = thumbW / SLIDE_W;

  const prev = () => setCurrentSlide((p) => (p === 0 ? totalSlides - 1 : p - 1));
  const next = () => setCurrentSlide((p) => (p === totalSlides - 1 ? 0 : p + 1));

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
      const folder = zip.folder('af-feed') as JSZip;
      for (let i = 0; i < feedSlides.length; i++) {
        const url = await captureRef(feedRefs[i]);
        if (!url) continue;
        folder.file(`${String(i + 1).padStart(2, '0')}-${feedSlides[i].name.toLowerCase()}.png`, url.split(',')[1], { base64: true });
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = `af-feed-${data.title || 'imovel'}.zip`; a.click();
      URL.revokeObjectURL(a.href);
      toast.success(`${feedSlides.length} slides exportados!`);
    } catch { toast.error('Erro ao exportar'); }
    finally { setIsExporting(false); }
  };

  const handleExportSingle = async () => {
    setIsExporting(true);
    try {
      const url = await captureRef(feedRefs[safeIndex]);
      if (!url) return;
      const a = document.createElement('a');
      a.download = `af-feed-${safeIndex + 1}-${slides[safeIndex].name.toLowerCase()}.png`;
      a.href = url; a.click();
      toast.success('Slide exportado!');
    } finally { setIsExporting(false); }
  };

  return (
    <div ref={containerRef} className="space-y-3 w-full overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-sm text-gray-800">Preview do Carrossel</h3>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleExportAll} disabled={isExporting} className="gap-1.5 flex-1 text-xs min-w-0">
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" /> : <Download className="w-3.5 h-3.5 flex-shrink-0" />}
          <span className="truncate">Exportar Feed ({slides.length})</span>
        </Button>
      </div>

      <div className="flex items-center gap-1 flex-wrap">
        {slides.map((slide, index) => (
          <button key={slide.id} onClick={() => setCurrentSlide(index)}
            className="px-2 py-0.5 rounded-full text-xs transition-all"
            style={safeIndex === index ? { backgroundColor: PRIMARY, color: '#fff' } : { backgroundColor: '#F3F4F6', color: '#6B7280' }}>
            {index + 1}. {slide.name}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <button onClick={prev} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0">
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
        <div className="relative rounded-xl overflow-hidden shadow-2xl flex-shrink-0" style={{ width: Math.round(previewW), height: Math.round(previewH) }}>
          <div className="origin-top-left" style={{ width: SLIDE_W, height: FEED_H, transform: `scale(${previewScale})` }}>
            {slides[safeIndex]?.el}
          </div>
        </div>
        <button onClick={next} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0">
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="flex justify-center">
        <Button variant="outline" size="sm" onClick={handleExportSingle} disabled={isExporting} className="gap-1.5 text-xs">
          <Download className="w-3.5 h-3.5" />Exportar este slide
        </Button>
      </div>

      <div className="flex gap-1.5 flex-wrap justify-center">
        {slides.map((slide, index) => (
          <button key={slide.id} onClick={() => setCurrentSlide(index)}
            className="relative rounded-lg overflow-hidden transition-all flex-shrink-0"
            style={{ width: thumbW, height: thumbH, outline: safeIndex === index ? `2px solid ${PRIMARY}` : '2px solid transparent', outlineOffset: '2px', opacity: safeIndex === index ? 1 : 0.6 }}>
            <div className="origin-top-left pointer-events-none" style={{ width: SLIDE_W, height: FEED_H, transform: `scale(${thumbScale})` }}>
              {slide.el}
            </div>
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400">
        {totalSlides} slides • {photos.length} foto{photos.length !== 1 ? 's' : ''}
      </p>

      <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden="true">
        {feedSlides.map((slide, i) => (
          <div key={`fexp-${i}`} ref={feedRefs[i]} style={{ width: SLIDE_W, height: FEED_H, overflow: 'hidden' }}>
            {slide.el}
          </div>
        ))}
        {Array.from({ length: MAX_SLIDES - feedSlides.length }).map((_, i) => (
          <div key={`fpad-${i}`} ref={feedRefs[feedSlides.length + i]} />
        ))}
      </div>
    </div>
  );
}
