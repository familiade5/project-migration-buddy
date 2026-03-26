export interface AFPropertyData {
  // Basic info
  title: string;
  propertyType: string;
  neighborhood: string;
  city: string;
  state: string;
  address: string;
  referencePoint: string;

  // Specs
  bedrooms: number;
  bathrooms: number;
  area: number;
  garageSpaces: number;
  suites: number;
  floor: string;
  totalFloors: string;
  furnished: boolean;

  // Rooms
  rooms: string;

  // Leisure
  leisureItems: string;

  // Pricing
  salePrice: number;
  acceptsFinancing: boolean;
  acceptsFGTS: boolean;
  subsidy: number;
  cashOnly: boolean;
  isRental: boolean;
  rentalPrice: number;
  condominiumFee: number;
  condoIncludes: string;
  iptu: number;

  // Contact
  brokerName: string;
  brokerPhone: string;
  creci: string;

  // Highlights
  highlights: string[];
  infoMessage: string;
}

export const defaultAFPropertyData: AFPropertyData = {
  title: '',
  propertyType: 'Apartamento',
  neighborhood: '',
  city: '',
  state: 'CE',
  address: '',
  referencePoint: '',
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
  garageSpaces: 0,
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
  brokerName: '',
  brokerPhone: '',
  creci: '',
  highlights: [],
  infoMessage: '',
};
