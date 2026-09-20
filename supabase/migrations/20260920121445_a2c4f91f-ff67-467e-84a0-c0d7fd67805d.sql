ALTER TABLE public.cx_clients
  ADD COLUMN IF NOT EXISTS cpf text,
  ADD COLUMN IF NOT EXISTS rg text,
  ADD COLUMN IF NOT EXISTS birth_date text,
  ADD COLUMN IF NOT EXISTS mother_name text,
  ADD COLUMN IF NOT EXISTS marital_status text,
  ADD COLUMN IF NOT EXISTS profession text,
  ADD COLUMN IF NOT EXISTS employer text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS neighborhood text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS zip_code text,
  ADD COLUMN IF NOT EXISTS monthly_income numeric,
  ADD COLUMN IF NOT EXISTS profile jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS profile_updated_at timestamptz;

CREATE INDEX IF NOT EXISTS cx_clients_cpf_idx ON public.cx_clients (cpf);

CREATE TABLE IF NOT EXISTS public.cx_client_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.cx_clients(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'nota',
  title text NOT NULL,
  description text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  actor_user_id uuid,
  actor_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cx_client_events_client_idx ON public.cx_client_events (client_id, created_at DESC);

GRANT SELECT, INSERT ON public.cx_client_events TO authenticated;
GRANT ALL ON public.cx_client_events TO service_role;

ALTER TABLE public.cx_client_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internos veem o histórico do cliente"
ON public.cx_client_events FOR SELECT TO authenticated
USING (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));

CREATE POLICY "Internos registram histórico do cliente"
ON public.cx_client_events FOR INSERT TO authenticated
WITH CHECK (public.is_internal_user(auth.uid()) AND public.is_approved_user(auth.uid()));