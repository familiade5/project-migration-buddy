ALTER TABLE public.cx_clients
  ADD COLUMN IF NOT EXISTS family_income numeric,
  ADD COLUMN IF NOT EXISTS assigned_broker_user_id uuid,
  ADD COLUMN IF NOT EXISTS assigned_broker_name text,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS archived_by_user_id uuid;

ALTER TABLE public.cx_deals
  ADD COLUMN IF NOT EXISTS process_number text,
  ADD COLUMN IF NOT EXISTS process_status text NOT NULL DEFAULT 'novo_cadastro',
  ADD COLUMN IF NOT EXISTS next_action text,
  ADD COLUMN IF NOT EXISTS next_action_responsible_id uuid,
  ADD COLUMN IF NOT EXISTS next_action_responsible_name text,
  ADD COLUMN IF NOT EXISTS next_action_due_at timestamptz,
  ADD COLUMN IF NOT EXISTS opened_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS closed_at timestamptz,
  ADD COLUMN IF NOT EXISTS lost_reason text,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS archived_by_user_id uuid;

CREATE UNIQUE INDEX IF NOT EXISTS cx_deals_process_number_uidx ON public.cx_deals(process_number) WHERE process_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS cx_deals_process_status_idx ON public.cx_deals(process_status);
CREATE INDEX IF NOT EXISTS cx_deals_next_action_due_idx ON public.cx_deals(next_action_due_at) WHERE archived_at IS NULL;

ALTER TABLE public.cx_properties
  ADD COLUMN IF NOT EXISTS property_type text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS zip_code text,
  ADD COLUMN IF NOT EXISTS municipal_registration text,
  ADD COLUMN IF NOT EXISTS value numeric,
  ADD COLUMN IF NOT EXISTS occupancy_status text,
  ADD COLUMN IF NOT EXISTS deal_id uuid REFERENCES public.cx_deals(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.cx_team_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('administrador','gestor','analista','corretor')),
  is_active boolean NOT NULL DEFAULT true,
  assigned_by_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cx_team_roles TO authenticated;
GRANT ALL ON public.cx_team_roles TO service_role;
ALTER TABLE public.cx_team_roles ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.cx_is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin'::public.app_role)
    OR EXISTS (
      SELECT 1 FROM public.cx_team_roles r
      WHERE r.user_id = _user_id AND r.role = 'administrador' AND r.is_active = true
    );
