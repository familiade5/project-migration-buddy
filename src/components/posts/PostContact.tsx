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
            <p className="text-white/15 text-4xl font-bold tracking-wider">VDH</p>
          </div>
        </div>

        {/* CTA à direita */}
        <div className="w-[55%] h-full flex flex-col justify-center items-center p-6 bg-[#2a3142]">
          {/* Texto principal */}
          <div className="text-center mb-6">
            <p className="text-white text-2xl font-semibold">Seu novo lar</p>
            <p className="text-[#d4a44c] text-xl italic">está mais perto</p>
            <p className="text-[#d4a44c] text-xl italic">do que você imagina</p>
          </div>

          {/* Botão CTA */}
          <div className="bg-[#d4a44c] rounded-lg py-3 px-6 mb-8">
            <span className="text-[#1a1f2e] font-semibold">Fale agora </span>
            <span className="text-[#1a1f2e]/80">com nossa equipe</span>
          </div>
        </div>
      </div>

      {/* Footer com logo e WhatsApp */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#1e3a2f] z-10">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo VDH */}
          <div className="flex items-center gap-2">
            <img src={logoVDH} alt="VDH" className="h-10 w-auto rounded" />
          </div>

          {/* Separador */}
          <div className="h-8 w-px bg-white/30" />

          {/* WhatsApp */}
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-[#25D366]" />
            <span className="text-white font-medium text-lg">
              {data.contactPhone || '(67) 91234-5678'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
