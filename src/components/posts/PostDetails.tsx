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
  // Features dinâmicas baseadas nos dados
  const generateFeatures = () => {
    const features: string[] = [];
    if (data.bedrooms) features.push(`${data.bedrooms} quartos aconchegantes`);
    if (data.bathrooms) features.push(`${data.bathrooms} banheiro${Number(data.bathrooms) > 1 ? 's' : ''}`);
    if (data.garageSpaces) features.push(`${data.garageSpaces} vaga${Number(data.garageSpaces) > 1 ? 's' : ''} de garagem`);
    if (data.area) features.push(`${data.area}m² de área`);
    // Adicionar features selecionadas
    data.features.forEach(f => {
      if (features.length < 4) features.push(f);
    });
    return features.slice(0, 3);
  };

  const displayFeatures = generateFeatures();

  return (
    <div className="post-template bg-[#1a1f2e] relative overflow-hidden">
      {/* Layout dividido - Fotos à esquerda em triângulo, conteúdo à direita */}
      <div className="absolute inset-0 flex">
        {/* Grid de 3 fotos em triângulo à esquerda */}
        <div className="w-[55%] h-full p-2 flex flex-col gap-2">
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
              <p className="text-white/15 text-3xl font-bold tracking-wider">VDH</p>
            </div>
          </div>
          
          {/* Duas fotos menores embaixo - usa fotos alternadas */}
          <div className="flex gap-2 h-[40%]">
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
                  <p className="text-white/15 text-xl font-bold tracking-wider">VDH</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Painel de características à direita */}
        <div className="w-[45%] h-full flex flex-col justify-center p-6 bg-[#2a3142]">
          {displayFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 py-4 border-b border-white/10 last:border-b-0"
            >
              <div className="w-7 h-7 rounded bg-[#d4a44c] flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-[#1a1f2e]" />
              </div>
              <span className="text-white text-base font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logo VDH no canto inferior direito */}
      <div className="absolute bottom-4 right-4 z-10">
        <img src={logoVDH} alt="VDH" className="h-10 w-auto rounded" />
      </div>
    </div>
  );
};
