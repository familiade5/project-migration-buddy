import { useState, useCallback } from 'react';
import { RevendaPropertyData, defaultRevendaData, CategorizedPhoto, DetailLevel } from '@/types/revenda';
import { RevendaPropertyForm } from '@/components/revenda/RevendaPropertyForm';
import { RevendaPhotoUpload } from '@/components/revenda/RevendaPhotoUpload';
import { RevendaPostPreview } from '@/components/revenda/RevendaPostPreview';
import { RevendaDetailLevelSelector } from '@/components/revenda/RevendaDetailLevelSelector';
import { RevendaLogo } from '@/components/revenda/RevendaLogo';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, FileText, Settings2, Gem } from 'lucide-react';

const RevendaPostGenerator = () => {
  const [propertyData, setPropertyData] = useState<RevendaPropertyData>(defaultRevendaData);
  const [photos, setPhotos] = useState<CategorizedPhoto[]>([]);
  const [showSetup, setShowSetup] = useState(true);

  const handleDetailLevelChange = (level: DetailLevel) => {
    setPropertyData(prev => ({ ...prev, detailLevel: level }));
    setShowSetup(false);
  };

  const handleClearPhotos = useCallback(() => {
    setPhotos([]);
  }, []);

  if (showSetup) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: '#f8fafc' }}>
          <div className="max-w-2xl w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <RevendaLogo size="xl" variant="with-background" className="justify-center mx-auto" />
              <p className="mt-4 text-slate-500">
                Crie posts elegantes para imóveis de revenda no mercado
              </p>
            </div>

            {/* Detail Level Selection */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <RevendaDetailLevelSelector
                value={propertyData.detailLevel}
                onChange={handleDetailLevelChange}
              />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div 
        className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden min-h-screen"
        style={{ backgroundColor: '#f8fafc' }}
      >
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <RevendaLogo size="md" variant="with-background" />
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-semibold" style={{ color: '#0f172a' }}>
                Revenda – Mercado
              </h1>
              <p className="text-sm" style={{ color: '#64748b' }}>
                Posts elegantes para imóveis premium
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSetup(true)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            title="Configurações"
          >
            <Settings2 className="w-5 h-5" style={{ color: '#64748b' }} />
          </button>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6 min-w-0">
            {/* Photos Upload */}
            <div 
              className="rounded-2xl p-6 shadow-sm"
              style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Image className="w-5 h-5" style={{ color: '#0ea5e9' }} />
                <h2 className="font-semibold" style={{ color: '#0f172a' }}>Fotos do Imóvel</h2>
              </div>
              <RevendaPhotoUpload
                photos={photos}
                onChange={setPhotos}
                onClear={handleClearPhotos}
              />
            </div>

            {/* Property Form */}
            <div 
              className="rounded-2xl p-6 shadow-sm"
              style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5" style={{ color: '#0ea5e9' }} />
                <h2 className="font-semibold" style={{ color: '#0f172a' }}>Informações do Imóvel</h2>
              </div>
              <RevendaPropertyForm
                data={propertyData}
                onChange={setPropertyData}
              />
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-4 space-y-6 min-w-0">
            <div 
              className="rounded-2xl p-6 shadow-sm"
              style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Gem className="w-5 h-5" style={{ color: '#0ea5e9' }} />
                <h2 className="font-semibold" style={{ color: '#0f172a' }}>Preview</h2>
              </div>
              <RevendaPostPreview
                data={propertyData}
                photos={photos}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default RevendaPostGenerator;
