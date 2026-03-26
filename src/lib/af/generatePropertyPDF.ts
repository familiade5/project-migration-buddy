import jsPDF from 'jspdf';
import { AFPropertyData } from '@/types/apartamentosFortaleza';

// ── AM Color Palette ──────────────────────────────────────────────────────────
const AM_BLUE   = '#1B5EA6';
const AM_ORANGE = '#F47920';
const AM_DARK   = '#080e1c';

// ── Helpers ───────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

// Strip characters outside Latin-1/Windows-1252 (removes emoji that cause garbled output)
function safeText(text: string): string {
  return (text || '').replace(/[^\x00-\xFF]/g, '');
}

// Load a photo as JPEG base64 (dark fill for transparency)
async function loadPhoto(src: string): Promise<string> {
  return new Promise((resolve) => {
    const img = document.createElement('img') as HTMLImageElement;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth || 800;
      c.height = img.naturalHeight || 600;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#080e1c';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0);
        resolve(c.toDataURL('image/jpeg', 0.82));
      } else resolve('');
    };
    img.onerror = () => resolve('');
    img.src = src;
  });
}

// Load logo as PNG — transparent background preserved
async function loadLogo(src: string): Promise<string> {
  return new Promise((resolve) => {
    const img = document.createElement('img') as HTMLImageElement;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth || 400;
      c.height = img.naturalHeight || 160;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, c.width, c.height); // keep transparency
        ctx.drawImage(img, 0, 0);
        resolve(c.toDataURL('image/png'));
      } else resolve('');
    };
    img.onerror = () => resolve('');
    img.src = src;
  });
}

