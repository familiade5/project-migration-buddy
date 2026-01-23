-- Create index for faster ordering on creatives table
CREATE INDEX IF NOT EXISTS idx_creatives_created_at_desc ON public.creatives (created_at DESC);

-- Create index for user_id filtering
CREATE INDEX IF NOT EXISTS idx_creatives_user_id ON public.creatives (user_id);