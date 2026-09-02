CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule('cleanup-inactive-portals') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'cleanup-inactive-portals');

SELECT cron.schedule(
  'cleanup-inactive-portals',
  '30 4 * * *',
  $$
  SELECT net.http_post(
    url := 'https://kubdwbzahemthstrxrxh.supabase.co/functions/v1/cleanup-inactive-portals',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);