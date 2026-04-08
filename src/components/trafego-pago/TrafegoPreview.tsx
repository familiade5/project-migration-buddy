import { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { safePixelRatio } from '@/lib/exportUtils';
import JSZip from 'jszip';
import { Download, ChevronLeft, ChevronRight, Loader2, Zap, Gem } from 'lucide-react';
import { TrafegoPropertyData } from '@/types/trafegoPago';
import { MCMV1, MCMV2, MCMV3, MCMV4, MCMV5, MCMV6, MCMV7, MCMV8, MCMV9, MCMV10 } from './slides/MCMVSlides';
import { Premium1, Premium2, Premium3, Premium4, Premium5, Premium6, Premium7, Premium8, Premium9, Premium10 } from './slides/PremiumSlides';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const BLUE = '#1B5EA6';
const ORANGE = '#F47920';
const GOLD = '#C9A94E';
const SLIDE_W = 360;
const FEED_H = 360;
const MAX_REFS = 20;

interface Props {
  data: TrafegoPropertyData;
  photos: string[];
}

export function TrafegoPreview({ data, photos }: Props) {
  const [designVersion, setDesignVersion] = useState<1 | 2>(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [containerW, setContainerW] = useState(320);
  const containerRef = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLDivElement | null)[]>(Array(MAX_REFS).fill(null));

  useEffect(() => {
    const measure = () => { if (containerRef.current) setContainerW(containerRef.current.offsetWidth); };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const p = photos;

  const buildMCMVSlides = () => {
    const slides: { id: string; name: string; el: React.ReactNode }[] = [];
    const fill3 = p.length >= 3 ? p.slice(0, 3) : [p[0] || '', p[0] || '', p[0] || ''];
    const fill4 = p.length >= 4 ? p.slice(0, 4) : [p[0] || '', p[0] || '', p[0] || '', p[0] || ''];
    slides.push({ id: 'mcmv1', name: 'Saia do Aluguel', el: <MCMV1 data={data} photo={p[0]} /> });
    slides.push({ id: 'mcmv2', name: 'Sonho', el: <MCMV2 data={data} photo={p[1] ?? p[0]} /> });
    slides.push({ id: 'mcmv3', name: 'Purple', el: <MCMV3 data={data} photo={p[2] ?? p[0]} /> });
    slides.push({ id: 'mcmv4', name: 'Clean', el: <MCMV4 data={data} photos={fill3} /> });
    slides.push({ id: 'mcmv5', name: 'Elegante', el: <MCMV5 data={data} photos={p.length >= 2 ? p.slice(0, 2) : [p[0] || '', p[0] || '']} /> });
    slides.push({ id: 'mcmv6', name: 'Collage', el: <MCMV6 data={data} photo={p[0]} photos={fill3} /> });
    slides.push({ id: 'mcmv7', name: 'Comparativo', el: <MCMV7 data={data} photo={p[3] ?? p[1] ?? p[0]} /> });
    slides.push({ id: 'mcmv8', name: 'Urgência', el: <MCMV8 data={data} photo={p[4] ?? p[2] ?? p[0]} /> });
    slides.push({ id: 'mcmv9', name: 'Condições', el: <MCMV9 data={data} photo={p[5] ?? p[3] ?? p[0]} /> });
    slides.push({ id: 'mcmv10', name: 'CTA', el: <MCMV10 data={data} photo={p[6] ?? p[0]} /> });
    return slides;
  };

  const buildPremiumSlides = () => {
    const slides: { id: string; name: string; el: React.ReactNode }[] = [];
    slides.push({ id: 'prem1', name: 'Hero', el: <Premium1 data={data} photo={p[0]} /> });
    slides.push({ id: 'prem2', name: 'Editorial', el: <Premium2 data={data} photo={p[1] ?? p[0]} /> });
    slides.push({ id: 'prem3', name: 'Specs', el: <Premium3 data={data} photo={p[2] ?? p[0]} /> });
    slides.push({ id: 'prem4', name: 'Galeria', el: <Premium4 data={data} photos={p.length >= 4 ? p.slice(0, 4) : [p[0] || '', p[0] || '', p[0] || '', p[0] || '']} /> });
    slides.push({ id: 'prem5', name: 'Lifestyle', el: <Premium5 data={data} photo={p[3] ?? p[0]} /> });
    slides.push({ id: 'prem6', name: 'Diferenciais', el: <Premium6 data={data} /> });
    slides.push({ id: 'prem7', name: 'Preço', el: <Premium7 data={data} photo={p[4] ?? p[0]} /> });
    slides.push({ id: 'prem8', name: 'Localização', el: <Premium8 data={data} photo={p[5] ?? p[1] ?? p[0]} /> });
    slides.push({ id: 'prem9', name: 'Investimento', el: <Premium9 data={data} photo={p[6] ?? p[2] ?? p[0]} /> });
    slides.push({ id: 'prem10', name: 'Contato', el: <Premium10 data={data} photo={p[7] ?? p[0]} /> });
    return slides;
  };

  const slides = designVersion === 1 ? buildMCMVSlides() : buildPremiumSlides();
  const totalSlides = slides.length;
  const safeIndex = Math.min(currentSlide, totalSlides - 1);

  const availableW = Math.max(160, containerW - 80);
  const previewScale = availableW / SLIDE_W;

  const thumbW = 56;
  const thumbScale = thumbW / SLIDE_W;

  const prev = () => setCurrentSlide((s) => (s === 0 ? totalSlides - 1 : s - 1));
  const next = () => setCurrentSlide((s) => (s === totalSlides - 1 ? 0 : s + 1));

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
      const folder = zip.folder(designVersion === 1 ? 'trafego-mcmv' : 'trafego-premium') as JSZip;
      for (let i = 0; i < slides.length; i++) {
        const url = await captureRef(refs.current[i]);
        if (!url) continue;
        folder.file(`${String(i + 1).padStart(2, '0')}-${slides[i].name.toLowerCase()}.png`, url.split(',')[1], { base64: true });
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `trafego-${designVersion === 1 ? 'mcmv' : 'premium'}-${data.title || 'imovel'}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
      toast.success(`${slides.length} criativos exportados!`);
    } catch { toast.error('Erro ao exportar'); }
    finally { setIsExporting(false); }
  };

  const handleExportSingle = async () => {
    setIsExporting(true);
    try {
      const url = await captureRef(refs.current[safeIndex]);
      if (!url) return;
      const a = document.createElement('a');
      a.download = `trafego-${safeIndex + 1}-${slides[safeIndex].name.toLowerCase()}.png`;
      a.href = url;
      a.click();
      toast.success('Criativo exportado!');
    } finally { setIsExporting(false); }
  };

  const accentColor = designVersion === 1 ? ORANGE : GOLD;

  return (
    <div ref={containerRef} className="space-y-3 w-full overflow-hidden">
      {/* Design toggle */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => { setDesignVersion(1); setCurrentSlide(0); }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all"
          style={designVersion === 1 ? { backgroundColor: ORANGE, color: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' } : { color: '#6B7280' }}
        >
          <Zap className="w-3.5 h-3.5" />
          Design 1 — MCMV
        </button>
        <button
          onClick={() => { setDesignVersion(2); setCurrentSlide(0); }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all"
          style={designVersion === 2 ? { backgroundColor: GOLD, color: '#0a1628', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' } : { color: '#6B7280' }}
        >
          <Gem className="w-3.5 h-3.5" />
          Design 2 — Premium
        </button>
      </div>

      <Button variant="outline" size="sm" onClick={handleExportAll} disabled={isExporting} className="gap-1.5 w-full text-xs">
        {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
        Exportar Todos ({slides.length} criativos)
      </Button>

      {/* Slide picker pills */}
      <div className="flex items-center gap-1 flex-wrap">
        {slides.map((slide, index) => (
          <button key={slide.id} onClick={() => setCurrentSlide(index)}
            className="px-2 py-0.5 rounded-full text-xs transition-all"
            style={safeIndex === index ? { backgroundColor: accentColor, color: designVersion === 2 ? '#0a1628' : '#fff' } : { backgroundColor: '#F3F4F6', color: '#6B7280' }}>
            {index + 1}
          </button>
        ))}
      </div>

      {/* Main preview */}
      <div className="flex items-center justify-center gap-2">
        <button onClick={prev} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0">
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
        <div className="relative rounded-xl overflow-hidden shadow-2xl flex-shrink-0" style={{ width: Math.round(availableW), height: Math.round(availableW) }}>
          <div className="origin-top-left" style={{ width: SLIDE_W, height: FEED_H, transform: `scale(${previewScale})` }}>
            {slides[safeIndex]?.el}
          </div>
        </div>
        <button onClick={next} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0">
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Slide name */}
      <p className="text-center text-xs font-medium text-gray-500">
        {safeIndex + 1}/{totalSlides} — {slides[safeIndex]?.name}
      </p>

      <div className="flex justify-center">
        <Button variant="outline" size="sm" onClick={handleExportSingle} disabled={isExporting} className="gap-1.5 text-xs">
          <Download className="w-3.5 h-3.5" />Exportar este criativo
        </Button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-1.5 flex-wrap justify-center">
        {slides.map((slide, index) => (
          <button key={slide.id} onClick={() => setCurrentSlide(index)}
            className="relative rounded-lg overflow-hidden transition-all flex-shrink-0"
            style={{ width: thumbW, height: thumbW, outline: safeIndex === index ? `2px solid ${accentColor}` : '2px solid transparent', outlineOffset: '2px', opacity: safeIndex === index ? 1 : 0.6 }}>
            <div className="origin-top-left pointer-events-none" style={{ width: SLIDE_W, height: FEED_H, transform: `scale(${thumbScale})` }}>
              {slide.el}
            </div>
          </button>
        ))}
      </div>

      {/* Hidden render area */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden="true">
        {slides.map((slide, i) => (
          <div key={`exp-${slide.id}`} ref={el => { refs.current[i] = el; }} style={{ width: SLIDE_W, height: FEED_H, overflow: 'hidden' }}>
            {slide.el}
          </div>
        ))}
      </div>
    </div>
  );
}
