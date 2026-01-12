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
          <p className="text-white/15 font-bold tracking-wider" style={{ fontSize: '180px' }}>VDH</p>
        </div>
      </div>

      {/* CTA na parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-[#2a3142] flex flex-col justify-center items-center" style={{ padding: '60px' }}>
        {/* Texto principal */}
        <div className="text-center" style={{ marginBottom: '80px' }}>
          <p className="text-white font-semibold" style={{ fontSize: '80px' }}>Seu novo lar</p>
          <p className="text-[#d4a44c] italic" style={{ fontSize: '64px' }}>está mais perto</p>
          <p className="text-[#d4a44c] italic" style={{ fontSize: '64px' }}>do que você imagina</p>
        </div>

        {/* Botão CTA */}
        <div className="bg-[#d4a44c] rounded-lg" style={{ padding: '40px 80px', marginBottom: '60px' }}>
          <span className="text-[#1a1f2e] font-semibold" style={{ fontSize: '48px' }}>Fale agora </span>
          <span className="text-[#1a1f2e]/80" style={{ fontSize: '48px' }}>com nossa equipe</span>
        </div>

        {/* WhatsApp */}
        <div className="flex items-center" style={{ gap: '30px', marginBottom: '40px' }}>
          <MessageCircle className="text-[#25D366]" style={{ width: '80px', height: '80px' }} />
          <span className="text-white font-medium" style={{ fontSize: '56px' }}>
            {data.contactPhone || '(67) 91234-5678'}
          </span>
        </div>
      </div>

      {/* Footer com logo */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#1e3a2f] z-10">
        <div className="flex items-center justify-center" style={{ padding: '30px' }}>
          <img src={logoVDH} alt="VDH" className="rounded" style={{ height: '100px' }} />
        </div>
      </div>
    </div>
  );
};
