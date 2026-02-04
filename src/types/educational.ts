export type EducationalCategory = 'tips' | 'process' | 'stories' | 'institutional';

export interface EducationalTopic {
  id: string;
  category: EducationalCategory;
  title: string;
  description: string;
  icon: string;
  defaultSlides: EducationalSlide[];
}

export interface EducationalSlide {
  type: 'cover' | 'content' | 'highlight' | 'cta';
  headline: string;
  body?: string;
  bullets?: string[];
  icon?: string;
}

export interface EducationalPostData {
  category: EducationalCategory;
  topicId: string;
  customTitle: string;
  slides: EducationalSlide[];
  contactName: string;
  contactPhone: string;
  creci: string;
}

export const categoryLabels: Record<EducationalCategory, string> = {
  tips: 'Dicas Educativas',
  process: 'Nosso Processo',
  stories: 'Histórias Reais',
  institutional: 'Institucional',
};

export const categoryDescriptions: Record<EducationalCategory, string> = {
  tips: 'Conteúdo educativo sobre compra de imóveis Caixa',
  process: 'Explicação do nosso processo de trabalho',
  stories: 'Cases e histórias de sucesso com clientes',
  institutional: 'Posicionamento e autoridade da marca',
};

export const defaultTopics: EducationalTopic[] = [
  // TIPS CATEGORY
  {
    id: 'tip-what-is-caixa',
    category: 'tips',
    title: 'O que são Imóveis Caixa?',
    description: 'Explique o que são e por que são uma oportunidade',
    icon: 'HelpCircle',
    defaultSlides: [
      { type: 'cover', headline: 'Você sabe o que são\nImóveis Caixa?' },
      { type: 'content', headline: 'São imóveis retomados', body: 'A Caixa Econômica Federal retoma imóveis de financiamentos não pagos e os vende com descontos significativos.' },
      { type: 'content', headline: 'Por que são mais baratos?', bullets: ['Imóveis precisam ser vendidos rapidamente', 'Não há intermediários', 'Descontos de até 40% do valor de mercado'] },
      { type: 'content', headline: 'Qualquer pessoa pode comprar', body: 'Você não precisa ser cliente Caixa. Os imóveis estão disponíveis para qualquer pessoa física ou jurídica.' },
      { type: 'highlight', headline: 'Oportunidade real', body: 'Milhares de brasileiros já realizaram o sonho da casa própria comprando imóveis Caixa com segurança.' },
      { type: 'cta', headline: 'Quer saber mais?', body: 'Fale com a gente e tire suas dúvidas sem compromisso.' },
    ],
  },
  {
    id: 'tip-fgts',
    category: 'tips',
    title: 'Como usar FGTS na compra',
    description: 'Passo a passo do uso do FGTS',
    icon: 'Wallet',
    defaultSlides: [
      { type: 'cover', headline: 'Você pode usar seu\nFGTS na compra!' },
      { type: 'content', headline: 'Requisitos básicos', bullets: ['3 anos de trabalho com carteira assinada', 'Não ter financiamento ativo pelo SFH', 'Imóvel deve ser para moradia'] },
      { type: 'content', headline: 'Como funciona', body: 'O FGTS pode ser usado como entrada ou para abater o valor total do imóvel, reduzindo parcelas ou quitando de vez.' },
      { type: 'content', headline: 'Vantagem extra', body: 'Muitos imóveis Caixa aceitam FGTS + Financiamento, permitindo comprar com entrada mínima.' },
      { type: 'cta', headline: 'Consulte seu saldo', body: 'A gente te ajuda a verificar se você pode usar o FGTS. Fale conosco!' },
    ],
  },
  {
    id: 'tip-myths',
    category: 'tips',
    title: 'Mitos sobre Imóveis Caixa',
    description: 'Derrube os mitos mais comuns',
    icon: 'ShieldAlert',
    defaultSlides: [
      { type: 'cover', headline: '5 Mitos sobre\nImóveis Caixa' },
      { type: 'content', headline: '❌ "São imóveis ruins"', body: '✅ A qualidade varia. Muitos estão em ótimo estado e em boas localizações.' },
      { type: 'content', headline: '❌ "É muito burocrático"', body: '✅ Com assessoria, o processo é simples e seguro.' },
      { type: 'content', headline: '❌ "Só pode comprar à vista"', body: '✅ A maioria aceita financiamento e FGTS.' },
      { type: 'content', headline: '❌ "Demora para ter a chave"', body: '✅ Em média 60-90 dias após aprovação.' },
      { type: 'cta', headline: 'Ainda tem dúvidas?', body: 'Vamos conversar e esclarecer tudo!' },
    ],
  },
  {
    id: 'tip-financing',
    category: 'tips',
    title: 'Financiamento Caixa explicado',
    description: 'Como funciona o financiamento',
    icon: 'Calculator',
    defaultSlides: [
      { type: 'cover', headline: 'Como funciona o\nFinanciamento Caixa?' },
      { type: 'content', headline: 'Taxas competitivas', body: 'A Caixa oferece algumas das menores taxas do mercado para financiamento imobiliário.' },
      { type: 'content', headline: 'Prazos longos', bullets: ['Até 35 anos para pagar', 'Parcelas que cabem no bolso', 'Use até 30% da renda'] },
      { type: 'content', headline: 'Documentação simples', bullets: ['RG e CPF', 'Comprovante de renda', 'Comprovante de residência'] },
      { type: 'cta', headline: 'Simule agora', body: 'Descubra quanto você pode financiar. Fale conosco!' },
    ],
  },

  // PROCESS CATEGORY
  {
    id: 'process-complete',
    category: 'process',
    title: 'Da busca às chaves',
    description: 'Nosso processo completo explicado',
    icon: 'Route',
    defaultSlides: [
      { type: 'cover', headline: 'Da busca às chaves:\nComo funciona?' },
      { type: 'content', headline: '1. Entendemos você', body: 'Conversamos para entender seu perfil, orçamento e o que você busca em um imóvel.' },
      { type: 'content', headline: '2. Buscamos opções', body: 'Filtramos os melhores imóveis Caixa disponíveis que se encaixam no seu perfil.' },
      { type: 'content', headline: '3. Analisamos juntos', body: 'Apresentamos as opções com todos os detalhes: localização, estado, valores e formas de pagamento.' },
      { type: 'content', headline: '4. Cuidamos da burocracia', body: 'Preparamos toda documentação e acompanhamos o processo até a aprovação.' },
      { type: 'highlight', headline: '5. Chaves na mão!', body: 'Você recebe as chaves do seu novo imóvel com total segurança.' },
      { type: 'cta', headline: 'Comece agora', body: 'O primeiro passo é uma conversa. Fale com a gente!' },
    ],
  },
  {
    id: 'process-why-us',
    category: 'process',
    title: 'Por que ter assessoria?',
    description: 'Vantagens de comprar com especialistas',
    icon: 'Users',
    defaultSlides: [
      { type: 'cover', headline: 'Por que ter uma\nassessoria especializada?' },
      { type: 'content', headline: 'Conhecimento técnico', body: 'Entendemos as regras, editais e particularidades de cada tipo de venda Caixa.' },
      { type: 'content', headline: 'Economia de tempo', body: 'Você não precisa passar horas pesquisando. Filtramos o que realmente vale a pena.' },
      { type: 'content', headline: 'Segurança jurídica', body: 'Verificamos toda documentação e situação do imóvel antes de você investir.' },
      { type: 'content', headline: 'Acompanhamento total', body: 'Estamos com você do início ao fim, resolvendo qualquer problema que surgir.' },
      { type: 'cta', headline: 'Sem custo adicional', body: 'Nossa assessoria é gratuita para você. Fale conosco!' },
    ],
  },

  // STORIES CATEGORY
  {
    id: 'story-first-home',
    category: 'stories',
    title: 'Primeiro imóvel próprio',
    description: 'História de conquista da casa própria',
    icon: 'Home',
    defaultSlides: [
      { type: 'cover', headline: 'A história de quem\nrealizou o sonho' },
      { type: 'content', headline: 'O desafio', body: 'Como muitos brasileiros, nosso cliente achava impossível comprar um imóvel com a renda que tinha.' },
      { type: 'content', headline: 'A descoberta', body: 'Conheceu os imóveis Caixa e viu que existiam opções reais dentro do seu orçamento.' },
      { type: 'content', headline: 'O processo', body: 'Com nossa assessoria, encontrou um apartamento perfeito com 35% de desconto e financiou com FGTS.' },
      { type: 'highlight', headline: 'O resultado', body: 'Hoje mora no seu próprio apartamento pagando menos do que pagava de aluguel.' },
      { type: 'cta', headline: 'Sua história também', body: 'Pode ser a sua vez. Vamos conversar?' },
    ],
  },
  {
    id: 'story-investment',
    category: 'stories',
    title: 'Investimento inteligente',
    description: 'Case de investidor que multiplicou patrimônio',
    icon: 'TrendingUp',
    defaultSlides: [
      { type: 'cover', headline: 'De investidor iniciante\na dono de patrimônio' },
      { type: 'content', headline: 'A visão', body: 'Nosso cliente queria sair do aluguel e ainda começar a investir em imóveis.' },
      { type: 'content', headline: 'A estratégia', body: 'Comprou um imóvel Caixa para morar e, um ano depois, já tinha guardado para o segundo.' },
      { type: 'content', headline: 'O crescimento', body: 'Hoje possui 3 imóveis: mora em um e aluga os outros dois, gerando renda passiva.' },
      { type: 'highlight', headline: 'Patrimônio sólido', body: 'Em 4 anos, construiu um patrimônio que levaria décadas pelo caminho tradicional.' },
      { type: 'cta', headline: 'Comece pequeno', body: 'Todo grande investidor começou com o primeiro passo. Fale conosco!' },
    ],
  },

  // INSTITUTIONAL CATEGORY
  {
    id: 'inst-who-we-are',
    category: 'institutional',
    title: 'Quem somos',
    description: 'Apresentação da empresa e valores',
    icon: 'Building',
    defaultSlides: [
      { type: 'cover', headline: 'Especialistas em\nImóveis Caixa' },
      { type: 'content', headline: 'Nossa missão', body: 'Democratizar o acesso à casa própria através de imóveis Caixa com assessoria profissional e humanizada.' },
      { type: 'content', headline: 'O que nos move', bullets: ['Transparência em cada etapa', 'Comprometimento com seu sonho', 'Conhecimento técnico aprofundado'] },
      { type: 'content', headline: 'Nossos números', bullets: ['+ de 200 famílias atendidas', 'Anos de experiência no mercado', 'Índice de satisfação acima de 95%'] },
      { type: 'cta', headline: 'Conheça a gente', body: 'Venha tomar um café e conhecer nossa equipe!' },
    ],
  },
  {
    id: 'inst-difference',
    category: 'institutional',
    title: 'Nosso diferencial',
    description: 'O que nos torna únicos no mercado',
    icon: 'Award',
    defaultSlides: [
      { type: 'cover', headline: 'Por que somos\ndiferentes?' },
      { type: 'content', headline: 'Especialização', body: 'Não fazemos de tudo. Somos especialistas em imóveis Caixa, e isso faz toda diferença.' },
      { type: 'content', headline: 'Acompanhamento real', body: 'Você fala direto com quem entende. Sem robôs, sem enrolação.' },
      { type: 'content', headline: 'Sem surpresas', body: 'Explicamos tudo antes: custos, prazos, riscos. Você decide com informação.' },
      { type: 'highlight', headline: 'Seu sucesso é nosso', body: 'Só ganhamos quando você realiza seu sonho. Nossos interesses estão alinhados.' },
      { type: 'cta', headline: 'Comprove', body: 'Fale com nossos clientes. Eles contam a verdade.' },
    ],
  },
];

export const defaultEducationalPostData: EducationalPostData = {
  category: 'tips',
  topicId: 'tip-what-is-caixa',
  customTitle: '',
  slides: defaultTopics[0].defaultSlides,
  contactName: '',
  contactPhone: '',
  creci: '',
};
