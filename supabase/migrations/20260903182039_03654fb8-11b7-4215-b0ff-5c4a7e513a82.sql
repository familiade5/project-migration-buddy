ALTER TABLE public.cx_properties
  ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.cx_clients(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS cx_properties_client_id_idx ON public.cx_properties(client_id);