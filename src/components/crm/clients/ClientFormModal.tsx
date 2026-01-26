import { useState, useEffect } from 'react';
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
import { CrmClient } from '@/types/client';
import { Loader2, User, MapPin, Phone, FileText } from 'lucide-react';

interface ClientFormModalProps {
  client: CrmClient | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<CrmClient>) => Promise<CrmClient | boolean | null>;
}

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export function ClientFormModal({
  client,
  isOpen,
  onClose,
  onSave,
}: ClientFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<CrmClient>>({
    full_name: '',
    cpf: '',
    rg: '',
    birth_date: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    neighborhood: '',
    city: '',
    state: 'MS',
    zip_code: '',
    notes: '',
  });

  useEffect(() => {
    if (client) {
      setFormData({
        full_name: client.full_name,
        cpf: client.cpf || '',
        rg: client.rg || '',
        birth_date: client.birth_date || '',
        email: client.email || '',
        phone: client.phone || '',
        whatsapp: client.whatsapp || '',
        address: client.address || '',
        neighborhood: client.neighborhood || '',
        city: client.city || '',
        state: client.state || 'MS',
        zip_code: client.zip_code || '',
        notes: client.notes || '',
      });
    } else {
      setFormData({
        full_name: '',
        cpf: '',
        rg: '',
        birth_date: '',
        email: '',
        phone: '',
        whatsapp: '',
        address: '',
        neighborhood: '',
        city: '',
        state: 'MS',
        zip_code: '',
        notes: '',
      });
    }
  }, [client, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name?.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof CrmClient, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            {client ? 'Editar Cliente' : 'Novo Cliente'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Data Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 pb-2 border-b border-gray-200">
              <User className="w-4 h-4" />
              Dados Pessoais
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="full_name" className="text-gray-700">
                  Nome Completo *
                </Label>
                <Input
                  id="full_name"
                  value={formData.full_name || ''}
                  onChange={(e) => updateField('full_name', e.target.value)}
                  className="mt-1 bg-white border-gray-300 text-gray-900"
                  placeholder="Nome completo do cliente"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cpf" className="text-gray-700">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf || ''}
                  onChange={(e) => updateField('cpf', e.target.value)}
                  className="mt-1 bg-white border-gray-300 text-gray-900"
                  placeholder="000.000.000-00"
                />
              </div>

              <div>
                <Label htmlFor="rg" className="text-gray-700">RG</Label>
                <Input
                  id="rg"
                  value={formData.rg || ''}
                  onChange={(e) => updateField('rg', e.target.value)}
                  className="mt-1 bg-white border-gray-300 text-gray-900"
                  placeholder="Número do RG"
                />
              </div>

              <div>
                <Label htmlFor="birth_date" className="text-gray-700">Data de Nascimento</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date || ''}
                  onChange={(e) => updateField('birth_date', e.target.value)}
                  className="mt-1 bg-white border-gray-300 text-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="mt-1 bg-white border-gray-300 text-gray-900"
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 pb-2 border-b border-gray-200">
              <Phone className="w-4 h-4" />
              Contato
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-gray-700">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="mt-1 bg-white border-gray-300 text-gray-900"
                  placeholder="(00) 0000-0000"
                />
              </div>

              <div>
                <Label htmlFor="whatsapp" className="text-gray-700">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp || ''}
                  onChange={(e) => updateField('whatsapp', e.target.value)}
                  className="mt-1 bg-white border-gray-300 text-gray-900"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 pb-2 border-b border-gray-200">
              <MapPin className="w-4 h-4" />
              Endereço
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="address" className="text-gray-700">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => updateField('address', e.target.value)}
                  className="mt-1 bg-white border-gray-300 text-gray-900"
                  placeholder="Rua, número, complemento"
                />
              </div>

              <div>
                <Label htmlFor="neighborhood" className="text-gray-700">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood || ''}
                  onChange={(e) => updateField('neighborhood', e.target.value)}
                  className="mt-1 bg-white border-gray-300 text-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="city" className="text-gray-700">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city || ''}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="mt-1 bg-white border-gray-300 text-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="state" className="text-gray-700">Estado</Label>
                <Select
                  value={formData.state || 'MS'}
                  onValueChange={(value) => updateField('state', value)}
                >
                  <SelectTrigger className="mt-1 bg-white border-gray-300 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BRAZILIAN_STATES.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="zip_code" className="text-gray-700">CEP</Label>
                <Input
                  id="zip_code"
                  value={formData.zip_code || ''}
                  onChange={(e) => updateField('zip_code', e.target.value)}
                  className="mt-1 bg-white border-gray-300 text-gray-900"
                  placeholder="00000-000"
                />
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 pb-2 border-b border-gray-200">
              <FileText className="w-4 h-4" />
              Observações
            </h3>
            
            <Textarea
              value={formData.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              className="bg-white border-gray-300 text-gray-900 min-h-[80px]"
              placeholder="Observações sobre o cliente..."
            />

            {/* Info about documents */}
            {!client && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                <strong>Dica:</strong> Após salvar o cliente, você poderá anexar documentos (RG, CPF, comprovantes, etc.) na tela de detalhes do cliente.
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.full_name?.trim()}
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {client ? 'Salvar Alterações' : 'Cadastrar Cliente'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
