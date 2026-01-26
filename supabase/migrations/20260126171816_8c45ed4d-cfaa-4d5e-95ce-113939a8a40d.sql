-- Create enum for rental property stages
CREATE TYPE public.rental_property_stage AS ENUM (
  'disponivel',
  'reservado', 
  'ocupado',
  'catalogo'
);

-- Create enum for contract type
CREATE TYPE public.rental_contract_type AS ENUM (
  'residencial',
  'comercial'
);

-- Create enum for guarantee type
CREATE TYPE public.rental_guarantee_type AS ENUM (
  'fiador',
  'caucao',
  'seguro_fiador'
);

-- Create rental_owners table (landlords/property owners)
CREATE TABLE public.rental_owners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  cpf TEXT,
  rg TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  address TEXT,
  neighborhood TEXT,
  city TEXT DEFAULT 'Campo Grande',
  state TEXT DEFAULT 'MS',
  zip_code TEXT,
  bank_name TEXT,
  bank_agency TEXT,
  bank_account TEXT,
  pix_key TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by_user_id UUID
);

-- Create rental_tenants table (tenants/renters)
CREATE TABLE public.rental_tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  cpf TEXT,
  rg TEXT,
  birth_date DATE,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  profession TEXT,
  workplace TEXT,
  monthly_income NUMERIC,
  address TEXT,
  neighborhood TEXT,
  city TEXT DEFAULT 'Campo Grande',
  state TEXT DEFAULT 'MS',
  zip_code TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by_user_id UUID
);

-- Create rental_guarantors table (fiadores)
CREATE TABLE public.rental_guarantors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  cpf TEXT,
  rg TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  profession TEXT,
  monthly_income NUMERIC,
  address TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT DEFAULT 'MS',
  zip_code TEXT,
  property_address TEXT, -- Endereço do imóvel quitado do fiador
  property_registration TEXT, -- Matrícula do imóvel
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by_user_id UUID
);

-- Create rental_properties table (properties for rent)
CREATE TABLE public.rental_properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  property_type TEXT NOT NULL DEFAULT 'Apartamento',
  address TEXT NOT NULL,
  number TEXT,
  complement TEXT,
  neighborhood TEXT,
  city TEXT NOT NULL DEFAULT 'Campo Grande',
  state TEXT NOT NULL DEFAULT 'MS',
  zip_code TEXT,
  
  -- Size and layout
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  suites INTEGER DEFAULT 0,
  garage_spaces INTEGER DEFAULT 0,
  total_area NUMERIC,
  useful_area NUMERIC,
  
  -- Features
  is_furnished BOOLEAN DEFAULT false,
  accepts_pets BOOLEAN DEFAULT false,
  has_pool BOOLEAN DEFAULT false,
  has_gym BOOLEAN DEFAULT false,
  has_elevator BOOLEAN DEFAULT false,
  has_doorman BOOLEAN DEFAULT false,
  features TEXT[], -- Additional features
  
  -- Financial
  rent_value NUMERIC NOT NULL DEFAULT 0,
  condominium_fee NUMERIC DEFAULT 0,
  iptu_value NUMERIC DEFAULT 0,
  other_fees NUMERIC DEFAULT 0,
  
  -- Owner
  owner_id UUID REFERENCES public.rental_owners(id),
  
  -- Status
  current_stage rental_property_stage NOT NULL DEFAULT 'disponivel',
  stage_entered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Current contract (when occupied)
  current_contract_id UUID,
  
  -- Media
  cover_image_url TEXT,
  photos TEXT[],
  
  -- Documents
  registration_number TEXT, -- Matrícula
  iptu_registration TEXT, -- Inscrição IPTU
  
  -- Notes
  description TEXT,
  internal_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by_user_id UUID,
  responsible_user_id UUID
);

-- Create rental_property_documents table
CREATE TABLE public.rental_property_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.rental_properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'outro', -- matricula, iptu, vistoria, fotos, certidao, outro
  file_url TEXT NOT NULL,
  uploaded_by_user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rental_property_history table
CREATE TABLE public.rental_property_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.rental_properties(id) ON DELETE CASCADE,
  from_stage rental_property_stage,
  to_stage rental_property_stage NOT NULL,
  notes TEXT,
  moved_by_user_id UUID,
  moved_by_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add new columns to rental_contracts table
ALTER TABLE public.rental_contracts 
ADD COLUMN IF NOT EXISTS contract_type rental_contract_type DEFAULT 'residencial',
ADD COLUMN IF NOT EXISTS guarantee_type_enum rental_guarantee_type DEFAULT 'caucao',
ADD COLUMN IF NOT EXISTS rental_property_id UUID REFERENCES public.rental_properties(id),
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES public.rental_owners(id),
ADD COLUMN IF NOT EXISTS guarantor_id UUID REFERENCES public.rental_guarantors(id),
ADD COLUMN IF NOT EXISTS insurance_company TEXT,
ADD COLUMN IF NOT EXISTS insurance_policy_number TEXT,
ADD COLUMN IF NOT EXISTS insurance_value NUMERIC,
ADD COLUMN IF NOT EXISTS allowed_activity TEXT, -- For commercial contracts
ADD COLUMN IF NOT EXISTS renovation_terms TEXT, -- Benfeitorias
ADD COLUMN IF NOT EXISTS commercial_point_clause BOOLEAN DEFAULT false; -- Direito ao ponto

-- Enable RLS on new tables
ALTER TABLE public.rental_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_guarantors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_property_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_property_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rental_owners
CREATE POLICY "Admins can manage rental owners" ON public.rental_owners
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view rental owners" ON public.rental_owners
FOR SELECT USING (auth.uid() IS NOT NULL);

-- RLS Policies for rental_tenants
CREATE POLICY "Admins can manage rental tenants" ON public.rental_tenants
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view rental tenants" ON public.rental_tenants
FOR SELECT USING (auth.uid() IS NOT NULL);

-- RLS Policies for rental_guarantors
CREATE POLICY "Admins can manage rental guarantors" ON public.rental_guarantors
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view rental guarantors" ON public.rental_guarantors
FOR SELECT USING (auth.uid() IS NOT NULL);

-- RLS Policies for rental_properties
CREATE POLICY "Admins can manage rental properties" ON public.rental_properties
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view rental properties" ON public.rental_properties
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update rental property stage" ON public.rental_properties
FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for rental_property_documents
CREATE POLICY "Admins can manage rental property documents" ON public.rental_property_documents
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view rental property documents" ON public.rental_property_documents
FOR SELECT USING (auth.uid() IS NOT NULL);

-- RLS Policies for rental_property_history
CREATE POLICY "Authenticated users can insert rental property history" ON public.rental_property_history
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view rental property history" ON public.rental_property_history
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Create triggers for updated_at
CREATE TRIGGER update_rental_owners_updated_at
BEFORE UPDATE ON public.rental_owners
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rental_tenants_updated_at
BEFORE UPDATE ON public.rental_tenants
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rental_guarantors_updated_at
BEFORE UPDATE ON public.rental_guarantors
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rental_properties_updated_at
BEFORE UPDATE ON public.rental_properties
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for rental_properties
ALTER PUBLICATION supabase_realtime ADD TABLE public.rental_properties;