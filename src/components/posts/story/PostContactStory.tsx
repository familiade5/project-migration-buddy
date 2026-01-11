import { PropertyData } from '@/types/property';
import { MessageCircle } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface PostContactStoryProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostContactStory = ({ data, photo }: PostContactStoryProps) => {
  return (
    <div className="post-template-story bg-[#1a1f2e] relative overflow-hidden">
      {/* Foto na parte superior - 50% */}
      <div className="absolute top-0 left-0 right-0 h-[50%]">
        {photo ? (
          <div
            className="absolute inset-0 bg-cover bg-center brightness-110"
            style={{ backgroundImage: `url(${photo})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a3142] to-[#1a1f2e]" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white/15 text-6xl font-bold tracking-wider">VDH</p>
        </div>
      </div>

      {/* CTA na parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-[#2a3142] flex flex-col justify-center items-center p-6">
        {/* Texto principal */}
        <div className="text-center mb-8">
          <p className="text-white text-3xl font-semibold">Seu novo lar</p>
          <p className="text-[#d4a44c] text-2xl italic">está mais perto</p>
          <p className="text-[#d4a44c] text-2xl italic">do que você imagina</p>
        </div>

        {/* Botão CTA */}
        <div className="bg-[#d4a44c] rounded-lg py-4 px-8 mb-6">
          <span className="text-[#1a1f2e] font-semibold text-lg">Fale agora </span>
          <span className="text-[#1a1f2e]/80 text-lg">com nossa equipe</span>
        </div>

        {/* WhatsApp */}
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="w-8 h-8 text-[#25D366]" />
          <span className="text-white font-medium text-xl">
            {data.contactPhone || '(67) 91234-5678'}
          </span>
        </div>
      </div>

      {/* Footer com logo */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#1e3a2f] z-10">
        <div className="flex items-center justify-center py-3">
          <img src={logoVDH} alt="VDH" className="h-10 w-auto rounded" />
        </div>
      </div>
    </div>
  );
};
