CREATE TABLE public.cx_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  notes TEXT,
  extracted JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by_user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cx_clients TO authenticated;
GRANT ALL ON public.cx_clients TO service_role;
ALTER TABLE public.cx_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cx_clients_select" ON public.cx_clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "cx_clients_insert" ON public.cx_clients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "cx_clients_update" ON public.cx_clients FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "cx_clients_delete" ON public.cx_clients FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_cx_clients_updated_at BEFORE UPDATE ON public.cx_clients
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.cx_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.cx_clients(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL DEFAULT 'outro',
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  mime_type TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  extracted JSONB NOT NULL DEFAULT '{}'::jsonb,
  uploaded_by_user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX cx_documents_client_id_idx ON public.cx_documents(client_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cx_documents TO authenticated;
GRANT ALL ON public.cx_documents TO service_role;
ALTER TABLE public.cx_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cx_documents_select" ON public.cx_documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "cx_documents_insert" ON public.cx_documents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "cx_documents_update" ON public.cx_documents FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "cx_documents_delete" ON public.cx_documents FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_cx_documents_updated_at BEFORE UPDATE ON public.cx_documents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "cx_docs_read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'correspondente-docs');
CREATE POLICY "cx_docs_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'correspondente-docs');
CREATE POLICY "cx_docs_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'correspondente-docs');
CREATE POLICY "cx_docs_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'correspondente-docs');