-- Add cover image and source creative fields to crm_properties
ALTER TABLE public.crm_properties
ADD COLUMN cover_image_url TEXT,
ADD COLUMN source_creative_id UUID,
ADD COLUMN created_by_user_id UUID;

-- Add payment method and proof to commissions table
ALTER TABLE public.crm_property_commissions
ADD COLUMN payment_method TEXT,
ADD COLUMN payment_proof_url TEXT;

-- Create table for edit permissions (admin can grant edit access to specific users)
CREATE TABLE public.crm_edit_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.crm_properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  granted_by_user_id UUID NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(property_id, user_id)
);

-- Enable RLS on edit permissions
ALTER TABLE public.crm_edit_permissions ENABLE ROW LEVEL SECURITY;

-- Policies for edit permissions table
CREATE POLICY "Authenticated users can view edit permissions"
ON public.crm_edit_permissions FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage edit permissions"
ON public.crm_edit_permissions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update crm_properties policies to allow all users to update stage (for kanban drag)
DROP POLICY IF EXISTS "Admins can update properties" ON public.crm_properties;

-- Create function to check if user can edit property
CREATE OR REPLACE FUNCTION public.can_edit_crm_property(_user_id UUID, _property_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    has_role(_user_id, 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.crm_edit_permissions
      WHERE property_id = _property_id AND user_id = _user_id
    )
$$;

-- Allow authenticated users to update only stage-related fields
CREATE POLICY "Authenticated users can update property stage"
ON public.crm_properties FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create storage bucket for commission payment proofs
INSERT INTO storage.buckets (id, name, public)
VALUES ('crm-documents', 'crm-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for crm-documents bucket
CREATE POLICY "Authenticated users can view crm documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'crm-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can upload crm documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'crm-documents' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete crm documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'crm-documents' AND has_role(auth.uid(), 'admin'::app_role));