import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RentalPayment, RentalPaymentStatus, RentalContract } from '@/types/rental';
import { useToast } from '@/hooks/use-toast';

export function useRentalPayments(contractId?: string) {
  const [payments, setPayments] = useState<RentalPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPayments = useCallback(async () => {
    try {
      let query = supabase
        .from('rental_payments')
        .select(`
          *,
          contract:rental_contracts(*)
        `)
        .order('due_date', { ascending: false });

      if (contractId) {
        query = query.eq('contract_id', contractId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setPayments((data as unknown as RentalPayment[]) || []);
    } catch (error) {
      console.error('Error fetching rental payments:', error);
      toast({
        title: 'Erro ao carregar pagamentos',
        description: 'Não foi possível carregar os pagamentos.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [contractId, toast]);

  useEffect(() => {
    fetchPayments();

    const channel = supabase
      .channel('rental_payments_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rental_payments' },
        () => {
          fetchPayments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPayments]);

  const generatePaymentsForContract = async (contract: RentalContract) => {
    try {
      const startDate = new Date(contract.start_date);
      const endDate = new Date(contract.end_date);
      const payments: Partial<RentalPayment>[] = [];

      let currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        
        // Calculate due date
        const dueDate = new Date(year, month - 1, contract.payment_due_day);
        
        payments.push({
          contract_id: contract.id,
          reference_month: month,
          reference_year: year,
          due_date: dueDate.toISOString().split('T')[0],
          rent_value: contract.rent_value,
          condominium_fee: contract.condominium_fee,
          iptu_value: contract.iptu_value,
          other_fees: contract.other_fees,
          late_fee: 0,
          discount: 0,
          status: 'pending' as RentalPaymentStatus,
        });

        // Move to next month
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      // Insert all payments
      const { error } = await supabase
        .from('rental_payments')
        .insert(payments as any);

      if (error) throw error;

      toast({
        title: 'Pagamentos gerados',
        description: `${payments.length} parcelas foram criadas para o contrato.`,
      });

      return payments.length;
    } catch (error) {
      console.error('Error generating payments:', error);
      toast({
        title: 'Erro ao gerar pagamentos',
        description: 'Não foi possível gerar os pagamentos.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updatePayment = async (id: string, data: Partial<RentalPayment>) => {
    try {
      const { error } = await supabase
        .from('rental_payments')
        .update(data as any)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Pagamento atualizado',
        description: 'O pagamento foi atualizado com sucesso.',
      });
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: 'Erro ao atualizar pagamento',
        description: 'Não foi possível atualizar o pagamento.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const markAsPaid = async (
    id: string,
    paidAmount: number,
    paymentMethod: string,
    proofUrl?: string
  ) => {
    try {
      const { error } = await supabase
        .from('rental_payments')
        .update({
          status: 'paid',
          paid_amount: paidAmount,
          paid_at: new Date().toISOString(),
          payment_method: paymentMethod,
          payment_proof_url: proofUrl || null,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Pagamento confirmado',
        description: 'O pagamento foi registrado como pago.',
      });
    } catch (error) {
      console.error('Error marking payment as paid:', error);
      toast({
        title: 'Erro ao confirmar pagamento',
        description: 'Não foi possível confirmar o pagamento.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updatePaymentStatus = async (id: string, status: RentalPaymentStatus) => {
    try {
      const updates: Partial<RentalPayment> = { status };
      
      if (status === 'pending') {
        updates.paid_at = null;
        updates.paid_amount = null;
        updates.payment_method = null;
      }

      const { error } = await supabase
        .from('rental_payments')
        .update(updates as any)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  };

  // Auto-update overdue payments
  const checkAndUpdateOverduePayments = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { error } = await supabase
        .from('rental_payments')
        .update({ status: 'overdue' })
        .eq('status', 'pending')
        .lt('due_date', today);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating overdue payments:', error);
    }
  }, []);

  useEffect(() => {
    checkAndUpdateOverduePayments();
  }, [checkAndUpdateOverduePayments]);

  return {
    payments,
    isLoading,
    generatePaymentsForContract,
    updatePayment,
    markAsPaid,
    updatePaymentStatus,
    refetch: fetchPayments,
  };
}
