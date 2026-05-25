// Campos extras do Canal Pro (OLX / ZAP / VivaReal) usados em todos os módulos
// (VDH, AM, AF). Mantido como tipo separado para não invadir os types específicos
// de cada módulo.

export interface CanalProExtraData {
  // Identificação OLX
  zipCode: string;            // CEP (obrigatório)
  addressNumber: string;      // Número do endereço
  listingCode: string;        // Código do anúncio (auto-gerado se vazio)
  category: string;           // Padrão, Cobertura, Duplex...
  totalArea: number;          // Área total (m²)
  addressDisplay: 'completo' | 'rua' | 'bairro';
  isCommercial: boolean;

  // Diferenciais do imóvel
  hasPets: boolean;
  hasAirConditioning: boolean;
  hasCloset: boolean;
  hasAmericanKitchen: boolean;
  hasFireplace: boolean;
  hasGourmetBalcony: boolean;

  // Sobre o condomínio
  condoFloors: number;
  condoUnitsPerFloor: number;
  condoTowers: number;
  condoBuildYear: string;

  // Lazer / esporte
  amenityGym: boolean;
  amenityBBQ: boolean;
  amenityCinema: boolean;
  amenityGourmetSpace: boolean;
  amenityGarden: boolean;
  amenityPool: boolean;
  amenityPlayground: boolean;
  amenitySquashCourt: boolean;
  amenityTennisCourt: boolean;
  amenityMultisportCourt: boolean;
  amenityPartyHall: boolean;
  amenityGameRoom: boolean;

  // Comodidades e serviços
  amenityAccessibility: boolean;
  amenityBikeRack: boolean;
  amenityCoworking: boolean;
  amenityElevator: boolean;
  amenityLaundry: boolean;
  amenitySauna: boolean;
  amenitySpa: boolean;

  // Segurança
  amenityGatedCommunity: boolean;
  amenityElectronicGate: boolean;
  amenity24hConcierge: boolean;

  // Negociação
  condoExempt: boolean;
  iptuExempt: boolean;
}

export const defaultCanalProExtraData: CanalProExtraData = {
  zipCode: '',
  addressNumber: '',
  listingCode: '',
  category: 'Padrão',
  totalArea: 0,
  addressDisplay: 'completo',
  isCommercial: false,
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
  condoExempt: false,
  iptuExempt: false,
};