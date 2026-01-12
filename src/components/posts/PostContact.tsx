import { PropertyData } from '@/types/property';
import { MessageCircle } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface PostContactProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostContact = ({ data, photo }: PostContactProps) => {
  return (
    <div className="post-template bg-[#1a1f2e] relative overflow-hidden">
      {/* Layout dividido - Foto à esquerda, CTA à direita */}
      <div className="absolute inset-0 flex">
        {/* Foto à esquerda */}
        <div className="w-[45%] h-full relative">
          {photo ? (
            <div
              className="absolute inset-0 bg-cover bg-center brightness-110"
              style={{ backgroundImage: `url(${photo})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2a3142] to-[#1a1f2e]" />
          )}
          {/* Marca d'água VDH sutil */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/15 font-bold tracking-wider" style={{ fontSize: '120px' }}>VDH</p>
          </div>
        </div>

        {/* CTA à direita */}
        <div className="w-[55%] h-full flex flex-col justify-center items-center bg-[#2a3142]" style={{ padding: '60px' }}>
          {/* Texto principal */}
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <p className="text-white font-semibold" style={{ fontSize: '72px' }}>Seu novo lar</p>
            <p className="text-[#d4a44c] italic" style={{ fontSize: '56px' }}>está mais perto</p>
            <p className="text-[#d4a44c] italic" style={{ fontSize: '56px' }}>do que você imagina</p>
          </div>

          {/* Botão CTA */}
          <div className="bg-[#d4a44c] rounded-lg" style={{ padding: '32px 60px', marginBottom: '80px' }}>
            <span className="text-[#1a1f2e] font-semibold" style={{ fontSize: '40px' }}>Fale agora </span>
            <span className="text-[#1a1f2e]/80" style={{ fontSize: '40px' }}>com nossa equipe</span>
          </div>
        </div>
      </div>

      {/* Footer com logo e WhatsApp */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#1e3a2f] z-10">
        <div className="flex items-center justify-between" style={{ padding: '40px 60px' }}>
          {/* Logo VDH */}
          <div className="flex items-center" style={{ gap: '20px' }}>
            <img src={logoVDH} alt="VDH" className="rounded" style={{ height: '100px' }} />
          </div>

          {/* Separador */}
          <div className="bg-white/30" style={{ height: '80px', width: '2px' }} />

          {/* WhatsApp */}
          <div className="flex items-center" style={{ gap: '20px' }}>
            <MessageCircle className="text-[#25D366]" style={{ width: '60px', height: '60px' }} />
            <span className="text-white font-medium" style={{ fontSize: '48px' }}>
              {data.contactPhone || '(67) 91234-5678'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
