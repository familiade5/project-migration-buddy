import { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { safePixelRatio } from '@/lib/exportUtils';
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
import { AM2CoverSlide, AM2PhotoSlide, AM2CTASlide } from './slides/AMSlides2';
import {
  AMStory4_T4_Slide1,
  AMStory4_T4_Slide2,
  AMStory4_T4_Slide3,
  AMStory4_T4_Slide4,
  AMStory4_T4_Slide5,
} from './stories/AMStoryTheme4';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AMInstagramPublishDialog } from './AMInstagramPublishDialog';
import { formatCurrency } from '@/lib/formatCurrency';

// Helper to convert data URL to Blob
const dataURLtoBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) { u8arr[n] = bstr.charCodeAt(n); }
  return new Blob([u8arr], { type: mime });
};

// Convert PNG to JPEG for Story compatibility
const convertToJpeg = (pngDataUrl: string, quality = 0.92): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas context unavailable')); return; }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = pngDataUrl;
  });
};

// Upload image to Supabase storage
const uploadExportedImage = async (
  dataUrl: string, userId: string, creativeId: string, index: number, format: string, asJpeg = false,
): Promise<string> => {
  let finalDataUrl = dataUrl;
  let contentType = 'image/png';
  let ext = 'png';
  if (asJpeg) {
    finalDataUrl = await convertToJpeg(dataUrl);
    contentType = 'image/jpeg';
    ext = 'jpg';
  }
  const blob = dataURLtoBlob(finalDataUrl);
  const fileName = `${userId}/${creativeId}/${format}-${index + 1}.${ext}`;
  const { error } = await supabase.storage.from('exported-creatives').upload(fileName, blob, { contentType, upsert: true });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from('exported-creatives').getPublicUrl(fileName);
  return publicUrl;
};

// Build AM caption
function buildAMCaption(data: AMPropertyData): string {
  const lines: string[] = [];
  const titleParts = [data.title].filter(Boolean);
  if (data.bedrooms > 0) titleParts.push(`${data.bedrooms} ${data.bedrooms === 1 ? 'Quarto' : 'Quartos'}`);
  if (data.neighborhood) titleParts.push(data.neighborhood);
  lines.push(`🏢 ${titleParts.join(' - ')}`);
  lines.push('');
  if (data.isRental) {
    if (data.rentalPrice > 0) lines.push(`💰 Valor de Locação ${formatCurrency(data.rentalPrice)}/mês`);
  } else {
    if (data.salePrice > 0) {
      const financing = data.acceptsFinancing ? `Aceita financiamento${data.acceptsFGTS ? ' e FGTS' : ''}` : 'À vista';
      lines.push(`💰 Valor de Venda de ${formatCurrency(data.salePrice)} ${financing}`);
    }
    if (data.subsidy > 0) lines.push(`💰 Subsídio de até ${formatCurrency(data.subsidy)} - dependendo da renda`);
  }
  lines.push('');
  if (data.bedrooms > 0) lines.push(`✅ ${data.bedrooms} ${data.bedrooms === 1 ? 'quarto' : 'quartos'}`);
  if (data.suites > 0) lines.push(`✅ ${data.suites} ${data.suites === 1 ? 'suíte' : 'suítes'}`);
  if (data.floor) lines.push(`✅ ${data.floor}° Andar`);
  if (data.rooms) data.rooms.split('\n').map(r => r.trim()).filter(Boolean).forEach(r => lines.push(`✅ ${r}`));
  if (data.garageSpaces > 0) lines.push(`✅ ${data.garageSpaces} ${data.garageSpaces === 1 ? 'vaga de garagem' : 'vagas de garagem'}`);
  if (data.area > 0) lines.push(`✅ ${data.area}m²`);
  lines.push('');
  if (data.condominiumFee > 0 && data.condoIncludes) {
    lines.push(`✅ Baixo custo de condomínio, incluso ${data.condoIncludes}`);
    lines.push('');
  } else if (data.condominiumFee > 0) {
    lines.push(`✅ Condomínio ${formatCurrency(data.condominiumFee)}/mês`);
    lines.push('');
  }
  if (data.leisureItems) { lines.push(`✅ Área de lazer completa`); lines.push(''); }
  const locationParts: string[] = [];
  if (data.address) locationParts.push(data.address);
  if (data.referencePoint) locationParts.push(data.referencePoint);
  if (locationParts.length > 0) lines.push(`📍 Localização: ${locationParts.join(' – ')}`);
  lines.push('');
  if (data.brokerName) { lines.push(`👨‍💼 ${data.brokerName} | Corretor de Imóveis`); lines.push(`Creci 3968 PF`); }
  if (data.brokerPhone) lines.push(`📞 ${data.brokerPhone} (WhatsApp)`);
  lines.push(`🌐 https://www.facebook.com/ApartamentosManaus`);
  lines.push(`🌐 www.apartamentosmanaus.com`);
  return lines.join('\n');
}

