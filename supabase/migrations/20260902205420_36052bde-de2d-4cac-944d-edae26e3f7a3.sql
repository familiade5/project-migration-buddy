REVOKE EXECUTE ON FUNCTION public.is_internal_user(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.cx_can_access_client(uuid, uuid) FROM anon, authenticated, public;