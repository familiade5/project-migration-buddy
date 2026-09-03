import { CxDocument, CxPropertyAnalysis, CxPropertyLien } from '@/types/correspondente';

export function cxGetPropertyAnalysis(doc: CxDocument): CxPropertyAnalysis | null {
  const extracted = doc.extracted as { propertyAnalysis?: CxPropertyAnalysis | null } | undefined;
  const a = extracted?.propertyAnalysis;
  if (!a) return null;
  return {
    address: a.address ?? null,
    description: a.description ?? null,
    registrationNumber: a.registrationNumber ?? null,
    notaryOffice: a.notaryOffice ?? null,
    municipalRegistration: a.municipalRegistration ?? null,
    firstAddress: a.firstAddress ?? null,
    lastAddress: a.lastAddress ?? null,
    liens: Array.isArray(a.liens) ? a.liens : [],
    addressEntries: Array.isArray(a.addressEntries) ? a.addressEntries : [],
    owners: Array.isArray(a.owners) ? a.owners : [],
    fgtsUsed: a.fgtsUsed ?? null,
    fgtsDate: a.fgtsDate ?? null,
    fgtsNote: a.fgtsNote ?? null,
  };
}

/** Converte DD/MM/AAAA (ou AAAA-MM-DD) em Date */
export function cxParseBrDate(value?: string | null): Date | null {
  if (!value) return null;
  const br = value.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (br) return new Date(Number(br[3]), Number(br[2]) - 1, Number(br[1]));
  const iso = value.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  return null;
}

export function cxMonthsSince(date: Date): number {
  const now = new Date();
  return (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
}

const BLOCKING = ['penhora', 'arresto', 'indisponibilidade', 'processo', 'a[çc][ãa]o', 'execu[çc]', 'hipoteca'];

export function cxIsBlockingLien(lien: CxPropertyLien): boolean {
  const text = `${lien.type || ''} ${lien.description || ''}`.toLowerCase();
  return lien.active !== false && BLOCKING.some((p) => new RegExp(p).test(text));
}

export interface CxPropertySummary {
  analysis: CxPropertyAnalysis;
  activeLiens: CxPropertyLien[];
  clearedLiens: CxPropertyLien[];
  blockingCount: number;
  missingMunicipal: boolean;
  fgtsRecent: boolean;
  fgtsMonths: number | null;
  fgtsReleaseDate: string | null;
}

export function cxSummarizeProperty(analysis: CxPropertyAnalysis): CxPropertySummary {
  const activeLiens = analysis.liens.filter((l) => l.active !== false);
  const clearedLiens = analysis.liens.filter((l) => l.active === false);
  const fgtsDate = cxParseBrDate(analysis.fgtsDate);
  const months = fgtsDate ? cxMonthsSince(fgtsDate) : null;
  let fgtsReleaseDate: string | null = null;
  if (fgtsDate) {
    const d = new Date(fgtsDate);
    d.setFullYear(d.getFullYear() + 3);
    fgtsReleaseDate = d.toLocaleDateString('pt-BR');
  }
  return {
    analysis,
    activeLiens,
    clearedLiens,
    blockingCount: activeLiens.filter(cxIsBlockingLien).length,
    missingMunicipal: !analysis.municipalRegistration,
    fgtsRecent: analysis.fgtsUsed === true && months !== null && months < 36,
    fgtsMonths: months,
    fgtsReleaseDate,
  };
}
