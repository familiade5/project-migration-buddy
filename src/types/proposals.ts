export type ProposalStage =
  | 'proposta'
  | 'em_analise'
  | 'pendencia'
  | 'aprovado'
  | 'assinatura'
  | 'registro'
  | 'concluido';

export type ChecklistStatus = 'pendente' | 'conforme' | 'nao_se_aplica';

export interface Proposal {
  id: string;
  status: string;
  stage: ProposalStage;
  corretor: string | null;
  agencia: string | null;
  nome: string;
  cpf: string | null;
  produto: string | null;
  imovel: string | null;
  matricula: string | null;
  oficio: string | null;
  cidade: string | null;
  telefone: string | null;
  email: string | null;
  valor_financiamento: number | null;
  banco: string | null;
  notas: string | null;
  responsible_user_id: string | null;
  created_by_user_id: string | null;
  stage_entered_at: string;
  created_at: string;
  updated_at: string;
}

export interface ProposalChecklistItem {
  id: string;
  proposal_id: string;
  category: string;
  item_key: string;
  item_label: string;
  status: ChecklistStatus;
  observacao: string | null;
  updated_by_user_id: string | null;
  updated_at: string;
  created_at: string;
}

export interface ProposalHistoryEntry {
  id: string;
  proposal_id: string;
  action: string;
  from_stage: ProposalStage | null;
  to_stage: ProposalStage | null;
  moved_by_user_id: string | null;
  moved_by_name: string | null;
  notes: string | null;
  created_at: string;
}

export const STAGE_CONFIG: Record<ProposalStage, { label: string; color: string; bgColor: string; borderColor: string }> = {
  proposta:    { label: 'Proposta',    color: '#6366f1', bgColor: '#eef2ff', borderColor: '#c7d2fe' },
  em_analise:  { label: 'Em Análise',  color: '#f59e0b', bgColor: '#fffbeb', borderColor: '#fde68a' },
  pendencia:   { label: 'Pendência',   color: '#ef4444', bgColor: '#fef2f2', borderColor: '#fecaca' },
  aprovado:    { label: 'Aprovado',    color: '#10b981', bgColor: '#ecfdf5', borderColor: '#a7f3d0' },
  assinatura:  { label: 'Assinatura',  color: '#3b82f6', bgColor: '#eff6ff', borderColor: '#bfdbfe' },
  registro:    { label: 'Registro',    color: '#8b5cf6', bgColor: '#f5f3ff', borderColor: '#ddd6fe' },
  concluido:   { label: 'Concluído',   color: '#059669', bgColor: '#d1fae5', borderColor: '#6ee7b7' },
};

export const STAGE_ORDER: ProposalStage[] = [
  'proposta', 'em_analise', 'pendencia', 'aprovado', 'assinatura', 'registro', 'concluido',
];

// Default checklist template per category
export const CHECKLIST_TEMPLATE: { category: string; categoryLabel: string; items: { key: string; label: string }[] }[] = [
  {
    category: 'documentacao',
    categoryLabel: 'Documentação',
    items: [
      { key: 'rg_cpf', label: 'RG e CPF' },
      { key: 'comprovante_residencia', label: 'Comprovante de Residência' },
      { key: 'comprovante_renda', label: 'Comprovante de Renda' },
      { key: 'certidao_estado_civil', label: 'Certidão de Estado Civil' },
      { key: 'extrato_fgts', label: 'Extrato FGTS' },
      { key: 'declaracao_ir', label: 'Declaração de IR' },
    ],
  },
  {
    category: 'juridico',
    categoryLabel: 'Jurídico',
    items: [
      { key: 'certidao_negativa_federal', label: 'Certidão Negativa Federal' },
      { key: 'certidao_negativa_estadual', label: 'Certidão Negativa Estadual' },
      { key: 'certidao_negativa_municipal', label: 'Certidão Negativa Municipal' },
      { key: 'certidao_negativa_trabalhista', label: 'Certidão Negativa Trabalhista' },
      { key: 'certidao_negativa_imovel', label: 'Certidão Negativa Imóvel' },
    ],
  },
  {
    category: 'caixa_banco',
    categoryLabel: 'Caixa / Banco',
    items: [
      { key: 'simulacao_aprovada', label: 'Simulação Aprovada' },
      { key: 'analise_credito', label: 'Análise de Crédito' },
      { key: 'vistoria_engenharia', label: 'Vistoria de Engenharia' },
      { key: 'laudo_avaliacao', label: 'Laudo de Avaliação' },
      { key: 'carta_aprovacao', label: 'Carta de Aprovação' },
    ],
  },
  {
    category: 'assinatura',
    categoryLabel: 'Assinatura',
    items: [
      { key: 'contrato_compra_venda', label: 'Contrato de Compra e Venda' },
      { key: 'contrato_financiamento', label: 'Contrato de Financiamento' },
      { key: 'procuracoes', label: 'Procurações' },
      { key: 'assinatura_vendedor', label: 'Assinatura do Vendedor' },
      { key: 'assinatura_comprador', label: 'Assinatura do Comprador' },
    ],
  },
  {
    category: 'registro',
    categoryLabel: 'Registro',
    items: [
      { key: 'escritura_publica', label: 'Escritura Pública' },
      { key: 'registro_imoveis', label: 'Registro em Cartório' },
      { key: 'it_bi', label: 'IT-BI (Imposto)' },
      { key: 'matricula_atualizada', label: 'Matrícula Atualizada' },
    ],
  },
];
