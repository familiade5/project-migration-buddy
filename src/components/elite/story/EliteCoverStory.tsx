import { PropertyData } from '@/types/property';
import { MapPin, Crown } from 'lucide-react';
import { EliteLogo, EliteWatermark } from '../EliteLogo';

interface EliteCoverStoryProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const EliteCoverStory = ({ data, photo }: EliteCoverStoryProps) => {
  return (
    <div className="post-template-story relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Full bleed photo */}
      {photo ? (
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: `url(${photo})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center top',
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1f] via-[#0f0f14] to-[#0a0a0f]" />
      )}

      {/* Subtle bottom gradient for text legibility */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.2) 55%, transparent 75%)'
        }}
      />

      {/* Top floating badge */}
      <div 
        className="absolute z-20"
        style={{ top: '50px', right: '50px' }}
      >
        <div 
          className="flex items-center gap-3"
          style={{ 
            padding: '16px 28px',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(212,175,55,0.4)',
            borderRadius: '100px'
          }}
        >
          <Crown style={{ width: '24px', height: '24px', color: '#d4af37' }} />
          <span style={{ fontSize: '18px', fontWeight: '600', color: '#d4af37' }}>EXCLUSIVO</span>
        </div>
      </div>

      {/* Subtle watermark */}
      <EliteWatermark opacity={0.03} />

      {/* Bottom content - no background, styled text */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{ padding: '50px' }}
      >
        {/* Property type */}
        <div className="flex items-center gap-4" style={{ marginBottom: '24px' }}>
          <div 
            style={{ 
              width: '50px',
              height: '2px',
              background: 'linear-gradient(90deg, #d4af37, transparent)'
            }}
          />
          <span 
            className="uppercase tracking-[0.2em] font-medium"
            style={{ 
              fontSize: '18px', 
              color: '#d4af37',
              textShadow: '0 2px 8px rgba(0,0,0,0.9)'
            }}
          >
            {data.type || 'Imóvel'} de Alto Padrão
          </span>
        </div>

        {/* Property name */}
        <h1 
          className="font-display font-semibold leading-tight"
          style={{ 
            fontSize: '64px', 
            color: '#ffffff',
            marginBottom: '24px',
            textShadow: '0 4px 24px rgba(0,0,0,0.95), 0 2px 10px rgba(0,0,0,0.9)'
          }}
        >
          {data.propertyName || `${data.type || 'Residência'} Premium`}
        </h1>

        {/* Location */}
        <div className="flex items-center gap-3" style={{ marginBottom: '40px' }}>
          <MapPin style={{ 
            width: '26px', 
            height: '26px', 
            color: '#d4af37',
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.9))'
          }} />
          <span style={{ 
            fontSize: '26px', 
            color: 'rgba(255,255,255,0.95)',
            textShadow: '0 2px 10px rgba(0,0,0,0.95)'
          }}>
            {data.neighborhood}, {data.city} - {data.state}
          </span>
        </div>

        {/* Price and logo bar */}
        <div className="flex items-center justify-between" style={{ paddingTop: '30px', borderTop: '1px solid rgba(212,175,55,0.5)' }}>
          <EliteLogo size="lg" />
          <div className="text-right">
            <p style={{ 
              fontSize: '18px', 
              color: 'rgba(255,255,255,0.8)', 
              marginBottom: '6px',
              textShadow: '0 2px 8px rgba(0,0,0,0.95)'
            }}>A partir de</p>
            <p 
              className="font-display font-semibold"
              style={{ 
                fontSize: '52px', 
                color: '#d4af37',
                textShadow: '0 4px 20px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.9)'
              }}
            >
              {data.minimumValue || 'Consulte'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
