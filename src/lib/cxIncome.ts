import { CxBankAnalysis, CxBankCredit, CxDocument, CxExtraction } from '@/types/correspondente';

export const cxFormatBRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const cxMonthKey = (date: string): string => {
  const m = date.match(/(\d{2})\/(\d{2})\/(\d{2,4})/);
  if (m) {
    const year = m[3].length === 2 ? `20${m[3]}` : m[3];
    return `${m[2]}/${year}`;
  }
  const iso = date.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[2]}/${iso[1]}`;
  return 'Sem data';
};

export interface CxIncomeSummary {
  months: { key: string; total: number }[];
  includedTotal: number;
  excludedTotal: number;
  monthlyAverage: number;
  creditCount: number;
  excludedCount: number;
}

export const cxSummarizeCredits = (credits: CxBankCredit[]): CxIncomeSummary => {
  const map = new Map<string, number>();
  let includedTotal = 0;
  let excludedTotal = 0;
  let excludedCount = 0;

  credits.forEach((c) => {
    if (c.included) {
      const key = cxMonthKey(c.date);
      map.set(key, (map.get(key) || 0) + c.amount);
      includedTotal += c.amount;
    } else {
      excludedTotal += c.amount;
      excludedCount += 1;
    }
  });

  const months = Array.from(map.entries())
    .map(([key, total]) => ({ key, total }))
    .sort((a, b) => {
      const [ma, ya] = a.key.split('/');
      const [mb, yb] = b.key.split('/');
      return `${ya}${ma}`.localeCompare(`${yb}${mb}`);
    });

  return {
    months,
    includedTotal,
    excludedTotal,
    monthlyAverage: months.length ? includedTotal / months.length : 0,
    creditCount: credits.length,
    excludedCount,
  };
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
  const credits = bankDocs.flatMap((d) => cxGetBankAnalysis(d)?.credits || []);
  return { bankDocs, ...cxSummarizeCredits(credits) };
};
