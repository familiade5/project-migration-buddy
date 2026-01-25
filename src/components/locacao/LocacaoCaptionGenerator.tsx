import { LocacaoPropertyData } from '@/types/locacao';
import { Button } from '@/components/ui/button';
import { Copy, Download, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LocacaoCaptionGeneratorProps {
  data: LocacaoPropertyData;
}

export const LocacaoCaptionGenerator = ({ data }: LocacaoCaptionGeneratorProps) => {
  const generateCaption = (): string => {
    const propertyTitle = data.propertyName || `${data.type} em ${data.neighborhood}`;
    const quartos = data.bedrooms || '—';
    const bairro = data.neighborhood || '—';
    const valorAluguel = data.rentPrice || 'Consulte';
    const condominio = data.condominiumFee || '';
    const iptu = data.iptu || '';
    const totalMensal = data.totalMonthly || '';
    const area = data.area || '—';
    const vagas = data.garageSpaces || '—';
    const banheiros = data.bathrooms || '—';
    
    // Build complete address
    const addressParts = [data.fullAddress, data.city, data.state].filter(Boolean);
    const endereco = addressParts.length > 0 
      ? addressParts.join(', ')
      : `${data.neighborhood}, ${data.city} - ${data.state}`;
    
    const nomeCorretor = data.contactName || '—';
    const creci = data.creci?.replace('CRECI ', '') || '—';
    const whatsapp = data.contactPhone || '—';
    
    // Features list
    const featuresList = data.features.length > 0 
      ? data.features.join(', ')
      : 'Características padrão';

    // Build caption with locação structure
    let caption = `🏠 ${propertyTitle} – ${quartos} quartos – ${bairro}

💰 Aluguel Mensal: ${valorAluguel}`;

    if (condominio) {
      caption += `\n🏢 Condomínio: ${condominio}`;
    }
    if (iptu) {
      caption += `\n📋 IPTU: ${iptu}`;
    }
    if (totalMensal) {
      caption += `\n💵 Total Mensal: ${totalMensal}`;
    }

    caption += `

☑️ ${quartos} quartos
☑️ ${banheiros} banheiros
☑️ ${area} m²
☑️ ${vagas} vaga(s) de garagem`;

    if (data.furnished) {
      caption += `\n☑️ Mobiliado`;
    }
    if (data.acceptsPets) {
      caption += `\n🐾 Aceita pets`;
    }

    if (data.features.length > 0) {
      caption += `\n\n✨ Diferenciais: ${featuresList}`;
    }

    if (data.depositMonths) {
      caption += `\n\n📝 Caução: ${data.depositMonths} meses`;
    }
    if (data.contractDuration) {
      caption += `\n📄 Contrato: ${data.contractDuration}`;
    }

    caption += `\n\n📍 Localização: ${endereco}`;

    if (data.availableFrom) {
      caption += `\n\n📅 ${data.availableFrom}`;
    }

    caption += `\n\n👨‍💼 ${nomeCorretor} | CRECI ${creci}
📱 ${whatsapp}`;

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
    link.download = `legenda-locacao-${data.propertyName || 'imovel'}.txt`;
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
          Legenda Instagram/Facebook
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
        💡 Dica: Preencha todos os campos para uma legenda completa.
      </p>
    </div>
  );
};
