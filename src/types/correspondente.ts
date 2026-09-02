export interface CxField {
  label: string;
  value: string;
}

export interface CxGroup {
  title: string;
  fields: CxField[];
}

export interface CxExtraction {
  documentType?: string | null;
  summary?: string | null;
  groups: CxGroup[];
}

export interface CxClient {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  notes: string | null;
  extracted: Record<string, unknown>;
  created_by_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CxDocument {
  id: string;
  client_id: string;
  doc_type: string;
  file_name: string;
  file_path: string;
  mime_type: string | null;
  status: 'pending' | 'processing' | 'done' | 'error' | string;
  error_message: string | null;
  extracted: CxExtraction | Record<string, never>;
  uploaded_by_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export const CX_DOC_TYPES = [
  { value: 'rg', label: 'RG / CNH' },
  { value: 'cpf', label: 'CPF' },
  { value: 'certidao', label: 'Certidão (Nascimento/Casamento)' },
  { value: 'comprovante_residencia', label: 'Comprovante de Residência' },
  { value: 'contracheque', label: 'Contracheque' },
  { value: 'imposto_renda', label: 'Imposto de Renda' },
  { value: 'recibo_ir', label: 'Recibo do Imposto de Renda' },
  { value: 'ctps', label: 'CTPS' },
  { value: 'extrato_fgts', label: 'Extrato de FGTS' },
  { value: 'outro', label: 'Outro' },
] as const;

export const CX_DOC_LABEL = (value: string) =>
  CX_DOC_TYPES.find((t) => t.value === value)?.label || 'Outro';

/** Checklist de documentos solicitados ao cliente */
export const CX_CHECKLIST = [
  'rg',
  'cpf',
  'certidao',
  'comprovante_residencia',
  'contracheque',
  'imposto_renda',
  'recibo_ir',
  'ctps',
  'extrato_fgts',
];
