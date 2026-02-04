import { useState } from 'react';
import { EducationalPostData, categoryLabels } from '@/types/educational';
import { Button } from '@/components/ui/button';
import { Copy, Download, Check, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface EducationalCaptionGeneratorProps {
  data: EducationalPostData;
}

export const EducationalCaptionGenerator = ({ data }: EducationalCaptionGeneratorProps) => {
  const [copied, setCopied] = useState(false);

  const generateCaption = (): string => {
    const lines: string[] = [];
    
    // Get the cover slide headline
    const coverSlide = data.slides.find(s => s.type === 'cover');
    if (coverSlide) {
      lines.push(coverSlide.headline.replace(/\n/g, ' '));
      lines.push('');
    }

    // Add content from each slide
    data.slides.forEach((slide, index) => {
      if (slide.type === 'cover') return; // Already added
      if (slide.type === 'cta') return; // Skip CTA in caption

      if (slide.bullets) {
        lines.push(`📌 ${slide.headline}`);
        slide.bullets.forEach(bullet => {
          lines.push(`✅ ${bullet}`);
        });
        lines.push('');
      } else if (slide.body) {
        if (slide.type === 'highlight') {
          lines.push(`⭐ ${slide.headline}`);
        } else {
          lines.push(`💡 ${slide.headline}`);
        }
        lines.push(slide.body);
        lines.push('');
      }
    });

    // Add CTA
    lines.push('---');
    lines.push('');
    lines.push('📲 Quer saber mais? Chama no Direct ou clica no link da bio!');
    lines.push('');
    
    // Contact info
    if (data.contactName) {
      lines.push(`👤 ${data.contactName}`);
    }
    if (data.contactPhone) {
      lines.push(`📱 ${data.contactPhone}`);
    }
    lines.push('');

    // Hashtags based on category
    const hashtags = getHashtags(data.category);
    lines.push(hashtags);

    return lines.join('\n');
  };

  const getHashtags = (category: string): string => {
    const baseHashtags = '#imoveiscaixa #casapropria #investimentoimobiliario';
    
    const categoryHashtags: Record<string, string> = {
      tips: '#dicasimobiliarias #educacaofinanceira #financiamentoimobiliario',
      process: '#assessoriaimobiliaria #compradeimovel #seguranca',
      stories: '#historiareal #sonhorealizado #clientefeliz',
      institutional: '#especialistas #imobiliaria #confianca',
    };

    return `${baseHashtags} ${categoryHashtags[category] || ''}`;
  };

  const caption = generateCaption();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      toast.success('Legenda copiada!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Erro ao copiar');
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([caption], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `legenda-educativo-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Legenda baixada!');
    } catch {
      toast.error('Erro ao baixar');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#BA9E72]" />
          Legenda do Post
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? 'Copiado!' : 'Copiar'}
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            className="gap-2 bg-[#BA9E72] hover:bg-[#a68d64] text-white"
          >
            <Download className="w-4 h-4" />
            Baixar
          </Button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 max-h-[350px] overflow-y-auto">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
          {caption}
        </pre>
      </div>

      <p className="text-xs text-gray-500 text-center">
        💡 A legenda é gerada automaticamente com base no conteúdo dos slides
      </p>
    </div>
  );
};
