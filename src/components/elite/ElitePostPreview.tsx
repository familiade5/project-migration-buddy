import { useState, useRef } from 'react';
import { PropertyData } from '@/types/property';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { Download, ChevronLeft, ChevronRight, Sparkles, LayoutGrid, Smartphone, Crown } from 'lucide-react';
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
      link.download = `patrimoniar-${format}-${posts[index].name.toLowerCase()}.png`;
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
          zip.file(`patrimoniar-${format}-${i + 1}-${posts[i].name.toLowerCase()}.png`, base64Data, { base64: true });
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `patrimoniar-${format}-completo.zip`;
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
  const templateWidth = 1080;
  const templateHeight = format === 'feed' ? 1080 : format === 'elite' ? 1920 : 1920;
  const previewMaxWidth = 360;
  const scale = previewMaxWidth / templateWidth;

  return (
    <div className="space-y-5">
      {/* Format selector */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
        {[
          { id: 'feed', label: 'Feed', icon: LayoutGrid },
          { id: 'story', label: 'Story', icon: Smartphone },
          { id: 'elite', label: 'Premium', icon: Crown },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => { setFormat(f.id as typeof format); setCurrentIndex(0); }}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all
              ${format === f.id 
                ? 'bg-gray-900 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }
            `}
          >
            <f.icon className="w-4 h-4" />
            {f.label}
          </button>
        ))}
      </div>

      {/* Export buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => handleExportSingle(currentIndex)}
          disabled={isExporting}
          className="flex-1 bg-gray-900 hover:bg-gray-800 text-white shadow-md"
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exportando...' : 'Exportar atual'}
        </Button>
        <Button
          onClick={handleExportAll}
          disabled={isExporting}
          variant="outline"
          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Exportar todos
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between bg-gray-100 rounded-xl px-4 py-3">
        <button
          onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">
            {posts[currentIndex].name}
          </span>
          <span className="text-gray-500 text-sm">
            ({currentIndex + 1}/{posts.length})
          </span>
        </div>
        
        <button
          onClick={() => setCurrentIndex(i => Math.min(posts.length - 1, i + 1))}
          disabled={currentIndex === posts.length - 1}
          className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Preview */}
      <div 
        className="relative mx-auto rounded-2xl bg-gray-900 shadow-2xl overflow-hidden"
        style={{ 
          width: Math.floor(templateWidth * scale),
          height: Math.floor(templateHeight * scale),
        }}
      >
        <div
          style={{
            width: templateWidth,
            height: templateHeight,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <CurrentComponent
            data={data}
            photo={currentPhoto}
            photos={photos}
          />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex gap-2 min-w-min">
          {posts.map((post, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`
                flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden transition-all border-2
                ${currentIndex === index 
                  ? 'border-gray-900 shadow-lg scale-105' 
                  : 'border-transparent opacity-60 hover:opacity-100'
                }
              `}
            >
              <div 
                className="w-full h-full flex items-center justify-center text-[8px] font-semibold text-center leading-tight p-1 bg-gray-200 text-gray-700"
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
