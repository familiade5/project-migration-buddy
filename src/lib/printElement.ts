/** Abre uma janela de impressão (permite "Salvar como PDF") com o conteúdo do elemento, mantendo o visual do app. */
export function printElement(el: HTMLElement, title: string) {
  const win = window.open('', '_blank', 'width=1000,height=800');
  if (!win) { alert('Permita pop-ups para imprimir.'); return; }
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((n) => (n as HTMLElement).outerHTML).join('\n');
  const clone = el.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('[data-noprint], button').forEach((n) => n.remove());
  const date = new Date().toLocaleString('pt-BR');
  win.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${title}</title>
<base href="${location.origin}/">${styles}
<style>
  @page { size: A4; margin: 14mm; }
  html, body { background: #fff !important; color: #0f172a !important; }
  body { font-family: system-ui, -apple-system, Segoe UI, sans-serif; padding: 0; margin: 0; }
  .print-head { display:flex; justify-content:space-between; align-items:flex-end; border-bottom:3px solid #1a3a6b; padding-bottom:8px; margin-bottom:16px; }
  .print-head h1 { font-size:18px; margin:0; color:#1a3a6b; font-weight:800; }
  .print-head span { font-size:11px; color:#64748b; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; box-shadow:none !important; }
  .truncate { white-space: normal !important; overflow: visible !important; }
  table, tr, img { page-break-inside: avoid; }
  .overflow-hidden, .overflow-auto, .overflow-x-auto, .overflow-y-auto { overflow: visible !important; max-height: none !important; }
</style></head><body>
<div class="print-head"><h1>${title}</h1><span>Correspondente Caixa · ${date}</span></div>
${clone.outerHTML}
</body></html>`);
  win.document.close();
  const go = () => { win.focus(); win.print(); };
  win.onload = () => setTimeout(go, 400);
  setTimeout(() => { if (!win.closed && win.document.readyState === 'complete') go(); }, 1500);
}
