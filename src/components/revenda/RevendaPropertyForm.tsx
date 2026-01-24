import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { 
  RevendaPropertyData, 
  revendaPropertyTypes, 
  revendaFeatureOptions,
  DetailLevel 
} from '@/types/revenda';
import { useCrecis } from '@/hooks/useCrecis';
import { useEffect } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Sun, Mountain, LayoutDashboard, Sparkles } from 'lucide-react';

interface RevendaPropertyFormProps {
  data: RevendaPropertyData;
  onChange: (data: RevendaPropertyData) => void;
}

export const RevendaPropertyForm = ({ data, onChange }: RevendaPropertyFormProps) => {
  const { crecis, defaultCreci } = useCrecis();

  useEffect(() => {
    if (defaultCreci && !data.creci) {
      onChange({ ...data, creci: defaultCreci });
    }
  }, [defaultCreci]);

  const updateField = <K extends keyof RevendaPropertyData>(field: K, value: RevendaPropertyData[K]) => {
    onChange({ ...data, [field]: value });
  };

  const toggleFeature = (feature: string) => {
    const newFeatures = data.features.includes(feature)
      ? data.features.filter(f => f !== feature)
      : [...data.features, feature];
    updateField('features', newFeatures);
  };

  const toggleDiferencial = (dif: string) => {
    const newDifs = data.diferenciais.includes(dif)
      ? data.diferenciais.filter(d => d !== dif)
      : [...data.diferenciais, dif];
    updateField('diferenciais', newDifs);
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs">1</span>
          Identificação
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label className="text-slate-600">Nome do Imóvel / Condomínio</Label>
            <Input
              value={data.propertyName}
              onChange={(e) => updateField('propertyName', e.target.value)}
              placeholder="Ex: Residencial Vista Verde"
              className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
            />
          </div>
          
          <div>
            <Label className="text-slate-600">Tipo do Imóvel</Label>
            <Select value={data.type} onValueChange={(value) => updateField('type', value)}>
              <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {revendaPropertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-slate-600">Preço</Label>
            <Input
              value={data.price}
              onChange={(e) => updateField('price', e.target.value)}
              placeholder="R$ 450.000"
              className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs">2</span>
          Localização
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label className="text-slate-600">Endereço Completo</Label>
            <Input
              value={data.fullAddress}
              onChange={(e) => updateField('fullAddress', e.target.value)}
              placeholder="Rua das Flores, 123 - Bairro"
              className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
            />
          </div>
          
          <div>
            <Label className="text-slate-600">Bairro</Label>
            <Input
              value={data.neighborhood}
              onChange={(e) => updateField('neighborhood', e.target.value)}
              placeholder="Centro"
              className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
            />
          </div>
          
          <div>
            <Label className="text-slate-600">Cidade</Label>
            <Input
              value={data.city}
              onChange={(e) => updateField('city', e.target.value)}
              placeholder="Campo Grande"
              className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
            />
          </div>
          
          <div>
            <Label className="text-slate-600">Estado</Label>
            <Input
              value={data.state}
              onChange={(e) => updateField('state', e.target.value)}
              placeholder="MS"
              className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Size & Layout */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs">3</span>
          Características
        </h3>
        
        <div className="grid grid-cols-4 gap-3">
          <div>
            <Label className="text-slate-600 text-xs">Quartos</Label>
            <Input
              value={data.bedrooms}
              onChange={(e) => updateField('bedrooms', e.target.value)}
              placeholder="3"
              className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
            />
          </div>
          <div>
            <Label className="text-slate-600 text-xs">Suítes</Label>
            <Input
              value={data.suites}
              onChange={(e) => updateField('suites', e.target.value)}
              placeholder="1"
              className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
            />
          </div>
          <div>
            <Label className="text-slate-600 text-xs">Banheiros</Label>
            <Input
              value={data.bathrooms}
              onChange={(e) => updateField('bathrooms', e.target.value)}
              placeholder="2"
              className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
            />
          </div>
          <div>
            <Label className="text-slate-600 text-xs">Vagas</Label>
            <Input
              value={data.garageSpaces}
              onChange={(e) => updateField('garageSpaces', e.target.value)}
              placeholder="2"
              className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
            />
          </div>
          <div className="col-span-2">
            <Label className="text-slate-600 text-xs">Área Útil (m²)</Label>
            <Input
              value={data.area}
              onChange={(e) => updateField('area', e.target.value)}
              placeholder="120"
              className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
            />
          </div>
          <div className="col-span-2">
            <Label className="text-slate-600 text-xs">Área Terreno (m²)</Label>
            <Input
              value={data.areaTerreno}
              onChange={(e) => updateField('areaTerreno', e.target.value)}
              placeholder="250"
              className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Comfort Details */}
      {(data.detailLevel === 'conforto' || data.detailLevel === 'premium') && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs">4</span>
            Diferenciais de Conforto
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-sky-300 cursor-pointer transition-colors">
              <Checkbox
                checked={data.hasNaturalLight}
                onCheckedChange={(checked) => updateField('hasNaturalLight', checked as boolean)}
              />
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-slate-700">Iluminação Natural</span>
            </label>
            
            <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-sky-300 cursor-pointer transition-colors">
              <Checkbox
                checked={data.hasVaranda}
                onCheckedChange={(checked) => updateField('hasVaranda', checked as boolean)}
              />
              <LayoutDashboard className="w-4 h-4 text-green-500" />
              <span className="text-sm text-slate-700">Varanda</span>
            </label>
            
            <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-sky-300 cursor-pointer transition-colors">
              <Checkbox
                checked={data.hasVista}
                onCheckedChange={(checked) => updateField('hasVista', checked as boolean)}
              />
              <Mountain className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-slate-700">Vista Privilegiada</span>
            </label>
            
            <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-sky-300 cursor-pointer transition-colors">
              <Checkbox
                checked={data.hasGoodLayout}
                onCheckedChange={(checked) => updateField('hasGoodLayout', checked as boolean)}
              />
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-slate-700">Layout Bem Distribuído</span>
            </label>
          </div>
        </div>
      )}

      {/* Premium Details */}
      {data.detailLevel === 'premium' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs">5</span>
            Detalhes Premium
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label className="text-slate-600">Qualidade dos Acabamentos</Label>
              <Input
                value={data.acabamentos}
                onChange={(e) => updateField('acabamentos', e.target.value)}
                placeholder="Ex: Porcelanato, granito, marcenaria planejada..."
                className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
              />
            </div>
            
            <div>
              <Label className="text-slate-600">Descrição Livre (gerada automaticamente se vazia)</Label>
              <Textarea
                value={data.descricaoLivre}
                onChange={(e) => updateField('descricaoLivre', e.target.value)}
                placeholder="Descreva os diferenciais únicos do imóvel... (deixe vazio para gerar automaticamente)"
                className="bg-white border-slate-200 focus:border-sky-400 min-h-[80px] text-slate-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* Legenda Fields */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <span>Dados para Legenda (Instagram/Facebook)</span>
          <ChevronDown className="w-4 h-4" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-4 pt-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-600 text-xs">Andar / Tipo</Label>
                <Input
                  value={data.andarOuTipo}
                  onChange={(e) => updateField('andarOuTipo', e.target.value)}
                  placeholder="Ex: 2º andar, Térreo, Cobertura"
                  className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
                />
              </div>
              <div>
                <Label className="text-slate-600 text-xs">Condição de Financiamento</Label>
                <Input
                  value={data.condicaoFinanciamento}
                  onChange={(e) => updateField('condicaoFinanciamento', e.target.value)}
                  placeholder="Aceita financiamento e FGTS"
                  className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-slate-600 text-xs">Subsídio / Entrada (texto livre)</Label>
              <Input
                value={data.subsidioOuEntrada}
                onChange={(e) => updateField('subsidioOuEntrada', e.target.value)}
                placeholder="Ex: Entrada a partir de R$ 5.000"
                className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
              />
            </div>
            
            <div>
              <Label className="text-slate-600 text-xs">Itens de Lazer (separados por vírgula)</Label>
              <Input
                value={data.itensLazer?.join(', ') || ''}
                onChange={(e) => updateField('itensLazer', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="Piscina, Academia, Churrasqueira, Playground"
                className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-600 text-xs">CEP</Label>
                <Input
                  value={data.cep}
                  onChange={(e) => updateField('cep', e.target.value)}
                  placeholder="79000-000"
                  className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
                />
              </div>
              <div>
                <Label className="text-slate-600 text-xs">Facebook URL</Label>
                <Input
                  value={data.facebookUrl}
                  onChange={(e) => updateField('facebookUrl', e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-slate-600 text-xs">Site URL</Label>
              <Input
                value={data.siteUrl}
                onChange={(e) => updateField('siteUrl', e.target.value)}
                placeholder="https://seusite.com.br"
                className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Features */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <span>Comodidades e Facilidades</span>
          <ChevronDown className="w-4 h-4" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid grid-cols-2 gap-2 pt-3">
            {revendaFeatureOptions.map((feature) => (
              <label 
                key={feature}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <Checkbox
                  checked={data.features.includes(feature)}
                  onCheckedChange={() => toggleFeature(feature)}
                />
                <span className="text-sm text-slate-600">{feature}</span>
              </label>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Contact */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700">Contato</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-600">Nome</Label>
            <Input
              value={data.contactName}
              onChange={(e) => updateField('contactName', e.target.value)}
              className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
            />
          </div>
          
          <div>
            <Label className="text-slate-600">Telefone</Label>
            <Input
              value={data.contactPhone}
              onChange={(e) => updateField('contactPhone', e.target.value)}
              className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
            />
          </div>
          
          <div className="col-span-2">
            <Label className="text-slate-600">CRECI</Label>
            {crecis && crecis.length > 0 ? (
              <Select value={data.creci} onValueChange={(value) => updateField('creci', value)}>
                <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                  <SelectValue placeholder="Selecione o CRECI" />
                </SelectTrigger>
                <SelectContent>
                  {crecis.map((creci) => (
                    <SelectItem key={creci.id} value={creci.creci_number}>
                      {creci.name ? `${creci.name} - ${creci.creci_number}` : creci.creci_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={data.creci}
                onChange={(e) => updateField('creci', e.target.value)}
                className="bg-white border-slate-200 focus:border-sky-400 text-slate-900"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
