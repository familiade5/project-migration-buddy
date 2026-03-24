export type LeadSdrStage =
  | 'lead_recebido'
  | 'em_atendimento'
  | 'qualificando'
  | 'qualificado'
  | 'nao_qualificado';

export type LeadSalesStage =
  | 'recebido_sdr'
  | 'em_atendimento_venda'
  | 'apresentacao_imoveis'
  | 'negociacao'
  | 'proposta_enviada'
  | 'fechado'
  | 'perdido';

export type LeadClassificacao = 'quente' | 'morno' | 'frio';

export interface CrmLead {
  id: string;
  nome: string;
  telefone: string;
  cidade: string | null;
  origem_lead: string | null;
  sdr_stage: LeadSdrStage;
  sdr_responsavel_id: string | null;
  sdr_responsavel_nome: string | null;
  sales_stage: LeadSalesStage | null;
  sales_responsavel_id: string | null;
  sales_responsavel_nome: string | null;
  classificacao: LeadClassificacao;
  anotacoes: string | null;
  objecoes: string | null;
  valor_estimado: number | null;
  tem_interesse: boolean;
  tem_condicao_financeira: boolean;
  momento_compra: boolean;
  data_entrada: string;
  stage_entered_at: string;
  ultima_interacao_at: string | null;
  proposal_id: string | null;
  created_by_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CrmLeadHistory {
  id: string;
  lead_id: string;
  action: string;
  from_sdr_stage: string | null;
  to_sdr_stage: string | null;
  from_sales_stage: string | null;
  to_sales_stage: string | null;
  moved_by_user_id: string | null;
  moved_by_name: string | null;
  notes: string | null;
  created_at: string;
}

export interface CrmLeadInteraction {
  id: string;
  lead_id: string;
  tipo: string;
  descricao: string;
  created_by_user_id: string | null;
  created_by_name: string | null;
  created_at: string;
}

export const SDR_STAGE_CONFIG: Record<LeadSdrStage, { label: string; color: string; bgColor: string; borderColor: string }> = {
  lead_recebido:    { label: 'Lead Recebido',    color: '#6366f1', bgColor: '#eef2ff', borderColor: '#c7d2fe' },
  em_atendimento:   { label: 'Em Atendimento',   color: '#f59e0b', bgColor: '#fffbeb', borderColor: '#fde68a' },
  qualificando:     { label: 'Qualificando',      color: '#3b82f6', bgColor: '#eff6ff', borderColor: '#bfdbfe' },
  qualificado:      { label: 'Qualificado',       color: '#10b981', bgColor: '#ecfdf5', borderColor: '#a7f3d0' },
  nao_qualificado:  { label: 'Não Qualificado',   color: '#ef4444', bgColor: '#fef2f2', borderColor: '#fecaca' },
};

export const SALES_STAGE_CONFIG: Record<LeadSalesStage, { label: string; color: string; bgColor: string; borderColor: string }> = {
  recebido_sdr:          { label: 'Recebido do SDR',       color: '#6366f1', bgColor: '#eef2ff', borderColor: '#c7d2fe' },
  em_atendimento_venda:  { label: 'Em Atendimento',        color: '#f59e0b', bgColor: '#fffbeb', borderColor: '#fde68a' },
  apresentacao_imoveis:  { label: 'Apresentação de Imóveis', color: '#8b5cf6', bgColor: '#f5f3ff', borderColor: '#ddd6fe' },
  negociacao:            { label: 'Negociação',             color: '#ec4899', bgColor: '#fdf2f8', borderColor: '#fbcfe8' },
  proposta_enviada:      { label: 'Proposta Enviada',       color: '#3b82f6', bgColor: '#eff6ff', borderColor: '#bfdbfe' },
  fechado:               { label: 'Fechado',                color: '#059669', bgColor: '#d1fae5', borderColor: '#6ee7b7' },
  perdido:               { label: 'Perdido',                color: '#6b7280', bgColor: '#f9fafb', borderColor: '#e5e7eb' },
};

export const SDR_STAGE_ORDER: LeadSdrStage[] = [
  'lead_recebido', 'em_atendimento', 'qualificando', 'qualificado', 'nao_qualificado',
];

export const SALES_STAGE_ORDER: LeadSalesStage[] = [
  'recebido_sdr', 'em_atendimento_venda', 'apresentacao_imoveis', 'negociacao', 'proposta_enviada', 'fechado', 'perdido',
];

export const CLASSIFICACAO_CONFIG: Record<LeadClassificacao, { label: string; color: string; emoji: string }> = {
  quente: { label: 'Quente', color: '#ef4444', emoji: '🔥' },
  morno:  { label: 'Morno',  color: '#f59e0b', emoji: '🌡️' },
  frio:   { label: 'Frio',   color: '#3b82f6', emoji: '❄️' },
};

export const ORIGEM_OPTIONS = [
  'Tráfego pago',
  'Instagram',
  'Facebook',
  'Google',
  'Indicação',
  'WhatsApp',
  'Portais (Zap/OLX)',
  'Evento',
  'Outro',
];
