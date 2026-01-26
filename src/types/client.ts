export interface CrmClient {
  id: string;
  full_name: string;
  cpf: string | null;
  rg: string | null;
  birth_date: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string;
  zip_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by_user_id: string | null;
}

export interface CrmClientDocument {
  id: string;
  client_id: string;
  name: string;
  document_type: string;
  file_url: string;
  created_at: string;
  uploaded_by_user_id: string | null;
}

export const CLIENT_DOCUMENT_TYPES = [
  { value: 'rg', label: 'RG' },
  { value: 'cpf', label: 'CPF' },
  { value: 'comprovante_residencia', label: 'Comprovante de Residência' },
  { value: 'comprovante_renda', label: 'Comprovante de Renda' },
  { value: 'certidao_casamento', label: 'Certidão de Casamento' },
  { value: 'procuracao', label: 'Procuração' },
  { value: 'contrato', label: 'Contrato' },
  { value: 'outro', label: 'Outro' },
] as const;
