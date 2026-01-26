-- ==============================================
-- Manager Control Layer: Stage Completion System
-- ==============================================

-- Table to define what each stage requires to be considered "complete"
CREATE TABLE public.crm_stage_completion_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage property_stage NOT NULL UNIQUE,
    requires_document BOOLEAN NOT NULL DEFAULT false,
    document_label TEXT, -- Label for required document, e.g., "Proposta assinada"
    requires_responsible_user BOOLEAN NOT NULL DEFAULT false,
    requires_notes BOOLEAN NOT NULL DEFAULT false,
    requires_value BOOLEAN NOT NULL DEFAULT false, -- Some stages need sale_value defined
    is_critical_stage BOOLEAN NOT NULL DEFAULT false, -- Mark stages that need strict control
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crm_stage_completion_requirements ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Authenticated users can view requirements"
ON public.crm_stage_completion_requirements
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage requirements"
ON public.crm_stage_completion_requirements
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default requirements for each stage
-- Critical stages: proposta_recebida, proposta_aceita, documentacao_enviada, registro_em_andamento, aguardando_pagamento
INSERT INTO public.crm_stage_completion_requirements (stage, requires_document, document_label, requires_responsible_user, requires_notes, requires_value, is_critical_stage)
VALUES
    ('novo_imovel', false, NULL, true, false, false, false),
    ('em_anuncio', false, NULL, true, false, true, false),
    ('proposta_recebida', true, 'Proposta do comprador', true, true, true, true),
    ('proposta_aceita', true, 'Proposta assinada', true, true, true, true),
    ('documentacao_enviada', true, 'Documentação completa', true, true, true, true),
    ('registro_em_andamento', true, 'Protocolo do registro', true, true, true, true),
    ('registro_concluido', true, 'Matrícula atualizada', true, false, true, true),
    ('aguardando_pagamento', true, 'Comprovante de agendamento', true, true, true, true),
    ('pago', true, 'Comprovante de pagamento', true, false, true, true),
    ('comissao_liberada', true, 'Comprovante de comissão', false, false, true, false);

-- Add trigger for updated_at
CREATE TRIGGER update_crm_stage_completion_requirements_updated_at
BEFORE UPDATE ON public.crm_stage_completion_requirements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();