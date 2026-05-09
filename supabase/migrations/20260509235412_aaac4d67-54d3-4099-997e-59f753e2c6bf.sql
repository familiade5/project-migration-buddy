
-- ============ KANBAN COLUMNS ============
CREATE TABLE public.vdh_kanban_columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6b7280',
  position INTEGER NOT NULL DEFAULT 0,
  is_default_for_new BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vdh_kanban_columns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inbox users can view kanban columns"
  ON public.vdh_kanban_columns FOR SELECT
  USING (public.has_vdh_inbox_access(auth.uid()));

CREATE POLICY "Inbox users can manage kanban columns"
  ON public.vdh_kanban_columns FOR ALL
  USING (public.has_vdh_inbox_access(auth.uid()))
  WITH CHECK (public.has_vdh_inbox_access(auth.uid()));

CREATE TRIGGER trg_vdh_kanban_columns_updated
  BEFORE UPDATE ON public.vdh_kanban_columns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Garantir apenas 1 coluna padrão
CREATE UNIQUE INDEX idx_vdh_kanban_default ON public.vdh_kanban_columns (is_default_for_new) WHERE is_default_for_new = true;

-- Seed columns
INSERT INTO public.vdh_kanban_columns (name, color, position, is_default_for_new) VALUES
  ('Primeiro Contato', '#6b7280', 0, true),
  ('Qualificando',     '#3b82f6', 1, false),
  ('Quente',           '#f97316', 2, false),
  ('Negociando',       '#8b5cf6', 3, false),
  ('Fechado',          '#22c55e', 4, false),
  ('Perdido',          '#ef4444', 5, false);

-- ============ CONVERSATIONS — kanban_column_id ============
ALTER TABLE public.vdh_conversations
  ADD COLUMN kanban_column_id UUID REFERENCES public.vdh_kanban_columns(id) ON DELETE SET NULL;

-- Migra status legados para colunas
UPDATE public.vdh_conversations c
SET kanban_column_id = k.id
FROM public.vdh_kanban_columns k
WHERE (c.lead_status = 'novo' AND k.name = 'Primeiro Contato')
   OR (c.lead_status = 'qualificando' AND k.name = 'Qualificando')
   OR (c.lead_status = 'quente' AND k.name = 'Quente')
   OR (c.lead_status = 'fechado' AND k.name = 'Fechado')
   OR (c.lead_status = 'perdido' AND k.name = 'Perdido');

CREATE INDEX idx_vdh_conv_kanban ON public.vdh_conversations(kanban_column_id);

-- Trigger: novas conversas recebem coluna padrão
CREATE OR REPLACE FUNCTION public.vdh_set_default_kanban_column()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.kanban_column_id IS NULL THEN
    SELECT id INTO NEW.kanban_column_id
    FROM public.vdh_kanban_columns
    WHERE is_default_for_new = true
    LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_vdh_conv_default_column
  BEFORE INSERT ON public.vdh_conversations
  FOR EACH ROW EXECUTE FUNCTION public.vdh_set_default_kanban_column();

-- ============ QUICK REPLIES ============
CREATE TABLE public.vdh_quick_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  keywords TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vdh_quick_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inbox users can view quick replies"
  ON public.vdh_quick_replies FOR SELECT
  USING (public.has_vdh_inbox_access(auth.uid()));

CREATE POLICY "Inbox users can manage quick replies"
  ON public.vdh_quick_replies FOR ALL
  USING (public.has_vdh_inbox_access(auth.uid()))
  WITH CHECK (public.has_vdh_inbox_access(auth.uid()));

CREATE TRIGGER trg_vdh_quick_replies_updated
  BEFORE UPDATE ON public.vdh_quick_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ AUTO REPLY CONFIG ============
CREATE TABLE public.vdh_auto_reply_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  business_days INTEGER[] NOT NULL DEFAULT '{1,2,3,4,5}',  -- 0=dom, 6=sab
  business_hour_start INTEGER NOT NULL DEFAULT 8,   -- 0-23
  business_hour_end INTEGER NOT NULL DEFAULT 18,    -- 0-23
  timezone TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  system_prompt TEXT NOT NULL DEFAULT 'Você é a assistente virtual da VDH Imóveis. Seja simpática, breve e profissional. Avise que estamos fora do horário de atendimento e que um corretor humano responderá em breve. Se a pessoa perguntar sobre imóveis, financiamento, MCMV ou preços, dê uma resposta inicial útil. Use no máximo 2-3 frases curtas. Não invente dados específicos de imóveis.',
  model TEXT NOT NULL DEFAULT 'google/gemini-2.5-flash',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vdh_auto_reply_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inbox users can view auto reply config"
  ON public.vdh_auto_reply_config FOR SELECT
  USING (public.has_vdh_inbox_access(auth.uid()));

CREATE POLICY "Inbox users can manage auto reply config"
  ON public.vdh_auto_reply_config FOR ALL
  USING (public.has_vdh_inbox_access(auth.uid()))
  WITH CHECK (public.has_vdh_inbox_access(auth.uid()));

CREATE TRIGGER trg_vdh_auto_reply_updated
  BEFORE UPDATE ON public.vdh_auto_reply_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.vdh_auto_reply_config DEFAULT VALUES;

-- ============ MESSAGES — flag de auto-resposta ============
ALTER TABLE public.vdh_messages
  ADD COLUMN IF NOT EXISTS is_auto_reply BOOLEAN NOT NULL DEFAULT false;

-- ============ REALTIME ============
ALTER PUBLICATION supabase_realtime ADD TABLE public.vdh_kanban_columns;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vdh_quick_replies;
