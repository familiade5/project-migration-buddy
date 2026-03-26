import { useState, useRef } from 'react';
import { safePixelRatio } from '@/lib/exportUtils';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { Download, Loader2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { AFPropertyData } from '@/types/apartamentosFortaleza';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { AFStory1_T1_Curiosity, AFStory1_T1_Reveal, AFStory1_T1_CTA } from './stories/AFStoryTheme1';
import { AFStory2_T2_Curiosity, AFStory2_T2_Reveal, AFStory2_T2_CTA } from './stories/AFStoryTheme2';
import { AFStory3_T3_Curiosity, AFStory3_T3_Reveal, AFStory3_T3_CTA } from './stories/AFStoryTheme3';

const STORY_W = 360;
const STORY_H = 640;
const PRIMARY = '#0C7B8E';
const ACCENT  = '#E8562A';

interface AFStoriesPreviewProps {
  data: AFPropertyData;
  photos: string[];
}

type ThemeId = 1 | 2 | 3;

const THEMES = [
  { id: 1 as ThemeId, name: 'Brisa do Mar', description: 'Dark & Oceânico', emoji: '🌊', accent: PRIMARY, gradient: `linear-gradient(135deg, #071a1e, ${PRIMARY})`, slideCount: 3 },
  { id: 2 as ThemeId, name: 'Praia Branca', description: 'Branco & Sofisticado', emoji: '✨', accent: ACCENT, gradient: `linear-gradient(135deg, #ffffff, #edf7f9)`, slideCount: 3 },
  { id: 3 as ThemeId, name: 'Pôr do Sol', description: 'Dramático & Impactante', emoji: '🔥', accent: ACCENT, gradient: `linear-gradient(135deg, #0c0c0c, ${ACCENT}88)`, slideCount: 3 },
] as const;

export function AFStoriesPreview({ data, photos }: AFStoriesPreviewProps) {
  const [activeTheme, setActiveTheme] = useState<ThemeId>(1);
  const [currentStory, setCurrentStory] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const t1r0=useRef<HTMLDivElement>(null), t1r1=useRef<HTMLDivElement>(null), t1r2=useRef<HTMLDivElement>(null);
  const t2r0=useRef<HTMLDivElement>(null), t2r1=useRef<HTMLDivElement>(null), t2r2=useRef<HTMLDivElement>(null);
  const t3r0=useRef<HTMLDivElement>(null), t3r1=useRef<HTMLDivElement>(null), t3r2=useRef<HTMLDivElement>(null);

  const refsByTheme: Record<ThemeId, React.RefObject<HTMLDivElement>[]> = {
    1: [t1r0, t1r1, t1r2], 2: [t2r0, t2r1, t2r2], 3: [t3r0, t3r1, t3r2],
  };

  const p0 = photos[0];
  const pLast = photos[photos.length - 1] ?? photos[0];
  const labels = ['Curiosidade', 'Imóvel', 'CTA'];

  const slidesByTheme: Record<ThemeId, React.ReactElement[]> = {
    1: [<AFStory1_T1_Curiosity data={data} photo={p0} />, <AFStory1_T1_Reveal data={data} photos={photos} />, <AFStory1_T1_CTA data={data} photo={pLast} />],
    2: [<AFStory2_T2_Curiosity data={data} photo={p0} />, <AFStory2_T2_Reveal data={data} photos={photos} />, <AFStory2_T2_CTA data={data} photo={pLast} />],
    3: [<AFStory3_T3_Curiosity data={data} photo={p0} />, <AFStory3_T3_Reveal data={data} photos={photos} />, <AFStory3_T3_CTA data={data} photo={pLast} />],
  };

  const currentSlides = slidesByTheme[activeTheme];
  const currentRefs = refsByTheme[activeTheme];
  const slideCount = currentSlides.length;
  const safeStory = Math.min(currentStory, slideCount - 1);

  const previewW = 200;
  const previewH = 356;
  const previewScale = previewW / STORY_W;
  const thumbW = 56;
  const thumbH = 100;
  const thumbScale = thumbW / STORY_W;

  const captureRef = async (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return null;
    return toPng(ref.current, { quality: 1, pixelRatio: safePixelRatio(), cacheBust: true });
  };

  const handleExportTheme = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      const theme = THEMES.find(t => t.id === activeTheme)!;
      const folder = zip.folder(`stories-${theme.name}`) as JSZip;
      for (let i = 0; i < currentRefs.length; i++) {
        const url = await captureRef(currentRefs[i]);
        if (!url) continue;
        folder.file(`${String(i+1).padStart(2,'0')}-${labels[i].toLowerCase()}.png`, url.split(',')[1], { base64: true });
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `af-stories-${theme.name}-${data.title || 'imovel'}.zip`; a.click();
      URL.revokeObjectURL(a.href);
      toast.success(`${currentRefs.length} stories exportados!`);
    } catch { toast.error('Erro ao exportar'); }
    finally { setIsExporting(false); }
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      for (const theme of THEMES) {
        const refs = refsByTheme[theme.id];
        const folder = zip.folder(`tema-${theme.id}-${theme.name}`) as JSZip;
        for (let i = 0; i < refs.length; i++) {
          const url = await captureRef(refs[i]);
          if (!url) continue;
          folder.file(`${String(i+1).padStart(2,'0')}-${labels[i].toLowerCase()}.png`, url.split(',')[1], { base64: true });
        }
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `af-todos-stories-${data.title || 'imovel'}.zip`; a.click();
      URL.revokeObjectURL(a.href);
      toast.success('9 stories (3 temas) exportados!');
    } catch { toast.error('Erro ao exportar'); }
    finally { setIsExporting(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4" style={{ color: ACCENT }} />
        <h3 className="font-semibold text-sm text-gray-800">Stories — Escolha um tema</h3>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {THEMES.map(theme => (
          <button key={theme.id}
            onClick={() => { setActiveTheme(theme.id); setCurrentStory(0); }}
            className="relative rounded-xl overflow-hidden transition-all"
            style={{
              padding: '10px 8px', background: theme.gradient,
              outline: activeTheme === theme.id ? `2px solid ${theme.accent}` : '2px solid transparent',
              outlineOffset: '2px',
              transform: activeTheme === theme.id ? 'scale(1.02)' : 'scale(1)',
              boxShadow: activeTheme === theme.id ? `0 4px 16px ${theme.accent}40` : 'none',
            }}
          >
            {activeTheme === theme.id && (
              <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.accent }}>
                <span style={{ color: 'white', fontSize: 9, fontWeight: 800 }}>✓</span>
              </div>
            )}
            <p style={{ fontSize: 16, margin: '0 0 3px', textAlign: 'center' }}>{theme.emoji}</p>
            <p style={{ color: theme.id === 2 ? '#0f172a' : 'white', fontSize: 11, fontWeight: 700, margin: '0 0 1px', textAlign: 'center' }}>{theme.name}</p>
            <p style={{ color: theme.id === 2 ? '#64748b' : 'rgba(255,255,255,0.65)', fontSize: 9, margin: 0, textAlign: 'center' }}>{theme.description}</p>
          </button>
        ))}
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
        {labels.map((label, i) => (
          <button key={i} onClick={() => setCurrentStory(i)}
            className="flex-shrink-0 py-1.5 px-3 rounded-lg text-xs font-medium transition-all"
            style={{ backgroundColor: safeStory === i ? PRIMARY : '#F3F4F6', color: safeStory === i ? 'white' : '#6B7280' }}>
            {i + 1}. {label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-3">
        <button onClick={() => setCurrentStory(s => (s === 0 ? slideCount - 1 : s - 1))} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0">
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
        <div className="relative rounded-2xl overflow-hidden shadow-2xl flex-shrink-0" style={{ width: previewW, height: previewH }}>
          <div className="origin-top-left" style={{ width: STORY_W, height: STORY_H, transform: `scale(${previewScale})` }}>
            {currentSlides[safeStory]}
          </div>
        </div>
        <button onClick={() => setCurrentStory(s => (s === slideCount - 1 ? 0 : s + 1))} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0">
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="flex gap-1.5 justify-center overflow-x-auto pb-0.5">
        {labels.map((_, i) => (
          <button key={i} onClick={() => setCurrentStory(i)}
            className="relative rounded-lg overflow-hidden flex-shrink-0 transition-all"
            style={{ width: thumbW, height: thumbH, outline: safeStory === i ? `2px solid ${PRIMARY}` : '2px solid transparent', outlineOffset: '2px', opacity: safeStory === i ? 1 : 0.55 }}>
            <div className="origin-top-left pointer-events-none" style={{ width: STORY_W, height: STORY_H, transform: `scale(${thumbScale})` }}>
              {currentSlides[i]}
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={isExporting} onClick={async () => {
          setIsExporting(true);
          try {
            const url = await captureRef(currentRefs[safeStory]);
            if (!url) return;
            const a = document.createElement('a');
            a.href = url; a.download = `af-story-${safeStory+1}-${labels[safeStory].toLowerCase()}.png`; a.click();
            toast.success('Slide exportado!');
          } catch { toast.error('Erro'); } finally { setIsExporting(false); }
        }} className="flex-1 gap-1.5 text-xs">
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}Este slide
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportTheme} disabled={isExporting} className="flex-1 gap-1.5 text-xs">
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}Tema {activeTheme}
        </Button>
        <Button size="sm" onClick={handleExportAll} disabled={isExporting} className="flex-1 gap-1.5 text-xs text-white" style={{ backgroundColor: ACCENT }}>
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}Todos
        </Button>
      </div>

      {/* Hidden full-res DOM */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden="true">
        <div ref={t1r0} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}><AFStory1_T1_Curiosity data={data} photo={photos[0]} /></div>
        <div ref={t1r1} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}><AFStory1_T1_Reveal data={data} photos={photos} /></div>
        <div ref={t1r2} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}><AFStory1_T1_CTA data={data} photo={pLast} /></div>
        <div ref={t2r0} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}><AFStory2_T2_Curiosity data={data} photo={photos[0]} /></div>
        <div ref={t2r1} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}><AFStory2_T2_Reveal data={data} photos={photos} /></div>
        <div ref={t2r2} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}><AFStory2_T2_CTA data={data} photo={pLast} /></div>
        <div ref={t3r0} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}><AFStory3_T3_Curiosity data={data} photo={photos[0]} /></div>
        <div ref={t3r1} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}><AFStory3_T3_Reveal data={data} photos={photos} /></div>
        <div ref={t3r2} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}><AFStory3_T3_CTA data={data} photo={pLast} /></div>
      </div>
    </div>
  );
}
