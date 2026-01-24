// Story slide 4: Contact CTA
import { LocacaoPropertyData } from '@/types/locacao';
import { LocacaoLogoBarStory } from '../LocacaoLogo';
import { MessageCircle } from 'lucide-react';

interface LocacaoContactStoryProps {
  data: LocacaoPropertyData;
  photo?: string | null;
}

export const LocacaoContactStory = ({ data, photo }: LocacaoContactStoryProps) => {
  return (
    <div 
      className="relative w-[1080px] h-[1920px] overflow-hidden"
      style={{ backgroundColor: '#1f2937' }}
    >
      {/* Background */}
      {photo && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${photo})` }}
          />
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(17,24,39,0.8)' }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-12 text-center">
        <p 
          className="text-2xl mb-4"
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
          className="p-10 rounded-2xl"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <p 
            className="text-3xl font-medium mb-2"
            style={{ color: '#ffffff' }}
          >
            {data.contactName || 'Consultor'}
          </p>
          
          {data.creci && (
            <p 
              className="text-base mb-8"
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
      <LocacaoLogoBarStory />
    </div>
  );
};
