import { useState, useEffect } from 'react';

// Cache global para evitar múltiplos fetches
const cache: Record<string, string> = {};

export const useLogoBase64 = (logoUrl: string): string => {
  const [base64, setBase64] = useState<string>(cache[logoUrl] ?? logoUrl);

  useEffect(() => {
    if (cache[logoUrl] && cache[logoUrl] !== logoUrl) {
      setBase64(cache[logoUrl]);
      return;
    }
    fetch(logoUrl)
      .then(res => res.blob())
      .then(blob => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }))
      .then(dataUrl => {
        cache[logoUrl] = dataUrl;
        setBase64(dataUrl);
      })
      .catch(() => {
        cache[logoUrl] = logoUrl;
        setBase64(logoUrl);
      });
  }, [logoUrl]);

  return base64;
};
