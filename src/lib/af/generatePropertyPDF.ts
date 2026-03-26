import jsPDF from 'jspdf';
import { AFPropertyData } from '@/types/apartamentosFortaleza';

const PRIMARY = '#0C7B8E';
const ACCENT = '#E8562A';
const DARK = '#061018';
const LIGHT_BG = '#F0F8FA';

// Convert hex to RGB
function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

// Load image as base64
async function loadImageAsBase64(src: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      } else {
        resolve('');
      }
    };
    img.onerror = () => resolve('');
    img.src = src;
  });
}

// Draw a filled rounded rectangle
function roundedRect(
  doc: jsPDF, x: number, y: number, w: number, h: number, r: number,
  fillColor?: [number, number, number], strokeColor?: [number, number, number]
) {
  if (fillColor) {
    doc.setFillColor(...fillColor);
  }
  if (strokeColor) {
    doc.setDrawColor(...strokeColor);
  }
  if (fillColor && !strokeColor) {
    doc.roundedRect(x, y, w, h, r, r, 'F');
  } else if (!fillColor && strokeColor) {
    doc.roundedRect(x, y, w, h, r, r, 'S');
  } else if (fillColor && strokeColor) {
    doc.roundedRect(x, y, w, h, r, r, 'FD');
  }
}

