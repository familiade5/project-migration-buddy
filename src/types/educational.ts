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

// Content variations for each category - used for generating new content
export const contentVariations: Record<EducationalCategory, EducationalSlide[][]> = {
  tips: [
    // Variation 1 - Documentação necessária
    [
      { type: 'cover', headline: 'Documentos para\ncomprar Imóvel Caixa' },
      { type: 'content', headline: 'Documentos pessoais', bullets: ['RG e CPF', 'Comprovante de estado civil', 'Comprovante de residência atualizado'] },
      { type: 'content', headline: 'Comprovação de renda', body: 'Holerites dos últimos 3 meses, declaração de IR ou extrato bancário para autônomos.' },
      { type: 'content', headline: 'Para usar FGTS', bullets: ['Carteira de trabalho', 'Extrato do FGTS', 'Declaração de 1ª moradia'] },
      { type: 'highlight', headline: 'Dica importante', body: 'Organize os documentos antes. Isso acelera todo o processo de compra!' },
      { type: 'cta', headline: 'Precisa de ajuda?', body: 'Enviamos um checklist completo. Fale conosco!' },
    ],
    // Variation 2 - Vantagens do leilão
    [
      { type: 'cover', headline: '5 Vantagens de\ncomprar Imóvel Caixa' },
      { type: 'content', headline: '1. Preços abaixo do mercado', body: 'Descontos que podem chegar até 95% do valor de avaliação.' },
      { type: 'content', headline: '2. Segurança jurídica', body: 'A Caixa garante a regularização do imóvel após a compra.' },
      { type: 'content', headline: '3. Opções de pagamento', bullets: ['À vista com desconto extra', 'Financiamento facilitado', 'Uso do FGTS'] },
      { type: 'content', headline: '4. Variedade de imóveis', body: 'Apartamentos, casas, terrenos e comerciais em todo Brasil.' },
      { type: 'highlight', headline: '5. Investimento inteligente', body: 'Valorização garantida comprando abaixo do preço de mercado.' },
      { type: 'cta', headline: 'Quer aproveitar?', body: 'Temos as melhores oportunidades. Entre em contato!' },
    ],
    // Variation 3 - Erros comuns
    [
      { type: 'cover', headline: 'Erros que você\nNÃO pode cometer' },
      { type: 'content', headline: '❌ Não visitar o imóvel', body: 'Sempre visite ou peça fotos atualizadas antes de dar um lance.' },
      { type: 'content', headline: '❌ Ignorar débitos', body: 'Verifique IPTU, condomínio e outras pendências antes de comprar.' },
      { type: 'content', headline: '❌ Não calcular custos extras', bullets: ['ITBI (2-3% do valor)', 'Registro em cartório', 'Reformas necessárias'] },
      { type: 'content', headline: '❌ Comprar sem assessoria', body: 'Um especialista evita dores de cabeça e garante o melhor negócio.' },
      { type: 'highlight', headline: '✅ A solução', body: 'Com nossa assessoria, você evita todos esses erros!' },
      { type: 'cta', headline: 'Compre com segurança', body: 'Fale com quem entende do assunto.' },
    ],
    // Variation 4 - Tipos de venda
    [
      { type: 'cover', headline: 'Tipos de venda\nImóveis Caixa' },
      { type: 'content', headline: 'Venda Direta Online', body: 'Imóveis disponíveis no site da Caixa com preço fixo. Primeiro a enviar proposta leva!' },
      { type: 'content', headline: 'Leilão', body: 'Competição de lances. Quem oferece mais, vence. Pode ter ótimos descontos.' },
      { type: 'content', headline: 'Venda com Exclusividade', body: 'Imóveis disponíveis apenas através de corretores credenciados.' },
      { type: 'highlight', headline: 'Qual escolher?', body: 'Depende do seu perfil. Venda Direta é mais rápida, Leilão pode ter mais desconto.' },
      { type: 'cta', headline: 'Consultoria gratuita', body: 'Ajudamos você a escolher a melhor modalidade!' },
    ],
    // Variation 5 - Passo a passo FGTS
    [
      { type: 'cover', headline: 'FGTS na compra:\nGuia completo' },
      { type: 'content', headline: 'Quem pode usar?', bullets: ['3+ anos de carteira assinada', 'Não ter imóvel no mesmo município', 'Imóvel até R$ 1,5 milhão (algumas regiões)'] },
      { type: 'content', headline: 'Para que serve?', body: 'Entrada, amortização de parcelas ou quitação total do financiamento.' },
      { type: 'content', headline: 'Como solicitar?', bullets: ['Extrato FGTS atualizado', 'Declaração de 1º imóvel', 'Aprovação na Caixa'] },
      { type: 'highlight', headline: 'Dica de ouro', body: 'Combine FGTS + Financiamento para comprar com entrada mínima!' },
      { type: 'cta', headline: 'Verifique seu saldo', body: 'Consulte gratuitamente se pode usar o FGTS.' },
    ],
  ],
  process: [
    // Variation 1 - Timeline
    [
      { type: 'cover', headline: 'Seu imóvel em\n5 passos simples' },
      { type: 'content', headline: 'Passo 1: Conversa inicial', body: 'Entendemos suas necessidades, orçamento e preferências de localização.' },
      { type: 'content', headline: 'Passo 2: Busca personalizada', body: 'Selecionamos os melhores imóveis Caixa que se encaixam no seu perfil.' },
      { type: 'content', headline: 'Passo 3: Análise detalhada', body: 'Verificamos documentação, débitos pendentes e estado real do imóvel.' },
      { type: 'content', headline: 'Passo 4: Proposta e aprovação', body: 'Preparamos tudo e acompanhamos até a aprovação final.' },
      { type: 'highlight', headline: 'Passo 5: Chaves na mão!', body: 'Você recebe seu imóvel com toda segurança e tranquilidade.' },
      { type: 'cta', headline: 'Comece agora', body: 'O primeiro passo é uma conversa sem compromisso!' },
    ],
    // Variation 2 - Benefícios assessoria
    [
      { type: 'cover', headline: 'Por que ter\nassessoria especializada?' },
      { type: 'content', headline: 'Economia de tempo', body: 'Você não precisa pesquisar horas. Filtramos apenas o que vale a pena.' },
      { type: 'content', headline: 'Segurança total', bullets: ['Verificação de documentação', 'Análise de débitos', 'Conferência do estado do imóvel'] },
      { type: 'content', headline: 'Negociação experiente', body: 'Conhecemos as regras do jogo e conseguimos as melhores condições.' },
      { type: 'highlight', headline: 'Sem custo para você', body: 'Nossa assessoria é 100% gratuita. Você não paga nada a mais!' },
      { type: 'cta', headline: 'Fale conosco', body: 'Descubra como podemos ajudar no seu sonho.' },
    ],
    // Variation 3 - Prazos
    [
      { type: 'cover', headline: 'Quanto tempo\nleva o processo?' },
      { type: 'content', headline: 'Análise de crédito', body: '5 a 15 dias úteis para aprovação do financiamento.' },
      { type: 'content', headline: 'Documentação', body: '15 a 30 dias para preparar e protocolar todos os documentos.' },
      { type: 'content', headline: 'Assinatura do contrato', body: 'Após aprovação, em até 10 dias úteis você assina.' },
      { type: 'highlight', headline: 'Total médio: 60-90 dias', body: 'Com assessoria, o processo flui sem atrasos desnecessários.' },
      { type: 'cta', headline: 'Acelere seu sonho', body: 'Comece hoje mesmo o processo. Fale conosco!' },
    ],
  ],
  stories: [
    // Variation 1 - Família
    [
      { type: 'cover', headline: 'A família que\nsaiu do aluguel' },
      { type: 'content', headline: 'O desafio', body: 'Pagavam R$ 1.800 de aluguel e achavam impossível comprar algo próprio.' },
      { type: 'content', headline: 'A solução', body: 'Encontramos um apartamento Caixa com 40% de desconto no mesmo bairro.' },
      { type: 'content', headline: 'O resultado', bullets: ['Parcela menor que o aluguel', 'Imóvel próprio valorizado', 'Economia de R$ 300/mês'] },
      { type: 'highlight', headline: 'Hoje são proprietários', body: 'A família realizou o sonho e já planeja o segundo imóvel!' },
      { type: 'cta', headline: 'Sua vez de realizar', body: 'Vamos encontrar a oportunidade perfeita para você!' },
    ],
    // Variation 2 - Investidor
    [
      { type: 'cover', headline: 'De 0 a 3 imóveis\nem 3 anos' },
      { type: 'content', headline: 'O início', body: 'Começou com R$ 30 mil guardados e o sonho de construir patrimônio.' },
      { type: 'content', headline: 'A estratégia', body: 'Comprou o primeiro imóvel Caixa, reformou e alugou em 6 meses.' },
      { type: 'content', headline: 'O crescimento', bullets: ['Renda do aluguel virou entrada do 2º', 'Repetiu o processo', 'Hoje tem 3 imóveis'] },
      { type: 'highlight', headline: 'Patrimônio sólido', body: 'Construiu mais de R$ 500 mil em patrimônio começando do zero.' },
      { type: 'cta', headline: 'Comece sua jornada', body: 'Todo grande investidor deu o primeiro passo!' },
    ],
    // Variation 3 - Aposentadoria
    [
      { type: 'cover', headline: 'Aposentadoria com\nrenda garantida' },
      { type: 'content', headline: 'O planejamento', body: 'Aos 45 anos, decidiu investir em imóveis pensando na aposentadoria.' },
      { type: 'content', headline: 'As aquisições', body: 'Em 10 anos, comprou 4 imóveis Caixa abaixo do mercado.' },
      { type: 'content', headline: 'O resultado hoje', bullets: ['Todos quitados', '3 alugados gerando renda', 'R$ 4.500/mês de renda passiva'] },
      { type: 'highlight', headline: 'Aposentadoria tranquila', body: 'Hoje vive com tranquilidade, sem depender só do INSS.' },
      { type: 'cta', headline: 'Planeje seu futuro', body: 'Nunca é cedo demais para começar. Fale conosco!' },
    ],
  ],
  institutional: [
    // Variation 1 - Missão
    [
      { type: 'cover', headline: 'Nossa missão:\nSeu sonho realizado' },
      { type: 'content', headline: 'O que nos move', body: 'Acreditamos que todo brasileiro pode ter acesso à casa própria.' },
      { type: 'content', headline: 'Como fazemos', bullets: ['Assessoria humanizada', 'Transparência total', 'Acompanhamento do início ao fim'] },
      { type: 'content', headline: 'Nosso compromisso', body: 'Só indicamos imóveis que compraríamos para nossas próprias famílias.' },
      { type: 'highlight', headline: '+200 famílias atendidas', body: 'Cada história de sucesso nos motiva a continuar.' },
      { type: 'cta', headline: 'Faça parte', body: 'Seja a próxima história de sucesso!' },
    ],
    // Variation 2 - Diferenciais
    [
      { type: 'cover', headline: 'Por que escolher\na gente?' },
      { type: 'content', headline: 'Especialistas de verdade', body: 'Trabalhamos exclusivamente com Imóveis Caixa. É o que sabemos fazer melhor.' },
      { type: 'content', headline: 'Atendimento humanizado', bullets: ['Você fala com pessoas reais', 'Respondemos suas dúvidas', 'Acompanhamos cada etapa'] },
      { type: 'content', headline: 'Sem surpresas', body: 'Explicamos tudo: custos, prazos, riscos. Você decide informado.' },
      { type: 'highlight', headline: 'Gratuito para você', body: 'Nossa assessoria não custa nada. Nosso ganho é seu sucesso!' },
      { type: 'cta', headline: 'Conheça nosso trabalho', body: 'Fale com nossos clientes e comprove!' },
    ],
    // Variation 3 - Credibilidade
    [
      { type: 'cover', headline: 'Credibilidade que\nvocê pode confiar' },
      { type: 'content', headline: 'Anos de experiência', body: 'Conhecemos cada detalhe do mercado de Imóveis Caixa.' },
      { type: 'content', headline: 'Números que falam', bullets: ['+200 imóveis vendidos', '95% de clientes satisfeitos', '0 reclamações no PROCON'] },
      { type: 'content', headline: 'Transparência total', body: 'Você acompanha cada passo do processo em tempo real.' },
      { type: 'highlight', headline: 'Compromisso real', body: 'Se não encontrarmos o imóvel ideal, não forçamos a venda.' },
      { type: 'cta', headline: 'Fale conosco', body: 'Comprove nossa seriedade. Agende uma conversa!' },
    ],
  ],
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
      { type: 'content', headline: 'Por que são mais baratos?', bullets: ['Imóveis precisam ser vendidos rapidamente', 'Não há intermediários', 'Descontos de até 95% do valor de mercado'] },
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
