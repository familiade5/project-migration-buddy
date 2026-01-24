import { useState } from 'react';
import { LocacaoPropertyData, LocacaoCategorizedPhoto, locacaoPropertyTypes, locacaoFeatureOptions } from '@/types/locacao';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, MapPin, Home, DollarSign, Phone, CheckSquare } from 'lucide-react';

interface LocacaoPropertyFormProps {
  data: LocacaoPropertyData;
  onChange: (data: LocacaoPropertyData) => void;
}

export const LocacaoPropertyForm = ({ data, onChange }: LocacaoPropertyFormProps) => {
  const [openSections, setOpenSections] = useState({
    identification: true,
    location: false,
    size: false,
    rental: false,
    features: false,
    contact: false,
  });

  const updateField = (field: keyof LocacaoPropertyData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFeature = (feature: string) => {
    const features = data.features.includes(feature)
      ? data.features.filter(f => f !== feature)
      : [...data.features, feature];
    updateField('features', features);
  };

  const SectionHeader = ({ 
    icon: Icon, 
    title, 
    section, 
    number 
  }: { 
    icon: any; 
    title: string; 
    section: keyof typeof openSections;
    number: number;
  }) => (
    <CollapsibleTrigger 
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full py-3 px-1 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
          style={{ backgroundColor: '#e5e7eb', color: '#374151' }}
        >
          {number}
        </div>
        <Icon className="w-4 h-4" style={{ color: '#6b7280' }} />
        <span className="font-medium text-sm" style={{ color: '#111827' }}>{title}</span>
      </div>
      <ChevronDown 
        className={`w-4 h-4 transition-transform ${openSections[section] ? 'rotate-180' : ''}`}
        style={{ color: '#9ca3af' }}
      />
    </CollapsibleTrigger>
  );

  return (
    <div className="space-y-2">
      {/* Identification */}
      <Collapsible open={openSections.identification}>
        <SectionHeader icon={Home} title="Identificação" section="identification" number={1} />
        <CollapsibleContent className="pt-3 pb-4 px-1 space-y-4">
          <div>
            <Label className="text-xs" style={{ color: '#6b7280' }}>Nome do Imóvel / Condomínio</Label>
            <Input
              placeholder="Ex: Residencial Vista Verde"
              value={data.propertyName}
              onChange={(e) => updateField('propertyName', e.target.value)}
              className="mt-1"
              style={{ borderColor: '#e5e7eb' }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>Tipo de Imóvel</Label>
              <Select value={data.type} onValueChange={(value) => updateField('type', value)}>
                <SelectTrigger className="mt-1" style={{ borderColor: '#e5e7eb' }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locacaoPropertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>Disponibilidade</Label>
              <Input
                placeholder="Disponível imediatamente"
                value={data.availableFrom}
                onChange={(e) => updateField('availableFrom', e.target.value)}
                className="mt-1"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
          </div>
          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={data.furnished}
                onCheckedChange={(checked) => updateField('furnished', checked)}
              />
              <span className="text-sm" style={{ color: '#374151' }}>Mobiliado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={data.acceptsPets}
                onCheckedChange={(checked) => updateField('acceptsPets', checked)}
              />
              <span className="text-sm" style={{ color: '#374151' }}>Aceita Pets</span>
            </label>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Location */}
      <Collapsible open={openSections.location}>
        <SectionHeader icon={MapPin} title="Localização" section="location" number={2} />
        <CollapsibleContent className="pt-3 pb-4 px-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>Bairro</Label>
              <Input
                placeholder="Centro"
                value={data.neighborhood}
                onChange={(e) => updateField('neighborhood', e.target.value)}
                className="mt-1"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>Cidade</Label>
              <Input
                placeholder="Manaus"
                value={data.city}
                onChange={(e) => updateField('city', e.target.value)}
                className="mt-1"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>Estado</Label>
              <Input
                placeholder="AM"
                value={data.state}
                onChange={(e) => updateField('state', e.target.value)}
                className="mt-1"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>Endereço Completo</Label>
              <Input
                placeholder="Rua das Flores, 123"
                value={data.fullAddress}
                onChange={(e) => updateField('fullAddress', e.target.value)}
                className="mt-1"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Size */}
      <Collapsible open={openSections.size}>
        <SectionHeader icon={Home} title="Dimensões" section="size" number={3} />
        <CollapsibleContent className="pt-3 pb-4 px-1 space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>Quartos</Label>
              <Input
                type="number"
                placeholder="2"
                value={data.bedrooms}
                onChange={(e) => updateField('bedrooms', e.target.value)}
                className="mt-1"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>Banheiros</Label>
              <Input
                type="number"
                placeholder="1"
                value={data.bathrooms}
                onChange={(e) => updateField('bathrooms', e.target.value)}
                className="mt-1"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>Vagas</Label>
              <Input
                type="number"
                placeholder="1"
                value={data.garageSpaces}
                onChange={(e) => updateField('garageSpaces', e.target.value)}
                className="mt-1"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>Área (m²)</Label>
              <Input
                placeholder="80"
                value={data.area}
                onChange={(e) => updateField('area', e.target.value)}
                className="mt-1"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Rental Terms */}
      <Collapsible open={openSections.rental}>
        <SectionHeader icon={DollarSign} title="Valores de Locação" section="rental" number={4} />
        <CollapsibleContent className="pt-3 pb-4 px-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>Aluguel Mensal</Label>
              <Input
                placeholder="R$ 2.500"
                value={data.rentPrice}
                onChange={(e) => updateField('rentPrice', e.target.value)}
                className="mt-1"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>Condomínio</Label>
              <Input
                placeholder="R$ 500"
                value={data.condominiumFee}
                onChange={(e) => updateField('condominiumFee', e.target.value)}
                className="mt-1"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>IPTU Mensal</Label>
              <Input
                placeholder="R$ 150"
                value={data.iptu}
                onChange={(e) => updateField('iptu', e.target.value)}
                className="mt-1"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>Total Mensal</Label>
              <Input
                placeholder="R$ 3.150"
                value={data.totalMonthly}
                onChange={(e) => updateField('totalMonthly', e.target.value)}
                className="mt-1"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>Caução</Label>
              <Input
                placeholder="2 meses"
                value={data.depositMonths}
                onChange={(e) => updateField('depositMonths', e.target.value)}
                className="mt-1"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>Contrato</Label>
              <Input
                placeholder="30 meses"
                value={data.contractDuration}
                onChange={(e) => updateField('contractDuration', e.target.value)}
                className="mt-1"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Features */}
      <Collapsible open={openSections.features}>
        <SectionHeader icon={CheckSquare} title="Características" section="features" number={5} />
        <CollapsibleContent className="pt-3 pb-4 px-1">
          <div className="grid grid-cols-2 gap-2">
            {locacaoFeatureOptions.map((feature) => (
              <label 
                key={feature}
                className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Checkbox
                  checked={data.features.includes(feature)}
                  onCheckedChange={() => toggleFeature(feature)}
                />
                <span className="text-sm" style={{ color: '#374151' }}>{feature}</span>
              </label>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Contact */}
      <Collapsible open={openSections.contact}>
        <SectionHeader icon={Phone} title="Contato" section="contact" number={6} />
        <CollapsibleContent className="pt-3 pb-4 px-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>Nome</Label>
              <Input
                value={data.contactName}
                onChange={(e) => updateField('contactName', e.target.value)}
                className="mt-1"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
            <div>
              <Label className="text-xs" style={{ color: '#6b7280' }}>Telefone</Label>
              <Input
                value={data.contactPhone}
                onChange={(e) => updateField('contactPhone', e.target.value)}
                className="mt-1"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs" style={{ color: '#6b7280' }}>CRECI</Label>
            <Input
              value={data.creci}
              onChange={(e) => updateField('creci', e.target.value)}
              className="mt-1"
              style={{ borderColor: '#e5e7eb' }}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
