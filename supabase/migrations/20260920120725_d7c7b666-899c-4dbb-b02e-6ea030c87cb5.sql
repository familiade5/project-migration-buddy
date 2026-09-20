GRANT EXECUTE ON FUNCTION public.is_approved_user(uuid) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.is_internal_user(uuid) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon, service_role;