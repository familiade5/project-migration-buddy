/**
 * AMStoriesPreview — Seletor de 4 temas (3 com 3 stories, 1 com 5 slides independentes)
 */

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { Download, Loader2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { AMPropertyData } from '@/types/apartamentosManaus';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Theme 1 — Enigma (dark)
import { AMStory1_T1_Curiosity, AMStory1_T1_Reveal, AMStory1_T1_CTA } from './stories/AMStoryTheme1';
// Theme 2 — Clean Luxury (light)
import { AMStory2_T2_Curiosity, AMStory2_T2_Reveal, AMStory2_T2_CTA } from './stories/AMStoryTheme2';
// Theme 3 — Urgência Urbana (dramatic)
import { AMStory3_T3_Curiosity, AMStory3_T3_Reveal, AMStory3_T3_CTA } from './stories/AMStoryTheme3';
// Theme 4 — Padrão (5 slides independentes)
import {
  AMStory4_T4_Slide1,
  AMStory4_T4_Slide2,
  AMStory4_T4_Slide3,
  AMStory4_T4_Slide4,
  AMStory4_T4_Slide5,
} from './stories/AMStoryTheme4';

const STORY_W = 360;
const STORY_H = 640;

interface AMStoriesPreviewProps {
  data: AMPropertyData;
  photos: string[];
}

type ThemeId = 1 | 2 | 3 | 4;

const THEMES = [
  {
    id: 1 as ThemeId,
    name: 'Enigma',
    description: 'Dark & Misterioso',
    emoji: '🌑',
    accent: '#1B5EA6',
    gradient: 'linear-gradient(135deg, #0a0f1e, #1B5EA6)',
    slideCount: 3,
  },
  {
    id: 2 as ThemeId,
    name: 'Clean Luxury',
    description: 'Branco & Sofisticado',
    emoji: '✨',
    accent: '#F47920',
    gradient: 'linear-gradient(135deg, #ffffff, #f0f6ff)',
    slideCount: 3,
  },
  {
    id: 3 as ThemeId,
    name: 'Urgência',
    description: 'Dramático & Impactante',
    emoji: '🔥',
    accent: '#F47920',
    gradient: 'linear-gradient(135deg, #0c0c0c, #7c2d12)',
    slideCount: 3,
  },
  {
    id: 4 as ThemeId,
    name: 'Padrão',
    description: '5 Cards Únicos',
    emoji: '🏠',
    accent: '#1B5EA6',
    gradient: 'linear-gradient(135deg, #f8fafc, #dbeafe)',
    slideCount: 5,
  },
] as const;

export function AMStoriesPreview({ data, photos }: AMStoriesPreviewProps) {
  const [activeTheme, setActiveTheme] = useState<ThemeId>(1);
  const [currentStory, setCurrentStory] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  // Fixed ref pools
  const t1r0 = useRef<HTMLDivElement>(null);
  const t1r1 = useRef<HTMLDivElement>(null);
  const t1r2 = useRef<HTMLDivElement>(null);
  const t2r0 = useRef<HTMLDivElement>(null);
  const t2r1 = useRef<HTMLDivElement>(null);
  const t2r2 = useRef<HTMLDivElement>(null);
  const t3r0 = useRef<HTMLDivElement>(null);
  const t3r1 = useRef<HTMLDivElement>(null);
  const t3r2 = useRef<HTMLDivElement>(null);
  const t4r0 = useRef<HTMLDivElement>(null);
  const t4r1 = useRef<HTMLDivElement>(null);
  const t4r2 = useRef<HTMLDivElement>(null);
  const t4r3 = useRef<HTMLDivElement>(null);
  const t4r4 = useRef<HTMLDivElement>(null);

  const refsByTheme: Record<ThemeId, React.RefObject<HTMLDivElement>[]> = {
    1: [t1r0, t1r1, t1r2],
    2: [t2r0, t2r1, t2r2],
    3: [t3r0, t3r1, t3r2],
    4: [t4r0, t4r1, t4r2, t4r3, t4r4],
  };

  const p0 = photos[0];
  const pLast = photos[photos.length - 1] ?? photos[0];

  const STORY_LABELS_T1_T2_T3 = ['Curiosidade', 'Imóvel', 'CTA'];
  const STORY_LABELS_T4 = ['Card 1', 'Card 2', 'Card 3', 'Card 4', 'Card 5'];

  const storyLabels = activeTheme === 4 ? STORY_LABELS_T4 : STORY_LABELS_T1_T2_T3;

  const slidesByTheme: Record<ThemeId, React.ReactElement[]> = {
    1: [
      <AMStory1_T1_Curiosity data={data} photo={p0} />,
      <AMStory1_T1_Reveal data={data} photos={photos} />,
      <AMStory1_T1_CTA data={data} photo={pLast} />,
    ],
    2: [
      <AMStory2_T2_Curiosity data={data} photo={p0} />,
      <AMStory2_T2_Reveal data={data} photos={photos} />,
      <AMStory2_T2_CTA data={data} photo={pLast} />,
    ],
    3: [
      <AMStory3_T3_Curiosity data={data} photo={p0} />,
      <AMStory3_T3_Reveal data={data} photos={photos} />,
      <AMStory3_T3_CTA data={data} photo={pLast} />,
    ],
    4: [
      <AMStory4_T4_Slide1 data={data} photos={photos} />,
      <AMStory4_T4_Slide2 data={data} photo={p0} />,
      <AMStory4_T4_Slide3 data={data} photo={p0} />,
      <AMStory4_T4_Slide4 data={data} photos={photos} />,
      <AMStory4_T4_Slide5 data={data} photo={pLast} />,
    ],
  };

  const currentSlides = slidesByTheme[activeTheme];
  const currentRefs = refsByTheme[activeTheme];
  const slideCount = currentSlides.length;

  // Clamp currentStory when theme changes
  const safeStory = Math.min(currentStory, slideCount - 1);

  const previewW = 200;
  const previewH = 356;
  const previewScale = previewW / STORY_W;

  const thumbW = 56;
  const thumbH = 100;
  const thumbScale = thumbW / STORY_W;

  const captureRef = async (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return null;
    return toPng(ref.current, { quality: 1, pixelRatio: 3, cacheBust: true });
  };

  const handleExportTheme = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      const theme = THEMES.find((t) => t.id === activeTheme)!;
      const folder = zip.folder(`stories-${theme.name}`) as JSZip;
      const labels = activeTheme === 4 ? STORY_LABELS_T4 : STORY_LABELS_T1_T2_T3;

      for (let i = 0; i < currentRefs.length; i++) {
        const url = await captureRef(currentRefs[i]);
        if (!url) continue;
        folder.file(
          `${String(i + 1).padStart(2, '0')}-${labels[i].toLowerCase().replace(' ', '-')}.png`,
          url.split(',')[1],
          { base64: true },
        );
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `stories-${theme.name}-${data.title || 'imovel'}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
      toast.success(`${currentRefs.length} stories exportados!`);
    } catch {
      toast.error('Erro ao exportar stories');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAllThemes = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();

      for (const theme of THEMES) {
        const refs = refsByTheme[theme.id];
        const folder = zip.folder(`tema-${theme.id}-${theme.name}`) as JSZip;
        const labels = theme.id === 4 ? STORY_LABELS_T4 : STORY_LABELS_T1_T2_T3;
        for (let i = 0; i < refs.length; i++) {
          const url = await captureRef(refs[i]);
          if (!url) continue;
          folder.file(
            `${String(i + 1).padStart(2, '0')}-${labels[i].toLowerCase().replace(' ', '-')}.png`,
            url.split(',')[1],
            { base64: true },
          );
        }
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `todos-stories-${data.title || 'imovel'}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
      toast.success('14 stories (4 temas) exportados!');
    } catch {
      toast.error('Erro ao exportar');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4" style={{ color: '#F47920' }} />
        <h3 className="font-semibold text-sm text-gray-800">Stories — Escolha um tema</h3>
      </div>

      {/* Theme selector — 2x2 grid for 4 themes */}
      <div className="grid grid-cols-2 gap-2">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => { setActiveTheme(theme.id); setCurrentStory(0); }}
            className="relative rounded-xl overflow-hidden transition-all"
            style={{
              padding: '10px 8px',
              background: theme.gradient,
              outline: activeTheme === theme.id ? `2px solid ${theme.accent}` : '2px solid transparent',
              outlineOffset: '2px',
              transform: activeTheme === theme.id ? 'scale(1.02)' : 'scale(1)',
              boxShadow: activeTheme === theme.id ? `0 4px 16px ${theme.accent}40` : 'none',
            }}
          >
            {activeTheme === theme.id && (
              <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: theme.accent }}>
                <span style={{ color: 'white', fontSize: 9, fontWeight: 800 }}>✓</span>
              </div>
            )}
            <p style={{ fontSize: 16, margin: '0 0 3px', textAlign: 'center' }}>{theme.emoji}</p>
            <p style={{
              color: theme.id === 2 || theme.id === 4 ? '#0f172a' : 'white',
              fontSize: 11, fontWeight: 700, margin: '0 0 1px', textAlign: 'center',
            }}>
              {theme.name}
            </p>
            <p style={{
              color: theme.id === 2 || theme.id === 4 ? '#64748b' : 'rgba(255,255,255,0.65)',
              fontSize: 9, margin: 0, textAlign: 'center',
            }}>
              {theme.description}
            </p>
          </button>
        ))}
      </div>

      {/* Story step pills — scroll horizontal se muitos */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
        {storyLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => setCurrentStory(i)}
            className="flex-shrink-0 py-1.5 px-3 rounded-lg text-xs font-medium transition-all"
            style={{
              backgroundColor: safeStory === i ? '#1B5EA6' : '#F3F4F6',
              color: safeStory === i ? 'white' : '#6B7280',
            }}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {/* Main preview */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setCurrentStory((s) => (s === 0 ? slideCount - 1 : s - 1))}
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
            {currentSlides[safeStory]}
          </div>
        </div>

        <button
          onClick={() => setCurrentStory((s) => (s === slideCount - 1 ? 0 : s + 1))}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
        >
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Thumbnails — scroll horizontal para o tema 4 */}
      <div className="flex gap-1.5 justify-center overflow-x-auto pb-0.5">
        {storyLabels.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentStory(i)}
            className="relative rounded-lg overflow-hidden flex-shrink-0 transition-all"
            style={{
              width: thumbW, height: thumbH,
              outline: safeStory === i ? '2px solid #1B5EA6' : '2px solid transparent',
              outlineOffset: '2px',
              opacity: safeStory === i ? 1 : 0.55,
            }}
          >
            <div
              className="origin-top-left pointer-events-none"
              style={{ width: STORY_W, height: STORY_H, transform: `scale(${thumbScale})` }}
            >
              {currentSlides[i]}
            </div>
          </button>
        ))}
      </div>

      {/* Export buttons */}
      <div className="flex gap-2">
        {/* Baixar slide atual */}
        <Button
          variant="outline"
          size="sm"
          disabled={isExporting}
          onClick={async () => {
            setIsExporting(true);
            try {
              const label = storyLabels[safeStory];
              const url = await captureRef(currentRefs[safeStory]);
              if (!url) return;
              const a = document.createElement('a');
              a.href = url;
              a.download = `story-${String(safeStory + 1).padStart(2, '0')}-${label.toLowerCase().replace(' ', '-')}.png`;
              a.click();
              toast.success('Slide exportado!');
            } catch {
              toast.error('Erro ao exportar');
            } finally {
              setIsExporting(false);
            }
          }}
          className="flex-1 gap-1.5 text-xs"
        >
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          Este slide
        </Button>

        {/* Baixar tema (zip) */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportTheme}
          disabled={isExporting}
          className="flex-1 gap-1.5 text-xs"
        >
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          Tema {activeTheme}
        </Button>

        {/* Baixar todos */}
        <Button
          size="sm"
          onClick={handleExportAllThemes}
          disabled={isExporting}
          className="flex-1 gap-1.5 text-xs text-white"
          style={{ backgroundColor: '#F47920' }}
        >
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          Todos
        </Button>
      </div>

      {/* Hidden full-res DOM for all 4 themes */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden="true">
        {/* Theme 1 */}
        <div ref={t1r0} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AMStory1_T1_Curiosity data={data} photo={photos[0]} />
        </div>
        <div ref={t1r1} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AMStory1_T1_Reveal data={data} photos={photos} />
        </div>
        <div ref={t1r2} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AMStory1_T1_CTA data={data} photo={photos[photos.length - 1] ?? photos[0]} />
        </div>
        {/* Theme 2 */}
        <div ref={t2r0} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AMStory2_T2_Curiosity data={data} photo={photos[0]} />
        </div>
        <div ref={t2r1} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AMStory2_T2_Reveal data={data} photos={photos} />
        </div>
        <div ref={t2r2} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AMStory2_T2_CTA data={data} photo={photos[photos.length - 1] ?? photos[0]} />
        </div>
        {/* Theme 3 */}
        <div ref={t3r0} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AMStory3_T3_Curiosity data={data} photo={photos[0]} />
        </div>
        <div ref={t3r1} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AMStory3_T3_Reveal data={data} photos={photos} />
        </div>
        <div ref={t3r2} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AMStory3_T3_CTA data={data} photo={photos[photos.length - 1] ?? photos[0]} />
        </div>
        {/* Theme 4 — Padrão (5 slides) */}
        <div ref={t4r0} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AMStory4_T4_Slide1 data={data} photos={photos} />
        </div>
        <div ref={t4r1} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AMStory4_T4_Slide2 data={data} photo={photos[0]} />
        </div>
        <div ref={t4r2} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AMStory4_T4_Slide3 data={data} photo={photos[0]} />
        </div>
        <div ref={t4r3} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AMStory4_T4_Slide4 data={data} photos={photos} />
        </div>
        <div ref={t4r4} style={{ width: STORY_W, height: STORY_H, overflow: 'hidden' }}>
          <AMStory4_T4_Slide5 data={data} photo={photos[photos.length - 1] ?? photos[0]} />
        </div>
      </div>
    </div>
  );
}
