import { Sparkles, X } from "lucide-react";

export type Suggestion = { id: string; title: string; content: string; confidence: number };

export function QuickReplySuggestion({
  suggestion, onUse, onDismiss,
}: {
  suggestion: Suggestion;
  onUse: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="mx-3 mt-2 mb-1 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 flex items-start gap-2 animate-in fade-in slide-in-from-bottom-2">
      <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[11px] font-semibold text-emerald-800">Sugestão IA: {suggestion.title}</p>
          <span className="text-[9px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded">
            {Math.round(suggestion.confidence * 100)}%
          </span>
        </div>
        <p className="text-xs text-gray-700 line-clamp-2 mt-0.5 whitespace-pre-wrap">{suggestion.content}</p>
        <button
          onClick={onUse}
          className="mt-1.5 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 underline"
        >
          Usar esta resposta →
        </button>
      </div>
      <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}