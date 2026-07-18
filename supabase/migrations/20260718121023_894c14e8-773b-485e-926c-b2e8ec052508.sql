
CREATE TABLE public.am_landing_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  photos JSONB NOT NULL DEFAULT '[]'::jsonb,
  copy JSONB NOT NULL DEFAULT '{}'::jsonb,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  accent_color TEXT NOT NULL DEFAULT '#1B5EA6',
  whatsapp_message TEXT,
  broker JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  view_count INTEGER NOT NULL DEFAULT 0,
  whatsapp_click_count INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_am_landing_pages_slug ON public.am_landing_pages(slug);
CREATE INDEX idx_am_landing_pages_code ON public.am_landing_pages(code);
CREATE INDEX idx_am_landing_pages_created_by ON public.am_landing_pages(created_by);

GRANT SELECT ON public.am_landing_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.am_landing_pages TO authenticated;
GRANT ALL ON public.am_landing_pages TO service_role;

ALTER TABLE public.am_landing_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active landing pages"
  ON public.am_landing_pages FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view own landing pages"
  ON public.am_landing_pages FOR SELECT
  TO authenticated
  USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can create landing pages"
  ON public.am_landing_pages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Owners and admins can update landing pages"
  ON public.am_landing_pages FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Owners and admins can delete landing pages"
  ON public.am_landing_pages FOR DELETE
  TO authenticated
  USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_am_landing_pages_updated_at
  BEFORE UPDATE ON public.am_landing_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.increment_landing_metric(_slug TEXT, _metric TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _metric = 'view' THEN
    UPDATE public.am_landing_pages SET view_count = view_count + 1 WHERE slug = _slug AND is_active = true;
  ELSIF _metric = 'whatsapp' THEN
    UPDATE public.am_landing_pages SET whatsapp_click_count = whatsapp_click_count + 1 WHERE slug = _slug AND is_active = true;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_landing_metric(TEXT, TEXT) TO anon, authenticated;
