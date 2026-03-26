import { PropertyData } from '@/types/property';
import { MessageCircle } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh-transparent.png';
import { useLogoBase64 } from '@/hooks/useLogoBase64';

interface PostContactProps {
  data: PropertyData;
  photo: string | null;
  photos?: string[];
}

export const PostContact = ({ data, photo }: PostContactProps) => {
  const logoBase64 = useLogoBase64(logoVDH);
  const GRAY_BG = '#2a2a2a';

  return (
    <div className="post-template relative overflow-hidden" style={{ backgroundColor: GRAY_BG }}>
      {/* Background photo with heavy dark overlay */}
      {photo && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${photo})`, filter: 'brightness(0.25) blur(6px)', transform: 'scale(1.1)' }}
        />
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ padding: '80px 70px 200px' }}>
        {/* Logo grande */}
        <div style={{ marginBottom: '50px' }}>
          <img src={logoBase64} alt="VDH" style={{ height: 180, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
        </div>

        {/* Linha decorativa */}
        <div style={{ width: 120, height: 3, backgroundColor: '#d4a44c', marginBottom: 40 }} />

        {/* Frase principal */}
        <p className="text-white text-center font-light" style={{ fontSize: 48, lineHeight: '64px', maxWidth: 850, letterSpacing: '0.5px' }}>
          Essa pode ser a{' '}
          <span className="font-bold" style={{ color: '#d4a44c' }}>oportunidade</span>{' '}
          que você estava esperando para começar a{' '}
          <span className="font-bold" style={{ color: '#d4a44c' }}>lucrar</span>{' '}
          no mercado imobiliário.
        </p>

        {/* Linha decorativa inferior */}
        <div style={{ width: 120, height: 3, backgroundColor: '#d4a44c', marginTop: 40, marginBottom: 44 }} />

        {/* CTA Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          backgroundColor: '#25D366',
          borderRadius: 14,
          padding: '22px 48px',
        }}>
          <MessageCircle style={{ width: 40, height: 40, color: '#fff' }} />
          <span className="text-white font-bold" style={{ fontSize: 36, letterSpacing: '1px', textTransform: 'uppercase' }}>
            Fale com um especialista
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0" style={{ backgroundColor: '#1e3a2f' }}>
        <div className="flex items-center justify-center" style={{ padding: '28px 60px', gap: 40 }}>
          {/* WhatsApp */}
          <div className="flex items-center" style={{ gap: 16 }}>
            <MessageCircle style={{ width: 48, height: 48, color: '#25D366' }} />
            <span className="text-white font-semibold" style={{ fontSize: 42 }}>
              {data.contactPhone || '(67) 91234-5678'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
