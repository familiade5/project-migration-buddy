import type { PdfRenderer } from "./renderer";
import type { PdfRGB } from "./theme";

export function drawHeader(
  r: PdfRenderer,
  data: { title: string; subtitle: string; badges: Array<{ label: string; tone: "brand" | "dark" }>; metaRight: string }
) {
  const { pageWidth, margin } = r;
  const headerH = 36;
  // background
  r.pdf.setFillColor(r.theme.colors.brandDark[0], r.theme.colors.brandDark[1], r.theme.colors.brandDark[2]);
  r.pdf.rect(0, 0, pageWidth, headerH, "F");
  // accent line
  r.pdf.setFillColor(r.theme.colors.brand[0], r.theme.colors.brand[1], r.theme.colors.brand[2]);
  r.pdf.rect(0, headerH, pageWidth, 1.5, "F");

  r.text(data.title, margin, 16, { size: r.theme.fonts.sizes.h1, style: "bold", color: [255, 255, 255] });
  r.text(data.subtitle, margin, 26, { size: r.theme.fonts.sizes.h2, style: "bold", color: [203, 213, 225] });
  r.textRight(data.metaRight, pageWidth - margin, 30, { size: r.theme.fonts.sizes.tiny, color: [148, 163, 184] });

  // badges (right)
  const badgeH = 10;
  const badgeGap = 4;
  let badgeX = pageWidth - margin;
  const badgeY = 10;
  data.badges
    .slice(0, 3)
    .reverse()
    .forEach((b) => {
      const textW = r.pdf.getTextWidth(b.label) + 8;
      badgeX -= textW;
      const fill: PdfRGB = b.tone === "brand" ? r.theme.colors.brand : [30, 41, 59];
      r.roundedBox(badgeX, badgeY, textW, badgeH, { fill, radius: 2 });
      r.textCenter(b.label, badgeX + textW / 2, badgeY + 7, { size: r.theme.fonts.sizes.tiny, style: "bold", color: [255, 255, 255] });
      badgeX -= badgeGap;
    });

  r.cursorY = headerH + 10;
}

export function drawKpiRow(
  r: PdfRenderer,
  kpis: Array<{ label: string; value: string; tone: "neutral" | "success" | "danger" | "brand" | "warn" }>
) {
  const { margin, contentWidth } = r;
  const h = 26;
  const gap = r.theme.page.gutter;
  const w = (contentWidth - gap * (kpis.length - 1)) / kpis.length;
  r.ensureSpace(h + 4);

  kpis.forEach((k, i) => {
    const x = margin + i * (w + gap);
    const bg = r.theme.colors.surfaceAlt;
    r.roundedBox(x, r.cursorY, w, h, { fill: bg, stroke: r.theme.colors.border, radius: r.theme.radius.md });
    r.text(k.label.toUpperCase(), x + 6, r.cursorY + 8, { size: r.theme.fonts.sizes.tiny, style: "bold", color: r.theme.colors.muted });

    const toneColor =
      k.tone === "success"
        ? r.theme.colors.success
        : k.tone === "danger"
          ? r.theme.colors.danger
          : k.tone === "brand"
            ? r.theme.colors.brand
            : k.tone === "warn"
              ? r.theme.colors.warn
              : r.theme.colors.ink;
    r.text(k.value, x + 6, r.cursorY + 18, { size: 12, style: "bold", color: toneColor });
  });

  r.cursorY += h + 10;
}

export function drawTwoColumnCards(
  r: PdfRenderer,
  cards: Array<{ title: string; rows: Array<{ label: string; value: string; emphasis?: boolean }> }>
) {
  const { margin, contentWidth } = r;
  const gap = 10;
  const colW = (contentWidth - gap) / 2;
  const boxPadX = 8;
  const rowH = 10;

  const calcHeight = (rows: number) => 16 + rows * rowH + 8;
  const h = Math.max(calcHeight(cards[0]?.rows.length ?? 0), calcHeight(cards[1]?.rows.length ?? 0));

  r.ensureSpace(h + 6);

  cards.slice(0, 2).forEach((card, i) => {
    const x = margin + i * (colW + gap);
    r.roundedBox(x, r.cursorY, colW, h, { fill: r.theme.colors.surface, stroke: r.theme.colors.border, radius: r.theme.radius.lg });
    r.text(card.title.toUpperCase(), x + boxPadX, r.cursorY + 12, { size: r.theme.fonts.sizes.small, style: "bold", color: r.theme.colors.ink });
    r.line(x + boxPadX, r.cursorY + 15, x + colW - boxPadX, r.cursorY + 15);

    let y = r.cursorY + 26;
    card.rows.forEach((row) => {
      r.text(row.label, x + boxPadX, y, { size: r.theme.fonts.sizes.body, color: r.theme.colors.muted });
      r.textRight(row.value, x + colW - boxPadX, y, {
        size: r.theme.fonts.sizes.body,
        style: row.emphasis ? "bold" : "normal",
        color: r.theme.colors.ink,
      });
      y += rowH;
    });
  });

  r.cursorY += h + 10;
}

