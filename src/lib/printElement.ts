/** Abre uma janela de impressão (permite "Salvar como PDF") com o conteúdo do elemento, mantendo o visual do app. */
export function printElement(el: HTMLElement, title: string) {
  const win = window.open('', '_blank', 'width=1000,height=800');
  if (!win) { alert('Permita pop-ups para imprimir.'); return; }
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((n) => (n as HTMLElement).outerHTML).join('\n');
  const clone = el.cloneNode(true) as HTMLElement;
  // Remove apenas botões de ação marcados; campos de cópia viram texto simples
  clone.querySelectorAll('[data-noprint]').forEach((n) => n.remove());
  clone.querySelectorAll('button').forEach((btn) => {
    btn.querySelectorAll('svg').forEach((s) => s.remove());
    const div = document.createElement('div');
    div.className = btn.className;
    div.innerHTML = btn.innerHTML;
    btn.replaceWith(div);
  });
  const date = new Date().toLocaleString('pt-BR');
  win.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${title}</title>
<base href="${location.origin}/">${styles}
<style>
  @page { size: A4; margin: 16mm 14mm; }
  html, body { background: #fff !important; color: #0f172a !important; }
  body { font-family: system-ui, -apple-system, Segoe UI, sans-serif; padding: 0; margin: 0; }
  .print-frame { border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 8mm 8mm; background: #fff; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
  tr, img { break-inside: avoid; page-break-inside: avoid; }
  .print-head { display:flex; justify-content:space-between; align-items:flex-end; border-bottom:3px solid #1a3a6b; padding-bottom:8px; margin-bottom:16px; break-after: avoid; page-break-after: avoid; }
  .print-head h1 { font-size:18px; margin:0; color:#1a3a6b; font-weight:800; }
  .print-head span { font-size:11px; color:#64748b; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; box-shadow:none !important; }
  .print-frame, .print-frame * { max-width: 100% !important; min-width: 0 !important; box-sizing: border-box; }
  .print-frame table { width: 100% !important; table-layout: fixed; font-size: 9px; }
  .print-frame td, .print-frame th { word-break: break-word; overflow-wrap: anywhere; padding: 4px 5px !important; }
  .truncate { white-space: normal !important; overflow: visible !important; }
  .overflow-hidden, .overflow-auto, .overflow-x-auto, .overflow-y-auto { overflow: visible !important; max-height: none !important; }
  .rounded-2xl, .rounded-xl, .rounded-lg { border-radius: 6px !important; }
</style></head><body>
<div class="print-frame">
<div class="print-head"><h1>${title}</h1><span>Correspondente Caixa · ${date}</span></div>
${clone.outerHTML}
</div>
</body></html>`);
  win.document.close();
  const go = () => { win.focus(); win.print(); };
  win.onload = () => setTimeout(go, 400);
  setTimeout(() => { if (!win.closed && win.document.readyState === 'complete') go(); }, 1500);
}
