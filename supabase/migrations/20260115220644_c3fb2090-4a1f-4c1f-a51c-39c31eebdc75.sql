-- Create table for real estate agency data and CRECIs
CREATE TABLE public.real_estate_agency (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Venda Direta Hoje',
  logo_url TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for CRECIs (multiple CRECIs per agency)
CREATE TABLE public.crecis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID REFERENCES public.real_estate_agency(id) ON DELETE CASCADE NOT NULL,
  creci_number TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'MS',
  name TEXT, -- Nome associado ao CRECI (ex: Nome do corretor ou "PJ")
  is_default BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(creci_number, state)
);

-- Enable RLS on both tables
ALTER TABLE public.real_estate_agency ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crecis ENABLE ROW LEVEL SECURITY;

-- Policies for real_estate_agency - only admins can manage
CREATE POLICY "Admins can view agency"
ON public.real_estate_agency
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert agency"
ON public.real_estate_agency
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update agency"
ON public.real_estate_agency
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete agency"
ON public.real_estate_agency
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policies for CRECIs - admins can manage, all users can view
CREATE POLICY "All users can view crecis"
ON public.crecis
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can insert crecis"
ON public.crecis
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update crecis"
ON public.crecis
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete crecis"
ON public.crecis
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_real_estate_agency_updated_at
BEFORE UPDATE ON public.real_estate_agency
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crecis_updated_at
BEFORE UPDATE ON public.crecis
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default agency
INSERT INTO public.real_estate_agency (name, phone, email)
VALUES ('Venda Direta Hoje', '(92) 98839-1098', 'contato@vendadiretahoje.com.br');

-- Insert default CRECI
INSERT INTO public.crecis (agency_id, creci_number, state, name, is_default)
SELECT id, 'CRECI 14851', 'MS', 'PJ', true
FROM public.real_estate_agency
LIMIT 1;