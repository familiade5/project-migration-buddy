
-- Create enum for lead stages (SDR pipeline)
CREATE TYPE public.lead_sdr_stage AS ENUM (
  'lead_recebido',
  'em_atendimento',
  'qualificando',
  'qualificado',
  'nao_qualificado'
);

-- Create enum for lead classification
CREATE TYPE public.lead_classificacao AS ENUM (
  'quente',
  'morno',
  'frio'
);

-- Create enum for sales pipeline stages
CREATE TYPE public.lead_sales_stage AS ENUM (
  'recebido_sdr',
  'em_atendimento_venda',
  'apresentacao_imoveis',
  'negociacao',
  'proposta_enviada',
  'fechado',
  'perdido'
);

-- Create crm_leads table
CREATE TABLE public.crm_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  cidade TEXT,
  origem_lead TEXT,
  sdr_stage public.lead_sdr_stage NOT NULL DEFAULT 'lead_recebido',
  sdr_responsavel_id UUID,
  sdr_responsavel_nome TEXT,
  sales_stage public.lead_sales_stage,
  sales_responsavel_id UUID,
  sales_responsavel_nome TEXT,
  classificacao public.lead_classificacao NOT NULL DEFAULT 'morno',
  anotacoes TEXT,
  objecoes TEXT,
  valor_estimado NUMERIC,
  tem_interesse BOOLEAN DEFAULT false,
  tem_condicao_financeira BOOLEAN DEFAULT false,
  momento_compra BOOLEAN DEFAULT false,
  data_entrada TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  stage_entered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ultima_interacao_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  proposal_id UUID,
  created_by_user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view leads" ON public.crm_leads FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can insert leads" ON public.crm_leads FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update leads" ON public.crm_leads FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete leads" ON public.crm_leads FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create crm_lead_history table
CREATE TABLE public.crm_lead_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  action TEXT NOT NULL,
  from_sdr_stage TEXT,
  to_sdr_stage TEXT,
  from_sales_stage TEXT,
  to_sales_stage TEXT,
  moved_by_user_id UUID,
  moved_by_name TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_lead_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view lead history" ON public.crm_lead_history FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can insert lead history" ON public.crm_lead_history FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create crm_lead_interactions table
CREATE TABLE public.crm_lead_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'anotacao',
  descricao TEXT NOT NULL,
  created_by_user_id UUID,
  created_by_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_lead_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view interactions" ON public.crm_lead_interactions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can insert interactions" ON public.crm_lead_interactions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE TRIGGER update_crm_leads_updated_at
  BEFORE UPDATE ON public.crm_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_crm_leads_sdr_stage ON public.crm_leads(sdr_stage);
CREATE INDEX idx_crm_leads_sales_stage ON public.crm_leads(sales_stage);
CREATE INDEX idx_crm_lead_history_lead_id ON public.crm_lead_history(lead_id);
CREATE INDEX idx_crm_lead_interactions_lead_id ON public.crm_lead_interactions(lead_id);
