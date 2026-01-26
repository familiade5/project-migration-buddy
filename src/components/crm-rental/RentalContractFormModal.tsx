import { useState, useEffect } from 'react';
import { RentalContract, propertyTypes, guaranteeTypes, getTotalMonthly } from '@/types/rental';
import { formatCurrency } from '@/lib/formatCurrency';
import { useRentalTenants } from '@/hooks/useRentalTenants';
import { useRentalProperties } from '@/hooks/useRentalProperties';
import { useRentalOwners } from '@/hooks/useRentalOwners';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Building2, 
  User, 
  DollarSign, 
  FileText,
  Calendar,
  Save,
  Loader2,
  Home,
} from 'lucide-react';

interface RentalContractFormModalProps {
  contract: RentalContract | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<RentalContract>) => Promise<any>;
}

export function RentalContractFormModal({
  contract,
  isOpen,
  onClose,
  onSave,
}: RentalContractFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<{ id: string; full_name: string }[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const { tenants } = useRentalTenants();
  const { properties } = useRentalProperties();
  const { owners } = useRentalOwners();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<Partial<RentalContract>>({
    property_code: '',
    property_type: 'Apartamento',
    property_address: '',
    property_neighborhood: '',
    property_city: 'Campo Grande',
    property_state: 'MS',
    owner_name: '',
    owner_phone: '',
    owner_email: '',
    owner_pix_key: '',
    owner_bank_info: '',
    tenant_id: null,
    rent_value: 0,
    condominium_fee: 0,
    iptu_value: 0,
    other_fees: 0,
    payment_due_day: 10,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deposit_value: 0,
    deposit_months: 2,
    guarantee_type: 'caucao',
    contract_type: 'residencial',
    management_fee_percentage: 10,
    notes: '',
    responsible_user_id: null,
    rental_property_id: null,
    owner_id: null,
  });

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name');
      if (data) setUsers(data);
    };
    loadUsers();
  }, []);

  // Reset form when contract changes
  useEffect(() => {
    if (contract) {
      setFormData({
        property_code: contract.property_code,
        property_type: contract.property_type,
        property_address: contract.property_address,
        property_neighborhood: contract.property_neighborhood || '',
        property_city: contract.property_city,
        property_state: contract.property_state,
        owner_name: contract.owner_name,
        owner_phone: contract.owner_phone || '',
        owner_email: contract.owner_email || '',
        owner_pix_key: contract.owner_pix_key || '',
        owner_bank_info: contract.owner_bank_info || '',
        tenant_id: contract.tenant_id,
        rent_value: contract.rent_value,
        condominium_fee: contract.condominium_fee,
        iptu_value: contract.iptu_value,
        other_fees: contract.other_fees,
        payment_due_day: contract.payment_due_day,
        start_date: contract.start_date,
        end_date: contract.end_date,
        deposit_value: contract.deposit_value,
        deposit_months: contract.deposit_months,
        guarantee_type: contract.guarantee_type || 'caucao',
        contract_type: contract.contract_type || 'residencial',
        management_fee_percentage: contract.management_fee_percentage,
        notes: contract.notes || '',
        responsible_user_id: contract.responsible_user_id,
        rental_property_id: contract.rental_property_id,
        owner_id: contract.owner_id,
      });
      setSelectedPropertyId(contract.rental_property_id);
    } else {
      // Reset to defaults
      setFormData({
        property_code: '',
        property_type: 'Apartamento',
        property_address: '',
        property_neighborhood: '',
        property_city: 'Campo Grande',
        property_state: 'MS',
        owner_name: '',
        owner_phone: '',
        owner_email: '',
        owner_pix_key: '',
        owner_bank_info: '',
        tenant_id: null,
        rent_value: 0,
        condominium_fee: 0,
        iptu_value: 0,
        other_fees: 0,
        payment_due_day: 10,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        deposit_value: 0,
        deposit_months: 2,
        guarantee_type: 'caucao',
        contract_type: 'residencial',
        management_fee_percentage: 10,
        notes: '',
        responsible_user_id: null,
        rental_property_id: null,
        owner_id: null,
      });
      setSelectedPropertyId(null);
    }
  }, [contract, isOpen]);

  // Handle property selection - auto-populate all fields
  const handlePropertySelect = (propertyId: string) => {
    if (propertyId === 'none') {
      setSelectedPropertyId(null);
      setFormData(prev => ({
        ...prev,
        rental_property_id: null,
        owner_id: null,
      }));
      return;
    }

    const selectedProperty = properties.find(p => p.id === propertyId);
    if (selectedProperty) {
      setSelectedPropertyId(propertyId);
      
      // Build address string
      const addressParts = [selectedProperty.address];
      if (selectedProperty.number) addressParts[0] += `, ${selectedProperty.number}`;
      if (selectedProperty.complement) addressParts.push(selectedProperty.complement);
      const fullAddress = addressParts.join(' - ');

      // Get owner data from the property's linked owner
      const owner = selectedProperty.owner;
      const bankInfo = owner 
        ? [owner.bank_name, owner.bank_agency, owner.bank_account].filter(Boolean).join(' - ')
        : '';

      // Auto-populate all fields and set deposit = rent value
      setFormData(prev => ({
        ...prev,
        rental_property_id: propertyId,
        property_code: selectedProperty.code,
        property_type: selectedProperty.property_type,
        property_address: fullAddress,
        property_neighborhood: selectedProperty.neighborhood || '',
        property_city: selectedProperty.city,
        property_state: selectedProperty.state,
        rent_value: selectedProperty.rent_value,
        condominium_fee: selectedProperty.condominium_fee || 0,
        iptu_value: selectedProperty.iptu_value || 0,
        other_fees: selectedProperty.other_fees || 0,
        deposit_value: selectedProperty.rent_value, // Auto-set deposit = rent
        owner_id: selectedProperty.owner_id || null,
        owner_name: owner?.full_name || '',
        owner_phone: owner?.phone || '',
        owner_email: owner?.email || '',
        owner_pix_key: owner?.pix_key || '',
        owner_bank_info: bankInfo,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.property_code || !formData.property_address || !formData.owner_name) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha o código, endereço e nome do proprietário.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving contract:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof RentalContract, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const totalMonthly = (formData.rent_value || 0) + (formData.condominium_fee || 0) + 
    (formData.iptu_value || 0) + (formData.other_fees || 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {contract ? 'Editar Contrato' : 'Novo Contrato de Locação'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="property" className="mt-4">
          <TabsList className="bg-gray-100 border border-gray-200">
            <TabsTrigger value="property" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
              <Building2 className="w-4 h-4 mr-2" />
              Imóvel
            </TabsTrigger>
            <TabsTrigger value="owner" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
              <User className="w-4 h-4 mr-2" />
              Proprietário
            </TabsTrigger>
            <TabsTrigger value="tenant" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
              <User className="w-4 h-4 mr-2" />
              Inquilino
            </TabsTrigger>
            <TabsTrigger value="financial" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
              <DollarSign className="w-4 h-4 mr-2" />
              Financeiro
            </TabsTrigger>
            <TabsTrigger value="contract" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
              <Calendar className="w-4 h-4 mr-2" />
              Contrato
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] mt-4 pr-4">
            {/* Property Tab */}
            <TabsContent value="property" className="space-y-4 mt-0">
              {/* Property Selector - NEW */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-5 h-5 text-emerald-600" />
                  <Label className="text-emerald-700 font-medium">Selecionar Imóvel Cadastrado</Label>
                </div>
                <Select
                  value={selectedPropertyId || 'none'}
                  onValueChange={handlePropertySelect}
                >
                  <SelectTrigger className="bg-white border-emerald-200 text-gray-900">
                    <SelectValue placeholder="Escolha um imóvel para preencher automaticamente" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-gray-900 z-50">
                    <SelectItem value="none" className="text-gray-900 focus:bg-gray-100 focus:text-gray-900">
                      Nenhum (preencher manualmente)
                    </SelectItem>
                    {properties.map((property) => (
                      <SelectItem 
                        key={property.id} 
                        value={property.id}
                        className="text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                      >
                        {property.code} - {property.address} ({property.property_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-emerald-600 mt-1">
                  Ao selecionar um imóvel, os dados do imóvel, proprietário e valores serão preenchidos automaticamente.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Código do Imóvel *</Label>
                  <Input
                    value={formData.property_code || ''}
                    onChange={(e) => updateField('property_code', e.target.value)}
                    placeholder="Ex: LOC-001"
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Tipo</Label>
                  <Select
                    value={formData.property_type}
                    onValueChange={(v) => updateField('property_type', v)}
                  >
                    <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 text-gray-900 z-50">
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-gray-900 focus:bg-gray-100 focus:text-gray-900">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-gray-700">Endereço Completo *</Label>
                <Input
                  value={formData.property_address || ''}
                  onChange={(e) => updateField('property_address', e.target.value)}
                  placeholder="Rua, número, complemento"
                  className="bg-white border-gray-200 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-700">Bairro</Label>
                  <Input
                    value={formData.property_neighborhood || ''}
                    onChange={(e) => updateField('property_neighborhood', e.target.value)}
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Cidade</Label>
                  <Input
                    value={formData.property_city || ''}
                    onChange={(e) => updateField('property_city', e.target.value)}
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Estado</Label>
                  <Input
                    value={formData.property_state || ''}
                    onChange={(e) => updateField('property_state', e.target.value)}
                    className="bg-white border-gray-200"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Owner Tab */}
            <TabsContent value="owner" className="space-y-4 mt-0">
              {selectedPropertyId && formData.owner_name && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-sm text-emerald-700">
                    ✓ Proprietário preenchido automaticamente do imóvel selecionado
                  </p>
                </div>
              )}
              
              <div>
                <Label className="text-gray-700">Nome do Proprietário *</Label>
                <Input
                  value={formData.owner_name || ''}
                  onChange={(e) => updateField('owner_name', e.target.value)}
                  className="bg-white border-gray-200 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Telefone</Label>
                  <Input
                    value={formData.owner_phone || ''}
                    onChange={(e) => updateField('owner_phone', e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">E-mail</Label>
                  <Input
                    type="email"
                    value={formData.owner_email || ''}
                    onChange={(e) => updateField('owner_email', e.target.value)}
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Chave PIX</Label>
                  <Input
                    value={formData.owner_pix_key || ''}
                    onChange={(e) => updateField('owner_pix_key', e.target.value)}
                    placeholder="CPF, telefone, e-mail ou chave aleatória"
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Dados Bancários</Label>
                  <Input
                    value={formData.owner_bank_info || ''}
                    onChange={(e) => updateField('owner_bank_info', e.target.value)}
                    placeholder="Banco, agência, conta"
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tenant Tab */}
            <TabsContent value="tenant" className="space-y-4 mt-0">
              <div>
                <Label className="text-gray-700">Inquilino</Label>
                <Select
                  value={formData.tenant_id || 'none'}
                  onValueChange={(v) => updateField('tenant_id', v === 'none' ? null : v)}
                >
                  <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                    <SelectValue placeholder="Selecione um inquilino" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-gray-900">
                    <SelectItem value="none" className="text-gray-900 focus:bg-gray-100 focus:text-gray-900">Nenhum</SelectItem>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id} className="text-gray-900 focus:bg-gray-100 focus:text-gray-900">
                        {tenant.full_name} {tenant.cpf && `(${tenant.cpf})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Cadastre inquilinos na aba Clientes do CRM Locação
                </p>
              </div>

              <div>
                <Label>Responsável Interno</Label>
                <Select
                  value={formData.responsible_user_id || 'none'}
                  onValueChange={(v) => updateField('responsible_user_id', v === 'none' ? null : v)}
                >
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue placeholder="Selecione um responsável" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-gray-900">
                    <SelectItem value="none" className="text-gray-900 focus:bg-gray-100 focus:text-gray-900">Nenhum</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id} className="text-gray-900 focus:bg-gray-100 focus:text-gray-900">
                        {user.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financial" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Valor do Aluguel *</Label>
                  <Input
                    type="number"
                    value={formData.rent_value || ''}
                    onChange={(e) => updateField('rent_value', parseFloat(e.target.value) || 0)}
                    className="bg-white border-gray-200"
                  />
                </div>
                <div>
                  <Label>Condomínio</Label>
                  <Input
                    type="number"
                    value={formData.condominium_fee || ''}
                    onChange={(e) => updateField('condominium_fee', parseFloat(e.target.value) || 0)}
                    className="bg-white border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>IPTU (mensal)</Label>
                  <Input
                    type="number"
                    value={formData.iptu_value || ''}
                    onChange={(e) => updateField('iptu_value', parseFloat(e.target.value) || 0)}
                    className="bg-white border-gray-200"
                  />
                </div>
                <div>
                  <Label>Outras Taxas</Label>
                  <Input
                    type="number"
                    value={formData.other_fees || ''}
                    onChange={(e) => updateField('other_fees', parseFloat(e.target.value) || 0)}
                    className="bg-white border-gray-200"
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Mensal:</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(totalMonthly)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Dia de Vencimento</Label>
                  <Input
                    type="number"
                    min={1}
                    max={28}
                    value={formData.payment_due_day || 10}
                    onChange={(e) => updateField('payment_due_day', parseInt(e.target.value) || 10)}
                    className="bg-white border-gray-200"
                  />
                </div>
                <div>
                  <Label>Taxa de Administração (%)</Label>
                  <Input
                    type="number"
                    step={0.5}
                    value={formData.management_fee_percentage || 10}
                    onChange={(e) => updateField('management_fee_percentage', parseFloat(e.target.value) || 10)}
                    className="bg-white border-gray-200"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Contract Tab */}
            <TabsContent value="contract" className="space-y-4 mt-0">
              {/* Contract Type Selection */}
              <div>
                <Label className="text-gray-700">Tipo de Contrato</Label>
                <Select
                  value={formData.contract_type || 'residencial'}
                  onValueChange={(v) => updateField('contract_type', v)}
                >
                  <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-gray-900 z-50">
                    <SelectItem value="residencial" className="text-gray-900 focus:bg-gray-100 focus:text-gray-900">
                      Residencial
                    </SelectItem>
                    <SelectItem value="comercial" className="text-gray-900 focus:bg-gray-100 focus:text-gray-900">
                      Comercial
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Data de Início</Label>
                  <Input
                    type="date"
                    value={formData.start_date || ''}
                    onChange={(e) => updateField('start_date', e.target.value)}
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Data de Término</Label>
                  <Input
                    type="date"
                    value={formData.end_date || ''}
                    onChange={(e) => updateField('end_date', e.target.value)}
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-700">Tipo de Garantia</Label>
                  <Select
                    value={formData.guarantee_type || 'caucao'}
                    onValueChange={(v) => updateField('guarantee_type', v)}
                  >
                    <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 text-gray-900 z-50">
                      {guaranteeTypes.map((type) => (
                        <SelectItem 
                          key={type.value} 
                          value={type.value}
                          className="text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-700">Meses de Caução</Label>
                  <Input
                    type="number"
                    value={formData.deposit_months || 2}
                    onChange={(e) => updateField('deposit_months', parseInt(e.target.value) || 2)}
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Valor da Caução</Label>
                  <Input
                    type="number"
                    value={formData.deposit_value || ''}
                    onChange={(e) => updateField('deposit_value', parseFloat(e.target.value) || 0)}
                    className="bg-white border-gray-200 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-700">Observações</Label>
                <Textarea
                  value={formData.notes || ''}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Observações sobre o contrato..."
                  className="bg-white border-gray-200 text-gray-900 min-h-[100px]"
                />
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-600 hover:text-gray-900"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gray-900 text-white hover:bg-gray-800"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {contract ? 'Salvar Alterações' : 'Criar Contrato'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
