import { useState, useCallback, useEffect } from 'react';
import { 
  LocacaoCreativeType, 
  LocacaoPropertyData, 
  LocacaoManagementData, 
  LocacaoCategorizedPhoto,
  defaultLocacaoPropertyData,
  defaultLocacaoManagementData 
} from '@/types/locacao';
import { LocacaoTypeSelector } from '@/components/locacao/LocacaoTypeSelector';
import { LocacaoPropertyForm } from '@/components/locacao/LocacaoPropertyForm';
import { LocacaoManagementForm } from '@/components/locacao/LocacaoManagementForm';
import { LocacaoPhotoUpload } from '@/components/locacao/LocacaoPhotoUpload';
import { LocacaoPostPreview } from '@/components/locacao/LocacaoPostPreview';
import { LocacaoCaptionGenerator } from '@/components/locacao/LocacaoCaptionGenerator';
import { LocacaoManagementCaptionGenerator } from '@/components/locacao/LocacaoManagementCaptionGenerator';
import { LocacaoLogo } from '@/components/locacao/LocacaoLogo';
import { AppLayout } from '@/components/layout/AppLayout';
import { Settings2, Image, FileText, Home, Building2 } from 'lucide-react';
import managementBackgroundDefault from '@/assets/management-background.jpg';

const LocacaoPostGenerator = () => {
  const [creativeType, setCreativeType] = useState<LocacaoCreativeType | null>(null);
  const [propertyData, setPropertyData] = useState<LocacaoPropertyData>(defaultLocacaoPropertyData);
  const [managementData, setManagementData] = useState<LocacaoManagementData>({
    ...defaultLocacaoManagementData,
    backgroundPhoto: managementBackgroundDefault,
  });
  const [photos, setPhotos] = useState<LocacaoCategorizedPhoto[]>([]);

  const handleClearPhotos = useCallback(() => {
    setPhotos([]);
  }, []);

  const handleBackToSelector = () => {
    setCreativeType(null);
  };

  // Show type selector if no type selected
  if (!creativeType) {
    return (
      <AppLayout>
        <LocacaoTypeSelector onSelect={setCreativeType} />
      </AppLayout>
    );
  }

  const isProperty = creativeType === 'property';

  return (
    <AppLayout>
      <div 
        className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden min-h-screen"
        style={{ backgroundColor: '#f9fafb' }}
      >
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <LocacaoLogo size="md" variant="dark" />
            <div>
              <h1 className="font-semibold text-xl sm:text-2xl" style={{ color: '#111827' }}>
                Locação & Gestão
              </h1>
              <p className="text-sm" style={{ color: '#6b7280' }}>
                {isProperty ? 'Imóvel para Locação' : 'Serviço de Gestão'}
              </p>
            </div>
          </div>
          <button
            onClick={handleBackToSelector}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Alterar tipo"
          >
            <Settings2 className="w-5 h-5" style={{ color: '#6b7280' }} />
          </button>
        </div>

        {/* Type Indicator */}
        <div className="mb-6">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{ backgroundColor: '#e5e7eb' }}
          >
            {isProperty ? (
              <Home className="w-4 h-4" style={{ color: '#374151' }} />
            ) : (
              <Building2 className="w-4 h-4" style={{ color: '#374151' }} />
            )}
            <span className="text-sm font-medium" style={{ color: '#374151' }}>
              {isProperty ? 'Imóvel para Locação' : 'Serviço de Gestão'}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6 min-w-0">
            {/* Photos Upload - Property: all photos, Management: background photo */}
            {isProperty && (
              <div 
                className="rounded-2xl p-4 sm:p-6 shadow-sm"
                style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Image className="w-5 h-5" style={{ color: '#6b7280' }} />
                  <h2 className="font-semibold" style={{ color: '#111827' }}>
                    Fotos do Imóvel
                  </h2>
                </div>
                <LocacaoPhotoUpload
                  photos={photos}
                  onChange={setPhotos}
                  onClear={handleClearPhotos}
                />
              </div>
            )}

            {/* Background Photo for Management */}
            {!isProperty && managementData.useBackgroundPhoto && (
              <div 
                className="rounded-2xl p-4 sm:p-6 shadow-sm"
                style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Image className="w-5 h-5" style={{ color: '#6b7280' }} />
                  <h2 className="font-semibold" style={{ color: '#111827' }}>
                    Foto de Fundo (opcional)
                  </h2>
                </div>
                <LocacaoPhotoUpload
                  photos={photos}
                  onChange={(newPhotos) => {
                    setPhotos(newPhotos);
                    // Set the first photo as background photo
                    if (newPhotos.length > 0) {
                      setManagementData(prev => ({
                        ...prev,
                        backgroundPhoto: newPhotos[0].url
                      }));
                    } else {
                      setManagementData(prev => ({
                        ...prev,
                        backgroundPhoto: null
                      }));
                    }
                  }}
                  onClear={() => {
                    handleClearPhotos();
                    setManagementData(prev => ({
                      ...prev,
                      backgroundPhoto: null
                    }));
                  }}
                  maxPhotos={1}
                />
                <p className="text-xs mt-2" style={{ color: '#9ca3af' }}>
                  A foto aparecerá desfocada como fundo sutil nos criativos de gestão.
                </p>
              </div>
            )}

            {/* Form */}
            <div 
              className="rounded-2xl p-4 sm:p-6 shadow-sm"
              style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5" style={{ color: '#6b7280' }} />
                <h2 className="font-semibold" style={{ color: '#111827' }}>
                  {isProperty ? 'Informações do Imóvel' : 'Informações do Serviço'}
                </h2>
              </div>
              {isProperty ? (
                <LocacaoPropertyForm
                  data={propertyData}
                  onChange={setPropertyData}
                />
              ) : (
                <LocacaoManagementForm
                  data={managementData}
                  onChange={setManagementData}
                />
              )}
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6 min-w-0">
            <div 
              className="rounded-2xl p-4 sm:p-6 shadow-sm"
              style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div 
                  className="w-5 h-5 rounded flex items-center justify-center"
                  style={{ backgroundColor: '#e5e7eb' }}
                >
                  <span className="text-xs font-medium" style={{ color: '#374151' }}>✓</span>
                </div>
                <h2 className="font-semibold" style={{ color: '#111827' }}>Preview</h2>
              </div>
              <LocacaoPostPreview
                creativeType={creativeType}
                propertyData={propertyData}
                managementData={managementData}
                photos={photos}
              />
            </div>

            {/* Caption Generator - for property and management */}
            <div 
              className="rounded-2xl p-4 sm:p-6 shadow-sm"
              style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
            >
              {isProperty ? (
                <LocacaoCaptionGenerator data={propertyData} />
              ) : (
                <LocacaoManagementCaptionGenerator data={managementData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LocacaoPostGenerator;
