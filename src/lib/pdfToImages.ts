import * as pdfjs from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

/** True when the PDF bytes declare encryption (bank statements often do). */
export async function isEncryptedPdf(file: File): Promise<boolean> {
  if (!/pdf/i.test(file.type) && !/\.pdf$/i.test(file.name)) return false;
  const text = new TextDecoder('latin1').decode(await file.arrayBuffer());
  return text.includes('/Encrypt');
}

/** Renders PDF pages to JPEG base64 (no data: prefix). Works for owner-password-protected PDFs. */
export async function pdfToJpegBase64(file: File, maxPages = 30, scale = 1.6): Promise<string[]> {
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const out: string[] = [];
  const total = Math.min(doc.numPages, maxPages);
  for (let i = 1; i <= total; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    out.push(canvas.toDataURL('image/jpeg', 0.8).split(',')[1]);
  }
  return out;
}

/** Extracts the real error message from a functions.invoke error. */
export async function invokeErrorMessage(error: unknown): Promise<string> {
  const ctx = (error as { context?: Response })?.context;
  if (ctx && typeof ctx.json === 'function') {
    try {
      const body = await ctx.clone().json();
      if (body?.error) return String(body.error);
    } catch { /* ignore */ }
  }
  return error instanceof Error ? error.message : 'Erro na leitura';
}
