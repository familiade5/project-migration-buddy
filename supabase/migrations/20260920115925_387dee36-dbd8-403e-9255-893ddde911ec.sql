CREATE TYPE public.cx_deal_stage AS ENUM ('simulacao','documentacao','em_analise','condicionado','aprovado','contrato','reprovado');
CREATE TYPE public.cx_rejection_reason AS ENUM ('rating','capacidade','outro');

CREATE TABLE public.cx_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.cx_clients(id) ON DELETE CASCADE,
  property_id uuid REFERENCES public.cx_properties(id) ON DELETE SET NULL,
  title text,
  stage public.cx_deal_stage NOT NULL DEFAULT 'simulacao',
  rejection_reason public.cx_rejection_reason,
  rejection_notes text,
  bank text,
  property_value numeric,
  financing_value numeric,
  down_payment numeric,
  fgts_value numeric,
  subsidy_value numeric,
  monthly_income numeric,
  installment_value numeric,
  rating text,
  margin_value numeric,
  approved_value numeric,
  approval_expires_at date,
  next_review_at date,
  review_interval_days integer NOT NULL DEFAULT 30,
  pendencies text,
  notes text,
  responsible_user_id uuid,
  responsible_name text,
  stage_entered_at timestamptz NOT NULL DEFAULT now(),
  created_by_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cx_deals TO authenticated;
GRANT ALL ON public.cx_deals TO service_role;
ALTER TABLE public.cx_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internos podem ver negocios" ON public.cx_deals FOR SELECT TO authenticated
USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "Internos podem criar negocios" ON public.cx_deals FOR INSERT TO authenticated
WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "Internos podem editar negocios" ON public.cx_deals FOR UPDATE TO authenticated
USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "Internos podem excluir negocios" ON public.cx_deals FOR DELETE TO authenticated
USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));

CREATE INDEX idx_cx_deals_client ON public.cx_deals(client_id);
CREATE INDEX idx_cx_deals_stage ON public.cx_deals(stage);
CREATE INDEX idx_cx_deals_next_review ON public.cx_deals(next_review_at);

CREATE TRIGGER update_cx_deals_updated_at BEFORE UPDATE ON public.cx_deals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.cx_deal_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES public.cx_deals(id) ON DELETE CASCADE,
  from_stage public.cx_deal_stage,
  to_stage public.cx_deal_stage NOT NULL,
  moved_by_user_id uuid,
  moved_by_name text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.cx_deal_history TO authenticated;
GRANT ALL ON public.cx_deal_history TO service_role;
ALTER TABLE public.cx_deal_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internos podem ver historico" ON public.cx_deal_history FOR SELECT TO authenticated
USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "Internos podem registrar historico" ON public.cx_deal_history FOR INSERT TO authenticated
WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));

CREATE INDEX idx_cx_deal_history_deal ON public.cx_deal_history(deal_id);

CREATE TABLE public.cx_deal_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES public.cx_deals(id) ON DELETE CASCADE,
  checked_at timestamptz NOT NULL DEFAULT now(),
  rating text,
  margin_value numeric,
  approved_value numeric,
  result text,
  notes text,
  created_by_user_id uuid,
  created_by_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cx_deal_checks TO authenticated;
GRANT ALL ON public.cx_deal_checks TO service_role;
ALTER TABLE public.cx_deal_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internos podem ver consultas" ON public.cx_deal_checks FOR SELECT TO authenticated
USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "Internos podem criar consultas" ON public.cx_deal_checks FOR INSERT TO authenticated
WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "Internos podem editar consultas" ON public.cx_deal_checks FOR UPDATE TO authenticated
USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "Internos podem excluir consultas" ON public.cx_deal_checks FOR DELETE TO authenticated
USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));

CREATE INDEX idx_cx_deal_checks_deal ON public.cx_deal_checks(deal_id);