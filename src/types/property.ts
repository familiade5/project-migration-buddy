export interface PropertyData {
  title: string;
  type: string;
  price: string;
  location: string;
  neighborhood: string;
  bedrooms: string;
  bathrooms: string;
  parkingSpaces: string;
  area: string;
  description: string;
  features: string[];
  contactPhone: string;
  contactWhatsapp: string;
}

export const defaultPropertyData: PropertyData = {
  title: '',
  type: 'Apartamento',
  price: '',
  location: '',
  neighborhood: '',
  bedrooms: '2',
  bathrooms: '1',
  parkingSpaces: '1',
  area: '',
  description: '',
  features: [],
  contactPhone: '',
  contactWhatsapp: '',
};

export const propertyTypes = [
  'Apartamento',
  'Casa',
  'Cobertura',
  'Kitnet',
  'Loft',
  'Sobrado',
  'Terreno',
  'Sala Comercial',
  'Galpão',
];

export const propertyFeatures = [
  'Piscina',
  'Churrasqueira',
  'Academia',
  'Salão de Festas',
  'Playground',
  'Portaria 24h',
  'Elevador',
  'Varanda',
  'Suíte',
  'Ar Condicionado',
  'Armários Embutidos',
  'Cozinha Americana',
];
