import { useState, useCallback } from 'react';
import { Upload, Loader2, Sparkles, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyData } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ScreenshotExtractorProps {
  onExtract: (data: Partial<PropertyData>) => void;
}

export const ScreenshotExtractor = ({ onExtract }: ScreenshotExtractorProps) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [extractedFields, setExtractedFields] = useState<string[]>([]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:image/xxx;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setExtractedFields([]);
    setIsExtracting(true);

    try {
      toast.info('Analisando imagem com IA...', { duration: 3000 });
      
      const base64 = await fileToBase64(file);
      
      const { data, error } = await supabase.functions.invoke('extract-property-data', {
        body: { imageBase64: base64 }
      });

      if (error) {
        console.error('Error calling function:', error);
        throw new Error(error.message || 'Erro ao processar imagem');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const extractedData = data.data;
      console.log('Extracted data:', extractedData);

      // Map extracted fields to property data
      const propertyUpdate: Partial<PropertyData> = {};
      const fieldsFound: string[] = [];

      if (extractedData.type) {
        propertyUpdate.type = extractedData.type;
        fieldsFound.push('Tipo');
      }
      if (extractedData.propertySource) {
        propertyUpdate.propertySource = extractedData.propertySource;
        fieldsFound.push('Origem');
      }
      if (extractedData.city) {
        propertyUpdate.city = extractedData.city;
        fieldsFound.push('Cidade');
      }
      if (extractedData.state) {
        propertyUpdate.state = extractedData.state;
        fieldsFound.push('Estado');
      }
      if (extractedData.neighborhood) {
        propertyUpdate.neighborhood = extractedData.neighborhood;
        fieldsFound.push('Bairro');
      }
      if (extractedData.evaluationValue) {
        propertyUpdate.evaluationValue = extractedData.evaluationValue;
        fieldsFound.push('Valor Avaliação');
      }
      if (extractedData.minimumValue) {
        propertyUpdate.minimumValue = extractedData.minimumValue;
        fieldsFound.push('Valor Mínimo');
      }
      if (extractedData.discount) {
        propertyUpdate.discount = extractedData.discount;
        fieldsFound.push('Desconto');
      }
      if (extractedData.bedrooms) {
        propertyUpdate.bedrooms = extractedData.bedrooms;
        fieldsFound.push('Quartos');
      }
      if (extractedData.bathrooms) {
        propertyUpdate.bathrooms = extractedData.bathrooms;
        fieldsFound.push('Banheiros');
      }
      if (extractedData.garageSpaces) {
        propertyUpdate.garageSpaces = extractedData.garageSpaces;
        fieldsFound.push('Garagem');
      }
      if (extractedData.area) {
        propertyUpdate.area = extractedData.area;
        fieldsFound.push('Área');
      }
      if (extractedData.areaTotal) {
        propertyUpdate.areaTotal = extractedData.areaTotal;
        fieldsFound.push('Área Total');
      }
      if (extractedData.areaPrivativa) {
        propertyUpdate.areaPrivativa = extractedData.areaPrivativa;
        fieldsFound.push('Área Privativa');
      }
      if (typeof extractedData.acceptsFGTS === 'boolean') {
        propertyUpdate.acceptsFGTS = extractedData.acceptsFGTS;
        propertyUpdate.canUseFGTS = extractedData.acceptsFGTS;
        fieldsFound.push('FGTS');
      }
      if (typeof extractedData.acceptsFinancing === 'boolean') {
        propertyUpdate.acceptsFinancing = extractedData.acceptsFinancing;
        fieldsFound.push(extractedData.acceptsFinancing ? 'Aceita Financiamento' : 'Não Aceita Financiamento');
      }
      if (typeof extractedData.hasEasyEntry === 'boolean') {
        propertyUpdate.hasEasyEntry = extractedData.hasEasyEntry;
        if (extractedData.hasEasyEntry) {
          fieldsFound.push('Entrada Facilitada');
        }
      }
      if (extractedData.entryValue) {
        propertyUpdate.entryValue = extractedData.entryValue;
        fieldsFound.push('Valor Entrada');
      }
      if (extractedData.paymentMethod) {
        propertyUpdate.paymentMethod = extractedData.paymentMethod;
        fieldsFound.push('Forma Pagamento');
      }
      if (extractedData.fullAddress) {
        // Try to parse the full address if individual fields weren't extracted
        if (!extractedData.street) {
          propertyUpdate.street = extractedData.fullAddress;
        }
        fieldsFound.push('Endereço Completo');
      }
      if (extractedData.street) {
        propertyUpdate.street = extractedData.street;
        fieldsFound.push('Rua');
      }
      if (extractedData.number) {
        propertyUpdate.number = extractedData.number;
        fieldsFound.push('Número');
      }
      if (extractedData.complement) {
        propertyUpdate.complement = extractedData.complement;
        fieldsFound.push('Complemento');
      }
      if (extractedData.cep) {
        propertyUpdate.cep = extractedData.cep;
        fieldsFound.push('CEP');
      }
      if (extractedData.condominiumRules) {
        propertyUpdate.condominiumRules = extractedData.condominiumRules;
        fieldsFound.push('Regras Condomínio');
      }
      if (extractedData.taxRules) {
        propertyUpdate.taxRules = extractedData.taxRules;
        fieldsFound.push('Regras Tributos');
      }
      if (extractedData.condominiumRules) {
        propertyUpdate.condominiumRules = extractedData.condominiumRules;
        fieldsFound.push('Regras Condomínio');
      }
      if (extractedData.taxRules) {
        propertyUpdate.taxRules = extractedData.taxRules;
        fieldsFound.push('Regras Tributos');
      }
      if (typeof extractedData.hasSala === 'boolean') {
        propertyUpdate.hasSala = extractedData.hasSala;
      }
      if (typeof extractedData.hasCozinha === 'boolean') {
        propertyUpdate.hasCozinha = extractedData.hasCozinha;
      }
      if (typeof extractedData.hasAreaServico === 'boolean') {
        propertyUpdate.hasAreaServico = extractedData.hasAreaServico;
      }
      if (extractedData.features && Array.isArray(extractedData.features)) {
        propertyUpdate.features = extractedData.features;
        fieldsFound.push('Diferenciais');
      }

      setExtractedFields(fieldsFound);
      onExtract(propertyUpdate);
      
      toast.success(`${fieldsFound.length} campos extraídos com sucesso!`, {
        description: 'Os dados foram preenchidos automaticamente no formulário.'
      });

    } catch (error) {
      console.error('Error extracting data:', error);
      toast.error('Erro ao extrair dados', {
        description: error instanceof Error ? error.message : 'Tente novamente'
      });
      setPreview(null);
    } finally {
      setIsExtracting(false);
      // Reset the input
      event.target.value = '';
    }
  }, [onExtract]);

  const clearPreview = () => {
    setPreview(null);
    setExtractedFields([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gold/10">
          <Sparkles className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Extração Automática com IA</h3>
          <p className="text-xs text-muted-foreground">
            Envie um screenshot do site da Caixa para preencher automaticamente
          </p>
        </div>
      </div>

      {!preview ? (
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-gold/30 rounded-xl p-8 text-center hover:border-gold/50 hover:bg-gold/5 transition-all duration-300 group">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 rounded-full bg-gold/10 group-hover:bg-gold/20 transition-colors">
                <Upload className="w-8 h-8 text-gold" />
              </div>
              <div>
                <p className="font-medium text-foreground">Clique para enviar screenshot</p>
                <p className="text-sm text-muted-foreground mt-1">
                  PNG, JPG ou WEBP (máx. 10MB)
                </p>
              </div>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isExtracting}
          />
        </label>
      ) : (
        <div className="space-y-4">
          {/* Preview image */}
          <div className="relative rounded-xl overflow-hidden border border-border">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-48 object-cover object-top"
            />
            {isExtracting && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-gold animate-spin" />
                  <p className="text-sm font-medium text-foreground">
                    Analisando imagem com IA...
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Extracted fields */}
          {extractedFields.length > 0 && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="font-medium text-green-500">
                  {extractedFields.length} campos extraídos
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {extractedFields.map((field) => (
                  <span
                    key={field}
                    className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-md font-medium"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={clearPreview}
              className="flex-1"
              disabled={isExtracting}
            >
              Limpar
            </Button>
            <label className="flex-1">
              <Button
                className="w-full bg-gold hover:bg-gold/90 text-primary-foreground"
                disabled={isExtracting}
                asChild
              >
                <span>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Nova imagem
                </span>
              </Button>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isExtracting}
              />
            </label>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
        <p className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            Para melhores resultados, capture a tela inteira do imóvel no site da Caixa, 
            incluindo valores, características e formas de pagamento.
          </span>
        </p>
      </div>
    </div>
  );
};
