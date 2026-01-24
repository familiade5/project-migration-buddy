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
      style={{ backgroundColor: '#0f172a' }}
    >
      {/* Background Photo (subtle) */}
      {photo && (
        <>
          <div className="absolute inset-0">
            <img 
              src={photo} 
              alt="Property"
              className="w-full h-full object-cover"
              style={{ filter: 'blur(30px)', opacity: 0.15 }}
            />
          </div>
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(15,23,42,0.85)' }}
          />
        </>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-16 text-center">
        {/* Logo - Large */}
        <RevendaLogo size="xxl" />

        {/* Divider */}
        <div 
          className="w-24 h-1 rounded-full my-12"
          style={{ backgroundColor: '#0ea5e9' }}
        />

        {/* Property Info */}
        <div className="mb-12">
          <h2 
            className="font-display font-bold mb-4"
            style={{ fontSize: '44px', color: '#ffffff' }}
          >
            {data.propertyName || `${data.type} em ${data.neighborhood}`}
          </h2>
          
          {getLocationText() && (
            <div className="flex items-center justify-center gap-3">
              <MapPin className="w-5 h-5" style={{ color: '#0ea5e9' }} />
              <span className="text-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {getLocationText()}
              </span>
            </div>
          )}
          
          {data.price && (
            <p 
              className="font-display font-bold mt-6"
              style={{ fontSize: '48px', color: '#0ea5e9' }}
            >
              {data.price}
            </p>
          )}
        </div>

        {/* CTA Box */}
        <div 
          className="rounded-2xl p-10 w-full max-w-lg"
          style={{ 
            background: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(14,165,233,0.05))',
            border: '1px solid rgba(14,165,233,0.3)',
          }}
        >
          <p 
            className="text-sm font-medium uppercase tracking-[0.3em] mb-6"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Agende sua visita
          </p>
          
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(34,197,94,0.2)' }}
              >
                <MessageCircle className="w-7 h-7" style={{ color: '#22c55e' }} />
              </div>
              <div className="text-left">
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>WhatsApp</p>
                <p className="text-xl font-semibold" style={{ color: '#ffffff' }}>{data.contactPhone}</p>
              </div>
            </div>
          </div>

          {data.contactName && (
            <p className="mt-6 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Fale com <span style={{ color: 'rgba(255,255,255,0.7)' }}>{data.contactName}</span>
            </p>
          )}
        </div>

        {/* CRECI */}
        {data.creci && (
          <p 
            className="mt-10 text-xs uppercase tracking-widest"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            {data.creci}
          </p>
        )}
      </div>
    </div>
  );
};