$$;
CREATE POLICY "cx_team_roles_read" ON public.cx_team_roles FOR SELECT TO authenticated USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_team_roles_admin_insert" ON public.cx_team_roles FOR INSERT TO authenticated WITH CHECK (public.cx_is_admin(auth.uid()));
CREATE POLICY "cx_team_roles_admin_update" ON public.cx_team_roles FOR UPDATE TO authenticated USING (public.cx_is_admin(auth.uid())) WITH CHECK (public.cx_is_admin(auth.uid()));
CREATE POLICY "cx_team_roles_admin_delete" ON public.cx_team_roles FOR DELETE TO authenticated USING (public.cx_is_admin(auth.uid()));
CREATE TRIGGER update_cx_team_roles_updated_at BEFORE UPDATE ON public.cx_team_roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.cx_process_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES public.cx_deals(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.cx_clients(id) ON DELETE SET NULL,
  role text NOT NULL CHECK (role IN ('principal','conjuge','coproponente','grupo_familiar','outro')),
  full_name text NOT NULL,
  cpf text,
  birth_date text,
  marital_status text,
  profession text,
  phone text,
  email text,
  monthly_income numeric,
  income_participation numeric,
  notes text,
  created_by_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cx_process_participants TO authenticated;
GRANT ALL ON public.cx_process_participants TO service_role;
ALTER TABLE public.cx_process_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cx_participants_read" ON public.cx_process_participants FOR SELECT TO authenticated USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_participants_insert" ON public.cx_process_participants FOR INSERT TO authenticated WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_participants_update" ON public.cx_process_participants FOR UPDATE TO authenticated USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid())) WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_participants_delete" ON public.cx_process_participants FOR DELETE TO authenticated USING (public.cx_is_admin(auth.uid()));
CREATE INDEX cx_process_participants_deal_idx ON public.cx_process_participants(deal_id);
CREATE TRIGGER update_cx_process_participants_updated_at BEFORE UPDATE ON public.cx_process_participants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.cx_credit_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES public.cx_deals(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.cx_clients(id) ON DELETE RESTRICT,
  sequence_number integer NOT NULL,
  analysis_date timestamptz NOT NULL DEFAULT now(),
  result text NOT NULL CHECK (result IN ('aprovado','condicionado','reprovado','erro')),
  proposal_code text,
  appraisal_code text,
  correspondent_code text,
  analyzed_cpf text,
  analyzed_name text,
  registration_protocol text,
  relationship_agency text,
  funding_source text,
  modality text,
  product text,
  credit_line text CHECK (credit_line IS NULL OR credit_line IN ('mcmv','sbpe','outro')),
  mcmv_tier text CHECK (mcmv_tier IS NULL OR mcmv_tier IN ('faixa_1','faixa_2','faixa_3','faixa_4')),
  property_value numeric,
  financing_value numeric,
  approved_value numeric,
  possible_installment numeric,
  installment_value numeric,
  indexer text,
  amortization_system text,
  term_months integer,
  originating_system text,
  validity_start date,
  validity_end date,
  rating text,
  margin_value numeric,
  condition_category text,
  condition_reason text,
  rejection_category text CHECK (rejection_category IS NULL OR rejection_category IN ('rating','capacidade','outro')),
  rejection_reason text,
  error_message text,
  error_reference text,
  operator_name text,
  analyst_user_id uuid,
  analyst_name text,
  source_document_id uuid,
  source text NOT NULL DEFAULT 'manual',
  notes text,
  extracted_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(deal_id, sequence_number)
);
GRANT SELECT, INSERT, DELETE ON public.cx_credit_analyses TO authenticated;
GRANT ALL ON public.cx_credit_analyses TO service_role;
ALTER TABLE public.cx_credit_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cx_credit_analyses_read" ON public.cx_credit_analyses FOR SELECT TO authenticated USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_credit_analyses_insert" ON public.cx_credit_analyses FOR INSERT TO authenticated WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_credit_analyses_admin_delete" ON public.cx_credit_analyses FOR DELETE TO authenticated USING (public.cx_is_admin(auth.uid()));
CREATE INDEX cx_credit_analyses_deal_idx ON public.cx_credit_analyses(deal_id, analysis_date DESC);
CREATE INDEX cx_credit_analyses_result_idx ON public.cx_credit_analyses(result, analysis_date DESC);

CREATE TABLE public.cx_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES public.cx_deals(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.cx_clients(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  kind text NOT NULL DEFAULT 'tarefa' CHECK (kind IN ('tarefa','pendencia')),
  priority text NOT NULL DEFAULT 'media' CHECK (priority IN ('baixa','media','alta','urgente')),
  status text NOT NULL DEFAULT 'aberta' CHECK (status IN ('aberta','em_andamento','concluida','cancelada')),
  responsible_user_id uuid,
  responsible_name text,
  due_at timestamptz,
  completed_at timestamptz,
  created_by_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cx_tasks TO authenticated;
GRANT ALL ON public.cx_tasks TO service_role;
ALTER TABLE public.cx_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cx_tasks_read" ON public.cx_tasks FOR SELECT TO authenticated USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_tasks_insert" ON public.cx_tasks FOR INSERT TO authenticated WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_tasks_update" ON public.cx_tasks FOR UPDATE TO authenticated USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid())) WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_tasks_delete" ON public.cx_tasks FOR DELETE TO authenticated USING (public.cx_is_admin(auth.uid()));
CREATE INDEX cx_tasks_deal_status_idx ON public.cx_tasks(deal_id, status, due_at);
CREATE TRIGGER update_cx_tasks_updated_at BEFORE UPDATE ON public.cx_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.cx_property_sellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.cx_properties(id) ON DELETE CASCADE,
  deal_id uuid REFERENCES public.cx_deals(id) ON DELETE SET NULL,
  person_type text NOT NULL DEFAULT 'pf' CHECK (person_type IN ('pf','pj')),
  full_name text NOT NULL,
  cpf_cnpj text,
  phone text,
  email text,
  marital_status text,
  spouse_name text,
  notes text,
  created_by_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cx_property_sellers TO authenticated;
GRANT ALL ON public.cx_property_sellers TO service_role;
ALTER TABLE public.cx_property_sellers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cx_sellers_read" ON public.cx_property_sellers FOR SELECT TO authenticated USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_sellers_insert" ON public.cx_property_sellers FOR INSERT TO authenticated WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_sellers_update" ON public.cx_property_sellers FOR UPDATE TO authenticated USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid())) WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_sellers_delete" ON public.cx_property_sellers FOR DELETE TO authenticated USING (public.cx_is_admin(auth.uid()));
CREATE TRIGGER update_cx_property_sellers_updated_at BEFORE UPDATE ON public.cx_property_sellers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.cx_process_checklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES public.cx_deals(id) ON DELETE CASCADE,
  category text NOT NULL,
  item_name text NOT NULL,
  status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','recebido','em_analise','aprovado','com_pendencia','nao_aplicavel')),
  document_id uuid REFERENCES public.cx_documents(id) ON DELETE SET NULL,
  notes text,
  responsible_user_id uuid,
  due_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cx_process_checklist TO authenticated;
GRANT ALL ON public.cx_process_checklist TO service_role;
ALTER TABLE public.cx_process_checklist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cx_checklist_read" ON public.cx_process_checklist FOR SELECT TO authenticated USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_checklist_insert" ON public.cx_process_checklist FOR INSERT TO authenticated WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_checklist_update" ON public.cx_process_checklist FOR UPDATE TO authenticated USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid())) WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_checklist_delete" ON public.cx_process_checklist FOR DELETE TO authenticated USING (public.cx_is_admin(auth.uid()));
CREATE INDEX cx_process_checklist_deal_idx ON public.cx_process_checklist(deal_id, category, status);
CREATE TRIGGER update_cx_process_checklist_updated_at BEFORE UPDATE ON public.cx_process_checklist FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.cx_engineering_inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES public.cx_deals(id) ON DELETE CASCADE,
  property_id uuid REFERENCES public.cx_properties(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'aguardando' CHECK (status IN ('aguardando','agendada','em_vistoria','pendencia','aprovada','reprovada')),
  scheduled_at timestamptz,
  inspection_at timestamptz,
  result text,
  report_document_id uuid REFERENCES public.cx_documents(id) ON DELETE SET NULL,
  pendencies text,
  responsible_user_id uuid,
  responsible_name text,
  due_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cx_engineering_inspections TO authenticated;
GRANT ALL ON public.cx_engineering_inspections TO service_role;
ALTER TABLE public.cx_engineering_inspections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cx_engineering_read" ON public.cx_engineering_inspections FOR SELECT TO authenticated USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_engineering_insert" ON public.cx_engineering_inspections FOR INSERT TO authenticated WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_engineering_update" ON public.cx_engineering_inspections FOR UPDATE TO authenticated USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid())) WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_engineering_delete" ON public.cx_engineering_inspections FOR DELETE TO authenticated USING (public.cx_is_admin(auth.uid()));
CREATE TRIGGER update_cx_engineering_updated_at BEFORE UPDATE ON public.cx_engineering_inspections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.cx_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES public.cx_deals(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'preparacao' CHECK (status IN ('preparacao','aguardando_assinaturas','pendencia','assinado','concluido')),
  contract_number text,
  prepared_at timestamptz,
  signed_at timestamptz,
  document_id uuid REFERENCES public.cx_documents(id) ON DELETE SET NULL,
  pendencies text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cx_contracts TO authenticated;
GRANT ALL ON public.cx_contracts TO service_role;
ALTER TABLE public.cx_contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cx_contracts_read" ON public.cx_contracts FOR SELECT TO authenticated USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_contracts_insert" ON public.cx_contracts FOR INSERT TO authenticated WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_contracts_update" ON public.cx_contracts FOR UPDATE TO authenticated USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid())) WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_contracts_delete" ON public.cx_contracts FOR DELETE TO authenticated USING (public.cx_is_admin(auth.uid()));
CREATE TRIGGER update_cx_contracts_updated_at BEFORE UPDATE ON public.cx_contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.cx_registry_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES public.cx_deals(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','itbi_emitido','itbi_pago','protocolado','registrado','com_pendencia')),
  itbi_value numeric,
  itbi_issued_at date,
  itbi_paid_at date,
  protocol_number text,
  protocol_at date,
  registry_office text,
  registered_at date,
  document_id uuid REFERENCES public.cx_documents(id) ON DELETE SET NULL,
  pendencies text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cx_registry_records TO authenticated;
GRANT ALL ON public.cx_registry_records TO service_role;
ALTER TABLE public.cx_registry_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cx_registry_read" ON public.cx_registry_records FOR SELECT TO authenticated USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_registry_insert" ON public.cx_registry_records FOR INSERT TO authenticated WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_registry_update" ON public.cx_registry_records FOR UPDATE TO authenticated USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid())) WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_registry_delete" ON public.cx_registry_records FOR DELETE TO authenticated USING (public.cx_is_admin(auth.uid()));
CREATE TRIGGER update_cx_registry_updated_at BEFORE UPDATE ON public.cx_registry_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.cx_key_handovers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL UNIQUE REFERENCES public.cx_deals(id) ON DELETE CASCADE,
  expected_at date,
  delivered_at timestamptz,
  responsible_user_id uuid,
  responsible_name text,
  receipt_document_id uuid REFERENCES public.cx_documents(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cx_key_handovers TO authenticated;
GRANT ALL ON public.cx_key_handovers TO service_role;
ALTER TABLE public.cx_key_handovers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cx_handovers_read" ON public.cx_key_handovers FOR SELECT TO authenticated USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_handovers_insert" ON public.cx_key_handovers FOR INSERT TO authenticated WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_handovers_update" ON public.cx_key_handovers FOR UPDATE TO authenticated USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid())) WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE POLICY "cx_handovers_delete" ON public.cx_key_handovers FOR DELETE TO authenticated USING (public.cx_is_admin(auth.uid()));
CREATE TRIGGER update_cx_handovers_updated_at BEFORE UPDATE ON public.cx_key_handovers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.cx_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid,
  actor_name text,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  deal_id uuid,
  client_id uuid,
  before_data jsonb,
  after_data jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.cx_audit_log TO authenticated;
GRANT ALL ON public.cx_audit_log TO service_role;
ALTER TABLE public.cx_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cx_audit_read" ON public.cx_audit_log FOR SELECT TO authenticated USING (public.cx_is_admin(auth.uid()) OR EXISTS (SELECT 1 FROM public.cx_team_roles r WHERE r.user_id=auth.uid() AND r.role='gestor' AND r.is_active));
CREATE POLICY "cx_audit_insert" ON public.cx_audit_log FOR INSERT TO authenticated WITH CHECK (actor_user_id = auth.uid() AND public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));
CREATE INDEX cx_audit_entity_idx ON public.cx_audit_log(entity_type, entity_id, created_at DESC);

ALTER TABLE public.cx_documents
  ADD COLUMN IF NOT EXISTS deal_id uuid REFERENCES public.cx_deals(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS credit_analysis_id uuid REFERENCES public.cx_credit_analyses(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS participant_id uuid REFERENCES public.cx_process_participants(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'cliente',
  ADD COLUMN IF NOT EXISTS checklist_status text NOT NULL DEFAULT 'recebido',
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS version_number integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS replaces_document_id uuid REFERENCES public.cx_documents(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS archived_by_user_id uuid;
CREATE INDEX IF NOT EXISTS cx_documents_deal_idx ON public.cx_documents(deal_id, category, created_at DESC);
CREATE INDEX IF NOT EXISTS cx_documents_analysis_idx ON public.cx_documents(credit_analysis_id);

ALTER TABLE public.cx_credit_analyses
  ADD CONSTRAINT cx_credit_analyses_source_document_fk FOREIGN KEY (source_document_id) REFERENCES public.cx_documents(id) ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION public.cx_assign_process_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.process_number IS NULL THEN
    NEW.process_number := 'AM-' || to_char(COALESCE(NEW.opened_at, now()), 'YYYY') || '-' || lpad(nextval('public.cx_process_number_seq')::text, 5, '0');
  END IF;
  RETURN NEW;
END;
$$;

CREATE SEQUENCE IF NOT EXISTS public.cx_process_number_seq START 1;
GRANT USAGE, SELECT ON SEQUENCE public.cx_process_number_seq TO authenticated;
GRANT ALL ON SEQUENCE public.cx_process_number_seq TO service_role;
CREATE TRIGGER cx_deals_assign_process_number BEFORE INSERT ON public.cx_deals FOR EACH ROW EXECUTE FUNCTION public.cx_assign_process_number();

CREATE OR REPLACE FUNCTION public.cx_credit_analysis_before_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.created_by_user_id IS NULL THEN NEW.created_by_user_id := auth.uid(); END IF;
  IF NEW.analyst_user_id IS NULL THEN NEW.analyst_user_id := auth.uid(); END IF;
  SELECT COALESCE(MAX(a.sequence_number),0)+1 INTO NEW.sequence_number FROM public.cx_credit_analyses a WHERE a.deal_id=NEW.deal_id;
  RETURN NEW;
END;
$$;
CREATE TRIGGER cx_credit_analysis_number BEFORE INSERT ON public.cx_credit_analyses FOR EACH ROW EXECUTE FUNCTION public.cx_credit_analysis_before_insert();

CREATE OR REPLACE FUNCTION public.cx_log_credit_analysis()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.cx_client_events(client_id, kind, title, description, metadata, actor_user_id)
  VALUES (NEW.client_id, 'analise_credito', 'Análise de crédito #' || NEW.sequence_number || ': ' || initcap(NEW.result), COALESCE(NEW.condition_reason, NEW.rejection_reason, NEW.error_message, NEW.notes), jsonb_build_object('deal_id',NEW.deal_id,'analysis_id',NEW.id,'result',NEW.result), auth.uid());
  RETURN NEW;
END;
$$;
CREATE TRIGGER cx_credit_analysis_timeline AFTER INSERT ON public.cx_credit_analyses FOR EACH ROW EXECUTE FUNCTION public.cx_log_credit_analysis();