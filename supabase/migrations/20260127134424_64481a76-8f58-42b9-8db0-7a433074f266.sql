-- Add signed_at column to track when each signer has signed (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'autentique_signature_links' AND column_name = 'signed_at') THEN
    ALTER TABLE public.autentique_signature_links ADD COLUMN signed_at timestamp with time zone DEFAULT NULL;
  END IF;
END $$;

-- Allow service role to manage signature links (for edge functions)
DROP POLICY IF EXISTS "No direct inserts" ON public.autentique_signature_links;
DROP POLICY IF EXISTS "No direct updates" ON public.autentique_signature_links;
DROP POLICY IF EXISTS "No direct deletes" ON public.autentique_signature_links;
DROP POLICY IF EXISTS "Service role can insert signature links" ON public.autentique_signature_links;
DROP POLICY IF EXISTS "Service role can update signature links" ON public.autentique_signature_links;
DROP POLICY IF EXISTS "Service role can delete signature links" ON public.autentique_signature_links;

-- Create policies for service role
CREATE POLICY "Service role can insert signature links"
ON public.autentique_signature_links
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can update signature links"
ON public.autentique_signature_links
FOR UPDATE
TO service_role
USING (true);

CREATE POLICY "Service role can delete signature links"
ON public.autentique_signature_links
FOR DELETE
TO service_role
USING (true);