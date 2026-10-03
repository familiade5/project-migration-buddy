DROP POLICY IF EXISTS "cx_clients_delete" ON public.cx_clients;
CREATE POLICY "cx_clients_admin_delete" ON public.cx_clients
  FOR DELETE TO authenticated USING (public.cx_is_admin(auth.uid()));

DROP POLICY IF EXISTS "Internos podem excluir negocios" ON public.cx_deals;
CREATE POLICY "cx_deals_admin_delete" ON public.cx_deals
  FOR DELETE TO authenticated USING (public.cx_is_admin(auth.uid()));