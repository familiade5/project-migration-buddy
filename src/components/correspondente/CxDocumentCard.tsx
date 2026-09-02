import { Button } from '@/components/ui/button';
import { CxDocument, CX_DOC_LABEL, CxExtraction } from '@/types/correspondente';
import { CopyField } from './CopyField';
import { ExternalLink, Loader2, RefreshCw, Trash2, FileText, AlertCircle } from 'lucide-react';

interface Props {
  doc: CxDocument;
  onOpen: (doc: CxDocument) => void;
  onDelete: (doc: CxDocument) => void;
  onRetry: (doc: CxDocument) => void;
}

export function CxDocumentCard({ doc, onOpen, onDelete, onRetry }: Props) {
  const extraction = doc.extracted as CxExtraction;
  const groups = Array.isArray(extraction?.groups) ? extraction.groups : [];

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3 min-w-0">
          <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{CX_DOC_LABEL(doc.doc_type)}</p>
            <p className="text-[11px] text-gray-500 truncate">{doc.file_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {doc.status === 'processing' && (
            <span className="flex items-center gap-1.5 text-xs text-blue-600 mr-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Lendo…
            </span>
          )}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500" onClick={() => onOpen(doc)}>
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-500"
            disabled={doc.status === 'processing'}
            onClick={() => onRetry(doc)}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
            onClick={() => onDelete(doc)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {doc.status === 'error' && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{doc.error_message || 'Falha ao ler o documento.'}</span>
          </div>
        )}

        {doc.status === 'processing' && (
          <p className="text-sm text-gray-500">Extraindo informações com IA…</p>
        )}

        {doc.status === 'done' && groups.length === 0 && (
          <p className="text-sm text-gray-500">Nenhum dado identificado neste documento.</p>
        )}

        {groups.map((group, gi) => (
          <div key={`${group.title}-${gi}`} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{group.title}</p>
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
