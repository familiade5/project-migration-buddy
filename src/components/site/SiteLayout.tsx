import { ReactNode, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Building2, Instagram, Mail, Menu, MessageCircle, ShieldCheck, X } from 'lucide-react';
import logoVDH from '@/assets/logo-vdh-transparent-cropped.png';
import { whatsappLink } from '@/lib/vdhSite';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  title?: string;
  description?: string;
  whatsapp?: string;
}

export function SiteLayout({ children, title, description, whatsapp }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.title = title ? `${title} | Venda Direta Hoje` : 'Imóveis Caixa com desconto | Venda Direta Hoje';
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute('content', description);
  }, [title, description]);

  return (
    <div className="vdh-site min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-6">
          <Link to="/imoveis" className="flex items-center" aria-label="Venda Direta Hoje — início">
            <img src={logoVDH} alt="Venda Direta Hoje" className="h-9 sm:h-10 w-auto object-contain" />
          </Link>
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-muted-foreground">
            <NavItem to="/imoveis">Encontrar imóvel</NavItem>
            <NavItem to="/imoveis/sobre-nos">Sobre nós</NavItem>
            <NavItem to="/imoveis/perguntas-frequentes">Perguntas frequentes</NavItem>
            <NavItem to="/imoveis/privacidade">Privacidade</NavItem>
          </nav>
          <div className="hidden sm:flex items-center gap-2">
            <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <a href={whatsapp || whatsappLink()} target="_blank" rel="noreferrer"><MessageCircle /> Falar com corretor</a>
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}>
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {menuOpen && <nav className="lg:hidden border-t border-border bg-background px-4 py-4 space-y-1">
          <MobileNav to="/imoveis" close={() => setMenuOpen(false)}>Encontrar imóvel</MobileNav>
          <MobileNav to="/imoveis/sobre-nos" close={() => setMenuOpen(false)}>Sobre nós</MobileNav>
          <MobileNav to="/imoveis/perguntas-frequentes" close={() => setMenuOpen(false)}>Perguntas frequentes</MobileNav>
          <MobileNav to="/imoveis/privacidade" close={() => setMenuOpen(false)}>Privacidade</MobileNav>
          <a href={whatsapp || whatsappLink()} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground"><MessageCircle className="size-4" />Falar com corretor</a>
        </nav>}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-16 border-t border-border bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.35fr]">
            <div>
              <img src={logoVDH} alt="Venda Direta Hoje" className="h-11 w-auto object-contain" />
              <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">Assessoria especializada para encontrar imóveis Caixa com clareza, segurança e acompanhamento em cada etapa.</p>
              <div className="mt-5 flex gap-2">
                <a href="https://www.instagram.com/vendadiretahoje" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-primary transition-colors hover:bg-primary hover:text-primary-foreground"><Instagram className="size-4" /></a>
                <a href={whatsapp || whatsappLink()} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-primary transition-colors hover:bg-primary hover:text-primary-foreground"><MessageCircle className="size-4" /></a>
              </div>
            </div>
            <FooterGroup title="Institucional" links={[['Sobre nós','/imoveis/sobre-nos'],['Perguntas frequentes','/imoveis/perguntas-frequentes'],['Política de privacidade','/imoveis/privacidade']]} />
            <FooterGroup title="Encontre" links={[['Todos os imóveis','/imoveis'],['Aceitam financiamento','/imoveis']]} />
            <div>
              <h3 className="text-sm font-bold text-foreground">Contato</h3>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <a className="flex items-center gap-2 hover:text-primary" href="mailto:contato@vendadiretahoje.com.br"><Mail className="size-4" />contato@vendadiretahoje.com.br</a>
                <a className="flex items-center gap-2 hover:text-primary" href={whatsapp || whatsappLink()} target="_blank" rel="noreferrer"><MessageCircle className="size-4" />(92) 98839-1098</a>
                <p className="flex items-start gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />Atendimento com corretores credenciados</p>
              </div>
            </div>
          </div>
          <div className="mt-10 grid gap-5 border-t border-border pt-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="text-xs leading-5 text-muted-foreground">
              <p>© 2026 Venda Direta Hoje — Todos os direitos reservados.</p>
              <p>CNPJ 50.037.032/0001-30 · CRECI responsável 445 PJ-AM</p>
              <p className="mt-2">CRECI CE 24405 · CRECI PB 1352 · CRECI AM e RR 602 · CRECI SC 8958 · CRECI MS 14851 · CRECI RN 8168</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary"><Building2 className="size-4" /> Imóveis atualizados pela lista oficial da Caixa</div>
          </div>
        </div>
      </footer>
      <a
        href={whatsapp || whatsappLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
}

function NavItem({ to, children }: { to: string; children: ReactNode }) {
  return <NavLink to={to} end={to === '/imoveis'} className={({ isActive }) => `transition-colors hover:text-primary ${isActive ? 'text-primary' : ''}`}>{children}</NavLink>;
}

function MobileNav({ to, close, children }: { to: string; close: () => void; children: ReactNode }) {
  return <Link to={to} onClick={close} className="block rounded-lg px-3 py-3 text-sm font-semibold text-foreground hover:bg-secondary">{children}</Link>;
}

function FooterGroup({ title, links }: { title: string; links: [string, string][] }) {
  return <div><h3 className="text-sm font-bold text-foreground">{title}</h3><ul className="mt-4 space-y-3 text-sm text-muted-foreground">{links.map(([label, to]) => <li key={label}><Link to={to} className="hover:text-primary">{label}</Link></li>)}</ul></div>;
}
