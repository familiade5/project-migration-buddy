import { useState } from 'react';
import { AMPropertyData } from '@/types/apartamentosManaus';
import {
  AMCoverSlide,
  AMDetailsSlide,
  AMPhotoSlide,
  AMContactSlide,
  AMInfoSlide,
} from './slides/AMSlides';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';

interface AMPostPreviewProps {
  data: AMPropertyData;
  photos: string[];
}

type TabId = 'feed' | 'story';

export function AMPostPreview({ data, photos }: AMPostPreviewProps) {
  const [activeTab, setActiveTab] = useState<TabId>('feed');
  const [downloading, setDownloading] = useState(false);

  const feedSlides = [
    { id: 'cover', label: 'Capa', component: <AMCoverSlide data={data} photo={photos[0]} /> },
    { id: 'details', label: 'Detalhes', component: <AMDetailsSlide data={data} /> },
    ...(photos.slice(1, 4).map((photo, i) => ({
      id: `photo-${i + 2}`,
      label: `Foto ${i + 2}`,
      component: <AMPhotoSlide data={data} photo={photo} photoIndex={i + 2} />,
    }))),
    { id: 'contact', label: 'Contato', component: <AMContactSlide data={data} /> },
    { id: 'info', label: 'Informativo', component: <AMInfoSlide data={data} /> },
  ];

  const handleDownloadAll = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('apartamentos-manaus-post') as JSZip;
      const nodes = document.querySelectorAll('[data-am-slide]');
      
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i] as HTMLElement;
        const dataUrl = await toPng(node, { pixelRatio: 2 });
        const base64 = dataUrl.split(',')[1];
        folder.file(`slide-${String(i + 1).padStart(2, '0')}.png`, base64, { base64: true });
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `post-${data.title || 'imovel'}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab selector */}
      <div className="flex gap-2">
        {(['feed', 'story'] as TabId[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={
              activeTab === tab
                ? { backgroundColor: '#1B5EA6', color: '#FFFFFF' }
                : { backgroundColor: '#F3F4F6', color: '#6B7280' }
            }
          >
            {tab === 'feed' ? '📷 Feed (1:1)' : '📱 Story (9:16)'}
          </button>
        ))}
      </div>

      {/* Download button */}
      <Button
        onClick={handleDownloadAll}
        disabled={downloading}
        className="w-full text-white font-semibold"
        style={{ backgroundColor: '#F47920' }}
      >
        <Download className="w-4 h-4 mr-2" />
        {downloading ? 'Gerando ZIP...' : 'Baixar todos os slides (.zip)'}
      </Button>

      {/* Slides preview */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          {feedSlides.map((slide) => (
            <div key={slide.id} className="space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{slide.label}</p>
              <div
                data-am-slide
                className="rounded-xl overflow-hidden shadow-sm border border-gray-200"
                style={{ width: 360 }}
              >
                {slide.component}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'story' && (
        <div className="space-y-4">
          {/* Story version - capa + contato */}
          {[
            { id: 'story-cover', label: 'Story – Capa', component: <AMCoverSlide data={data} photo={photos[0]} /> },
            { id: 'story-details', label: 'Story – Detalhes', component: <AMDetailsSlide data={data} /> },
            ...(photos.slice(1, 3).map((photo, i) => ({
              id: `story-photo-${i + 2}`,
              label: `Story – Foto ${i + 2}`,
              component: <AMPhotoSlide data={data} photo={photo} photoIndex={i + 2} />,
            }))),
            { id: 'story-contact', label: 'Story – Contato', component: <AMContactSlide data={data} /> },
          ].map((slide) => (
            <div key={slide.id} className="space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{slide.label}</p>
              {/* Story wrapper – 9:16 proportions */}
              <div
                data-am-slide
                className="rounded-xl overflow-hidden shadow-sm border border-gray-200 relative"
                style={{ width: 202, height: 360 }}
              >
                <div style={{ transform: 'scale(0.56)', transformOrigin: 'top left', width: 360, height: 640 }}>
                  <div style={{ width: 360, height: 640, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ transform: 'scaleY(1.78)', transformOrigin: 'top' }}>
                      {slide.component}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
