ALTER TABLE public.cx_clients ADD COLUMN IF NOT EXISTS portal_token text;
UPDATE public.cx_clients SET portal_token = encode(gen_random_bytes(12),'hex') WHERE portal_token IS NULL;
ALTER TABLE public.cx_clients ALTER COLUMN portal_token SET DEFAULT encode(gen_random_bytes(12),'hex');
CREATE UNIQUE INDEX IF NOT EXISTS cx_clients_portal_token_key ON public.cx_clients(portal_token);

CREATE OR REPLACE FUNCTION public.cx_invite_info(_token text)
RETURNS TABLE(client_id uuid, full_name text, claimed boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.id, c.full_name, c.portal_user_id IS NOT NULL
  FROM public.cx_clients c
  WHERE c.portal_token = _token AND c.parent_client_id IS NULL
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.cx_claim_invite(_token text)
RETURNS uuid
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_owner uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Não autenticado';
  END IF;

  SELECT id, portal_user_id INTO v_id, v_owner
  FROM public.cx_clients
  WHERE portal_token = _token AND parent_client_id IS NULL
  LIMIT 1;

  IF v_id IS NULL THEN
    RAISE EXCEPTION 'Convite inválido';
  END IF;

  IF v_owner IS NOT NULL AND v_owner <> auth.uid() THEN
    RAISE EXCEPTION 'Este convite já foi utilizado por outra pessoa';
  END IF;

  IF v_owner IS NULL THEN
    UPDATE public.cx_clients SET portal_user_id = auth.uid(), updated_at = now() WHERE id = v_id;
  END IF;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.cx_invite_info(text) FROM public, anon;
REVOKE ALL ON FUNCTION public.cx_claim_invite(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.cx_invite_info(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cx_claim_invite(text) TO authenticated;