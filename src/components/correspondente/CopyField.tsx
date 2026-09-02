import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface CopyFieldProps {
  label: string;
  value: string;
}

export function CopyField({ label, value }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
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
    setCopied(true);
    toast.success(`${label} copiado`);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group w-full text-left flex items-start justify-between gap-3 px-3 py-2.5 rounded-lg border border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50 transition-colors"
    >
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">{label}</p>
        <p className="text-sm font-medium text-gray-900 break-words">{value}</p>
      </div>
      <span className="flex-shrink-0 mt-1 text-gray-400 group-hover:text-gray-700">
        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
      </span>
    </button>
  );
}
