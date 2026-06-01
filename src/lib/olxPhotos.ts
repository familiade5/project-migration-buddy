import { supabase } from '@/integrations/supabase/client';

/**
 * OLX / ZAP / VivaReal Canal Pro só aceita URLs HTTPS para imagens.
 * Esta função recebe a lista de fotos (que podem vir como data URIs base64
 * vindos da câmera/upload local) e garante que TODAS sejam URLs públicas
 * acessíveis pelo crawler dos portais. Fotos que já são http(s) são
 * mantidas como estão.
 */
function dataUriToBlob(dataUri: string): { blob: Blob; ext: string } | null {
  const m = dataUri.match(/^data:([^;]+);base64,(.+)$/);
  if (!m) return null;
  const mime = m[1] || 'image/jpeg';
  const ext = mime.split('/')[1]?.split('+')[0] || 'jpg';
  const bin = atob(m[2]);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { blob: new Blob([bytes], { type: mime }), ext: ext === 'jpeg' ? 'jpg' : ext };
}

export async function uploadOlxPhotos(
  photos: string[],
  prefix: string,
  code: string,
): Promise<string[]> {
  if (!photos?.length) return [];
  const out: string[] = [];
  for (let i = 0; i < photos.length; i++) {
    const p = photos[i];
    if (!p) continue;
    if (/^https?:\/\//i.test(p)) {
      out.push(p);
      continue;
    }
    if (p.startsWith('data:')) {
      const parsed = dataUriToBlob(p);
      if (!parsed) continue;
      const path = `olx/${prefix}/${code}/${Date.now()}-${i}.${parsed.ext}`;
      const { error } = await supabase.storage
        .from('exported-creatives')
        .upload(path, parsed.blob, { contentType: parsed.blob.type, upsert: true });
      if (error) {
        console.error('[uploadOlxPhotos] upload failed', error);
        continue;
      }
      const { data } = supabase.storage.from('exported-creatives').getPublicUrl(path);
      if (data?.publicUrl) out.push(data.publicUrl);
    }
  }
  return out;
}