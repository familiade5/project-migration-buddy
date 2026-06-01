import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function formatCep(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const d = String(raw).replace(/\D/g, '');
  if (d.length !== 8) return raw;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

function dataUriToBytes(dataUri: string): { bytes: Uint8Array; mime: string; ext: string } | null {
  const m = dataUri.match(/^data:([^;]+);base64,(.+)$/);
  if (!m) return null;
  const mime = m[1] || 'image/jpeg';
  const ext = (mime.split('/')[1] || 'jpg').split('+')[0];
  const bin = atob(m[2]);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { bytes, mime, ext: ext === 'jpeg' ? 'jpg' : ext };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: rows, error } = await supabase
    .from('am_olx_listings')
    .select('id, code, photos, zip_code, is_active')
    .eq('is_active', false);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const results: any[] = [];

  for (const row of rows || []) {
    const photos: string[] = Array.isArray(row.photos) ? row.photos : [];
    const hasBase64 = photos.some((p) => typeof p === 'string' && p.startsWith('data:'));
    if (!hasBase64) continue;

    const uploaded: string[] = [];
    for (let i = 0; i < photos.length; i++) {
      const p = photos[i];
      if (!p) continue;
      if (/^https?:\/\//i.test(p)) {
        uploaded.push(p);
        continue;
      }
      if (p.startsWith('data:')) {
        const parsed = dataUriToBytes(p);
        if (!parsed) continue;
        const path = `olx/am/${row.code}/${Date.now()}-${i}.${parsed.ext}`;
        const { error: upErr } = await supabase.storage
          .from('exported-creatives')
          .upload(path, parsed.bytes, { contentType: parsed.mime, upsert: true });
        if (upErr) {
          console.error('upload failed', row.code, i, upErr.message);
          continue;
        }
        const { data: pub } = supabase.storage.from('exported-creatives').getPublicUrl(path);
        if (pub?.publicUrl) uploaded.push(pub.publicUrl);
      }
    }

    const newCep = formatCep(row.zip_code);
    const { error: updErr } = await supabase
      .from('am_olx_listings')
      .update({ photos: uploaded, zip_code: newCep, is_active: true })
      .eq('id', row.id);

    results.push({
      code: row.code,
      photos_uploaded: uploaded.length,
      cep: newCep,
      reactivated: !updErr,
      error: updErr?.message,
    });
  }

  return new Response(JSON.stringify({ ok: true, results }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});