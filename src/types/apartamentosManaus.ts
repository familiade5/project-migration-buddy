export interface AMPropertyData {
  // Basic info
  title: string;         // Nome do condomínio/imóvel
  propertyType: string;  // Casa, Apartamento, etc.
  neighborhood: string;
  city: string;
  state: string;

  // Specs
  bedrooms: number;
  bathrooms: number;
  area: number;          // m²
  garageSpaces: number;
  suites: number;

  // Pricing
  salePrice: number;
  acceptsFinancing: boolean;
  cashOnly: boolean;
  isRental: boolean;
  rentalPrice: number;

  // Details
  floor: string;
  totalFloors: string;
  furnished: boolean;
  condominiumFee: number;
  iptu: number;

  // Contact
  brokerName: string;
  brokerPhone: string;
  creci: string;

  // Highlights (up to 6)
  highlights: string[];

  // Info slide message
  infoMessage: string;
}

export const defaultAMPropertyData: AMPropertyData = {
  title: '',
  propertyType: 'Apartamento',
  neighborhood: '',
  city: 'Manaus',
  state: 'AM',
  bedrooms: 2,
  bathrooms: 1,
  area: 60,
  garageSpaces: 1,
  suites: 0,
  salePrice: 0,
  acceptsFinancing: true,
  cashOnly: false,
  isRental: false,
  rentalPrice: 0,
  floor: '',
  totalFloors: '',
  furnished: false,
  condominiumFee: 0,
  iptu: 0,
  brokerName: '',
  brokerPhone: '',
  creci: '',
  highlights: [],
  infoMessage: '',
};
