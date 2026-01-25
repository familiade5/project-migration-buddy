import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyReminder, StageReminderDefault } from '@/types/reminder';
import { PropertyStage } from '@/types/crm';
import { useToast } from '@/hooks/use-toast';

export function useCrmReminders() {
  const [reminders, setReminders] = useState<PropertyReminder[]>([]);
  const [stageDefaults, setStageDefaults] = useState<StageReminderDefault[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchReminders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('crm_property_reminders')
        .select('*')
        .eq('is_active', true)
        .order('next_reminder_at', { ascending: true });

      if (error) throw error;
      setReminders((data || []) as PropertyReminder[]);
    } catch (error: any) {
      console.error('Error fetching reminders:', error);
    }
  }, []);

  const fetchStageDefaults = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('crm_stage_reminder_defaults')
        .select('*')
        .order('stage');

      if (error) throw error;
      setStageDefaults((data || []) as StageReminderDefault[]);
    } catch (error: any) {
      console.error('Error fetching stage defaults:', error);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchReminders(), fetchStageDefaults()]).finally(() => {
      setIsLoading(false);
    });

    // Subscribe to realtime updates
    const channel = supabase
      .channel('crm_reminders_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'crm_property_reminders' },
        () => {
          fetchReminders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchReminders, fetchStageDefaults]);

  const getDefaultInterval = useCallback(
    (stage: PropertyStage): number => {
      const stageDefault = stageDefaults.find((d) => d.stage === stage);
      return stageDefault?.default_interval_hours || 24;
    },
    [stageDefaults]
  );

  const isStageReminderEnabled = useCallback(
    (stage: PropertyStage): boolean => {
      const stageDefault = stageDefaults.find((d) => d.stage === stage);
      return stageDefault?.is_enabled ?? true;
    },
    [stageDefaults]
  );

  const createReminder = useCallback(
    async (
      propertyId: string,
      stage: PropertyStage,
      intervalHours?: number,
      isCustom: boolean = false
    ) => {
      const interval = intervalHours || getDefaultInterval(stage);
      const nextReminderAt = new Date(Date.now() + interval * 60 * 60 * 1000).toISOString();

      try {
        const { error } = await supabase.from('crm_property_reminders').insert({
          property_id: propertyId,
          stage,
          interval_hours: interval,
          next_reminder_at: nextReminderAt,
          is_custom: isCustom,
          is_active: true,
        });

        if (error) throw error;
      } catch (error: any) {
        console.error('Error creating reminder:', error);
        throw error;
      }
    },
    [getDefaultInterval]
  );

  const cancelPropertyReminders = useCallback(async (propertyId: string) => {
    try {
      const { error } = await supabase
        .from('crm_property_reminders')
        .update({ is_active: false })
        .eq('property_id', propertyId)
        .eq('is_active', true);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error cancelling reminders:', error);
    }
  }, []);

  const handleStageChange = useCallback(
    async (propertyId: string, newStage: PropertyStage) => {
      // Cancel all active reminders for this property
      await cancelPropertyReminders(propertyId);

      // Create new reminder if the stage has reminders enabled
      if (isStageReminderEnabled(newStage)) {
        await createReminder(propertyId, newStage);
      }
    },
    [cancelPropertyReminders, createReminder, isStageReminderEnabled]
  );

  const updateReminderInterval = useCallback(
    async (propertyId: string, stage: PropertyStage, intervalHours: number) => {
      try {
        // Cancel existing reminder
        await cancelPropertyReminders(propertyId);

        // Create new reminder with custom interval
        await createReminder(propertyId, stage, intervalHours, true);

        toast({
          title: 'Lembrete atualizado',
          description: `Intervalo alterado para ${intervalHours}h`,
        });
      } catch (error: any) {
        toast({
          title: 'Erro ao atualizar lembrete',
          description: error.message,
          variant: 'destructive',
        });
      }
    },
    [cancelPropertyReminders, createReminder, toast]
  );

  const snoozeReminder = useCallback(
    async (reminderId: string, hours: number = 24) => {
      try {
        const nextReminderAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

        const { error } = await supabase
          .from('crm_property_reminders')
          .update({ next_reminder_at: nextReminderAt })
          .eq('id', reminderId);

        if (error) throw error;

        toast({
          title: 'Lembrete adiado',
          description: `Próximo lembrete em ${hours}h`,
        });
      } catch (error: any) {
        toast({
          title: 'Erro ao adiar lembrete',
          description: error.message,
          variant: 'destructive',
        });
      }
    },
    [toast]
  );

  const getReminderForProperty = useCallback(
    (propertyId: string): PropertyReminder | undefined => {
      return reminders.find((r) => r.property_id === propertyId && r.is_active);
    },
    [reminders]
  );

  return {
    reminders,
    stageDefaults,
    isLoading,
    getDefaultInterval,
    isStageReminderEnabled,
    createReminder,
    cancelPropertyReminders,
    handleStageChange,
    updateReminderInterval,
    snoozeReminder,
    getReminderForProperty,
    refetch: fetchReminders,
  };
}
