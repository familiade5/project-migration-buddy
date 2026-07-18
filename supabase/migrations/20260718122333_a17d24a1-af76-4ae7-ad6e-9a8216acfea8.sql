GRANT SELECT ON public.am_landing_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.am_landing_pages TO authenticated;
GRANT ALL ON public.am_landing_pages TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_landing_metric(text, text) TO anon, authenticated;