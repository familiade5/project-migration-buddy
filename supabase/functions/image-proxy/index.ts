import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

// Repassa fotos da Caixa com CORS para gerar as artes do post
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const target = new URL(req.url).searchParams.get('url') || '';
    const u = new URL(target);
    if (u.protocol !== 'https:' || !u.hostname.endsWith('caixa.gov.br')) {
      return new Response(JSON.stringify({ error: 'URL não permitida' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const r = await fetch(u.toString(), { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124 Safari/537.36' } });
    const type = r.headers.get('content-type') || '';
    if (!r.ok || !type.startsWith('image')) {
      return new Response(JSON.stringify({ error: `Foto indisponível (${r.status})` }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    return new Response(await r.arrayBuffer(), { headers: { ...corsHeaders, 'Content-Type': type, 'Cache-Control': 'public, max-age=86400' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
