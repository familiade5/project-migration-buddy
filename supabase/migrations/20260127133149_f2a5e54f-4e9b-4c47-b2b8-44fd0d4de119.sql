-- Create table to persist Autentique signature links extracted from webhook payloads
CREATE TABLE IF NOT EXISTS public.autentique_signature_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES public.rental_contracts(id) ON DELETE CASCADE,
  document_id TEXT NOT NULL,
  public_id TEXT NOT NULL,
  signer_name TEXT,
  signer_email TEXT,
  short_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (document_id, public_id)
);

CREATE INDEX IF NOT EXISTS idx_autentique_signature_links_contract_id
  ON public.autentique_signature_links(contract_id);

CREATE INDEX IF NOT EXISTS idx_autentique_signature_links_document_id
  ON public.autentique_signature_links(document_id);

ALTER TABLE public.autentique_signature_links ENABLE ROW LEVEL SECURITY;

-- Staff users can read links for workflow operations
CREATE POLICY "Authenticated users can read Autentique signature links"
  ON public.autentique_signature_links
  FOR SELECT
  TO authenticated
  USING (true);

-- No direct writes from client; server (service role) can write bypassing RLS
CREATE POLICY "No direct inserts"
  ON public.autentique_signature_links
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "No direct updates"
  ON public.autentique_signature_links
  FOR UPDATE
  TO authenticated
  USING (false);

CREATE POLICY "No direct deletes"
  ON public.autentique_signature_links
  FOR DELETE
  TO authenticated
  USING (false);

-- Ensure updated_at is maintained
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_autentique_signature_links_updated_at'
  ) THEN
    CREATE TRIGGER update_autentique_signature_links_updated_at
    BEFORE UPDATE ON public.autentique_signature_links
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;