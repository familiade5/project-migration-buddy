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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRentalTenants } from '@/hooks/useRentalTenants';
import { RentalTenant } from '@/types/rentalProperty';

const formSchema = z.object({
  full_name: z.string().min(1, 'Nome obrigatório'),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  birth_date: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  profession: z.string().optional(),
  workplace: z.string().optional(),
  monthly_income: z.coerce.number().optional(),
  address: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface RentalTenantFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant?: RentalTenant | null;
}

export function RentalTenantFormModal({
  open,
  onOpenChange,
  tenant,
}: RentalTenantFormModalProps) {
  const { createTenant, updateTenant } = useRentalTenants();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: tenant?.full_name || '',
      cpf: tenant?.cpf || '',
      rg: tenant?.rg || '',
      birth_date: tenant?.birth_date || '',
      email: tenant?.email || '',
      phone: tenant?.phone || '',
      whatsapp: tenant?.whatsapp || '',
      profession: tenant?.profession || '',
      workplace: tenant?.workplace || '',
      monthly_income: tenant?.monthly_income || undefined,
      address: tenant?.address || '',
      neighborhood: tenant?.neighborhood || '',
      city: tenant?.city || 'Campo Grande',
      state: tenant?.state || 'MS',
      zip_code: tenant?.zip_code || '',
      emergency_contact_name: tenant?.emergency_contact_name || '',
      emergency_contact_phone: tenant?.emergency_contact_phone || '',
      notes: tenant?.notes || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (tenant) {
      await updateTenant.mutateAsync({ id: tenant.id, ...data });
    } else {
      await createTenant.mutateAsync(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden bg-white border-gray-200 text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            {tenant ? 'Editar Inquilino' : 'Novo Inquilino'}
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

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">CPF</FormLabel>
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
                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Data Nasc.</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="bg-white border-gray-200 text-gray-900" />
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

              {/* Work Info */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium mb-3 text-gray-900">Dados Profissionais</p>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Profissão</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white border-gray-200 text-gray-900" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="monthly_income"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Renda Mensal</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} className="bg-white border-gray-200 text-gray-900" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="workplace"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel className="text-gray-700">Local de Trabalho</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-white border-gray-200 text-gray-900" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium mb-3 text-gray-900">Endereço Atual</p>
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
                <div className="grid grid-cols-3 gap-4 mt-4">
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
              </div>

              {/* Emergency Contact */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium mb-3 text-gray-900">Contato de Emergência</p>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="emergency_contact_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Nome</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white border-gray-200 text-gray-900" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emergency_contact_phone"
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
                </div>
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

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
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
                  disabled={createTenant.isPending || updateTenant.isPending}
                  className="bg-gray-900 text-white hover:bg-gray-800"
                >
                  {tenant ? 'Salvar' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
