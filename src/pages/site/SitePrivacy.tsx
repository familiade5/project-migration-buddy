import { Mail, ShieldCheck } from 'lucide-react';
import { SiteLayout } from '@/components/site/SiteLayout';

const sections = [
  ['Quais dados coletamos', 'Quando você solicita uma pré-análise, podemos receber os dados informados no formulário, como nome, telefone, e-mail, CPF, renda, situação profissional e os documentos que você decidir anexar. Também registramos o imóvel de seu interesse.'],
  ['Como usamos as informações', 'Usamos os dados para atender sua solicitação, realizar a pré-análise de crédito imobiliário, conferir documentos, entrar em contato e encaminhar o atendimento à equipe responsável pelas vendas.'],
  ['Documentos e acesso', 'Os documentos enviados são destinados à análise solicitada. O acesso é restrito à equipe autorizada envolvida no atendimento e na avaliação da documentação.'],
  ['Compartilhamento', 'As informações podem ser compartilhadas quando necessário para executar a análise e o atendimento solicitado, cumprir obrigações legais ou proteger direitos. Não comercializamos seus dados pessoais.'],
  ['Seus direitos', 'Você pode solicitar confirmação sobre o tratamento, acesso, correção ou exclusão de dados, quando aplicável, além de retirar um consentimento concedido. Algumas informações poderão ser mantidas quando houver obrigação legal ou necessidade legítima de registro do atendimento.'],
  ['Cuidados ao enviar documentos', 'Envie documentos somente pelo formulário oficial deste site ou pelos canais confirmados pela equipe. Nunca informe senhas bancárias, códigos de autenticação ou senhas de aplicativos.'],
];

export default function SitePrivacy() {
  return <SiteLayout title="Política de Privacidade" description="Saiba como a Venda Direta Hoje utiliza os dados enviados em pedidos de pré-análise e atendimento.">
    <section className="border-b border-border bg-secondary"><div className="mx-auto max-w-4xl px-4 py-14 sm:px-6"><div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground"><ShieldCheck className="size-6" /></div><h1 className="mt-5 text-4xl font-extrabold text-foreground sm:text-5xl">Política de Privacidade</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">Transparência sobre as informações usadas no atendimento e na pré-análise de crédito imobiliário.</p><p className="mt-3 text-sm text-muted-foreground">Última atualização: 2 de outubro de 2026.</p></div></section>
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6"><div className="space-y-10">{sections.map(([title, text]) => <article key={title} className="border-b border-border pb-9"><h2 className="text-xl font-bold text-foreground">{title}</h2><p className="mt-3 leading-7 text-muted-foreground">{text}</p></article>)}<article className="rounded-lg bg-secondary p-6"><h2 className="text-xl font-bold text-foreground">Contato sobre privacidade</h2><p className="mt-2 text-muted-foreground">Para dúvidas ou solicitações relacionadas aos seus dados, fale com a Venda Direta Hoje.</p><a href="mailto:contato@vendadiretahoje.com.br" className="mt-4 inline-flex items-center gap-2 font-semibold text-primary"><Mail className="size-4" /> contato@vendadiretahoje.com.br</a></article></div></section>
  </SiteLayout>;
}