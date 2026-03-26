import { useRef, useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { toPng } from 'html-to-image';
import { safePixelRatio, isIOS } from '@/lib/exportUtils';
import JSZip from 'jszip';
import { Download, ChevronLeft, ChevronRight, Loader2, Square, Smartphone, Sparkles } from 'lucide-react';
import { PropertyData } from '@/types/property';
import { PostCover } from './posts/PostCover';
import { PostDetails } from './posts/PostDetails';
import { PostFeatures } from './posts/PostFeatures';
import { PostContact } from './posts/PostContact';
import { VDHFeedPhotoSlide } from './posts/VDHFeedPhotoSlide';
import { PostCoverStory } from './posts/story/PostCoverStory';
import { PostDetailsStory } from './posts/story/PostDetailsStory';
import { PostFeaturesStory } from './posts/story/PostFeaturesStory';
import { PostContactStory } from './posts/story/PostContactStory';
import { VDHStory1 } from './posts/story/VDHStory1';
import { VDHStory2 } from './posts/story/VDHStory2';
import { VDHStory3 } from './posts/story/VDHStory3';
import { VDHStory4 } from './posts/story/VDHStory4';
import { VDHPhotoSlide } from './posts/story/VDHPhotoSlide';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useActivityLog } from '@/hooks/useActivityLog';
import { createCrmPropertyFromCreative, copyImageToCrmStorage } from '@/services/crmIntegration';
import type { Json } from '@/integrations/supabase/types';

// ── iOS CORS fix: convert external URLs to base64 data URLs ──────────────────
const toBase64Url = async (url: string): Promise<string> => {
  if (!url || url.startsWith('data:') || url.startsWith('blob:')) return url;
  try {
    const response = await fetch(url, { cache: 'force-cache' });
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return url; // fallback to original
  }
};

