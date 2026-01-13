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
  entryValue: 'R$ 7.500',
  propertySource: 'Imóvel Caixa',
  type: 'Casa',
  bedrooms: '2',
  city: 'Campo Grande',
  state: 'Mato Grosso do Sul',
  neighborhood: 'Vila Nova',
  
  evaluationValue: 'R$ 126.000,00',
  minimumValue: 'R$ 72.988,41',
  discount: '42,07',
  
  garageSpaces: '1',
  bathrooms: '1',
  area: '',
  
  acceptsFGTS: true,
  acceptsFinancing: true,
  
  hasEasyEntry: true,
  canUseFGTS: true,
  
  creci: 'CRECI 14851 MS PJ',
  
  features: ['Vaga de Garagem'],
  contactPhone: '(67) 99999-9999',
  contactName: 'Iury Sampaio',
  
  // Novos campos
  propertyName: '',
  paymentMethod: 'Somente à vista',
  
  hasSala: true,
  hasCozinha: true,
  hasAreaServico: true,
  
  areaTotal: '',
  areaPrivativa: '',
  areaTerreno: '',
  
  street: '',
  number: '',
  complement: '',
  cep: '',
  fullAddress: '',
  
  condominiumRules: 'Responsabilidade do comprador (até 10% do valor de avaliação). A CAIXA arcará com o valor que exceder esse limite.',
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
