import { ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh-transparent-cropped.png';
import { SITE_GREEN, SITE_GREEN_DARK, SITE_GOLD, whatsappLink } from '@/lib/vdhSite';

interface Props {
  children: ReactNode;
  title?: string;
  description?: string;
  whatsapp?: string;
}

export function SiteLayout({ children, title, description, whatsapp }: Props) {
  useEffect(() => {
    document.title = title ? `${title} | Venda Direta Hoje` : 'Imóveis Caixa com desconto | Venda Direta Hoje';
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute('content', description);
  }, [title, description]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <header className="sticky top-0 z-40" style={{ backgroundColor: SITE_GREEN }}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/imoveis" className="flex items-center gap-2">
            <img src={logoVDH} alt="Venda Direta Hoje" className="h-9 w-auto object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
          </Link>
          <a
            href={whatsapp || whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
            style={{ backgroundColor: SITE_GOLD, color: SITE_GREEN_DARK }}
          >
            <MessageCircle className="w-4 h-4" /> Falar com corretor
          </a>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-12" style={{ backgroundColor: SITE_GREEN_DARK }}>
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
          <p className="font-semibold" style={{ color: '#fff' }}>Venda Direta Hoje</p>
          <p className="mt-1">Imóveis da Caixa atualizados todos os dias. Valores e disponibilidade conforme a lista oficial da Caixa.</p>
          <p className="mt-1">Almir Neto – CRECI 29013 CE · Iury Sampaio – CRECI nacional</p>
        </div>
      </footer>
      <a
        href={whatsapp || whatsappLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{ backgroundColor: '#25D366', color: '#fff' }}
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
}
