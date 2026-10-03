export type CxDealStage = string;

export interface CxStage {
  id: string;
  key: string;
  label: string;
  color: string;
  bg: string;
  border: string;
  position: number;
  is_system: boolean;
  is_active: boolean;
}

export type CxRejectionReason = 'rating' | 'capacidade' | 'outro';
export type CxCreditAnalysisResult = 'aprovado' | 'condicionado' | 'reprovado' | 'erro';
export type CxProcessStatus =
  | 'novo_cadastro' | 'aguardando_analise' | 'acompanhamento_credito' | 'credito_aprovado'
  | 'vinculacao_imovel' | 'documentacao' | 'engenharia' | 'pendencia_engenharia'
  | 'contratacao' | 'itbi_registro' | 'entrega_chaves' | 'concluido' | 'perdido';

export interface CxDeal {
  id: string;
  client_id: string;
  property_id: string | null;
  title: string | null;
  stage: CxDealStage;
  purchase_type: CxPurchaseType | null;
  credit_status: CxCreditStatus | null;
  process_number?: string | null;
  process_status?: CxProcessStatus;
  next_action?: string | null;
  next_action_responsible_id?: string | null;
  next_action_responsible_name?: string | null;
  next_action_due_at?: string | null;
  opened_at?: string;
  closed_at?: string | null;
  lost_reason?: string | null;
  archived_at?: string | null;
  rejection_reason: CxRejectionReason | null;
  rejection_notes: string | null;
  bank: string | null;
  property_value: number | null;
  financing_value: number | null;
  down_payment: number | null;
  fgts_value: number | null;
  subsidy_value: number | null;
  monthly_income: number | null;
  installment_value: number | null;
  rating: string | null;
  margin_value: number | null;
  approved_value: number | null;
  approval_expires_at: string | null;
  next_review_at: string | null;
  review_interval_days: number;
  pendencies: string | null;
  notes: string | null;
  responsible_user_id: string | null;
  responsible_name: string | null;
  stage_entered_at: string;
  created_by_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CxDealHistory {
  id: string;
  deal_id: string;
  from_stage: CxDealStage | null;
  to_stage: CxDealStage;
  moved_by_user_id: string | null;
  moved_by_name: string | null;
  notes: string | null;
  created_at: string;
}

export interface CxDealCheck {
  id: string;
  deal_id: string;
  checked_at: string;
  rating: string | null;
  margin_value: number | null;
  approved_value: number | null;
  result: string | null;
  notes: string | null;
  created_by_user_id: string | null;
  created_by_name: string | null;
  created_at: string;
}

export interface CxCreditAnalysis {
  id: string;
  deal_id: string;
  client_id: string;
  sequence_number: number;
  analysis_date: string;
  result: CxCreditAnalysisResult;
  proposal_code: string | null;
  appraisal_code: string | null;
  correspondent_code: string | null;
  analyzed_cpf: string | null;
  analyzed_name: string | null;
  registration_protocol: string | null;
  relationship_agency: string | null;
  funding_source: string | null;
  modality: string | null;
  product: string | null;
  credit_line: 'mcmv' | 'sbpe' | 'outro' | null;
  mcmv_tier: 'faixa_1' | 'faixa_2' | 'faixa_3' | 'faixa_4' | null;
  property_value: number | null;
  financing_value: number | null;
  approved_value: number | null;
  possible_installment: number | null;
  installment_value: number | null;
  indexer: string | null;
  amortization_system: string | null;
  term_months: number | null;
  originating_system: string | null;
  response_at: string | null;
  validity_start: string | null;
  validity_end: string | null;
  rating: string | null;
  margin_value: number | null;
  condition_category: string | null;
  condition_reason: string | null;
  rejection_category: CxRejectionReason | null;
  rejection_reason: string | null;
  error_message: string | null;
  error_reference: string | null;
  operator_name: string | null;
  analyst_name: string | null;
  source_document_id: string | null;
  notes: string | null;
  created_at: string;
}

export const CX_ANALYSIS_RESULT = {
  aprovado: { label: 'Aprovado', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  condicionado: { label: 'Condicionado', tone: 'bg-amber-50 text-amber-700 border-amber-200' },
  reprovado: { label: 'Reprovado', tone: 'bg-red-50 text-red-700 border-red-200' },
  erro: { label: 'Erro de validação', tone: 'bg-rose-50 text-rose-700 border-rose-200' },
} satisfies Record<CxCreditAnalysisResult, { label: string; tone: string }>;

export function cxProcessStatusForStage(stage: string): CxProcessStatus {
  const map: Record<string, CxProcessStatus> = {
    cadastro: 'novo_cadastro', tipo_compra: 'novo_cadastro', analise_credito: 'aguardando_analise',
    pendencia: 'acompanhamento_credito', credito_aprovado: 'credito_aprovado',
    vincular_imovel: 'vinculacao_imovel', documentacao: 'documentacao', engenharia: 'engenharia',
    pendencia_engenharia: 'pendencia_engenharia', contrato: 'contratacao', itbi_registro: 'itbi_registro',
    entrega_chaves: 'entrega_chaves', concluido: 'concluido', perdido: 'perdido',
  };
  return map[stage] ?? 'novo_cadastro';
}

export const CX_STAGE_ORDER: CxDealStage[] = [
  'simulacao',
  'documentacao',
  'em_analise',
  'condicionado',
  'aprovado',
  'contrato',
  'reprovado',
];

export const CX_STAGE_CONFIG: Record<
  string,
  { label: string; short: string; color: string; bg: string; border: string }
> = {
  simulacao: { label: 'Simulação', short: 'Simulação', color: '#64748b', bg: '#f8fafc', border: '#cbd5e1' },
  documentacao: { label: 'Documentação', short: 'Documentação', color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd' },
  em_analise: { label: 'Em análise', short: 'Em análise', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
  condicionado: { label: 'Condicionado', short: 'Condicionado', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  aprovado: { label: 'Aprovado', short: 'Aprovado', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
  contrato: { label: 'Contrato / Assinatura', short: 'Contrato', color: '#1a3a6b', bg: '#eff6ff', border: '#bfdbfe' },
  reprovado: { label: 'Reprovado', short: 'Reprovado', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
};

export const CX_REJECTION_CONFIG: Record<CxRejectionReason, { label: string; short: string }> = {
  rating: { label: 'Reprovado por rating', short: 'Rating' },
  capacidade: { label: 'Reprovado por capacidade de pagamento', short: 'Capacidade' },
  outro: { label: 'Outro motivo', short: 'Outro' },
};

export const CX_BANKS = [
  'Caixa Econômica Federal',
  'Banco do Brasil',
  'Itaú',
  'Bradesco',
  'Santander',
  'Inter',
  'Outro',
];

export function cxCurrency(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

export function cxDaysUntil(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

export const CX_STAGE_PALETTE: { label: string; color: string; bg: string; border: string }[] = [
  { label: 'Azul', color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd' },
  { label: 'Roxo', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
  { label: 'Verde', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
  { label: 'Âmbar', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  { label: 'Vermelho', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  { label: 'Cinza', color: '#64748b', bg: '#f8fafc', border: '#cbd5e1' },
  { label: 'Marinho', color: '#1a3a6b', bg: '#eff6ff', border: '#bfdbfe' },
  { label: 'Rosa', color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8' },
];

const CX_STAGE_FALLBACK = { label: 'Etapa', short: 'Etapa', color: '#64748b', bg: '#f8fafc', border: '#cbd5e1' };

export function cxStageCfg(stages: CxStage[], key: string | null | undefined) {
  if (!key) return CX_STAGE_FALLBACK;
  const found = stages.find((s) => s.key === key);
  if (found) {
    return { label: found.label, short: found.label, color: found.color, bg: found.bg, border: found.border };
  }
  return CX_STAGE_CONFIG[key] || { ...CX_STAGE_FALLBACK, label: key, short: key };
}

export function cxStageKeyFromLabel(label: string) {
  return label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40);
}

// ================= Fluxo do funil (regras) =================
export type CxPurchaseType = 'avista' | 'financiada';
export type CxCreditStatus = 'aprovado' | 'condicionado' | 'reprovado' | 'erro';

export const CX_PURCHASE_LABEL: Record<CxPurchaseType, string> = {
  avista: 'À vista',
  financiada: 'Financiada',
};

/** Etapas pós-crédito, em sequência obrigatória. */
export const CX_CLOSING_TRACK = ['vincular_imovel', 'documentacao', 'engenharia', 'contrato', 'itbi_registro', 'entrega_chaves', 'concluido'];
export const CX_CREDIT_STAGES = ['analise_credito', 'credito_aprovado', 'pendencia'];

type FlowDeal = Pick<CxDeal, 'stage' | 'property_id'> & {
  purchase_type?: string | null;
  credit_status?: string | null;
};

/** Retorna o motivo do bloqueio, ou null se a mudança de etapa for permitida. */
export function cxMoveBlocker(deal: FlowDeal, to: string): string | null {
  const from = deal.stage;
  if (from === to) return null;
  const type = deal.purchase_type;
  if (to === 'cadastro' || to === 'tipo_compra') return null;
  if (CX_CREDIT_STAGES.includes(to)) {
    if (type !== 'financiada') return 'Análise de crédito é só para compra financiada.';
    if (to === 'credito_aprovado' && from !== 'analise_credito')
      return 'O crédito só pode ser aprovado a partir da Análise de crédito.';
    if (to === 'pendencia' && from !== 'analise_credito' && from !== 'credito_aprovado')
      return 'Pendência vem de uma análise de crédito não aprovada.';
    return null;
  }
  const track = type === 'avista'
    ? ['vincular_imovel', 'documentacao', 'contrato', 'itbi_registro', 'entrega_chaves', 'concluido']
    : CX_CLOSING_TRACK;
  if (to === 'pendencia_engenharia') return from === 'engenharia' ? null : 'A pendência de engenharia deve partir da vistoria.';
  const idx = track.indexOf(to);
  if (idx >= 0) {
    if (!type) return 'Defina primeiro o tipo de compra (à vista ou financiada).';
    if (type === 'financiada' && deal.credit_status !== 'aprovado')
      return 'Compra financiada só avança para Vincular imóvel após o crédito aprovado.';
    const fromIdx = from === 'pendencia_engenharia' ? track.indexOf('engenharia') : track.indexOf(from);
    if (idx === 0) return null;
    if (fromIdx < 0 || fromIdx < idx - 1) return `Avance uma etapa por vez até "${to.replace(/_/g, ' ')}".`;
    if (idx >= 1 && !deal.property_id) return 'Vincule um imóvel ao caso antes de seguir para o Contrato.';
    return null;
  }
  return null; // etapas personalizadas
}

/** Campos extras a gravar ao entrar numa etapa. */
export function cxStagePatch(to: string): Record<string, unknown> {
  return { process_status: cxProcessStatusForStage(to) };
}

// ================= Próxima ação (mesa do analista) =================
export interface CxNextAction {
  label: string;
  urgent: boolean;
}

/** O que o analista precisa fazer agora neste caso. */
export function cxNextAction(deal: CxDeal): CxNextAction | null {
  const days = cxDaysUntil(deal.next_review_at);
  switch (deal.stage) {
    case 'cadastro':
    case 'tipo_compra':
      return { label: 'Definir tipo de compra', urgent: false };
    case 'analise_credito':
      return { label: 'Registrar resultado da análise', urgent: false };
    case 'credito_aprovado':
      return { label: 'Vincular imóvel', urgent: false };
    case 'pendencia':
      return days !== null && days <= 0
        ? { label: days < 0 ? `Pendência vencida há ${Math.abs(days)}d` : 'Pendência vence hoje', urgent: true }
        : { label: 'Acompanhar pendência', urgent: false };
    case 'vincular_imovel':
      return { label: deal.property_id ? 'Iniciar documentação' : 'Vincular imóvel', urgent: false };
    case 'documentacao':
      return { label: 'Conferir documentação', urgent: false };
    case 'engenharia':
      return { label: 'Acompanhar vistoria', urgent: false };
    case 'pendencia_engenharia':
      return { label: 'Resolver pendência da vistoria', urgent: true };
    case 'contrato':
      return { label: 'Concluir contrato', urgent: false };
    case 'itbi_registro':
      return { label: 'Concluir ITBI/Registro', urgent: false };
    case 'entrega_chaves':
      return { label: 'Entregar as chaves', urgent: false };
    case 'concluido':
      return null;
    default:
      return { label: 'Avançar etapa', urgent: false };
  }
}

/** Dias desde a última mudança de etapa. */
export function cxDaysIdle(deal: CxDeal): number {
  const t = new Date(deal.stage_entered_at || deal.updated_at).getTime();
  return Number.isNaN(t) ? 0 : Math.floor((Date.now() - t) / 86400000);
}

export const CX_FLOW_AVISTA = ['cadastro', 'tipo_compra', 'vincular_imovel', 'documentacao', 'contrato', 'itbi_registro', 'entrega_chaves', 'concluido'];
export const CX_FLOW_FINANCIADA = ['cadastro', 'tipo_compra', 'analise_credito', 'credito_aprovado', 'vincular_imovel', 'documentacao', 'engenharia', 'contrato', 'itbi_registro', 'entrega_chaves', 'concluido'];
