import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RentalProperty, RentalPropertyStage } from '@/types/rentalProperty';
import { useAuth } from '@/contexts/AuthContext';

export function useRentalProperties() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['rental-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rental_properties')
        .select(`
          *,
          owner:rental_owners(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as RentalProperty[];
    },
  });

  const createProperty = useMutation({
    mutationFn: async (property: Partial<RentalProperty>) => {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      const { data, error } = await supabase
        .from('rental_properties')
        .insert({
          code: property.code || '',
          address: property.address || '',
          property_type: property.property_type || 'Apartamento',
          city: property.city || 'Campo Grande',
          state: property.state || 'MS',
          rent_value: property.rent_value || 0,
          neighborhood: property.neighborhood,
          zip_code: property.zip_code,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          suites: property.suites,
          garage_spaces: property.garage_spaces,
          total_area: property.total_area,
          useful_area: property.useful_area,
          is_furnished: property.is_furnished,
          accepts_pets: property.accepts_pets,
          has_pool: property.has_pool,
          has_gym: property.has_gym,
          has_elevator: property.has_elevator,
          has_doorman: property.has_doorman,
          features: property.features,
          condominium_fee: property.condominium_fee,
          iptu_value: property.iptu_value,
          other_fees: property.other_fees,
          owner_id: property.owner_id,
          cover_image_url: property.cover_image_url,
          photos: property.photos,
          registration_number: property.registration_number,
          iptu_registration: property.iptu_registration,
          description: property.description,
          internal_notes: property.internal_notes,
          responsible_user_id: property.responsible_user_id,
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-properties'] });
      toast({
        title: 'Imóvel cadastrado',
        description: 'O imóvel foi cadastrado com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error creating property:', error);
      toast({
        title: 'Erro ao cadastrar',
        description: 'Não foi possível cadastrar o imóvel.',
        variant: 'destructive',
      });
    },
  });

  const updateProperty = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<RentalProperty> & { id: string }) => {
      const { data, error } = await supabase
        .from('rental_properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-properties'] });
      toast({
        title: 'Imóvel atualizado',
        description: 'O imóvel foi atualizado com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error updating property:', error);
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar o imóvel.',
        variant: 'destructive',
      });
    },
  });

  const moveProperty = useMutation({
    mutationFn: async ({
      propertyId,
      fromStage,
      toStage,
    }: {
      propertyId: string;
      fromStage: RentalPropertyStage;
      toStage: RentalPropertyStage;
    }) => {
      // Update property stage
      const { error: updateError } = await supabase
        .from('rental_properties')
        .update({
          current_stage: toStage,
          stage_entered_at: new Date().toISOString(),
        })
        .eq('id', propertyId);

      if (updateError) throw updateError;

      // Log history
      const { error: historyError } = await supabase
        .from('rental_property_history')
        .insert({
          property_id: propertyId,
          from_stage: fromStage,
          to_stage: toStage,
          moved_by_user_id: (await supabase.auth.getUser()).data.user?.id,
          moved_by_name: profile?.full_name,
        });

      if (historyError) throw historyError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-properties'] });
    },
    onError: (error) => {
      console.error('Error moving property:', error);
      toast({
        title: 'Erro ao mover',
        description: 'Não foi possível mover o imóvel.',
        variant: 'destructive',
      });
    },
  });

  const deleteProperty = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rental_properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-properties'] });
      toast({
        title: 'Imóvel excluído',
        description: 'O imóvel foi excluído com sucesso.',
      });
    },
    onError: (error: any) => {
      console.error('Error deleting property:', error);
      const isConstraintError = error?.code === '23503';
      toast({
        title: 'Erro ao excluir',
        description: isConstraintError 
          ? 'Este imóvel possui contratos vinculados. Exclua os contratos primeiro.'
          : 'Não foi possível excluir o imóvel.',
        variant: 'destructive',
      });
    },
  });

  return {
    properties,
    isLoading,
    error,
    createProperty,
    updateProperty,
    moveProperty,
    deleteProperty,
  };
}
