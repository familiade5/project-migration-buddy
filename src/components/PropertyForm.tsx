import { PropertyData, propertyTypes, propertySources, paymentMethods, featureOptions } from '@/types/property';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useCrecis } from '@/hooks/useCrecis';
import { useEffect } from 'react';

interface PropertyFormProps {
  data: PropertyData;
  onChange: (data: PropertyData) => void;
}

export const PropertyForm = ({ data, onChange }: PropertyFormProps) => {
  const { crecis, defaultCreci, formatCreci } = useCrecis();

  // Set default CRECI when loaded
  useEffect(() => {
    if (defaultCreci && !data.creci) {
      onChange({ ...data, creci: defaultCreci });
    }
  }, [defaultCreci]);

  const updateField = <K extends keyof PropertyData>(field: K, value: PropertyData[K]) => {
    onChange({ ...data, [field]: value });
  };

  const toggleFeature = (feature: string) => {
    const newFeatures = data.features.includes(feature)
      ? data.features.filter(f => f !== feature)
      : [...data.features, feature];
    updateField('features', newFeatures);
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Nome do Imóvel */}
      <div className="space-y-4">
        <h3 className="font-semibold text-base text-gray-900 flex items-center gap-2">
          <span className="text-lg">🏡</span> Identificação
        </h3>
        <div>
          <Label htmlFor="propertyName" className="text-gray-600 text-sm font-medium">Nome do Imóvel/Condomínio</Label>
          <Input
            id="propertyName"
            placeholder="COND. RESIDENCIAL ARRUDA"
            value={data.propertyName}
            onChange={(e) => updateField('propertyName', e.target.value)}
            className="input-light mt-1.5"
          />
          <p className="text-xs text-gray-400 mt-1">Aparece no topo da legenda</p>
        </div>
      </div>

      {/* Slide 1 - Capa */}
      <div className="space-y-4">
        <h3 className="font-semibold text-base text-gray-900 flex items-center gap-2">
          <span className="text-lg">📍</span> Slide 1 - Capa
        </h3>
        
        <div className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="min-w-0">
              <Label className="text-gray-600 text-sm font-medium">Tipo do Imóvel</Label>
              <Select value={data.type} onValueChange={(v) => updateField('type', v)}>
                <SelectTrigger className="select-light mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {propertyTypes.map(type => (
                    <SelectItem key={type} value={type} className="text-gray-900 hover:bg-gray-50">{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-0">
              <Label className="text-gray-600 text-sm font-medium">Origem</Label>
              <Select value={data.propertySource} onValueChange={(v) => updateField('propertySource', v)}>
                <SelectTrigger className="select-light mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {propertySources.map(source => (
                    <SelectItem key={source} value={source} className="text-gray-900 hover:bg-gray-50">{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="entryValue" className="text-gray-600 text-sm font-medium">Entrada a partir de</Label>
            <Input
              id="entryValue"
              placeholder="R$ 7.500"
              value={data.entryValue}
              onChange={(e) => updateField('entryValue', e.target.value)}
              className="input-light mt-1.5"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="min-w-0">
              <Label htmlFor="evaluationValue" className="text-gray-600 text-sm font-medium">Valor de Avaliação</Label>
              <Input
                id="evaluationValue"
                placeholder="R$ 126.000,00"
                value={data.evaluationValue}
                onChange={(e) => updateField('evaluationValue', e.target.value)}
                className="input-light mt-1.5"
              />
            </div>
            <div className="min-w-0">
              <Label htmlFor="minimumValue" className="text-gray-600 text-sm font-medium">Valor Mínimo</Label>
              <Input
                id="minimumValue"
                placeholder="R$ 72.988,41"
                value={data.minimumValue}
                onChange={(e) => updateField('minimumValue', e.target.value)}
                className="input-light mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="discount" className="text-gray-600 text-sm font-medium">Desconto (%)</Label>
            <Input
              id="discount"
              placeholder="42,07"
              value={data.discount}
              onChange={(e) => updateField('discount', e.target.value)}
              className="input-light mt-1.5"
            />
          </div>

          {/* Forma de pagamento */}
          <div>
            <Label className="text-gray-600 text-sm font-medium">Forma de Pagamento</Label>
            <Select value={data.paymentMethod} onValueChange={(v) => updateField('paymentMethod', v)}>
              <SelectTrigger className="select-light mt-1.5 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {paymentMethods.map(method => (
                  <SelectItem key={method} value={method} className="text-gray-900 hover:bg-gray-50">{method}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
            <Label htmlFor="acceptsFGTS" className="text-gray-700 text-sm">Aceita FGTS?</Label>
            <Switch
              id="acceptsFGTS"
              checked={data.acceptsFGTS}
              onCheckedChange={(checked) => updateField('acceptsFGTS', checked)}
              className="switch-light"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
            <Label htmlFor="acceptsFinancing" className="text-gray-700 text-sm">Aceita Financiamento?</Label>
            <Switch
              id="acceptsFinancing"
              checked={data.acceptsFinancing}
              onCheckedChange={(checked) => updateField('acceptsFinancing', checked)}
              className="switch-light"
            />
          </div>
        </div>
      </div>

      {/* Localização Completa */}
      <div className="space-y-4">
        <h3 className="font-semibold text-base text-gray-900 flex items-center gap-2">
          <span className="text-lg">📍</span> Localização
        </h3>
        
        <div className="grid gap-4">
          <div>
            <Label htmlFor="street" className="text-gray-600 text-sm font-medium">Rua/Avenida</Label>
            <Input
              id="street"
              placeholder="Rua 29"
              value={data.street}
              onChange={(e) => updateField('street', e.target.value)}
              className="input-light mt-1.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <Label htmlFor="number" className="text-gray-600 text-sm font-medium">Número</Label>
              <Input
                id="number"
                placeholder="306"
                value={data.number}
                onChange={(e) => updateField('number', e.target.value)}
                className="input-light mt-1.5"
              />
            </div>
            <div className="min-w-0">
              <Label htmlFor="cep" className="text-gray-600 text-sm font-medium">CEP</Label>
              <Input
                id="cep"
                placeholder="79105-090"
                value={data.cep}
                onChange={(e) => updateField('cep', e.target.value)}
                className="input-light mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="complement" className="text-gray-600 text-sm font-medium">Complemento</Label>
            <Input
              id="complement"
              placeholder="Casa 01, Apto 101..."
              value={data.complement}
              onChange={(e) => updateField('complement', e.target.value)}
              className="input-light mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="neighborhood" className="text-gray-600 text-sm font-medium">Bairro</Label>
            <Input
              id="neighborhood"
              placeholder="Vila Nova Campo Grande"
              value={data.neighborhood}
              onChange={(e) => updateField('neighborhood', e.target.value)}
              className="input-light mt-1.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <Label htmlFor="city" className="text-gray-600 text-sm font-medium">Cidade</Label>
              <Input
                id="city"
                placeholder="Campo Grande"
                value={data.city}
                onChange={(e) => updateField('city', e.target.value)}
                className="input-light mt-1.5"
              />
            </div>
            <div className="min-w-0">
              <Label htmlFor="state" className="text-gray-600 text-sm font-medium">Estado</Label>
              <Input
                id="state"
                placeholder="MS"
                value={data.state}
                onChange={(e) => updateField('state', e.target.value)}
                className="input-light mt-1.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Características do Imóvel */}
      <div className="space-y-4">
        <h3 className="font-semibold text-base text-gray-900 flex items-center gap-2">
          <span className="text-lg">🏠</span> Características
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="min-w-0">
            <Label htmlFor="bedrooms" className="text-gray-600 text-xs sm:text-sm font-medium">Quartos</Label>
            <Input
              id="bedrooms"
              type="number"
              min="0"
              value={data.bedrooms}
              onChange={(e) => updateField('bedrooms', e.target.value)}
              className="input-light mt-1.5"
            />
          </div>
          <div className="min-w-0">
            <Label htmlFor="bathrooms" className="text-gray-600 text-xs sm:text-sm font-medium">Banheiros</Label>
            <Input
              id="bathrooms"
              type="number"
              min="0"
              value={data.bathrooms}
              onChange={(e) => updateField('bathrooms', e.target.value)}
              className="input-light mt-1.5"
            />
          </div>
          <div className="min-w-0">
            <Label htmlFor="garageSpaces" className="text-gray-600 text-xs sm:text-sm font-medium">Vagas</Label>
            <Input
              id="garageSpaces"
              type="number"
              min="0"
              value={data.garageSpaces}
              onChange={(e) => updateField('garageSpaces', e.target.value)}
              className="input-light mt-1.5"
            />
          </div>
        </div>

        {/* Cômodos básicos */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-100 rounded-lg">
            <Label htmlFor="hasSala" className="text-gray-700 text-xs sm:text-sm">Sala</Label>
            <Switch
              id="hasSala"
              checked={data.hasSala}
              onCheckedChange={(checked) => updateField('hasSala', checked)}
              className="switch-light"
            />
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-100 rounded-lg">
            <Label htmlFor="hasCozinha" className="text-gray-700 text-xs sm:text-sm">Cozinha</Label>
            <Switch
              id="hasCozinha"
              checked={data.hasCozinha}
              onCheckedChange={(checked) => updateField('hasCozinha', checked)}
              className="switch-light"
            />
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-100 rounded-lg">
            <Label htmlFor="hasAreaServico" className="text-gray-700 text-xs">Á.Serv</Label>
            <Switch
              id="hasAreaServico"
              checked={data.hasAreaServico}
              onCheckedChange={(checked) => updateField('hasAreaServico', checked)}
              className="switch-light"
            />
          </div>
        </div>

        {/* Áreas */}
        <div className="grid grid-cols-3 gap-3">
          <div className="min-w-0">
            <Label htmlFor="areaTotal" className="text-gray-600 text-xs font-medium">Área Total</Label>
            <Input
              id="areaTotal"
              placeholder="42,87"
              value={data.areaTotal}
              onChange={(e) => updateField('areaTotal', e.target.value)}
              className="input-light mt-1.5"
            />
          </div>
          <div className="min-w-0">
            <Label htmlFor="areaPrivativa" className="text-gray-600 text-xs font-medium">Á. Privat.</Label>
            <Input
              id="areaPrivativa"
              placeholder="63,63"
              value={data.areaPrivativa}
              onChange={(e) => updateField('areaPrivativa', e.target.value)}
              className="input-light mt-1.5"
            />
          </div>
          <div className="min-w-0">
            <Label htmlFor="areaTerreno" className="text-gray-600 text-xs font-medium">Á. Terreno</Label>
            <Input
              id="areaTerreno"
              placeholder="136,66"
              value={data.areaTerreno}
              onChange={(e) => updateField('areaTerreno', e.target.value)}
              className="input-light mt-1.5"
            />
          </div>
        </div>
      </div>

      {/* Slide 3 - Diferenciais */}
      <div className="space-y-4">
        <h3 className="font-semibold text-base text-gray-900 flex items-center gap-2">
          <span className="text-lg">✨</span> Slide 3 - Diferenciais
        </h3>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
          <div className="min-w-0 flex-1">
            <Label htmlFor="hasEasyEntry" className="text-gray-700 text-sm">Entrada facilitada?</Label>
            <p className="text-xs text-gray-400">Se não, mostra "Condições especiais"</p>
          </div>
          <Switch
            id="hasEasyEntry"
            checked={data.hasEasyEntry}
            onCheckedChange={(checked) => updateField('hasEasyEntry', checked)}
            className="switch-light"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
          <div className="min-w-0 flex-1">
            <Label htmlFor="canUseFGTS" className="text-gray-700 text-sm">Pode usar FGTS?</Label>
            <p className="text-xs text-gray-400">Se não, mostra "Melhores taxas"</p>
          </div>
          <Switch
            id="canUseFGTS"
            checked={data.canUseFGTS}
            onCheckedChange={(checked) => updateField('canUseFGTS', checked)}
            className="switch-light"
          />
        </div>
      </div>

      {/* Textos Personalizados dos Slides */}
      <div className="space-y-4">
        <h3 className="font-semibold text-base text-gray-900 flex items-center gap-2">
          <span className="text-lg">✏️</span> Textos dos Slides (Editáveis)
        </h3>
        <p className="text-xs text-gray-400">Deixe em branco para usar os textos automáticos</p>
        
        {/* Slide 2 - Benefícios */}
        <div className="space-y-3 p-4 bg-gray-50 border border-gray-100 rounded-lg">
          <Label className="text-gray-700 text-sm font-medium">Slide 2 - Benefícios/Condições</Label>
          {[0, 1, 2].map((index) => (
            <Input
              key={`slide2-${index}`}
              placeholder={`Texto ${index + 1} (ex: Documentação regularizada)`}
              value={data.customSlide2Texts?.[index] || ''}
              onChange={(e) => {
                const newTexts = [...(data.customSlide2Texts || ['', '', ''])];
                newTexts[index] = e.target.value;
                updateField('customSlide2Texts', newTexts);
              }}
              className="input-light"
            />
          ))}
        </div>

        {/* Slide 3 - Características */}
        <div className="space-y-3 p-4 bg-gray-50 border border-gray-100 rounded-lg">
          <Label className="text-gray-700 text-sm font-medium">Slide 3 - Características</Label>
          {[0, 1, 2].map((index) => (
            <Input
              key={`slide3-${index}`}
              placeholder={`Texto ${index + 1} (ex: 2 quartos amplos)`}
              value={data.customSlide3Texts?.[index] || ''}
              onChange={(e) => {
                const newTexts = [...(data.customSlide3Texts || ['', '', ''])];
                newTexts[index] = e.target.value;
                updateField('customSlide3Texts', newTexts);
              }}
              className="input-light"
            />
          ))}
        </div>
      </div>

      {/* Extras do Imóvel */}
      <div className="space-y-4">
        <h3 className="font-semibold text-base text-gray-900 flex items-center gap-2">
          <span className="text-lg">🏠</span> Extras do Imóvel
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {featureOptions.map(feature => (
            <label
              key={feature}
              className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Checkbox
                checked={data.features.includes(feature)}
                onCheckedChange={() => toggleFeature(feature)}
                className="border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 flex-shrink-0"
              />
              <span className="text-xs sm:text-sm text-gray-700 truncate">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Regras de Despesas */}
      <div className="space-y-4">
        <h3 className="font-semibold text-base text-gray-900 flex items-center gap-2">
          <span className="text-lg">⚠️</span> Regras de Despesas
        </h3>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="condominiumRules" className="text-gray-600 text-sm font-medium">Condomínio</Label>
            <Textarea
              id="condominiumRules"
              placeholder="Responsabilidade do comprador..."
              value={data.condominiumRules}
              onChange={(e) => updateField('condominiumRules', e.target.value)}
              className="input-light mt-1.5 min-h-[60px]"
            />
          </div>
          <div>
            <Label htmlFor="taxRules" className="text-gray-600 text-sm font-medium">Tributos</Label>
            <Input
              id="taxRules"
              placeholder="Responsabilidade do comprador."
              value={data.taxRules}
              onChange={(e) => updateField('taxRules', e.target.value)}
              className="input-light mt-1.5"
            />
          </div>
        </div>
      </div>

      {/* Contato */}
      <div className="space-y-4">
        <h3 className="font-semibold text-base text-gray-900 flex items-center gap-2">
          <span className="text-lg">📞</span> Contato
        </h3>
        <div className="grid gap-3">
          <div>
            <Label htmlFor="contactName" className="text-gray-600 text-sm font-medium">Nome do Corretor</Label>
            <Input
              id="contactName"
              placeholder="Iury Sampaio"
              value={data.contactName}
              onChange={(e) => updateField('contactName', e.target.value)}
              className="input-light mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="contactPhone" className="text-gray-600 text-sm font-medium">Telefone/WhatsApp</Label>
            <Input
              id="contactPhone"
              placeholder="(67) 99999-9999"
              value={data.contactPhone}
              onChange={(e) => updateField('contactPhone', e.target.value)}
              className="input-light mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="creci" className="text-gray-600 text-sm font-medium">CRECI</Label>
            {crecis.length > 0 ? (
              <Select value={data.creci} onValueChange={(v) => updateField('creci', v)}>
                <SelectTrigger className="select-light mt-1.5 w-full">
                  <SelectValue placeholder="Selecione o CRECI" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {crecis.map(creci => (
                    <SelectItem key={creci.id} value={formatCreci(creci)} className="text-gray-900 hover:bg-gray-50">
                      {formatCreci(creci)}
                      {creci.is_default && ' (padrão)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="creci"
                placeholder="CRECI 14851 MS PJ"
                value={data.creci}
                onChange={(e) => updateField('creci', e.target.value)}
                className="input-light mt-1.5"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
