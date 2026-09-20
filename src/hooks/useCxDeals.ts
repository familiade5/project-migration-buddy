import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CxDeal, CxDealCheck, CxDealHistory, CxDealStage } from '@/types/cxCrm';

export type CxDealInput = Partial<Omit<CxDeal, 'id' | 'created_at' | 'updated_at'>> & {
  client_id: string;
};

export function useCxDeals() {
  const [deals, setDeals] = useState<CxDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDeals = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('cx_deals')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast.error('Erro ao carregar o funil', { description: error.message });
    } else {
      setDeals((data || []) as unknown as CxDeal[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const currentUser = async () => {
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  };

  const createDeal = useCallback(
    async (input: CxDealInput) => {
      const user = await currentUser();
      const { data, error } = await supabase
        .from('cx_deals')
        .insert({ ...input, created_by_user_id: user?.id ?? null } as never)
        .select()
        .single();
      if (error) {
        toast.error('Erro ao criar caso', { description: error.message });
        return null;
      }
      const deal = data as unknown as CxDeal;
      await supabase.from('cx_deal_history').insert({
        deal_id: deal.id,
        from_stage: null,
        to_stage: deal.stage,
        moved_by_user_id: user?.id ?? null,
        moved_by_name: (user?.user_metadata as any)?.full_name || user?.email || null,
        notes: 'Caso criado',
      } as never);
      toast.success('Caso criado');
      await fetchDeals();
      return deal;
    },
    [fetchDeals],
  );

  const updateDeal = useCallback(
    async (id: string, input: Partial<CxDeal>, silent = false) => {
      const { error } = await supabase.from('cx_deals').update(input as never).eq('id', id);
      if (error) {
        toast.error('Erro ao salvar', { description: error.message });
        return false;
      }
      setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, ...input } : d)));
      if (!silent) toast.success('Caso atualizado');
      return true;
    },
    [],
  );

  const moveDeal = useCallback(
    async (id: string, from: CxDealStage, to: CxDealStage) => {
      const user = await currentUser();
      const patch: Partial<CxDeal> = { stage: to, stage_entered_at: new Date().toISOString() };
      if (to !== 'reprovado') patch.rejection_reason = null;
      const ok = await updateDeal(id, patch, true);
      if (!ok) return false;
      await supabase.from('cx_deal_history').insert({
        deal_id: id,
        from_stage: from,
        to_stage: to,
        moved_by_user_id: user?.id ?? null,
        moved_by_name: (user?.user_metadata as any)?.full_name || user?.email || null,
      } as never);
      return true;
    },
    [updateDeal],
  );

  const deleteDeal = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('cx_deals').delete().eq('id', id);
      if (error) {
        toast.error('Erro ao excluir', { description: error.message });
        return false;
      }
      toast.success('Caso excluído');
      setDeals((prev) => prev.filter((d) => d.id !== id));
      return true;
    },
    [],
  );

  return { deals, isLoading, fetchDeals, createDeal, updateDeal, moveDeal, deleteDeal };
}

export function useCxDealDetail(dealId: string | null) {
  const [history, setHistory] = useState<CxDealHistory[]>([]);
  const [checks, setChecks] = useState<CxDealCheck[]>([]);

  const fetchAll = useCallback(async () => {
    if (!dealId) {
      setHistory([]);
      setChecks([]);
      return;
    }
    const [h, c] = await Promise.all([
      supabase.from('cx_deal_history').select('*').eq('deal_id', dealId).order('created_at', { ascending: false }),
      supabase.from('cx_deal_checks').select('*').eq('deal_id', dealId).order('checked_at', { ascending: false }),
    ]);
    setHistory((h.data || []) as unknown as CxDealHistory[]);
    setChecks((c.data || []) as unknown as CxDealCheck[]);
  }, [dealId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addCheck = useCallback(
    async (input: Partial<CxDealCheck>) => {
      if (!dealId) return false;
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      const { error } = await supabase.from('cx_deal_checks').insert({
        ...input,
        deal_id: dealId,
        created_by_user_id: user?.id ?? null,
        created_by_name: (user?.user_metadata as any)?.full_name || user?.email || null,
      } as never);
      if (error) {
        toast.error('Erro ao registrar consulta', { description: error.message });
        return false;
      }
      toast.success('Consulta registrada');
      await fetchAll();
      return true;
    },
    [dealId, fetchAll],
  );

  return { history, checks, refetch: fetchAll, addCheck };
}
