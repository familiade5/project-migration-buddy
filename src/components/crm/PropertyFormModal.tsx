import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { CrmProperty, PropertyType, PROPERTY_TYPE_LABELS } from '@/types/crm';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  full_name: string;
}

interface PropertyFormModalProps {
  property: CrmProperty | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<CrmProperty>) => Promise<boolean>;
}

export function PropertyFormModal({
  property,
  isOpen,
  onClose,
  onSave,
}: PropertyFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<Profile[]>([]);
  const [formData, setFormData] = useState({
    code: '',
    property_type: 'casa' as PropertyType,
    city: '',
    state: 'MS',
    neighborhood: '',
    address: '',
    sale_value: '',
    commission_value: '',
    commission_percentage: '',
    responsible_user_id: '',
    notes: '',
  });

  useEffect(() => {
    // Fetch users for assignment
    const fetchUsers = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name');
      if (data) setUsers(data);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (property) {
      setFormData({
        code: property.code,
        property_type: property.property_type,
        city: property.city,
        state: property.state,
        neighborhood: property.neighborhood || '',
        address: property.address || '',
        sale_value: property.sale_value?.toString() || '',
        commission_value: property.commission_value?.toString() || '',
        commission_percentage: property.commission_percentage?.toString() || '',
        responsible_user_id: property.responsible_user_id || '',
        notes: property.notes || '',
      });
    } else {
      setFormData({
        code: '',
        property_type: 'casa',
        city: '',
        state: 'MS',
        neighborhood: '',
        address: '',
        sale_value: '',
        commission_value: '',
        commission_percentage: '',
        responsible_user_id: '',
        notes: '',
      });
    }
  }, [property, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await onSave({
      code: formData.code,
      property_type: formData.property_type,
      city: formData.city,
      state: formData.state,
      neighborhood: formData.neighborhood || null,
      address: formData.address || null,
      sale_value: formData.sale_value ? parseFloat(formData.sale_value) : null,
      commission_value: formData.commission_value
        ? parseFloat(formData.commission_value)
        : null,
      commission_percentage: formData.commission_percentage
        ? parseFloat(formData.commission_percentage)
        : null,
      responsible_user_id: formData.responsible_user_id || null,
      notes: formData.notes || null,
    });

    setIsLoading(false);
    if (success) onClose();
  };

  const states = [
    'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT',
    'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white border-gray-200 text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {property ? 'Editar Imóvel' : 'Novo Imóvel'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-gray-600">
                Código *
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ex: VDH-001"
                required
                className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-gray-600">
                Tipo *
              </Label>
              <Select
                value={formData.property_type}
                onValueChange={(value: PropertyType) =>
                  setFormData({ ...formData, property_type: value })
                }
              >
                <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-gray-600">
                Cidade *
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-gray-600">
                Estado *
              </Label>
              <Select
                value={formData.state}
                onValueChange={(value) => setFormData({ ...formData, state: value })}
              >
                <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 max-h-60">
                  {states.map((state) => (
                    <SelectItem
                      key={state}
                      value={state}
                      className="text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                    >
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhood" className="text-gray-600">
              Bairro
            </Label>
            <Input
              id="neighborhood"
              value={formData.neighborhood}
              onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
              className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-gray-600">
              Endereço
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sale_value" className="text-gray-600">
                Valor de Venda
              </Label>
              <Input
                id="sale_value"
                type="number"
                step="0.01"
                value={formData.sale_value}
                onChange={(e) => setFormData({ ...formData, sale_value: e.target.value })}
                className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission_value" className="text-gray-600">
                Comissão (R$)
              </Label>
              <Input
                id="commission_value"
                type="number"
                step="0.01"
                value={formData.commission_value}
                onChange={(e) =>
                  setFormData({ ...formData, commission_value: e.target.value })
                }
                className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission_percentage" className="text-gray-600">
                Comissão (%)
              </Label>
              <Input
                id="commission_percentage"
                type="number"
                step="0.01"
                value={formData.commission_percentage}
                onChange={(e) =>
                  setFormData({ ...formData, commission_percentage: e.target.value })
                }
                className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsible" className="text-gray-600">
              Corretor Responsável
            </Label>
            <Select
              value={formData.responsible_user_id || 'none'}
              onValueChange={(value) =>
                setFormData({ ...formData, responsible_user_id: value === 'none' ? '' : value })
              }
            >
              <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem
                  value="none"
                  className="text-gray-500 focus:bg-gray-100 focus:text-gray-900"
                >
                  Nenhum
                </SelectItem>
                {users.map((user) => (
                  <SelectItem
                    key={user.id}
                    value={user.id}
                    className="text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                  >
                    {user.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-600">
              Observações
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
