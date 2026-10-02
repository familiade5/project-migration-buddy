CREATE TABLE public.vdh_site_properties (
  code text PRIMARY KEY,
  uf text NOT NULL,
  city text NOT NULL,
  neighborhood text,
  address text,
  property_type text,
  description text,
  price numeric NOT NULL DEFAULT 0,
  evaluation numeric NOT NULL DEFAULT 0,
  discount numeric NOT NULL DEFAULT 0,
  accepts_financing boolean NOT NULL DEFAULT false,
  sale_modality text,
  caixa_link text,
  photo_url text,
  bedrooms integer NOT NULL DEFAULT 0,
  garage_spaces integer NOT NULL DEFAULT 0,
  area numeric,
  countdown_ends_at timestamptz,
  status text NOT NULL DEFAULT 'active',
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  sold_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX vdh_site_properties_uf_city ON public.vdh_site_properties (uf, city, status);
GRANT SELECT ON public.vdh_site_properties TO anon, authenticated;
GRANT ALL ON public.vdh_site_properties TO service_role;
ALTER TABLE public.vdh_site_properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public sees available and recently sold" ON public.vdh_site_properties
  FOR SELECT TO anon, authenticated
  USING (status = 'active' OR (status = 'sold' AND sold_at > now() - interval '3 days'));
CREATE POLICY "Internal sees all site properties" ON public.vdh_site_properties
  FOR SELECT TO authenticated USING (public.is_internal_user(auth.uid()));
CREATE TRIGGER update_vdh_site_properties_updated_at BEFORE UPDATE ON public.vdh_site_properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.vdh_cc_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  cpf text,
  email text,
  phone text NOT NULL,
  birth_date date,
  marital_status text,
  monthly_income numeric NOT NULL DEFAULT 0,
  income_type text,
  uses_fgts boolean NOT NULL DEFAULT false,
  has_coborrower boolean NOT NULL DEFAULT false,
  coborrower_name text,
  coborrower_income numeric,
  city text,
  uf text,
  property_code text,
  property_snapshot jsonb,
  documents jsonb NOT NULL DEFAULT '[]'::jsonb,
  stage text NOT NULL DEFAULT 'novo',
  rejection_reason text,
  analyst_notes text,
  approved_value numeric,
  assigned_broker_id uuid,
  assigned_broker_name text,
  consent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.vdh_cc_leads TO authenticated;
GRANT ALL ON public.vdh_cc_leads TO service_role;
ALTER TABLE public.vdh_cc_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Internal view vdh leads" ON public.vdh_cc_leads FOR SELECT TO authenticated USING (public.is_internal_user(auth.uid()));
CREATE POLICY "Internal update vdh leads" ON public.vdh_cc_leads FOR UPDATE TO authenticated USING (public.is_internal_user(auth.uid())) WITH CHECK (public.is_internal_user(auth.uid()));
CREATE POLICY "Admins delete vdh leads" ON public.vdh_cc_leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_vdh_cc_leads_updated_at BEFORE UPDATE ON public.vdh_cc_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.vdh_cc_lead_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.vdh_cc_leads(id) ON DELETE CASCADE,
  from_stage text,
  to_stage text,
  note text,
  user_id uuid,
  user_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.vdh_cc_lead_history TO authenticated;
GRANT ALL ON public.vdh_cc_lead_history TO service_role;
ALTER TABLE public.vdh_cc_lead_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Internal view vdh lead history" ON public.vdh_cc_lead_history FOR SELECT TO authenticated USING (public.is_internal_user(auth.uid()));
CREATE POLICY "Internal add vdh lead history" ON public.vdh_cc_lead_history FOR INSERT TO authenticated WITH CHECK (public.is_internal_user(auth.uid()) AND user_id = auth.uid());

CREATE POLICY "Internal read vdh site docs" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'vdh-site-docs' AND public.is_internal_user(auth.uid()));