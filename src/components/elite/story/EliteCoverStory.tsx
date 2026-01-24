import { PropertyData } from '@/types/property';
import { MapPin, Crown } from 'lucide-react';
import logoElite from '@/assets/logo-elite.png';

interface EliteCoverStoryProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const EliteCoverStory = ({ data, photo }: EliteCoverStoryProps) => {
  return (
    <div className="post-template-story relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Full bleed photo - clean, minimal overlays */}
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
              height: '55%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)'
            }}
          />
          {/* Minimal gradient at top for logo */}
          <div 
            className="absolute inset-x-0 top-0"
            style={{ 
              height: '25%',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)'
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1f] via-[#0f0f14] to-[#0a0a0f]" />
      )}

      {/* Top - Logo and badge */}
      <div 
        className="absolute z-20 flex items-center justify-between"
        style={{ top: '60px', left: '50px', right: '50px' }}
      >
        <img 
          src={logoElite} 
          alt="Élite Imóveis" 
          style={{ height: '70px', objectFit: 'contain' }}
        />
        <div 
          className="flex items-center gap-3"
          style={{ 
            padding: '16px 28px',
            background: 'linear-gradient(135deg, #d4af37, #f5d485)',
            borderRadius: '100px'
          }}
        >
          <Crown style={{ width: '24px', height: '24px', color: '#0a0a0f' }} />
          <span style={{ fontSize: '18px', fontWeight: '600', color: '#0a0a0f' }}>EXCLUSIVO</span>
        </div>
      </div>

      {/* Elegant watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <p className="font-display font-bold" style={{ fontSize: '400px', color: '#d4af37' }}>É</p>
      </div>

      {/* Bottom content */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{ 
          background: 'linear-gradient(to top, rgba(10,10,15,0.98) 0%, rgba(10,10,15,0.9) 60%, transparent 100%)',
          padding: '150px 50px 80px'
        }}
      >
        {/* Property type */}
        <div className="flex items-center gap-4" style={{ marginBottom: '30px' }}>
          <div 
            style={{ 
              width: '50px',
              height: '2px',
              background: 'linear-gradient(90deg, #d4af37, transparent)'
            }}
          />
          <span 
            className="uppercase tracking-[0.2em] font-medium"
            style={{ fontSize: '20px', color: '#d4af37' }}
          >
            {data.type || 'Imóvel'} de Alto Padrão
          </span>
        </div>

        {/* Property name */}
        <h1 
          className="font-display font-semibold leading-tight"
          style={{ 
            fontSize: '72px', 
            color: '#ffffff',
            marginBottom: '30px'
          }}
        >
          {data.propertyName || `${data.type || 'Residência'} Premium`}
        </h1>

        {/* Location */}
        <div className="flex items-center gap-4" style={{ marginBottom: '50px' }}>
          <MapPin style={{ width: '28px', height: '28px', color: '#d4af37' }} />
          <span style={{ fontSize: '28px', color: 'rgba(255,255,255,0.8)' }}>
            {data.neighborhood}, {data.city} - {data.state}
          </span>
        </div>

        {/* Price section */}
        <div 
          style={{ 
            padding: '40px',
            background: 'rgba(212,175,55,0.1)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '20px'
          }}
        >
          <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>A partir de</p>
          <p 
            className="font-display font-semibold"
            style={{ fontSize: '60px', color: '#d4af37' }}
          >
            {data.minimumValue || 'Consulte'}
          </p>
        </div>
      </div>
    </div>
  );
};
