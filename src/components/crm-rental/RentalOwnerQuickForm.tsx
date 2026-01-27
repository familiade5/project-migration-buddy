import { useState } from 'react';
import { useRentalOwners } from '@/hooks/useRentalOwners';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Plus, Save } from 'lucide-react';

interface RentalOwnerQuickFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOwnerCreated: (ownerId: string) => void;
}

export function RentalOwnerQuickForm({
  open,
  onOpenChange,
  onOwnerCreated,
}: RentalOwnerQuickFormProps) {
  const { createOwner } = useRentalOwners();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    cpf: '',
    email: '',
    phone: '',
    whatsapp: '',
    pix_key: '',
    bank_name: '',
    bank_agency: '',
    bank_account: '',
    address: '',
    neighborhood: '',
    city: 'Campo Grande',
    state: 'MS',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim()) return;

    setIsLoading(true);
    try {
      const result = await createOwner.mutateAsync(formData);
      onOwnerCreated(result.id);
      onOpenChange(false);
      setFormData({
        full_name: '',
        cpf: '',
        email: '',
        phone: '',
        whatsapp: '',
        pix_key: '',
        bank_name: '',
        bank_agency: '',
        bank_account: '',
        address: '',
        neighborhood: '',
        city: 'Campo Grande',
        state: 'MS',
      });
    } catch (error) {
      console.error('Error creating owner:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Cadastrar Proprietário
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label className="text-gray-700">Nome Completo *</Label>
            <Input
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Nome do proprietário"
              className="bg-white border-gray-200 text-gray-900"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700">CPF</Label>
              <Input
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                placeholder="000.000.000-00"
                className="bg-white border-gray-200 text-gray-900"
              />
            </div>
            <div>
              <Label className="text-gray-700">E-mail</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white border-gray-200 text-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700">Telefone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="bg-white border-gray-200 text-gray-900"
              />
            </div>
            <div>
              <Label className="text-gray-700">WhatsApp</Label>
              <Input
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="(00) 00000-0000"
                className="bg-white border-gray-200 text-gray-900"
              />
            </div>
          </div>

          <div>
            <Label className="text-gray-700">Chave PIX</Label>
            <Input
              value={formData.pix_key}
              onChange={(e) => setFormData({ ...formData, pix_key: e.target.value })}
              placeholder="CPF, telefone, e-mail ou chave aleatória"
              className="bg-white border-gray-200 text-gray-900"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-gray-700">Banco</Label>
              <Input
                value={formData.bank_name}
                onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                className="bg-white border-gray-200 text-gray-900"
              />
            </div>
            <div>
              <Label className="text-gray-700">Agência</Label>
              <Input
                value={formData.bank_agency}
                onChange={(e) => setFormData({ ...formData, bank_agency: e.target.value })}
                className="bg-white border-gray-200 text-gray-900"
              />
            </div>
            <div>
              <Label className="text-gray-700">Conta</Label>
              <Input
                value={formData.bank_account}
                onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
                className="bg-white border-gray-200 text-gray-900"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.full_name.trim()}
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2 text-white" />
                  Cadastrar
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
