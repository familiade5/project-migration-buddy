import jsPDF from "jspdf";
import type { PdfRGB, PdfTheme } from "./theme";

type Align = "left" | "center" | "right";

export class PdfRenderer {
  readonly pdf: jsPDF;
  readonly theme: PdfTheme;
  readonly pageWidth: number;
  readonly pageHeight: number;
  readonly margin: number;
  readonly contentWidth: number;
  cursorY: number;
  pageIndexStart: number;

  constructor(pdf: jsPDF, theme: PdfTheme) {
    this.pdf = pdf;
    this.theme = theme;
    this.pageWidth = pdf.internal.pageSize.getWidth();
    this.pageHeight = pdf.internal.pageSize.getHeight();
    this.margin = theme.page.margin;
    this.contentWidth = this.pageWidth - this.margin * 2;
    this.cursorY = this.margin;
    this.pageIndexStart = 1;
  }

  // --- page management
  ensureSpace(needed: number, opts?: { headerGap?: number }) {
    const headerGap = opts?.headerGap ?? 0;
    if (this.cursorY + needed > this.pageHeight - this.margin) {
      this.pdf.addPage();
      this.cursorY = this.margin + headerGap;
    }
  }

  // --- primitives
  setText(color: PdfRGB, fontSize: number, fontStyle: "normal" | "bold" = "normal") {
    this.pdf.setFont(this.theme.fonts.family, fontStyle);
    this.pdf.setFontSize(fontSize);
    this.pdf.setTextColor(color[0], color[1], color[2]);
  }

  text(
    value: string,
    x: number,
    y: number,
    opts?: { align?: Align; color?: PdfRGB; size?: number; style?: "normal" | "bold" }
  ) {
    const align = opts?.align ?? "left";
    const color = opts?.color ?? this.theme.colors.ink;
    const size = opts?.size ?? this.theme.fonts.sizes.body;
    const style = opts?.style ?? "normal";
    this.setText(color, size, style);
    this.pdf.text(value, x, y, { align });
  }

  textRight(value: string, rightX: number, y: number, opts?: { color?: PdfRGB; size?: number; style?: "normal" | "bold" }) {
    this.text(value, rightX, y, { ...opts, align: "right" });
  }

  textCenter(value: string, centerX: number, y: number, opts?: { color?: PdfRGB; size?: number; style?: "normal" | "bold" }) {
    this.text(value, centerX, y, { ...opts, align: "center" });
  }

  wrapText(value: string, maxWidth: number, opts?: { size?: number; style?: "normal" | "bold" }) {
    const size = opts?.size ?? this.theme.fonts.sizes.body;
    const style = opts?.style ?? "normal";
    this.setText(this.theme.colors.ink, size, style);
    return this.pdf.splitTextToSize(value, maxWidth) as string[];
  }

  roundedBox(x: number, y: number, w: number, h: number, opts?: { fill?: PdfRGB; stroke?: PdfRGB; radius?: number; lineWidth?: number }) {
    const fill = opts?.fill ?? this.theme.colors.surface;
    const stroke = opts?.stroke;
    const radius = opts?.radius ?? this.theme.radius.md;
    const lineWidth = opts?.lineWidth ?? 0.3;

    this.pdf.setFillColor(fill[0], fill[1], fill[2]);
    if (stroke) {
      this.pdf.setDrawColor(stroke[0], stroke[1], stroke[2]);
      this.pdf.setLineWidth(lineWidth);
      this.pdf.roundedRect(x, y, w, h, radius, radius, "FD");
      return;
    }
    this.pdf.roundedRect(x, y, w, h, radius, radius, "F");
  }

  line(x1: number, y1: number, x2: number, y2: number, opts?: { color?: PdfRGB; width?: number }) {
    const color = opts?.color ?? this.theme.colors.border;
    const width = opts?.width ?? 0.3;
    this.pdf.setDrawColor(color[0], color[1], color[2]);
    this.pdf.setLineWidth(width);
    this.pdf.line(x1, y1, x2, y2);
  }
}
