import { useState } from 'react';
import { PropertyData } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Copy, Download, Check, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface CaptionGeneratorProps {
  data: PropertyData;
}

export const CaptionGenerator = ({ data }: CaptionGeneratorProps) => {
  const [copied, setCopied] = useState(false);

  const generateCaption = (): string => {
    const lines: string[] = [];

    if (data.propertyName && data.propertyName !== '') {
      lines.push(`🏡 ${data.propertyName.toUpperCase()}`);
    } else if (data.neighborhood && data.neighborhood !== '') {
      lines.push(`🏡 ${data.type.toUpperCase()} - ${data.neighborhood.toUpperCase()}`);
    } else {
      lines.push(`🏡 ${data.type.toUpperCase()} - ${data.city.toUpperCase()}`);
    }
    lines.push('');

    lines.push(`💰 Valor de Avaliação: ${data.evaluationValue}`);
    lines.push(`🔥 Valor Mínimo de Venda: ${data.minimumValue} (desconto de ${data.discount}%)`);
    lines.push('');

    lines.push(`💵 ${data.paymentMethod}`);
    
    if (data.acceptsFGTS) {
      lines.push('💼 Aceita FGTS');
    } else {
      lines.push('❌ Não Aceita FGTS');
    }
    if (data.acceptsFinancing) {
      lines.push('🏦 Aceita Financiamento');
    } else {
      lines.push('❌ Não Aceita Financiamento');
    }
    
    if (data.hasEasyEntry && data.entryValue) {
      lines.push(`📥 Entrada Facilitada: ${data.entryValue}`);
    } else if (data.hasEasyEntry) {
      lines.push('📥 Entrada Facilitada');
    }
    lines.push('');

    lines.push('📌 Características do Imóvel:');
    lines.push(`🏠 Tipo: ${data.type}`);
    
    if (data.bedrooms && data.bedrooms !== '0') {
      lines.push(`🛏️ ${data.bedrooms} Quarto${Number(data.bedrooms) > 1 ? 's' : ''}`);
    }
    if (data.hasSala) lines.push('🛋️ Sala');
    if (data.hasCozinha) lines.push('🍽️ Cozinha');
    if (data.bathrooms && data.bathrooms !== '0') {
      lines.push(`🚿 ${data.bathrooms} Banheiro${Number(data.bathrooms) > 1 ? 's' : ''}`);
    }
    if (data.hasAreaServico) lines.push('🧺 Área de Serviço');
    if (data.garageSpaces && data.garageSpaces !== '0') {
      lines.push(`🚗 ${data.garageSpaces} Vaga${Number(data.garageSpaces) > 1 ? 's' : ''} de Garagem`);
    }
    
    data.features.forEach(feature => {
      if (feature !== 'Vaga de Garagem') {
        const emoji = getFeatureEmoji(feature);
        lines.push(`${emoji} ${feature}`);
      }
    });
    lines.push('');

    if (data.areaTotal || data.areaPrivativa || data.areaTerreno || data.area) {
      if (data.areaTotal) lines.push(`📐 Área Total: ${data.areaTotal} m²`);
      if (data.areaPrivativa) lines.push(`📐 Área Privativa: ${data.areaPrivativa} m²`);
      if (data.areaTerreno) lines.push(`📐 Área do Terreno: ${data.areaTerreno} m²`);
      if (data.area && !data.areaTotal && !data.areaPrivativa && !data.areaTerreno) {
        lines.push(`📐 Área: ${data.area} m²`);
      }
      lines.push('');
    }

    lines.push('📍 Endereço:');
    if (data.street) {
      let addressLine = `📍 ${data.street}`;
      if (data.number) addressLine += `, nº ${data.number}`;
      if (data.complement) addressLine += ` – ${data.complement}`;
      lines.push(addressLine);
    }
    lines.push(`📍 ${data.neighborhood}`);
    lines.push(`📍 ${data.city} – ${data.state}`);
    if (data.cep) lines.push(`📮 CEP: ${data.cep}`);
    lines.push('');

    if (data.condominiumRules || data.taxRules) {
      lines.push('⚠️ Regras sobre despesas:');
      if (data.condominiumRules) lines.push(`🏘️ Condomínio: ${data.condominiumRules}`);
      if (data.taxRules) lines.push(`💸 Tributos: ${data.taxRules}`);
      lines.push('');
    }

    lines.push('📞 Mais informações:');
    if (data.selectedBroker === 'almir') {
      // Almir aparece primeiro como Regional, depois repete Iury como Nacional
      lines.push(`👤 Almir Neto - Regional`);
      lines.push(`📄 CRECI 29013 CE`);
      lines.push(`📱 (85) 99271-0485`);
      lines.push('');
      lines.push(`👤 Iury Sampaio - Nacional`);
      lines.push(`📄 CRECI 14851 MS PJ`);
      lines.push(`📱 (92) 98839-1098`);
    } else {
      // Padrão: somente Iury
      if (data.contactName) lines.push(`👤 ${data.contactName}`);
      if (data.creci) lines.push(`📄 ${data.creci}`);
      if (data.contactPhone) lines.push(`📱 ${data.contactPhone}`);
    }

    return lines.join('\n');
  };

  const getFeatureEmoji = (feature: string): string => {
    const emojiMap: Record<string, string> = {
      'Piscina': '🏊', 'Churrasqueira': '🍖', 'Área de Lazer': '🎯',
      'Portaria 24h': '🔐', 'Academia': '💪', 'Ar Condicionado': '❄️',
      'Mobiliado': '🛋️', 'Quintal': '🌳', 'Varanda': '🌅',
      'Elevador': '🛗', 'Pet Friendly': '🐕',
    };
    return emojiMap[feature] || '✨';
  };

  const caption = generateCaption();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      toast.success('Legenda copiada para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
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
    } catch (error) {
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
            className="gap-2 text-white"
            style={{ backgroundColor: '#1a3a6b' }}
          >
            <Download className="w-4 h-4" />
            Baixar .txt
          </Button>
        </div>
      </div>

      {/* Preview da legenda */}
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
