export interface CxField {
  label: string;
  value: string;
}

export interface CxGroup {
  title: string;
  fields: CxField[];
}

export interface CxBankCredit {
  date: string;
  description: string;
  counterparty?: string | null;
  kind?: string | null;
  amount: number;
  included: boolean;
  reason?: string | null;
}

export interface CxBankAnalysis {
  holder?: string | null;
  bank?: string | null;
  account?: string | null;
  period?: string | null;
  periodStart?: string | null;
  periodEnd?: string | null;
  months: string[];
  credits: CxBankCredit[];
}

export interface CxIrpfPjIncome {
  cnpj?: string | null;
  sourceName?: string | null;
  taxableIncome: number;
  inssWithheld?: boolean | null;
  inssAmount?: number | null;
  irrfAmount?: number | null;
  thirteenthSalary?: number | null;
  irrf13Amount?: number | null;
}

export interface CxIrpfExemptIncome {
  description: string;
  cnpj?: string | null;
  sourceName?: string | null;
  amount: number;
  isProfitDistribution?: boolean | null;
}

export interface CxIrpfAsset {
  code?: string | null;
  description: string;
  category?: 'empresa' | 'imovel' | 'veiculo' | 'outro' | string | null;
  value?: number | null;
}

export interface CxIrpfAnalysis {
  holder?: string | null;
  cpf?: string | null;
  year?: string | null;
  pjIncomes: CxIrpfPjIncome[];
  exemptIncomes: CxIrpfExemptIncome[];
  assets: CxIrpfAsset[];
}

export interface CxExtraction {
  documentType?: string | null;
  summary?: string | null;
  groups: CxGroup[];
  bankAnalysis?: CxBankAnalysis | null;
  irpfAnalysis?: CxIrpfAnalysis | null;
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
  portal_user_id?: string | null;
  portal_token?: string | null;
  parent_client_id?: string | null;
  relationship?: string | null;
  submission_status?: string | null;
  submitted_at?: string | null;
  review_notes?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export const CX_SUBMISSION_STATUS = [
  { value: 'rascunho', label: 'Em preenchimento', color: 'text-slate-600', bg: 'bg-slate-100' },
  { value: 'enviado', label: 'Enviado', color: 'text-blue-700', bg: 'bg-blue-50' },
  { value: 'em_analise', label: 'Em análise', color: 'text-indigo-700', bg: 'bg-indigo-50' },
  { value: 'pendencia', label: 'Pendência', color: 'text-amber-700', bg: 'bg-amber-50' },
  { value: 'aprovado', label: 'Tudo certo', color: 'text-emerald-700', bg: 'bg-emerald-50' },
] as const;

export const CX_STATUS_INFO = (value?: string | null) =>
  CX_SUBMISSION_STATUS.find((s) => s.value === (value || 'rascunho')) || CX_SUBMISSION_STATUS[0];


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
  { value: 'extrato_bancario', label: 'Extrato Bancário (comprovação de renda)' },
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
