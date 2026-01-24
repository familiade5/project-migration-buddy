import { useState, useRef } from 'react';
import { PropertyData } from '@/types/property';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { Download, ChevronLeft, ChevronRight, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Feed components
import { EliteCover } from './feed/EliteCover';
import { EliteDetails } from './feed/EliteDetails';
import { EliteFeatures } from './feed/EliteFeatures';
import { EliteContact } from './feed/EliteContact';
import { ElitePhotoSlide } from './feed/ElitePhotoSlide';

// Story components
import { EliteCoverStory } from './story/EliteCoverStory';
import { EliteDetailsStory } from './story/EliteDetailsStory';
import { EliteFeaturesStory } from './story/EliteFeaturesStory';
import { EliteContactStory } from './story/EliteContactStory';
import { ElitePhotoStory } from './story/ElitePhotoStory';

// VDH components
import { EliteVDH1 } from './vdh/EliteVDH1';
import { EliteVDH2 } from './vdh/EliteVDH2';
import { EliteVDH3 } from './vdh/EliteVDH3';
import { EliteVDH4 } from './vdh/EliteVDH4';

interface ElitePostPreviewProps {
  data: PropertyData;
  photos: string[];
}

export const ElitePostPreview = ({ data, photos }: ElitePostPreviewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [format, setFormat] = useState<'feed' | 'story' | 'elite'>('feed');
  const [isExporting, setIsExporting] = useState(false);
  const postRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { toast } = useToast();

  // 10 slides for Feed: Capa, Detalhes, Diferenciais, 6 photo-only slides, Contato
  const feedPosts = [
    { name: 'Capa', component: EliteCover, photoIndex: 0 },
    { name: 'Detalhes', component: EliteDetails, photoIndex: 0 },
    { name: 'Diferenciais', component: EliteFeatures, photoIndex: 3 },
    { name: 'Galeria 1', component: ElitePhotoSlide, photoIndex: 4 },
    { name: 'Galeria 2', component: ElitePhotoSlide, photoIndex: 5 },
    { name: 'Galeria 3', component: ElitePhotoSlide, photoIndex: 6 },
    { name: 'Galeria 4', component: ElitePhotoSlide, photoIndex: 7 },
    { name: 'Galeria 5', component: ElitePhotoSlide, photoIndex: 8 },
    { name: 'Galeria 6', component: ElitePhotoSlide, photoIndex: 9 },
    { name: 'Contato', component: EliteContact, photoIndex: 0 },
  ];

  // 10 slides for Story
  const storyPosts = [
    { name: 'Capa', component: EliteCoverStory, photoIndex: 0 },
    { name: 'Detalhes', component: EliteDetailsStory, photoIndex: 0 },
    { name: 'Diferenciais', component: EliteFeaturesStory, photoIndex: 3 },
    { name: 'Galeria 1', component: ElitePhotoStory, photoIndex: 4 },
    { name: 'Galeria 2', component: ElitePhotoStory, photoIndex: 5 },
    { name: 'Galeria 3', component: ElitePhotoStory, photoIndex: 6 },
    { name: 'Galeria 4', component: ElitePhotoStory, photoIndex: 7 },
    { name: 'Galeria 5', component: ElitePhotoStory, photoIndex: 8 },
    { name: 'Galeria 6', component: ElitePhotoStory, photoIndex: 9 },
    { name: 'Contato', component: EliteContactStory, photoIndex: 0 },
  ];

  const elitePosts = [
    { name: 'Atração', component: EliteVDH1, photoIndex: 0 },
    { name: 'Benefícios', component: EliteVDH2, photoIndex: 1 },
    { name: 'Valores', component: EliteVDH3, photoIndex: 2 },
    { name: 'CTA', component: EliteVDH4, photoIndex: 3 },
  ];

  const posts = format === 'feed' ? feedPosts : format === 'story' ? storyPosts : elitePosts;

  const getPhoto = (index: number) => {
    if (photos.length === 0) return null;
    return photos[index % photos.length] || photos[0];
  };

  const handleExportSingle = async (index: number) => {
    const ref = postRefs.current[index];
    if (!ref) return;

    setIsExporting(true);
    try {
      const dataUrl = await toPng(ref, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `elite-${format}-${posts[index].name.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: "Imagem exportada!",
        description: `${posts[index].name} foi salvo com sucesso.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível exportar a imagem.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();

      for (let i = 0; i < posts.length; i++) {
        const ref = postRefs.current[i];
        if (ref) {
          const dataUrl = await toPng(ref, {
            quality: 1.0,
            pixelRatio: 2,
            cacheBust: true,
          });
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
          zip.file(`elite-${format}-${i + 1}-${posts[i].name.toLowerCase()}.png`, base64Data, { base64: true });
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `elite-${format}-completo.zip`;
      link.click();

      toast({
        title: "Pacote exportado!",
        description: `Todas as ${posts.length} imagens foram salvas.`,
      });
    } catch (error) {
      console.error('Export all error:', error);
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível exportar as imagens.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const CurrentComponent = posts[currentIndex].component;
  const currentPhoto = getPhoto(posts[currentIndex].photoIndex);

  // Calculate scale for preview
  const templateWidth = format === 'feed' ? 1080 : 1080;
  const templateHeight = format === 'feed' ? 1080 : 1920;
  const previewMaxWidth = 400;
  const scale = previewMaxWidth / templateWidth;

  return (
    <div className="space-y-6">
      {/* Format selector */}
      <div className="flex gap-2">
        {[
          { id: 'feed', label: 'Feed', icon: '📱' },
          { id: 'story', label: 'Story', icon: '📖' },
          { id: 'elite', label: 'Élite', icon: '👑' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => { setFormat(f.id as typeof format); setCurrentIndex(0); }}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all
              ${format === f.id 
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 shadow-lg shadow-amber-500/30' 
                : 'bg-white/5 text-white/70 hover:bg-white/10'
              }
            `}
          >
            <span>{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Export buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => handleExportSingle(currentIndex)}
          disabled={isExporting}
          className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 hover:from-amber-400 hover:to-yellow-400"
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exportando...' : 'Exportar atual'}
        </Button>
        <Button
          onClick={handleExportAll}
          disabled={isExporting}
          variant="outline"
          className="flex-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Exportar todos
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="p-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-400" />
          <span className="text-white font-medium">
            {posts[currentIndex].name}
          </span>
          <span className="text-white/50 text-sm">
            ({currentIndex + 1}/{posts.length})
          </span>
        </div>
        
        <button
          onClick={() => setCurrentIndex(i => Math.min(posts.length - 1, i + 1))}
          disabled={currentIndex === posts.length - 1}
          className="p-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Preview */}
      <div 
        className="relative mx-auto overflow-hidden rounded-2xl"
        style={{ 
          width: `${templateWidth * scale}px`,
          height: `${templateHeight * scale}px`,
          boxShadow: '0 25px 80px rgba(212,175,55,0.2)'
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: `${templateWidth}px`,
            height: `${templateHeight}px`,
          }}
        >
          <CurrentComponent
            data={data}
            photo={currentPhoto}
            photos={photos}
          />
        </div>
      </div>

      {/* Thumbnails - Scrollable for 10 slides */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-2 justify-start min-w-min px-1">
          {posts.map((post, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`
                flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-all
                ${currentIndex === index 
                  ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#0a0a0f] scale-110' 
                  : 'opacity-50 hover:opacity-80'
                }
              `}
            >
              <div 
                className="w-full h-full flex items-center justify-center text-[7px] font-medium text-center leading-tight p-1"
                style={{ 
                  background: 'linear-gradient(135deg, #1a1a1f, #0f0f14)',
                  color: '#d4af37'
                }}
              >
                {post.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Hidden export containers */}
      <div className="absolute -left-[9999px] opacity-0 pointer-events-none">
        {posts.map((post, index) => {
          const PostComponent = post.component;
          return (
            <div
              key={index}
              ref={(el) => { postRefs.current[index] = el; }}
            >
              <PostComponent
                data={data}
                photo={getPhoto(post.photoIndex)}
                photos={photos}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
