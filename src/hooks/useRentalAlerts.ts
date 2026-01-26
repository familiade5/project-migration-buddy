import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RentalAlertConfig, RentalPayment, RentalContract } from '@/types/rental';
import { useToast } from '@/hooks/use-toast';
import { differenceInDays, parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface RentalAlert {
  id: string;
  payment: RentalPayment;
  contract: RentalContract;
  config: RentalAlertConfig;
  daysOffset: number;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  dueDate: Date;
}

export function useRentalAlerts(payments: RentalPayment[], contracts: RentalContract[]) {
  const [alertConfigs, setAlertConfigs] = useState<RentalAlertConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAlertConfigs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('rental_alert_configs')
        .select('*')
        .eq('is_enabled', true)
        .order('days_offset', { ascending: true });

      if (error) throw error;
      
      setAlertConfigs((data as unknown as RentalAlertConfig[]) || []);
    } catch (error) {
      console.error('Error fetching alert configs:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlertConfigs();
  }, [fetchAlertConfigs]);

  const updateAlertConfig = async (id: string, data: Partial<RentalAlertConfig>) => {
    try {
      const { error } = await supabase
        .from('rental_alert_configs')
        .update(data as any)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Configuração atualizada',
        description: 'A configuração de alerta foi atualizada.',
      });

      fetchAlertConfigs();
    } catch (error) {
      console.error('Error updating alert config:', error);
      toast({
        title: 'Erro ao atualizar configuração',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Calculate active alerts based on payments and configs
  const alerts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const activeAlerts: RentalAlert[] = [];

    // Only check pending and overdue payments
    const relevantPayments = payments.filter(
      p => p.status === 'pending' || p.status === 'overdue'
    );

    for (const payment of relevantPayments) {
      const dueDate = parseISO(payment.due_date);
      const daysDiff = differenceInDays(dueDate, today);
      
      // Find contract for this payment
      const contract = contracts.find(c => c.id === payment.contract_id);
      if (!contract) continue;

      // Check each alert config
      for (const config of alertConfigs) {
        // Config days_offset: negative = before due, positive = after due
        // daysDiff: positive = future, negative = past
        
        let shouldAlert = false;
        
        if (config.days_offset < 0) {
          // Before due date alert
          shouldAlert = daysDiff <= Math.abs(config.days_offset) && daysDiff >= 0;
        } else if (config.days_offset === 0) {
          // On due date
          shouldAlert = daysDiff === 0;
        } else {
          // After due date
          shouldAlert = daysDiff < 0 && Math.abs(daysDiff) >= config.days_offset;
        }

        if (shouldAlert) {
          const message = config.message_template
            ? config.message_template.replace('{property}', contract.property_code)
            : `Aluguel ${contract.property_code} - ${format(dueDate, 'dd/MM/yyyy')}`;

          let severity: 'info' | 'warning' | 'critical' = 'info';
          if (config.days_offset >= 7) severity = 'critical';
          else if (config.days_offset >= 1) severity = 'warning';

          activeAlerts.push({
            id: `${payment.id}-${config.id}`,
            payment,
            contract,
            config,
            daysOffset: daysDiff,
            message,
            severity,
            dueDate,
          });
        }
      }
    }

    // Sort by severity and date
    return activeAlerts.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (severityDiff !== 0) return severityDiff;
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  }, [payments, contracts, alertConfigs]);

  // Group alerts by severity
  const alertsByType = useMemo(() => ({
    critical: alerts.filter(a => a.severity === 'critical'),
    warning: alerts.filter(a => a.severity === 'warning'),
    info: alerts.filter(a => a.severity === 'info'),
  }), [alerts]);

  return {
    alerts,
    alertsByType,
    alertConfigs,
    isLoading,
    updateAlertConfig,
    refetch: fetchAlertConfigs,
  };
}
