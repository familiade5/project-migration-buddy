import { PropertyData, propertyTypes, propertyFeatures } from '@/types/property';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, MapPin, Bed, Bath, Car, Ruler, Phone } from 'lucide-react';

interface PropertyFormProps {
  data: PropertyData;
  onChange: (data: PropertyData) => void;
}

export const PropertyForm = ({ data, onChange }: PropertyFormProps) => {
  const handleChange = (field: keyof PropertyData, value: string | string[]) => {
    onChange({ ...data, [field]: value });
  };

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = data.features.includes(feature)
      ? data.features.filter(f => f !== feature)
      : [...data.features, feature];
    handleChange('features', newFeatures);
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Título do Anúncio</Label>
              <Input
                id="title"
                placeholder="Ex: Apartamento de Luxo no Centro"
                value={data.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="type">Tipo de Imóvel</Label>
              <Select value={data.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                placeholder="450.000"
                value={data.price}
                onChange={(e) => handleChange('price', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Localização
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Cidade</Label>
              <Input
                id="location"
                placeholder="São Paulo"
                value={data.location}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                placeholder="Jardins"
                value={data.neighborhood}
                onChange={(e) => handleChange('neighborhood', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Ruler className="h-5 w-5 text-primary" />
            Especificações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="bedrooms" className="flex items-center gap-1">
                <Bed className="h-4 w-4" /> Quartos
              </Label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                value={data.bedrooms}
                onChange={(e) => handleChange('bedrooms', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bathrooms" className="flex items-center gap-1">
                <Bath className="h-4 w-4" /> Banheiros
              </Label>
              <Input
                id="bathrooms"
                type="number"
                min="0"
                value={data.bathrooms}
                onChange={(e) => handleChange('bathrooms', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="parkingSpaces" className="flex items-center gap-1">
                <Car className="h-4 w-4" /> Vagas
              </Label>
              <Input
                id="parkingSpaces"
                type="number"
                min="0"
                value={data.parkingSpaces}
                onChange={(e) => handleChange('parkingSpaces', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="area">Área (m²)</Label>
              <Input
                id="area"
                placeholder="120"
                value={data.area}
                onChange={(e) => handleChange('area', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Características</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {propertyFeatures.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  checked={data.features.includes(feature)}
                  onCheckedChange={() => handleFeatureToggle(feature)}
                />
                <Label htmlFor={feature} className="text-sm cursor-pointer">
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Descrição</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Descreva o imóvel com detalhes..."
            value={data.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Contato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactPhone">Telefone</Label>
              <Input
                id="contactPhone"
                placeholder="(11) 99999-9999"
                value={data.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="contactWhatsapp">WhatsApp</Label>
              <Input
                id="contactWhatsapp"
                placeholder="(11) 99999-9999"
                value={data.contactWhatsapp}
                onChange={(e) => handleChange('contactWhatsapp', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
