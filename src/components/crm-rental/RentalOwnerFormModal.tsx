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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRentalOwners } from '@/hooks/useRentalOwners';
import { useAuth } from '@/contexts/AuthContext';
import { RentalOwner } from '@/types/rentalProperty';
import { Trash2 } from 'lucide-react';

const formSchema = z.object({
  full_name: z.string().min(1, 'Nome obrigatório'),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  bank_name: z.string().optional(),
  bank_agency: z.string().optional(),
  bank_account: z.string().optional(),
  pix_key: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface RentalOwnerFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  owner?: RentalOwner | null;
}

const SUPER_ADMIN_EMAIL = 'neto@vendadiretahoje.com.br';

export function RentalOwnerFormModal({
  open,
  onOpenChange,
  owner,
}: RentalOwnerFormModalProps) {
  const { createOwner, updateOwner, deleteOwner } = useRentalOwners();
  const { user } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: owner?.full_name || '',
      cpf: owner?.cpf || '',
      rg: owner?.rg || '',
      email: owner?.email || '',
      phone: owner?.phone || '',
      whatsapp: owner?.whatsapp || '',
      address: owner?.address || '',
      neighborhood: owner?.neighborhood || '',
      city: owner?.city || 'Campo Grande',
      state: owner?.state || 'MS',
      zip_code: owner?.zip_code || '',
      bank_name: owner?.bank_name || '',
      bank_agency: owner?.bank_agency || '',
      bank_account: owner?.bank_account || '',
      pix_key: owner?.pix_key || '',
      notes: owner?.notes || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (owner) {
      await updateOwner.mutateAsync({ id: owner.id, ...data });
    } else {
      await createOwner.mutateAsync(data);
    }
    onOpenChange(false);
  };

  const handleDelete = async () => {
    if (owner) {
      await deleteOwner.mutateAsync(owner.id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden bg-white border-gray-200 text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            {owner ? 'Editar Proprietário' : 'Novo Proprietário'}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-1">
              {/* Personal Info */}
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Nome Completo *</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white border-gray-200 text-gray-900" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">CPF/CNPJ</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-white border-gray-200 text-gray-900" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">RG</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-white border-gray-200 text-gray-900" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-white border-gray-200 text-gray-900" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">WhatsApp</FormLabel>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} className="bg-white border-gray-200 text-gray-900" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Endereço</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white border-gray-200 text-gray-900" />
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
                      <FormLabel className="text-gray-700">Cidade</FormLabel>
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
                      <FormLabel className="text-gray-700">Estado</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-white border-gray-200 text-gray-900" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Bank Info */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium mb-3 text-gray-900">Dados Bancários</p>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="bank_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Banco</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white border-gray-200 text-gray-900" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bank_agency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Agência</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white border-gray-200 text-gray-900" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bank_account"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Conta</FormLabel>
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
                  name="pix_key"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel className="text-gray-700">Chave PIX</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-white border-gray-200 text-gray-900" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Observações</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} className="bg-white border-gray-200 text-gray-900" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between gap-2 pt-4 border-t border-gray-200">
                <div>
                  {owner && isSuperAdmin && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createOwner.isPending || updateOwner.isPending}
                    className="bg-gray-900 text-white hover:bg-gray-800"
                  >
                    {owner ? 'Salvar' : 'Cadastrar'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>

    {/* Delete Confirmation Dialog */}
    <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Proprietário</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o proprietário "{owner?.full_name}"? 
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
