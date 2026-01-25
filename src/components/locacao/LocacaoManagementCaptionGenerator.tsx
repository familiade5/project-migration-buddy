import { LocacaoManagementData } from '@/types/locacao';
import { Button } from '@/components/ui/button';
import { Copy, Download, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LocacaoManagementCaptionGeneratorProps {
  data: LocacaoManagementData;
}

export const LocacaoManagementCaptionGenerator = ({ data }: LocacaoManagementCaptionGeneratorProps) => {
  const generateCaption = (): string => {
    const headline = data.headline || 'Gestão Profissional de Locação';
    const subheadline = data.subheadline || '';
    const nomeCorretor = data.contactName || '—';
    const creci = data.creci?.replace('CRECI ', '') || '—';
    const whatsapp = data.contactPhone || '—';
    const yearsExp = data.yearsExperience || '';
    const propertiesManaged = data.propertiesManaged || '';
    
    // Build caption with management structure
    let caption = `🏢 ${headline}

${subheadline}`;

    // Benefits section
    if (data.benefits.length > 0) {
      caption += `\n\n✅ O que fazemos por você:`;
      data.benefits.forEach(benefit => {
        caption += `\n☑️ ${benefit}`;
      });
    }

    // Trust signals
    if (yearsExp || propertiesManaged) {
      caption += `\n\n📊 Nossa experiência:`;
      if (yearsExp) {
        caption += `\n⏱️ ${yearsExp} anos de mercado`;
      }
      if (propertiesManaged) {
        caption += `\n🏠 ${propertiesManaged} imóveis administrados`;
      }
    }

    // Value proposition
    caption += `\n\n💼 Administração completa do seu imóvel
🔒 Segurança e tranquilidade para proprietários
📈 Maximize seus rendimentos com gestão profissional`;

    // Call to action
    caption += `\n\n📞 Solicite uma proposta sem compromisso!`;

    // Contact info
    caption += `\n\n👨‍💼 ${nomeCorretor}`;
    if (creci !== '—') {
      caption += ` | CRECI ${creci}`;
    }
    caption += `\n📱 ${whatsapp}`;

    // Hashtags
    caption += `\n\n#gestãodeimóveis #administraçãodelocação #imobiliária #locação #aluguel #investimentoimobiliário`;

    return caption;
  };

  const caption = generateCaption();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      toast({
        title: 'Copiado!',
        description: 'Legenda copiada para a área de transferência.',
      });
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível copiar a legenda.',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([caption], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `legenda-gestao-locacao.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Download iniciado!',
      description: 'Legenda salva como arquivo de texto.',
    });
  };

  return (
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: '#6b7280' }} />
        <h3 className="font-semibold text-sm sm:text-base" style={{ color: '#111827' }}>
          Legenda Gestão de Locação
        </h3>
      </div>

      {/* Caption Preview */}
      <div 
        className="p-4 rounded-xl font-mono text-sm whitespace-pre-wrap max-h-64 overflow-y-auto"
        style={{ 
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          color: '#334155',
          lineHeight: 1.6,
        }}
      >
        {caption}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm px-3 sm:px-4 flex-1 sm:flex-none"
        >
          <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Copiar
        </Button>
        <Button
          size="sm"
          onClick={handleDownload}
          className="bg-gray-700 hover:bg-gray-800 text-white text-xs sm:text-sm px-3 sm:px-4 flex-1 sm:flex-none"
        >
          <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Baixar
        </Button>
      </div>

      {/* Tip */}
      <p className="text-xs" style={{ color: '#94a3b8' }}>
        💡 Dica: Preencha os benefícios e credenciais para uma legenda mais completa.
      </p>
    </div>
  );
};
