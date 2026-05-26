import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Download, Check, FileText, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { PropertyData } from '@/types/property';
import { useCrecis } from '@/hooks/useCrecis';
import { buildVdhCaption } from '@/lib/vdhCaption';
import { sanitizeCaptionForOlx } from '@/lib/olxCaption';

interface CaptionGeneratorProps {
  data: PropertyData;
}

export const CaptionGenerator = ({ data }: CaptionGeneratorProps) => {
  const [copied, setCopied] = useState(false);
  const [canalProCopied, setCanalProCopied] = useState(false);
  const { crecis, formatCreci } = useCrecis();

  const caption = useMemo(
    () => buildVdhCaption(data, crecis, formatCreci),
    [data, crecis, formatCreci],
  );

  const [canalProCaption, setCanalProCaption] = useState(() => sanitizeCaptionForOlx(caption));
  const [canalProEdited, setCanalProEdited] = useState(false);

  // Regenerate canal pro caption when caption changes (if not manually edited)
  useEffect(() => {
    if (!canalProEdited) {
      setCanalProCaption(sanitizeCaptionForOlx(caption));
    }
  }, [caption, canalProEdited]);

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

  const handleCopyCanalPro = async () => {
    try {
      await navigator.clipboard.writeText(canalProCaption);
      setCanalProCopied(true);
      toast.success('Legenda Canal Pro copiada!');
      setTimeout(() => setCanalProCopied(false), 2000);
    } catch {
      toast.error('Erro ao copiar');
    }
  };

  const handleRegenerateCanalPro = () => {
    setCanalProCaption(sanitizeCaptionForOlx(caption));
    setCanalProEdited(false);
    toast.success('Legenda Canal Pro regenerada!');
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
    <div className="space-y-6">
      {/* Instagram caption */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5" style={{ color: '#c9a84c' }} />
            Legenda Instagram
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

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-h-[300px] overflow-y-auto">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
            {caption}
          </pre>
        </div>
      </div>

      {/* Canal Pro caption */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gray-800">
            Legenda Canal Pro (OLX / ZAP / VivaReal)
          </h3>
          <span className="text-xs text-gray-400">{canalProCaption.trim().length} caracteres</span>
        </div>
        <div className="rounded-xl p-3 bg-amber-50 border border-amber-200">
          <p className="text-xs text-amber-800 mb-2">
            Sem emojis e sem telefone — os portais não renderizam emojis e possuem canal de contato próprio.
          </p>
          <textarea
            value={canalProCaption}
            onChange={(e) => {
              setCanalProCaption(e.target.value);
              setCanalProEdited(true);
            }}
            className="w-full min-h-[180px] text-sm font-mono border border-gray-300 rounded-lg bg-white text-gray-900 resize-none leading-relaxed p-3 focus:outline-none focus:ring-2 focus:ring-amber-300"
            placeholder="Legenda sem emojis e sem telefone..."
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerateCanalPro}
            className="gap-2 flex-1"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerar do Instagram
          </Button>
          <Button
            size="sm"
            onClick={handleCopyCanalPro}
            className="gap-2 flex-1 text-white"
            style={{ backgroundColor: canalProCopied ? '#16a34a' : '#c9a84c' }}
          >
            {canalProCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {canalProCopied ? 'Copiado!' : 'Copiar Canal Pro'}
          </Button>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        💡 Preencha os campos do formulário para gerar a legenda automaticamente
      </p>
    </div>
  );
};
