-- VDH OLX listings (mirror of am_olx_listings)
CREATE TABLE public.vdh_olx_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  transaction_type olx_transaction_type NOT NULL DEFAULT 'venda',
  property_type TEXT NOT NULL DEFAULT 'Apartamento',
  title TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  address_number TEXT,
  zip_code TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'MS',
  area NUMERIC,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  suites INTEGER DEFAULT 0,
  garage_spaces INTEGER DEFAULT 0,
  floor TEXT,
  furnished BOOLEAN DEFAULT false,
  sale_price NUMERIC,
  rental_price NUMERIC,
  condominium_fee NUMERIC DEFAULT 0,
  iptu NUMERIC DEFAULT 0,
  accepts_financing BOOLEAN DEFAULT true,
  accepts_fgts BOOLEAN DEFAULT true,
  photos TEXT[] NOT NULL DEFAULT '{}',
  broker_name TEXT NOT NULL,
  broker_phone TEXT NOT NULL,
  broker_email TEXT,
  creci TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by_user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.vdh_olx_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view VDH OLX listings"
  ON public.vdh_olx_listings FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert VDH OLX listings"
  ON public.vdh_olx_listings FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update VDH OLX listings"
  ON public.vdh_olx_listings FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete VDH OLX listings"
  ON public.vdh_olx_listings FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_vdh_olx_listings_updated_at
  BEFORE UPDATE ON public.vdh_olx_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- AF OLX listings (mirror, default state CE)
CREATE TABLE public.af_olx_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  transaction_type olx_transaction_type NOT NULL DEFAULT 'venda',
  property_type TEXT NOT NULL DEFAULT 'Apartamento',
  title TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  address_number TEXT,
  zip_code TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'CE',
  area NUMERIC,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  suites INTEGER DEFAULT 0,
  garage_spaces INTEGER DEFAULT 0,
  floor TEXT,
  furnished BOOLEAN DEFAULT false,
  sale_price NUMERIC,
  rental_price NUMERIC,
  condominium_fee NUMERIC DEFAULT 0,
  iptu NUMERIC DEFAULT 0,
  accepts_financing BOOLEAN DEFAULT true,
  accepts_fgts BOOLEAN DEFAULT true,
  photos TEXT[] NOT NULL DEFAULT '{}',
  broker_name TEXT NOT NULL,
  broker_phone TEXT NOT NULL,
  broker_email TEXT,
  creci TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by_user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.af_olx_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view AF OLX listings"
  ON public.af_olx_listings FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert AF OLX listings"
  ON public.af_olx_listings FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update AF OLX listings"
  ON public.af_olx_listings FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete AF OLX listings"
  ON public.af_olx_listings FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_af_olx_listings_updated_at
  BEFORE UPDATE ON public.af_olx_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();