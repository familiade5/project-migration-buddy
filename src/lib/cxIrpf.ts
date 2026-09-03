import { CxDocument, CxIrpfAnalysis, CxIrpfAsset } from '@/types/correspondente';

/** Limite anual de faturamento/lucro abaixo do qual a isenção do lucro distribuído deve ser questionada */
export const CX_IRPF_EXEMPT_LIMIT = 200000;

export function cxGetIrpfAnalysis(doc: CxDocument): CxIrpfAnalysis | null {
  const extracted = doc.extracted as { irpfAnalysis?: CxIrpfAnalysis | null } | undefined;
  const a = extracted?.irpfAnalysis;
  if (!a) return null;
  return {
    holder: a.holder ?? null,
    cpf: a.cpf ?? null,
    year: a.year ?? null,
    pjIncomes: Array.isArray(a.pjIncomes) ? a.pjIncomes : [],
    exemptIncomes: Array.isArray(a.exemptIncomes) ? a.exemptIncomes : [],
    assets: Array.isArray(a.assets) ? a.assets : [],
  };
}

export function cxIsCompanyAsset(asset: CxIrpfAsset): boolean {
  const cat = (asset.category || '').toLowerCase();
  if (cat.includes('empresa')) return true;
  const text = `${asset.description || ''} ${asset.code || ''}`.toLowerCase();
  return /quota|cotas|participa|capital social|s[óo]cio|ltda|a[çc][õo]es|firma individual|mei\b/.test(text);
}

export function cxIsRealEstateAsset(asset: CxIrpfAsset): boolean {
  const cat = (asset.category || '').toLowerCase();
  if (cat.includes('imovel') || cat.includes('imóvel')) return true;
  const text = `${asset.description || ''}`.toLowerCase();
  return /apartamento|casa|terreno|lote|sala comercial|loja|im[óo]vel|s[íi]tio|fazenda|ch[áa]cara/.test(text);
}

export interface CxIrpfProfitLine {
  cnpj: string | null;
  sourceName: string | null;
  description: string;
  annual: number;
  monthly: number;
  belowLimit: boolean;
}

export interface CxIrpfSummary {
  analysis: CxIrpfAnalysis;
  totalPj: number;
  pjWithoutInss: number;
  profitLines: CxIrpfProfitLine[];
  totalProfitAnnual: number;
  totalProfitMonthly: number;
  otherExemptTotal: number;
  companyAssets: CxIrpfAsset[];
  realEstateAssets: CxIrpfAsset[];
  mcmvWarning: boolean;
}

export function cxSummarizeIrpf(analysis: CxIrpfAnalysis): CxIrpfSummary {
  const totalPj = analysis.pjIncomes.reduce((s, r) => s + (r.taxableIncome || 0), 0);
  const pjWithoutInss = analysis.pjIncomes.filter((r) => !r.inssWithheld).length;

  const profitLines: CxIrpfProfitLine[] = analysis.exemptIncomes
    .filter((r) => r.isProfitDistribution)
    .map((r) => ({
      cnpj: r.cnpj ?? null,
      sourceName: r.sourceName ?? null,
      description: r.description,
      annual: r.amount || 0,
      monthly: (r.amount || 0) / 12,
      belowLimit: (r.amount || 0) < CX_IRPF_EXEMPT_LIMIT,
    }));

  const totalProfitAnnual = profitLines.reduce((s, r) => s + r.annual, 0);
  const otherExemptTotal = analysis.exemptIncomes
    .filter((r) => !r.isProfitDistribution)
    .reduce((s, r) => s + (r.amount || 0), 0);

  const companyAssets = analysis.assets.filter(cxIsCompanyAsset);
  const realEstateAssets = analysis.assets.filter((a) => !cxIsCompanyAsset(a) && cxIsRealEstateAsset(a));

  return {
    analysis,
    totalPj,
    pjWithoutInss,
    profitLines,
    totalProfitAnnual,
    totalProfitMonthly: totalProfitAnnual / 12,
    otherExemptTotal,
    companyAssets,
    realEstateAssets,
    mcmvWarning: companyAssets.length > 0 || realEstateAssets.length > 0,
  };
}
