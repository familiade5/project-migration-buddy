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
  cover_image_url: string | null;
  source_creative_id: string | null;
  created_by_user_id: string | null;
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
  novo_imovel: { label: 'Novo Imóvel', color: '#6b7280', bgColor: '#f9fafb' },
  em_anuncio: { label: 'Em Anúncio', color: '#4b5563', bgColor: '#f3f4f6' },
  proposta_recebida: { label: 'Proposta Recebida', color: '#374151', bgColor: '#f3f4f6' },
  proposta_aceita: { label: 'Proposta Aceita', color: '#1f2937', bgColor: '#e5e7eb' },
  documentacao_enviada: { label: 'Documentação Enviada', color: '#374151', bgColor: '#f3f4f6' },
  registro_em_andamento: { label: 'Registro em Andamento', color: '#4b5563', bgColor: '#f3f4f6' },
  registro_concluido: { label: 'Registro Concluído', color: '#1f2937', bgColor: '#e5e7eb' },
  aguardando_pagamento: { label: 'Aguardando Pagamento', color: '#374151', bgColor: '#f3f4f6' },
  pago: { label: 'Pago', color: '#111827', bgColor: '#d1d5db' },
  comissao_liberada: { label: 'Comissão Liberada', color: '#111827', bgColor: '#d1d5db' },
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
