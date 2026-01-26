import { useState, useEffect } from 'react';
import { RentalContract, propertyTypes, guaranteeTypes, getTotalMonthly } from '@/types/rental';
import { formatCurrency } from '@/lib/formatCurrency';
import { useCrmClients } from '@/hooks/useCrmClients';
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
  const { clients } = useCrmClients();
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
    management_fee_percentage: 10,
    notes: '',
    responsible_user_id: null,
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
        guarantee_type: contract.guarantee_type || '',
        management_fee_percentage: contract.management_fee_percentage,
        notes: contract.notes || '',
        responsible_user_id: contract.responsible_user_id,
      });
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
        management_fee_percentage: 10,
        notes: '',
        responsible_user_id: null,
      });
    }
  }, [contract, isOpen]);

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
          <TabsList className="bg-gray-800 border border-gray-700">
            <TabsTrigger value="property" className="data-[state=active]:bg-gray-700">
              <Building2 className="w-4 h-4 mr-2" />
              Imóvel
            </TabsTrigger>
            <TabsTrigger value="owner" className="data-[state=active]:bg-gray-700">
              <User className="w-4 h-4 mr-2" />
              Proprietário
            </TabsTrigger>
            <TabsTrigger value="tenant" className="data-[state=active]:bg-gray-700">
              <User className="w-4 h-4 mr-2" />
              Inquilino
            </TabsTrigger>
            <TabsTrigger value="financial" className="data-[state=active]:bg-gray-700">
              <DollarSign className="w-4 h-4 mr-2" />
              Financeiro
            </TabsTrigger>
            <TabsTrigger value="contract" className="data-[state=active]:bg-gray-700">
              <Calendar className="w-4 h-4 mr-2" />
              Contrato
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] mt-4 pr-4">
            {/* Property Tab */}
            <TabsContent value="property" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Código do Imóvel *</Label>
                  <Input
                    value={formData.property_code || ''}
                    onChange={(e) => updateField('property_code', e.target.value)}
                    placeholder="Ex: LOC-001"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Select
                    value={formData.property_type}
                    onValueChange={(v) => updateField('property_type', v)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Endereço Completo *</Label>
                <Input
                  value={formData.property_address || ''}
                  onChange={(e) => updateField('property_address', e.target.value)}
                  placeholder="Rua, número, complemento"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Bairro</Label>
                  <Input
                    value={formData.property_neighborhood || ''}
                    onChange={(e) => updateField('property_neighborhood', e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label>Cidade</Label>
                  <Input
                    value={formData.property_city || ''}
                    onChange={(e) => updateField('property_city', e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label>Estado</Label>
                  <Input
                    value={formData.property_state || ''}
                    onChange={(e) => updateField('property_state', e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Owner Tab */}
            <TabsContent value="owner" className="space-y-4 mt-0">
              <div>
                <Label>Nome do Proprietário *</Label>
                <Input
                  value={formData.owner_name || ''}
                  onChange={(e) => updateField('owner_name', e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Telefone</Label>
                  <Input
                    value={formData.owner_phone || ''}
                    onChange={(e) => updateField('owner_phone', e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    value={formData.owner_email || ''}
                    onChange={(e) => updateField('owner_email', e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Chave PIX</Label>
                  <Input
                    value={formData.owner_pix_key || ''}
                    onChange={(e) => updateField('owner_pix_key', e.target.value)}
                    placeholder="CPF, telefone, e-mail ou chave aleatória"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label>Dados Bancários</Label>
                  <Input
                    value={formData.owner_bank_info || ''}
                    onChange={(e) => updateField('owner_bank_info', e.target.value)}
                    placeholder="Banco, agência, conta"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tenant Tab */}
            <TabsContent value="tenant" className="space-y-4 mt-0">
              <div>
                <Label>Inquilino</Label>
                <Select
                  value={formData.tenant_id || 'none'}
                  onValueChange={(v) => updateField('tenant_id', v === 'none' ? null : v)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="none">Nenhum</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.full_name} {client.cpf && `(${client.cpf})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  O inquilino deve estar cadastrado na aba Clientes do CRM
                </p>
              </div>

              <div>
                <Label>Responsável Interno</Label>
                <Select
                  value={formData.responsible_user_id || 'none'}
                  onValueChange={(v) => updateField('responsible_user_id', v === 'none' ? null : v)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Selecione um responsável" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="none">Nenhum</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
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
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label>Condomínio</Label>
                  <Input
                    type="number"
                    value={formData.condominium_fee || ''}
                    onChange={(e) => updateField('condominium_fee', parseFloat(e.target.value) || 0)}
                    className="bg-gray-800 border-gray-700"
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
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label>Outras Taxas</Label>
                  <Input
                    type="number"
                    value={formData.other_fees || ''}
                    onChange={(e) => updateField('other_fees', parseFloat(e.target.value) || 0)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Mensal:</span>
                  <span className="text-2xl font-bold text-emerald-400">
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
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label>Taxa de Administração (%)</Label>
                  <Input
                    type="number"
                    step={0.5}
                    value={formData.management_fee_percentage || 10}
                    onChange={(e) => updateField('management_fee_percentage', parseFloat(e.target.value) || 10)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Contract Tab */}
            <TabsContent value="contract" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data de Início</Label>
                  <Input
                    type="date"
                    value={formData.start_date || ''}
                    onChange={(e) => updateField('start_date', e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label>Data de Término</Label>
                  <Input
                    type="date"
                    value={formData.end_date || ''}
                    onChange={(e) => updateField('end_date', e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Tipo de Garantia</Label>
                  <Select
                    value={formData.guarantee_type || ''}
                    onValueChange={(v) => updateField('guarantee_type', v)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {guaranteeTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Meses de Caução</Label>
                  <Input
                    type="number"
                    value={formData.deposit_months || 2}
                    onChange={(e) => updateField('deposit_months', parseInt(e.target.value) || 2)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label>Valor da Caução</Label>
                  <Input
                    type="number"
                    value={formData.deposit_value || ''}
                    onChange={(e) => updateField('deposit_value', parseFloat(e.target.value) || 0)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>

              <div>
                <Label>Observações</Label>
                <Textarea
                  value={formData.notes || ''}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Observações sobre o contrato..."
                  className="bg-gray-800 border-gray-700 min-h-[100px]"
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
            className="bg-gray-900 hover:bg-gray-800"
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
