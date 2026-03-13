/**
 * AMStoriesPreview — Seletor de 3 temas com 3 stories cada
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

const STORY_W = 360;
const STORY_H = 640;
const MAX_REFS = 3;

interface AMStoriesPreviewProps {
  data: AMPropertyData;
  photos: string[];
}

type ThemeId = 1 | 2 | 3;

const THEMES = [
  {
    id: 1 as ThemeId,
    name: 'Enigma',
    description: 'Dark & Misterioso',
    emoji: '🌑',
    accent: '#1B5EA6',
    gradient: 'linear-gradient(135deg, #0a0f1e, #1B5EA6)',
  },
  {
    id: 2 as ThemeId,
    name: 'Clean Luxury',
    description: 'Branco & Sofisticado',
    emoji: '✨',
    accent: '#F47920',
    gradient: 'linear-gradient(135deg, #ffffff, #f0f6ff)',
  },
  {
    id: 3 as ThemeId,
    name: 'Urgência',
    description: 'Dramático & Impactante',
    emoji: '🔥',
    accent: '#F47920',
    gradient: 'linear-gradient(135deg, #0c0c0c, #7c2d12)',
  },
] as const;

const STORY_LABELS = ['Curiosidade', 'Imóvel', 'CTA'];

export function AMStoriesPreview({ data, photos }: AMStoriesPreviewProps) {
  const [activeTheme, setActiveTheme] = useState<ThemeId>(1);
  const [currentStory, setCurrentStory] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  // Fixed ref pool — 3 refs per theme × 3 themes = 9 refs
  const t1r0 = useRef<HTMLDivElement>(null);
  const t1r1 = useRef<HTMLDivElement>(null);
  const t1r2 = useRef<HTMLDivElement>(null);
  const t2r0 = useRef<HTMLDivElement>(null);
  const t2r1 = useRef<HTMLDivElement>(null);
  const t2r2 = useRef<HTMLDivElement>(null);
  const t3r0 = useRef<HTMLDivElement>(null);
  const t3r1 = useRef<HTMLDivElement>(null);
  const t3r2 = useRef<HTMLDivElement>(null);

  const refsByTheme = {
    1: [t1r0, t1r1, t1r2],
    2: [t2r0, t2r1, t2r2],
    3: [t3r0, t3r1, t3r2],
  };

  const p0 = photos[0];
  const pLast = photos[photos.length - 1] ?? photos[0];

  // Slides content per theme
  const slidesByTheme = {
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
  };

  const currentSlides = slidesByTheme[activeTheme];
  const currentRefs = refsByTheme[activeTheme];

  // Preview scale — story is 360×640, preview container ~220×390
  const previewW = 200;
  const previewH = 356;
  const previewScale = previewW / STORY_W;

  // Thumb scale
  const thumbW = 64;
  const thumbH = 114;
  const thumbScale = thumbW / STORY_W;

  const captureRef = async (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return null;
    return toPng(ref.current, { quality: 1, pixelRatio: 3, cacheBust: true });
  };

  const handleExportTheme = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      const themeName = THEMES.find((t) => t.id === activeTheme)?.name ?? `tema${activeTheme}`;
      const folder = zip.folder(`stories-${themeName}`) as JSZip;

      for (let i = 0; i < MAX_REFS; i++) {
        const url = await captureRef(currentRefs[i]);
        if (!url) continue;
        folder.file(
          `${String(i + 1).padStart(2, '0')}-${STORY_LABELS[i].toLowerCase()}.png`,
          url.split(',')[1],
          { base64: true },
        );
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `stories-${themeName}-${data.title || 'imovel'}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
      toast.success(`3 stories exportados!`);
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
        for (let i = 0; i < MAX_REFS; i++) {
          const url = await captureRef(refs[i]);
          if (!url) continue;
          folder.file(
            `${String(i + 1).padStart(2, '0')}-${STORY_LABELS[i].toLowerCase()}.png`,
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
      toast.success('9 stories (3 temas) exportados!');
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

      {/* Theme selector */}
      <div className="grid grid-cols-3 gap-2">
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
            <p style={{ fontSize: 18, margin: '0 0 4px', textAlign: 'center' }}>{theme.emoji}</p>
            <p style={{
              color: theme.id === 2 ? '#0f172a' : 'white',
              fontSize: 11, fontWeight: 700, margin: '0 0 2px', textAlign: 'center',
            }}>
              {theme.name}
            </p>
            <p style={{
              color: theme.id === 2 ? '#64748b' : 'rgba(255,255,255,0.65)',
              fontSize: 9, margin: 0, textAlign: 'center',
            }}>
              {theme.description}
            </p>
          </button>
        ))}
      </div>

      {/* Story step pills */}
      <div className="flex gap-2">
        {STORY_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => setCurrentStory(i)}
            className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              backgroundColor: currentStory === i ? '#1B5EA6' : '#F3F4F6',
              color: currentStory === i ? 'white' : '#6B7280',
            }}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {/* Main preview */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setCurrentStory((s) => (s === 0 ? 2 : s - 1))}
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
            {currentSlides[currentStory]}
          </div>
        </div>

        <button
          onClick={() => setCurrentStory((s) => (s === 2 ? 0 : s + 1))}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
        >
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 justify-center">
        {STORY_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => setCurrentStory(i)}
            className="relative rounded-lg overflow-hidden flex-shrink-0 transition-all"
            style={{
              width: thumbW, height: thumbH,
              outline: currentStory === i ? '2px solid #1B5EA6' : '2px solid transparent',
              outlineOffset: '2px',
              opacity: currentStory === i ? 1 : 0.55,
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
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportTheme}
          disabled={isExporting}
          className="flex-1 gap-1.5 text-xs"
        >
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          Exportar tema {activeTheme}
        </Button>
        <Button
          size="sm"
          onClick={handleExportAllThemes}
          disabled={isExporting}
          className="flex-1 gap-1.5 text-xs text-white"
          style={{ backgroundColor: '#F47920' }}
        >
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          Todos (9)
        </Button>
      </div>

      {/* Hidden full-res DOM for all 3 themes */}
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
      </div>
    </div>
  );
}
