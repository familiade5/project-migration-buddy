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
      
      // Set default CRECI: prioritize PJ for default state
      const defaultOne = data?.find(c => c.is_default);
      if (defaultOne) {
        // If default is not PJ, look for PJ of same state
        const pjForState = data?.find(c => c.state === defaultOne.state && c.name === 'PJ');
        const chosen = pjForState || defaultOne;
        setDefaultCreci(`${chosen.creci_number} ${chosen.state}${chosen.name ? ` ${chosen.name}` : ''}`);
      } else if (data && data.length > 0) {
        const pjFirst = data.find(c => c.name === 'PJ') || data[0];
        setDefaultCreci(`${pjFirst.creci_number} ${pjFirst.state}${pjFirst.name ? ` ${pjFirst.name}` : ''}`);
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
