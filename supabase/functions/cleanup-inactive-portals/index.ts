import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Portal accounts (holders) inactive for 30+ days
    const { data: holders, error: holdersError } = await supabase
      .from('cx_clients')
      .select('id, portal_user_id, updated_at')
      .not('portal_user_id', 'is', null)
      .lt('updated_at', cutoff);
    if (holdersError) throw holdersError;

    let removed = 0;

    for (const holder of holders || []) {
      // dependents of this holder
      const { data: deps } = await supabase
        .from('cx_clients')
        .select('id, updated_at')
        .eq('parent_client_id', holder.id);

      const ids = [holder.id, ...(deps || []).map((d) => d.id)];

      // skip if any person or document had recent movement
      const recentPerson = (deps || []).some((d) => (d.updated_at as string) > cutoff);
      if (recentPerson) continue;

      const { data: docs } = await supabase
        .from('cx_documents')
        .select('id, file_path, updated_at')
        .in('client_id', ids);

      if ((docs || []).some((d) => (d.updated_at as string) > cutoff)) continue;

      const paths = (docs || []).map((d) => d.file_path as string).filter(Boolean);
      if (paths.length) {
        await supabase.storage.from('correspondente-docs').remove(paths);
      }

      await supabase.from('cx_documents').delete().in('client_id', ids);
      await supabase.from('cx_clients').delete().eq('parent_client_id', holder.id);
      await supabase.from('cx_clients').delete().eq('id', holder.id);

      if (holder.portal_user_id) {
        await supabase.auth.admin.deleteUser(holder.portal_user_id as string);
      }
      removed += 1;
    }

    return new Response(JSON.stringify({ success: true, removed, cutoff }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro inesperado';
    console.error('cleanup-inactive-portals error', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
