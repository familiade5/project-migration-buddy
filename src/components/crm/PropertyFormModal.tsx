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
      <DialogContent className="max-w-lg bg-[#0d0d0d] border-[#1a1a1a] text-[#e0e0e0]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#e0e0e0]">
            {property ? 'Editar Imóvel' : 'Novo Imóvel'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-[#888]">
                Código *
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ex: VDH-001"
                required
                className="bg-[#1a1a1a] border-[#2a2a2a] text-[#e0e0e0] placeholder:text-[#555]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-[#888]">
                Tipo *
              </Label>
              <Select
                value={formData.property_type}
                onValueChange={(value: PropertyType) =>
                  setFormData({ ...formData, property_type: value })
                }
              >
                <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-[#e0e0e0]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                  {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="text-[#e0e0e0] focus:bg-[#2a2a2a] focus:text-[#e0e0e0]"
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
              <Label htmlFor="city" className="text-[#888]">
                Cidade *
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="bg-[#1a1a1a] border-[#2a2a2a] text-[#e0e0e0] placeholder:text-[#555]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-[#888]">
                Estado *
              </Label>
              <Select
                value={formData.state}
                onValueChange={(value) => setFormData({ ...formData, state: value })}
              >
                <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-[#e0e0e0]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] max-h-60">
                  {states.map((state) => (
                    <SelectItem
                      key={state}
                      value={state}
                      className="text-[#e0e0e0] focus:bg-[#2a2a2a] focus:text-[#e0e0e0]"
                    >
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhood" className="text-[#888]">
              Bairro
            </Label>
            <Input
              id="neighborhood"
              value={formData.neighborhood}
              onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
              className="bg-[#1a1a1a] border-[#2a2a2a] text-[#e0e0e0] placeholder:text-[#555]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-[#888]">
              Endereço
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="bg-[#1a1a1a] border-[#2a2a2a] text-[#e0e0e0] placeholder:text-[#555]"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sale_value" className="text-[#888]">
                Valor de Venda
              </Label>
              <Input
                id="sale_value"
                type="number"
                step="0.01"
                value={formData.sale_value}
                onChange={(e) => setFormData({ ...formData, sale_value: e.target.value })}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-[#e0e0e0] placeholder:text-[#555]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission_value" className="text-[#888]">
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
                className="bg-[#1a1a1a] border-[#2a2a2a] text-[#e0e0e0] placeholder:text-[#555]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission_percentage" className="text-[#888]">
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
                className="bg-[#1a1a1a] border-[#2a2a2a] text-[#e0e0e0] placeholder:text-[#555]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsible" className="text-[#888]">
              Corretor Responsável
            </Label>
            <Select
              value={formData.responsible_user_id || 'none'}
              onValueChange={(value) =>
                setFormData({ ...formData, responsible_user_id: value === 'none' ? '' : value })
              }
            >
              <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-[#e0e0e0]">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                <SelectItem
                  value="none"
                  className="text-[#888] focus:bg-[#2a2a2a] focus:text-[#e0e0e0]"
                >
                  Nenhum
                </SelectItem>
                {users.map((user) => (
                  <SelectItem
                    key={user.id}
                    value={user.id}
                    className="text-[#e0e0e0] focus:bg-[#2a2a2a] focus:text-[#e0e0e0]"
                  >
                    {user.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-[#888]">
              Observações
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="bg-[#1a1a1a] border-[#2a2a2a] text-[#e0e0e0] placeholder:text-[#555] resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#1a1a1a]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-transparent border-[#2a2a2a] text-[#888] hover:bg-[#1a1a1a] hover:text-[#e0e0e0]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#3b82f6] text-white hover:bg-[#2563eb]"
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
