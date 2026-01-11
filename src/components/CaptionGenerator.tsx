import { useState } from 'react';
import { PropertyData } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, RefreshCw, Check, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CaptionGeneratorProps {
  data: PropertyData;
}

export const CaptionGenerator = ({ data }: CaptionGeneratorProps) => {
  const [caption, setCaption] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateCaption = () => {
    const formatPrice = (price: string) => {
      if (!price) return 'Consulte-nos';
      const num = parseFloat(price.replace(/\D/g, ''));
      if (isNaN(num)) return price;
      return `R$ ${num.toLocaleString('pt-BR')}`;
    };

    const emojis = ['🏠', '✨', '🔑', '📍', '💫', '🏡', '🌟'];
    const randomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

    const specs = [];
    if (data.bedrooms && data.bedrooms !== '0') specs.push(`${data.bedrooms} quarto${parseInt(data.bedrooms) > 1 ? 's' : ''}`);
    if (data.bathrooms && data.bathrooms !== '0') specs.push(`${data.bathrooms} banheiro${parseInt(data.bathrooms) > 1 ? 's' : ''}`);
    if (data.parkingSpaces && data.parkingSpaces !== '0') specs.push(`${data.parkingSpaces} vaga${parseInt(data.parkingSpaces) > 1 ? 's' : ''}`);
    if (data.area) specs.push(`${data.area}m²`);

    const features = data.features.slice(0, 4);
    
    const templates = [
      `${randomEmoji()} ${data.type?.toUpperCase() || 'IMÓVEL'} ${data.neighborhood ? `- ${data.neighborhood}` : ''}

${data.title || 'Oportunidade única!'}

${specs.length > 0 ? `📐 ${specs.join(' | ')}` : ''}
${features.length > 0 ? `✅ ${features.join(', ')}` : ''}

💰 ${formatPrice(data.price)}
${data.location ? `📍 ${data.location}` : ''}

${data.description ? `\n${data.description}\n` : ''}
📲 Agende sua visita!
${data.contactWhatsapp ? `WhatsApp: ${data.contactWhatsapp}` : ''}

#imoveis #${data.type?.toLowerCase().replace(/\s/g, '') || 'imovel'} #${data.neighborhood?.toLowerCase().replace(/\s/g, '') || 'investimento'} #${data.location?.toLowerCase().replace(/\s/g, '') || 'brasil'} #corretor #imobiliaria #apartamento #casa #venda #oportunidade`,

      `✨ NOVIDADE NO MERCADO ✨

${data.type || 'Imóvel'} incrível ${data.neighborhood ? `em ${data.neighborhood}` : ''}!

${data.title || ''}

${specs.length > 0 ? `🏠 ${specs.join(' • ')}` : ''}

💎 Diferenciais:
${features.map(f => `• ${f}`).join('\n') || '• Excelente localização'}

💵 Investimento: ${formatPrice(data.price)}

📱 Fale conosco:
${data.contactPhone || data.contactWhatsapp || '(XX) XXXXX-XXXX'}

#investimento #imovel #${data.type?.toLowerCase() || 'propriedade'} #oportunidade #moradia`,
    ];

    const newCaption = templates[Math.floor(Math.random() * templates.length)];
    setCaption(newCaption.trim());
  };

  const copyToClipboard = async () => {
    if (!caption) return;
    
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "Legenda copiada para a área de transferência",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Tente selecionar e copiar manualmente",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Legenda para Instagram
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={generateCaption} 
            className="w-full"
            size="lg"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Gerar Legenda
          </Button>

          {caption && (
            <>
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
              
              <Button
                onClick={copyToClipboard}
                variant="secondary"
                className="w-full"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Legenda
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {!caption && (
        <div className="text-center py-8 text-muted-foreground">
          <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Clique em "Gerar Legenda" para criar<br />uma legenda otimizada para o Instagram</p>
        </div>
      )}
    </div>
  );
};
