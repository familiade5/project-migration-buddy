import { useState, useEffect } from 'react';
import { AMPropertyData } from '@/types/apartamentosManaus';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/formatCurrency';

interface AMCaptionGeneratorProps {
  data: AMPropertyData;
}

function buildCaption(data: AMPropertyData): string {
  const lines: string[] = [];

  // Line 1 — title
  const titleParts = [data.title].filter(Boolean);
  if (data.bedrooms > 0) titleParts.push(`${data.bedrooms} ${data.bedrooms === 1 ? 'Quarto' : 'Quartos'}`);
  if (data.neighborhood) titleParts.push(data.neighborhood);
  lines.push(`🏢 ${titleParts.join(' - ')}`);
  lines.push('');

  // Pricing
  if (data.isRental) {
    if (data.rentalPrice > 0) {
      lines.push(`💰 Valor de Locação ${formatCurrency(data.rentalPrice)}/mês`);
    }
  } else {
    if (data.salePrice > 0) {
      const financing = data.acceptsFinancing
        ? `Aceita financiamento${data.acceptsFGTS ? ' e FGTS' : ''}`
        : 'À vista';
      lines.push(`💰 Valor de Venda de ${formatCurrency(data.salePrice)} ${financing}`);
    }
    if (data.subsidy > 0) {
      lines.push(`💰 Subsídio de até ${formatCurrency(data.subsidy)} - dependendo da renda`);
    }
  }
  lines.push('');

  // Specs
  if (data.bedrooms > 0) lines.push(`✅ ${data.bedrooms} ${data.bedrooms === 1 ? 'quarto' : 'quartos'}`);
  if (data.suites > 0) lines.push(`✅ ${data.suites} ${data.suites === 1 ? 'suíte' : 'suítes'}`);
  if (data.floor) lines.push(`✅ ${data.floor}° Andar`);
  if (data.rooms) {
    data.rooms.split('\n').map(r => r.trim()).filter(Boolean).forEach(r => lines.push(`✅ ${r}`));
  }
  if (data.garageSpaces > 0) lines.push(`✅ ${data.garageSpaces} ${data.garageSpaces === 1 ? 'vaga de garagem' : 'vagas de garagem'}`);
  if (data.area > 0) lines.push(`✅ ${data.area}m²`);
  lines.push('');

  // Condo / features
  if (data.condominiumFee > 0 && data.condoIncludes) {
    lines.push(`✅ Baixo custo de condomínio, incluso ${data.condoIncludes}`);
    lines.push('');
  } else if (data.condominiumFee > 0) {
    lines.push(`✅ Condomínio ${formatCurrency(data.condominiumFee)}/mês`);
    lines.push('');
  }

  // Leisure
  if (data.leisureItems) {
    lines.push(`✅ Área de lazer completa`);
    lines.push('');
  }

  // Location
  const locationParts: string[] = [];
  if (data.address) locationParts.push(data.address);
  if (data.neighborhood) locationParts.push(`${data.neighborhood} Manaus/AM`);
  else locationParts.push('Manaus/AM');
  if (data.referencePoint) locationParts.push(data.referencePoint);
  lines.push(`📍 Localização: ${locationParts.join(' – ')}`);
  lines.push('');

  // Contact
  if (data.brokerName) {
    lines.push(`👨‍💼 ${data.brokerName} | Corretor de Imóveis`);
    lines.push(`Creci 3968 PF`);
  }
  if (data.brokerPhone) {
    lines.push(`📞 ${data.brokerPhone} (WhatsApp)`);
  }
  lines.push(`🌐 https://www.facebook.com/ApartamentosManaus`);
  lines.push(`🌐 www.apartamentosmanaus.com`);

  return lines.join('\n');
}

export function AMCaptionGenerator({ data }: AMCaptionGeneratorProps) {
  const [caption, setCaption] = useState(() => buildCaption(data));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCaption(buildCaption(data));
  }, [data]);

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

  const handleRegenerate = () => {
    setCaption(buildCaption(data));
    toast.success('Legenda atualizada!');
  };

  return (
    <div className="space-y-3">
      <Textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="min-h-[320px] text-sm font-mono border-gray-300 bg-white text-gray-900 resize-none leading-relaxed"
        placeholder="Preencha os dados do imóvel para gerar a legenda..."
      />
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRegenerate}
          className="gap-2 flex-1"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </Button>
        <Button
          size="sm"
          onClick={handleCopy}
          className="gap-2 flex-1 text-white"
          style={{ backgroundColor: copied ? '#16a34a' : '#1B5EA6' }}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copiado!' : 'Copiar legenda'}
        </Button>
      </div>
    </div>
  );
}
