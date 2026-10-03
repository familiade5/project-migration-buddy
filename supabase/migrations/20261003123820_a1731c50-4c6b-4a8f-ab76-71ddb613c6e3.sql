ALTER TABLE public.cx_credit_analyses
  ADD COLUMN IF NOT EXISTS response_at timestamptz;