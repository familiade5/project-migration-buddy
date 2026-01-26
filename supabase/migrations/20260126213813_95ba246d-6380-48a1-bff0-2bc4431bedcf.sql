-- Drop the old FK to crm_clients and create new FK to rental_tenants
ALTER TABLE public.rental_contracts
DROP CONSTRAINT rental_contracts_tenant_id_fkey;

ALTER TABLE public.rental_contracts
ADD CONSTRAINT rental_contracts_tenant_id_fkey
FOREIGN KEY (tenant_id) REFERENCES public.rental_tenants(id) ON DELETE SET NULL;