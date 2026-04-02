-- Fix rental_payments: drop the overly permissive ALL policy, replace with admin-only write + authenticated read
DROP POLICY IF EXISTS "Authenticated users can manage rental payments" ON public.rental_payments;

-- Admin-only write access
CREATE POLICY "Admins can manage rental payments"
ON public.rental_payments
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix crm_properties: restrict UPDATE to admins and users with edit permission
DROP POLICY IF EXISTS "Authenticated users can update property stage" ON public.crm_properties;

CREATE POLICY "Admins and permitted users can update properties"
ON public.crm_properties
FOR UPDATE
USING (can_edit_crm_property(auth.uid(), id))
WITH CHECK (can_edit_crm_property(auth.uid(), id));