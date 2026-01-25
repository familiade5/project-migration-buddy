-- Create table for broker profiles (extends user profiles with broker-specific data)
CREATE TABLE public.broker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES public.real_estate_agency(id) ON DELETE CASCADE,
  
  -- Commission settings
  commission_percentage NUMERIC NOT NULL DEFAULT 3.0,
  
  -- Hiring info
  hired_at DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  
  -- Documents
  resume_url TEXT,
  contract_url TEXT,
  photo_url TEXT,
  
  -- Professional info
  creci_number TEXT,
  creci_state TEXT DEFAULT 'MS',
  specializations TEXT[], -- e.g., ['residential', 'commercial', 'rural']
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Unique constraint: one broker profile per user
  UNIQUE(user_id)
);

-- Create table for hiring questionnaire responses
CREATE TABLE public.broker_questionnaire (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID REFERENCES public.broker_profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Standard hiring questions
  motivation TEXT, -- "Por que deseja trabalhar conosco?"
  experience_years INTEGER DEFAULT 0, -- Anos de experiência
  previous_experience TEXT, -- "Experiência anterior no mercado imobiliário"
  career_goals TEXT, -- "Quais são seus objetivos de carreira?"
  monthly_sales_goal NUMERIC, -- Meta mensal de vendas
  availability TEXT, -- "Disponibilidade para trabalho"
  strengths TEXT, -- "Quais são seus pontos fortes?"
  improvement_areas TEXT, -- "Áreas que deseja melhorar"
  referral_source TEXT, -- "Como conheceu nossa imobiliária?"
  additional_notes TEXT, -- "Observações adicionais"
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create table for broker documents (multiple documents per broker)
CREATE TABLE public.broker_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID REFERENCES public.broker_profiles(id) ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,
  document_type TEXT NOT NULL, -- 'resume', 'contract', 'certificate', 'id', 'other'
  file_url TEXT NOT NULL,
  uploaded_by_user_id UUID,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.broker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broker_questionnaire ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broker_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for broker_profiles
CREATE POLICY "Admins can manage broker profiles"
ON public.broker_profiles
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own broker profile"
ON public.broker_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view active brokers"
ON public.broker_profiles
FOR SELECT
USING (auth.uid() IS NOT NULL AND status = 'active');

-- RLS Policies for broker_questionnaire
CREATE POLICY "Admins can manage questionnaires"
ON public.broker_questionnaire
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Brokers can view own questionnaire"
ON public.broker_questionnaire
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.broker_profiles bp 
    WHERE bp.id = broker_id AND bp.user_id = auth.uid()
  )
);

-- RLS Policies for broker_documents
CREATE POLICY "Admins can manage broker documents"
ON public.broker_documents
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Brokers can view own documents"
ON public.broker_documents
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.broker_profiles bp 
    WHERE bp.id = broker_id AND bp.user_id = auth.uid()
  )
);

-- Create storage bucket for broker documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('broker-documents', 'broker-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for broker documents
CREATE POLICY "Admins can upload broker documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'broker-documents' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can view broker documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'broker-documents' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete broker documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'broker-documents' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Add trigger for updated_at
CREATE TRIGGER update_broker_profiles_updated_at
BEFORE UPDATE ON public.broker_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_broker_questionnaire_updated_at
BEFORE UPDATE ON public.broker_questionnaire
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();