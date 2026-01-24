import { PropertyData } from '@/types/property';
import { MapPin, Crown } from 'lucide-react';
import logoElite from '@/assets/logo-elite.png';

interface EliteCoverProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const EliteCover = ({ data, photo }: EliteCoverProps) => {
  const displayAddress = data.fullAddress || 
    (data.street ? `${data.street}${data.number ? `, ${data.number}` : ''} - ${data.neighborhood}, ${data.city} - ${data.state}` 
    : `${data.neighborhood}, ${data.city} - ${data.state}`);

  return (
    <div className="post-template relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Full bleed photo - clean, no heavy overlays */}
      {photo ? (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${photo})` }}
          />
          {/* Minimal gradient only at bottom for text readability */}
          <div 
            className="absolute inset-x-0 bottom-0"
            style={{ 
              height: '50%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)'
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1f] via-[#0f0f14] to-[#0a0a0f]" />
      )}

      {/* Top corner accent - Luxury badge */}
      <div className="absolute z-20" style={{ top: '40px', right: '40px' }}>
        <div className="relative">
          <div 
            className="rounded-xl overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, #d4af37, #f5d485, #d4af37)',
              padding: '2px'
            }}
          >
            <div 
              className="rounded-[10px] flex items-center gap-3"
              style={{ 
                background: 'rgba(10, 10, 15, 0.95)',
                padding: '16px 32px'
              }}
            >
              <Crown 
                style={{ width: '32px', height: '32px', color: '#d4af37' }}
              />
              <div>
                <p 
                  className="font-display font-semibold tracking-wide"
                  style={{ fontSize: '20px', color: '#d4af37' }}
                >
                  EXCLUSIVO
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <p className="font-display font-bold tracking-[0.3em]" style={{ fontSize: '280px', color: '#d4af37' }}>É</p>
      </div>

      {/* Bottom content panel */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{ 
          background: 'linear-gradient(to top, rgba(10,10,15,0.98) 0%, rgba(10,10,15,0.95) 70%, transparent 100%)',
          padding: '80px 50px 50px'
        }}
      >
        {/* Property type badge */}
        <div className="flex items-center gap-4" style={{ marginBottom: '24px' }}>
          <div 
            style={{ 
              width: '60px',
              height: '2px',
              background: 'linear-gradient(90deg, #d4af37, transparent)'
            }}
          />
          <span 
            className="uppercase tracking-[0.2em] font-medium"
            style={{ fontSize: '18px', color: '#d4af37' }}
          >
            {data.type || 'Imóvel'} de Alto Padrão
          </span>
        </div>

        {/* Property name - Large elegant typography */}
        <h1 
          className="font-display font-semibold leading-tight"
          style={{ 
            fontSize: '64px', 
            color: '#ffffff',
            marginBottom: '20px',
            letterSpacing: '-0.02em'
          }}
        >
          {data.propertyName || `${data.type || 'Residência'} Premium`}
        </h1>

        {/* Location with icon */}
        <div className="flex items-center gap-3" style={{ marginBottom: '40px' }}>
          <MapPin style={{ width: '24px', height: '24px', color: '#d4af37' }} />
          <span 
            style={{ fontSize: '24px', color: 'rgba(255,255,255,0.8)' }}
          >
            {data.neighborhood}, {data.city} - {data.state}
          </span>
        </div>

        {/* Bottom bar with logo and price */}
        <div className="flex items-center justify-between" style={{ paddingTop: '30px', borderTop: '1px solid rgba(212,175,55,0.2)' }}>
          {/* Logo */}
          <img 
            src={logoElite} 
            alt="Élite Imóveis" 
            style={{ height: '60px', objectFit: 'contain' }}
          />

          {/* Price */}
          <div className="text-right">
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>A partir de</p>
            <p 
              className="font-display font-semibold"
              style={{ fontSize: '48px', color: '#d4af37' }}
            >
              {data.minimumValue || 'Consulte'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
