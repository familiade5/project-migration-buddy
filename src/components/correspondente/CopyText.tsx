import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

export async function cxCopyToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const el = document.createElement('textarea');
    el.value = value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}

interface CopyTextProps {
  value?: string | null;
  label?: string;
  className?: string;
  emptyText?: string;
}

/** Texto clicável: um clique copia o conteúdo. */
export function CopyText({ value, label, className = '', emptyText = '—' }: CopyTextProps) {
  const [copied, setCopied] = useState(false);
  const text = (value || '').trim();

  if (!text) return <span className={className}>{emptyText}</span>;

  const handleCopy = async () => {
    await cxCopyToClipboard(text);
    setCopied(true);
    toast.success(`${label || 'Texto'} copiado`);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Clique para copiar"
      className={`group inline-flex items-start gap-1.5 text-left rounded-md px-1 -mx-1 hover:bg-slate-100 transition-colors ${className}`}
    >
      <span className="break-words">{text}</span>
      <span className="flex-shrink-0 mt-0.5 text-slate-300 group-hover:text-slate-600">
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      </span>
    </button>
  );
}
