import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RentalTenant } from '@/types/rentalProperty';

export function useRentalTenants() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tenants = [], isLoading, error } = useQuery({
    queryKey: ['rental-tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rental_tenants')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) throw error;
      return data as RentalTenant[];
    },
  });

  const createTenant = useMutation({
    mutationFn: async (tenant: Partial<RentalTenant>) => {
      const { data, error } = await supabase
        .from('rental_tenants')
        .insert({
          full_name: tenant.full_name || '',
          cpf: tenant.cpf,
          rg: tenant.rg,
          birth_date: tenant.birth_date,
          email: tenant.email,
          phone: tenant.phone,
          whatsapp: tenant.whatsapp,
          profession: tenant.profession,
          workplace: tenant.workplace,
          monthly_income: tenant.monthly_income,
          address: tenant.address,
          neighborhood: tenant.neighborhood,
          city: tenant.city,
          state: tenant.state,
          zip_code: tenant.zip_code,
          emergency_contact_name: tenant.emergency_contact_name,
          emergency_contact_phone: tenant.emergency_contact_phone,
          notes: tenant.notes,
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-tenants'] });
      toast({
        title: 'Inquilino cadastrado',
        description: 'O inquilino foi cadastrado com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error creating tenant:', error);
      toast({
        title: 'Erro ao cadastrar',
        description: 'Não foi possível cadastrar o inquilino.',
        variant: 'destructive',
      });
    },
  });

  const updateTenant = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<RentalTenant> & { id: string }) => {
      const { data, error } = await supabase
        .from('rental_tenants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-tenants'] });
      toast({
        title: 'Inquilino atualizado',
        description: 'O inquilino foi atualizado com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error updating tenant:', error);
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar o inquilino.',
        variant: 'destructive',
      });
    },
  });

  const deleteTenant = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rental_tenants')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-tenants'] });
      toast({
        title: 'Inquilino excluído',
        description: 'O inquilino foi excluído com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error deleting tenant:', error);
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o inquilino.',
        variant: 'destructive',
      });
    },
  });

  return {
    tenants,
    isLoading,
    error,
    createTenant,
    updateTenant,
    deleteTenant,
  };
}