function wrapText(doc: jsPDF, text: string, maxW: number): string[] {
  const words = safeText(text).split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (doc.getTextWidth(test) <= maxW) { cur = test; }
    else { if (cur) lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

function brl(value: number): string {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function filledRect(
  doc: jsPDF,
  x: number, y: number, w: number, h: number, r: number,
  fill: [number, number, number],
) {
  doc.setFillColor(...fill);
  if (r > 0) doc.roundedRect(x, y, w, h, r, r, 'F');
  else doc.rect(x, y, w, h, 'F');
}

function pageFooter(doc: jsPDF, data: AFPropertyData, page: number, PW: number, PH: number, M: number, blue: [number,number,number]) {
  const y = PH - 12;
  doc.setDrawColor(...blue);
  doc.setLineWidth(0.4);
  doc.line(M, y, PW - M, y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...blue);
  if (data.brokerName) doc.text(safeText(data.brokerName), M, y + 5);
  if (data.brokerPhone) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 160, 200);
    doc.text(safeText(data.brokerPhone), M, y + 9);
  }
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 140, 185);
  doc.text(`Apartamentos Fortaleza  |  Pagina ${page}`, PW - M, y + 5, { align: 'right' });
  if (data.creci) doc.text(`CRECI ${safeText(data.creci)}`, PW - M, y + 9, { align: 'right' });
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function generateAFPropertyPDF(
  data: AFPropertyData,
  photos: string[],
  logoSrc: string,
): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PW = 210, PH = 297, M = 14, CW = PW - M * 2;

  const blueRgb   = hexToRgb(AM_BLUE);    // [27, 94, 166]
  const orangeRgb = hexToRgb(AM_ORANGE);  // [244, 121, 32]
  const darkRgb   = hexToRgb(AM_DARK);    // [8, 14, 28]
  const dark2: [number,number,number] = [14, 25, 48];
  const dark3: [number,number,number] = [20, 35, 65];

  const logo64    = await loadLogo(logoSrc);
  const photo64s  = await Promise.all(photos.slice(0, 9).map(loadPhoto));
  const price     = data.isRental ? data.rentalPrice : data.salePrice;

  // ════════════════════════════════════════════════════════════
  // PAGE 1 — CAPA
  // ════════════════════════════════════════════════════════════
  {
    // Background
    filledRect(doc, 0, 0, PW, PH, 0, darkRgb);

    // Hero photo (top 150mm)
    if (photo64s[0]) {
      doc.addImage(photo64s[0], 'JPEG', 0, 0, PW, 150, '', 'FAST');
      // Gradient overlay — simulate dark fade at bottom
      for (let i = 0; i < 55; i++) {
        const alpha = (i / 55) * 0.92;
        doc.setFillColor(8, 14, 28);
        doc.setGState(doc.GState({ opacity: alpha }));
        doc.rect(0, 95 + i, PW, 1, 'F');
      }
      doc.setGState(doc.GState({ opacity: 1 }));
    } else {
      filledRect(doc, 0, 0, PW, 150, 0, blueRgb);
    }

    // Orange top stripe
    filledRect(doc, 0, 0, PW, 3, 0, orangeRgb);

    // Logo — top left
    if (logo64) {
      doc.addImage(logo64, 'PNG', M, 7, 56, 22, '', 'FAST');
    }

    // CRECI badge — top right
    if (data.creci) {
      filledRect(doc, PW - M - 46, 8, 46, 8, 2, blueRgb);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(255, 255, 255);
      doc.text(`CRECI ${safeText(data.creci)}`, PW - M - 23, 13.2, { align: 'center' });
    }

    // Property title
    const headY = 92;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(25);
    doc.setTextColor(255, 255, 255);
    const titleLines = wrapText(doc, data.title || 'Seu Apartamento em Fortaleza', CW);
    titleLines.forEach((l, i) => doc.text(l, M, headY + i * 10));

    // Location chip
    const loc = [data.neighborhood, data.city || 'Fortaleza', data.state || 'CE'].filter(Boolean).join(' - ');
    if (loc) {
      const chipY = headY + titleLines.length * 10 + 4;
      const chipW = Math.min(doc.getTextWidth(safeText(loc)) + 12, CW);
      filledRect(doc, M, chipY, chipW, 8, 2, blueRgb);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(safeText(loc), M + 6, chipY + 5.5);
    }

    // ── Orange divider ──
    filledRect(doc, 0, 153, PW, 2, 0, orangeRgb);

    // ── SPECS STRIP (154 – 178) ──
    const specY = 158;
    const specs: { lbl: string; val: string }[] = [];
    if (data.bedrooms  > 0) specs.push({ lbl: 'QUARTOS',   val: String(data.bedrooms) });
    if (data.bathrooms > 0) specs.push({ lbl: 'BANHEIROS', val: String(data.bathrooms) });
    if (data.area      > 0) specs.push({ lbl: 'AREA (m2)', val: String(data.area) });
    if (data.garageSpaces > 0) specs.push({ lbl: 'VAGAS',  val: String(data.garageSpaces) });
    if (data.suites    > 0) specs.push({ lbl: 'SUITES',    val: String(data.suites) });

    if (specs.length > 0) {
      const colW = CW / specs.length;
      specs.forEach((s, i) => {
        const sx = M + i * colW + colW / 2;
        if (i > 0) {
          doc.setDrawColor(30, 50, 80);
          doc.setLineWidth(0.4);
          doc.line(M + i * colW, specY + 2, M + i * colW, specY + 18);
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(...orangeRgb);
        doc.text(s.val, sx, specY + 12, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(130, 165, 210);
        doc.text(s.lbl, sx, specY + 20, { align: 'center' });
      });
    }

    // Blue divider below specs
    filledRect(doc, 0, 182, PW, 1.5, 0, blueRgb);

    // ── PRICE CARD (184 – 215) ──
    const priceY = 186;
    filledRect(doc, M, priceY, CW, 30, 5, orangeRgb);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 220, 185);
    doc.text(data.isRental ? 'VALOR DO ALUGUEL' : 'VALOR DE VENDA', M + 10, priceY + 9);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(23);
    doc.setTextColor(255, 255, 255);
    doc.text(price > 0 ? brl(price) : 'Consulte o valor', M + 10, priceY + 22);

    if (!data.isRental) {
      const badges: string[] = [];
      if (data.acceptsFinancing) badges.push('+ Aceita Financiamento');
      if (data.acceptsFGTS)      badges.push('+ Aceita FGTS');
      if (data.subsidy > 0)      badges.push(`+ Subsidio ate ${brl(data.subsidy)}`);
      if (badges.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.8);
        doc.setTextColor(255, 235, 210);
        doc.text(badges.join('   '), PW - M - 4, priceY + 27, { align: 'right' });
      }
    }

    // Condominium info
    if (data.condominiumFee > 0) {
      filledRect(doc, M, priceY + 33, CW, 11, 3, dark2);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(150, 185, 220);
      doc.text(`Condominio: ${brl(data.condominiumFee)}/mes`, M + 8, priceY + 40);
      if (data.iptu > 0) {
        doc.text(`IPTU: ${brl(data.iptu)}/ano`, M + CW / 2, priceY + 40);
      }
    }

    // ── EMOTIONAL HOOK (222 – 262) ──
    const hookY = data.condominiumFee > 0 ? 231 : 222;
    filledRect(doc, M, hookY, 3, 32, 0, orangeRgb);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(255, 255, 255);
    doc.text('O lar onde sua familia escreve os melhores', M + 8, hookY + 9);
    doc.text('capitulos da vida.', M + 8, hookY + 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(160, 195, 225);
    const hookLines = wrapText(doc,
      'Fortaleza oferece qualidade de vida, seguranca e valorizacao real do seu patrimonio. ' +
      'Este apartamento foi pensado para ser mais do que um imovel — e o espaco onde historias sao criadas.',
      CW - 14);
    hookLines.forEach((l, i) => doc.text(l, M + 8, hookY + 26 + i * 5));

    pageFooter(doc, data, 1, PW, PH, M, blueRgb);
  }

  // ════════════════════════════════════════════════════════════
  // PAGE 2 — GALERIA + DETALHES
  // ════════════════════════════════════════════════════════════
  doc.addPage();
  {
    filledRect(doc, 0, 0, PW, PH, 0, darkRgb);

    // Header bar
    filledRect(doc, 0, 0, PW, 22, 0, blueRgb);
    filledRect(doc, 0, 0, PW, 3, 0, orangeRgb);
    if (logo64) doc.addImage(logo64, 'PNG', M, 4, 42, 16, '', 'FAST');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('GALERIA DO IMOVEL', PW - M, 14, { align: 'right' });

    // Section title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(255, 255, 255);
    doc.text('Cada detalhe pensado', M, 34);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(130, 170, 210);
    doc.text('para o conforto da sua familia.', M, 41);
    filledRect(doc, M, 43.5, 26, 1.5, 0, orangeRgb);

    // ── Photo grid 2×3 ──
    const validPhotos = photo64s.filter(Boolean);
    const cols = 2;
    const gW = (CW - 4) / cols;
    const gH = 43;
    const gStartY = 49;

    validPhotos.slice(0, 6).forEach((p64, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const px = M + col * (gW + 4);
      const py = gStartY + row * (gH + 3);
      filledRect(doc, px, py, gW, gH, 3, dark3);
      if (p64) {
        doc.addImage(p64, 'JPEG', px, py, gW, gH, '', 'FAST');
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.25);
        doc.roundedRect(px, py, gW, gH, 3, 3, 'S');
      }
    });

    const rows = Math.min(Math.ceil(validPhotos.length / 2), 3);
    const afterGrid = gStartY + rows * (gH + 3) + 5;

    // ── Lifestyle band ──
    filledRect(doc, M, afterGrid, CW, 46, 4, dark2);
    filledRect(doc, M, afterGrid, 3, 46, 0, blueRgb);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(255, 255, 255);
    doc.text('"O lugar certo para criar os melhores', M + 9, afterGrid + 12);
    doc.text('momentos da vida."', M + 9, afterGrid + 21);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 185, 220);
    const lifeLines = wrapText(doc,
      'Familias que escolhem Fortaleza escolhem qualidade de vida, seguranca e um futuro solido. ' +
      'Este imovel foi pensado para onde as historias mais bonitas sao escritas.',
      CW - 16);
    lifeLines.forEach((l, i) => doc.text(l, M + 9, afterGrid + 30 + i * 4.8));

    // ── Amenities ──
    const ameY = afterGrid + 54;
    const ameItems = [
      ...(data.rooms        ? data.rooms.split('\n').filter(Boolean)        : []),
      ...(data.leisureItems ? data.leisureItems.split('\n').filter(Boolean) : []),
      data.furnished         ? 'Apartamento Mobiliado'                       : '',
      data.condominiumFee > 0 ? `Condominio: ${brl(data.condominiumFee)}/mes` : '',
    ].filter(Boolean).slice(0, 8).map(safeText);

    if (ameItems.length > 0 && ameY + 10 < PH - 25) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...orangeRgb);
      doc.text('AMBIENTES E LAZER', M, ameY);

      const half = Math.ceil(ameItems.length / 2);
      ameItems.forEach((item, i) => {
        const isRight = i >= half;
        const baseX = isRight ? M + CW / 2 : M;
        const row   = isRight ? i - half : i;
        filledRect(doc, baseX, ameY + 5 + row * 9, 2.5, 2.5, 0.5, orangeRgb);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(200, 220, 240);
        doc.text(item, baseX + 6, ameY + 8.8 + row * 9);
      });
    }

    // Property specs summary at bottom
    if (data.floor || data.totalFloors) {
      const sY = PH - 38;
      filledRect(doc, M, sY, CW, 14, 3, dark2);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(160, 195, 225);
      const extras: string[] = [];
      if (data.floor) extras.push(`${safeText(data.floor)}° andar`);
      if (data.totalFloors) extras.push(`${safeText(data.totalFloors)} andares no total`);
      if (data.furnished) extras.push('Mobiliado');
      doc.text(extras.join('  |  '), PW / 2, sY + 9, { align: 'center' });
    }

    pageFooter(doc, data, 2, PW, PH, M, blueRgb);
  }

  // ════════════════════════════════════════════════════════════
  // PAGE 3 — LOCALIZACAO + INVESTIMENTO + CTA
  // ════════════════════════════════════════════════════════════
  doc.addPage();
  {
    filledRect(doc, 0, 0, PW, PH, 0, darkRgb);

    // Header bar
    filledRect(doc, 0, 0, PW, 22, 0, blueRgb);
    filledRect(doc, 0, 0, PW, 3, 0, orangeRgb);
    if (logo64) doc.addImage(logo64, 'PNG', M, 4, 42, 16, '', 'FAST');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('LOCALIZACAO E INVESTIMENTO', PW - M, 14, { align: 'right' });

    let curY = 30;

    // ── Location block ──
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text('Localizacao Privilegiada', M, curY + 6);
    filledRect(doc, M, curY + 9, 22, 1.5, 0, orangeRgb);
    curY += 17;

    filledRect(doc, M, curY, CW, 34, 4, dark2);
    filledRect(doc, M, curY, 3, 34, 0, blueRgb);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(100, 160, 230);
    doc.text(safeText(data.neighborhood || 'Fortaleza - CE'), M + 9, curY + 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(180, 210, 230);
    if (data.address) doc.text(safeText(data.address), M + 9, curY + 19);
    if (data.referencePoint) {
      doc.setFontSize(8);
      doc.setTextColor(120, 160, 195);
      doc.text(`Proximo a: ${safeText(data.referencePoint)}`, M + 9, curY + 27);
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...blueRgb);
    doc.text(`${safeText(data.city || 'Fortaleza')} - ${safeText(data.state || 'CE')}`,
      PW - M - 4, curY + 11, { align: 'right' });

    curY += 42;

    // ── Why Fortaleza ──
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('Por que investir em Fortaleza?', M, curY + 5);
    curY += 12;

    const reasons = [
      { t: 'Qualidade de Vida',       d: 'Praias, gastronomia e clima tropical o ano todo para sua familia.' },
      { t: 'Valorizacao Real',         d: 'Mercado imobiliario em crescimento constante, com forte demanda.' },
      { t: 'Infraestrutura Completa',  d: 'Escolas, hospitais, shoppings e lazer ao alcance de tudo.' },
      { t: 'Polo de Negocios',         d: 'Hub de turismo e negocios do Nordeste em constante expansao.' },
    ];

    reasons.forEach((r, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const rx = M + col * (CW / 2 + 2);
      const ry = curY + row * 27;
      const rW = CW / 2 - 2;
      filledRect(doc, rx, ry, rW, 24, 3, dark2);
      filledRect(doc, rx, ry, 2.5, 24, 0, orangeRgb);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.text(r.t, rx + 7, ry + 9);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(130, 170, 205);
      const dLines = wrapText(doc, r.d, rW - 14);
      dLines.forEach((l, li) => doc.text(l, rx + 7, ry + 15 + li * 4.3));
    });

    curY += 58;

    // ── Financial breakdown ──
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('Investimento Detalhado', M, curY + 5);
    filledRect(doc, M, curY + 8, 20, 1.5, 0, orangeRgb);
    curY += 15;

    filledRect(doc, M, curY, CW, 40, 4, dark2);

    const finItems: { lbl: string; val: string }[] = [
      { lbl: data.isRental ? 'Valor do Aluguel' : 'Valor de Venda', val: price > 0 ? brl(price) : 'A consultar' },
    ];
    if (data.condominiumFee > 0) finItems.push({ lbl: 'Condominio/mes',   val: brl(data.condominiumFee) });
    if (data.iptu > 0)           finItems.push({ lbl: 'IPTU/ano',         val: brl(data.iptu) });

    const fColW = CW / Math.min(finItems.length, 3);
    finItems.slice(0, 3).forEach((f, i) => {
      const fx = M + i * fColW + fColW / 2;
      if (i > 0) {
        doc.setDrawColor(30, 50, 80);
        doc.setLineWidth(0.4);
        doc.line(M + i * fColW, curY + 6, M + i * fColW, curY + 34);
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(130, 165, 205);
      doc.text(safeText(f.lbl).toUpperCase(), fx, curY + 13, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(...orangeRgb);
      doc.text(safeText(f.val), fx, curY + 26, { align: 'center' });
    });

    curY += 48;

    // ── CTA Block ──
    if (curY + 50 < PH - 25) {
      filledRect(doc, M, curY, CW, 50, 5, blueRgb);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text('Agende uma visita agora!', PW / 2, curY + 14, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(200, 220, 245);
      doc.text('Fale diretamente com nosso especialista e garanta', PW / 2, curY + 23, { align: 'center' });
      doc.text('as melhores condicoes para realizar seu sonho.', PW / 2, curY + 30, { align: 'center' });

      if (data.brokerPhone || data.brokerName) {
        filledRect(doc, PW / 2 - 48, curY + 34, 96, 12, 4, [255, 255, 255]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...blueRgb);
        const ctaTxt = safeText(data.brokerPhone || data.brokerName);
        doc.text(ctaTxt, PW / 2, curY + 41.5, { align: 'center' });
      }
    }

    pageFooter(doc, data, 3, PW, PH, M, blueRgb);
  }

  doc.save(`AF-${safeText(data.title || 'imovel').replace(/\s+/g, '-')}.pdf`);
}
