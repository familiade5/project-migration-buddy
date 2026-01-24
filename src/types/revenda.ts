// Revenda – Mercado Types
// Different from Venda Direta Caixa - focused on lifestyle, comfort, and premium experience

export type PhotoCategory = 
  | 'fachada'      // Exterior/Facade
  | 'sala'         // Living room
  | 'quarto'       // Bedroom
  | 'cozinha'      // Kitchen
  | 'banheiro'     // Bathroom
  | 'area-externa' // External area (garden, pool, balcony)
  | 'garagem'      // Garage
  | 'outros';      // Others

export interface CategorizedPhoto {
  id: string;
  url: string;
  category: PhotoCategory;
  order: number;
}

export type DetailLevel = 'conforto' | 'premium';

export interface RevendaPropertyData {
  // Basic Info
  propertyName: string;
  type: string;
  
  // Location
  neighborhood: string;
  city: string;
  state: string;
  fullAddress: string;
  cep: string;
  
  // Size & Layout
  bedrooms: string;
  bathrooms: string;
  suites: string;
  garageSpaces: string;
  area: string;
  areaTerreno: string;
  andarOuTipo: string; // Ex: "2º andar", "Térreo", "Cobertura"
  
  // Price
  price: string;
  pricePerMeter: string;
  condominiumFee: string;
  iptu: string;
  condicaoFinanciamento: string; // Ex: "Aceita financiamento e FGTS"
  subsidioOuEntrada: string; // Texto livre sobre entrada/subsídio
  
  // Comfort Details (DetailLevel: conforto)
  hasNaturalLight: boolean;
  hasVaranda: boolean;
  hasVista: boolean;
  hasGoodLayout: boolean;
  
  // Premium Details (DetailLevel: premium)
  acabamentos: string;         // Finishing quality
  diferenciais: string[];      // Unique features
  descricaoLivre: string;      // Free description (auto-generated or manual)
  
  // Lifestyle Features
  features: string[];
  itensLazer: string[]; // Lista de itens de lazer para legenda
  
  // Contact
  contactPhone: string;
  contactName: string;
  creci: string;
  facebookUrl: string;
  siteUrl: string;
  
  // Detail level selected
  detailLevel: DetailLevel;
}

export const defaultRevendaData: RevendaPropertyData = {
  propertyName: '',
  type: 'Apartamento',
  
  neighborhood: '',
  city: '',
  state: '',
  fullAddress: '',
  cep: '',
  
  bedrooms: '',
  bathrooms: '',
  suites: '',
  garageSpaces: '',
  area: '',
  areaTerreno: '',
  andarOuTipo: '',
  
  price: '',
  pricePerMeter: '',
  condominiumFee: '',
  iptu: '',
  condicaoFinanciamento: 'Aceita financiamento e FGTS',
  subsidioOuEntrada: '',
  
  hasNaturalLight: false,
  hasVaranda: false,
  hasVista: false,
  hasGoodLayout: false,
  
  acabamentos: '',
  diferenciais: [],
  descricaoLivre: '',
  
  features: [],
  itensLazer: [],
  
  contactPhone: '(92) 98839-1098',
  contactName: 'Iury Sampaio',
  creci: 'CRECI 14851 MS PJ',
  facebookUrl: '',
  siteUrl: '',
  
  detailLevel: 'conforto',
};

export const revendaPropertyTypes = [
  'Apartamento',
  'Casa',
  'Cobertura',
  'Duplex',
  'Triplex',
  'Loft',
  'Studio',
  'Casa em Condomínio',
  'Sobrado',
  'Terreno',
];

export const revendaFeatureOptions = [
  'Iluminação Natural',
  'Varanda Gourmet',
  'Vista Panorâmica',
  'Espaços Bem Distribuídos',
  'Acabamento de Alto Padrão',
  'Piscina',
  'Churrasqueira',
  'Área de Lazer Completa',
  'Portaria 24h',
  'Academia',
  'Playground',
  'Salão de Festas',
  'Pet Friendly',
  'Elevador',
  'Ar Condicionado Central',
  'Aquecimento',
  'Closet',
  'Home Office',
  'Lavabo',
];

export const photoCategoryLabels: Record<PhotoCategory, string> = {
  'fachada': 'Fachada',
  'sala': 'Sala',
  'quarto': 'Quarto',
  'cozinha': 'Cozinha',
  'banheiro': 'Banheiro',
  'area-externa': 'Área Externa',
  'garagem': 'Garagem',
  'outros': 'Outros',
};

export const photoCategoryOrder: PhotoCategory[] = [
  'fachada',
  'sala',
  'quarto',
  'cozinha',
  'banheiro',
  'area-externa',
  'garagem',
  'outros',
];
