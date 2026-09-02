ALTER TABLE public.cx_clients
  ADD COLUMN IF NOT EXISTS portal_user_id uuid,
  ADD COLUMN IF NOT EXISTS parent_client_id uuid REFERENCES public.cx_clients(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS relationship text,
  ADD COLUMN IF NOT EXISTS submission_status text NOT NULL DEFAULT 'rascunho',
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz,
  ADD COLUMN IF NOT EXISTS review_notes text,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS cx_clients_portal_user_idx ON public.cx_clients(portal_user_id) WHERE portal_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS cx_clients_parent_idx ON public.cx_clients(parent_client_id);

-- Internal staff = has any row in user_roles
CREATE OR REPLACE FUNCTION public.is_internal_user(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id)
$$;

CREATE OR REPLACE FUNCTION public.cx_can_access_client(_user_id uuid, _client_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.cx_clients c
    WHERE c.id = _client_id
      AND (
        c.portal_user_id = _user_id
        OR EXISTS (
          SELECT 1 FROM public.cx_clients p
          WHERE p.id = c.parent_client_id AND p.portal_user_id = _user_id
        )
      )
  )
$$;

-- Portal signups must not receive internal roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, temp_password)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'temp_password')::boolean, false)
  );

  IF COALESCE((NEW.raw_user_meta_data->>'portal_client')::boolean, false) = false THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;

  RETURN NEW;
END;
$$;

-- Reset RLS for cx_clients
DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='cx_clients' LOOP
    EXECUTE format('DROP POLICY %I ON public.cx_clients', p.policyname);
  END LOOP;
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='cx_documents' LOOP
    EXECUTE format('DROP POLICY %I ON public.cx_documents', p.policyname);
  END LOOP;
END $$;

CREATE POLICY "cx_clients_select" ON public.cx_clients FOR SELECT TO authenticated
USING (public.is_internal_user(auth.uid()) OR public.cx_can_access_client(auth.uid(), id));

CREATE POLICY "cx_clients_insert" ON public.cx_clients FOR INSERT TO authenticated
WITH CHECK (
  public.is_internal_user(auth.uid())
  OR portal_user_id = auth.uid()
  OR (parent_client_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.cx_clients p WHERE p.id = parent_client_id AND p.portal_user_id = auth.uid()))
);

CREATE POLICY "cx_clients_update" ON public.cx_clients FOR UPDATE TO authenticated
USING (public.is_internal_user(auth.uid()) OR public.cx_can_access_client(auth.uid(), id))
WITH CHECK (public.is_internal_user(auth.uid()) OR public.cx_can_access_client(auth.uid(), id));

CREATE POLICY "cx_clients_delete" ON public.cx_clients FOR DELETE TO authenticated
USING (public.is_internal_user(auth.uid()) OR public.cx_can_access_client(auth.uid(), id));

CREATE POLICY "cx_documents_select" ON public.cx_documents FOR SELECT TO authenticated
USING (public.is_internal_user(auth.uid()) OR public.cx_can_access_client(auth.uid(), client_id));

CREATE POLICY "cx_documents_insert" ON public.cx_documents FOR INSERT TO authenticated
WITH CHECK (public.is_internal_user(auth.uid()) OR public.cx_can_access_client(auth.uid(), client_id));

CREATE POLICY "cx_documents_update" ON public.cx_documents FOR UPDATE TO authenticated
USING (public.is_internal_user(auth.uid()) OR public.cx_can_access_client(auth.uid(), client_id))
WITH CHECK (public.is_internal_user(auth.uid()) OR public.cx_can_access_client(auth.uid(), client_id));

CREATE POLICY "cx_documents_delete" ON public.cx_documents FOR DELETE TO authenticated
USING (public.is_internal_user(auth.uid()) OR public.cx_can_access_client(auth.uid(), client_id));

-- Storage access for portal clients
DROP POLICY IF EXISTS "cx_portal_docs_select" ON storage.objects;
DROP POLICY IF EXISTS "cx_portal_docs_insert" ON storage.objects;
DROP POLICY IF EXISTS "cx_portal_docs_delete" ON storage.objects;

CREATE POLICY "cx_portal_docs_select" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'correspondente-docs' AND public.cx_can_access_client(auth.uid(), ((storage.foldername(name))[1])::uuid));

CREATE POLICY "cx_portal_docs_insert" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'correspondente-docs' AND public.cx_can_access_client(auth.uid(), ((storage.foldername(name))[1])::uuid));

CREATE POLICY "cx_portal_docs_delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'correspondente-docs' AND public.cx_can_access_client(auth.uid(), ((storage.foldername(name))[1])::uuid));