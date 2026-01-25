-- Add job_title/position field to broker_profiles to support different roles
ALTER TABLE public.broker_profiles 
ADD COLUMN job_title TEXT NOT NULL DEFAULT 'corretor';

-- Add common job titles as a comment for reference
COMMENT ON COLUMN public.broker_profiles.job_title IS 'Job titles: corretor, gestor_trafego, editor_video, rh, administrativo, gerente, diretor, assistente, outros';

-- Add personal info fields that might not be in profiles
ALTER TABLE public.broker_profiles
ADD COLUMN personal_phone TEXT,
ADD COLUMN personal_email TEXT,
ADD COLUMN birth_date DATE,
ADD COLUMN cpf TEXT,
ADD COLUMN rg TEXT,
ADD COLUMN bank_name TEXT,
ADD COLUMN bank_agency TEXT,
ADD COLUMN bank_account TEXT,
ADD COLUMN pix_key TEXT;