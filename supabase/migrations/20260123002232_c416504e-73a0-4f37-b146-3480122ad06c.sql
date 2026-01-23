-- Composite index to support common access pattern: filter by user_id and order by created_at
CREATE INDEX IF NOT EXISTS idx_creatives_user_id_created_at_desc
ON public.creatives (user_id, created_at DESC);

-- Optional: cover admin ordering even when planner chooses different path
CREATE INDEX IF NOT EXISTS idx_creatives_created_at_id_desc
ON public.creatives (created_at DESC, id DESC);