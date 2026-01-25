import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { Download, ChevronLeft, ChevronRight, Loader2, Square, Smartphone, Sparkles } from 'lucide-react';
import { PropertyData } from '@/types/property';
import { PostCover } from './posts/PostCover';
import { PostDetails } from './posts/PostDetails';
import { PostFeatures } from './posts/PostFeatures';
import { PostContact } from './posts/PostContact';
import { PostCoverStory } from './posts/story/PostCoverStory';
import { PostDetailsStory } from './posts/story/PostDetailsStory';
import { PostFeaturesStory } from './posts/story/PostFeaturesStory';
import { PostContactStory } from './posts/story/PostContactStory';
import { VDHStory1 } from './posts/story/VDHStory1';
import { VDHStory2 } from './posts/story/VDHStory2';
import { VDHStory3 } from './posts/story/VDHStory3';
import { VDHStory4 } from './posts/story/VDHStory4';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useActivityLog } from '@/hooks/useActivityLog';
import { createCrmPropertyFromCreative, copyImageToCrmStorage } from '@/services/crmIntegration';
import type { Json } from '@/integrations/supabase/types';

// Helper to convert data URL to Blob
const dataURLtoBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

// Upload image to Supabase storage
const uploadExportedImage = async (
  dataUrl: string, 
  userId: string, 
  creativeId: string, 
  index: number,
  format: 'feed' | 'story' | 'vdh'
): Promise<string> => {
  const blob = dataURLtoBlob(dataUrl);
  const fileName = `${userId}/${creativeId}/${format}-${index + 1}.png`;
  
  const { error } = await supabase.storage
    .from('exported-creatives')
    .upload(fileName, blob, {
      contentType: 'image/png',
      upsert: true,
    });
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('exported-creatives')
    .getPublicUrl(fileName);
  
  return publicUrl;
};

interface PostPreviewProps {
  data: PropertyData;
  photos: string[];
}

type FormatType = 'feed' | 'story' | 'vdh';

