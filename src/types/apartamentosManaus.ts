export interface AMPropertyData {
  // Basic info
  title: string;
  propertyType: string;
  neighborhood: string;
  city: string;
  state: string;
  address: string;        // Rua / endereço
  referencePoint: string; // Ex: Em frente à Volvo
  zipCode: string;        // CEP — obrigatório para OLX

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
  // Price reduction (capa "BAIXOU O PREÇO")
  priceReduced?: boolean;
  oldPrice?: number;
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

  // ============ Canal Pro extras (todos opcionais — não quebram fluxo atual) ============
  // Classificação
  isCommercial?: boolean;            // Residencial (false) vs Comercial (true)
  category?: string;                 // Padrão, Cobertura, Duplex, Kitnet, Loft...
  totalArea?: number;                // Área total (m²) — distinta da área útil
  addressDisplay?: 'completo' | 'rua' | 'bairro';

  // Diferenciais do imóvel (flags individuais)
  hasPets?: boolean;
  hasAirConditioning?: boolean;
  hasCloset?: boolean;
  hasAmericanKitchen?: boolean;
  hasFireplace?: boolean;
  hasGourmetBalcony?: boolean;

  // Sobre o condomínio
  condoFloors?: number;              // Nº de andares
  condoUnitsPerFloor?: number;       // Nº de unidades por andar
  condoTowers?: number;              // Nº de torres
  condoBuildYear?: string;           // Ano de construção

  // Lazer e esporte (condomínio)
  amenityGym?: boolean;
  amenityBBQ?: boolean;
  amenityCinema?: boolean;
  amenityGourmetSpace?: boolean;
  amenityGarden?: boolean;
  amenityPool?: boolean;
  amenityPlayground?: boolean;
  amenitySquashCourt?: boolean;
  amenityTennisCourt?: boolean;
  amenityMultisportCourt?: boolean;
  amenityPartyHall?: boolean;
  amenityGameRoom?: boolean;

  // Comodidades e serviços
  amenityAccessibility?: boolean;
  amenityBikeRack?: boolean;
  amenityCoworking?: boolean;
  amenityElevator?: boolean;
  amenityLaundry?: boolean;
  amenitySauna?: boolean;
  amenitySpa?: boolean;

  // Segurança
  amenityGatedCommunity?: boolean;
  amenityElectronicGate?: boolean;
  amenity24hConcierge?: boolean;

  // Negociação
  saleAndRental?: boolean;           // Venda E Aluguel (terceira opção)
  condoExempt?: boolean;             // Condomínio isento
  iptuExempt?: boolean;              // IPTU isento
  iptuPeriod?: 'Anual' | 'Mensal';   // Período do IPTU

  // Mídia / Código
  listingCode?: string;              // Código do anúncio (ex: VILFLW)
  youtubeUrl?: string;               // URL do vídeo
  virtualTourUrl?: string;           // URL do Tour Virtual
}

export const defaultAMPropertyData: AMPropertyData = {
  title: '',
  propertyType: 'Apartamento',
  neighborhood: '',
  city: '',
  state: 'AM',
  address: '',
  referencePoint: '',
  zipCode: '',
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
  brokerName: 'Iury Sampaio',
  brokerPhone: '(92) 98839-1098',
  creci: 'CRECI 14851 MS PJ',
  highlights: [],
  infoMessage: '',

  // Canal Pro extras — defaults seguros
  isCommercial: false,
  category: 'Padrão',
  totalArea: 0,
  addressDisplay: 'completo',
  hasPets: false,
  hasAirConditioning: false,
  hasCloset: false,
  hasAmericanKitchen: false,
  hasFireplace: false,
  hasGourmetBalcony: false,
  condoFloors: 0,
  condoUnitsPerFloor: 0,
  condoTowers: 0,
  condoBuildYear: '',
  amenityGym: false,
  amenityBBQ: false,
  amenityCinema: false,
  amenityGourmetSpace: false,
  amenityGarden: false,
  amenityPool: false,
  amenityPlayground: false,
  amenitySquashCourt: false,
  amenityTennisCourt: false,
  amenityMultisportCourt: false,
  amenityPartyHall: false,
  amenityGameRoom: false,
  amenityAccessibility: false,
  amenityBikeRack: false,
  amenityCoworking: false,
  amenityElevator: false,
  amenityLaundry: false,
  amenitySauna: false,
  amenitySpa: false,
  amenityGatedCommunity: false,
  amenityElectronicGate: false,
  amenity24hConcierge: false,
  saleAndRental: false,
  condoExempt: false,
  iptuExempt: false,
  iptuPeriod: 'Anual',
  listingCode: '',
  youtubeUrl: '',
  virtualTourUrl: '',
};
