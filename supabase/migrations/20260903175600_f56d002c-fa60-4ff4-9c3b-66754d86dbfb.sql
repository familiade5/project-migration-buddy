
CREATE TABLE public.cx_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  registration_number text,
  notary_office text,
  notes text,
  status text NOT NULL DEFAULT 'em_analise',
  created_by_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cx_properties TO authenticated;
GRANT ALL ON public.cx_properties TO service_role;

ALTER TABLE public.cx_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY cx_properties_select ON public.cx_properties FOR SELECT TO authenticated USING (public.is_internal_user(auth.uid()));
CREATE POLICY cx_properties_insert ON public.cx_properties FOR INSERT TO authenticated WITH CHECK (public.is_internal_user(auth.uid()));
CREATE POLICY cx_properties_update ON public.cx_properties FOR UPDATE TO authenticated USING (public.is_internal_user(auth.uid())) WITH CHECK (public.is_internal_user(auth.uid()));
CREATE POLICY cx_properties_delete ON public.cx_properties FOR DELETE TO authenticated USING (public.is_internal_user(auth.uid()));

CREATE TRIGGER update_cx_properties_updated_at BEFORE UPDATE ON public.cx_properties
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.cx_documents ADD COLUMN property_id uuid REFERENCES public.cx_properties(id) ON DELETE CASCADE;
ALTER TABLE public.cx_documents ALTER COLUMN client_id DROP NOT NULL;
CREATE INDEX cx_documents_property_id_idx ON public.cx_documents(property_id);

DROP POLICY cx_documents_select ON public.cx_documents;
DROP POLICY cx_documents_insert ON public.cx_documents;
DROP POLICY cx_documents_update ON public.cx_documents;
DROP POLICY cx_documents_delete ON public.cx_documents;

CREATE POLICY cx_documents_select ON public.cx_documents FOR SELECT TO authenticated
USING (public.is_internal_user(auth.uid()) OR (client_id IS NOT NULL AND public.cx_can_access_client(auth.uid(), client_id)));
CREATE POLICY cx_documents_insert ON public.cx_documents FOR INSERT TO authenticated
WITH CHECK (public.is_internal_user(auth.uid()) OR (client_id IS NOT NULL AND public.cx_can_access_client(auth.uid(), client_id)));
CREATE POLICY cx_documents_update ON public.cx_documents FOR UPDATE TO authenticated
USING (public.is_internal_user(auth.uid()) OR (client_id IS NOT NULL AND public.cx_can_access_client(auth.uid(), client_id)))
WITH CHECK (public.is_internal_user(auth.uid()) OR (client_id IS NOT NULL AND public.cx_can_access_client(auth.uid(), client_id)));
CREATE POLICY cx_documents_delete ON public.cx_documents FOR DELETE TO authenticated
USING (public.is_internal_user(auth.uid()) OR (client_id IS NOT NULL AND public.cx_can_access_client(auth.uid(), client_id)));
