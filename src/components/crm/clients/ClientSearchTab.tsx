import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCrmClientSearch } from '@/hooks/useCrmClientSearch';
import { useClientCompatibleProperties } from '@/hooks/useCrmMatching';
import { CrmProperty, PROPERTY_TYPE_LABELS } from '@/types/crm';
import { formatCurrency } from '@/lib/formatCurrency';
import { Loader2, Search, Home, MapPin, DollarSign, CheckCircle2, XCircle, Building2 } from 'lucide-react';

const PROPERTY_TYPES = [
  { value: 'casa', label: 'Casa' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'rural', label: 'Rural' },
  { value: 'outro', label: 'Outro' },
];

interface ClientSearchTabProps {
  clientId: string;
  properties: CrmProperty[];
  onPropertyClick?: (property: CrmProperty) => void;
}

export function ClientSearchTab({ clientId, properties, onPropertyClick }: ClientSearchTabProps) {
  const { search, isLoading, saveSearch } = useCrmClientSearch(clientId);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [cities, setCities] = useState('');
  const [neighborhoods, setNeighborhoods] = useState('');
  const [financing, setFinancing] = useState<'yes' | 'no' | 'any'>('any');
  const [minBedrooms, setMinBedrooms] = useState('');
  const [notes, setNotes] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Populate form when search loads
  useEffect(() => {
    if (search) {
      setSelectedTypes(search.property_types || []);
      setMinValue(search.min_value?.toString() || '');
      setMaxValue(search.max_value?.toString() || '');
      setCities((search.cities || []).join(', '));
      setNeighborhoods((search.neighborhoods || []).join(', '));
      setFinancing(
        search.accepts_financing === true ? 'yes'
        : search.accepts_financing === false ? 'no'
        : 'any'
      );
      setMinBedrooms(search.min_bedrooms?.toString() || '');
      setNotes(search.notes || '');
      setIsActive(search.is_active);
    }
  }, [search]);

  const compatibleProperties = useClientCompatibleProperties(search, properties);

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const parseCityList = (raw: string) =>
    raw.split(',').map(s => s.trim()).filter(Boolean);

  const handleSave = async () => {
    setIsSaving(true);
    const ok = await saveSearch({
      property_types: selectedTypes.length > 0 ? selectedTypes : null,
      min_value: minValue ? parseFloat(minValue.replace(/\D/g, '')) : null,
      max_value: maxValue ? parseFloat(maxValue.replace(/\D/g, '')) : null,
      cities: cities ? parseCityList(cities) : null,
      neighborhoods: neighborhoods ? parseCityList(neighborhoods) : null,
      accepts_financing: financing === 'any' ? null : financing === 'yes',
      min_bedrooms: minBedrooms ? parseInt(minBedrooms) : null,
      notes: notes || null,
      is_active: isActive,
    });
    setIsSaving(false);
    if (ok) setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  const hasSearch = !!search;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-medium text-gray-800">O que este cliente busca</h3>
          {hasSearch && (
            <Badge variant={search.is_active ? 'default' : 'secondary'} className="text-[10px] h-5">
              {search.is_active ? 'Em busca' : 'Inativo'}
            </Badge>
          )}
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 text-xs"
          >
            {hasSearch ? 'Editar perfil' : 'Criar perfil de busca'}
          </Button>
        )}
      </div>

      {/* Edit Form */}
      {isEditing ? (
        <div className="space-y-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
          {/* Status */}
          <div className="flex items-center justify-between">
            <Label className="text-gray-700 text-sm">Cliente ainda está buscando?</Label>
            <div className="flex items-center gap-2">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <span className="text-sm text-gray-600">{isActive ? 'Sim' : 'Não'}</span>
            </div>
          </div>

          {/* Property types */}
          <div className="space-y-2">
            <Label className="text-gray-700 text-sm flex items-center gap-1">
              <Building2 className="w-3 h-3" /> Tipos de imóvel
            </Label>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => toggleType(t.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    selectedTypes.includes(t.value)
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Value range */}
          <div className="space-y-2">
            <Label className="text-gray-700 text-sm flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> Faixa de valor
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-500">Mínimo (R$)</Label>
                <Input
                  value={minValue}
                  onChange={e => setMinValue(e.target.value)}
                  className="mt-1 bg-white border-gray-300 text-gray-900 text-sm"
                  placeholder="Ex: 150000"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Máximo (R$)</Label>
                <Input
                  value={maxValue}
                  onChange={e => setMaxValue(e.target.value)}
                  className="mt-1 bg-white border-gray-300 text-gray-900 text-sm"
                  placeholder="Ex: 500000"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="text-gray-700 text-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Localização
            </Label>
            <div>
              <Label className="text-xs text-gray-500">Cidades (separadas por vírgula)</Label>
              <Input
                value={cities}
                onChange={e => setCities(e.target.value)}
                className="mt-1 bg-white border-gray-300 text-gray-900 text-sm"
                placeholder="Ex: Campo Grande, Dourados"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Bairros (separados por vírgula)</Label>
              <Input
                value={neighborhoods}
                onChange={e => setNeighborhoods(e.target.value)}
                className="mt-1 bg-white border-gray-300 text-gray-900 text-sm"
                placeholder="Ex: Centro, Jardim dos Estados"
              />
            </div>
          </div>

          {/* Financing + Bedrooms */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-gray-700 text-sm">Aceita Financiamento</Label>
              <Select value={financing} onValueChange={(v) => setFinancing(v as any)}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Indiferente</SelectItem>
                  <SelectItem value="yes">Necessário</SelectItem>
                  <SelectItem value="no">Somente à vista</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 text-sm">Quartos mínimos</Label>
              <Select value={minBedrooms || '0'} onValueChange={v => setMinBedrooms(v === '0' ? '' : v)}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900 text-sm">
                  <SelectValue placeholder="Qualquer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Qualquer</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-gray-700 text-sm">Observações adicionais</Label>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="bg-white border-gray-300 text-gray-900 text-sm min-h-[60px]"
              placeholder="Requisitos especiais, preferências, urgência..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              {isSaving && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
              Salvar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="bg-white border-gray-300 text-gray-700"
            >
              Cancelar
            </Button>
          </div>
        </div>
      ) : hasSearch ? (
        /* Search summary */
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3 text-sm">
          {search.property_types && search.property_types.length > 0 && (
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
              <span className="text-gray-500">Tipo:</span>
              <div className="flex flex-wrap gap-1">
                {search.property_types.map(t => (
                  <Badge key={t} variant="secondary" className="text-[10px] h-4">{PROPERTY_TYPE_LABELS[t as keyof typeof PROPERTY_TYPE_LABELS] || t}</Badge>
                ))}
              </div>
            </div>
          )}
          {(search.min_value || search.max_value) && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
              <span className="text-gray-500">Valor:</span>
              <span className="text-gray-800">
                {search.min_value ? formatCurrency(search.min_value) : 'Sem mínimo'} –{' '}
                {search.max_value ? formatCurrency(search.max_value) : 'Sem máximo'}
              </span>
            </div>
          )}
          {search.cities && search.cities.length > 0 && (
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-500">Cidades:</span>
              <span className="text-gray-800">{search.cities.join(', ')}</span>
            </div>
          )}
          {search.neighborhoods && search.neighborhoods.length > 0 && (
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-500">Bairros:</span>
              <span className="text-gray-800">{search.neighborhoods.join(', ')}</span>
            </div>
          )}
          {search.accepts_financing !== null && (
            <div className="flex items-center gap-2">
              {search.accepts_financing ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              )}
              <span className="text-gray-800">
                {search.accepts_financing ? 'Necessita de financiamento' : 'Somente à vista'}
              </span>
            </div>
          )}
          {search.notes && (
            <p className="text-gray-600 italic text-xs">{search.notes}</p>
          )}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-400 text-sm">
          <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>Nenhum perfil de busca cadastrado</p>
          <p className="text-xs mt-1">Clique em "Criar perfil de busca" para começar</p>
        </div>
      )}

      {/* Compatible properties */}
      {hasSearch && compatibleProperties.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 pb-1 border-b border-gray-200">
            <Home className="w-4 h-4 text-emerald-600" />
            Imóveis compatíveis
            <Badge className="bg-emerald-100 text-emerald-700 text-[10px] h-4 border-0">
              {compatibleProperties.length}
            </Badge>
          </h4>
          <div className="space-y-2">
            {compatibleProperties.map(({ property, score, criteria }) => (
              <button
                key={property.id}
                onClick={() => onPropertyClick?.(property)}
                className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                    {property.code}
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="text-[10px] text-emerald-700 font-medium">{score}% compatível</div>
                    <div className="w-10 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-800">
                  {PROPERTY_TYPE_LABELS[property.property_type]} — {property.neighborhood || property.city}
                </div>
                {property.sale_value && (
                  <div className="text-xs text-gray-500">{formatCurrency(property.sale_value)}</div>
                )}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {criteria.map(c => (
                    <span key={c} className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                      {c}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {hasSearch && compatibleProperties.length === 0 && !isEditing && (
        <div className="text-center py-4 text-gray-400 text-xs">
          <Home className="w-6 h-6 mx-auto mb-1 opacity-40" />
          Nenhum imóvel compatível encontrado no momento
        </div>
      )}
    </div>
  );
}
