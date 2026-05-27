
DROP POLICY IF EXISTS "Authenticated users can view client documents" ON public.crm_client_documents;
CREATE POLICY "Admins and client creators view client documents"
ON public.crm_client_documents FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM public.crm_clients c WHERE c.id = crm_client_documents.client_id AND c.created_by_user_id = auth.uid())
);

DROP POLICY IF EXISTS "Authenticated users can view client searches" ON public.crm_client_searches;
DROP POLICY IF EXISTS "Authenticated users can insert client searches" ON public.crm_client_searches;
DROP POLICY IF EXISTS "Authenticated users can update client searches" ON public.crm_client_searches;
DROP POLICY IF EXISTS "Authenticated users can delete client searches" ON public.crm_client_searches;

CREATE POLICY "Admins and client creators view client searches"
ON public.crm_client_searches FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin'::app_role) OR EXISTS (SELECT 1 FROM public.crm_clients c WHERE c.id = crm_client_searches.client_id AND c.created_by_user_id = auth.uid()));
CREATE POLICY "Admins and client creators insert client searches"
ON public.crm_client_searches FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR EXISTS (SELECT 1 FROM public.crm_clients c WHERE c.id = crm_client_searches.client_id AND c.created_by_user_id = auth.uid()));
CREATE POLICY "Admins and client creators update client searches"
ON public.crm_client_searches FOR UPDATE TO authenticated
USING (has_role(auth.uid(),'admin'::app_role) OR EXISTS (SELECT 1 FROM public.crm_clients c WHERE c.id = crm_client_searches.client_id AND c.created_by_user_id = auth.uid()));
CREATE POLICY "Admins and client creators delete client searches"
ON public.crm_client_searches FOR DELETE TO authenticated
USING (has_role(auth.uid(),'admin'::app_role) OR EXISTS (SELECT 1 FROM public.crm_clients c WHERE c.id = crm_client_searches.client_id AND c.created_by_user_id = auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.crm_leads;
CREATE POLICY "Assigned users and admins view leads"
ON public.crm_leads FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin'::app_role) OR auth.uid() = sdr_responsavel_id OR auth.uid() = sales_responsavel_id OR auth.uid() = created_by_user_id);

DROP POLICY IF EXISTS "Authenticated users can view interactions" ON public.crm_lead_interactions;
DROP POLICY IF EXISTS "Authenticated users can insert interactions" ON public.crm_lead_interactions;
CREATE POLICY "Assigned users and admins view lead interactions"
ON public.crm_lead_interactions FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin'::app_role) OR EXISTS (SELECT 1 FROM public.crm_leads l WHERE l.id = crm_lead_interactions.lead_id AND (auth.uid() = l.sdr_responsavel_id OR auth.uid() = l.sales_responsavel_id OR auth.uid() = l.created_by_user_id)));
CREATE POLICY "Assigned users and admins insert lead interactions"
ON public.crm_lead_interactions FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR EXISTS (SELECT 1 FROM public.crm_leads l WHERE l.id = crm_lead_interactions.lead_id AND (auth.uid() = l.sdr_responsavel_id OR auth.uid() = l.sales_responsavel_id OR auth.uid() = l.created_by_user_id)));

DROP POLICY IF EXISTS "Authenticated users can view lead history" ON public.crm_lead_history;
DROP POLICY IF EXISTS "Authenticated users can insert lead history" ON public.crm_lead_history;
CREATE POLICY "Assigned users and admins view lead history"
ON public.crm_lead_history FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin'::app_role) OR EXISTS (SELECT 1 FROM public.crm_leads l WHERE l.id = crm_lead_history.lead_id AND (auth.uid() = l.sdr_responsavel_id OR auth.uid() = l.sales_responsavel_id OR auth.uid() = l.created_by_user_id)));
CREATE POLICY "Assigned users and admins insert lead history"
ON public.crm_lead_history FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR EXISTS (SELECT 1 FROM public.crm_leads l WHERE l.id = crm_lead_history.lead_id AND (auth.uid() = l.sdr_responsavel_id OR auth.uid() = l.sales_responsavel_id OR auth.uid() = l.created_by_user_id)));

DROP POLICY IF EXISTS "Authenticated users can view properties" ON public.crm_properties;
CREATE POLICY "Admins and permitted users view properties"
ON public.crm_properties FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin'::app_role) OR auth.uid() = created_by_user_id OR auth.uid() = responsible_user_id OR can_edit_crm_property(auth.uid(), id));

DROP POLICY IF EXISTS "Authenticated users can view documents" ON public.crm_property_documents;
CREATE POLICY "Admins and permitted users view property documents"
ON public.crm_property_documents FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin'::app_role) OR can_edit_crm_property(auth.uid(), property_id));

