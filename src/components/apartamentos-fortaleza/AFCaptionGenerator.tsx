import { useState, useEffect } from 'react';
import { AFPropertyData } from '@/types/apartamentosFortaleza';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/formatCurrency';

interface AFCaptionGeneratorProps {
  data: AFPropertyData;
}

function buildCaption(data: AFPropertyData): string {
  const lines: string[] = [];

  const titleParts = [data.title].filter(Boolean);
  if (data.bedrooms > 0) titleParts.push(`${data.bedrooms} ${data.bedrooms === 1 ? 'Quarto' : 'Quartos'}`);
  if (data.neighborhood) titleParts.push(data.neighborhood);
  lines.push(`🏢 ${titleParts.join(' - ')}`);
  lines.push('');

  if (data.isRental) {
    if (data.rentalPrice > 0) lines.push(`💰 Valor de Locação ${formatCurrency(data.rentalPrice)}/mês`);
  } else {
    if (data.salePrice > 0) {
      const financing = data.acceptsFinancing
        ? `Aceita financiamento${data.acceptsFGTS ? ' e FGTS' : ''}`
        : 'À vista';
      lines.push(`💰 Valor de Venda de ${formatCurrency(data.salePrice)} ${financing}`);
    }
    if (data.subsidy > 0) lines.push(`💰 Subsídio de até ${formatCurrency(data.subsidy)} - dependendo da renda`);
  }
  lines.push('');

  if (data.bedrooms > 0) lines.push(`✅ ${data.bedrooms} ${data.bedrooms === 1 ? 'quarto' : 'quartos'}`);
  if (data.suites > 0) lines.push(`✅ ${data.suites} ${data.suites === 1 ? 'suíte' : 'suítes'}`);
  if (data.floor) lines.push(`✅ ${data.floor}° Andar`);
  if (data.rooms) {
    data.rooms.split('\n').map(r => r.trim()).filter(Boolean).forEach(r => lines.push(`✅ ${r}`));
  }
  if (data.garageSpaces > 0) lines.push(`✅ ${data.garageSpaces} ${data.garageSpaces === 1 ? 'vaga de garagem' : 'vagas de garagem'}`);
  if (data.area > 0) lines.push(`✅ ${data.area}m²`);
  lines.push('');

  if (data.condominiumFee > 0 && data.condoIncludes) {
    lines.push(`✅ Baixo custo de condomínio, incluso ${data.condoIncludes}`);
    lines.push('');
  } else if (data.condominiumFee > 0) {
    lines.push(`✅ Condomínio ${formatCurrency(data.condominiumFee)}/mês`);
    lines.push('');
  }

  if (data.leisureItems) {
    lines.push(`✅ Área de lazer completa`);
    lines.push('');
  }

  const locationParts: string[] = [];
  if (data.address) locationParts.push(data.address);
  if (data.referencePoint) locationParts.push(data.referencePoint);
  if (locationParts.length > 0) lines.push(`📍 Localização: ${locationParts.join(' – ')}`);
  lines.push('');

  if (data.brokerName) {
    lines.push(`👨‍💼 ${data.brokerName} | Corretor de Imóveis`);
    if (data.creci) lines.push(data.creci);
  }
  if (data.brokerPhone) lines.push(`📞 ${data.brokerPhone} (WhatsApp)`);
  lines.push(`🌐 www.apartamentosfortaleza.com.br`);

  return lines.join('\n');
}

export function AFCaptionGenerator({ data }: AFCaptionGeneratorProps) {
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
        <Button variant="outline" size="sm" onClick={handleRegenerate} className="gap-2 flex-1">
          <RefreshCw className="w-4 h-4" />Atualizar
        </Button>
        <Button size="sm" onClick={handleCopy} className="gap-2 flex-1 text-white"
          style={{ backgroundColor: copied ? '#16a34a' : '#0C7B8E' }}>
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copiado!' : 'Copiar legenda'}
        </Button>
      </div>
    </div>
  );
}
