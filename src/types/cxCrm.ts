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

export interface CxDeal {
  id: string;
  client_id: string;
  property_id: string | null;
  title: string | null;
  stage: CxDealStage;
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
