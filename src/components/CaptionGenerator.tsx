import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Download, Check, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { PropertyData } from '@/types/property';
import { useCrecis } from '@/hooks/useCrecis';
import { buildVdhCaption } from '@/lib/vdhCaption';

interface CaptionGeneratorProps {
  data: PropertyData;
}

export const CaptionGenerator = ({ data }: CaptionGeneratorProps) => {
  const [copied, setCopied] = useState(false);
  const { crecis, formatCreci } = useCrecis();

  const caption = useMemo(
    () => buildVdhCaption(data, crecis, formatCreci),
    [data, crecis, formatCreci],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      toast.success('Legenda copiada para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Erro ao copiar legenda');
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([caption], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `legenda-${data.propertyName || data.neighborhood || 'imovel'}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Legenda baixada com sucesso!');
    } catch {
      toast.error('Erro ao baixar legenda');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base text-gray-800 flex items-center gap-2">
          <FileText className="w-5 h-5" style={{ color: '#c9a84c' }} />
          Legenda do Post
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2 border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado!' : 'Copiar'}
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            className="gap-2 text-white"
            style={{ backgroundColor: '#1a3a6b' }}
          >
            <Download className="w-4 h-4" />
            Baixar .txt
          </Button>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-h-[400px] overflow-y-auto">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
          {caption}
        </pre>
      </div>

      <p className="text-xs text-gray-400 text-center">
        💡 Preencha os campos do formulário para gerar a legenda automaticamente
      </p>
    </div>
  );
};
