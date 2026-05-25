-- Enum para tipo de transação OLX
CREATE TYPE public.olx_transaction_type AS ENUM ('venda', 'aluguel', 'lancamento');

-- Tabela do catálogo OLX
CREATE TABLE public.am_olx_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  transaction_type public.olx_transaction_type NOT NULL DEFAULT 'venda',
  property_type TEXT NOT NULL DEFAULT 'Apartamento',
  title TEXT NOT NULL,
  description TEXT,
  
  -- Localização (obrigatórios para OLX)
  address TEXT NOT NULL,
  address_number TEXT,
  zip_code TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'AM',
  
  -- Specs
  area NUMERIC,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  suites INTEGER DEFAULT 0,
  garage_spaces INTEGER DEFAULT 0,
  floor TEXT,
  furnished BOOLEAN DEFAULT false,
  
  -- Valores
  sale_price NUMERIC,
  rental_price NUMERIC,
  condominium_fee NUMERIC DEFAULT 0,
  iptu NUMERIC DEFAULT 0,
  accepts_financing BOOLEAN DEFAULT true,
  accepts_fgts BOOLEAN DEFAULT true,
  
  -- Mídia
  photos TEXT[] NOT NULL DEFAULT '{}',
  
  -- Contato
  broker_name TEXT NOT NULL,
  broker_phone TEXT NOT NULL,
  broker_email TEXT,
  creci TEXT,
  
  -- Status e auditoria
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_am_olx_listings_active ON public.am_olx_listings(is_active);
CREATE INDEX idx_am_olx_listings_code ON public.am_olx_listings(code);

-- RLS
ALTER TABLE public.am_olx_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view OLX listings"
ON public.am_olx_listings FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert OLX listings"
ON public.am_olx_listings FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update OLX listings"
ON public.am_olx_listings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete OLX listings"
ON public.am_olx_listings FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Trigger updated_at
CREATE TRIGGER update_am_olx_listings_updated_at
BEFORE UPDATE ON public.am_olx_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();