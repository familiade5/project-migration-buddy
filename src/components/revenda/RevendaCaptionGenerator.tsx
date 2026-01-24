import { RevendaPropertyData } from '@/types/revenda';
import { Button } from '@/components/ui/button';
import { Copy, Download, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RevendaCaptionGeneratorProps {
  data: RevendaPropertyData;
}

export const RevendaCaptionGenerator = ({ data }: RevendaCaptionGeneratorProps) => {
  // Generate the fixed-structure caption
  const generateCaption = (): string => {
    const propertyTitle = data.propertyName || `${data.type} em ${data.neighborhood}`;
    const quartos = data.bedrooms || '—';
    const bairro = data.neighborhood || '—';
    const valorVenda = data.price || 'Consulte';
    const condicao = data.condicaoFinanciamento || 'Aceita financiamento';
    const subsidio = data.subsidioOuEntrada || '';
    const andarOuTipo = data.andarOuTipo || data.type || '—';
    const area = data.area || '—';
    const vagas = data.garageSpaces || '—';
    const lazerList = data.itensLazer || [];
    const featuresList = data.features || [];
    const itensLazer = lazerList.length > 0 
      ? lazerList.join(', ')
      : featuresList.slice(0, 5).join(', ') || 'Área de lazer completa';
    const endereco = data.fullAddress || `${data.neighborhood}, ${data.city} - ${data.state}`;
    const nomeCorretor = data.contactName || '—';
    const creci = data.creci?.replace('CRECI ', '') || '—';
    const whatsapp = data.contactPhone || '—';
    const facebook = data.facebookUrl || '';
    const site = data.siteUrl || '';
    const cep = data.cep || '';

    // Build caption with EXACT structure
    let caption = `📣 ${propertyTitle} ${quartos} quartos – ${bairro}

💰 Valor de Venda: ${valorVenda} – ${condicao}`;

    if (subsidio) {
      caption += `\n💰 ${subsidio}`;
    }

    caption += `

☑️ ${quartos} quartos
☑️ ${andarOuTipo} – ${area} m²
☑️ ${vagas} vaga(s) de garagem

☑️ Lazer completo incluindo: ${itensLazer}

🔜 Localização: ${endereco}

👨‍💼 ${nomeCorretor} | Corretor de Imóveis – CRECI ${creci}
📱 ${whatsapp}`;

    if (facebook) {
      caption += `\n${facebook}`;
    }
    if (site) {
      caption += `\n${site}`;
    }
    if (cep) {
      caption += `\n${cep}`;
    }

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
    link.download = `legenda-${data.propertyName || 'imovel'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Download iniciado!',
      description: 'Legenda salva como arquivo de texto.',
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" style={{ color: '#0ea5e9' }} />
          <h3 className="font-semibold" style={{ color: '#0f172a' }}>
            Legenda Instagram/Facebook
          </h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <Copy className="w-4 h-4 mr-1" />
            Copiar
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            className="bg-sky-500 hover:bg-sky-600 text-white"
          >
            <Download className="w-4 h-4 mr-1" />
            Baixar
          </Button>
        </div>
      </div>

      {/* Caption Preview */}
      <div 
        className="p-4 rounded-xl font-mono text-sm whitespace-pre-wrap"
        style={{ 
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          color: '#334155',
          lineHeight: 1.6,
        }}
      >
        {caption}
      </div>

      {/* Tip */}
      <p className="text-xs" style={{ color: '#94a3b8' }}>
        💡 Dica: Preencha os campos de Lazer, CEP e Links nas configurações para uma legenda completa.
      </p>
    </div>
  );
};
