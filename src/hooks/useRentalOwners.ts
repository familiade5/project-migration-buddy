import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RentalOwner } from '@/types/rentalProperty';

export function useRentalOwners() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: owners = [], isLoading, error } = useQuery({
    queryKey: ['rental-owners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rental_owners')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) throw error;
      return data as RentalOwner[];
    },
  });

  const createOwner = useMutation({
    mutationFn: async (owner: Partial<RentalOwner>) => {
      const { data, error } = await supabase
        .from('rental_owners')
        .insert({
          full_name: owner.full_name || '',
          cpf: owner.cpf,
          rg: owner.rg,
          email: owner.email,
          phone: owner.phone,
          whatsapp: owner.whatsapp,
          address: owner.address,
          neighborhood: owner.neighborhood,
          city: owner.city,
          state: owner.state,
          zip_code: owner.zip_code,
          bank_name: owner.bank_name,
          bank_agency: owner.bank_agency,
          bank_account: owner.bank_account,
          pix_key: owner.pix_key,
          notes: owner.notes,
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-owners'] });
      toast({
        title: 'Proprietário cadastrado',
        description: 'O proprietário foi cadastrado com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error creating owner:', error);
      toast({
        title: 'Erro ao cadastrar',
        description: 'Não foi possível cadastrar o proprietário.',
        variant: 'destructive',
      });
    },
  });

  const updateOwner = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<RentalOwner> & { id: string }) => {
      const { data, error } = await supabase
        .from('rental_owners')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-owners'] });
      toast({
        title: 'Proprietário atualizado',
        description: 'O proprietário foi atualizado com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error updating owner:', error);
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar o proprietário.',
        variant: 'destructive',
      });
    },
  });

  const deleteOwner = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rental_owners')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-owners'] });
      toast({
        title: 'Proprietário excluído',
        description: 'O proprietário foi excluído com sucesso.',
      });
    },
    onError: (error: any) => {
      console.error('Error deleting owner:', error);
      const isConstraintError = error?.code === '23503';
      toast({
        title: 'Erro ao excluir',
        description: isConstraintError 
          ? 'Este proprietário possui imóveis ou contratos vinculados. Exclua-os primeiro.'
          : 'Não foi possível excluir o proprietário.',
        variant: 'destructive',
      });
    },
  });

  return {
    owners,
    isLoading,
    error,
    createOwner,
    updateOwner,
    deleteOwner,
  };
}
