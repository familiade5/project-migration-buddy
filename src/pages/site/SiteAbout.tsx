import { Link } from 'react-router-dom';
import { Building2, CheckCircle2, FileSearch, Handshake, MapPin, MessageCircle } from 'lucide-react';
import { SiteLayout } from '@/components/site/SiteLayout';
import { Button } from '@/components/ui/button';
import aboutImage from '@/assets/vdh-sobre-nos.png';
import { whatsappLink } from '@/lib/vdhSite';

export default function SiteAbout() {
  return <SiteLayout title="Sobre nós" description="Conheça a Venda Direta Hoje e nosso atendimento especializado em imóveis Caixa.">
    <section className="border-b border-border bg-secondary">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:py-20">
        <div>
          <p className="text-xs font-bold uppercase text-primary">Quem somos</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">Experiência para transformar oportunidade em conquista.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">A Venda Direta Hoje aproxima pessoas de imóveis Caixa com informação clara, orientação profissional e acompanhamento da escolha até a proposta.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg"><Link to="/imoveis">Encontrar meu imóvel</Link></Button><Button asChild size="lg" variant="outline"><a href={whatsappLink()} target="_blank" rel="noreferrer"><MessageCircle /> Falar com a equipe</a></Button></div>
        </div>
        <img src={aboutImage} alt="Venda Direta Hoje e Caixa Aqui" width={1254} height={1254} className="w-full rounded-lg border border-border bg-card object-cover shadow-lg" />
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
        <div><p className="text-xs font-bold uppercase text-primary">Nosso compromisso</p><h2 className="mt-2 text-3xl font-extrabold text-foreground">Clareza em cada etapa</h2></div>
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            { icon: FileSearch, title: 'Curadoria diária', text: 'Acompanhamos a lista oficial da Caixa para apresentar oportunidades disponíveis.' },
            { icon: Handshake, title: 'Assessoria gratuita', text: 'Orientamos sobre o imóvel, a documentação e o caminho para realizar a proposta.' },
            { icon: Building2, title: 'Análise de crédito', text: 'Quem precisa de financiamento pode solicitar uma pré-análise com nossa equipe.' },
            { icon: MapPin, title: 'Atuação regional', text: 'Atendemos Amazonas, Ceará, Paraíba, Mato Grosso do Sul, Rio Grande do Norte e Santa Catarina.' },
          ].map(({ icon: Icon, title, text }) => <article key={title} className="border-t border-border pt-5"><Icon className="size-6 text-primary" /><h3 className="mt-3 font-bold text-foreground">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></article>)}
        </div>
      </div>
    </section>

    <section className="bg-primary py-14 text-primary-foreground"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-sm font-semibold text-primary-foreground/70">Seu sonho, nosso compromisso.</p><h2 className="mt-1 text-3xl font-extrabold">Encontre uma oportunidade para chamar de sua.</h2></div><Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/imoveis"><CheckCircle2 /> Ver imóveis disponíveis</Link></Button></div></section>
  </SiteLayout>;
}