export const PostPreview = ({ data, photos }: PostPreviewProps) => {
  const [currentPost, setCurrentPost] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [format, setFormat] = useState<FormatType>('feed');
  
  const { user, profile } = useAuth();
  const { logActivity } = useActivityLog();
  
  // Refs para formato feed (1:1)
  const feedRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  // Refs para formato story (9:16)
  const storyRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  // Refs para formato VDH (9:16)
  const vdhRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  const feedPosts = [
    { name: 'Capa', component: PostCover, photoIndex: 0 },
    // Slide 2 (Detalhes) = características do imóvel
    { name: 'Detalhes', component: PostFeatures, photoIndex: 1 },
    // Slide 3 (Diferenciais) = gatilhos de conversão
    { name: 'Diferenciais', component: PostDetails, photoIndex: 2 },
    { name: 'Contato', component: PostContact, photoIndex: 3 },
  ];

  const storyPosts = [
    { name: 'Capa', component: PostCoverStory, photoIndex: 0 },
    // Slide 2 (Detalhes) = características do imóvel
    { name: 'Detalhes', component: PostFeaturesStory, photoIndex: 1 },
    // Slide 3 (Diferenciais) = gatilhos de conversão
    { name: 'Diferenciais', component: PostDetailsStory, photoIndex: 2 },
    { name: 'Contato', component: PostContactStory, photoIndex: 3 },
  ];

  const vdhPosts = [
    { name: 'Atração', component: VDHStory1, photoIndex: 0 },
    { name: 'Interesse', component: VDHStory2, photoIndex: 1 },
    { name: 'Decisão', component: VDHStory3, photoIndex: 2 },
    { name: 'Ação', component: VDHStory4, photoIndex: 3 },
  ];

  const posts = format === 'feed' ? feedPosts : format === 'story' ? storyPosts : vdhPosts;
  const postRefs = format === 'feed' ? feedRefs : format === 'story' ? storyRefs : vdhRefs;

  // Generate a title based on property data
  const generateTitle = () => {
    const type = data.type || 'Imóvel';
    const city = data.city || '';
    const neighborhood = data.neighborhood || '';
    const location = [neighborhood, city].filter(Boolean).join(' - ') || 'Sem localização';
    return `${type} - ${location}`;
  };

  // Save creative to database with exported images
  const saveCreativeWithExports = async (
    exportedImages: { dataUrl: string; format: 'feed' | 'story' | 'vdh'; index: number }[],
    exportFormat: 'feed' | 'story' | 'vdh' | 'both'
  ) => {
    if (!user) {
      toast.error('Você precisa estar logado para salvar');
      return null;
    }

    try {
      const title = generateTitle();
      
      // First, create the creative entry to get an ID
      const { data: creative, error } = await supabase
        .from('creatives')
        .insert({
          user_id: user.id,
          title,
          property_data: data as unknown as Json,
          photos,
          thumbnail_url: null,
          format: exportFormat,
        })
        .select()
        .single();

      if (error) throw error;

      // Upload all exported images to storage
      const uploadedUrls: string[] = [];
      for (const img of exportedImages) {
        const url = await uploadExportedImage(
          img.dataUrl, 
          user.id, 
          creative.id, 
          img.index,
          img.format
        );
        uploadedUrls.push(url);
      }

      // Update creative with exported image URLs and thumbnail
      const { error: updateError } = await supabase
        .from('creatives')
        .update({
          exported_images: uploadedUrls,
          thumbnail_url: uploadedUrls[0] || null,
        })
        .eq('id', creative.id);

      if (updateError) throw updateError;

      // Log the activity
      await logActivity('create_creative', 'creative', creative.id, {
        title,
        type: data.type,
        city: data.city,
        neighborhood: data.neighborhood,
        photos_count: photos.length,
        exported_count: uploadedUrls.length,
        format: exportFormat,
      });

      // CRM Integration: Create property entry with cover image
      if (uploadedUrls[0]) {
        // Generate a property code
        const propertyCode = `VDH-${creative.id.slice(0, 8).toUpperCase()}`;
        
        // Copy the cover image to permanent CRM storage
        const crmCoverUrl = await copyImageToCrmStorage(uploadedUrls[0], propertyCode);
        
        // Parse sale value from minimumValue
        const parseValue = (val: string): number => {
          if (!val) return 0;
          const numericStr = val.replace(/\D/g, '');
          return numericStr ? parseInt(numericStr, 10) / 100 : 0;
        };
        
        // Create CRM property entry
        await createCrmPropertyFromCreative({
          code: propertyCode,
          propertyType: mapPropertyType(data.type),
          city: data.city || 'Campo Grande',
          state: data.state || 'MS',
          neighborhood: data.neighborhood || undefined,
          saleValue: parseValue(data.minimumValue),
          coverImageUrl: crmCoverUrl || uploadedUrls[0],
          sourceCreativeId: creative.id,
          createdByUserId: user.id,
        });
      }

      return creative;
    } catch (error) {
      console.error('Error saving creative:', error);
      throw error;
    }
  };

  // Helper to map property type from PropertyData to CRM type
  const mapPropertyType = (type?: string): 'casa' | 'apartamento' | 'terreno' | 'comercial' | 'rural' | 'outro' => {
    if (!type) return 'casa';
    const lower = type.toLowerCase();
    if (lower.includes('casa')) return 'casa';
    if (lower.includes('apart')) return 'apartamento';
    if (lower.includes('terr') || lower.includes('lote')) return 'terreno';
    if (lower.includes('comercial') || lower.includes('sala') || lower.includes('loja')) return 'comercial';
    if (lower.includes('rural') || lower.includes('chac') || lower.includes('sitio') || lower.includes('fazenda')) return 'rural';
    return 'outro';
  };

  const handleExportSingle = async (index: number) => {
    const ref = postRefs[index];
    if (!ref.current) return;

    try {
      setIsExporting(true);
      const dataUrl = await toPng(ref.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement('a');
      const formatSuffix = format;
      link.download = `post-${index + 1}-${posts[index].name.toLowerCase()}-${formatSuffix}.png`;
      link.href = dataUrl;
      link.click();

      // Save to library automatically with the exported image
      await saveCreativeWithExports([{ dataUrl, format, index }], format);

      toast.success(`Post exportado e salvo na biblioteca!`);
    } catch (error) {
      toast.error('Erro ao exportar imagem');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const formatSuffix = format;
      const currentRefs = format === 'feed' ? feedRefs : format === 'story' ? storyRefs : vdhRefs;
      const currentPosts = format === 'feed' ? feedPosts : format === 'story' ? storyPosts : vdhPosts;
      const exportedImages: { dataUrl: string; format: 'feed' | 'story' | 'vdh'; index: number }[] = [];

      // Generate all images
      const allDataUrls: string[] = [];
      for (let i = 0; i < currentRefs.length; i++) {
        const ref = currentRefs[i];
        if (!ref.current) continue;

        const dataUrl = await toPng(ref.current, {
          quality: 1,
          pixelRatio: 2,
          cacheBust: true,
        });

        allDataUrls.push(dataUrl);
        exportedImages.push({ dataUrl, format, index: i });
      }

      // Download: for VDH, use a ZIP to avoid browser blocking multiple downloads
      if (format === 'vdh') {
        const zip = new JSZip();
        for (let i = 0; i < allDataUrls.length; i++) {
          const res = await fetch(allDataUrls[i]);
          const blob = await res.blob();
          const filename = `post-${i + 1}-${currentPosts[i].name.toLowerCase()}-${formatSuffix}.png`;
          zip.file(filename, blob);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `posts-${formatSuffix}.zip`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // Then download all of them (feed/story)
        for (let i = 0; i < allDataUrls.length; i++) {
          const link = document.createElement('a');
          link.download = `post-${i + 1}-${currentPosts[i].name.toLowerCase()}-${formatSuffix}.png`;
          link.href = allDataUrls[i];
          link.click();

          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      // Save to library with all exported images
      await saveCreativeWithExports(exportedImages, format);

      const formatLabel = format === 'feed' ? 'Feed' : format === 'story' ? 'Story' : 'VDH';
      toast.success(`Todos os posts (${formatLabel}) exportados e salvos!`);
    } catch (error) {
      toast.error('Erro ao exportar imagens');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportBothFormats = async () => {
    setIsExporting(true);
    try {
      const exportedImages: { dataUrl: string; format: 'feed' | 'story' | 'vdh'; index: number }[] = [];
      
      // Exportar formato feed
      for (let i = 0; i < feedRefs.length; i++) {
        const ref = feedRefs[i];
        if (!ref.current) continue;

        const dataUrl = await toPng(ref.current, {
          quality: 1,
          pixelRatio: 2,
          cacheBust: true,
        });
        
        exportedImages.push({ dataUrl, format: 'feed', index: i });
        
        const link = document.createElement('a');
        link.download = `post-${i + 1}-${feedPosts[i].name.toLowerCase()}-feed.png`;
        link.href = dataUrl;
        link.click();
        
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Exportar formato story
      for (let i = 0; i < storyRefs.length; i++) {
        const ref = storyRefs[i];
        if (!ref.current) continue;

        const dataUrl = await toPng(ref.current, {
          quality: 1,
          pixelRatio: 2,
          cacheBust: true,
        });
        
        exportedImages.push({ dataUrl, format: 'story', index: i });
        
        const link = document.createElement('a');
        link.download = `post-${i + 1}-${storyPosts[i].name.toLowerCase()}-story.png`;
        link.href = dataUrl;
        link.click();
        
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Save to library with all exported images
      await saveCreativeWithExports(exportedImages, 'both');

      toast.success('Todos os 8 posts (Feed + Story) exportados e salvos!');
    } catch (error) {
      toast.error('Erro ao exportar imagens');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const CurrentPostComponent = posts[currentPost].component;
  const currentPhoto = photos[posts[currentPost].photoIndex] || photos[0] || null;

  return (
    <div className="space-y-4 sm:space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="font-display text-base sm:text-lg text-gold">Preview do Carrossel</h3>
        
        {/* Seletor de formato */}
        <div className="flex items-center gap-1 bg-surface rounded-lg p-1 self-start">
          <button
            onClick={() => { setFormat('feed'); setCurrentPost(0); }}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm transition-all ${
              format === 'feed'
                ? 'bg-gold text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Square className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Feed</span>
          </button>
          <button
            onClick={() => { setFormat('story'); setCurrentPost(0); }}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm transition-all ${
              format === 'story'
                ? 'bg-gold text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Story</span>
          </button>
          <button
            onClick={() => { setFormat('vdh'); setCurrentPost(0); }}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm transition-all ${
              format === 'vdh'
                ? 'bg-gold text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>VDH</span>
          </button>
        </div>
      </div>

      {/* Botões de exportação */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={handleExportAll}
          disabled={isExporting}
          variant="outline"
          className="gap-2 flex-1 text-xs sm:text-sm"
          size="sm"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Exportar {format === 'feed' ? 'Feed (4)' : format === 'story' ? 'Stories (4)' : 'VDH (4)'}
        </Button>
        <Button
          onClick={handleExportBothFormats}
          disabled={isExporting}
          className="bg-gold hover:bg-gold-dark text-primary-foreground gap-2 flex-1 text-xs sm:text-sm"
          size="sm"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Exportar Tudo (8)
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        ✓ Os posts são salvos automaticamente na biblioteca ao exportar
      </p>

      {/* Post Navigation */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
        {posts.map((post, index) => (
          <button
            key={index}
            onClick={() => setCurrentPost(index)}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm transition-all ${
              currentPost === index
                ? 'bg-gold text-primary-foreground'
                : 'bg-surface text-muted-foreground hover:bg-surface-elevated'
            }`}
          >
            {post.name}
          </button>
        ))}
      </div>

      {/* Current Post Preview - Responsive Container */}
      <div className="relative">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <button
            onClick={() => setCurrentPost((prev) => (prev === 0 ? 3 : prev - 1))}
            className="p-1.5 sm:p-2 rounded-full bg-surface hover:bg-surface-elevated transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </button>

          {/* Preview container with proper scaling */}
          <div 
            className="relative rounded-xl overflow-hidden shadow-2xl flex-shrink-0"
            style={{ 
              width: format === 'feed' ? '280px' : '180px',
              height: format === 'feed' ? '280px' : '320px',
            }}
          >
            <div 
              className="origin-top-left"
              style={{ 
                width: format === 'feed' ? '1080px' : '1080px',
                height: format === 'feed' ? '1080px' : '1920px',
                transform: format === 'feed' 
                  ? 'scale(0.2593)' 
                  : 'scale(0.1667)'
              }}
            >
              <div ref={postRefs[currentPost]}>
                <CurrentPostComponent data={data} photo={currentPhoto} photos={photos} />
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentPost((prev) => (prev === 3 ? 0 : prev + 1))}
            className="p-1.5 sm:p-2 rounded-full bg-surface hover:bg-surface-elevated transition-colors flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Export single button */}
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportSingle(currentPost)}
            disabled={isExporting}
            className="gap-2 text-xs sm:text-sm"
          >
            <Download className="w-4 h-4" />
            Exportar este post
          </Button>
        </div>
      </div>

      {/* All Posts Grid (hidden, used for export) - FEED */}
      <div className="fixed -left-[9999px] top-0">
        {feedPosts.map((Post, index) => (
          <div key={`feed-${index}`} ref={feedRefs[index]}>
            <Post.component data={data} photo={photos[index] || photos[0] || null} photos={photos} />
          </div>
        ))}
      </div>

      {/* All Posts Grid (hidden, used for export) - STORY */}
      <div className="fixed -left-[9999px] top-0">
        {storyPosts.map((Post, index) => (
          <div key={`story-${index}`} ref={storyRefs[index]}>
            <Post.component data={data} photo={photos[index] || photos[0] || null} photos={photos} />
          </div>
        ))}
      </div>

      {/* All Posts Grid (hidden, used for export) - VDH */}
      <div className="fixed -left-[9999px] top-0">
        {vdhPosts.map((Post, index) => (
          <div key={`vdh-${index}`} ref={vdhRefs[index]}>
            <Post.component data={data} photo={photos[index] || photos[0] || null} photos={photos} />
          </div>
        ))}
      </div>

      {/* Thumbnails - Hidden on mobile */}
      <div className="hidden sm:grid grid-cols-4 gap-2">
        {posts.map((Post, index) => (
          <button
            key={index}
            onClick={() => setCurrentPost(index)}
            className={`relative rounded-lg overflow-hidden transition-all ${
              currentPost === index
                ? 'ring-2 ring-gold ring-offset-2 ring-offset-background'
                : 'opacity-60 hover:opacity-100'
            }`}
            style={{ 
              width: format === 'feed' ? '80px' : '54px',
              height: format === 'feed' ? '80px' : '96px'
            }}
          >
            <div 
              className="origin-top-left" 
              style={{ 
                transform: format === 'feed' ? 'scale(0.074)' : 'scale(0.05)', 
                width: '1080px',
                height: format === 'feed' ? '1080px' : '1920px'
              }}
            >
              <Post.component data={data} photo={photos[index] || photos[0] || null} photos={photos} />
            </div>
          </button>
        ))}
      </div>

      {/* Info sobre formatos */}
      <div className="text-center text-xs text-muted-foreground">
        <p>📱 <strong>Feed:</strong> 1:1 • <strong>Story:</strong> 9:16</p>
      </div>
    </div>
  );
};
