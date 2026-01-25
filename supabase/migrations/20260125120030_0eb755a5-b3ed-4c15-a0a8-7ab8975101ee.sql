-- Enum para os estágios do Kanban
CREATE TYPE public.property_stage AS ENUM (
  'novo_imovel',
  'em_anuncio',
  'proposta_recebida',
  'proposta_aceita',
  'documentacao_enviada',
  'registro_em_andamento',
  'registro_concluido',
  'aguardando_pagamento',
  'pago',
  'comissao_liberada'
);

-- Enum para tipo de imóvel
CREATE TYPE public.property_type AS ENUM (
  'casa',
  'apartamento',
  'terreno',
  'comercial',
  'rural',
  'outro'
);

-- Tabela principal de imóveis do CRM
CREATE TABLE public.crm_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  property_type property_type NOT NULL DEFAULT 'casa',
  address TEXT,
  neighborhood TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'MS',
  sale_value DECIMAL(12, 2),
  commission_value DECIMAL(12, 2),
  commission_percentage DECIMAL(5, 2),
  current_stage property_stage NOT NULL DEFAULT 'novo_imovel',
  responsible_user_id UUID REFERENCES auth.users(id),
  has_creatives BOOLEAN NOT NULL DEFAULT false,
  has_proposal BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  expected_payment_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  stage_entered_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Histórico de movimentações
CREATE TABLE public.crm_property_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.crm_properties(id) ON DELETE CASCADE,
  from_stage property_stage,
  to_stage property_stage NOT NULL,
  moved_by_user_id UUID REFERENCES auth.users(id),
  moved_by_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Documentos do imóvel
CREATE TABLE public.crm_property_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.crm_properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_by_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comissões relacionadas ao imóvel
CREATE TABLE public.crm_property_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.crm_properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL,
  value DECIMAL(12, 2),
  is_paid BOOLEAN NOT NULL DEFAULT false,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crm_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_property_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_property_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_property_commissions ENABLE ROW LEVEL SECURITY;

-- Policies para crm_properties (todos autenticados podem ver, admins podem tudo)
CREATE POLICY "Authenticated users can view properties"
  ON public.crm_properties FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert properties"
  ON public.crm_properties FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update properties"
  ON public.crm_properties FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete properties"
  ON public.crm_properties FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies para crm_property_history
CREATE POLICY "Authenticated users can view history"
  ON public.crm_property_history FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert history"
  ON public.crm_property_history FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policies para crm_property_documents
CREATE POLICY "Authenticated users can view documents"
  ON public.crm_property_documents FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage documents"
  ON public.crm_property_documents FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies para crm_property_commissions
CREATE POLICY "Authenticated users can view commissions"
  ON public.crm_property_commissions FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage commissions"
  ON public.crm_property_commissions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_crm_properties_updated_at
  BEFORE UPDATE ON public.crm_properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_crm_properties_stage ON public.crm_properties(current_stage);
CREATE INDEX idx_crm_properties_responsible ON public.crm_properties(responsible_user_id);
CREATE INDEX idx_crm_property_history_property ON public.crm_property_history(property_id);
CREATE INDEX idx_crm_property_documents_property ON public.crm_property_documents(property_id);
CREATE INDEX idx_crm_property_commissions_property ON public.crm_property_commissions(property_id);

-- Enable realtime para atualizações em tempo real do Kanban
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_properties;