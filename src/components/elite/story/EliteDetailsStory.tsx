import { PropertyData } from '@/types/property';
import { Bed, Car, Bath, Maximize2 } from 'lucide-react';
import logoElite from '@/assets/logo-elite.png';

interface EliteDetailsStoryProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const EliteDetailsStory = ({ data, photo, photos = [] }: EliteDetailsStoryProps) => {
  const getPhoto = (index: number) => {
    if (photos.length > 0) {
      return photos[index % photos.length] || photo;
    }
    return photo;
  };

  const bedroomsNum = Number(data.bedrooms || 0);
  const garageNum = Number(data.garageSpaces || 0);
  const bathroomsNum = Number(data.bathrooms || 0);
  const areaValue = (data.area || '').trim();

  const details = [
    { 
      icon: Bed, 
      value: bedroomsNum > 0 ? `${bedroomsNum}` : '-', 
      label: bedroomsNum === 1 ? 'Suíte' : 'Suítes' 
    },
    { 
      icon: Car, 
      value: garageNum > 0 ? `${garageNum}` : '-', 
      label: garageNum === 1 ? 'Vaga' : 'Vagas' 
    },
    { 
      icon: bathroomsNum > 1 ? Bath : Maximize2, 
      value: bathroomsNum > 1 ? `${bathroomsNum}` : (areaValue || '-'), 
      label: bathroomsNum > 1 ? 'Banheiros' : 'm² Privativos' 
    },
  ];

  return (
    <div className="post-template-story relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Top photos grid */}
      <div 
        className="absolute flex flex-col gap-4"
        style={{ top: '50px', left: '50px', right: '50px', height: '50%' }}
      >
        {/* Main photo */}
        <div 
          className="flex-1 bg-cover bg-center"
          style={{ 
            borderRadius: '20px',
            backgroundImage: `url(${getPhoto(0)})`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
          }}
        />
        {/* Two smaller photos */}
        <div className="flex gap-4" style={{ height: '40%' }}>
          <div 
            className="flex-1 bg-cover bg-center"
            style={{ 
              borderRadius: '16px',
              backgroundImage: `url(${getPhoto(1)})`,
              boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
            }}
          />
          <div 
            className="flex-1 bg-cover bg-center"
            style={{ 
              borderRadius: '16px',
              backgroundImage: `url(${getPhoto(2)})`,
              boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
            }}
          />
        </div>
      </div>

      {/* Bottom details section */}
      <div 
        className="absolute left-0 right-0 bottom-0"
        style={{ 
          padding: '60px 50px 80px',
          background: 'linear-gradient(to top, rgba(10,10,15,1) 80%, transparent 100%)'
        }}
      >
        {/* Section header */}
        <div style={{ marginBottom: '40px' }}>
          <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
            <div 
              style={{ 
                width: '40px',
                height: '2px',
                background: 'linear-gradient(90deg, #d4af37, transparent)'
              }}
            />
            <span 
              className="uppercase tracking-[0.2em]"
              style={{ fontSize: '16px', color: '#d4af37' }}
            >
              Características
            </span>
          </div>
          <h2 
            className="font-display font-semibold"
            style={{ fontSize: '52px', color: '#ffffff' }}
          >
            Detalhes do Imóvel
          </h2>
        </div>

        {/* Feature cards */}
        <div className="flex flex-col" style={{ gap: '20px', marginBottom: '50px' }}>
          {details.map((detail, index) => (
            <div 
              key={index}
              className="flex items-center gap-5"
              style={{ 
                padding: '32px 36px',
                background: 'rgba(212,175,55,0.05)',
                border: '1px solid rgba(212,175,55,0.15)',
                borderRadius: '20px'
              }}
            >
              <div 
                className="flex items-center justify-center"
                style={{ 
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))'
                }}
              >
                <detail.icon style={{ width: '32px', height: '32px', color: '#d4af37' }} />
              </div>
              <div>
                <p 
                  className="font-display font-semibold"
                  style={{ fontSize: '48px', color: '#ffffff', lineHeight: '1' }}
                >
                  {detail.value}
                </p>
                <p style={{ fontSize: '22px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                  {detail.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Logo */}
        <div className="flex justify-center">
          <img 
            src={logoElite} 
            alt="Élite Imóveis" 
            style={{ height: '50px', objectFit: 'contain', opacity: 0.7 }}
          />
        </div>
      </div>
    </div>
  );
};
