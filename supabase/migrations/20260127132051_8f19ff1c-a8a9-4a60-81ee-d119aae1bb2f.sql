-- Allow authenticated users to read real estate agency basic info (needed for contract generation/signature)
-- Rationale: Rental contract generator runs for staff users that are not necessarily admins.

-- Ensure RLS is enabled (it already is, but keep safe)
ALTER TABLE public.real_estate_agency ENABLE ROW LEVEL SECURITY;

-- Add a SELECT policy for authenticated users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'real_estate_agency'
      AND policyname = 'Authenticated users can view agency basic info'
  ) THEN
    CREATE POLICY "Authenticated users can view agency basic info"
    ON public.real_estate_agency
    FOR SELECT
    USING (auth.uid() IS NOT NULL);
  END IF;
END$$;
