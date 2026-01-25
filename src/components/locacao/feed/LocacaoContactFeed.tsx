// Feed slide: Contact - simple CTA
import { LocacaoPropertyData } from '@/types/locacao';
import { LocacaoLogoBar } from '../LocacaoLogo';
import { MessageCircle } from 'lucide-react';

interface LocacaoContactFeedProps {
  data: LocacaoPropertyData;
  photo?: string | null;
}

export const LocacaoContactFeed = ({ data, photo }: LocacaoContactFeedProps) => {
  return (
    <div 
      className="relative w-[1080px] h-[1080px] overflow-hidden"
      style={{ backgroundColor: '#1f2937' }}
    >
      {/* Background Photo (subtle) */}
      {photo && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${photo})`, opacity: 0.3 }}
          />
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(17,24,39,0.7)' }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-16 text-center">
        {/* Header */}
        <p 
          className="text-3xl mb-6"
          style={{ color: '#9ca3af' }}
        >
          Agende uma visita
        </p>

        <h2 
          className="text-6xl font-semibold mb-16"
          style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}
        >
          Entre em Contato
        </h2>

        {/* Contact Card */}
        <div 
          className="p-12 rounded-2xl"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <p 
            className="text-3xl font-medium mb-3"
            style={{ color: '#ffffff' }}
          >
            {data.contactName || 'Consultor'}
          </p>
          
          {data.creci && (
            <p 
              className="text-lg mb-8"
              style={{ color: '#9ca3af' }}
            >
              {data.creci}
            </p>
          )}

          <div className="flex items-center justify-center gap-4">
            <MessageCircle className="w-8 h-8" style={{ color: '#d1d5db' }} />
            <span 
              className="text-4xl font-semibold"
              style={{ color: '#ffffff' }}
            >
              {data.contactPhone || '(00) 00000-0000'}
            </span>
          </div>
        </div>

        {/* Availability */}
        {data.availableFrom && (
          <p 
            className="mt-12 text-xl"
            style={{ color: '#6b7280' }}
          >
            {data.availableFrom}
          </p>
        )}
      </div>

      {/* Logo */}
      <LocacaoLogoBar />
    </div>
  );
};
