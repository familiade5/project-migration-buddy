import { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { safePixelRatio } from '@/lib/exportUtils';
import JSZip from 'jszip';
import { Download, ChevronLeft, ChevronRight, Loader2, Zap } from 'lucide-react';
import { AFPropertyData } from '@/types/apartamentosFortaleza';
import {
  AFPaidHeroSlide,
  AFPaidFeaturesSlide,
  AFPaidGallerySlide,
  AFPaidPriceSlide,
  AFPaidCTASlide,
  AFPaidPhotoSlide,
} from './slides/AFPaidSlides';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PRIMARY = '#0C7B8E';
const ACCENT = '#E8562A';
const SLIDE_W = 360;
const FEED_H = 360;
const MAX_REFS = 20;

interface Props {
  data: AFPropertyData;
  photos: string[];
}

export function AFPaidFeedPreview({ data, photos }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
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

  // Create refs
  const refs = useRef<(HTMLDivElement | null)[]>(Array(MAX_REFS).fill(null));

  const buildSlides = () => {
    const p = photos;
    const slides: { id: string; name: string; el: React.ReactNode }[] = [];

    slides.push({ id: 'hero', name: 'Hero', el: <AFPaidHeroSlide data={data} photo={p[0]} /> });
    slides.push({ id: 'features', name: 'Detalhes', el: <AFPaidFeaturesSlide data={data} photo={p[1] ?? p[0]} /> });

    if (p.length >= 4) {
      slides.push({ id: 'gallery', name: 'Galeria', el: <AFPaidGallerySlide data={data} photos={p.slice(0, 4)} /> });
    }

    // Extra photo slides
    for (let i = 2; i < Math.min(p.length - 1, 10); i++) {
      slides.push({ id: `photo-${i}`, name: `Foto ${i}`, el: <AFPaidPhotoSlide data={data} photo={p[i]} index={i} /> });
    }

    slides.push({ id: 'price', name: 'Preço', el: <AFPaidPriceSlide data={data} photo={p[p.length - 1] ?? p[0]} /> });
    slides.push({ id: 'cta', name: 'CTA', el: <AFPaidCTASlide data={data} photo={p[0]} /> });

    return slides;
  };

  const slides = buildSlides();
  const totalSlides = slides.length;
  const safeIndex = Math.min(currentSlide, totalSlides - 1);

  const availableW = Math.max(160, containerW - 80);
  const previewW = Math.min(availableW, availableW);
  const previewScale = previewW / SLIDE_W;

  const thumbW = 60;
  const thumbScale = thumbW / SLIDE_W;

  const prev = () => setCurrentSlide((p) => (p === 0 ? totalSlides - 1 : p - 1));
  const next = () => setCurrentSlide((p) => (p === totalSlides - 1 ? 0 : p + 1));

  const captureRef = async (el: HTMLDivElement | null) => {
    if (!el) return null;
    const opts = { quality: 1, pixelRatio: safePixelRatio(), cacheBust: true };
    await toPng(el, opts);
    await new Promise(r => setTimeout(r, 120));
    return toPng(el, opts);
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('af-trafego-pago') as JSZip;
      for (let i = 0; i < slides.length; i++) {
        const url = await captureRef(refs.current[i]);
        if (!url) continue;
        folder.file(`${String(i + 1).padStart(2, '0')}-${slides[i].name.toLowerCase()}.png`, url.split(',')[1], { base64: true });
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `af-trafego-pago-${data.title || 'imovel'}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
      toast.success(`${slides.length} slides de tráfego pago exportados!`);
    } catch { toast.error('Erro ao exportar'); }
    finally { setIsExporting(false); }
  };

  const handleExportSingle = async () => {
    setIsExporting(true);
    try {
      const url = await captureRef(refs.current[safeIndex]);
      if (!url) return;
      const a = document.createElement('a');
      a.download = `af-ads-${safeIndex + 1}-${slides[safeIndex].name.toLowerCase()}.png`;
      a.href = url;
      a.click();
      toast.success('Slide exportado!');
    } finally { setIsExporting(false); }
  };

  return (
    <div ref={containerRef} className="space-y-3 w-full overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4" style={{ color: ACCENT }} />
          <h3 className="font-semibold text-sm text-gray-800">Tráfego Pago</h3>
        </div>
        <span className="text-xs text-gray-400">{totalSlides} slides</span>
      </div>

      <Button variant="outline" size="sm" onClick={handleExportAll} disabled={isExporting} className="gap-1.5 w-full text-xs">
        {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
        Exportar Tráfego Pago ({slides.length})
      </Button>

      <div className="flex items-center gap-1 flex-wrap">
        {slides.map((slide, index) => (
          <button key={slide.id} onClick={() => setCurrentSlide(index)}
            className="px-2 py-0.5 rounded-full text-xs transition-all"
            style={safeIndex === index ? { backgroundColor: ACCENT, color: '#fff' } : { backgroundColor: '#F3F4F6', color: '#6B7280' }}>
            {index + 1}. {slide.name}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <button onClick={prev} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0">
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
        <div className="relative rounded-xl overflow-hidden shadow-2xl flex-shrink-0" style={{ width: Math.round(previewW), height: Math.round(previewW) }}>
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
            style={{ width: thumbW, height: thumbW, outline: safeIndex === index ? `2px solid ${ACCENT}` : '2px solid transparent', outlineOffset: '2px', opacity: safeIndex === index ? 1 : 0.6 }}>
            <div className="origin-top-left pointer-events-none" style={{ width: SLIDE_W, height: FEED_H, transform: `scale(${thumbScale})` }}>
              {slide.el}
            </div>
          </button>
        ))}
      </div>

      {/* Hidden render area for export */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden="true">
        {slides.map((slide, i) => (
          <div key={`exp-${i}`} ref={el => { refs.current[i] = el; }} style={{ width: SLIDE_W, height: FEED_H, overflow: 'hidden' }}>
            {slide.el}
          </div>
        ))}
      </div>
    </div>
  );
}
