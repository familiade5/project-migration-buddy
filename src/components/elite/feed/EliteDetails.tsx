import { PropertyData } from '@/types/property';
import { Bed, Car, Bath, Maximize2, Crown } from 'lucide-react';
import logoElite from '@/assets/logo-elite.png';

interface EliteDetailsProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const EliteDetails = ({ data, photo, photos = [] }: EliteDetailsProps) => {
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

  // Details to display
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
    <div className="post-template relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Split layout - Photos grid left, details right */}
      <div className="absolute inset-0 flex">
        {/* Left - Photo grid with artistic layout */}
        <div className="relative" style={{ width: '55%', height: '100%' }}>
          {/* Main large photo */}
          <div 
            className="absolute bg-cover bg-center"
            style={{ 
              top: '40px',
              left: '40px',
              right: '20px',
              height: '60%',
              borderRadius: '16px',
              backgroundImage: `url(${getPhoto(0)})`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}
          />
          {/* Two smaller photos */}
          <div 
            className="absolute flex gap-4"
            style={{ 
              bottom: '40px',
              left: '40px',
              right: '20px',
              height: '32%'
            }}
          >
            <div 
              className="flex-1 bg-cover bg-center"
              style={{ 
                borderRadius: '12px',
                backgroundImage: `url(${getPhoto(1)})`,
                boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
              }}
            />
            <div 
              className="flex-1 bg-cover bg-center"
              style={{ 
                borderRadius: '12px',
                backgroundImage: `url(${getPhoto(2)})`,
                boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
              }}
            />
          </div>
          {/* Removed gradient overlay for cleaner photos */}
        </div>

        {/* Right - Details panel */}
        <div 
          className="flex flex-col justify-center"
          style={{ 
            width: '45%',
            padding: '60px 50px 60px 30px'
          }}
        >
          {/* Section header */}
          <div style={{ marginBottom: '50px' }}>
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
                style={{ fontSize: '14px', color: '#d4af37' }}
              >
                Características
              </span>
            </div>
            <h2 
              className="font-display font-semibold"
              style={{ fontSize: '48px', color: '#ffffff', lineHeight: '1.1' }}
            >
              Detalhes do<br/>Imóvel
            </h2>
          </div>

          {/* Feature cards */}
          <div className="flex flex-col" style={{ gap: '24px', marginBottom: '50px' }}>
            {details.map((detail, index) => (
              <div 
                key={index}
                className="flex items-center gap-5"
                style={{ 
                  padding: '28px 32px',
                  background: 'rgba(212,175,55,0.05)',
                  border: '1px solid rgba(212,175,55,0.15)',
                  borderRadius: '16px'
                }}
              >
                <div 
                  className="flex items-center justify-center"
                  style={{ 
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))'
                  }}
                >
                  <detail.icon style={{ width: '28px', height: '28px', color: '#d4af37' }} />
                </div>
                <div>
                  <p 
                    className="font-display font-semibold"
                    style={{ fontSize: '40px', color: '#ffffff', lineHeight: '1' }}
                  >
                    {detail.value}
                  </p>
                  <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                    {detail.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Logo */}
          <div className="flex items-center justify-end">
            <img 
              src={logoElite} 
              alt="Élite Imóveis" 
              style={{ height: '50px', objectFit: 'contain', opacity: 0.8 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
