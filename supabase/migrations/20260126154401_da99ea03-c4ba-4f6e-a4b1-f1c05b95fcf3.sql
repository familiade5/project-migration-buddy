-- =============================================
-- CRM LOCAÇÃO - Rental Management System
-- =============================================

-- Enum for payment status
CREATE TYPE public.rental_payment_status AS ENUM (
  'pending',
  'paid',
  'overdue',
  'partial',
  'cancelled'
);

-- Enum for contract status
CREATE TYPE public.rental_contract_status AS ENUM (
  'active',
  'ending_soon',
  'expired',
  'terminated',
  'renewed'
);

-- =============================================
-- RENTAL CONTRACTS TABLE
-- =============================================
CREATE TABLE public.rental_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Property Info
  property_code TEXT NOT NULL,
  property_type TEXT NOT NULL DEFAULT 'Apartamento',
  property_address TEXT NOT NULL,
  property_neighborhood TEXT,
  property_city TEXT NOT NULL DEFAULT 'Campo Grande',
  property_state TEXT NOT NULL DEFAULT 'MS',
  
  -- Owner Info
  owner_name TEXT NOT NULL,
  owner_phone TEXT,
  owner_email TEXT,
  owner_pix_key TEXT,
  owner_bank_info TEXT,
  
  -- Tenant (linked to crm_clients)
  tenant_id UUID REFERENCES public.crm_clients(id) ON DELETE SET NULL,
  
  -- Contract Terms
  rent_value NUMERIC(12,2) NOT NULL,
  condominium_fee NUMERIC(12,2) DEFAULT 0,
  iptu_value NUMERIC(12,2) DEFAULT 0,
  other_fees NUMERIC(12,2) DEFAULT 0,
  
  payment_due_day INTEGER NOT NULL DEFAULT 10 CHECK (payment_due_day >= 1 AND payment_due_day <= 28),
  
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Deposit/Guarantees
  deposit_value NUMERIC(12,2) DEFAULT 0,
  deposit_months INTEGER DEFAULT 2,
  guarantee_type TEXT,
  
  -- Status
  status rental_contract_status NOT NULL DEFAULT 'active',
  
  -- Management
  responsible_user_id UUID,
  management_fee_percentage NUMERIC(5,2) DEFAULT 10.0,
  
  -- Documents
  contract_document_url TEXT,
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_user_id UUID
);

-- =============================================
-- RENTAL PAYMENTS TABLE
-- =============================================
CREATE TABLE public.rental_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  contract_id UUID NOT NULL REFERENCES public.rental_contracts(id) ON DELETE CASCADE,
  
  -- Payment Period
  reference_month INTEGER NOT NULL CHECK (reference_month >= 1 AND reference_month <= 12),
  reference_year INTEGER NOT NULL,
  due_date DATE NOT NULL,
  
  -- Values
  rent_value NUMERIC(12,2) NOT NULL,
  condominium_fee NUMERIC(12,2) DEFAULT 0,
  iptu_value NUMERIC(12,2) DEFAULT 0,
  other_fees NUMERIC(12,2) DEFAULT 0,
  late_fee NUMERIC(12,2) DEFAULT 0,
  discount NUMERIC(12,2) DEFAULT 0,
  
  -- Payment Info
  status rental_payment_status NOT NULL DEFAULT 'pending',
  paid_amount NUMERIC(12,2),
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  
  -- External Payment Integration
  external_payment_id TEXT,
  external_payment_url TEXT,
  
  -- Proof
  payment_proof_url TEXT,
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Unique constraint
  UNIQUE(contract_id, reference_month, reference_year)
);

-- =============================================
-- RENTAL ALERT CONFIGURATION
-- =============================================
CREATE TABLE public.rental_alert_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  days_offset INTEGER NOT NULL,
  alert_type TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  message_template TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default alert configurations
INSERT INTO public.rental_alert_configs (days_offset, alert_type, message_template, is_enabled) VALUES
  (-5, 'before_due', 'O aluguel de {property} vence em 5 dias.', true),
  (-3, 'before_due', 'O aluguel de {property} vence em 3 dias.', true),
  (-1, 'before_due', 'O aluguel de {property} vence amanhã.', true),
  (0, 'on_due', 'O aluguel de {property} vence hoje.', true),
  (1, 'after_due', 'O aluguel de {property} está 1 dia em atraso.', true),
  (3, 'after_due', 'O aluguel de {property} está 3 dias em atraso.', true),
  (7, 'after_due', 'ATENÇÃO: O aluguel de {property} está 7 dias em atraso.', true),
  (15, 'after_due', 'URGENTE: O aluguel de {property} está 15 dias em atraso.', true),
  (30, 'after_due', 'CRÍTICO: O aluguel de {property} está 30 dias em atraso.', true);

-- =============================================
-- RENTAL CONTRACT DOCUMENTS
-- =============================================
CREATE TABLE public.rental_contract_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES public.rental_contracts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'outro',
  file_url TEXT NOT NULL,
  uploaded_by_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- RLS POLICIES
-- =============================================

ALTER TABLE public.rental_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_alert_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_contract_documents ENABLE ROW LEVEL SECURITY;

-- Rental Contracts Policies
CREATE POLICY "Authenticated users can view rental contracts"
  ON public.rental_contracts FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert rental contracts"
  ON public.rental_contracts FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update rental contracts"
  ON public.rental_contracts FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete rental contracts"
  ON public.rental_contracts FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Rental Payments Policies
CREATE POLICY "Authenticated users can view rental payments"
  ON public.rental_payments FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage rental payments"
  ON public.rental_payments FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Alert Configs Policies
CREATE POLICY "Authenticated users can view alert configs"
  ON public.rental_alert_configs FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage alert configs"
  ON public.rental_alert_configs FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Contract Documents Policies
CREATE POLICY "Authenticated users can view contract documents"
  ON public.rental_contract_documents FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage contract documents"
  ON public.rental_contract_documents FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_rental_contracts_updated_at
  BEFORE UPDATE ON public.rental_contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rental_payments_updated_at
  BEFORE UPDATE ON public.rental_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_rental_contracts_status ON public.rental_contracts(status);
CREATE INDEX idx_rental_contracts_tenant ON public.rental_contracts(tenant_id);
CREATE INDEX idx_rental_contracts_responsible ON public.rental_contracts(responsible_user_id);
CREATE INDEX idx_rental_payments_contract ON public.rental_payments(contract_id);
CREATE INDEX idx_rental_payments_status ON public.rental_payments(status);
CREATE INDEX idx_rental_payments_due_date ON public.rental_payments(due_date);
CREATE INDEX idx_rental_payments_reference ON public.rental_payments(reference_year, reference_month);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.rental_contracts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rental_payments;