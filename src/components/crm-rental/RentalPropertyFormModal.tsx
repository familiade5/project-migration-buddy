import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRentalProperties } from '@/hooks/useRentalProperties';
import { useRentalOwners } from '@/hooks/useRentalOwners';
import { RentalProperty, RENTAL_PROPERTY_TYPES, RENTAL_PROPERTY_FEATURES } from '@/types/rentalProperty';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RentalOwnerQuickForm } from './RentalOwnerQuickForm';
import { Plus } from 'lucide-react';

const formSchema = z.object({
  code: z.string().min(1, 'Código obrigatório'),
  property_type: z.string().min(1, 'Tipo obrigatório'),
  address: z.string().min(1, 'Endereço obrigatório'),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().min(1, 'Cidade obrigatória'),
  state: z.string().min(1, 'Estado obrigatório'),
  zip_code: z.string().optional(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  suites: z.coerce.number().optional(),
  garage_spaces: z.coerce.number().optional(),
  total_area: z.coerce.number().optional(),
  useful_area: z.coerce.number().optional(),
  rent_value: z.coerce.number().min(0, 'Valor do aluguel obrigatório'),
  condominium_fee: z.coerce.number().optional(),
  iptu_value: z.coerce.number().optional(),
  other_fees: z.coerce.number().optional(),
  owner_id: z.string().optional(),
  is_furnished: z.boolean().optional(),
  accepts_pets: z.boolean().optional(),
  has_pool: z.boolean().optional(),
  has_gym: z.boolean().optional(),
  has_elevator: z.boolean().optional(),
  has_doorman: z.boolean().optional(),
  features: z.array(z.string()).optional(),
  registration_number: z.string().optional(),
  iptu_registration: z.string().optional(),
  description: z.string().optional(),
  internal_notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface RentalPropertyFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: RentalProperty | null;
}

export function RentalPropertyFormModal({
  open,
  onOpenChange,
  property,
}: RentalPropertyFormModalProps) {
  const { createProperty, updateProperty } = useRentalProperties();
  const { owners } = useRentalOwners();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    property?.features || []
  );
  const [showOwnerForm, setShowOwnerForm] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: property?.code || '',
      property_type: property?.property_type || 'Apartamento',
      address: property?.address || '',
      number: property?.number || '',
      complement: property?.complement || '',
      neighborhood: property?.neighborhood || '',
      city: property?.city || 'Campo Grande',
      state: property?.state || 'MS',
      zip_code: property?.zip_code || '',
      bedrooms: property?.bedrooms || 0,
      bathrooms: property?.bathrooms || 0,
      suites: property?.suites || 0,
      garage_spaces: property?.garage_spaces || 0,
      total_area: property?.total_area || undefined,
      useful_area: property?.useful_area || undefined,
      rent_value: property?.rent_value || 0,
      condominium_fee: property?.condominium_fee || 0,
      iptu_value: property?.iptu_value || 0,
      other_fees: property?.other_fees || 0,
      owner_id: property?.owner_id || '',
      is_furnished: property?.is_furnished || false,
      accepts_pets: property?.accepts_pets || false,
      has_pool: property?.has_pool || false,
      has_gym: property?.has_gym || false,
      has_elevator: property?.has_elevator || false,
      has_doorman: property?.has_doorman || false,
      features: property?.features || [],
      registration_number: property?.registration_number || '',
      iptu_registration: property?.iptu_registration || '',
      description: property?.description || '',
      internal_notes: property?.internal_notes || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    const propertyData = {
      ...data,
      features: selectedFeatures,
      owner_id: data.owner_id || undefined,
    };

    if (property) {
      await updateProperty.mutateAsync({ id: property.id, ...propertyData });
    } else {
      await createProperty.mutateAsync(propertyData);
    }
    onOpenChange(false);
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden bg-white border-gray-200 text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            {property ? 'Editar Imóvel' : 'Novo Imóvel para Locação'}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-1">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-100 border border-gray-200">
                  <TabsTrigger value="basic" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">Básico</TabsTrigger>
                  <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">Detalhes</TabsTrigger>
                  <TabsTrigger value="financial" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">Financeiro</TabsTrigger>
                  <TabsTrigger value="features" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">Características</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Código *</FormLabel>
                          <FormControl>
                            <Input placeholder="LOC-001" {...field} className="bg-white border-gray-200 text-gray-900" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="property_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Tipo *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-gray-200 text-gray-900">
                              {RENTAL_PROPERTY_TYPES.map((type) => (
                                <SelectItem key={type} value={type} className="text-gray-900 focus:bg-gray-100 focus:text-gray-900">
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Endereço *</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua, Número" {...field} className="bg-white border-gray-200 text-gray-900" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Bairro</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white border-gray-200 text-gray-900" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Cidade *</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white border-gray-200 text-gray-900" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Estado *</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white border-gray-200 text-gray-900" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="owner_id"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-gray-700">Proprietário</FormLabel>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowOwnerForm(true)}
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-auto py-1 px-2"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Novo
                          </Button>
                        </div>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value || 'none'}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                              <SelectValue placeholder="Selecione o proprietário" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-gray-200 text-gray-900 z-50">
                            <SelectItem value="none" className="text-gray-900 focus:bg-gray-100 focus:text-gray-900">Nenhum</SelectItem>
                            {owners.map((owner) => (
                              <SelectItem key={owner.id} value={owner.id} className="text-gray-900 focus:bg-gray-100 focus:text-gray-900">
                                {owner.full_name} {owner.cpf && `(${owner.cpf})`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Quartos</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} className="bg-white border-gray-200 text-gray-900" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="suites"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Suítes</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} className="bg-white border-gray-200 text-gray-900" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Banheiros</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} className="bg-white border-gray-200 text-gray-900" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="garage_spaces"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Vagas</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} className="bg-white border-gray-200 text-gray-900" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="total_area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Área Total (m²)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} className="bg-white border-gray-200 text-gray-900" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="useful_area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Área Útil (m²)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} className="bg-white border-gray-200 text-gray-900" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="registration_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Matrícula</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white border-gray-200 text-gray-900" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="iptu_registration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Inscrição IPTU</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white border-gray-200 text-gray-900" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Descrição</FormLabel>
                        <FormControl>
                          <Textarea rows={3} {...field} className="bg-white border-gray-200 text-gray-900" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="financial" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="rent_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Valor do Aluguel *</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} className="bg-white border-gray-200 text-gray-900" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="condominium_fee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Condomínio</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} className="bg-white border-gray-200 text-gray-900" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="iptu_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">IPTU (mensal)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} className="bg-white border-gray-200 text-gray-900" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="other_fees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Outras Taxas</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} className="bg-white border-gray-200 text-gray-900" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="internal_notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Observações Internas</FormLabel>
                        <FormControl>
                          <Textarea rows={3} {...field} className="bg-white border-gray-200 text-gray-900" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="features" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="is_furnished"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
                          <FormLabel className="cursor-pointer text-gray-700">Mobiliado</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="accepts_pets"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
                          <FormLabel className="cursor-pointer text-gray-700">Aceita Pets</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="has_pool"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
                          <FormLabel className="cursor-pointer text-gray-700">Piscina</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="has_gym"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
                          <FormLabel className="cursor-pointer text-gray-700">Academia</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="has_elevator"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
                          <FormLabel className="cursor-pointer text-gray-700">Elevador</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="has_doorman"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
                          <FormLabel className="cursor-pointer text-gray-700">Portaria 24h</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block text-gray-900">
                      Características Adicionais
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {RENTAL_PROPERTY_FEATURES.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={feature}
                            checked={selectedFeatures.includes(feature)}
                            onCheckedChange={() => toggleFeature(feature)}
                          />
                          <label
                            htmlFor={feature}
                            className="text-sm cursor-pointer text-gray-700"
                          >
                            {feature}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="bg-white text-gray-900 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createProperty.isPending || updateProperty.isPending}
                  className="bg-gray-900 text-white hover:bg-gray-800"
                >
                  {property ? 'Salvar' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>

      {/* Owner Quick Form Modal */}
      <RentalOwnerQuickForm
        open={showOwnerForm}
        onOpenChange={setShowOwnerForm}
        onOwnerCreated={(ownerId) => {
          form.setValue('owner_id', ownerId);
        }}
      />
    </Dialog>
  );
}
