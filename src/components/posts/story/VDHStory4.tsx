import { PropertyData } from '@/types/property';
import { MessageCircle, Clock } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh.jpg';

interface VDHStory4Props {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const VDHStory4 = ({ data, photo }: VDHStory4Props) => {
  return (
    <div className="post-template-story bg-[#2a3444] relative overflow-hidden">
      {/* Foto na parte superior com overlay */}
      <div className="absolute top-0 left-0 right-0 h-[40%]">
        {photo ? (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${photo})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#4a5565] to-[#3a4555]" />
        )}
        {/* Overlay gradiente escuro */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-[#2a3444]" />
      </div>

      {/* Badge de urgência */}
      <div className="absolute z-20 flex items-center gap-3" style={{ top: '50px', left: '50px' }}>
        <div className="bg-[#e87722] rounded-full flex items-center gap-2" style={{ padding: '12px 24px' }}>
          <Clock className="text-white" style={{ width: '28px', height: '28px' }} />
          <span className="text-white font-semibold" style={{ fontSize: '24px' }}>Oportunidade Única</span>
        </div>
      </div>

      {/* Marca d'água VDH */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <p className="text-white font-bold tracking-wider" style={{ fontSize: '250px' }}>VDH</p>
      </div>

      {/* Conteúdo CTA principal */}
      <div className="absolute z-10 flex flex-col items-center justify-center" style={{ top: '42%', left: '50px', right: '50px' }}>
        {/* Texto de urgência */}
        <div className="text-center mb-6">
          <p className="text-white font-bold" style={{ fontSize: '52px' }}>
            Não perca essa
          </p>
          <p className="text-[#f5d485] font-black" style={{ fontSize: '64px' }}>
            OPORTUNIDADE!
          </p>
        </div>

        {/* Alertas de urgência */}
        <div className="flex flex-col gap-3 mb-8 w-full">
          <div className="bg-[#dc2626]/90 rounded-xl text-center" style={{ padding: '18px' }}>
            <p className="text-white font-bold" style={{ fontSize: '28px' }}>
              ⚡ Imóvel sujeito a disponibilidade
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl text-center" style={{ padding: '18px' }}>
            <p className="text-white font-semibold" style={{ fontSize: '26px' }}>
              Condições exclusivas por tempo limitado
            </p>
          </div>
        </div>

        {/* Preço destacado */}
        <div className="bg-[#1e3a2f] rounded-2xl text-center mb-6 w-full" style={{ padding: '25px' }}>
          <p className="text-[#f5d485] font-bold" style={{ fontSize: '52px' }}>
            {data.minimumValue || 'Consulte'}
          </p>
        </div>

        {/* Botão CTA WhatsApp */}
        <div 
          className="bg-[#25D366] rounded-2xl flex items-center justify-center gap-4 shadow-xl cursor-pointer hover:bg-[#20bd5a] transition-colors w-full"
          style={{ padding: '30px' }}
        >
          <MessageCircle className="text-white" style={{ width: '50px', height: '50px' }} />
          <div>
            <p className="text-white font-bold" style={{ fontSize: '38px' }}>FALE AGORA!</p>
            <p className="text-white/90" style={{ fontSize: '22px' }}>{data.contactPhone || '(92) 98839-1098'}</p>
          </div>
        </div>
      </div>

      {/* Footer com logo e CRECI */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#1a2433] z-10" style={{ padding: '30px 50px' }}>
        <div className="flex items-center justify-between">
          <img 
            src={logoVDH} 
            alt="VDH" 
            className="object-contain rounded"
            style={{ height: '60px' }}
          />
          <p className="text-white/60" style={{ fontSize: '20px' }}>
            {data.creci || 'CRECI 14851 MS PJ'}
          </p>
        </div>
      </div>
    </div>
  );
};
