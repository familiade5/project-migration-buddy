GRANT EXECUTE ON FUNCTION public.is_internal_user(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cx_can_access_client(uuid, uuid) TO authenticated;

DROP POLICY IF EXISTS cx_clients_insert ON public.cx_clients;
CREATE POLICY cx_clients_insert ON public.cx_clients FOR INSERT TO authenticated
WITH CHECK (
  public.is_internal_user(auth.uid())
  OR portal_user_id = auth.uid()
  OR (parent_client_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.cx_clients p
    WHERE p.id = cx_clients.parent_client_id AND p.portal_user_id = auth.uid()
  ))
);