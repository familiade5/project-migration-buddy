import { RevendaPropertyData } from '@/types/revenda';
import { RevendaLogo } from '../RevendaLogo';
import { MessageCircle, Phone, ArrowRight } from 'lucide-react';

interface RevendaContactStoryProps {
  data: RevendaPropertyData;
  photo: string | null;
}

export const RevendaContactStory = ({ data, photo }: RevendaContactStoryProps) => {
  return (
    <div 
      className="relative w-[1080px] h-[1920px] overflow-hidden"
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
              style={{ filter: 'blur(30px)', opacity: 0.2 }}
            />
          </div>
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(to bottom, rgba(15,23,42,0.9), rgba(15,23,42,0.95))',
            }}
          />
        </>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-12">
        {/* Logo */}
        <RevendaLogo size="xxl" variant="full" dark />

        {/* Divider */}
        <div 
          className="w-32 h-1 rounded-full my-16"
          style={{ backgroundColor: '#0ea5e9' }}
        />

        {/* CTA Text */}
        <h2 
          className="font-display font-bold text-center leading-tight mb-6"
          style={{ fontSize: '56px', color: '#ffffff' }}
        >
          Agende sua visita
        </h2>
        <p 
          className="text-center text-xl mb-16 max-w-lg"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          Conheça pessoalmente este imóvel e descubra seu novo lar
        </p>

        {/* WhatsApp Button */}
        <div 
          className="flex items-center gap-6 px-12 py-8 rounded-2xl mb-8"
          style={{ 
            backgroundColor: '#22c55e',
            boxShadow: '0 20px 40px rgba(34,197,94,0.3)',
          }}
        >
          <MessageCircle className="w-12 h-12" style={{ color: '#ffffff' }} />
          <div>
            <p className="text-lg" style={{ color: 'rgba(255,255,255,0.8)' }}>WhatsApp</p>
            <p 
              className="font-bold"
              style={{ fontSize: '36px', color: '#ffffff' }}
            >
              {data.contactPhone}
            </p>
          </div>
        </div>

        {/* Direct Message CTA */}
        <div 
          className="flex items-center gap-4 mt-8"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          <ArrowRight className="w-6 h-6" />
          <span className="text-xl uppercase tracking-widest">
            ou chame no Direct
          </span>
          <ArrowRight className="w-6 h-6" />
        </div>

        {/* Agent Info */}
        {data.contactName && (
          <div className="mt-16 text-center">
            <p className="text-lg" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Fale com
            </p>
            <p 
              className="text-2xl font-medium mt-2"
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              {data.contactName}
            </p>
          </div>
        )}

        {/* CRECI */}
        {data.creci && (
          <p 
            className="absolute bottom-12 text-sm uppercase tracking-widest"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            {data.creci}
          </p>
        )}
      </div>
    </div>
  );
};
