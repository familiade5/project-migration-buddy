CREATE OR REPLACE FUNCTION public.cx_is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin'::public.app_role)
    OR EXISTS (
      SELECT 1
      FROM public.cx_team_roles r
      WHERE r.user_id = _user_id
        AND r.role = 'administrador'
        AND r.is_active = true
    );
$$;

REVOKE ALL ON FUNCTION public.cx_is_admin(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cx_is_admin(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.cx_is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cx_is_admin(uuid) TO service_role;