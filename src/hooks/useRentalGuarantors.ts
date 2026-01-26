import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RentalGuarantor } from '@/types/rentalProperty';

export function useRentalGuarantors() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: guarantors = [], isLoading, error } = useQuery({
    queryKey: ['rental-guarantors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rental_guarantors')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) throw error;
      return data as RentalGuarantor[];
    },
  });

  const createGuarantor = useMutation({
    mutationFn: async (guarantor: Partial<RentalGuarantor>) => {
      const { data, error } = await supabase
        .from('rental_guarantors')
        .insert({
          full_name: guarantor.full_name || '',
          cpf: guarantor.cpf,
          rg: guarantor.rg,
          email: guarantor.email,
          phone: guarantor.phone,
          whatsapp: guarantor.whatsapp,
          profession: guarantor.profession,
          monthly_income: guarantor.monthly_income,
          address: guarantor.address,
          neighborhood: guarantor.neighborhood,
          city: guarantor.city,
          state: guarantor.state,
          zip_code: guarantor.zip_code,
          property_address: guarantor.property_address,
          property_registration: guarantor.property_registration,
          notes: guarantor.notes,
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-guarantors'] });
      toast({
        title: 'Fiador cadastrado',
        description: 'O fiador foi cadastrado com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error creating guarantor:', error);
      toast({
        title: 'Erro ao cadastrar',
        description: 'Não foi possível cadastrar o fiador.',
        variant: 'destructive',
      });
    },
  });

  const updateGuarantor = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<RentalGuarantor> & { id: string }) => {
      const { data, error } = await supabase
        .from('rental_guarantors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-guarantors'] });
      toast({
        title: 'Fiador atualizado',
        description: 'O fiador foi atualizado com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error updating guarantor:', error);
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar o fiador.',
        variant: 'destructive',
      });
    },
  });

  const deleteGuarantor = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rental_guarantors')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-guarantors'] });
      toast({
        title: 'Fiador excluído',
        description: 'O fiador foi excluído com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error deleting guarantor:', error);
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o fiador.',
        variant: 'destructive',
      });
    },
  });

  return {
    guarantors,
    isLoading,
    error,
    createGuarantor,
    updateGuarantor,
    deleteGuarantor,
  };
}