const getPhotosForExport = async (photos: string[]): Promise<string[]> => {
  if (!isIOS()) return photos;
  return Promise.all(photos.map(toBase64Url));
};

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
  const [exportSlideEl, setExportSlideEl] = useState<React.ReactNode>(null);

  const { user } = useAuth();
  const { logActivity } = useActivityLog();

  // Single export ref — content is swapped per capture (iOS-safe approach)
  const exportRef = useRef<HTMLDivElement>(null);

  // ── Slide definitions (DO NOT change order) ──────────────────────────────
  type SlideEntry = { name: string; component: React.ComponentType<any>; photoIndex: number; slideIndex?: number };

  const feedPosts: SlideEntry[] = [
    { name: 'Capa',         component: PostCover,    photoIndex: 0 },
    { name: 'Detalhes',     component: PostFeatures, photoIndex: 1 },
    { name: 'Diferenciais', component: PostDetails,  photoIndex: 2 },
    { name: 'Contato',      component: PostContact,  photoIndex: 3 },
  ];

  const storyPosts: SlideEntry[] = [
    { name: 'Capa',         component: PostCoverStory,    photoIndex: 0 },
    { name: 'Detalhes',     component: PostFeaturesStory, photoIndex: 1 },
    { name: 'Diferenciais', component: PostDetailsStory,  photoIndex: 2 },
    { name: 'Contato',      component: PostContactStory,  photoIndex: 3 },
  ];

  const extraSlideNames = ['Destaque', 'Ambiente', 'Detalhes', 'Lifestyle', 'Premium', 'Exclusivo'];

  const vdhPosts: SlideEntry[] = [
    { name: 'Atração', component: VDHStory1, photoIndex: 0 },
    { name: 'Interesse', component: VDHStory2, photoIndex: 1 },
    { name: 'Decisão', component: VDHStory3, photoIndex: 2 },
    { name: 'Ação', component: VDHStory4, photoIndex: 3 },
    ...Array.from({ length: Math.max(0, Math.min(photos.length - 4, 6)) }, (_, i) => ({
      name: extraSlideNames[i],
      component: VDHPhotoSlide,
      photoIndex: 4 + i,
      slideIndex: 4 + i,
    })),
  ];

  const posts = format === 'feed' ? feedPosts : format === 'story' ? storyPosts : vdhPosts;

  // Generate a title based on property data
  const generateTitle = () => {
    const type = data.type || 'Imóvel';
    const city = data.city || '';
    const neighborhood = data.neighborhood || '';
    const location = [neighborhood, city].filter(Boolean).join(' - ') || 'Sem localização';
    return `${type} - ${location}`;
  };

  // ── Core capture function (iOS-safe) ─────────────────────────────────────
  // Renders one slide at a time into the single exportRef, waits for images, captures.
  const captureSlide = async (
    Component: React.ComponentType<any>,
    photo: string | null,
    allPhotos: string[],
    extraProps?: { slideIndex?: number; totalSlides?: number },
  ): Promise<string> => {
    // First: clear previous content so WebKit re-paints fresh
    if (isIOS()) {
      flushSync(() => setExportSlideEl(null));
      await new Promise(r => setTimeout(r, 150));
    }

    // Synchronously update the hidden export element content
    flushSync(() => {
      setExportSlideEl(
        <Component data={data} photo={photo} photos={allPhotos} {...extraProps} />
      );
    });

    // Allow browser to paint + logo base64 fetch to complete
    // iOS needs extra time on subsequent exports (image cache may be stale)
    await new Promise(r => setTimeout(r, isIOS() ? 1200 : 400));

    // Retry waiting for ref up to 3x on iOS in case WebKit is slow to mount
    if (isIOS()) {
      for (let attempt = 0; attempt < 3; attempt++) {
        if (exportRef.current) break;
        await new Promise(r => setTimeout(r, 300));
      }
    }

    if (!exportRef.current) throw new Error('exportRef not mounted');

    // On iOS: first render primes the image cache, second render captures correctly
    if (isIOS()) {
      try {
        await toPng(exportRef.current, { quality: 1, pixelRatio: 1, cacheBust: true });
      } catch {
        // ignore prime errors
      }
      await new Promise(r => setTimeout(r, 400));
    }

    return toPng(exportRef.current, { quality: 1, pixelRatio: safePixelRatio(), cacheBust: true });
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

      const uploadedUrls: string[] = [];
      for (const img of exportedImages) {
        const url = await uploadExportedImage(img.dataUrl, user.id, creative.id, img.index, img.format);
        uploadedUrls.push(url);
      }

      await supabase
        .from('creatives')
        .update({ exported_images: uploadedUrls, thumbnail_url: uploadedUrls[0] || null })
        .eq('id', creative.id);

      await logActivity('create_creative', 'creative', creative.id, {
        title, type: data.type, city: data.city, neighborhood: data.neighborhood,
        photos_count: photos.length, exported_count: uploadedUrls.length, format: exportFormat,
      });

      if (uploadedUrls[0]) {
        const propertyCode = `VDH-${creative.id.slice(0, 8).toUpperCase()}`;
        const crmCoverUrl = await copyImageToCrmStorage(uploadedUrls[0], propertyCode);
        const parseValue = (val: string): number => {
          if (!val) return 0;
          const numericStr = val.replace(/\D/g, '');
          return numericStr ? parseInt(numericStr, 10) / 100 : 0;
        };
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

  // Helper: download all as ZIP
  const downloadAsZip = async (dataUrls: string[], labels: string[], zipName: string) => {
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

  const handleExportSingle = async (index: number) => {
    try {
      setIsExporting(true);
      const exportPhotos = await getPhotosForExport(photos);
      const post = posts[index];
      const photo = exportPhotos[post.photoIndex] || exportPhotos[0] || null;
      const dataUrl = await captureSlide(post.component, photo, exportPhotos, { slideIndex: post.slideIndex, totalSlides: posts.length });

      const link = document.createElement('a');
      link.download = `post-${index + 1}-${post.name.toLowerCase()}-${format}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      await saveCreativeWithExports([{ dataUrl, format, index }], format);
      toast.success('Post exportado e salvo na biblioteca!');
    } catch (error) {
      toast.error('Erro ao exportar imagem');
      console.error(error);
    } finally {
      setIsExporting(false);
      setExportSlideEl(null);
    }
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const currentPosts = format === 'feed' ? feedPosts : format === 'story' ? storyPosts : vdhPosts;
      const exportPhotos = await getPhotosForExport(photos);
      const exportedImages: { dataUrl: string; format: 'feed' | 'story' | 'vdh'; index: number }[] = [];
      const allDataUrls: string[] = [];

      for (let i = 0; i < currentPosts.length; i++) {
        const post = currentPosts[i];
        const photo = exportPhotos[post.photoIndex] || exportPhotos[0] || null;
        const dataUrl = await captureSlide(post.component, photo, exportPhotos, { slideIndex: post.slideIndex, totalSlides: currentPosts.length });
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
      setExportSlideEl(null);
    }
  };

  const handleExportBothFormats = async () => {
    setIsExporting(true);
    try {
      const exportPhotos = await getPhotosForExport(photos);
      const exportedImages: { dataUrl: string; format: 'feed' | 'story' | 'vdh'; index: number }[] = [];
      const allDataUrls: string[] = [];
      const allLabels: string[] = [];

      for (let i = 0; i < feedPosts.length; i++) {
        const post = feedPosts[i];
        const photo = exportPhotos[post.photoIndex] || exportPhotos[0] || null;
        const dataUrl = await captureSlide(post.component, photo, exportPhotos);
        exportedImages.push({ dataUrl, format: 'feed', index: i });
        allDataUrls.push(dataUrl);
        allLabels.push(`feed-${post.name.toLowerCase()}`);
      }

      for (let i = 0; i < storyPosts.length; i++) {
        const post = storyPosts[i];
        const photo = exportPhotos[post.photoIndex] || exportPhotos[0] || null;
        const dataUrl = await captureSlide(post.component, photo, exportPhotos);
        exportedImages.push({ dataUrl, format: 'story', index: i });
        allDataUrls.push(dataUrl);
        allLabels.push(`story-${post.name.toLowerCase()}`);
      }

      await downloadAsZip(allDataUrls, allLabels, 'posts-feed-story.zip');
      await saveCreativeWithExports(exportedImages, 'both');
      toast.success('Todos os 8 posts (Feed + Story) exportados e salvos!');
    } catch (error) {
      toast.error('Erro ao exportar imagens');
      console.error(error);
    } finally {
      setIsExporting(false);
      setExportSlideEl(null);
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${format === 'feed' ? 'text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            style={format === 'feed' ? { backgroundColor: '#1a3a6b' } : {}}
          >
            <Square className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Feed</span>
          </button>
          <button
            onClick={() => { setFormat('story'); setCurrentPost(0); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${format === 'story' ? 'text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            style={format === 'story' ? { backgroundColor: '#1a3a6b' } : {}}
          >
            <Smartphone className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Story</span>
          </button>
          <button
            onClick={() => { setFormat('vdh'); setCurrentPost(0); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${format === 'vdh' ? 'text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
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
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Exportar {format === 'feed' ? 'Feed' : format === 'story' ? 'Stories' : 'VDH'} ({posts.length})
        </button>
        <button
          onClick={handleExportBothFormats}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: '#c9a84c' }}
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
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

      {/* Current Post Preview */}
      <div className="relative">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <button
            onClick={() => setCurrentPost((prev) => (prev === 0 ? posts.length - 1 : prev - 1))}
            className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex-shrink-0 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>

          <div
            className="relative rounded-xl overflow-hidden flex-shrink-0"
            style={{
              width: format === 'feed' ? '280px' : '180px',
              height: format === 'feed' ? '280px' : '320px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}
          >
            <div
              className="origin-top-left"
              style={{
                width: '1080px',
                height: format === 'feed' ? '1080px' : '1920px',
                transform: format === 'feed' ? 'scale(0.2593)' : 'scale(0.1667)',
              }}
            >
              <CurrentPostComponent data={data} photo={currentPhoto} photos={photos} slideIndex={posts[currentPost]?.slideIndex} totalSlides={posts.length} />
            </div>
          </div>

          <button
            onClick={() => setCurrentPost((prev) => (prev === posts.length - 1 ? 0 : prev + 1))}
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
        ── Single hidden export element (iOS/iPhone/iPad/Safari fix) ───────────
        Strategy:
        - position: fixed; top: 0; left: 0 → always in the iOS render area (regardless of slide height)
        - clip-path: inset(0 0 0 100%) → visually hidden but FULLY RENDERED by WebKit
          (unlike opacity:0 or visibility:hidden which may skip paint on iOS)
        - zIndex: -9999 → behind all UI as extra safety
        - Photos pre-converted to base64 to avoid CORS fetch failures on iOS
        - Double-render on iOS primes the image cache before final capture
      */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: -9999,
          clipPath: 'inset(0 0 0 100%)',
        }}
      >
        <div ref={exportRef}>
          {exportSlideEl}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="hidden sm:flex gap-2 justify-center">
        {posts.map((Post, index) => (
          <button
            key={index}
            onClick={() => setCurrentPost(index)}
            className={`relative rounded-lg overflow-hidden transition-all flex-shrink-0 ${
              currentPost === index ? 'ring-2 ring-offset-2' : 'opacity-60 hover:opacity-100'
            }`}
            style={{
              width: format === 'feed' ? '80px' : '54px',
              height: format === 'feed' ? '80px' : '96px',
              ...(currentPost === index ? { '--tw-ring-color': '#c9a84c' } as React.CSSProperties : {}),
            }}
          >
            <div
              className="origin-top-left"
              style={{
                transform: format === 'feed' ? 'scale(0.074)' : 'scale(0.05)',
                width: '1080px',
                height: format === 'feed' ? '1080px' : '1920px',
              }}
            >
              <Post.component data={data} photo={photos[Post.photoIndex] || photos[0] || null} photos={photos} slideIndex={Post.slideIndex} totalSlides={posts.length} />
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