interface AMPostPreviewProps {
  data: AMPropertyData;
  photos: string[];
  photoPositions?: Record<number, { x: number; y: number }>;
  photoScales?: Record<number, number>;
}

type FormatType = 'feed' | 'story';

// Native slide dimensions
const SLIDE_W = 360;
const FEED_H  = 360;
const STORY_H = 640;

// Max slides we'll ever support (drives fixed ref pool)
const MAX_SLIDES = 20;

export function AMPostPreview({ data, photos, photoPositions = {}, photoScales = {} }: AMPostPreviewProps) {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [format, setFormat] = useState<FormatType>('feed');
  const [designVersion, setDesignVersion] = useState<1 | 2>(1);
  const [isExporting, setIsExporting] = useState(false);
  const [containerW, setContainerW] = useState(320);
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure container width to compute responsive scale
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerW(containerRef.current.offsetWidth);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

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

  const getPos = (index: number) => {
    const p = photoPositions[index];
    return p ? `${p.x}% ${p.y}%` : undefined;
  };

  const getScale = (index: number) => photoScales[index] || undefined;

  // ── Build FEED slide list ─────────────────────────────────────────────────
  const buildFeedSlides = () => {
    const p = photos;
    const slides = [];

    slides.push({ id: 'cover',    name: 'Capa',     el: <AMCoverSlide data={data} photo={p[0]} objectPosition={getPos(0)} /> });
    slides.push({ id: 'specs',    name: 'Especif.',  el: <AMSpecsSlide data={data} photo={p[1] ?? p[0]} objectPosition={getPos(p[1] ? 1 : 0)} /> });
    slides.push({ id: 'location', name: 'Local',     el: <AMLocationSlide data={data} photo={p[2] ?? p[1] ?? p[0]} objectPosition={getPos(p[2] ? 2 : p[1] ? 1 : 0)} /> });

    const photoSliceEnd = Math.max(3, p.length - 1);
    for (let i = 3; i < photoSliceEnd; i++) {
      slides.push({ id: `photo-${i}`, name: `Foto ${i - 1}`, el: <AMPhotoSlide data={data} photo={p[i]} photoIndex={i} objectPosition={getPos(i)} /> });
    }

    const lastIdx = p.length - 1;
    const lastPhoto = p[lastIdx] ?? p[0];
    slides.push({ id: 'info', name: 'Info', el: <AMInfoSlide data={data} photo={lastPhoto} objectPosition={getPos(lastIdx >= 0 ? lastIdx : 0)} /> });

    return slides;
  };

  // ── Build FEED slide list — Design 2 ──────────────────────────────────────
  const buildFeedSlides2 = () => {
    const p = photos;
    const slides: { id: string; name: string; el: React.ReactNode }[] = [];

    slides.push({ id: 'd2-cover', name: 'Capa', el: <AM2CoverSlide data={data} photos={p} objectPosition={getPos(0)} /> });

    const remaining = p.slice(1);
    for (let i = 0; i < remaining.length; i += 2) {
      const pair: [string, string?] = [remaining[i], remaining[i + 1]];
      const slideNum = Math.floor(i / 2) + 2;
      const idx1 = i + 1;
      const idx2 = i + 2;
      slides.push({
        id: `d2-photo-${slideNum}`,
        name: `Fotos ${slideNum - 1}`,
        el: <AM2PhotoSlide photos={pair} slideIndex={Math.floor(i / 2)} data={data} objectPositions={[getPos(idx1) || '50% 50%', getPos(idx2) || '50% 50%']} />,
      });
    }

    slides.push({ id: 'd2-cta', name: 'CTA', el: <AM2CTASlide data={data} photos={p} /> });

    return slides;
  };

  // ── Build STORY slide list — Padrão T4 (5 slides fixos) ──────────────────
  const buildStorySlides = () => {
    const p = photos;
    const p0 = p[0];
    const pLast = p[p.length - 1] ?? p[0];
    return [
      { id: 'story-t4-1', name: 'Card 1', el: <AMStory4_T4_Slide1 data={data} photos={p} /> },
      { id: 'story-t4-2', name: 'Card 2', el: <AMStory4_T4_Slide2 data={data} photo={p0} photos={p} /> },
      { id: 'story-t4-3', name: 'Card 3', el: <AMStory4_T4_Slide3 data={data} photo={p0} photos={p} /> },
      { id: 'story-t4-4', name: 'Card 4', el: <AMStory4_T4_Slide4 data={data} photos={p} /> },
      { id: 'story-t4-5', name: 'Card 5', el: <AMStory4_T4_Slide5 data={data} photo={pLast} photos={p} /> },
    ];
  };

  const feedSlides  = format === 'feed' && designVersion === 2 ? buildFeedSlides2() : buildFeedSlides();
  const storySlides = buildStorySlides();

  const slides      = format === 'feed' ? feedSlides : storySlides;
  const totalSlides = slides.length;
  const safeIndex   = Math.min(currentSlide, totalSlides - 1);

  // ── Responsive preview dimensions ─────────────────────────────────────────
  // Reserve ~48px for left/right arrow buttons + gap
  const availableW   = Math.max(160, containerW - 80);
  const nativeH      = format === 'feed' ? FEED_H : STORY_H;
  const nativeAspect = SLIDE_W / nativeH; // width/height ratio

  // For feed (square): cap at availableW; for story (portrait): constrain by available height budget
  const maxPreviewH  = format === 'feed' ? availableW : Math.min(availableW / nativeAspect, 340);
  const previewW     = format === 'feed' ? Math.min(availableW, maxPreviewH) : maxPreviewH * nativeAspect;
  const previewH     = format === 'feed' ? previewW : maxPreviewH;
  const previewScale = previewW / SLIDE_W;

  // Thumbnails: scale proportionally
  const thumbW     = format === 'feed' ? 60 : 38;
  const thumbH     = format === 'feed' ? 60 : 68;
  const thumbScale = thumbW / SLIDE_W;

  // ── Navigation ────────────────────────────────────────────────────────────
  const prev = () => setCurrentSlide((p) => (p === 0 ? totalSlides - 1 : p - 1));
  const next = () => setCurrentSlide((p) => (p === totalSlides - 1 ? 0 : p + 1));

  // ── Export helpers ────────────────────────────────────────────────────────
  const captureRef = async (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return null;
    const opts = { quality: 1, pixelRatio: safePixelRatio(), cacheBust: true };
    // First pass: warms up the canvas and forces image/font loading
    await toPng(ref.current, opts);
    // Brief wait so fonts & images are fully painted
    await new Promise(r => setTimeout(r, 120));
    // Second pass: captures at full fidelity
    return toPng(ref.current, opts);
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

  // ── Instagram publish preparation ─────────────────────────────────────────
  const prepareInstagramPublication = async () => {
    if (!user) throw new Error('Você precisa estar logado para publicar.');
    if (photos.length === 0) throw new Error('Adicione pelo menos uma foto.');

    setIsExporting(true);
    try {
      const publicationId = `am-instagram-${crypto.randomUUID()}`;
      const previewDataUrls: string[] = [];
      const imageUrls: string[] = [];

      // Capture all feed slides
      for (let i = 0; i < feedSlides.length; i++) {
        const ref = feedRefs[i];
        const dataUrl = await captureRef(ref);
        if (!dataUrl) continue;
        previewDataUrls.push(dataUrl);
        const publicUrl = await uploadExportedImage(dataUrl, user.id, publicationId, i, 'feed');
        imageUrls.push(publicUrl);
      }

      // Capture first story slide for Story
      let storyImageUrl: string | undefined;
      let storyPreviewDataUrl: string | undefined;
      if (storyRefs[0]?.current) {
        const storyDataUrl = await captureRef(storyRefs[0]);
        if (storyDataUrl) {
          storyPreviewDataUrl = storyDataUrl;
          storyImageUrl = await uploadExportedImage(storyDataUrl, user.id, publicationId, 0, 'story', true);
        }
      }

      const caption = buildAMCaption(data);
      return { previewDataUrls, imageUrls, storyImageUrl, storyPreviewDataUrl, caption };
    } catch (error) {
      console.error('Error preparing AM Instagram publication:', error);
      throw error instanceof Error ? error : new Error('Não foi possível preparar a publicação.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div ref={containerRef} className="space-y-3 w-full overflow-hidden">
      {/* ── Header + Format selector ── */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-sm text-gray-800">Preview do Carrossel</h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          {format === 'feed' && (
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => { setDesignVersion(1); setCurrentSlide(0); }}
                className="px-2 py-1 rounded-md text-xs font-medium transition-all"
                style={designVersion === 1 ? { backgroundColor: '#1B5EA6', color: 'white' } : { color: '#6B7280' }}
              >Design 1</button>
              <button
                onClick={() => { setDesignVersion(2); setCurrentSlide(0); }}
                className="px-2 py-1 rounded-md text-xs font-medium transition-all"
                style={designVersion === 2 ? { backgroundColor: '#F47920', color: 'white' } : { color: '#6B7280' }}
              >Design 2</button>
            </div>
          )}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => { setFormat('feed'); setCurrentSlide(0); }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs transition-all ${format === 'feed' ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
              style={format === 'feed' ? { backgroundColor: '#1B5EA6' } : {}}
            >
              <Square className="w-3 h-3" /><span>Feed</span>
            </button>
            <button
              onClick={() => { setFormat('story'); setCurrentSlide(0); }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs transition-all ${format === 'story' ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
              style={format === 'story' ? { backgroundColor: '#1B5EA6' } : {}}
            >
              <Smartphone className="w-3 h-3" /><span>Story</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Export buttons ── */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleExportAll} disabled={isExporting} className="gap-1.5 flex-1 text-xs min-w-0">
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" /> : <Download className="w-3.5 h-3.5 flex-shrink-0" />}
          <span className="truncate">Exportar {format === 'feed' ? 'Feed' : 'Story'} ({slides.length})</span>
        </Button>
        <Button size="sm" onClick={handleExportBoth} disabled={isExporting} className="gap-1.5 flex-1 text-xs text-white min-w-0" style={{ backgroundColor: '#F47920' }}>
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" /> : <Download className="w-3.5 h-3.5 flex-shrink-0" />}
          <span className="truncate">Tudo ({feedSlides.length + storySlides.length})</span>
        </Button>
      </div>

      {/* ── Instagram Publish ── */}
      <AMInstagramPublishDialog
        data={data}
        disabled={isExporting || photos.length === 0}
        onPrepare={prepareInstagramPublication}
      />

      {/* ── Slide name pills ── */}
      <div className="flex items-center gap-1 flex-wrap">
        {slides.map((slide, index) => (
          <button key={slide.id} onClick={() => setCurrentSlide(index)}
            className="px-2 py-0.5 rounded-full text-xs transition-all"
            style={safeIndex === index
              ? { backgroundColor: '#1B5EA6', color: '#fff' }
              : { backgroundColor: '#F3F4F6', color: '#6B7280' }}>
            {index + 1}. {slide.name}
          </button>
        ))}
      </div>

      {/* ── Main preview + arrows ── */}
      <div className="flex items-center justify-center gap-2">
        <button onClick={prev} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0">
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>

        <div
          className="relative rounded-xl overflow-hidden shadow-2xl flex-shrink-0"
          style={{ width: Math.round(previewW), height: Math.round(previewH) }}
        >
          <div
            className="origin-top-left"
            style={{ width: SLIDE_W, height: nativeH, transform: `scale(${previewScale})` }}
          >
            {slides[safeIndex]?.el}
          </div>
        </div>

        <button onClick={next} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0">
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