DROP POLICY IF EXISTS "Authenticated users can view history" ON public.crm_property_history;
DROP POLICY IF EXISTS "Authenticated users can insert history" ON public.crm_property_history;
CREATE POLICY "Admins and permitted users view property history"
ON public.crm_property_history FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin'::app_role) OR can_edit_crm_property(auth.uid(), property_id));
CREATE POLICY "Admins and permitted users insert property history"
ON public.crm_property_history FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR can_edit_crm_property(auth.uid(), property_id));

DROP POLICY IF EXISTS "Authenticated users can view reminders" ON public.crm_property_reminders;
DROP POLICY IF EXISTS "Authenticated users can manage reminders" ON public.crm_property_reminders;
CREATE POLICY "Admins and permitted users view reminders"
ON public.crm_property_reminders FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin'::app_role) OR can_edit_crm_property(auth.uid(), property_id));
CREATE POLICY "Admins and permitted users manage reminders"
ON public.crm_property_reminders FOR ALL TO authenticated
USING (has_role(auth.uid(),'admin'::app_role) OR can_edit_crm_property(auth.uid(), property_id))
WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR can_edit_crm_property(auth.uid(), property_id));

DROP POLICY IF EXISTS "Authenticated users can view checklist" ON public.proposal_checklist;
DROP POLICY IF EXISTS "Authenticated users can manage checklist" ON public.proposal_checklist;
CREATE POLICY "Admins and proposal owners view checklist"
ON public.proposal_checklist FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin'::app_role) OR EXISTS (SELECT 1 FROM public.proposals p WHERE p.id = proposal_checklist.proposal_id AND (auth.uid() = p.responsible_user_id OR auth.uid() = p.created_by_user_id)));
CREATE POLICY "Admins and proposal owners manage checklist"
ON public.proposal_checklist FOR ALL TO authenticated
USING (has_role(auth.uid(),'admin'::app_role) OR EXISTS (SELECT 1 FROM public.proposals p WHERE p.id = proposal_checklist.proposal_id AND (auth.uid() = p.responsible_user_id OR auth.uid() = p.created_by_user_id)))
WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR EXISTS (SELECT 1 FROM public.proposals p WHERE p.id = proposal_checklist.proposal_id AND (auth.uid() = p.responsible_user_id OR auth.uid() = p.created_by_user_id)));

DROP POLICY IF EXISTS "Authenticated users can view proposal history" ON public.proposal_history;
DROP POLICY IF EXISTS "Authenticated users can insert proposal history" ON public.proposal_history;
CREATE POLICY "Admins and proposal owners view proposal history"
ON public.proposal_history FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin'::app_role) OR EXISTS (SELECT 1 FROM public.proposals p WHERE p.id = proposal_history.proposal_id AND (auth.uid() = p.responsible_user_id OR auth.uid() = p.created_by_user_id)));
CREATE POLICY "Admins and proposal owners insert proposal history"
ON public.proposal_history FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR EXISTS (SELECT 1 FROM public.proposals p WHERE p.id = proposal_history.proposal_id AND (auth.uid() = p.responsible_user_id OR auth.uid() = p.created_by_user_id)));

DROP POLICY IF EXISTS "Authenticated users can view contract documents" ON public.rental_contract_documents;
CREATE POLICY "Admins and responsible users view contract documents"
ON public.rental_contract_documents FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin'::app_role) OR EXISTS (SELECT 1 FROM public.rental_contracts rc WHERE rc.id = rental_contract_documents.contract_id AND (auth.uid() = rc.responsible_user_id OR auth.uid() = rc.created_by_user_id)));

DROP POLICY IF EXISTS "Authenticated users can update rental property stage" ON public.rental_properties;
CREATE POLICY "Admins and responsible users update rental properties"
ON public.rental_properties FOR UPDATE TO authenticated
USING (has_role(auth.uid(),'admin'::app_role) OR auth.uid() = responsible_user_id OR auth.uid() = created_by_user_id)
WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR auth.uid() = responsible_user_id OR auth.uid() = created_by_user_id);

DROP POLICY IF EXISTS "Authenticated users can view rental property documents" ON public.rental_property_documents;
CREATE POLICY "Admins and responsible users view rental property documents"
ON public.rental_property_documents FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin'::app_role) OR EXISTS (SELECT 1 FROM public.rental_properties rp WHERE rp.id = rental_property_documents.property_id AND (auth.uid() = rp.responsible_user_id OR auth.uid() = rp.created_by_user_id)));

UPDATE storage.buckets SET public = false WHERE id = 'crm-documents';

DROP POLICY IF EXISTS "Authenticated users can view client documents storage" ON storage.objects;
CREATE POLICY "Admins view client documents storage"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'client-documents' AND has_role(auth.uid(),'admin'::app_role));

DROP POLICY IF EXISTS "Authenticated users can view crm documents" ON storage.objects;
CREATE POLICY "Admins view crm documents storage"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'crm-documents' AND has_role(auth.uid(),'admin'::app_role));
