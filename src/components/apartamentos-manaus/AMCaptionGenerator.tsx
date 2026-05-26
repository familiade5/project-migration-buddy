import { useState, useEffect } from 'react';
import { AMPropertyData } from '@/types/apartamentosManaus';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/formatCurrency';
import { sanitizeCaptionForOlx } from '@/lib/olxCaption';

interface AMCaptionGeneratorProps {
  data: AMPropertyData;
}

function buildCaption(data: AMPropertyData): string {
  // Modo especial: "Baixou o preço" — usa narrativa de oportunidade
  if (data.priceReduced && !data.isRental && data.salePrice > 0 && (data.oldPrice ?? 0) > 0) {
    return buildPriceReducedCaption(data);
  }
  const lines: string[] = [];

  // Line 1 — title
  const titleParts = [data.title].filter(Boolean);
  if (data.bedrooms > 0) titleParts.push(`${data.bedrooms} ${data.bedrooms === 1 ? 'Quarto' : 'Quartos'}`);
  if (data.neighborhood) titleParts.push(data.neighborhood);
  lines.push(`🏢 ${titleParts.join(' - ')}`);
  if (data.listingCode && data.listingCode.trim()) {
    lines.push(`🔖 Cód. do anúncio: ${data.listingCode.trim()}`);
  }
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
  if (data.bedrooms > 0) {
    const quartoLabel = `${data.bedrooms} ${data.bedrooms === 1 ? 'quarto' : 'quartos'}`;
    if (data.suites > 0) {
      const suiteLabel = `${data.suites} ${data.suites === 1 ? 'suíte' : 'suítes'}`;
      lines.push(`✅ ${quartoLabel} sendo ${suiteLabel}`);
    } else {
      lines.push(`✅ ${quartoLabel}`);
    }
  } else if (data.suites > 0) {
    lines.push(`✅ ${data.suites} ${data.suites === 1 ? 'suíte' : 'suítes'}`);
  }
  if (data.floor) lines.push(`✅ ${data.floor}° Andar`);
  if (data.rooms) {
    data.rooms.split('\n').map(r => r.trim()).filter(Boolean).forEach(r => lines.push(`✅ ${r}`));
  }
  if (data.garageSpaces > 0) lines.push(`✅ ${data.garageSpaces} ${data.garageSpaces === 1 ? 'vaga de garagem' : 'vagas de garagem'}`);
  if (data.area > 0) lines.push(`✅ ${data.area}m²`);
  lines.push('');

  // Condo / features
  if (data.condominiumFee > 0) {
    const includesPart = data.condoIncludes && data.condoIncludes.trim()
      ? ` - incluso ${data.condoIncludes.trim()}`
      : '';
    lines.push(`✅ Taxa de condomínio ${formatCurrency(data.condominiumFee)}${includesPart}`);
    lines.push('');
  } else if (data.condoExempt) {
    lines.push(`✅ Condomínio isento`);
    lines.push('');
  }

  // IPTU
  if (data.iptu > 0) {
    const periodo = data.iptuPeriod ? ` (${data.iptuPeriod.toLowerCase()})` : '';
    lines.push(`✅ IPTU ${formatCurrency(data.iptu)}${periodo}`);
    lines.push('');
  } else if (data.iptuExempt) {
    lines.push(`✅ IPTU isento`);
    lines.push('');
  }

  // Diferenciais do imóvel (Canal Pro)
  const diferenciais: string[] = [];
  if (data.hasAirConditioning) diferenciais.push('Ar-condicionado');
  if (data.hasAmericanKitchen) diferenciais.push('Cozinha americana');
  if (data.hasGourmetBalcony) diferenciais.push('Varanda gourmet');
  if (data.hasCloset) diferenciais.push('Closet');
  if (data.hasFireplace) diferenciais.push('Lareira');
  if (data.hasPets) diferenciais.push('Aceita animais');
  if (data.furnished) diferenciais.push('Mobiliado');
  if (diferenciais.length > 0) {
    lines.push(`✨ Diferenciais: ${diferenciais.join(' • ')}`);
    lines.push('');
  }

  // Estrutura do condomínio
  const condoEstrutura: string[] = [];
  if (data.condoTowers && data.condoTowers > 0) condoEstrutura.push(`${data.condoTowers} ${data.condoTowers === 1 ? 'torre' : 'torres'}`);
  if (data.condoFloors && data.condoFloors > 0) condoEstrutura.push(`${data.condoFloors} andares`);
  if (data.condoUnitsPerFloor && data.condoUnitsPerFloor > 0) condoEstrutura.push(`${data.condoUnitsPerFloor} unidades/andar`);
  if (data.condoBuildYear) condoEstrutura.push(`Construído em ${data.condoBuildYear}`);
  if (condoEstrutura.length > 0) {
    lines.push(`🏗️ Condomínio: ${condoEstrutura.join(' • ')}`);
    lines.push('');
  }

  // Lazer e comodidades do condomínio (estruturado)
  const lazer: string[] = [];
  if (data.amenityPool) lazer.push('Piscina');
  if (data.amenityBBQ) lazer.push('Churrasqueira');
  if (data.amenityPartyHall) lazer.push('Salão de festas');
  if (data.amenityGym) lazer.push('Academia');
  if (data.amenityPlayground) lazer.push('Playground');
  if (data.amenityGourmetSpace) lazer.push('Espaço gourmet');
  if (data.amenityGameRoom) lazer.push('Salão de jogos');
  if (data.amenityCinema) lazer.push('Cinema');
  if (data.amenityGarden) lazer.push('Jardim');
  if (data.amenityMultisportCourt) lazer.push('Quadra poliesportiva');
  if (data.amenityTennisCourt) lazer.push('Quadra de tênis');
  if (data.amenitySquashCourt) lazer.push('Quadra de squash');
  if (data.amenitySauna) lazer.push('Sauna');
  if (data.amenitySpa) lazer.push('Spa');

  const servicos: string[] = [];
  if (data.amenityElevator) servicos.push('Elevador');
  if (data.amenityCoworking) servicos.push('Coworking');
  if (data.amenityLaundry) servicos.push('Lavanderia');
  if (data.amenityBikeRack) servicos.push('Bicicletário');
  if (data.amenityAccessibility) servicos.push('Acesso para deficientes');

  const seguranca: string[] = [];
  if (data.amenity24hConcierge) seguranca.push('Portaria 24h');
  if (data.amenityGatedCommunity) seguranca.push('Condomínio fechado');
  if (data.amenityElectronicGate) seguranca.push('Portão eletrônico');

  if (lazer.length > 0) {
    lines.push(`🏊 Lazer: ${lazer.join(' • ')}`);
  }
  if (servicos.length > 0) {
    lines.push(`🛎️ Serviços: ${servicos.join(' • ')}`);
  }
  if (seguranca.length > 0) {
    lines.push(`🔐 Segurança: ${seguranca.join(' • ')}`);
  }
  if (lazer.length + servicos.length + seguranca.length > 0) {
    lines.push('');
  }

  // Leisure
  if (data.leisureItems && lazer.length === 0) {
    lines.push(`✅ Área de lazer completa`);
    lines.push('');
  }

  // Location — neighborhood is exclusive to the cover slide, not used here
  const locationParts: string[] = [];
  if (data.address) locationParts.push(data.address);
  if (data.referencePoint) locationParts.push(data.referencePoint);
  if (locationParts.length > 0) lines.push(`📍 Localização: ${locationParts.join(' – ')}`);
  lines.push('');

  // Mídia adicional
  if (data.youtubeUrl && data.youtubeUrl.trim()) {
    lines.push(`▶️ Vídeo: ${data.youtubeUrl.trim()}`);
  }
  if (data.virtualTourUrl && data.virtualTourUrl.trim()) {
    lines.push(`🕶️ Tour Virtual: ${data.virtualTourUrl.trim()}`);
  }
  if (data.youtubeUrl?.trim() || data.virtualTourUrl?.trim()) {
    lines.push('');
  }

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

// Formata "R$ 320 mil" / "R$ 1,2 milhão" para o preço antigo de forma enxuta.
function formatShortBRL(v: number): string {
  if (v >= 1_000_000) {
    const mi = v / 1_000_000;
    const txt = mi % 1 === 0 ? mi.toFixed(0) : mi.toFixed(1).replace('.', ',');
    return `R$ ${txt} ${mi === 1 ? 'milhão' : 'milhões'}`;
  }
  if (v >= 1000) {
    const mil = v / 1000;
    const txt = mil % 1 === 0 ? mil.toFixed(0) : mil.toFixed(0);
    return `R$ ${txt} mil`;
  }
  return formatCurrency(v);
}

function buildPriceReducedCaption(data: AMPropertyData): string {
  const lines: string[] = [];
  const nome = data.title || 'imóvel';
  const oldShort = formatShortBRL(data.oldPrice ?? 0);
  const novo = formatCurrency(data.salePrice);

  lines.push(`Uma nova oportunidade no ${nome} ✨`);
  lines.push('');
  lines.push(`O apartamento que já era uma excelente escolha, agora está com um valor ainda mais atrativo.`);
  lines.push('');
  lines.push(`De ${oldShort} por ${novo} 💙`);
  lines.push('');

  if (data.area > 0) lines.push(`🏢 ${data.area}m² muito bem distribuídos`);

  // Quartos / suítes
  if (data.bedrooms > 0) {
    if (data.suites > 0) {
      lines.push(`✔ ${data.bedrooms} quarto${data.bedrooms > 1 ? 's' : ''}, sendo ${data.suites} ${data.suites === 1 ? 'suíte' : 'suítes'}`);
    } else {
      lines.push(`✔ ${data.bedrooms} quarto${data.bedrooms > 1 ? 's' : ''}`);
    }
  }

  if (data.rooms) {
    data.rooms.split('\n').map(r => r.trim()).filter(Boolean).forEach(r => lines.push(`✔ ${r}`));
  }
  if (data.garageSpaces > 0) {
    lines.push(`✔ ${data.garageSpaces} ${data.garageSpaces === 1 ? 'vaga de garagem' : 'vagas de garagem'}`);
  }
  if (data.leisureItems && data.leisureItems.trim()) {
    lines.push(`✔ Área de lazer completa`);
  }
  if (data.acceptsFinancing) {
    lines.push(`✔ Aceita financiamento${data.acceptsFGTS ? ' e FGTS' : ''}`);
  }

  lines.push('');
  lines.push(`Um imóvel elegante, funcional e pronto para morar.`);
  lines.push('');
  lines.push(`📲 Agende sua visita.`);
  lines.push('');

  const locParts: string[] = [];
  if (data.address) locParts.push(data.address);
  if (data.referencePoint) locParts.push(data.referencePoint);
  if (locParts.length > 0) {
    lines.push(`🔜 Localização: ${locParts.join(' - ')}`);
  }

  if (data.brokerName) {
    lines.push(`👨🏽‍💼 ${data.brokerName} | Corretor de Imóveis - Creci 3968 PF`);
  }
  if (data.brokerPhone) {
    lines.push(`☎ ${data.brokerPhone} (whatsapp)`);
  }
  lines.push(`🖥 https://www.facebook.com/ApartamentosManaus`);
  lines.push(`🖥 www.apartamentosmanaus.com`);

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
