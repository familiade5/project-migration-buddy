-- Allow any authenticated user to insert/update OLX listings (AM, VDH, AF).
-- Previously only admins could insert, which blocked the team.

DROP POLICY IF EXISTS "Admins can insert OLX listings" ON public.am_olx_listings;
DROP POLICY IF EXISTS "Admins can update OLX listings" ON public.am_olx_listings;
CREATE POLICY "Authenticated can insert AM OLX listings"
  ON public.am_olx_listings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can update AM OLX listings"
  ON public.am_olx_listings FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins can insert VDH OLX listings" ON public.vdh_olx_listings;
DROP POLICY IF EXISTS "Admins can update VDH OLX listings" ON public.vdh_olx_listings;
CREATE POLICY "Authenticated can insert VDH OLX listings"
  ON public.vdh_olx_listings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can update VDH OLX listings"
  ON public.vdh_olx_listings FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins can insert AF OLX listings" ON public.af_olx_listings;
DROP POLICY IF EXISTS "Admins can update AF OLX listings" ON public.af_olx_listings;
CREATE POLICY "Authenticated can insert AF OLX listings"
  ON public.af_olx_listings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can update AF OLX listings"
  ON public.af_olx_listings FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL);