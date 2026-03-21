import { useState, useEffect } from 'react';

// Cache global para evitar múltiplos processamentos
const cache: Record<string, string> = {};

/**
 * Converte uma logo para base64 usando canvas em alta resolução (3x),
 * garantindo nitidez máxima na exportação de criativos.
 */
export const useLogoBase64 = (logoUrl: string): string => {
  const [base64, setBase64] = useState<string>(cache[logoUrl] ?? logoUrl);

  useEffect(() => {
    if (cache[logoUrl] && cache[logoUrl] !== logoUrl) {
      setBase64(cache[logoUrl]);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        // Renderiza em 3x para garantir qualidade na exportação 1080px
        const scale = 3;
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth * scale;
        canvas.height = img.naturalHeight * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          cache[logoUrl] = logoUrl;
          setBase64(logoUrl);
          return;
        }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        cache[logoUrl] = dataUrl;
        setBase64(dataUrl);
      } catch {
        cache[logoUrl] = logoUrl;
        setBase64(logoUrl);
      }
    };

    img.onerror = () => {
      cache[logoUrl] = logoUrl;
      setBase64(logoUrl);
    };

    img.src = logoUrl;
  }, [logoUrl]);

  return base64;
};
