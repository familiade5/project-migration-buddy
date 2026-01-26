import jsPDF from 'jspdf';
import { formatCurrency } from './formatCurrency';
import { defaultPdfTheme } from './pdf/theme';
import { PdfRenderer } from './pdf/renderer';
import {
  drawFooterWithPageNumbers,
  drawHeader,
  drawKpiRow,
  drawParagraphBox,
  drawTable,
  drawTwoColumnCards,
} from './pdf/sections';

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
  const pdf = new jsPDF("p", "mm", "a4");
  const r = new PdfRenderer(pdf, defaultPdfTheme);

  const isPositive = result.totalROI >= 0;
  const metaRight = `Gerado em ${new Date().toLocaleDateString("pt-BR")}`;

  drawHeader(r, {
    title: "ANÁLISE DE INVESTIMENTO",
    subtitle: "IMOBILIÁRIO",
    badges: [
      { label: result.table, tone: "brand" },
      { label: `${result.holdingPeriod}m`, tone: "dark" },
    ],
    metaRight,
  });

  drawKpiRow(r, [
    {
      label: "Lucro estimado",
      value: formatCurrency(result.estimatedProfit),
      tone: isPositive ? "success" : "danger",
    },
    { label: "ROI total", value: `${result.totalROI.toFixed(1)}%`, tone: "brand" },
    { label: "ROI mensal", value: `${result.monthlyROI.toFixed(2)}%`, tone: "neutral" },
    { label: "Desconto", value: `${result.discountPercentage.toFixed(1)}%`, tone: "warn" },
  ]);

  drawTwoColumnCards(r, [
    {
      title: "Resumo do investimento",
      rows: [
        { label: "Valor de compra", value: formatCurrency(result.purchasePrice) },
        { label: "Valor de mercado", value: formatCurrency(result.marketValue) },
        { label: "Entrada", value: formatCurrency(result.entryValue) },
        { label: "Valor financiado", value: formatCurrency(result.financedAmount) },
        { label: "Total investido", value: formatCurrency(result.totalInvestment), emphasis: true },
      ],
    },
    {
      title: "Custos e financiamento",
      rows: [
        { label: `Parcelas pagas (${result.holdingPeriod}x)`, value: formatCurrency(result.totalPaidUntilResale) },
        { label: "Juros pagos", value: formatCurrency(result.totalInterestPaid) },
        { label: "ITBI + Documentação", value: formatCurrency(result.itbi + result.documentation) },
        {
          label: "Reforma + Despesas",
          value: formatCurrency(result.renovation + result.monthlyExpenses * result.holdingPeriod),
        },
        { label: "Saldo devedor na revenda", value: formatCurrency(result.remainingDebtAtResale), emphasis: true },
      ],
    },
  ]);

  // Tabela de comparação por prazo (sempre aparece; sem gráficos complexos que geram sobreposição)
  const timelineRows = result.timelineComparison.map((row) => [
    `${row.month}m`,
    formatCurrency(row.profit),
    `${row.roi.toFixed(1)}%`,
    formatCurrency(row.remainingDebt),
    formatCurrency(row.totalPaid),
  ]);
  const selectedIdx = result.timelineComparison.findIndex((row) => row.month === result.holdingPeriod);
  drawTable(r, {
    title: "Comparação por prazo",
    headers: ["PRAZO", "LUCRO", "ROI", "SALDO DEV.", "TOTAL PAGO"],
    rows: timelineRows,
    colWidths: [20, 42, 18, 42, 42],
    highlightRowIndex: selectedIdx >= 0 ? selectedIdx : undefined,
  });

  // Texto de análise (com quebra confiável e sem caixas cobrindo o texto)
  const cleaned = analysisText.replace(/\n\n/g, "\n").trim();
  drawParagraphBox(r, { title: "Análise do investimento", text: cleaned, maxLines: 40 });

  // Aviso legal
  r.ensureSpace(28);
  r.roundedBox(r.margin, r.cursorY, r.contentWidth, 22, {
    fill: [255, 251, 235],
    stroke: r.theme.colors.border,
    radius: r.theme.radius.lg,
  });
  r.roundedBox(r.margin + 8, r.cursorY + 7, 8, 8, { fill: [217, 119, 6], radius: 2 });
  r.textCenter("!", r.margin + 12, r.cursorY + 13, { size: 8, style: "bold", color: [255, 255, 255] });
  r.text("AVISO LEGAL", r.margin + 20, r.cursorY + 11, { size: r.theme.fonts.sizes.tiny, style: "bold", color: [146, 64, 14] });
  r.text(
    "Esta análise é uma estimativa para apoio comercial e não substitui orientação financeira/profissional. Valores podem variar.",
    r.margin + 20,
    r.cursorY + 17,
    { size: r.theme.fonts.sizes.tiny, color: [146, 64, 14] }
  );
  r.cursorY += 30;

  // Footer com paginação real
  drawFooterWithPageNumbers(r, { brandLeft: "VDH" });

  const fileName = `analise-investimento-${result.holdingPeriod}meses-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}
