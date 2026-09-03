import { CxBankAnalysis, CxBankCredit, CxDocument, CxExtraction } from '@/types/correspondente';

export const cxFormatBRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/** Parses DD/MM/AAAA (or ISO) into a Date at local midnight. */
export const cxParseDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const br = value.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (br) {
    const year = br[3].length === 2 ? 2000 + Number(br[3]) : Number(br[3]);
    const d = new Date(year, Number(br[2]) - 1, Number(br[1]));
    return isNaN(d.getTime()) ? null : d;
  }
  const iso = value.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  return null;
};

export const cxMonthKey = (date: string): string => {
  const d = cxParseDate(date);
  if (!d) return 'Sem data';
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

const keyOf = (d: Date) => `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
const daysInMonth = (year: number, monthIndex: number) => new Date(year, monthIndex + 1, 0).getDate();

export interface CxMonthCoverage {
  key: string;
  total: number;
  coveredDays: number;
  totalDays: number;
  complete: boolean;
  firstDay: number;
  lastDay: number;
}

export interface CxIncomeSummary {
  months: CxMonthCoverage[];
  includedTotal: number;
  excludedTotal: number;
  monthlyAverage: number;
  proRataAverage: number;
  creditCount: number;
  excludedCount: number;
  incompleteMonths: CxMonthCoverage[];
  hasIncompleteMonths: boolean;
  coverageStart: Date | null;
  coverageEnd: Date | null;
}

/**
 * Builds the day-by-day coverage of one or more statements.
 * Each range is inclusive; overlapping ranges are merged per month.
 */
const buildCoverage = (ranges: { start: Date; end: Date }[]) => {
  const map = new Map<string, Set<number>>();
  ranges.forEach(({ start, end }) => {
    const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    while (cursor <= end) {
      const key = keyOf(cursor);
      if (!map.has(key)) map.set(key, new Set());
      map.get(key)!.add(cursor.getDate());
      cursor.setDate(cursor.getDate() + 1);
    }
  });
  return map;
};

const rangeOf = (analysis: CxBankAnalysis): { start: Date; end: Date } | null => {
  const dates = analysis.credits.map((c) => cxParseDate(c.date)).filter((d): d is Date => !!d);
  const start = cxParseDate(analysis.periodStart) || (dates.length ? new Date(Math.min(...dates.map((d) => +d))) : null);
  const end = cxParseDate(analysis.periodEnd) || (dates.length ? new Date(Math.max(...dates.map((d) => +d))) : null);
  if (!start || !end || end < start) return null;
  return { start, end };
};

export const cxSummarize = (
  credits: CxBankCredit[],
  ranges: { start: Date; end: Date }[],
): CxIncomeSummary => {
  const totals = new Map<string, number>();
  let includedTotal = 0;
  let excludedTotal = 0;
  let excludedCount = 0;

  credits.forEach((c) => {
    if (c.included) {
      const key = cxMonthKey(c.date);
      totals.set(key, (totals.get(key) || 0) + c.amount);
      includedTotal += c.amount;
    } else {
      excludedTotal += c.amount;
      excludedCount += 1;
    }
  });

  const coverage = buildCoverage(ranges);
  // Months that only appear through credits still get an entry.
  totals.forEach((_, key) => {
    if (!coverage.has(key)) coverage.set(key, new Set());
  });

  const months: CxMonthCoverage[] = Array.from(coverage.entries())
    .filter(([key]) => key !== 'Sem data')
    .map(([key, days]) => {
      const [m, y] = key.split('/').map(Number);
      const totalDays = daysInMonth(y, m - 1);
      const list = Array.from(days).sort((a, b) => a - b);
      const coveredDays = list.length || totalDays;
      return {
        key,
        total: totals.get(key) || 0,
        coveredDays,
        totalDays,
        // Dias sem movimentação não aparecem no extrato: tolerância nas bordas do mês.
        complete: coveredDays >= totalDays || ((list[0] ?? 1) <= 5 && (list[list.length - 1] ?? totalDays) >= totalDays - 5),
        firstDay: list[0] ?? 1,
        lastDay: list[list.length - 1] ?? totalDays,
      };
    })
    .sort((a, b) => {
      const [ma, ya] = a.key.split('/');
      const [mb, yb] = b.key.split('/');
      return `${ya}${ma}`.localeCompare(`${yb}${mb}`);
    });

  const monthlyAverage = months.length ? includedTotal / months.length : 0;
  const weight = months.reduce((acc, m) => acc + m.coveredDays / m.totalDays, 0);
  const incompleteMonths = months.filter((m) => !m.complete);
  const allDates = ranges.flatMap((r) => [r.start, r.end]);

  return {
    months,
    includedTotal,
    excludedTotal,
    monthlyAverage,
    proRataAverage: weight > 0 ? includedTotal / weight : 0,
    creditCount: credits.length,
    excludedCount,
    incompleteMonths,
    hasIncompleteMonths: incompleteMonths.length > 0,
    coverageStart: allDates.length ? new Date(Math.min(...allDates.map((d) => +d))) : null,
    coverageEnd: allDates.length ? new Date(Math.max(...allDates.map((d) => +d))) : null,
  };
};

export const cxSummarizeAnalysis = (analysis: CxBankAnalysis): CxIncomeSummary => {
  const range = rangeOf(analysis);
  return cxSummarize(analysis.credits, range ? [range] : []);
};

export const cxGetBankAnalysis = (doc: CxDocument): CxBankAnalysis | null => {
  const extraction = doc.extracted as CxExtraction;
  const analysis = extraction?.bankAnalysis;
  if (!analysis || !Array.isArray(analysis.credits)) return null;
  return analysis;
};

/** Consolidates every bank statement of a client into a single monthly income average. */
export const cxConsolidateBankStatements = (docs: CxDocument[]) => {
  const bankDocs = docs.filter((d) => d.doc_type === 'extrato_bancario' && cxGetBankAnalysis(d));
  const analyses = bankDocs.map((d) => cxGetBankAnalysis(d)!);
  const credits = analyses.flatMap((a) => a.credits);
  const ranges = analyses.map(rangeOf).filter((r): r is { start: Date; end: Date } => !!r);
  return { bankDocs, ...cxSummarize(credits, ranges) };
};

export const cxCoverageWarning = (summary: CxIncomeSummary): string | null => {
  if (!summary.hasIncompleteMonths) return null;
  const detail = summary.incompleteMonths
    .map((m) => `${m.key} (dias ${m.firstDay} a ${m.lastDay} de ${m.totalDays})`)
    .join(', ');
  return `Atenção: o extrato parece não cobrir o mês completo — ${detail}. A média mensal acima pode estar subestimada. Observação: dias sem movimentação não aparecem no extrato, então confira o período impresso no cabeçalho antes de pedir ao cliente o extrato fechado do 1º ao último dia do mês.`;
};

const GAMBLING_PATTERNS = [
  'aposta', 'apostas', 'bet', 'bets', 'bet365', 'betano', 'betfair', 'sportingbet', 'pixbet',
  'estrela bet', 'kto', 'stake', 'blaze', 'cassino', 'casino', 'gaming', 'jogo', 'jogos',
  'loteria', 'lottery', 'poker', 'bingo', 'esportes da sorte', 'sorte online', 'rivalo', '1xbet',
  'betsson', 'novibet', 'superbet', 'vaidebet', 'betnacional', 'esportivas',
];

/** Detects credits that came from betting houses / gambling platforms (never accepted as income). */
export const cxIsGambling = (credit: { description?: string; counterparty?: string | null; kind?: string | null; reason?: string | null }) => {
  const haystack = `${credit.description || ''} ${credit.counterparty || ''} ${credit.kind || ''} ${credit.reason || ''}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return GAMBLING_PATTERNS.some((p) => new RegExp(`(^|[^a-z])${p}([^a-z]|$)`).test(haystack));
};
