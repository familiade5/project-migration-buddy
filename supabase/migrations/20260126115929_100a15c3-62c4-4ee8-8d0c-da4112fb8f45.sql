-- Create clients table for CRM
CREATE TABLE public.crm_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Personal data
    full_name TEXT NOT NULL,
    cpf TEXT,
    rg TEXT,
    birth_date DATE,
    email TEXT,
    phone TEXT,
    whatsapp TEXT,
    -- Address
    address TEXT,
    neighborhood TEXT,
    city TEXT,
    state TEXT DEFAULT 'MS',
    zip_code TEXT,
    -- Additional info
    notes TEXT,
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by_user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.crm_clients ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can view clients"
ON public.crm_clients
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert clients"
ON public.crm_clients
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update clients"
ON public.crm_clients
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete clients"
ON public.crm_clients
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create client documents table
CREATE TABLE public.crm_client_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.crm_clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    document_type TEXT NOT NULL DEFAULT 'outro',
    file_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    uploaded_by_user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.crm_client_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client documents
CREATE POLICY "Authenticated users can view client documents"
ON public.crm_client_documents
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage client documents"
ON public.crm_client_documents
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add client reference to properties
ALTER TABLE public.crm_properties 
ADD COLUMN client_id UUID REFERENCES public.crm_clients(id);

-- Create updated_at trigger for clients
CREATE TRIGGER update_crm_clients_updated_at
BEFORE UPDATE ON public.crm_clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for client documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('client-documents', 'client-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for client documents
CREATE POLICY "Authenticated users can view client documents storage"
ON storage.objects
FOR SELECT
USING (bucket_id = 'client-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can upload client documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'client-documents' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete client documents"
ON storage.objects
FOR DELETE
USING (bucket_id = 'client-documents' AND has_role(auth.uid(), 'admin'::app_role));