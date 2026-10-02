// Melhoria gratuita de foto no navegador: amplia em etapas com suavização de alta
// qualidade e aplica nitidez (unsharp mask) + leve ajuste de contraste/cor.
export async function enhancePhoto(dataUrl: string, targetWidth = 1440): Promise<string> {
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => rej(new Error('load'));
    i.src = dataUrl;
  });
  if (!img.width || img.width >= targetWidth) return dataUrl;

  // Ampliação em etapas (no máx. 1.5x por vez) — bordas mais suaves que um salto único
  let src: HTMLCanvasElement | HTMLImageElement = img;
  let w = img.width, h = img.height;
  const ratio = img.height / img.width;
  while (w < targetWidth) {
    const nw = Math.min(targetWidth, Math.round(w * 1.5));
    const nh = Math.round(nw * ratio);
    const c = document.createElement('canvas');
    c.width = nw; c.height = nh;
    const ctx = c.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(src, 0, 0, nw, nh);
    src = c; w = nw; h = nh;
  }
  const canvas = src as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  // Versão desfocada para o unsharp mask
  const blur = document.createElement('canvas');
  blur.width = w; blur.height = h;
  const bctx = blur.getContext('2d')!;
  bctx.filter = 'blur(1.6px)';
  bctx.drawImage(canvas, 0, 0);

  const orig = ctx.getImageData(0, 0, w, h);
  const bl = bctx.getImageData(0, 0, w, h).data;
  const d = orig.data;
  const amount = 0.9, threshold = 3;
  for (let i = 0; i < d.length; i += 4) {
    for (let k = 0; k < 3; k++) {
      const diff = d[i + k] - bl[i + k];
      if (Math.abs(diff) > threshold) {
        const v = d[i + k] + diff * amount;
        d[i + k] = v < 0 ? 0 : v > 255 ? 255 : v;
      }
    }
  }
  ctx.putImageData(orig, 0, 0);

  // Leve realce de contraste e cor
  const out = document.createElement('canvas');
  out.width = w; out.height = h;
  const octx = out.getContext('2d')!;
  octx.filter = 'contrast(1.06) saturate(1.08)';
  octx.drawImage(canvas, 0, 0);
  return out.toDataURL('image/jpeg', 0.95);
}
