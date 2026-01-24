import { PropertyData } from '@/types/property';
import { Crown, MapPin, TrendingDown } from 'lucide-react';
import logoElite from '@/assets/logo-elite.png';

interface EliteVDH1Props {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const EliteVDH1 = ({ data, photo }: EliteVDH1Props) => {
  const discountNum = Number(data.discount || 0);

  return (
    <div className="post-template-story relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Full bleed photo */}
      {photo ? (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${photo})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1f] to-[#0a0a0f]" />
      )}

      {/* Top - Logo and Discount badge */}
      <div 
        className="absolute z-20 flex items-center justify-between"
        style={{ top: '60px', left: '50px', right: '50px' }}
      >
        <img 
          src={logoElite} 
          alt="Élite Imóveis" 
          style={{ height: '70px', objectFit: 'contain' }}
        />
        
        {discountNum > 0 && (
          <div 
            className="flex items-center gap-3"
            style={{ 
              padding: '20px 32px',
              background: 'linear-gradient(135deg, #d4af37, #f5d485)',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(212,175,55,0.4)'
            }}
          >
            <TrendingDown style={{ width: '28px', height: '28px', color: '#0a0a0f' }} />
            <span 
              className="font-display font-bold"
              style={{ fontSize: '32px', color: '#0a0a0f' }}
            >
              {discountNum}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Watermark */}
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
        {/* Category */}
        <div className="flex items-center gap-4" style={{ marginBottom: '24px' }}>
          <Crown style={{ width: '28px', height: '28px', color: '#d4af37' }} />
          <span 
            className="uppercase tracking-[0.15em]"
            style={{ fontSize: '20px', color: '#d4af37' }}
          >
            Oportunidade Exclusiva
          </span>
        </div>

        {/* Property name */}
        <h1 
          className="font-display font-semibold leading-tight"
          style={{ fontSize: '68px', color: '#ffffff', marginBottom: '24px' }}
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

        {/* Swipe up indicator */}
        <div className="flex flex-col items-center">
          <div 
            style={{ 
              width: '100px',
              height: '6px',
              background: 'rgba(212,175,55,0.5)',
              borderRadius: '100px',
              marginBottom: '16px'
            }}
          />
          <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>
            ARRASTE PARA VER MAIS
          </span>
        </div>
      </div>
    </div>
  );
};
