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
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  // Helper functions
  const addText = (text: string, x: number, yPos: number, options?: { 
    fontSize?: number; 
    fontStyle?: 'normal' | 'bold'; 
    color?: [number, number, number];
    align?: 'left' | 'center' | 'right';
  }) => {
    const { fontSize = 10, fontStyle = 'normal', color = [0, 0, 0], align = 'left' } = options || {};
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontStyle);
    pdf.setTextColor(color[0], color[1], color[2]);
    
    let alignX = x;
    if (align === 'center') alignX = pageWidth / 2;
    if (align === 'right') alignX = pageWidth - margin;
    
    pdf.text(text, alignX, yPos, { align });
  };

  const addLine = (y: number, color: [number, number, number] = [229, 231, 235]) => {
    pdf.setDrawColor(color[0], color[1], color[2]);
    pdf.setLineWidth(0.3);
    pdf.line(margin, y, pageWidth - margin, y);
  };

  const checkNewPage = (neededSpace: number) => {
    if (y + neededSpace > pageHeight - margin) {
      pdf.addPage();
      y = margin;
      return true;
    }
    return false;
  };

  const addTableRow = (label: string, value: string, isHighlight: boolean = false) => {
    checkNewPage(8);
    if (isHighlight) {
      pdf.setFillColor(249, 250, 251);
      pdf.rect(margin, y - 4, contentWidth, 8, 'F');
    }
    addText(label, margin, y, { fontSize: 9, color: [107, 114, 128] });
    addText(value, pageWidth - margin, y, { fontSize: 9, fontStyle: 'bold', align: 'right' });
    y += 8;
  };

  // === HEADER ===
  pdf.setFillColor(31, 41, 55); // gray-800
  pdf.rect(0, 0, pageWidth, 45, 'F');
  
  addText('ANÁLISE DE INVESTIMENTO IMOBILIÁRIO', margin, 18, { 
    fontSize: 16, fontStyle: 'bold', color: [255, 255, 255] 
  });
  addText(`Período: ${result.holdingPeriod} meses | Sistema: ${result.table}`, margin, 26, { 
    fontSize: 10, color: [209, 213, 219] 
  });
  addText(`Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`, margin, 34, { 
    fontSize: 8, color: [156, 163, 175] 
  });

  y = 55;

  // === KEY METRICS (4 boxes) ===
  const boxWidth = (contentWidth - 15) / 4;
  const boxHeight = 28;
  const isPositive = result.totalROI > 0;
  
  // Profit box
  pdf.setFillColor(249, 250, 251);
  pdf.roundedRect(margin, y, boxWidth, boxHeight, 2, 2, 'F');
  addText('Lucro Estimado', margin + 4, y + 8, { fontSize: 7, color: [107, 114, 128] });
  addText(formatCurrency(result.estimatedProfit), margin + 4, y + 18, { 
    fontSize: 12, fontStyle: 'bold', color: isPositive ? [34, 197, 94] : [239, 68, 68] 
  });

  // ROI Total box
  pdf.setFillColor(249, 250, 251);
  pdf.roundedRect(margin + boxWidth + 5, y, boxWidth, boxHeight, 2, 2, 'F');
  addText('ROI Total', margin + boxWidth + 9, y + 8, { fontSize: 7, color: [107, 114, 128] });
  addText(`${result.totalROI.toFixed(1)}%`, margin + boxWidth + 9, y + 18, { 
    fontSize: 12, fontStyle: 'bold', color: isPositive ? [34, 197, 94] : [239, 68, 68] 
  });

  // ROI Monthly box
  pdf.setFillColor(249, 250, 251);
  pdf.roundedRect(margin + (boxWidth + 5) * 2, y, boxWidth, boxHeight, 2, 2, 'F');
  addText('ROI Mensal', margin + (boxWidth + 5) * 2 + 4, y + 8, { fontSize: 7, color: [107, 114, 128] });
  addText(`${result.monthlyROI.toFixed(2)}%`, margin + (boxWidth + 5) * 2 + 4, y + 18, { 
    fontSize: 12, fontStyle: 'bold', color: [31, 41, 55] 
  });

  // Discount box
  pdf.setFillColor(249, 250, 251);
  pdf.roundedRect(margin + (boxWidth + 5) * 3, y, boxWidth, boxHeight, 2, 2, 'F');
  addText('Desconto', margin + (boxWidth + 5) * 3 + 4, y + 8, { fontSize: 7, color: [107, 114, 128] });
  addText(`${result.discountPercentage.toFixed(1)}%`, margin + (boxWidth + 5) * 3 + 4, y + 18, { 
    fontSize: 12, fontStyle: 'bold', color: [31, 41, 55] 
  });

  y += boxHeight + 15;

  // === TWO COLUMNS: Investment Summary & Costs ===
  const colWidth = (contentWidth - 10) / 2;
  
  // Investment Summary
  addText('RESUMO DO INVESTIMENTO', margin, y, { fontSize: 10, fontStyle: 'bold', color: [31, 41, 55] });
  y += 8;
  addLine(y);
  y += 6;

  const summaryItems = [
    ['Valor de Compra', formatCurrency(result.purchasePrice)],
    ['Valor de Mercado', formatCurrency(result.marketValue)],
    ['Entrada', formatCurrency(result.entryValue)],
    ['Valor Financiado', formatCurrency(result.financedAmount)],
    ['Total Investido', formatCurrency(result.totalInvestment)]
  ];

  summaryItems.forEach(([label, value], i) => {
    addTableRow(label, value, i === summaryItems.length - 1);
  });

  y += 8;

  // Costs Details
  addText('CUSTOS DETALHADOS', margin, y, { fontSize: 10, fontStyle: 'bold', color: [31, 41, 55] });
  y += 8;
  addLine(y);
  y += 6;

  const costItems = [
    [`Parcelas Pagas (${result.holdingPeriod}x)`, formatCurrency(result.totalPaidUntilResale)],
    ['Juros Pagos', formatCurrency(result.totalInterestPaid)],
  ];

  if (result.itbi > 0) costItems.push(['ITBI', formatCurrency(result.itbi)]);
  if (result.documentation > 0) costItems.push(['Documentação', formatCurrency(result.documentation)]);
  if (result.brokerage > 0) costItems.push(['Corretagem (Revenda)', formatCurrency(result.brokerage)]);
  if (result.renovation > 0) costItems.push(['Reforma', formatCurrency(result.renovation)]);
  if (result.monthlyExpenses > 0) costItems.push([`Despesas Mensais (${result.holdingPeriod}x)`, formatCurrency(result.monthlyExpenses * result.holdingPeriod)]);
  costItems.push(['Saldo Devedor na Revenda', formatCurrency(result.remainingDebtAtResale)]);

  costItems.forEach(([label, value], i) => {
    addTableRow(label, value, i === costItems.length - 1);
  });

  y += 12;

  // === TIMELINE COMPARISON TABLE ===
  checkNewPage(60);
  addText('COMPARATIVO DE PRAZOS DE REVENDA', margin, y, { fontSize: 10, fontStyle: 'bold', color: [31, 41, 55] });
  y += 8;
  addLine(y);
  y += 6;

  // Table header
  pdf.setFillColor(249, 250, 251);
  pdf.rect(margin, y - 4, contentWidth, 8, 'F');
  const colWidths = [25, 35, 25, 40, 40];
  let xPos = margin;
  ['Prazo', 'Lucro', 'ROI', 'Saldo Devedor', 'Total Pago'].forEach((header, i) => {
    addText(header, xPos + 2, y, { fontSize: 8, fontStyle: 'bold', color: [75, 85, 99] });
    xPos += colWidths[i];
  });
  y += 8;

  // Table rows
  result.timelineComparison.forEach((row) => {
    checkNewPage(8);
    const isSelected = row.month === result.holdingPeriod;
    if (isSelected) {
      pdf.setFillColor(243, 244, 246);
      pdf.rect(margin, y - 4, contentWidth, 8, 'F');
    }
    
    xPos = margin;
    const values = [
      `${row.month} meses${isSelected ? ' ●' : ''}`,
      formatCurrency(row.profit),
      `${row.roi.toFixed(1)}%`,
      formatCurrency(row.remainingDebt),
      formatCurrency(row.totalPaid)
    ];
    
    values.forEach((val, i) => {
      const color: [number, number, number] = (i === 1 || i === 2) && row.profit < 0 
        ? [220, 38, 38] 
        : isSelected ? [17, 24, 39] : [107, 114, 128];
      addText(val, xPos + 2, y, { fontSize: 8, color, fontStyle: isSelected ? 'bold' : 'normal' });
      xPos += colWidths[i];
    });
    y += 8;
  });

  y += 12;

  // === ANALYSIS TEXT ===
  checkNewPage(40);
  addText('ANÁLISE DO INVESTIMENTO', margin, y, { fontSize: 10, fontStyle: 'bold', color: [31, 41, 55] });
  y += 8;
  addLine(y);
  y += 8;

  // Split and wrap analysis text
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(55, 65, 81);
  
  const lines = pdf.splitTextToSize(analysisText.replace(/\n\n/g, '\n'), contentWidth);
  lines.forEach((line: string) => {
    checkNewPage(6);
    pdf.text(line, margin, y);
    y += 5;
  });

  y += 12;

  // === DEBT EVOLUTION MINI TABLE ===
  if (result.debtEvolution.length > 0) {
    checkNewPage(50);
    addText('EVOLUÇÃO DA DÍVIDA (PRIMEIROS MESES)', margin, y, { fontSize: 10, fontStyle: 'bold', color: [31, 41, 55] });
    y += 8;
    addLine(y);
    y += 6;

    // Header
    pdf.setFillColor(249, 250, 251);
    pdf.rect(margin, y - 4, contentWidth, 8, 'F');
    const debtColWidths = [30, 55, 55];
    xPos = margin;
    ['Mês', 'Saldo Devedor', 'Total Pago'].forEach((header, i) => {
      addText(header, xPos + 2, y, { fontSize: 8, fontStyle: 'bold', color: [75, 85, 99] });
      xPos += debtColWidths[i];
    });
    y += 8;

    // Show first 6 months
    result.debtEvolution.slice(0, 6).forEach((row) => {
      checkNewPage(8);
      xPos = margin;
      const values = [`${row.month}º`, formatCurrency(row.debt), formatCurrency(row.paid)];
      values.forEach((val, i) => {
        addText(val, xPos + 2, y, { fontSize: 8, color: [107, 114, 128] });
        xPos += debtColWidths[i];
      });
      y += 7;
    });
  }

  y += 12;

  // === PAYMENT BREAKDOWN MINI TABLE ===
  if (result.paymentBreakdown.length > 0) {
    checkNewPage(50);
    addText('COMPOSIÇÃO DAS PARCELAS (PRIMEIROS MESES)', margin, y, { fontSize: 10, fontStyle: 'bold', color: [31, 41, 55] });
    y += 8;
    addLine(y);
    y += 6;

    // Header
    pdf.setFillColor(249, 250, 251);
    pdf.rect(margin, y - 4, contentWidth, 8, 'F');
    const payColWidths = [25, 40, 40, 40];
    xPos = margin;
    ['Mês', 'Amortização', 'Juros', 'Parcela'].forEach((header, i) => {
      addText(header, xPos + 2, y, { fontSize: 8, fontStyle: 'bold', color: [75, 85, 99] });
      xPos += payColWidths[i];
    });
    y += 8;

    // Show first 6 months
    result.paymentBreakdown.slice(0, 6).forEach((row) => {
      checkNewPage(8);
      xPos = margin;
      const values = [
        `${row.month}º`, 
        formatCurrency(row.amortization), 
        formatCurrency(row.interest), 
        formatCurrency(row.installment)
      ];
      values.forEach((val, i) => {
        addText(val, xPos + 2, y, { fontSize: 8, color: [107, 114, 128] });
        xPos += payColWidths[i];
      });
      y += 7;
    });
  }

  // === DISCLAIMER ===
  checkNewPage(30);
  y += 10;
  pdf.setFillColor(254, 252, 232); // yellow-50
  pdf.roundedRect(margin, y - 4, contentWidth, 28, 2, 2, 'F');
  
  addText('⚠ AVISO LEGAL', margin + 4, y + 4, { fontSize: 8, fontStyle: 'bold', color: [161, 98, 7] });
  
  const disclaimerText = 'Esta análise é uma estimativa baseada nos dados fornecidos e não substitui orientação financeira, jurídica ou contábil profissional. Os valores reais podem variar conforme condições de mercado, taxas, impostos e outros fatores não considerados nesta simulação.';
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(161, 98, 7);
  const disclaimerLines = pdf.splitTextToSize(disclaimerText, contentWidth - 8);
  disclaimerLines.forEach((line: string, i: number) => {
    pdf.text(line, margin + 4, y + 12 + (i * 4));
  });

  // === FOOTER ===
  const footerY = pageHeight - 10;
  pdf.setDrawColor(229, 231, 235);
  pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  addText('Análise gerada automaticamente • VDH Imobiliária', pageWidth / 2, footerY, { 
    fontSize: 7, color: [156, 163, 175], align: 'center' 
  });

  // Save
  const fileName = `analise-investimento-${result.holdingPeriod}meses-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}
