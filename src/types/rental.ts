// CRM Locação - Rental Management Types

export type RentalPaymentStatus = 
  | 'pending'
  | 'paid'
  | 'overdue'
  | 'partial'
  | 'cancelled';

export type RentalContractStatus = 
  | 'active'
  | 'ending_soon'
  | 'expired'
  | 'terminated'
  | 'renewed';

export type RentalContractType = 'residencial' | 'comercial';

export interface RentalContract {
  id: string;
  
  // Property Info
  property_code: string;
  property_type: string;
  property_address: string;
  property_neighborhood: string | null;
  property_city: string;
  property_state: string;
  
  // Linked property (optional)
  rental_property_id: string | null;
  
  // Owner Info
  owner_name: string;
  owner_phone: string | null;
  owner_email: string | null;
  owner_pix_key: string | null;
  owner_bank_info: string | null;
  
  // Linked owner (optional)
  owner_id: string | null;
  owner?: {
    id: string;
    full_name: string;
    cpf?: string | null;
    email?: string | null;
    phone?: string | null;
    pix_key?: string | null;
  };
  
  // Tenant
  tenant_id: string | null;
  tenant?: {
    id: string;
    full_name: string;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    cpf: string | null;
    rg?: string | null;
    profession?: string | null;
    address?: string | null;
  };
  
  // Guarantor (fiador)
  guarantor_id: string | null;
  guarantor?: {
    id: string;
    full_name: string;
    cpf?: string | null;
    rg?: string | null;
    address?: string | null;
    property_address?: string | null;
    property_registration?: string | null;
    phone?: string | null;
  };
  
  // Contract Terms
  rent_value: number;
  condominium_fee: number;
  iptu_value: number;
  other_fees: number;
  
  payment_due_day: number;
  
  start_date: string;
  end_date: string;
  
  // Deposit
  deposit_value: number;
  deposit_months: number;
  guarantee_type: string | null;
  guarantee_type_enum?: 'caucao' | 'fiador' | 'seguro_fiador' | null;
  
  // Contract Type
  contract_type: RentalContractType | null;
  
  // Commercial specific
  allowed_activity?: string | null;
  renovation_terms?: string | null;
  commercial_point_clause?: boolean | null;
  
  // Insurance (seguro-fiança)
  insurance_company?: string | null;
  insurance_policy_number?: string | null;
  insurance_value?: number | null;
  
  // Status
  status: RentalContractStatus;
  
  // Management
  responsible_user_id: string | null;
  responsible_user?: {
    id: string;
    full_name: string;
  };
  management_fee_percentage: number;
  
  contract_document_url: string | null;
  notes: string | null;
  
  created_at: string;
  updated_at: string;
  created_by_user_id: string | null;
}

export interface RentalPayment {
  id: string;
  contract_id: string;
  contract?: RentalContract;
  
  reference_month: number;
  reference_year: number;
  due_date: string;
  
  // Values
  rent_value: number;
  condominium_fee: number;
  iptu_value: number;
  other_fees: number;
  late_fee: number;
  discount: number;
  
  // Payment Info
  status: RentalPaymentStatus;
  paid_amount: number | null;
  paid_at: string | null;
  payment_method: string | null;
  
  // External Payment
  external_payment_id: string | null;
  external_payment_url: string | null;
  
  payment_proof_url: string | null;
  notes: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface RentalAlertConfig {
  id: string;
  days_offset: number;
  alert_type: 'before_due' | 'on_due' | 'after_due';
  is_enabled: boolean;
  message_template: string | null;
  created_at: string;
  updated_at: string;
}

export interface RentalContractDocument {
  id: string;
  contract_id: string;
  name: string;
  document_type: string;
  file_url: string;
  uploaded_by_user_id: string | null;
  created_at: string;
}

// Computed helpers
export function getTotalMonthly(contract: RentalContract): number {
  return (
    contract.rent_value +
    contract.condominium_fee +
    contract.iptu_value +
    contract.other_fees
  );
}

export function getPaymentTotal(payment: RentalPayment): number {
  return (
    payment.rent_value +
    payment.condominium_fee +
    payment.iptu_value +
    payment.other_fees +
    payment.late_fee -
    payment.discount
  );
}

export function getContractDurationMonths(contract: RentalContract): number {
  const start = new Date(contract.start_date);
  const end = new Date(contract.end_date);
  const diffTime = end.getTime() - start.getTime();
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
  return diffMonths;
}

export function getDaysUntilEnd(contract: RentalContract): number {
  const end = new Date(contract.end_date);
  const today = new Date();
  const diffTime = end.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export const paymentStatusLabels: Record<RentalPaymentStatus, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  overdue: 'Em Atraso',
  partial: 'Parcial',
  cancelled: 'Cancelado',
};

export const contractStatusLabels: Record<RentalContractStatus, string> = {
  active: 'Ativo',
  ending_soon: 'Vencendo',
  expired: 'Vencido',
  terminated: 'Encerrado',
  renewed: 'Renovado',
};

export const guaranteeTypes = [
  { value: 'caucao', label: 'Caução' },
  { value: 'fiador', label: 'Fiador' },
  { value: 'seguro_fianca', label: 'Seguro Fiança' },
  { value: 'titulo_capitalizacao', label: 'Título de Capitalização' },
  { value: 'sem_garantia', label: 'Sem Garantia' },
];

export const propertyTypes = [
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

export const paymentMethods = [
  { value: 'pix', label: 'PIX' },
  { value: 'boleto', label: 'Boleto' },
  { value: 'transferencia', label: 'Transferência' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'cheque', label: 'Cheque' },
];

export const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril',
  'Maio', 'Junho', 'Julho', 'Agosto',
  'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
