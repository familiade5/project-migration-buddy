import { Button } from '@/components/ui/button';
import { CxDocument, CX_DOC_LABEL, CxExtraction } from '@/types/correspondente';
import { CxBankCreditsTable } from './CxBankCreditsTable';
import { cxGetBankAnalysis } from '@/lib/cxIncome';
import { CopyField } from './CopyField';
import { Eye, Download, Loader2, RefreshCw, Trash2, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  doc: CxDocument;
  onOpen: (doc: CxDocument) => void;
  onDownload: (doc: CxDocument) => void;
  onDelete: (doc: CxDocument) => void;
  onRetry: (doc: CxDocument) => void;
  onUpdateExtraction?: (doc: CxDocument, extraction: CxExtraction) => void;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending: { label: 'Pendente', color: 'text-slate-600', bg: 'bg-slate-100', icon: <FileText className="w-3.5 h-3.5" /> },
  processing: { label: 'Lendo', color: 'text-blue-600', bg: 'bg-blue-50', icon: <Loader2 className="w-3.5 h-3.5 animate-spin" /> },
  done: { label: 'Pronto', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  error: { label: 'Erro', color: 'text-red-600', bg: 'bg-red-50', icon: <AlertCircle className="w-3.5 h-3.5" /> },
};

export function CxDocumentCard({ doc, onOpen, onDownload, onDelete, onRetry, onUpdateExtraction }: Props) {
  const extraction = doc.extracted as CxExtraction;
  const groups = Array.isArray(extraction?.groups) ? extraction.groups : [];
  const bankAnalysis = cxGetBankAnalysis(doc);

  const toggleCredit = (index: number, included: boolean) => {
    if (!bankAnalysis || !onUpdateExtraction) return;
    const credits = bankAnalysis.credits.map((c, i) =>
      i === index ? { ...c, included, reason: included ? 'Ajustado manualmente' : 'Descartado manualmente' } : c,
    );
    onUpdateExtraction(doc, { ...extraction, bankAnalysis: { ...bankAnalysis, credits } });
  };
  const status = STATUS_MAP[doc.status] || STATUS_MAP.pending;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`p-2 rounded-lg ${status.bg} ${status.color}`}>
            {status.icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{CX_DOC_LABEL(doc.doc_type)}</p>
            <p className="text-[11px] text-slate-500 truncate">{doc.file_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`hidden lg:inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.color}`}>
            {status.icon}
            {doc.status === 'done' ? CX_DOC_LABEL(doc.doc_type) : status.label}
          </span>
          <Button
            size="sm"
            className="h-8 gap-1.5 bg-white text-[#1a3a6b] hover:bg-blue-50 border border-[#1a3a6b]/30"
            onClick={() => onOpen(doc)}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Visualizar</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 bg-white text-[#1a3a6b] border-[#1a3a6b]/30 hover:bg-blue-50"
            onClick={() => onDownload(doc)}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Baixar</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Reprocessar leitura"
            className="h-8 w-8 p-0 text-slate-500 hover:text-[#1a3a6b] hover:bg-blue-50"
            disabled={doc.status === 'processing'}
            onClick={() => onRetry(doc)}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Excluir documento"
            className="h-8 w-8 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => onDelete(doc)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {doc.status === 'error' && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{doc.error_message || 'Falha ao ler o documento.'}</span>
          </div>
        )}

        {doc.status === 'processing' && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            Extraindo informações com IA…
          </div>
        )}

        {doc.status === 'done' && groups.length === 0 && (
          <p className="text-sm text-slate-500">Nenhum dado identificado neste documento.</p>
        )}

        {bankAnalysis && (
          <CxBankCreditsTable analysis={bankAnalysis} onToggle={onUpdateExtraction ? toggleCredit : undefined} />
        )}

        {groups.map((group, gi) => (
          <div key={`${group.title}-${gi}`} className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a3a6b]" />
              {group.title}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {group.fields.map((f, fi) => (
                <CopyField key={`${f.label}-${fi}`} label={f.label} value={f.value} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
