import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { safePixelRatio } from '@/lib/exportUtils';
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
  
  // Export refs — ONLY used by the hidden off-screen slides, never shared with the preview
  const feedRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const storyRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const vdhRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  // Preview ref — separate, never used for export
  const previewRef = useRef<HTMLDivElement>(null);

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
  // postRefs used ONLY for export single (hidden slides) — previewRef is separate
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
      // Render twice for Safari/iPad (first pass loads images, second captures correctly)
      await toPng(ref.current, { quality: 1, pixelRatio: 2, cacheBust: true });
      const dataUrl = await toPng(ref.current, { quality: 1, pixelRatio: 2, cacheBust: true });

      const link = document.createElement('a');
      link.download = `post-${index + 1}-${posts[index].name.toLowerCase()}-${format}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      await saveCreativeWithExports([{ dataUrl, format, index }], format);
      toast.success(`Post exportado e salvo na biblioteca!`);
    } catch (error) {
      toast.error('Erro ao exportar imagem');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  // Helper: download all as ZIP (compatible with Safari/iPad)
  const downloadAsZip = async (
    dataUrls: string[],
    labels: string[],
    zipName: string
  ) => {
    const zip = new JSZip();
    for (let i = 0; i < dataUrls.length; i++) {
      const base64 = dataUrls[i].split(',')[1];
      zip.file(`${i + 1}-${labels[i]}.png`, base64, { base64: true });
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = zipName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const currentRefs = format === 'feed' ? feedRefs : format === 'story' ? storyRefs : vdhRefs;
      const currentPosts = format === 'feed' ? feedPosts : format === 'story' ? storyPosts : vdhPosts;
      const exportedImages: { dataUrl: string; format: 'feed' | 'story' | 'vdh'; index: number }[] = [];
      const allDataUrls: string[] = [];

      for (let i = 0; i < currentRefs.length; i++) {
        const ref = currentRefs[i];
        if (!ref.current) continue;
        // Render twice to ensure images are fully loaded (Safari fix)
        await toPng(ref.current, { quality: 1, pixelRatio: 2, cacheBust: true });
        const dataUrl = await toPng(ref.current, { quality: 1, pixelRatio: 2, cacheBust: true });
        allDataUrls.push(dataUrl);
        exportedImages.push({ dataUrl, format, index: i });
      }

      const labels = currentPosts.map(p => p.name.toLowerCase());
      const formatLabel = format === 'feed' ? 'Feed' : format === 'story' ? 'Story' : 'VDH';
      await downloadAsZip(allDataUrls, labels, `posts-${format}.zip`);

      await saveCreativeWithExports(exportedImages, format);
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
      const allDataUrls: string[] = [];
      const allLabels: string[] = [];

      // Render feed slides (double-render for Safari fix)
      for (let i = 0; i < feedRefs.length; i++) {
        const ref = feedRefs[i];
        if (!ref.current) continue;
        await toPng(ref.current, { quality: 1, pixelRatio: 2, cacheBust: true });
        const dataUrl = await toPng(ref.current, { quality: 1, pixelRatio: 2, cacheBust: true });
        exportedImages.push({ dataUrl, format: 'feed', index: i });
        allDataUrls.push(dataUrl);
        allLabels.push(`feed-${feedPosts[i].name.toLowerCase()}`);
      }

      // Render story slides (double-render for Safari fix)
      for (let i = 0; i < storyRefs.length; i++) {
        const ref = storyRefs[i];
        if (!ref.current) continue;
        await toPng(ref.current, { quality: 1, pixelRatio: 2, cacheBust: true });
        const dataUrl = await toPng(ref.current, { quality: 1, pixelRatio: 2, cacheBust: true });
        exportedImages.push({ dataUrl, format: 'story', index: i });
        allDataUrls.push(dataUrl);
        allLabels.push(`story-${storyPosts[i].name.toLowerCase()}`);
      }

      await downloadAsZip(allDataUrls, allLabels, 'posts-feed-story.zip');
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
        <h3 className="font-semibold text-base sm:text-lg text-gray-800">Preview do Carrossel</h3>
        
        {/* Seletor de formato */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 self-start border border-gray-200">
          <button
            onClick={() => { setFormat('feed'); setCurrentPost(0); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              format === 'feed'
                ? 'text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={format === 'feed' ? { backgroundColor: '#1a3a6b' } : {}}
          >
            <Square className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Feed</span>
          </button>
          <button
            onClick={() => { setFormat('story'); setCurrentPost(0); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              format === 'story'
                ? 'text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={format === 'story' ? { backgroundColor: '#1a3a6b' } : {}}
          >
            <Smartphone className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Story</span>
          </button>
          <button
            onClick={() => { setFormat('vdh'); setCurrentPost(0); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              format === 'vdh'
                ? 'text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={format === 'vdh' ? { backgroundColor: '#1a3a6b' } : {}}
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>VDH</span>
          </button>
        </div>
      </div>

      {/* Botões de exportação */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleExportAll}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: '#1a3a6b' }}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Exportar {format === 'feed' ? 'Feed (4)' : format === 'story' ? 'Stories (4)' : 'VDH (4)'}
        </button>
        <button
          onClick={handleExportBothFormats}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: '#c9a84c' }}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Exportar Tudo (8)
        </button>
      </div>
      
      <p className="text-xs text-gray-400 text-center">
        ✓ Os posts são salvos automaticamente na biblioteca ao exportar
      </p>

      {/* Post Navigation */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
        {posts.map((post, index) => (
          <button
            key={index}
            onClick={() => setCurrentPost(index)}
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all border ${
              currentPost === index
                ? 'text-white border-transparent'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
            }`}
            style={currentPost === index ? { backgroundColor: '#c9a84c', borderColor: '#c9a84c' } : {}}
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
            className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex-shrink-0 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>

          {/* Preview container with proper scaling */}
          <div 
            className="relative rounded-xl overflow-hidden flex-shrink-0"
            style={{ 
              width: format === 'feed' ? '280px' : '180px',
              height: format === 'feed' ? '280px' : '320px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
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
              <div ref={previewRef}>
                <CurrentPostComponent data={data} photo={currentPhoto} photos={photos} />
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentPost((prev) => (prev === 3 ? 0 : prev + 1))}
            className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex-shrink-0 shadow-sm"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>

        {/* Export single button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handleExportSingle(currentPost)}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 shadow-sm"
            style={{ backgroundColor: '#1a3a6b' }}
          >
            <Download className="w-4 h-4" />
            Exportar este post
          </button>
        </div>
      </div>

      {/*
        Hidden export slides — iOS/WebKit fix:
        - NO overflow:hidden on parent (clipping breaks canvas capture on iOS)
        - NO position:fixed (iOS doesn't paint fixed elements off-viewport)
        - opacity:0 + pointer-events:none + aria-hidden keeps them invisible but fully painted
        - Each ref is UNIQUE (never shared with the preview ref above)
      */}
      <div aria-hidden="true" style={{ opacity: 0, pointerEvents: 'none', position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
        {feedPosts.map((Post, index) => (
          <div key={`feed-export-${index}`} ref={feedRefs[index]}>
            <Post.component data={data} photo={photos[Post.photoIndex] || photos[0] || null} photos={photos} />
          </div>
        ))}
        {storyPosts.map((Post, index) => (
          <div key={`story-export-${index}`} ref={storyRefs[index]}>
            <Post.component data={data} photo={photos[Post.photoIndex] || photos[0] || null} photos={photos} />
          </div>
        ))}
        {vdhPosts.map((Post, index) => (
          <div key={`vdh-export-${index}`} ref={vdhRefs[index]}>
            <Post.component data={data} photo={photos[Post.photoIndex] || photos[0] || null} photos={photos} />
          </div>
        ))}
      </div>

      {/* Thumbnails - Hidden on mobile */}
      <div className="hidden sm:flex gap-2 justify-center">
        {posts.map((Post, index) => (
          <button
            key={index}
            onClick={() => setCurrentPost(index)}
            className={`relative rounded-lg overflow-hidden transition-all flex-shrink-0 ${
              currentPost === index
                ? 'ring-2 ring-offset-2'
                : 'opacity-60 hover:opacity-100'
            }`}
            style={{ 
              width: format === 'feed' ? '80px' : '54px',
              height: format === 'feed' ? '80px' : '96px',
              ...(currentPost === index ? { '--tw-ring-color': '#c9a84c' } as React.CSSProperties : {})
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
      <div className="text-center text-xs text-gray-400">
        <p>📱 <strong>Feed:</strong> 1:1 • <strong>Story:</strong> 9:16</p>
      </div>
    </div>
  );
};