export function drawTable(
  r: PdfRenderer,
  opts: {
    title: string;
    headers: string[];
    rows: Array<string[]>;
    colWidths: number[]; // in mm, must sum <= contentWidth
    highlightRowIndex?: number;
  }
) {
  const { margin } = r;
  const padX = 6;
  const rowH = 8;
  const headerH = 9;
  const boxPadY = 10;

  const w = opts.colWidths.reduce((a, b) => a + b, 0);
  const h = 18 + headerH + opts.rows.length * rowH + boxPadY;

  r.ensureSpace(h + 6);

  r.roundedBox(margin, r.cursorY, w, h, { fill: r.theme.colors.surface, stroke: r.theme.colors.border, radius: r.theme.radius.lg });
  r.text(opts.title.toUpperCase(), margin + padX, r.cursorY + 12, { size: r.theme.fonts.sizes.small, style: "bold", color: r.theme.colors.ink });

  // header
  const headerY = r.cursorY + 18;
  r.pdf.setFillColor(r.theme.colors.surfaceAlt[0], r.theme.colors.surfaceAlt[1], r.theme.colors.surfaceAlt[2]);
  r.pdf.rect(margin + 2, headerY, w - 4, headerH, "F");

  let x = margin + padX;
  opts.headers.forEach((hText, i) => {
    r.text(hText, x, headerY + 6.2, { size: r.theme.fonts.sizes.tiny, style: "bold", color: r.theme.colors.muted });
    x += opts.colWidths[i];
  });

  // rows
  let y = headerY + headerH + 6;
  opts.rows.forEach((row, idx) => {
    if (opts.highlightRowIndex === idx) {
      r.pdf.setFillColor(239, 246, 255);
      r.pdf.rect(margin + 2, y - 5.5, w - 4, rowH, "F");
    }

    let cx = margin + padX;
    row.forEach((cell, i) => {
      const isNumericCol = i > 0;
      if (isNumericCol) {
        r.textRight(cell, cx + opts.colWidths[i] - 2, y, { size: r.theme.fonts.sizes.tiny, color: r.theme.colors.ink });
      } else {
        r.text(cell, cx, y, { size: r.theme.fonts.sizes.tiny, color: r.theme.colors.ink });
      }
      cx += opts.colWidths[i];
    });
    y += rowH;
  });

  r.cursorY += h + 10;
}

export function drawParagraphBox(r: PdfRenderer, opts: { title: string; text: string; maxLines?: number }) {
  const { margin, contentWidth } = r;
  const padX = 8;
  const padY = 10;
  const maxLines = opts.maxLines ?? 18;
  const lines = r.wrapText(opts.text, contentWidth - padX * 2, { size: r.theme.fonts.sizes.body });
  const clamped = lines.slice(0, maxLines);
  const lineH = 4.5;
  const h = padY + 10 + clamped.length * lineH + 8;

  r.ensureSpace(h + 6);
  r.roundedBox(margin, r.cursorY, contentWidth, h, { fill: r.theme.colors.surfaceAlt, stroke: r.theme.colors.border, radius: r.theme.radius.lg });
  r.text(opts.title.toUpperCase(), margin + padX, r.cursorY + 12, { size: r.theme.fonts.sizes.small, style: "bold", color: r.theme.colors.ink });

  let y = r.cursorY + 22;
  clamped.forEach((ln) => {
    r.text(ln, margin + padX, y, { size: r.theme.fonts.sizes.body, color: r.theme.colors.muted });
    y += lineH;
  });

  r.cursorY += h + 10;
}

export function drawFooterWithPageNumbers(r: PdfRenderer, opts: { brandLeft: string }) {
  const totalPages = r.pdf.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    r.pdf.setPage(p);
    const y = r.pageHeight - 10;
    r.line(r.margin, y - 5, r.pageWidth - r.margin, y - 5, { color: r.theme.colors.border, width: 0.3 });
    // brand pill
    r.roundedBox(r.margin, y - 3.5, 24, 8, { fill: r.theme.colors.brandDark, radius: 2 });
    r.textCenter(opts.brandLeft, r.margin + 12, y + 2, { size: r.theme.fonts.sizes.tiny, style: "bold", color: [255, 255, 255] });

    r.textCenter("Relatório gerado automaticamente", r.pageWidth / 2, y + 1, { size: r.theme.fonts.sizes.tiny, color: r.theme.colors.muted });
    r.textRight(`Página ${p} de ${totalPages}`, r.pageWidth - r.margin, y + 1, { size: r.theme.fonts.sizes.tiny, color: r.theme.colors.muted });
  }
}
