
-- Enum for proposal stages
CREATE TYPE public.proposal_stage AS ENUM (
  'proposta',
  'em_analise',
  'pendencia',
  'aprovado',
  'assinatura',
  'registro',
  'concluido'
);

-- Enum for checklist item status
CREATE TYPE public.checklist_status AS ENUM (
  'pendente',
  'conforme',
  'nao_se_aplica'
);

-- Main proposals table
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'Pendente',
  stage proposal_stage NOT NULL DEFAULT 'proposta',
  corretor TEXT,
  agencia TEXT,
  nome TEXT NOT NULL,
  cpf TEXT,
  produto TEXT,
  imovel TEXT,
  matricula TEXT,
  oficio TEXT,
  cidade TEXT,
  telefone TEXT,
  email TEXT,
  valor_financiamento NUMERIC,
  banco TEXT,
  notas TEXT,
  responsible_user_id UUID,
  created_by_user_id UUID,
  stage_entered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Proposal checklist items
CREATE TABLE public.proposal_checklist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  item_key TEXT NOT NULL,
  item_label TEXT NOT NULL,
  status checklist_status NOT NULL DEFAULT 'pendente',
  observacao TEXT,
  updated_by_user_id UUID,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Proposal history / audit trail
CREATE TABLE public.proposal_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  from_stage proposal_stage,
  to_stage proposal_stage,
  moved_by_user_id UUID,
  moved_by_name TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_history ENABLE ROW LEVEL SECURITY;

-- Proposals RLS
CREATE POLICY "Authenticated users can view proposals"
  ON public.proposals FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert proposals"
  ON public.proposals FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update proposals"
  ON public.proposals FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete proposals"
  ON public.proposals FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Checklist RLS
CREATE POLICY "Authenticated users can view checklist"
  ON public.proposal_checklist FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage checklist"
  ON public.proposal_checklist FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- History RLS
CREATE POLICY "Authenticated users can view proposal history"
  ON public.proposal_history FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert proposal history"
  ON public.proposal_history FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Indexes
CREATE INDEX idx_proposals_stage ON public.proposals(stage);
CREATE INDEX idx_proposals_corretor ON public.proposals(corretor);
CREATE INDEX idx_proposals_cidade ON public.proposals(cidade);
CREATE INDEX idx_proposal_checklist_proposal_id ON public.proposal_checklist(proposal_id);
CREATE INDEX idx_proposal_history_proposal_id ON public.proposal_history(proposal_id);

-- Trigger for proposals updated_at
CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for checklist updated_at
CREATE TRIGGER update_proposal_checklist_updated_at
  BEFORE UPDATE ON public.proposal_checklist
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
