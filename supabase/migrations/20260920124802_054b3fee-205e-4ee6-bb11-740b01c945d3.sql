ALTER TABLE public.cx_deals ALTER COLUMN stage DROP DEFAULT;
ALTER TABLE public.cx_deals ALTER COLUMN stage TYPE text USING stage::text;
ALTER TABLE public.cx_deals ALTER COLUMN stage SET DEFAULT 'simulacao';

ALTER TABLE public.cx_deal_history ALTER COLUMN from_stage TYPE text USING from_stage::text;
ALTER TABLE public.cx_deal_history ALTER COLUMN to_stage TYPE text USING to_stage::text;

CREATE TABLE public.cx_pipeline_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label text NOT NULL,
  color text NOT NULL DEFAULT '#64748b',
  bg text NOT NULL DEFAULT '#f8fafc',
  border text NOT NULL DEFAULT '#cbd5e1',
  position integer NOT NULL DEFAULT 0,
  is_system boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cx_pipeline_stages TO authenticated;
GRANT ALL ON public.cx_pipeline_stages TO service_role;

ALTER TABLE public.cx_pipeline_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internos aprovados leem etapas" ON public.cx_pipeline_stages
FOR SELECT TO authenticated
USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));

CREATE POLICY "Internos aprovados criam etapas" ON public.cx_pipeline_stages
FOR INSERT TO authenticated
WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));

CREATE POLICY "Internos aprovados editam etapas" ON public.cx_pipeline_stages
FOR UPDATE TO authenticated
USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()))
WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));

CREATE POLICY "Internos aprovados removem etapas" ON public.cx_pipeline_stages
FOR DELETE TO authenticated
USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()) AND is_system = false);

CREATE TRIGGER update_cx_pipeline_stages_updated_at
BEFORE UPDATE ON public.cx_pipeline_stages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.cx_pipeline_stages (key, label, color, bg, border, position, is_system) VALUES
('simulacao', 'Simulação', '#64748b', '#f8fafc', '#cbd5e1', 10, true),
('documentacao', 'Documentação', '#0ea5e9', '#f0f9ff', '#bae6fd', 20, false),
('em_analise', 'Em análise', '#6366f1', '#eef2ff', '#c7d2fe', 30, false),
('condicionado', 'Condicionado', '#f59e0b', '#fffbeb', '#fde68a', 40, false),
('aprovado', 'Aprovado', '#10b981', '#ecfdf5', '#a7f3d0', 50, false),
('contrato', 'Contrato / Assinatura', '#1a3a6b', '#eff6ff', '#bfdbfe', 60, false),
('reprovado', 'Reprovado', '#ef4444', '#fef2f2', '#fecaca', 70, true);