// Word-wrap text helper
function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (doc.getTextWidth(test) <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function formatCurrency(value: number): string {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export async function generateAFPropertyPDF(
  data: AFPropertyData,
  photos: string[],
  logoSrc: string
): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PW = 210; // page width
  const PH = 297; // page height
  const M = 14;   // margin
  const CW = PW - M * 2; // content width

  const logo64 = await loadImageAsBase64(logoSrc);
  const photo64s = await Promise.all(photos.slice(0, 8).map(p => loadImageAsBase64(p)));

  const primaryRgb = hexToRgb(PRIMARY);
  const accentRgb = hexToRgb(ACCENT);
  const darkRgb = hexToRgb(DARK);

  // ─────────────────────────────────────────────────────
  // PAGE 1 — CAPA EMOCIONAL (Hero)
  // ─────────────────────────────────────────────────────
  {
    // Full dark background
    doc.setFillColor(...darkRgb);
    doc.rect(0, 0, PW, PH, 'F');

    // Hero photo (full bleed top half)
    if (photo64s[0]) {
      doc.addImage(photo64s[0], 'JPEG', 0, 0, PW, 155, '', 'FAST');
      // Dark overlay gradient simulation
      doc.setFillColor(6, 16, 24);
      doc.setGState(doc.GState({ opacity: 0.45 }));
      doc.rect(0, 0, PW, 155, 'F');
      doc.setGState(doc.GState({ opacity: 1 }));
    } else {
      doc.setFillColor(...primaryRgb);
      doc.rect(0, 0, PW, 155, 'F');
    }

    // Gradient fade bottom of hero
    for (let i = 0; i < 40; i++) {
      const alpha = i / 40;
      doc.setFillColor(6, 16, 24);
      doc.setGState(doc.GState({ opacity: alpha * 0.95 }));
      doc.rect(0, 115 + i, PW, 1, 'F');
    }
    doc.setGState(doc.GState({ opacity: 1 }));

    // Logo top left
    if (logo64) {
      doc.addImage(logo64, 'PNG', M, 12, 52, 20, '', 'FAST');
    }

    // CRECI badge top right
    if (data.creci) {
      doc.setFillColor(255, 255, 255, 0.15);
      doc.setFillColor(0, 0, 0);
      doc.setGState(doc.GState({ opacity: 0.35 }));
      roundedRect(doc, PW - M - 52, 13, 52, 9, 2, [255, 255, 255]);
      doc.setGState(doc.GState({ opacity: 1 }));
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(6, 16, 24);
      doc.text(`CRECI ${data.creci}`, PW - M - 26, 18.5, { align: 'center' });
    }

    // Main headline area
    const headlineY = 88;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    const title = data.title || 'Seu Novo Lar em Fortaleza';
    const titleLines = wrapText(doc, title, PW - 28);
    titleLines.forEach((line, i) => {
      doc.text(line, M, headlineY + i * 11);
    });

    // Location pill
    const loc = [data.neighborhood, data.city || 'Fortaleza', data.state || 'CE'].filter(Boolean).join(' • ');
    if (loc) {
      const locW = doc.getTextWidth(loc) + 10;
      roundedRect(doc, M, headlineY + titleLines.length * 11 + 4, locW, 8, 3, [12, 123, 142]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(loc, M + 5, headlineY + titleLines.length * 11 + 9.2);
    }

    // ── EMOTIONAL HOOK SECTION ──
    const hookY = 162;
    doc.setFillColor(12, 123, 142);
    doc.rect(0, hookY - 2, 4, 38, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('Imagine acordar assim todos os dias.', M + 6, hookY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(180, 200, 210);
    const hook = 'Este não é apenas um apartamento — é o espaço onde sua família vai criar memórias que durarão para sempre. Um lugar onde seus filhos vão crescer, onde você vai receber amigos, onde o seu futuro começa.';
    const hookLines = wrapText(doc, hook, CW - 6);
    hookLines.forEach((line, i) => {
      doc.text(line, M + 6, hookY + 18 + i * 5.5);
    });

    // ── SPECS STRIP ──
    const specY = 215;
    roundedRect(doc, M, specY, CW, 28, 5, [17, 30, 38]);

    const specs = [
      { icon: '🛏', label: data.bedrooms > 0 ? `${data.bedrooms} Quarto${data.bedrooms > 1 ? 's' : ''}` : '—' },
      { icon: '🚿', label: data.bathrooms > 0 ? `${data.bathrooms} Banheiro${data.bathrooms > 1 ? 's' : ''}` : '—' },
      { icon: '📐', label: data.area > 0 ? `${data.area}m²` : '—' },
      { icon: '🚗', label: data.garageSpaces > 0 ? `${data.garageSpaces} Vaga${data.garageSpaces > 1 ? 's' : ''}` : '—' },
      { icon: '🏠', label: data.suites > 0 ? `${data.suites} Suíte${data.suites > 1 ? 's' : ''}` : data.furnished ? 'Mobiliado' : '—' },
    ].filter(s => s.label !== '—');

    const specColW = CW / Math.min(specs.length, 5);
    specs.slice(0, 5).forEach((spec, i) => {
      const sx = M + i * specColW + specColW / 2;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text(spec.icon, sx, specY + 11, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(180, 210, 220);
      doc.text(spec.label, sx, specY + 21, { align: 'center' });
    });

    // ── PRICE SECTION ──
    const priceY = 252;
    const price = data.isRental ? data.rentalPrice : data.salePrice;

    roundedRect(doc, M, priceY, CW, 28, 5, [232, 86, 42]);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(255, 220, 200);
    doc.text(data.isRental ? 'VALOR DO ALUGUEL' : 'VALOR DE VENDA', M + 12, priceY + 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text(price > 0 ? formatCurrency(price) : 'Consulte o valor', M + 12, priceY + 20);

    if (!data.isRental) {
      const badges = [];
      if (data.acceptsFinancing) badges.push('✓ Aceita Financiamento');
      if (data.acceptsFGTS) badges.push('✓ Aceita FGTS');
      if (data.subsidy > 0) badges.push(`✓ Subsídio de até ${formatCurrency(data.subsidy)}`);
      if (badges.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(255, 230, 215);
        doc.text(badges.join('   '), PW - M, priceY + 20, { align: 'right' });
      }
    }

    // ── BROKER FOOTER ──
    const footY = 286;
    doc.setDrawColor(30, 55, 65);
    doc.line(M, footY - 2, PW - M, footY - 2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 160, 175);
    if (data.brokerName) doc.text(data.brokerName, M, footY + 4);
    if (data.brokerPhone) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 130, 145);
      doc.text(data.brokerPhone, M, footY + 9);
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(60, 100, 115);
    doc.text('Apartamentos Fortaleza', PW - M, footY + 4, { align: 'right' });
    doc.text('www.apartamentosfortaleza.com.br', PW - M, footY + 9, { align: 'right' });
  }

  // ─────────────────────────────────────────────────────
  // PAGE 2 — GALERIA DE FOTOS + LIFESTYLE
  // ─────────────────────────────────────────────────────
  doc.addPage();
  {
    doc.setFillColor(...darkRgb);
    doc.rect(0, 0, PW, PH, 'F');

    // Header bar
    roundedRect(doc, 0, 0, PW, 22, 0, primaryRgb);
    if (logo64) doc.addImage(logo64, 'PNG', M, 3, 40, 16, '', 'FAST');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('GALERIA DO IMÓVEL', PW - M, 14, { align: 'right' });

    // Section title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('Cada detalhe pensado', M, 38);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 170, 185);
    doc.text('para o conforto da sua família.', M, 45);

    // Accent line
    doc.setFillColor(...accentRgb);
    doc.rect(M, 48, 30, 1.5, 'F');

    // Photo grid — 2 columns, up to 4 rows
    const photoArr = photo64s.filter(Boolean);
    const cols = 2;
    const gridW = (CW - 4) / cols;
    const gridH = 46;
    const startY = 54;

    photoArr.slice(0, 6).forEach((p64, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const px = M + col * (gridW + 4);
      const py = startY + row * (gridH + 4);
      roundedRect(doc, px, py, gridW, gridH, 3, [20, 40, 50]);
      if (p64) {
        doc.addImage(p64, 'JPEG', px, py, gridW, gridH, '', 'FAST');
        // subtle dark border
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.roundedRect(px, py, gridW, gridH, 3, 3, 'S');
      }
    });

    // Lifestyle emotional band
    const bandY = startY + Math.min(Math.ceil(photoArr.length / 2), 3) * (gridH + 4) + 6;
    roundedRect(doc, M, bandY, CW, 52, 5, [8, 24, 32]);

    doc.setFillColor(...primaryRgb);
    doc.rect(M, bandY, 3, 52, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text('"O lugar certo para criar', M + 10, bandY + 14);
    doc.text('os melhores momentos da vida."', M + 10, bandY + 24);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(150, 190, 205);
    const lifestyleText = 'Famílias que escolhem Fortaleza escolhem qualidade de vida, segurança para os filhos, e um futuro sólido. Este imóvel foi pensado para ser o lar onde as histórias mais bonitas são escritas.';
    const lifeLines = wrapText(doc, lifestyleText, CW - 16);
    lifeLines.forEach((line, i) => {
      doc.text(line, M + 10, bandY + 34 + i * 5);
    });

    // Bottom features checklist
    const checkY = bandY + 60;
    if (checkY < PH - 20) {
      const leisure = data.leisureItems ? data.leisureItems.split('\n').filter(Boolean) : [];
      const features = [
        ...(data.rooms ? data.rooms.split('\n').filter(Boolean) : []),
        ...leisure,
        data.furnished ? 'Apartamento Mobiliado' : '',
        data.condominiumFee > 0 ? `Condomínio: ${formatCurrency(data.condominiumFee)}/mês` : '',
      ].filter(Boolean).slice(0, 8);

      if (features.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(12, 200, 180);
        doc.text('AMBIENTES & LAZER', M, checkY);

        const halfLen = Math.ceil(features.length / 2);
        const col1 = features.slice(0, halfLen);
        const col2 = features.slice(halfLen);

        col1.forEach((f, i) => {
          roundedRect(doc, M, checkY + 6 + i * 9, 3, 3, 1, accentRgb);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(200, 220, 228);
          doc.text(f, M + 6, checkY + 9.5 + i * 9);
        });

        col2.forEach((f, i) => {
          roundedRect(doc, M + CW / 2, checkY + 6 + i * 9, 3, 3, 1, accentRgb);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(200, 220, 228);
          doc.text(f, M + CW / 2 + 6, checkY + 9.5 + i * 9);
        });
      }
    }

    // Page footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(50, 90, 105);
    doc.text(`${data.title || 'Apartamentos Fortaleza'} — Página 2`, PW / 2, PH - 6, { align: 'center' });
  }

  // ─────────────────────────────────────────────────────
  // PAGE 3 — LOCALIZAÇÃO + FINANCEIRO + CTA
  // ─────────────────────────────────────────────────────
  doc.addPage();
  {
    doc.setFillColor(...darkRgb);
    doc.rect(0, 0, PW, PH, 'F');

    // Header bar
    roundedRect(doc, 0, 0, PW, 22, 0, primaryRgb);
    if (logo64) doc.addImage(logo64, 'PNG', M, 3, 40, 16, '', 'FAST');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('LOCALIZAÇÃO & INVESTIMENTO', PW - M, 14, { align: 'right' });

    let curY = 32;

    // ── Location block ──
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(255, 255, 255);
    doc.text('📍 Localização Privilegiada', M, curY + 8);
    doc.setFillColor(...accentRgb);
    doc.rect(M, curY + 11, 28, 1.5, 'F');
    curY += 18;

    roundedRect(doc, M, curY, CW, 38, 5, [10, 28, 36]);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(12, 200, 180);
    doc.text(data.neighborhood || 'Fortaleza', M + 10, curY + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(180, 210, 220);
    if (data.address) doc.text(data.address, M + 10, curY + 21);
    if (data.referencePoint) {
      doc.setFontSize(8);
      doc.setTextColor(120, 165, 180);
      doc.text(`Próximo a: ${data.referencePoint}`, M + 10, curY + 29);
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(12, 123, 142);
    doc.text(`${data.city || 'Fortaleza'} – ${data.state || 'CE'}`, PW - M - 4, curY + 12, { align: 'right' });

    curY += 46;

    // ── Why Fortaleza section ──
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text('Por que investir em Fortaleza?', M, curY + 6);
    curY += 12;

    const reasons = [
      { title: '☀️ Qualidade de Vida', desc: 'Praias, gastronomia e clima tropical o ano todo para sua família.' },
      { title: '📈 Valorização Real', desc: 'Mercado imobiliário em crescimento constante, com forte demanda.' },
      { title: '🏫 Infraestrutura Completa', desc: 'Escolas, hospitais, shoppings e lazer ao alcance.' },
      { title: '✈️ Polo de Negócios', desc: 'Hub de turismo e negócios do Nordeste em expansão.' },
    ];

    reasons.forEach((r, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const rx = M + col * (CW / 2 + 2);
      const ry = curY + row * 28;
      roundedRect(doc, rx, ry, CW / 2 - 2, 25, 4, [12, 32, 42]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.text(r.title, rx + 6, ry + 9);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(130, 175, 190);
      const descLines = wrapText(doc, r.desc, CW / 2 - 14);
      descLines.forEach((line, li) => {
        doc.text(line, rx + 6, ry + 16 + li * 4.5);
      });
    });

    curY += 60;

    // ── Financial breakdown ──
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text('💰 Investimento Detalhado', M, curY + 6);
    doc.setFillColor(...accentRgb);
    doc.rect(M, curY + 9, 24, 1.5, 'F');
    curY += 14;

    roundedRect(doc, M, curY, CW, 44, 5, [10, 28, 36]);

    const price = data.isRental ? data.rentalPrice : data.salePrice;
    const financialItems = [
      { label: data.isRental ? 'Aluguel Mensal' : 'Valor de Venda', value: price > 0 ? formatCurrency(price) : 'Consultar', highlight: true },
      ...(data.condominiumFee > 0 ? [{ label: 'Condomínio', value: formatCurrency(data.condominiumFee) + '/mês', highlight: false }] : []),
      ...(data.iptu > 0 ? [{ label: 'IPTU', value: formatCurrency(data.iptu) + '/ano', highlight: false }] : []),
      ...(data.subsidy > 0 ? [{ label: 'Subsídio Disponível', value: `até ${formatCurrency(data.subsidy)}`, highlight: false }] : []),
    ];

    const colFinW = CW / Math.min(financialItems.length, 4);
    financialItems.slice(0, 4).forEach((item, i) => {
      const fx = M + i * colFinW + colFinW / 2;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 160, 175);
      doc.text(item.label, fx, curY + 12, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(item.highlight ? 11 : 9);
      doc.setTextColor(item.highlight ? 232 : 200, item.highlight ? 86 : 220, item.highlight ? 42 : 228);
      doc.text(item.value, fx, curY + 24, { align: 'center' });
      if (i < financialItems.length - 1) {
        doc.setDrawColor(30, 55, 65);
        doc.line(M + (i + 1) * colFinW, curY + 6, M + (i + 1) * colFinW, curY + 38);
      }
    });

    // Financing badges
    const badgeY = curY + 46;
    const badges = [];
    if (data.acceptsFinancing) badges.push('✓ Aceita Financiamento');
    if (data.acceptsFGTS) badges.push('✓ Aceita FGTS');
    if (data.cashOnly) badges.push('💰 Melhor preço à vista');

    badges.forEach((badge, i) => {
      const bw = doc.getTextWidth(badge) + 12;
      roundedRect(doc, M + i * (bw + 4), badgeY, bw, 9, 2, primaryRgb);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(badge, M + i * (bw + 4) + bw / 2, badgeY + 6.2, { align: 'center' });
    });

    curY = badgeY + 16;

    // ── EMOTIONAL CTA ──
    roundedRect(doc, M, curY, CW, 54, 6, [16, 36, 48]);

    // Vertical accent bar
    doc.setFillColor(...accentRgb);
    doc.rect(M, curY, 4, 54, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(255, 255, 255);
    doc.text('Não deixe essa oportunidade passar.', M + 12, curY + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(160, 200, 215);
    const ctaText = 'Os melhores imóveis não ficam disponíveis por muito tempo. Entre em contato agora e agende uma visita presencial — veja com os seus próprios olhos o lugar onde sua família merece viver.';
    const ctaLines = wrapText(doc, ctaText, CW - 18);
    ctaLines.forEach((line, i) => {
      doc.text(line, M + 12, curY + 23 + i * 5.2);
    });

    // WhatsApp CTA button
    const ctaBtnY = curY + 38;
    const ctaBtnW = 90;
    roundedRect(doc, M + 12, ctaBtnY, ctaBtnW, 11, 3, accentRgb);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('📲 Falar com Corretor', M + 12 + ctaBtnW / 2, ctaBtnY + 7.5, { align: 'center' });

    if (data.brokerPhone) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 180, 195);
      doc.text(data.brokerPhone, M + 12 + ctaBtnW + 8, ctaBtnY + 7.5);
    }

    // Final footer
    doc.setDrawColor(20, 45, 58);
    doc.line(M, PH - 14, PW - M, PH - 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(50, 90, 105);
    doc.text('Apartamentos Fortaleza — Material de apresentação exclusivo.', M, PH - 8);
    doc.text('Página 3', PW - M, PH - 8, { align: 'right' });
  }

  // ─────────────────────────────────────────────────────
  // PAGE 4 — GALERIA EXTRA (if more photos)
  // ─────────────────────────────────────────────────────
  if (photo64s.length > 6) {
    doc.addPage();
    doc.setFillColor(...darkRgb);
    doc.rect(0, 0, PW, PH, 'F');

    roundedRect(doc, 0, 0, PW, 22, 0, primaryRgb);
    if (logo64) doc.addImage(logo64, 'PNG', M, 3, 40, 16, '', 'FAST');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('MAIS FOTOS DO IMÓVEL', PW - M, 14, { align: 'right' });

    const extraPhotos = photo64s.slice(6);
    const eGridW = (CW - 4) / 2;
    const eGridH = 52;
    extraPhotos.slice(0, 4).forEach((p64, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const px = M + col * (eGridW + 4);
      const py = 28 + row * (eGridH + 4);
      if (p64) {
        doc.addImage(p64, 'JPEG', px, py, eGridW, eGridH, '', 'FAST');
        doc.setDrawColor(20, 50, 65);
        doc.setLineWidth(0.3);
        doc.roundedRect(px, py, eGridW, eGridH, 2, 2, 'S');
      }
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(50, 90, 105);
    doc.text(`${data.title || 'Apartamentos Fortaleza'} — Página 4`, PW / 2, PH - 6, { align: 'center' });
  }

  // ─── Save ───────────────────────────────────────────
  const filename = `AF-${(data.title || 'imovel').replace(/\s+/g, '-').toLowerCase()}.pdf`;
  doc.save(filename);
}
