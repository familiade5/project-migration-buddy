export interface TrafegoPropertyData {
  title: string;
  propertyType: string;
  neighborhood: string;
  city: string;
  state: string;

  bedrooms: number;
  bathrooms: number;
  area: number;
  garageSpaces: number;
  suites: number;

  // Pricing
  salePrice: number;
  parcelas: string;       // "Parcelas a partir de R$ 499"
  subsidio: string;       // "Subsídio até R$ 55.000"
  entrada: string;        // "Sem entrada" / "Entrada R$ 5.000"
  acceptsFinancing: boolean;
  acceptsFGTS: boolean;
  isMCMV: boolean;        // Minha Casa Minha Vida

  // Custom messages
  headline: string;       // Main headline override
  subheadline: string;    // Secondary text
  ctaText: string;        // CTA button text

  // Contact
  brokerName: string;
  brokerPhone: string;
  creci: string;

  // Highlights
  highlights: string[];
}

export const defaultTrafegoData: TrafegoPropertyData = {
  title: '',
  propertyType: 'Apartamento',
  neighborhood: '',
  city: 'Manaus',
  state: 'AM',
  bedrooms: 2,
  bathrooms: 1,
  area: 0,
  garageSpaces: 1,
  suites: 0,
  salePrice: 0,
  parcelas: '',
  subsidio: '',
  entrada: '',
  acceptsFinancing: true,
  acceptsFGTS: true,
  isMCMV: true,
  headline: '',
  subheadline: '',
  ctaText: 'Saiba Mais',
  brokerName: '',
  brokerPhone: '',
  creci: '',
  highlights: [],
};
