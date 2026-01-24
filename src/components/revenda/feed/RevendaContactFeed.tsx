import { RevendaPropertyData } from '@/types/revenda';
import { RevendaLogo } from '../RevendaLogo';
import { Phone, MessageCircle, MapPin } from 'lucide-react';

interface RevendaContactFeedProps {
  data: RevendaPropertyData;
  photo: string | null;
}

export const RevendaContactFeed = ({ data, photo }: RevendaContactFeedProps) => {
  const getLocationText = () => {
    const parts = [data.neighborhood, data.city, data.state].filter(Boolean);
    return parts.join(' • ');
  };

  return (
    <div 
      className="relative w-[1080px] h-[1080px] overflow-hidden"
      style={{ backgroundColor: '#ffffff' }}
    >
      {/* Background Photo (subtle) */}
      {photo && (
        <>
          <div className="absolute inset-0">
            <img 
              src={photo} 
              alt="Property"
              className="w-full h-full object-cover"
              style={{ filter: 'blur(20px)', opacity: 0.15 }}
            />
          </div>
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
          />
        </>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-16 text-center">
        {/* Logo */}
        <RevendaLogo size="xl" variant="full" />

        {/* Property Info */}
        <div className="mt-12 mb-10 space-y-3">
          <h2 
            className="font-display font-bold"
            style={{ fontSize: '38px', color: '#0f172a' }}
          >
            {data.propertyName || `${data.type} em ${data.neighborhood}`}
          </h2>
          
          {getLocationText() && (
            <div className="flex items-center justify-center gap-2" style={{ color: '#64748b' }}>
              <MapPin className="w-5 h-5" style={{ color: '#0ea5e9' }} />
              <span className="text-lg">{getLocationText()}</span>
            </div>
          )}
          
          {data.price && (
            <p 
              className="font-display font-bold mt-4"
              style={{ fontSize: '44px', color: '#0ea5e9' }}
            >
              {data.price}
            </p>
          )}
        </div>

        {/* CTA Box */}
        <div 
          className="rounded-2xl p-8 w-full max-w-lg"
          style={{ 
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
          }}
        >
          <p 
            className="text-sm font-medium uppercase tracking-widest mb-4"
            style={{ color: '#94a3b8' }}
          >
            Agende sua visita
          </p>
          
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#dcfce7' }}
              >
                <MessageCircle className="w-6 h-6" style={{ color: '#22c55e' }} />
              </div>
              <div className="text-left">
                <p className="text-sm" style={{ color: '#64748b' }}>WhatsApp</p>
                <p className="font-semibold" style={{ color: '#0f172a' }}>{data.contactPhone}</p>
              </div>
            </div>
          </div>

          {data.contactName && (
            <p className="mt-4 text-sm" style={{ color: '#94a3b8' }}>
              Fale com <span style={{ color: '#475569' }}>{data.contactName}</span>
            </p>
          )}
        </div>

        {/* CRECI */}
        {data.creci && (
          <p 
            className="mt-8 text-xs uppercase tracking-wide"
            style={{ color: '#94a3b8' }}
          >
            {data.creci}
          </p>
        )}
      </div>
    </div>
  );
};
