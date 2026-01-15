import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Creci {
  id: string;
  creci_number: string;
  state: string;
  name: string | null;
  is_default: boolean;
}

export const useCrecis = () => {
  const [crecis, setCrecis] = useState<Creci[]>([]);
  const [loading, setLoading] = useState(true);
  const [defaultCreci, setDefaultCreci] = useState<string>('');

  useEffect(() => {
    fetchCrecis();
  }, []);

  const fetchCrecis = async () => {
    try {
      const { data, error } = await supabase
        .from('crecis')
        .select('id, creci_number, state, name, is_default')
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('creci_number', { ascending: true });

      if (error) throw error;

      setCrecis(data || []);
      
      // Set default CRECI
      const defaultOne = data?.find(c => c.is_default);
      if (defaultOne) {
        setDefaultCreci(`${defaultOne.creci_number} ${defaultOne.state}${defaultOne.name ? ` ${defaultOne.name}` : ''}`);
      } else if (data && data.length > 0) {
        setDefaultCreci(`${data[0].creci_number} ${data[0].state}${data[0].name ? ` ${data[0].name}` : ''}`);
      }
    } catch (error) {
      console.error('Error fetching CRECIs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCreci = (creci: Creci) => {
    return `${creci.creci_number} ${creci.state}${creci.name ? ` ${creci.name}` : ''}`;
  };

  return { crecis, loading, defaultCreci, formatCreci };
};
