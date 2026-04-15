
-- Table to track scraped properties from external source
CREATE TABLE public.scraped_properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT NOT NULL UNIQUE,
  source_url TEXT,
  sale_modality TEXT NOT NULL,
  property_type TEXT,
  address TEXT,
  neighborhood TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT,
  price_evaluation NUMERIC,
  price_minimum NUMERIC,
  discount_percentage NUMERIC,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  garage_spaces INTEGER DEFAULT 0,
  area_total NUMERIC,
  area_private NUMERIC,
  area_terrain NUMERIC,
  photo_urls TEXT[] DEFAULT '{}',
  accepts_financing BOOLEAN DEFAULT false,
  accepts_fgts BOOLEAN DEFAULT false,
  payment_method TEXT,
  raw_data JSONB,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.scraped_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage scraped properties"
  ON public.scraped_properties FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view scraped properties"
  ON public.scraped_properties FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE INDEX idx_scraped_properties_status ON public.scraped_properties(status);
CREATE INDEX idx_scraped_properties_city_state ON public.scraped_properties(city, state);

CREATE TRIGGER update_scraped_properties_updated_at
  BEFORE UPDATE ON public.scraped_properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Queue table for posts awaiting approval
CREATE TABLE public.auto_post_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scraped_property_id UUID NOT NULL REFERENCES public.scraped_properties(id) ON DELETE CASCADE,
  property_data JSONB NOT NULL,
  generated_caption TEXT,
  photos TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  approved_by_user_id UUID,
  published_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.auto_post_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage auto post queue"
  ON public.auto_post_queue FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view auto post queue"
  ON public.auto_post_queue FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE INDEX idx_auto_post_queue_status ON public.auto_post_queue(status);

CREATE TRIGGER update_auto_post_queue_updated_at
  BEFORE UPDATE ON public.auto_post_queue
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
