import { useEffect, useMemo, useState } from 'react';
import { CxDocument, CX_DOC_LABEL, CxExtraction } from '@/types/correspondente';
import { CxDocumentCard } from './CxDocumentCard';
import { CxBankIncomeSummary } from './CxBankIncomeSummary';
import { CxIrpfSummary } from './CxIrpfSummary';
import { CxPropertySummary } from './CxPropertySummary';

import { cxGetBankAnalysis } from '@/lib/cxIncome';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  Layers,
} from 'lucide-react';

interface Props {
  documents: CxDocument[];
  onOpen: (doc: CxDocument) => void;
  onDownload: (doc: CxDocument) => void;
  onDelete: (doc: CxDocument) => void;
  onRetry: (doc: CxDocument) => void;
  onUpdateExtraction?: (doc: CxDocument, extraction: CxExtraction) => void;
}

const BRAND = '#1a3a6b';

type Group = {
  type: string;
  label: string;
  docs: CxDocument[];
  status: 'done' | 'processing' | 'error' | 'pending';
};

function groupStatus(docs: CxDocument[]): Group['status'] {
  if (docs.some((d) => d.status === 'error')) return 'error';
  if (docs.some((d) => d.status === 'processing')) return 'processing';
  if (docs.every((d) => d.status === 'done')) return 'done';
  return 'pending';
}

function StatusDot({ status }: { status: Group['status'] }) {
  if (status === 'processing') return <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />;
  if (status === 'error') return <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
  if (status === 'done') return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
  return <FileText className="w-3.5 h-3.5 text-slate-400" />;
}

export function CxDocumentWorkspace({
  documents,
  onOpen,
  onDownload,
  onDelete,
  onRetry,
  onUpdateExtraction,
}: Props) {
  const groups: Group[] = useMemo(() => {
    const map = new Map<string, CxDocument[]>();
    documents.forEach((d) => {
      const arr = map.get(d.doc_type) ?? [];
      arr.push(d);
      map.set(d.doc_type, arr);
    });
    return Array.from(map.entries()).map(([type, docs]) => ({
      type,
      label: CX_DOC_LABEL(type),
      docs,
      status: groupStatus(docs),
    }));
  }, [documents]);

  const [activeType, setActiveType] = useState<string | null>(null);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  useEffect(() => {
    if (groups.length === 0) {
      setActiveType(null);
      return;
    }
    if (!activeType || !groups.some((g) => g.type === activeType)) {
      setActiveType(groups[0].type);
    }
  }, [groups, activeType]);

  const activeGroup = groups.find((g) => g.type === activeType) ?? null;

  useEffect(() => {
    if (!activeGroup) return;
    if (!activeDocId || !activeGroup.docs.some((d) => d.id === activeDocId)) {
      setActiveDocId(activeGroup.docs[0]?.id ?? null);
    }
  }, [activeGroup, activeDocId]);

  const activeDoc = activeGroup?.docs.find((d) => d.id === activeDocId) ?? activeGroup?.docs[0] ?? null;

  if (documents.length === 0) return null;

  return (
    <div className="grid gap-4 lg:grid-cols-[236px_minmax(0,1fr)]">
      {/* Rail de tipos */}
      <aside className="lg:sticky lg:top-4 lg:self-start">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center gap-2">
            <Layers className="w-4 h-4" style={{ color: BRAND }} />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Documentos ({documents.length})
            </p>
          </div>
          <div className="p-2 flex gap-2 overflow-x-auto lg:block lg:space-y-1 lg:overflow-visible lg:max-h-[70vh] lg:overflow-y-auto">
            {groups.map((g) => {
              const active = g.type === activeType;
              return (
                <button
                  key={g.type}
                  onClick={() => setActiveType(g.type)}
                  className={`group w-auto lg:w-full flex-shrink-0 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
                    active
                      ? 'bg-[#1a3a6b] text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 ${
                      active ? 'bg-white/15' : 'bg-slate-100'
                    }`}
                  >
                    <StatusDot status={g.status} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-[13px] font-semibold truncate ${active ? 'text-white' : 'text-slate-800'}`}>
                      {g.label}
                    </span>
                    <span className={`block text-[10.5px] ${active ? 'text-white/70' : 'text-slate-400'}`}>
                      {g.docs.length} arquivo{g.docs.length > 1 ? 's' : ''}
                    </span>
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 flex-shrink-0 hidden lg:block ${active ? 'text-white/80' : 'text-slate-300'}`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Painel do documento ativo */}
      <div className="min-w-0 space-y-3">
        {activeGroup?.type === 'extrato_bancario' && (
          <CxBankIncomeSummary documents={documents} />
        )}

        {activeGroup?.type === 'imposto_renda' && <CxIrpfSummary documents={documents} />}

        {activeGroup && activeGroup.docs.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {activeGroup.docs.map((d, i) => {
              const bank = cxGetBankAnalysis(d);
              const label = bank?.period || d.file_name;
              const on = d.id === activeDoc?.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setActiveDocId(d.id)}
                  className={`px-3 py-1.5 rounded-full text-[11.5px] font-semibold border transition-colors max-w-[240px] truncate ${
                    on
                      ? 'bg-[#1a3a6b] text-white border-[#1a3a6b]'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                  title={d.file_name}
                >
                  {i + 1}. {label}
                </button>
              );
            })}
          </div>
        )}

        {activeDoc && (
          <CxDocumentCard
            key={activeDoc.id}
            doc={activeDoc}
            onOpen={onOpen}
            onDownload={onDownload}
            onDelete={onDelete}
            onRetry={onRetry}
            onUpdateExtraction={onUpdateExtraction}
          />
        )}
      </div>
    </div>
  );
}
