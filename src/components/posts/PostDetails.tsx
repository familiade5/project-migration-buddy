import { PropertyData } from '@/types/property';
import { Check } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface PostDetailsProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostDetails = ({ data, photo, photos = [] }: PostDetailsProps) => {
  // Usar fotos alternadas: foto principal, ou fallback para as disponíveis
  const getPhoto = (index: number) => {
    if (photos.length > 0) {
      return photos[index % photos.length] || photo;
    }
    return photo;
  };
  // Features dinâmicas baseadas nos dados - com fallbacks de venda
  const generateFeatures = () => {
    const features: string[] = [];
    
    // Primeiro: adiciona dados reais se existirem
    if (data.bedrooms && data.bedrooms !== '' && data.bedrooms !== '0') {
      features.push(`${data.bedrooms} quarto${Number(data.bedrooms) > 1 ? 's' : ''} aconchegante${Number(data.bedrooms) > 1 ? 's' : ''}`);
    }
    if (data.bathrooms && data.bathrooms !== '' && data.bathrooms !== '0') {
      features.push(`${data.bathrooms} banheiro${Number(data.bathrooms) > 1 ? 's' : ''}`);
    }
    if (data.garageSpaces && data.garageSpaces !== '' && data.garageSpaces !== '0') {
      features.push(`${data.garageSpaces} vaga${Number(data.garageSpaces) > 1 ? 's' : ''} de garagem`);
    }
    if (data.area && data.area !== '' && data.area !== '0') {
      features.push(`${data.area}m² de área`);
    }
    
    // Adicionar features selecionadas
    data.features.forEach(f => {
      if (features.length < 4) features.push(f);
    });
    
    // Se não tem features suficientes, adiciona textos de venda
    const sellingPoints = [
      'Localização privilegiada',
      'Ótimo custo-benefício',
      'Pronto para morar',
      'Excelente oportunidade',
      'Investimento seguro',
      'Documentação ok',
    ];
    
    let sellingIndex = 0;
    while (features.length < 3 && sellingIndex < sellingPoints.length) {
      features.push(sellingPoints[sellingIndex]);
      sellingIndex++;
    }
    
    return features.slice(0, 3);
  };

  const displayFeatures = generateFeatures();

  return (
    <div className="post-template bg-[#1a1f2e] relative overflow-hidden">
      {/* Layout dividido - Fotos à esquerda em triângulo, conteúdo à direita */}
      <div className="absolute inset-0 flex">
        {/* Grid de 3 fotos em triângulo à esquerda */}
        <div className="w-[55%] h-full flex flex-col" style={{ padding: '24px', gap: '24px' }}>
          {/* Foto grande no topo - usa primeira foto disponível */}
          <div className="flex-1 relative overflow-hidden rounded-lg">
            {getPhoto(0) ? (
              <div
                className="absolute inset-0 bg-cover bg-center brightness-110"
                style={{ backgroundImage: `url(${getPhoto(0)})` }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#2a3142] to-[#1a1f2e]" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white/15 font-bold tracking-wider" style={{ fontSize: '100px' }}>VDH</p>
            </div>
          </div>
          
          {/* Duas fotos menores embaixo - usa fotos alternadas */}
          <div className="flex h-[40%]" style={{ gap: '24px' }}>
            {[1, 2].map((photoIndex) => (
              <div key={photoIndex} className="flex-1 relative overflow-hidden rounded-lg">
                {getPhoto(photoIndex) ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center brightness-110"
                    style={{ backgroundImage: `url(${getPhoto(photoIndex)})` }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2a3142] to-[#1a1f2e]" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white/15 font-bold tracking-wider" style={{ fontSize: '60px' }}>VDH</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Painel de características à direita */}
        <div className="w-[45%] h-full flex flex-col justify-center bg-[#2a3142]" style={{ padding: '60px' }}>
          {displayFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-center border-b border-white/10 last:border-b-0"
              style={{ gap: '32px', padding: '48px 0' }}
            >
              <div className="rounded bg-[#d4a44c] flex items-center justify-center flex-shrink-0" style={{ width: '72px', height: '72px' }}>
                <Check className="text-[#1a1f2e]" style={{ width: '44px', height: '44px' }} />
              </div>
              <span className="text-white font-medium" style={{ fontSize: '44px' }}>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logo VDH no canto inferior direito */}
      <div className="absolute z-10" style={{ bottom: '40px', right: '40px' }}>
        <img src={logoVDH} alt="VDH" className="rounded" style={{ height: '100px' }} />
      </div>
    </div>
  );
};
