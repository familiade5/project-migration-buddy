import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CrmProperty, CrmPropertyHistory, PropertyStage } from '@/types/crm';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useCrmProperties() {
  const [properties, setProperties] = useState<CrmProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchProperties = useCallback(async () => {
    try {
      // First fetch properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('crm_properties')
        .select('*')
        .order('stage_entered_at', { ascending: false });

      if (propertiesError) throw propertiesError;

      // Get unique user IDs to fetch their names
      const userIds = [...new Set(
        (propertiesData || [])
          .map(p => p.responsible_user_id)
          .filter(Boolean)
      )];

      // Fetch user profiles if there are any responsible users
      let userMap: Record<string, string> = {};
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        if (profilesData) {
          userMap = profilesData.reduce((acc, p) => {
            acc[p.id] = p.full_name;
            return acc;
          }, {} as Record<string, string>);
        }
      }

      const propertiesWithNames = (propertiesData || []).map((p: any) => ({
        ...p,
        responsible_user_name: p.responsible_user_id ? userMap[p.responsible_user_id] || null : null,
      }));

      setProperties(propertiesWithNames);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      toast({
        title: 'Erro ao carregar imóveis',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProperties();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('crm_properties_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'crm_properties' },
        () => {
          fetchProperties();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProperties]);

  const moveProperty = useCallback(
    async (propertyId: string, fromStage: PropertyStage, toStage: PropertyStage) => {
      if (fromStage === toStage) return;

      try {
        // Update the property stage
        const { error: updateError } = await supabase
          .from('crm_properties')
          .update({
            current_stage: toStage,
            stage_entered_at: new Date().toISOString(),
          })
          .eq('id', propertyId);

        if (updateError) throw updateError;

        // Record the movement in history
        const { error: historyError } = await supabase
          .from('crm_property_history')
          .insert({
            property_id: propertyId,
            from_stage: fromStage,
            to_stage: toStage,
            moved_by_user_id: profile?.id,
            moved_by_name: profile?.full_name,
          });

        if (historyError) throw historyError;

        toast({
          title: 'Imóvel movido',
          description: `Imóvel atualizado com sucesso`,
        });
      } catch (error: any) {
        console.error('Error moving property:', error);
        toast({
          title: 'Erro ao mover imóvel',
          description: error.message,
          variant: 'destructive',
        });
        // Refetch to restore correct state
        fetchProperties();
      }
    },
    [profile, toast, fetchProperties]
  );

  const createProperty = useCallback(
    async (data: Partial<CrmProperty>) => {
      try {
        const { error } = await supabase.from('crm_properties').insert({
          code: data.code,
          property_type: data.property_type || 'casa',
          city: data.city,
          state: data.state || 'MS',
          neighborhood: data.neighborhood,
          address: data.address,
          sale_value: data.sale_value,
          commission_value: data.commission_value,
          commission_percentage: data.commission_percentage,
          responsible_user_id: data.responsible_user_id,
          notes: data.notes,
        });

        if (error) throw error;

        toast({
          title: 'Imóvel criado',
          description: 'O imóvel foi adicionado ao CRM',
        });

        return true;
      } catch (error: any) {
        console.error('Error creating property:', error);
        toast({
          title: 'Erro ao criar imóvel',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }
    },
    [toast]
  );

  const updateProperty = useCallback(
    async (id: string, data: Partial<CrmProperty>) => {
      try {
        const { error } = await supabase
          .from('crm_properties')
          .update(data)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: 'Imóvel atualizado',
          description: 'As alterações foram salvas',
        });

        return true;
      } catch (error: any) {
        console.error('Error updating property:', error);
        toast({
          title: 'Erro ao atualizar imóvel',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }
    },
    [toast]
  );

  const deleteProperty = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase
          .from('crm_properties')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: 'Imóvel excluído',
          description: 'O imóvel foi removido do CRM',
        });

        return true;
      } catch (error: any) {
        console.error('Error deleting property:', error);
        toast({
          title: 'Erro ao excluir imóvel',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }
    },
    [toast]
  );

  return {
    properties,
    isLoading,
    moveProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    refetch: fetchProperties,
  };
}

export function useCrmPropertyHistory(propertyId: string | null) {
  const [history, setHistory] = useState<CrmPropertyHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!propertyId) {
      setHistory([]);
      return;
    }

    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('crm_property_history')
          .select('*')
          .eq('property_id', propertyId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setHistory(data || []);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [propertyId]);

  return { history, isLoading };
}
