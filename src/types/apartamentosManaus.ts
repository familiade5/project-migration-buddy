export interface AMPropertyData {
  // Basic info
  title: string;
  propertyType: string;
  neighborhood: string;
  city: string;
  state: string;
  address: string;        // Rua / endereço
  referencePoint: string; // Ex: Em frente à Volvo

  // Specs
  bedrooms: number;
  bathrooms: number;
  area: number;
  garageSpaces: number;
  suites: number;
  floor: string;
  totalFloors: string;
  furnished: boolean;

  // Rooms (for caption)
  rooms: string; // multiline text — ex: "Salas estar e jantar"

  // Leisure
  leisureItems: string; // multiline text — ex: "Piscina, Churrasqueira"

  // Pricing
  salePrice: number;
  acceptsFinancing: boolean;
  acceptsFGTS: boolean;
  subsidy: number;        // Subsídio governo
  cashOnly: boolean;
  isRental: boolean;
  rentalPrice: number;
  condominiumFee: number;
  condoIncludes: string;  // Ex: "água, gás e segurança 24h"
  iptu: number;

  // Contact
  brokerName: string;
  brokerPhone: string;
  creci: string;

  // Highlights (up to 6) – for info slide
  highlights: string[];
  infoMessage: string;
}

export const defaultAMPropertyData: AMPropertyData = {
  title: '',
  propertyType: 'Apartamento',
  neighborhood: '',
  city: 'Manaus',
  state: 'AM',
  address: '',
  referencePoint: '',
  bedrooms: 2,
  bathrooms: 1,
  area: 60,
  garageSpaces: 1,
  suites: 0,
  floor: '',
  totalFloors: '',
  furnished: false,
  rooms: '',
  leisureItems: '',
  salePrice: 0,
  acceptsFinancing: true,
  acceptsFGTS: true,
  subsidy: 0,
  cashOnly: false,
  isRental: false,
  rentalPrice: 0,
  condominiumFee: 0,
  condoIncludes: '',
  iptu: 0,
  brokerName: 'Iury Sampaio',
  brokerPhone: '(92) 98839-1098',
  creci: 'CRECI 14851 MS PJ',
  highlights: [],
  infoMessage: '',
};
