import jsPDF from 'jspdf';
import { formatCurrency } from './formatCurrency';

interface InvestmentResult {
  purchasePrice: number;
  marketValue: number;
  discount: number;
  discountPercentage: number;
  entryValue: number;
  financedAmount: number;
  table: 'PRICE' | 'SAC';
  interestRate: number;
  termMonths: number;
  holdingPeriod: number;
  monthlyInstallment: number;
  firstInstallment: number;
  lastInstallment: number;
  itbi: number;
  documentation: number;
  brokerage: number;
  renovation: number;
  monthlyExpenses: number;
  totalPaidUntilResale: number;
  totalInterestPaid: number;
  remainingDebtAtResale: number;
  totalInvestment: number;
  estimatedProfit: number;
  totalROI: number;
  monthlyROI: number;
  timelineComparison: Array<{
    month: number;
    profit: number;
    roi: number;
    remainingDebt: number;
    totalPaid: number;
  }>;
  debtEvolution: Array<{
    month: number;
    debt: number;
    paid: number;
  }>;
  paymentBreakdown: Array<{
    month: number;
    amortization: number;
    interest: number;
    installment: number;
  }>;
}

export async function exportInvestmentPDF(result: InvestmentResult, analysisText: string) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  // Color palette - modern professional
  const colors = {
    primary: [17, 24, 39] as [number, number, number],      // gray-900
    secondary: [75, 85, 99] as [number, number, number],    // gray-600
    muted: [156, 163, 175] as [number, number, number],     // gray-400
    light: [243, 244, 246] as [number, number, number],     // gray-100
    white: [255, 255, 255] as [number, number, number],
    success: [34, 197, 94] as [number, number, number],     // green-500
    danger: [239, 68, 68] as [number, number, number],      // red-500
    accent: [59, 130, 246] as [number, number, number],     // blue-500
    gold: [245, 158, 11] as [number, number, number],       // amber-500
  };

  // Helper functions
  const addText = (text: string, x: number, yPos: number, options?: { 
    fontSize?: number; 
    fontStyle?: 'normal' | 'bold'; 
    color?: [number, number, number];
    align?: 'left' | 'center' | 'right';
  }) => {
    const { fontSize = 10, fontStyle = 'normal', color = colors.primary, align = 'left' } = options || {};
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontStyle);
    pdf.setTextColor(color[0], color[1], color[2]);
    
    let alignX = x;
    if (align === 'center') alignX = pageWidth / 2;
    if (align === 'right') alignX = pageWidth - margin;
    
    pdf.text(text, alignX, yPos, { align });
  };

  const checkNewPage = (neededSpace: number) => {
    if (y + neededSpace > pageHeight - margin) {
      pdf.addPage();
      y = margin + 10;
      return true;
    }
    return false;
  };

  const drawRoundedRect = (x: number, yPos: number, w: number, h: number, r: number, fill: [number, number, number], stroke?: [number, number, number]) => {
    pdf.setFillColor(fill[0], fill[1], fill[2]);
    if (stroke) {
      pdf.setDrawColor(stroke[0], stroke[1], stroke[2]);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(x, yPos, w, h, r, r, 'FD');
    } else {
      pdf.roundedRect(x, yPos, w, h, r, r, 'F');
    }
  };

  // === MODERN HEADER WITH GRADIENT EFFECT ===
  // Dark header bar
  pdf.setFillColor(17, 24, 39);
  pdf.rect(0, 0, pageWidth, 50, 'F');
  
  // Subtle accent line
  pdf.setFillColor(59, 130, 246);
  pdf.rect(0, 50, pageWidth, 2, 'F');
  
  // Header content
  addText('ANÁLISE DE INVESTIMENTO', margin, 20, { 
    fontSize: 22, fontStyle: 'bold', color: colors.white 
  });
  addText('IMOBILIÁRIO', margin, 30, { 
    fontSize: 22, fontStyle: 'bold', color: [156, 163, 175]
  });
  
  // Header badges
  const badgeY = 18;
  const badgeX = pageWidth - margin - 75;
  
  // Period badge
  drawRoundedRect(badgeX, badgeY - 5, 35, 14, 2, [31, 41, 55]);
  addText(`${result.holdingPeriod}m`, badgeX + 17.5, badgeY + 4, { 
    fontSize: 10, fontStyle: 'bold', color: colors.white, align: 'center' 
  });
  
  // System badge
  drawRoundedRect(badgeX + 40, badgeY - 5, 35, 14, 2, [59, 130, 246]);
  addText(result.table, badgeX + 57.5, badgeY + 4, { 
    fontSize: 10, fontStyle: 'bold', color: colors.white, align: 'center' 
  });
  
  // Date
  addText(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - margin, 42, { 
    fontSize: 8, color: colors.muted, align: 'right' 
  });

  y = 65;

  // === MAIN KPI CARDS ===
  const cardWidth = (contentWidth - 12) / 4;
  const cardHeight = 38;
  const isPositive = result.totalROI > 0;
  
  // Card 1: Lucro Estimado
  drawRoundedRect(margin, y, cardWidth, cardHeight, 4, isPositive ? [240, 253, 244] : [254, 242, 242]);
  addText('LUCRO ESTIMADO', margin + 6, y + 10, { fontSize: 7, fontStyle: 'bold', color: colors.secondary });
  addText(formatCurrency(result.estimatedProfit), margin + 6, y + 24, { 
    fontSize: 14, fontStyle: 'bold', color: isPositive ? colors.success : colors.danger 
  });
  // Mini icon indicator
  pdf.setFillColor(isPositive ? 34 : 239, isPositive ? 197 : 68, isPositive ? 94 : 68);
  pdf.circle(margin + cardWidth - 10, y + 10, 3, 'F');
  
  // Card 2: ROI Total
  drawRoundedRect(margin + cardWidth + 4, y, cardWidth, cardHeight, 4, [239, 246, 255]);
  addText('ROI TOTAL', margin + cardWidth + 10, y + 10, { fontSize: 7, fontStyle: 'bold', color: colors.secondary });
  addText(`${result.totalROI.toFixed(1)}%`, margin + cardWidth + 10, y + 24, { 
    fontSize: 14, fontStyle: 'bold', color: colors.accent 
  });
  
  // Card 3: ROI Mensal
  drawRoundedRect(margin + (cardWidth + 4) * 2, y, cardWidth, cardHeight, 4, colors.light);
  addText('ROI MENSAL', margin + (cardWidth + 4) * 2 + 6, y + 10, { fontSize: 7, fontStyle: 'bold', color: colors.secondary });
  addText(`${result.monthlyROI.toFixed(2)}%`, margin + (cardWidth + 4) * 2 + 6, y + 24, { 
    fontSize: 14, fontStyle: 'bold', color: colors.primary 
  });
  
  // Card 4: Desconto
  drawRoundedRect(margin + (cardWidth + 4) * 3, y, cardWidth, cardHeight, 4, [255, 251, 235]);
  addText('DESCONTO', margin + (cardWidth + 4) * 3 + 6, y + 10, { fontSize: 7, fontStyle: 'bold', color: colors.secondary });
  addText(`${result.discountPercentage.toFixed(1)}%`, margin + (cardWidth + 4) * 3 + 6, y + 24, { 
    fontSize: 14, fontStyle: 'bold', color: colors.gold 
  });

  y += cardHeight + 15;

  // === VISUAL CHARTS SECTION ===
  // Profit Timeline Chart (Bar chart visualization)
  const chartWidth = (contentWidth - 8) / 2;
  const chartHeight = 55;
  
  // Chart 1: Profit by Timeline
  drawRoundedRect(margin, y, chartWidth, chartHeight + 30, 4, colors.white, [229, 231, 235]);
  addText('LUCRO POR PRAZO', margin + 8, y + 12, { fontSize: 9, fontStyle: 'bold', color: colors.primary });
  
  // Draw bars
  const barChartY = y + 22;
  const barChartHeight = 38;
  const barWidth = (chartWidth - 24) / result.timelineComparison.length;
  const maxProfit = Math.max(...result.timelineComparison.map(t => Math.abs(t.profit)));
  
  result.timelineComparison.forEach((item, idx) => {
    const barX = margin + 12 + (idx * barWidth);
    const barH = Math.max(3, Math.abs(item.profit) / maxProfit * (barChartHeight - 8));
    const barY = barChartY + barChartHeight - barH - 3;
    
    const isSelected = item.month === result.holdingPeriod;
    const barColor = item.profit >= 0 ? (isSelected ? colors.success : [134, 239, 172] as [number, number, number]) : colors.danger;
    
    pdf.setFillColor(barColor[0], barColor[1], barColor[2]);
    pdf.roundedRect(barX + 1, barY, barWidth - 2, barH, 1, 1, 'F');
    
    // Month label - only show every other for readability if more than 6 items
    if (result.timelineComparison.length <= 6 || idx % 2 === 0 || isSelected) {
      addText(`${item.month}`, barX + barWidth/2, barChartY + barChartHeight + 5, { 
        fontSize: 5, color: isSelected ? colors.primary : colors.muted, fontStyle: isSelected ? 'bold' : 'normal', align: 'center' 
      });
    }
    
    // Selected indicator
    if (isSelected) {
      pdf.setFillColor(17, 24, 39);
      pdf.circle(barX + barWidth/2, barY - 2, 1.5, 'F');
    }
  });

  // Chart 2: Investment Breakdown (Donut visualization)
  const donutX = margin + chartWidth + 8;
  drawRoundedRect(donutX, y, chartWidth, chartHeight + 30, 4, colors.white, [229, 231, 235]);
  addText('COMPOSIÇÃO DO INVESTIMENTO', donutX + 8, y + 12, { fontSize: 9, fontStyle: 'bold', color: colors.primary });
  
  // Draw pie/donut segments
  const centerX = donutX + 38;
  const centerY = y + 52;
  const radius = 20;
  const innerRadius = 11;
  
  const totalCosts = result.entryValue + result.itbi + result.documentation + result.renovation + (result.monthlyExpenses * result.holdingPeriod);
  const segments = [
    { label: 'Entrada', value: result.entryValue, color: [59, 130, 246] as [number, number, number] },
    { label: 'ITBI', value: result.itbi, color: [147, 51, 234] as [number, number, number] },
    { label: 'Documentação', value: result.documentation, color: [236, 72, 153] as [number, number, number] },
    { label: 'Reforma', value: result.renovation, color: [245, 158, 11] as [number, number, number] },
    { label: 'Despesas', value: result.monthlyExpenses * result.holdingPeriod, color: [34, 197, 94] as [number, number, number] },
  ].filter(s => s.value > 0);
  
  let currentAngle = -Math.PI / 2;
  segments.forEach((seg) => {
    const angle = (seg.value / totalCosts) * 2 * Math.PI;
    
    // Draw segment using triangle fan
    pdf.setFillColor(seg.color[0], seg.color[1], seg.color[2]);
    
    const steps = Math.max(8, Math.ceil(angle / 0.1));
    const points: Array<{x: number, y: number}> = [];
    for (let i = 0; i <= steps; i++) {
      const a = currentAngle + (angle * i / steps);
      points.push({ x: centerX + Math.cos(a) * radius, y: centerY + Math.sin(a) * radius });
    }
    
    // Draw as polygon using triangle fan
    if (points.length > 1) {
      for (let i = 0; i < points.length - 1; i++) {
        pdf.triangle(centerX, centerY, points[i].x, points[i].y, points[i+1].x, points[i+1].y, 'F');
      }
    }
    
    currentAngle += angle;
  });
  
  // Inner circle (donut hole)
  pdf.setFillColor(255, 255, 255);
  pdf.circle(centerX, centerY, innerRadius, 'F');
  
  // Center text
  addText('TOTAL', centerX, centerY - 2, { fontSize: 5, color: colors.muted, align: 'center' });
  const totalFormatted = formatCurrency(totalCosts).replace('R$', '').trim();
  addText(totalFormatted.split(',')[0], centerX, centerY + 4, { 
    fontSize: 7, fontStyle: 'bold', color: colors.primary, align: 'center' 
  });
  
  // Legend - positioned on the right side of the donut
  let legendY = y + 24;
  const legendX = donutX + 68;
  segments.forEach((seg, idx) => {
    if (idx < 5) {
      pdf.setFillColor(seg.color[0], seg.color[1], seg.color[2]);
      pdf.circle(legendX, legendY, 2, 'F');
      addText(seg.label, legendX + 5, legendY + 1, { fontSize: 6, color: colors.secondary });
      addText(formatCurrency(seg.value), legendX + 5, legendY + 6, { fontSize: 5, color: colors.muted });
      legendY += 12;
    }
  });

  y += chartHeight + 40;

  // === DEBT EVOLUTION CHART ===
  checkNewPage(75);
  drawRoundedRect(margin, y, contentWidth, 65, 4, colors.white, [229, 231, 235]);
  addText('EVOLUÇÃO DA DÍVIDA VS PAGAMENTOS', margin + 8, y + 12, { fontSize: 9, fontStyle: 'bold', color: colors.primary });
  
  const lineChartX = margin + 20;
  const lineChartY = y + 25;
  const lineChartW = contentWidth - 40;
  const lineChartH = 32;
  
  // Draw axes
  pdf.setDrawColor(229, 231, 235);
  pdf.setLineWidth(0.3);
  pdf.line(lineChartX, lineChartY + lineChartH, lineChartX + lineChartW, lineChartY + lineChartH);
  pdf.line(lineChartX, lineChartY, lineChartX, lineChartY + lineChartH);
  
  // Draw data points and lines
  const debtData = result.debtEvolution.slice(0, Math.min(result.holdingPeriod, 60));
  if (debtData.length > 1) {
    const maxDebt = Math.max(...debtData.map(d => d.debt));
    const maxPaid = Math.max(...debtData.map(d => d.paid));
    const maxVal = Math.max(maxDebt, maxPaid, 1);
    
    // Y-axis labels
    addText(formatCurrency(maxVal).replace('R$', '').trim(), lineChartX - 2, lineChartY + 2, { 
      fontSize: 5, color: colors.muted, align: 'right' 
    });
    addText('0', lineChartX - 2, lineChartY + lineChartH, { 
      fontSize: 5, color: colors.muted, align: 'right' 
    });
    
    // X-axis labels
    addText('1', lineChartX, lineChartY + lineChartH + 4, { fontSize: 5, color: colors.muted });
    addText(`${debtData.length}`, lineChartX + lineChartW, lineChartY + lineChartH + 4, { 
      fontSize: 5, color: colors.muted, align: 'right' 
    });
    addText('meses', lineChartX + lineChartW / 2, lineChartY + lineChartH + 4, { 
      fontSize: 5, color: colors.muted, align: 'center' 
    });
    
    // Debt line (gray)
    pdf.setDrawColor(107, 114, 128);
    pdf.setLineWidth(1.2);
    for (let i = 0; i < debtData.length - 1; i++) {
      const x1 = lineChartX + (i / (debtData.length - 1)) * lineChartW;
      const y1 = lineChartY + lineChartH - (debtData[i].debt / maxVal * lineChartH);
      const x2 = lineChartX + ((i + 1) / (debtData.length - 1)) * lineChartW;
      const y2 = lineChartY + lineChartH - (debtData[i + 1].debt / maxVal * lineChartH);
      pdf.line(x1, y1, x2, y2);
    }
    
    // Paid line (blue)
    pdf.setDrawColor(59, 130, 246);
    pdf.setLineWidth(1.2);
    for (let i = 0; i < debtData.length - 1; i++) {
      const x1 = lineChartX + (i / (debtData.length - 1)) * lineChartW;
      const y1 = lineChartY + lineChartH - (debtData[i].paid / maxVal * lineChartH);
      const x2 = lineChartX + ((i + 1) / (debtData.length - 1)) * lineChartW;
      const y2 = lineChartY + lineChartH - (debtData[i + 1].paid / maxVal * lineChartH);
      pdf.line(x1, y1, x2, y2);
    }
    
    // Data point dots at end
    const lastIdx = debtData.length - 1;
    pdf.setFillColor(107, 114, 128);
    pdf.circle(lineChartX + lineChartW, lineChartY + lineChartH - (debtData[lastIdx].debt / maxVal * lineChartH), 2.5, 'F');
    pdf.setFillColor(59, 130, 246);
    pdf.circle(lineChartX + lineChartW, lineChartY + lineChartH - (debtData[lastIdx].paid / maxVal * lineChartH), 2.5, 'F');
    
    // End values
    addText(formatCurrency(debtData[lastIdx].debt), lineChartX + lineChartW + 3, lineChartY + lineChartH - (debtData[lastIdx].debt / maxVal * lineChartH), { 
      fontSize: 5, color: colors.secondary 
    });
    addText(formatCurrency(debtData[lastIdx].paid), lineChartX + lineChartW + 3, lineChartY + lineChartH - (debtData[lastIdx].paid / maxVal * lineChartH) + 5, { 
      fontSize: 5, color: colors.accent 
    });
  }
  
  // Chart legend
  pdf.setFillColor(107, 114, 128);
  pdf.circle(lineChartX + lineChartW - 70, y + 12, 2, 'F');
  addText('Saldo Devedor', lineChartX + lineChartW - 65, y + 13.5, { fontSize: 6, color: colors.secondary });
  pdf.setFillColor(59, 130, 246);
  pdf.circle(lineChartX + lineChartW - 20, y + 12, 2, 'F');
  addText('Pago', lineChartX + lineChartW - 15, y + 13.5, { fontSize: 6, color: colors.accent });

  y += 75;

  // === DETAILED DATA SECTION ===
  checkNewPage(85);
  
  const colWidth = (contentWidth - 10) / 2;
  
  // Left column: Investment Summary
  drawRoundedRect(margin, y, colWidth, 80, 4, colors.light);
  addText('RESUMO DO INVESTIMENTO', margin + 8, y + 12, { fontSize: 9, fontStyle: 'bold', color: colors.primary });
  
  const summaryItems = [
    ['Valor de Compra', formatCurrency(result.purchasePrice)],
    ['Valor de Mercado', formatCurrency(result.marketValue)],
    ['Entrada', formatCurrency(result.entryValue)],
    ['Valor Financiado', formatCurrency(result.financedAmount)],
    ['Total Investido', formatCurrency(result.totalInvestment)],
  ];
  
  let itemY = y + 24;
  summaryItems.forEach(([label, value], idx) => {
    const isLast = idx === summaryItems.length - 1;
    if (isLast) {
      drawRoundedRect(margin + 4, itemY - 4, colWidth - 8, 13, 2, colors.white);
    }
    addText(String(label), margin + 8, itemY + 3, { fontSize: 8, color: colors.secondary });
    addText(String(value), margin + colWidth - 8, itemY + 3, { fontSize: 8, fontStyle: isLast ? 'bold' : 'normal', color: colors.primary, align: 'right' });
    itemY += 12;
  });
  
  // Right column: Costs
  drawRoundedRect(margin + colWidth + 10, y, colWidth, 80, 4, colors.light);
  addText('CUSTOS DETALHADOS', margin + colWidth + 18, y + 12, { fontSize: 9, fontStyle: 'bold', color: colors.primary });
  
  const costItems = [
    [`Parcelas Pagas (${result.holdingPeriod}x)`, formatCurrency(result.totalPaidUntilResale)],
    ['Juros Pagos', formatCurrency(result.totalInterestPaid)],
    ['ITBI + Documentação', formatCurrency(result.itbi + result.documentation)],
    ['Reforma + Despesas', formatCurrency(result.renovation + (result.monthlyExpenses * result.holdingPeriod))],
    ['Saldo Devedor Revenda', formatCurrency(result.remainingDebtAtResale)],
  ];
  
  itemY = y + 24;
  costItems.forEach(([label, value], idx) => {
    const isLast = idx === costItems.length - 1;
    if (isLast) {
      drawRoundedRect(margin + colWidth + 14, itemY - 4, colWidth - 8, 13, 2, colors.white);
    }
    addText(String(label), margin + colWidth + 18, itemY + 3, { fontSize: 8, color: colors.secondary });
    addText(String(value), margin + colWidth + colWidth + 2, itemY + 3, { fontSize: 8, fontStyle: isLast ? 'bold' : 'normal', color: colors.primary, align: 'right' });
    itemY += 12;
  });

  y += 85;

  // === TIMELINE COMPARISON TABLE ===
  checkNewPage(70);
  drawRoundedRect(margin, y, contentWidth, 8 + (result.timelineComparison.length * 9) + 5, 4, colors.white, [229, 231, 235]);
  
  // Table header
  const tableY = y + 5;
  pdf.setFillColor(243, 244, 246);
  pdf.rect(margin + 2, tableY, contentWidth - 4, 10, 'F');
  
  const colWidths = [28, 38, 28, 38, 38];
  let xPos = margin + 6;
  ['PRAZO', 'LUCRO', 'ROI', 'SALDO DEV.', 'TOTAL PAGO'].forEach((header, i) => {
    addText(header, xPos, tableY + 6.5, { fontSize: 7, fontStyle: 'bold', color: colors.secondary });
    xPos += colWidths[i];
  });
  
  // Table rows
  let rowY = tableY + 14;
  result.timelineComparison.forEach((row) => {
    const isSelected = row.month === result.holdingPeriod;
    
    if (isSelected) {
      pdf.setFillColor(239, 246, 255);
      pdf.rect(margin + 2, rowY - 4, contentWidth - 4, 9, 'F');
    }
    
    xPos = margin + 6;
    const values = [
      `${row.month} meses`,
      formatCurrency(row.profit),
      `${row.roi.toFixed(1)}%`,
      formatCurrency(row.remainingDebt),
      formatCurrency(row.totalPaid)
    ];
    
    values.forEach((val, i) => {
      const isProfit = i === 1 || i === 2;
      let color = isSelected ? colors.primary : colors.secondary;
      if (isProfit && row.profit < 0) color = colors.danger;
      if (isProfit && row.profit > 0 && isSelected) color = colors.success;
      
      addText(val, xPos, rowY, { 
        fontSize: 7.5, 
        fontStyle: isSelected ? 'bold' : 'normal', 
        color 
      });
      xPos += colWidths[i];
    });
    
    if (isSelected) {
      // Selection indicator
      pdf.setFillColor(59, 130, 246);
      pdf.circle(margin + contentWidth - 8, rowY - 1.5, 2, 'F');
    }
    
    rowY += 9;
  });

  y = rowY + 10;

  // === ANALYSIS TEXT ===
  // Calculate needed height for analysis text
  pdf.setFontSize(8);
  const cleanedAnalysisText = analysisText.replace(/\n\n/g, '\n').replace(/\n/g, ' ');
  const analysisLines = pdf.splitTextToSize(cleanedAnalysisText, contentWidth - 16);
  const analysisBoxHeight = Math.min(75, 22 + (analysisLines.length * 5));
  
  checkNewPage(analysisBoxHeight + 10);
  drawRoundedRect(margin, y, contentWidth, analysisBoxHeight, 4, colors.light);
  addText('ANÁLISE DO INVESTIMENTO', margin + 8, y + 12, { fontSize: 9, fontStyle: 'bold', color: colors.primary });
  
  // Wrap text
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(75, 85, 99);
  
  const maxLinesForAnalysis = Math.min(analysisLines.length, 10);
  
  for (let i = 0; i < maxLinesForAnalysis; i++) {
    pdf.text(analysisLines[i], margin + 8, y + 22 + (i * 5));
  }
  
  if (analysisLines.length > maxLinesForAnalysis) {
    pdf.text('...', margin + 8, y + 22 + (maxLinesForAnalysis * 5));
  }

  y += analysisBoxHeight + 10;

  // === DISCLAIMER ===
  checkNewPage(35);
  drawRoundedRect(margin, y, contentWidth, 22, 4, [254, 252, 232]);
  pdf.setFillColor(245, 158, 11);
  pdf.circle(margin + 10, y + 11, 3, 'F');
  addText('!', margin + 10, y + 13, { fontSize: 8, fontStyle: 'bold', color: colors.white, align: 'center' });
  
  addText('AVISO LEGAL', margin + 18, y + 8, { fontSize: 7, fontStyle: 'bold', color: [161, 98, 7] });
  const disclaimerText = 'Esta análise é uma estimativa e não substitui orientação financeira profissional. Valores podem variar.';
  addText(disclaimerText, margin + 18, y + 15, { fontSize: 7, color: [161, 98, 7] });

  y += 30;

  // === FOOTER ===
  const footerY = pageHeight - 12;
  pdf.setDrawColor(229, 231, 235);
  pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  
  // Logo placeholder
  pdf.setFillColor(17, 24, 39);
  pdf.roundedRect(margin, footerY - 3, 25, 8, 2, 2, 'F');
  addText('VDH', margin + 12.5, footerY + 1.5, { fontSize: 6, fontStyle: 'bold', color: colors.white, align: 'center' });
  
  addText('Análise gerada automaticamente', pageWidth / 2, footerY, { 
    fontSize: 7, color: colors.muted, align: 'center' 
  });
  addText(`Página 1 de 1`, pageWidth - margin, footerY, { 
    fontSize: 7, color: colors.muted, align: 'right' 
  });

  // Save
  const fileName = `analise-investimento-${result.holdingPeriod}meses-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}
