import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RentalContract, RentalContractStatus } from '@/types/rental';
import { useToast } from '@/hooks/use-toast';

export function useRentalContracts() {
  const [contracts, setContracts] = useState<RentalContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchContracts = useCallback(async () => {
    try {
      // Fetch contracts with tenant info
      const { data, error } = await supabase
        .from('rental_contracts')
        .select(`
          *,
          tenant:crm_clients(id, full_name, phone, whatsapp, email, cpf)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch responsible user names separately
      const contractsWithUsers = await Promise.all(
        ((data as unknown as RentalContract[]) || []).map(async (contract) => {
          if (contract.responsible_user_id) {
            const { data: userData } = await supabase
              .from('profiles')
              .select('id, full_name')
              .eq('id', contract.responsible_user_id)
              .maybeSingle();
            return { ...contract, responsible_user: userData };
          }
          return contract;
        })
      );
      
      setContracts(contractsWithUsers);
    } catch (error) {
      console.error('Error fetching rental contracts:', error);
      toast({
        title: 'Erro ao carregar contratos',
        description: 'Não foi possível carregar os contratos de locação.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchContracts();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('rental_contracts_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rental_contracts' },
        () => {
          fetchContracts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchContracts]);

  const createContract = async (data: Partial<RentalContract>) => {
    try {
      const { data: newContract, error } = await supabase
        .from('rental_contracts')
        .insert(data as any)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Contrato criado',
        description: 'O contrato foi cadastrado com sucesso.',
      });

      return newContract;
    } catch (error) {
      console.error('Error creating contract:', error);
      toast({
        title: 'Erro ao criar contrato',
        description: 'Não foi possível criar o contrato.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateContract = async (id: string, data: Partial<RentalContract>) => {
    try {
      const { error } = await supabase
        .from('rental_contracts')
        .update(data as any)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Contrato atualizado',
        description: 'O contrato foi atualizado com sucesso.',
      });
    } catch (error) {
      console.error('Error updating contract:', error);
      toast({
        title: 'Erro ao atualizar contrato',
        description: 'Não foi possível atualizar o contrato.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteContract = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rental_contracts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Contrato excluído',
        description: 'O contrato foi excluído com sucesso.',
      });
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast({
        title: 'Erro ao excluir contrato',
        description: 'Não foi possível excluir o contrato.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateContractStatus = async (id: string, status: RentalContractStatus) => {
    try {
      const { error } = await supabase
        .from('rental_contracts')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating contract status:', error);
      throw error;
    }
  };

  return {
    contracts,
    isLoading,
    createContract,
    updateContract,
    deleteContract,
    updateContractStatus,
    refetch: fetchContracts,
  };
}
