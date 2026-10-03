import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CxCreditAnalysis } from '@/types/cxCrm';

export function useCxCreditAnalyses(dealId: string | null) {
  const [analyses, setAnalyses] = useState<CxCreditAnalysis[]>([]);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    if (!dealId) { setAnalyses([]); return; }
    setLoading(true);
    const { data, error } = await supabase.from('cx_credit_analyses').select('*').eq('deal_id', dealId).order('analysis_date', { ascending: false });
    if (error) toast.error('Erro ao carregar análises', { description: error.message });
    else setAnalyses((data || []) as unknown as CxCreditAnalysis[]);
    setLoading(false);
  }, [dealId]);

  useEffect(() => { refetch(); }, [refetch]);

  const createAnalysis = useCallback(async (input: Record<string, unknown>) => {
    if (!dealId) return null;
    const { data: auth } = await supabase.auth.getUser();
    const { data, error } = await supabase.from('cx_credit_analyses').insert({
      ...input,
      deal_id: dealId,
      sequence_number: 0,
      created_by_user_id: auth.user?.id ?? null,
      analyst_user_id: auth.user?.id ?? null,
      analyst_name: auth.user?.user_metadata?.full_name || auth.user?.email || null,
    } as never).select().single();
    if (error) { toast.error('Não foi possível salvar a análise', { description: error.message }); return null; }
    await refetch();
    return data as unknown as CxCreditAnalysis;
  }, [dealId, refetch]);

  return { analyses, loading, refetch, createAnalysis };
}