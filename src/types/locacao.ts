// Locação & Gestão Types
// Professional, calm, trustworthy - NOT sales-focused

import managementBackgroundDefault from '@/assets/management-background.jpg';

export type LocacaoCreativeType = 'property' | 'management';

export type LocacaoPhotoCategory = 
  | 'fachada'      
  | 'sala'         
  | 'quarto'       
  | 'cozinha'      
  | 'banheiro'     
  | 'area-externa' 
  | 'outros';      

export interface LocacaoCategorizedPhoto {
  id: string;
  url: string;
  category: LocacaoPhotoCategory;
  order: number;
}

// Property data for rental listings
export interface LocacaoPropertyData {
  // Basic Info
  propertyName: string;
  type: string;
  
  // Location
  neighborhood: string;
  city: string;
  state: string;
  fullAddress: string;
  
  // Size & Layout
  bedrooms: string;
  bathrooms: string;
  garageSpaces: string;
  area: string;
  
  // Rental Terms
  rentPrice: string;           // Monthly rent
  condominiumFee: string;      // Condominium fee
  iptu: string;                // IPTU tax
  totalMonthly: string;        // Total monthly cost
  depositMonths: string;       // Security deposit (e.g., "2 meses")
  contractDuration: string;    // Contract duration (e.g., "30 meses")
  
  // Features (practical, not aspirational)
  features: string[];
  
  // Availability
  availableFrom: string;       // e.g., "Disponível imediatamente" or date
  acceptsPets: boolean;
  furnished: boolean;
  
  // Contact
  contactPhone: string;
  contactName: string;
  creci: string;
}

// Management service data (institutional)
export interface LocacaoManagementData {
  // Service messaging
  headline: string;            // Main headline
  subheadline: string;         // Supporting text
  
  // Service benefits (3-4 items max)
  benefits: string[];
  
  // Trust signals
  yearsExperience: string;
  propertiesManaged: string;
  
  // Background image (optional)
  backgroundPhoto: string | null;
  useBackgroundPhoto: boolean;
  
  // Contact
  contactPhone: string;
  contactName: string;
  creci: string;
}

export const defaultLocacaoPropertyData: LocacaoPropertyData = {
  propertyName: '',
  type: 'Apartamento',
  
  neighborhood: '',
  city: '',
  state: '',
  fullAddress: '',
  
  bedrooms: '',
  bathrooms: '',
  garageSpaces: '',
  area: '',
  
  rentPrice: '',
  condominiumFee: '',
  iptu: '',
  totalMonthly: '',
  depositMonths: '2',
  contractDuration: '30 meses',
  
  features: [],
  
  availableFrom: 'Disponível imediatamente',
  acceptsPets: false,
  furnished: false,
  
  contactPhone: '(92) 98839-1098',
  contactName: 'Iury Sampaio',
  creci: 'CRECI 14851 MS PJ',
};

export const defaultLocacaoManagementData: LocacaoManagementData = {
  headline: 'Gestão Profissional de Locação',
  subheadline: 'Você recebe o aluguel. Nós cuidamos do resto.',
  
  benefits: [
    'Administração completa do imóvel',
    'Busca e seleção de inquilinos',
    'Garantia de recebimento',
    'Manutenção e vistorias',
  ],
  
  yearsExperience: '10+',
  propertiesManaged: '200+',
  
  backgroundPhoto: managementBackgroundDefault,
  useBackgroundPhoto: true,
  
  contactPhone: '(92) 98839-1098',
  contactName: 'Iury Sampaio',
  creci: 'CRECI 14851 MS PJ',
};

export const locacaoPropertyTypes = [
  'Apartamento',
  'Casa',
  'Kitnet',
  'Studio',
  'Loft',
  'Sala Comercial',
  'Galpão',
  'Cobertura',
  'Casa em Condomínio',
  'Sobrado',
];

export const locacaoFeatureOptions = [
  'Portaria 24h',
  'Elevador',
  'Vaga de Garagem',
  'Área de Serviço',
  'Armários Embutidos',
  'Ar Condicionado',
  'Aquecimento',
  'Churrasqueira',
  'Piscina',
  'Academia',
  'Playground',
  'Salão de Festas',
];

export const locacaoPhotoCategoryLabels: Record<LocacaoPhotoCategory, string> = {
  'fachada': 'Fachada',
  'sala': 'Sala',
  'quarto': 'Quarto',
  'cozinha': 'Cozinha',
  'banheiro': 'Banheiro',
  'area-externa': 'Área Externa',
  'outros': 'Outros',
};

export const managementBenefitOptions = [
  'Administração completa do imóvel',
  'Busca e seleção de inquilinos',
  'Análise de crédito e cadastro',
  'Garantia de recebimento',
  'Contratos seguros e atualizados',
  'Vistorias de entrada e saída',
  'Gestão de manutenções',
  'Atendimento ao inquilino',
  'Repasse mensal garantido',
  'Relatórios transparentes',
];
