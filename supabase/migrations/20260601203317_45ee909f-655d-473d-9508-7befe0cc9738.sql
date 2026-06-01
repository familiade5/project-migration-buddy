UPDATE public.am_olx_listings SET is_active = false WHERE photos::text LIKE 'data:%' OR EXISTS (SELECT 1 FROM unnest(photos) p WHERE p LIKE 'data:%');
UPDATE public.vdh_olx_listings SET is_active = false WHERE EXISTS (SELECT 1 FROM unnest(photos) p WHERE p LIKE 'data:%');
UPDATE public.af_olx_listings SET is_active = false WHERE EXISTS (SELECT 1 FROM unnest(photos) p WHERE p LIKE 'data:%');