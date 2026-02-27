
-- Tabela de perfil de busca de clientes
CREATE TABLE public.crm_client_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.crm_clients(id) ON DELETE CASCADE,
  property_types TEXT[] NULL,                  -- tipos de imóvel aceitos
  min_value NUMERIC NULL,                      -- valor mínimo
  max_value NUMERIC NULL,                      -- valor máximo
  cities TEXT[] NULL,                          -- cidades desejadas
  neighborhoods TEXT[] NULL,                   -- bairros desejados
  accepts_financing BOOLEAN NULL,              -- null = indiferente, true = obrigatório
  min_bedrooms INTEGER NULL,                   -- quartos mínimos
  notes TEXT NULL,                             -- observações adicionais
  is_active BOOLEAN NOT NULL DEFAULT true,     -- cliente ainda está buscando?
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.crm_client_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view client searches"
  ON public.crm_client_searches FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage client searches"
  ON public.crm_client_searches FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can insert client searches"
  ON public.crm_client_searches FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update client searches"
  ON public.crm_client_searches FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete client searches"
  ON public.crm_client_searches FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Trigger de updated_at
CREATE TRIGGER update_crm_client_searches_updated_at
  BEFORE UPDATE ON public.crm_client_searches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
