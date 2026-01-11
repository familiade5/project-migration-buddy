import { PropertyData } from '@/types/property';
import { Check } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface PostDetailsStoryProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostDetailsStory = ({ data, photo, photos = [] }: PostDetailsStoryProps) => {
  const getPhoto = (index: number) => {
    if (photos.length > 0) {
      return photos[index % photos.length] || photo;
    }
    return photo;
  };

  const generateFeatures = () => {
    const features: string[] = [];
    if (data.bedrooms) features.push(`${data.bedrooms} quartos aconchegantes`);
    if (data.bathrooms) features.push(`${data.bathrooms} banheiro${Number(data.bathrooms) > 1 ? 's' : ''}`);
    if (data.garageSpaces) features.push(`${data.garageSpaces} vaga${Number(data.garageSpaces) > 1 ? 's' : ''} de garagem`);
    if (data.area) features.push(`${data.area}m² de área`);
    data.features.forEach(f => {
      if (features.length < 5) features.push(f);
    });
    return features.slice(0, 4);
  };

  const displayFeatures = generateFeatures();

  return (
    <div className="post-template-story bg-[#1a1f2e] relative overflow-hidden">
      {/* Foto grande no topo - 50% da altura */}
      <div className="absolute top-0 left-0 right-0 h-[50%]">
        {getPhoto(0) ? (
          <div
            className="absolute inset-0 bg-cover bg-center brightness-110"
            style={{ backgroundImage: `url(${getPhoto(0)})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a3142] to-[#1a1f2e]" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white/15 text-5xl font-bold tracking-wider">VDH</p>
        </div>
      </div>

      {/* Duas fotos menores no meio */}
      <div className="absolute top-[50%] left-0 right-0 h-[20%] flex gap-2 px-2">
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

      {/* Painel de características na parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-[#2a3142] p-4 flex flex-col justify-center">
        {displayFeatures.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-3 py-2 border-b border-white/10 last:border-b-0"
          >
            <div className="w-6 h-6 rounded bg-[#d4a44c] flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-[#1a1f2e]" />
            </div>
            <span className="text-white text-sm font-medium">{feature}</span>
          </div>
        ))}
      </div>

      {/* Logo VDH */}
      <div className="absolute bottom-3 right-3 z-10">
        <img src={logoVDH} alt="VDH" className="h-8 w-auto rounded" />
      </div>
    </div>
  );
};
