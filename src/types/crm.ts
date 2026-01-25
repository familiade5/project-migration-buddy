export type PropertyStage = 
  | 'novo_imovel'
  | 'em_anuncio'
  | 'proposta_recebida'
  | 'proposta_aceita'
  | 'documentacao_enviada'
  | 'registro_em_andamento'
  | 'registro_concluido'
  | 'aguardando_pagamento'
  | 'pago'
  | 'comissao_liberada';

export type PropertyType = 
  | 'casa'
  | 'apartamento'
  | 'terreno'
  | 'comercial'
  | 'rural'
  | 'outro';

export interface CrmProperty {
  id: string;
  code: string;
  property_type: PropertyType;
  address: string | null;
  neighborhood: string | null;
  city: string;
  state: string;
  sale_value: number | null;
  commission_value: number | null;
  commission_percentage: number | null;
  current_stage: PropertyStage;
  responsible_user_id: string | null;
  responsible_user_name?: string;
  has_creatives: boolean;
  has_proposal: boolean;
  notes: string | null;
  expected_payment_date: string | null;
  created_at: string;
  updated_at: string;
  stage_entered_at: string;
}

export interface CrmPropertyHistory {
  id: string;
  property_id: string;
  from_stage: PropertyStage | null;
  to_stage: PropertyStage;
  moved_by_user_id: string | null;
  moved_by_name: string | null;
  notes: string | null;
  created_at: string;
}

export interface CrmPropertyDocument {
  id: string;
  property_id: string;
  name: string;
  file_url: string;
  uploaded_by_user_id: string | null;
  created_at: string;
}

export interface CrmPropertyCommission {
  id: string;
  property_id: string;
  user_id: string | null;
  user_name: string;
  percentage: number;
  value: number | null;
  is_paid: boolean;
  paid_at: string | null;
  created_at: string;
}

export const STAGE_CONFIG: Record<PropertyStage, { label: string; color: string; bgColor: string }> = {
  novo_imovel: { label: 'Novo Imóvel', color: '#64748b', bgColor: '#1e293b' },
  em_anuncio: { label: 'Em Anúncio', color: '#8b5cf6', bgColor: '#1e1b4b' },
  proposta_recebida: { label: 'Proposta Recebida', color: '#f59e0b', bgColor: '#451a03' },
  proposta_aceita: { label: 'Proposta Aceita', color: '#22c55e', bgColor: '#052e16' },
  documentacao_enviada: { label: 'Documentação Enviada', color: '#06b6d4', bgColor: '#083344' },
  registro_em_andamento: { label: 'Registro em Andamento', color: '#3b82f6', bgColor: '#172554' },
  registro_concluido: { label: 'Registro Concluído', color: '#10b981', bgColor: '#022c22' },
  aguardando_pagamento: { label: 'Aguardando Pagamento', color: '#eab308', bgColor: '#422006' },
  pago: { label: 'Pago', color: '#22d3ee', bgColor: '#164e63' },
  comissao_liberada: { label: 'Comissão Liberada', color: '#a855f7', bgColor: '#3b0764' },
};

export const STAGE_ORDER: PropertyStage[] = [
  'novo_imovel',
  'em_anuncio',
  'proposta_recebida',
  'proposta_aceita',
  'documentacao_enviada',
  'registro_em_andamento',
  'registro_concluido',
  'aguardando_pagamento',
  'pago',
  'comissao_liberada',
];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  casa: 'Casa',
  apartamento: 'Apartamento',
  terreno: 'Terreno',
  comercial: 'Comercial',
  rural: 'Rural',
  outro: 'Outro',
};
