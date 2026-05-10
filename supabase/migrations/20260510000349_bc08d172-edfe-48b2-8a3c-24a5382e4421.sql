CREATE TABLE IF NOT EXISTS public.vdh_ai_knowledge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_context text NOT NULL DEFAULT 'A Venda Direta Hoje (VDH) trabalha exclusivamente com Venda Direta e Venda Direta Online da Caixa Econômica Federal. São imóveis retomados pela Caixa, vendidos diretamente pelo banco, sem leilão. Modalidades: à vista, financiamento Caixa, FGTS e parcelamento Caixa. Atendemos clientes interessados em comprar esses imóveis com excelentes oportunidades e descontos.',
  common_questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  tone_guidelines text,
  trained_messages_count integer NOT NULL DEFAULT 0,
  last_trained_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.vdh_ai_knowledge ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inbox users can view ai knowledge"
ON public.vdh_ai_knowledge FOR SELECT
USING (public.has_vdh_inbox_access(auth.uid()));

CREATE POLICY "Admins can manage ai knowledge"
ON public.vdh_ai_knowledge FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_vdh_ai_knowledge_updated_at
BEFORE UPDATE ON public.vdh_ai_knowledge
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.vdh_ai_knowledge (id) VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;