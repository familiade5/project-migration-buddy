CREATE OR REPLACE FUNCTION public.cx_is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin'::public.app_role);
$$;
REVOKE ALL ON FUNCTION public.cx_is_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cx_is_admin(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.cx_credit_analysis_before_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.created_by_user_id IS NULL THEN NEW.created_by_user_id := auth.uid(); END IF;
  IF NEW.analyst_user_id IS NULL THEN NEW.analyst_user_id := auth.uid(); END IF;
  SELECT COALESCE(MAX(a.sequence_number),0)+1 INTO NEW.sequence_number FROM public.cx_credit_analyses a WHERE a.deal_id=NEW.deal_id;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.cx_credit_analysis_before_insert() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cx_credit_analysis_before_insert() TO service_role;

CREATE OR REPLACE FUNCTION public.cx_log_credit_analysis()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.cx_client_events(client_id, kind, title, description, metadata, actor_user_id)
  VALUES (NEW.client_id, 'analise_credito', 'Análise de crédito #' || NEW.sequence_number || ': ' || initcap(NEW.result), COALESCE(NEW.condition_reason, NEW.rejection_reason, NEW.error_message, NEW.notes), jsonb_build_object('deal_id',NEW.deal_id,'analysis_id',NEW.id,'result',NEW.result), auth.uid());
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.cx_log_credit_analysis() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cx_log_credit_analysis() TO service_role;