
-- 1. Signature links
DROP POLICY IF EXISTS "Authenticated users can read Autentique signature links" ON public.autentique_signature_links;
CREATE POLICY "Admins can read signature links"
  ON public.autentique_signature_links FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Broker profiles - drop broad SELECT
DROP POLICY IF EXISTS "Authenticated users can view active brokers" ON public.broker_profiles;
-- "Users can view own broker profile" and "Admins can manage broker profiles" remain.

-- 3. CRM clients
DROP POLICY IF EXISTS "Authenticated users can view clients" ON public.crm_clients;
CREATE POLICY "Admins and creators can view clients"
  ON public.crm_clients FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR auth.uid() = created_by_user_id);

-- 4. CRM leads - tighten UPDATE
DROP POLICY IF EXISTS "Authenticated users can update leads" ON public.crm_leads;
CREATE POLICY "Assigned users and admins can update leads"
  ON public.crm_leads FOR UPDATE
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR auth.uid() = sdr_responsavel_id
    OR auth.uid() = sales_responsavel_id
    OR auth.uid() = created_by_user_id
  );

-- 5. CRM commissions
DROP POLICY IF EXISTS "Authenticated users can view commissions" ON public.crm_property_commissions;
CREATE POLICY "Admins and owner user can view commissions"
  ON public.crm_property_commissions FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR auth.uid() = user_id);

-- 6. Proposals - tighten SELECT and UPDATE
DROP POLICY IF EXISTS "Authenticated users can view proposals" ON public.proposals;
DROP POLICY IF EXISTS "Authenticated users can update proposals" ON public.proposals;
CREATE POLICY "Admins and responsible users can view proposals"
  ON public.proposals FOR SELECT
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR auth.uid() = responsible_user_id
    OR auth.uid() = created_by_user_id
  );
CREATE POLICY "Admins and responsible users can update proposals"
  ON public.proposals FOR UPDATE
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR auth.uid() = responsible_user_id
    OR auth.uid() = created_by_user_id
  );

-- 7. Rental contracts
DROP POLICY IF EXISTS "Authenticated users can view rental contracts" ON public.rental_contracts;
CREATE POLICY "Admins and responsible users can view rental contracts"
  ON public.rental_contracts FOR SELECT
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR auth.uid() = responsible_user_id
    OR auth.uid() = created_by_user_id
  );

-- 8. Rental owners
DROP POLICY IF EXISTS "Authenticated users can view rental owners" ON public.rental_owners;
CREATE POLICY "Admins and creators can view rental owners"
  ON public.rental_owners FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR auth.uid() = created_by_user_id);

-- 9. Rental guarantors
DROP POLICY IF EXISTS "Authenticated users can view rental guarantors" ON public.rental_guarantors;
CREATE POLICY "Admins and creators can view rental guarantors"
  ON public.rental_guarantors FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR auth.uid() = created_by_user_id);

-- 10. Rental tenants
DROP POLICY IF EXISTS "Authenticated users can view rental tenants" ON public.rental_tenants;
CREATE POLICY "Admins and creators can view rental tenants"
  ON public.rental_tenants FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR auth.uid() = created_by_user_id);

-- 11. Rental payments - scope via contract responsible user
DROP POLICY IF EXISTS "Authenticated users can view rental payments" ON public.rental_payments;
CREATE POLICY "Admins and contract owners can view rental payments"
  ON public.rental_payments FOR SELECT
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.rental_contracts c
      WHERE c.id = rental_payments.contract_id
        AND (auth.uid() = c.responsible_user_id OR auth.uid() = c.created_by_user_id)
    )
  );

-- 12. Storage: drop public read on crm-documents bucket
DROP POLICY IF EXISTS "Public read access for crm-documents" ON storage.objects;

-- 13. Storage: allow brokers to read their own files in broker-documents bucket
-- Files are expected to be stored under a top-level folder named with the broker_profiles.id
CREATE POLICY "Brokers can view their own broker documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'broker-documents'
    AND EXISTS (
      SELECT 1 FROM public.broker_profiles bp
      WHERE bp.user_id = auth.uid()
        AND bp.id::text = (storage.foldername(name))[1]
    )
  );
