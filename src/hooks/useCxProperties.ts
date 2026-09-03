import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CxProperty } from '@/types/correspondente';

type PropertyInput = {
  name: string;
  address?: string | null;
  registration_number?: string | null;
  notary_office?: string | null;
  notes?: string | null;
  status?: string | null;
};

export function useCxProperties() {
  const [properties, setProperties] = useState<CxProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('cx_properties')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast.error('Erro ao carregar imóveis', { description: error.message });
    } else {
      setProperties((data || []) as unknown as CxProperty[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const createProperty = useCallback(
    async (input: PropertyInput) => {
      const { data: userData } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('cx_properties')
        .insert({ ...input, created_by_user_id: userData.user?.id ?? null })
        .select()
        .single();
      if (error) {
        toast.error('Erro ao criar imóvel', { description: error.message });
        return null;
      }
      toast.success('Imóvel criado');
      await fetchProperties();
      return data as unknown as CxProperty;
    },
    [fetchProperties],
  );

  const updateProperty = useCallback(
    async (id: string, input: Partial<PropertyInput>) => {
      const { error } = await supabase.from('cx_properties').update(input).eq('id', id);
      if (error) {
        toast.error('Erro ao salvar', { description: error.message });
        return false;
      }
      await fetchProperties();
      return true;
    },
    [fetchProperties],
  );

  const deleteProperty = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('cx_properties').delete().eq('id', id);
      if (error) {
        toast.error('Erro ao excluir', { description: error.message });
        return false;
      }
      toast.success('Imóvel excluído');
      await fetchProperties();
      return true;
    },
    [fetchProperties],
  );

  return { properties, isLoading, fetchProperties, createProperty, updateProperty, deleteProperty };
}
