export interface PropertyData {
  // Slide 1 - Capa
  entryValue: string; // Entrada a partir de
  propertySource: string; // Imóvel Caixa, Banco do Brasil, etc.
  type: string; // Casa, Apartamento
  bedrooms: string;
  city: string; // Campo Grande
  state: string; // Mato Grosso do Sul
  neighborhood: string; // Vila Nova
  
  // Valores
  evaluationValue: string; // Valor de Avaliação
  minimumValue: string; // Valor Mínimo de Venda
  discount: string; // Desconto percentual
  
  // Detalhes
  garageSpaces: string;
  bathrooms: string;
  area: string;
  
  // Flags
  acceptsFGTS: boolean;
  acceptsFinancing: boolean;
  
  // Slide 3 - Diferenciais customizáveis
  hasEasyEntry: boolean; // Entrada facilitada e parcelada
  canUseFGTS: boolean; // Pode usar FGTS
  
  // Contato/Info fixa
  creci: string;
  
  // Slide 2, 3, 4 - Mantidos
  features: string[];
  contactPhone: string;
  contactName: string;
  
  // ========== NOVOS CAMPOS PARA LEGENDA ==========
  
  // Nome do imóvel/condomínio
  propertyName: string;
  
  // Forma de pagamento
  paymentMethod: string; // "Somente à vista", "Aceita Financiamento", etc.
  
  // Características extras para legenda
  hasSala: boolean;
  hasCozinha: boolean;
  hasAreaServico: boolean;
  
  // Áreas detalhadas
  areaTotal: string;
  areaPrivativa: string;
  areaTerreno: string;
  
  // Endereço completo
  street: string; // Rua/Avenida
  number: string; // Número
  complement: string; // Casa 01, Apto 101, etc.
  cep: string;
  fullAddress: string; // Endereço completo extraído
  
  // Regras de despesas
  condominiumRules: string;
  taxRules: string;
}

export const defaultPropertyData: PropertyData = {
  entryValue: '',
  propertySource: 'Imóvel Caixa',
  type: 'Casa',
  bedrooms: '', // Vazio por padrão - só preenche se especificado
  city: '',
  state: '',
  neighborhood: '',
  
  evaluationValue: '',
  minimumValue: '',
  discount: '',
  
  garageSpaces: '', // Vazio por padrão - só preenche se especificado
  bathrooms: '', // Vazio por padrão - só preenche se especificado
  area: '',
  
  acceptsFGTS: false,
  acceptsFinancing: false,
  
  hasEasyEntry: false,
  canUseFGTS: false,
  
  creci: 'CRECI 14851 MS PJ',
  
  features: [],
  contactPhone: '(92) 98839-1098',
  contactName: 'Iury Sampaio',
  
  // Novos campos
  propertyName: '',
  paymentMethod: 'Somente à vista',
  
  hasSala: false,
  hasCozinha: false,
  hasAreaServico: false,
  
  areaTotal: '',
  areaPrivativa: '',
  areaTerreno: '',
  
  street: '',
  number: '',
  complement: '',
  cep: '',
  fullAddress: '',
  
  condominiumRules: 'Responsabilidade do comprador (até 10% do valor de avaliação). A CAIXA arcará com o excedente.',
  taxRules: 'Responsabilidade do comprador.',
};

export const propertyTypes = [
  'Casa',
  'Apartamento',
  'Terreno',
  'Comercial',
  'Galpão',
  'Fazenda',
  'Chácara',
];

export const propertySources = [
  'Imóvel Caixa',
  'Banco do Brasil',
  'Santander',
  'Bradesco',
  'Itaú',
  'Particular',
];

export const paymentMethods = [
  'Somente à vista',
  'À vista ou financiado',
  'Aceita parcelamento',
  'Consulte condições',
];

export const featureOptions = [
  'Vaga de Garagem',
  'Piscina',
  'Churrasqueira',
  'Área de Lazer',
  'Portaria 24h',
  'Academia',
  'Ar Condicionado',
  'Mobiliado',
  'Quintal',
  'Varanda',
  'Elevador',
  'Pet Friendly',
];
