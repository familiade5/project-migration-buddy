import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CrmClientSearch } from '@/types/clientSearch';
import { useToast } from '@/hooks/use-toast';

export function useCrmClientSearch(clientId: string | null) {
  const [search, setSearch] = useState<CrmClientSearch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchSearch = useCallback(async () => {
    if (!clientId) { setSearch(null); return; }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('crm_client_searches')
        .select('*')
        .eq('client_id', clientId)
        .maybeSingle();
      if (error) throw error;
      setSearch(data as CrmClientSearch | null);
    } catch (error) {
      console.error('Error fetching client search:', error);
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  useEffect(() => { fetchSearch(); }, [fetchSearch]);

  const saveSearch = async (data: Partial<CrmClientSearch>): Promise<boolean> => {
    if (!clientId) return false;
    try {
      if (search) {
        const { error } = await supabase
          .from('crm_client_searches')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', search.id);
        if (error) throw error;
        setSearch(prev => prev ? { ...prev, ...data } : null);
      } else {
        const { data: newSearch, error } = await supabase
          .from('crm_client_searches')
          .insert({ ...data, client_id: clientId })
          .select()
          .single();
        if (error) throw error;
        setSearch(newSearch as CrmClientSearch);
      }
      toast({ title: 'Perfil de busca salvo', description: 'As preferências do cliente foram atualizadas.' });
      return true;
    } catch (error) {
      console.error('Error saving client search:', error);
      toast({ title: 'Erro ao salvar', description: 'Não foi possível salvar o perfil de busca.', variant: 'destructive' });
      return false;
    }
  };

  return { search, isLoading, saveSearch, refetch: fetchSearch };
}
