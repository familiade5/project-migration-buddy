// Rental Property Management Types

export type RentalPropertyStage = 'disponivel' | 'reservado' | 'ocupado' | 'catalogo';
export type RentalContractType = 'residencial' | 'comercial';
export type RentalGuaranteeType = 'fiador' | 'caucao' | 'seguro_fiador';

export const RENTAL_PROPERTY_STAGE_ORDER: RentalPropertyStage[] = [
  'disponivel',
  'reservado',
  'ocupado',
  'catalogo',
];

export const RENTAL_PROPERTY_STAGE_LABELS: Record<RentalPropertyStage, string> = {
  disponivel: 'Disponível',
  reservado: 'Reservado',
  ocupado: 'Ocupado',
  catalogo: 'Nosso Catálogo',
};

export const RENTAL_PROPERTY_STAGE_COLORS: Record<RentalPropertyStage, string> = {
  disponivel: 'bg-green-500',
  reservado: 'bg-yellow-500',
  ocupado: 'bg-blue-500',
  catalogo: 'bg-gray-500',
};

export const CONTRACT_TYPE_LABELS: Record<RentalContractType, string> = {
  residencial: 'Residencial',
  comercial: 'Comercial',
};

export const GUARANTEE_TYPE_LABELS: Record<RentalGuaranteeType, string> = {
  fiador: 'Fiador',
  caucao: 'Caução',
  seguro_fiador: 'Seguro-Fiador',
};

export interface RentalOwner {
  id: string;
  full_name: string;
  cpf?: string;
  rg?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  bank_name?: string;
  bank_agency?: string;
  bank_account?: string;
  pix_key?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by_user_id?: string;
}

export interface RentalTenant {
  id: string;
  full_name: string;
  cpf?: string;
  rg?: string;
  birth_date?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  profession?: string;
  workplace?: string;
  monthly_income?: number;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by_user_id?: string;
}

export interface RentalGuarantor {
  id: string;
  full_name: string;
  cpf?: string;
  rg?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  profession?: string;
  monthly_income?: number;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  property_address?: string;
  property_registration?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by_user_id?: string;
}

export interface RentalProperty {
  id: string;
  code: string;
  property_type: string;
  address: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  state: string;
  zip_code?: string;
  
  bedrooms?: number;
  bathrooms?: number;
  suites?: number;
  garage_spaces?: number;
  total_area?: number;
  useful_area?: number;
  
  is_furnished?: boolean;
  accepts_pets?: boolean;
  has_pool?: boolean;
  has_gym?: boolean;
  has_elevator?: boolean;
  has_doorman?: boolean;
  features?: string[];
  
  rent_value: number;
  condominium_fee?: number;
  iptu_value?: number;
  other_fees?: number;
  
  owner_id?: string;
  owner?: RentalOwner;
  
  current_stage: RentalPropertyStage;
  stage_entered_at: string;
  current_contract_id?: string;
  
  cover_image_url?: string;
  photos?: string[];
  
  registration_number?: string;
  iptu_registration?: string;
  
  description?: string;
  internal_notes?: string;
  
  created_at: string;
  updated_at: string;
  created_by_user_id?: string;
  responsible_user_id?: string;
}

export interface RentalPropertyDocument {
  id: string;
  property_id: string;
  name: string;
  document_type: string;
  file_url: string;
  uploaded_by_user_id?: string;
  created_at: string;
}

export interface RentalPropertyHistory {
  id: string;
  property_id: string;
  from_stage?: RentalPropertyStage;
  to_stage: RentalPropertyStage;
  notes?: string;
  moved_by_user_id?: string;
  moved_by_name?: string;
  created_at: string;
}

export const RENTAL_PROPERTY_TYPES = [
  'Apartamento',
  'Casa',
  'Kitnet',
  'Studio',
  'Loft',
  'Sala Comercial',
  'Loja',
  'Galpão',
  'Cobertura',
  'Casa em Condomínio',
  'Sobrado',
  'Ponto Comercial',
];

export const RENTAL_PROPERTY_FEATURES = [
  'Portaria 24h',
  'Elevador',
  'Área de Serviço',
  'Armários Embutidos',
  'Ar Condicionado',
  'Aquecimento',
  'Churrasqueira',
  'Piscina',
  'Academia',
  'Playground',
  'Salão de Festas',
  'Quadra Esportiva',
  'Sauna',
  'Jardim',
  'Varanda',
  'Lavabo',
  'Despensa',
  'Escritório',
];

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  matricula: 'Matrícula',
  iptu: 'IPTU',
  vistoria: 'Laudo de Vistoria',
  fotos: 'Fotos',
  certidao: 'Certidão',
  contrato: 'Contrato',
  rg_cpf: 'RG/CPF',
  comprovante_renda: 'Comprovante de Renda',
  comprovante_residencia: 'Comprovante de Residência',
  outro: 'Outro',
};
