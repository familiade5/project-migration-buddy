-- Table for default reminder settings per stage
CREATE TABLE public.crm_stage_reminder_defaults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage property_stage UNIQUE NOT NULL,
  default_interval_hours INTEGER NOT NULL DEFAULT 24,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table for property-specific reminders
CREATE TABLE public.crm_property_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.crm_properties(id) ON DELETE CASCADE,
  stage property_stage NOT NULL,
  interval_hours INTEGER NOT NULL DEFAULT 24,
  next_reminder_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  created_by_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(property_id, stage, is_active)
);

-- Enable RLS
ALTER TABLE public.crm_stage_reminder_defaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_property_reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stage defaults
CREATE POLICY "Authenticated users can view stage defaults"
ON public.crm_stage_reminder_defaults FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage stage defaults"
ON public.crm_stage_reminder_defaults FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for property reminders
CREATE POLICY "Authenticated users can view reminders"
ON public.crm_property_reminders FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage reminders"
ON public.crm_property_reminders FOR ALL
USING (auth.uid() IS NOT NULL);

-- Triggers for updated_at
CREATE TRIGGER update_crm_stage_reminder_defaults_updated_at
BEFORE UPDATE ON public.crm_stage_reminder_defaults
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_property_reminders_updated_at
BEFORE UPDATE ON public.crm_property_reminders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default reminder settings for each stage
INSERT INTO public.crm_stage_reminder_defaults (stage, default_interval_hours, is_enabled) VALUES
('novo_imovel', 48, true),
('em_anuncio', 72, true),
('proposta_recebida', 24, true),
('proposta_aceita', 24, true),
('documentacao_enviada', 24, true),
('registro_em_andamento', 48, true),
('registro_concluido', 24, true),
('aguardando_pagamento', 24, true),
('pago', 48, false),
('comissao_liberada', 0, false);

-- Enable realtime for reminders
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_property_reminders;