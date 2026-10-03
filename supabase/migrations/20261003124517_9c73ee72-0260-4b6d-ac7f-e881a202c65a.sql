CREATE OR REPLACE FUNCTION public.cx_write_audit_log()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row_before jsonb;
  row_after jsonb;
  row_data jsonb;
  related_deal uuid;
  related_client uuid;
  row_id uuid;
BEGIN
  row_before := CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) ELSE NULL END;
  row_after := CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) ELSE NULL END;
  row_data := COALESCE(row_after, row_before);
  row_id := NULLIF(row_data->>'id','')::uuid;
  related_deal := NULLIF(row_data->>'deal_id','')::uuid;
  related_client := NULLIF(row_data->>'client_id','')::uuid;

  IF TG_TABLE_NAME = 'cx_deals' THEN
    related_deal := row_id;
  ELSIF TG_TABLE_NAME = 'cx_clients' THEN
    related_client := row_id;
  END IF;

  INSERT INTO public.cx_audit_log (
    actor_user_id, actor_name, action, entity_type, entity_id,
    deal_id, client_id, before_data, after_data
  ) VALUES (
    auth.uid(), COALESCE(auth.jwt()->>'email', 'Sistema'), lower(TG_OP), TG_TABLE_NAME, row_id,
    related_deal, related_client, row_before, row_after
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'cx_clients','cx_deals','cx_process_participants','cx_credit_analyses',
    'cx_tasks','cx_process_checklist','cx_engineering_inspections','cx_contracts',
    'cx_registry_records','cx_key_handovers','cx_property_sellers'
  ]
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS cx_audit_changes ON public.%I', table_name);
    EXECUTE format('CREATE TRIGGER cx_audit_changes AFTER INSERT OR UPDATE OR DELETE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.cx_write_audit_log()', table_name);
  END LOOP;
END;
$$;