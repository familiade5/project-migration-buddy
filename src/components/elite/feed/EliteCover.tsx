import { PropertyData } from '@/types/property';
import { MapPin, Crown } from 'lucide-react';
import { EliteLogo, EliteWatermark } from '../EliteLogo';

interface EliteCoverProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const EliteCover = ({ data, photo }: EliteCoverProps) => {
  return (
    <div className="post-template relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Full bleed photo */}
      {photo ? (
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: `url(${photo})`,
            backgroundSize: 'cover',
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
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0.2) 50%, transparent 70%)'
        }}
      />

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

      {/* Subtle watermark */}
      <EliteWatermark opacity={0.03} />

      {/* Bottom content - no background, styled text */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{ padding: '40px' }}
      >
        {/* Property type badge */}
        <div className="flex items-center gap-4" style={{ marginBottom: '20px' }}>
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
              fontSize: '16px', 
              color: '#d4af37',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)'
            }}
          >
            {data.type || 'Imóvel'} de Alto Padrão
          </span>
        </div>

        {/* Property name */}
        <h1 
          className="font-display font-semibold leading-tight"
          style={{ 
            fontSize: '52px', 
            color: '#ffffff',
            marginBottom: '16px',
            letterSpacing: '-0.02em',
            textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)'
          }}
        >
          {data.propertyName || `${data.type || 'Residência'} Premium`}
        </h1>

        {/* Location with icon */}
        <div className="flex items-center gap-3" style={{ marginBottom: '30px' }}>
          <MapPin style={{ 
            width: '22px', 
            height: '22px', 
            color: '#d4af37',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))'
          }} />
          <span style={{ 
            fontSize: '22px', 
            color: 'rgba(255,255,255,0.95)',
            textShadow: '0 2px 8px rgba(0,0,0,0.9)'
          }}>
            {data.neighborhood}, {data.city} - {data.state}
          </span>
        </div>

        {/* Bottom bar with logo and price */}
        <div className="flex items-center justify-between" style={{ paddingTop: '24px', borderTop: '1px solid rgba(212,175,55,0.4)' }}>
          <EliteLogo size="md" />
          <div className="text-right">
            <p style={{ 
              fontSize: '14px', 
              color: 'rgba(255,255,255,0.7)', 
              marginBottom: '4px',
              textShadow: '0 2px 6px rgba(0,0,0,0.9)'
            }}>A partir de</p>
            <p 
              className="font-display font-semibold"
              style={{ 
                fontSize: '40px', 
                color: '#d4af37',
                textShadow: '0 4px 16px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.8)'
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
