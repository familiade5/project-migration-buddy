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
    if (r.ok && type.startsWith('image')) {
      return new Response(await r.arrayBuffer(), { headers: { ...corsHeaders, 'Content-Type': type, 'Cache-Control': 'public, max-age=86400' } });
    }
    // A Caixa bloqueia servidores em nuvem: tira um "print" da foto via Firecrawl (1 crédito)
    const key = Deno.env.get('FIRECRAWL_API_KEY');
    const SCRIPT = `document.documentElement.innerHTML='<body style="margin:0;background:#fff"><img id="i" style="display:block;width:100vw;height:100vh;object-fit:cover;image-rendering:high-quality"></body>';document.getElementById('i').src=${JSON.stringify(u.toString())};`;
    if (key) {
      const fc = await fetch('https://api.firecrawl.dev/v2/scrape', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://example.com', formats: [{ type: 'screenshot', fullPage: false, viewport: { width: 1200, height: 900 } }], actions: [{ type: 'executeJavascript', script: SCRIPT }, { type: 'wait', milliseconds: 2500 }], proxy: 'auto' }),
      });
      const body = await fc.json().catch(() => null);
      console.log('fc keys', Object.keys(body?.data || {}), String(body?.data?.rawHtml || '').slice(0, 120));
      const shot = body?.data?.screenshot || body?.data?.actions?.screenshots?.[0] || body?.screenshot;
      if (fc.ok && shot) {
        const img = shot.startsWith('data:') ? Uint8Array.from(atob(shot.split(',')[1]), (c) => c.charCodeAt(0)) : new Uint8Array(await (await fetch(shot)).arrayBuffer());
        return new Response(img, { headers: { ...corsHeaders, 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' } });
      }
      console.error('Firecrawl screenshot failed', fc.status, JSON.stringify(body)?.slice(0, 500));
    }
    {
      return new Response(JSON.stringify({ error: `Foto indisponível (${r.status})` }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    return new Response(await r.arrayBuffer(), { headers: { ...corsHeaders, 'Content-Type': type, 'Cache-Control': 'public, max-age=86400' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
