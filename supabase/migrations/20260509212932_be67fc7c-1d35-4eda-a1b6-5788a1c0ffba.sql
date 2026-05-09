
-- VDH Inbox CRM: conversations, messages, access control

-- Inbox access table (who can use the VDH inbox)
CREATE TABLE public.vdh_inbox_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'responder' CHECK (role IN ('viewer', 'responder', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  granted_by_user_id UUID
);

-- Conversations: one per Instagram participant
CREATE TABLE public.vdh_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ig_participant_id TEXT NOT NULL UNIQUE, -- Instagram-scoped user ID (PSID)
  ig_username TEXT,
  ig_full_name TEXT,
  ig_profile_pic TEXT,
  last_message_text TEXT,
  last_message_at TIMESTAMPTZ,
  last_message_direction TEXT CHECK (last_message_direction IN ('in', 'out')),
  unread_count INTEGER NOT NULL DEFAULT 0,
  assigned_to_user_id UUID,
  assigned_to_name TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'archived')),
  lead_status TEXT NOT NULL DEFAULT 'novo' CHECK (lead_status IN ('novo', 'qualificando', 'quente', 'fechado', 'perdido')),
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vdh_conv_last_msg ON public.vdh_conversations (last_message_at DESC NULLS LAST);
CREATE INDEX idx_vdh_conv_assigned ON public.vdh_conversations (assigned_to_user_id);
CREATE INDEX idx_vdh_conv_status ON public.vdh_conversations (status);

-- Messages: every inbound and outbound message
CREATE TABLE public.vdh_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.vdh_conversations(id) ON DELETE CASCADE,
  ig_message_id TEXT UNIQUE, -- Meta's message id, helps dedupe webhook retries
  direction TEXT NOT NULL CHECK (direction IN ('in', 'out')),
  text TEXT,
  attachment_type TEXT, -- 'image', 'video', 'audio', 'file', 'story_mention', 'share', 'reaction'
  attachment_url TEXT,
  story_url TEXT,
  reply_to_ig_message_id TEXT,
  sent_by_user_id UUID, -- which CRM user sent it (for outbound)
  sent_by_name TEXT,
  is_echo BOOLEAN NOT NULL DEFAULT false,
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vdh_msg_conv ON public.vdh_messages (conversation_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.vdh_inbox_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vdh_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vdh_messages ENABLE ROW LEVEL SECURITY;

-- Security definer: does the user have inbox access?
CREATE OR REPLACE FUNCTION public.has_vdh_inbox_access(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.has_role(_user_id, 'admin'::app_role)
    OR EXISTS (SELECT 1 FROM public.vdh_inbox_access WHERE user_id = _user_id);
$$;

-- Policies: vdh_inbox_access (only admins manage)
CREATE POLICY "Admins manage inbox access"
  ON public.vdh_inbox_access FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own access entry"
  ON public.vdh_inbox_access FOR SELECT
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

-- Policies: vdh_conversations
CREATE POLICY "Inbox users can view conversations"
  ON public.vdh_conversations FOR SELECT
  USING (has_vdh_inbox_access(auth.uid()));

CREATE POLICY "Inbox users can update conversations"
  ON public.vdh_conversations FOR UPDATE
  USING (has_vdh_inbox_access(auth.uid()))
  WITH CHECK (has_vdh_inbox_access(auth.uid()));

CREATE POLICY "Admins can delete conversations"
  ON public.vdh_conversations FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Inserts done by service role (webhook), no INSERT policy needed for clients

-- Policies: vdh_messages
CREATE POLICY "Inbox users can view messages"
  ON public.vdh_messages FOR SELECT
  USING (has_vdh_inbox_access(auth.uid()));

-- Trigger to keep updated_at fresh
CREATE TRIGGER trg_vdh_conv_updated
  BEFORE UPDATE ON public.vdh_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add to realtime publication
ALTER TABLE public.vdh_conversations REPLICA IDENTITY FULL;
ALTER TABLE public.vdh_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vdh_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vdh_messages;

-- Grant inbox access to existing admins automatically (so they don't lock themselves out)
INSERT INTO public.vdh_inbox_access (user_id, role)
SELECT user_id, 'admin' FROM public.user_roles WHERE role = 'admin'
ON CONFLICT (user_id) DO NOTHING;
