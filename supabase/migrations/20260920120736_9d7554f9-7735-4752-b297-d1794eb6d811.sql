REVOKE EXECUTE ON FUNCTION public.is_approved_user(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_internal_user(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.is_approved_user(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_internal_user(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;