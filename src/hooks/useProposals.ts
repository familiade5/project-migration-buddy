import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Proposal, ProposalChecklistItem, ProposalHistoryEntry, ProposalStage, CHECKLIST_TEMPLATE } from '@/types/proposals';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchProposals = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('stage_entered_at', { ascending: false });
      if (error) throw error;
      setProposals((data || []) as unknown as Proposal[]);
    } catch (error: any) {
      console.error('Error fetching proposals:', error);
      toast({ title: 'Erro ao carregar propostas', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProposals();
    const channel = supabase
      .channel('proposals_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'proposals' }, fetchProposals)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchProposals]);

  const createProposal = useCallback(async (data: Partial<Proposal>) => {
    try {
      const { data: inserted, error } = await supabase
        .from('proposals')
        .insert({
          nome: data.nome!,
          corretor: data.corretor,
          agencia: data.agencia,
          cpf: data.cpf,
          produto: data.produto,
          imovel: data.imovel,
          matricula: data.matricula,
          oficio: data.oficio,
          cidade: data.cidade,
          telefone: data.telefone,
          email: data.email,
          valor_financiamento: data.valor_financiamento,
          banco: data.banco,
          notas: data.notas,
          created_by_user_id: profile?.id,
        } as any)
        .select()
        .single();

      if (error) throw error;

      // Create default checklist items
      const checklistItems = CHECKLIST_TEMPLATE.flatMap(group =>
        group.items.map(item => ({
          proposal_id: (inserted as any).id,
          category: group.category,
          item_key: item.key,
          item_label: item.label,
          status: 'pendente' as const,
        }))
      );

      await supabase.from('proposal_checklist').insert(checklistItems as any);

      // Record history
      await supabase.from('proposal_history').insert({
        proposal_id: (inserted as any).id,
        action: 'Proposta criada',
        to_stage: 'proposta',
        moved_by_user_id: profile?.id,
        moved_by_name: profile?.full_name,
      } as any);

      toast({ title: 'Proposta criada', description: 'Proposta adicionada ao CRM' });
      return (inserted as any).id;
    } catch (error: any) {
      console.error('Error creating proposal:', error);
      toast({ title: 'Erro ao criar proposta', description: error.message, variant: 'destructive' });
      return null;
    }
  }, [profile, toast]);

  const updateProposal = useCallback(async (id: string, data: Partial<Proposal>) => {
    try {
      const { error } = await supabase.from('proposals').update(data as any).eq('id', id);
      if (error) throw error;
      toast({ title: 'Proposta atualizada' });
      return true;
    } catch (error: any) {
      toast({ title: 'Erro ao atualizar proposta', description: error.message, variant: 'destructive' });
      return false;
    }
  }, [toast]);

  const moveProposal = useCallback(async (proposalId: string, fromStage: ProposalStage, toStage: ProposalStage) => {
    if (fromStage === toStage) return;
    try {
      const { error } = await supabase.from('proposals').update({
        stage: toStage,
        stage_entered_at: new Date().toISOString(),
      } as any).eq('id', proposalId);
      if (error) throw error;

      await supabase.from('proposal_history').insert({
        proposal_id: proposalId,
        action: 'Etapa alterada',
        from_stage: fromStage,
        to_stage: toStage,
        moved_by_user_id: profile?.id,
        moved_by_name: profile?.full_name,
      } as any);

      toast({ title: 'Proposta movida', description: 'Etapa atualizada com sucesso' });
    } catch (error: any) {
      toast({ title: 'Erro ao mover proposta', description: error.message, variant: 'destructive' });
      fetchProposals();
    }
  }, [profile, toast, fetchProposals]);

  const deleteProposal = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('proposals').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Proposta excluída' });
      return true;
    } catch (error: any) {
      toast({ title: 'Erro ao excluir proposta', description: error.message, variant: 'destructive' });
      return false;
    }
  }, [toast]);

  return { proposals, isLoading, createProposal, updateProposal, moveProposal, deleteProposal, refetch: fetchProposals };
}

export function useProposalDetail(proposalId: string | null) {
  const [checklist, setChecklist] = useState<ProposalChecklistItem[]>([]);
  const [history, setHistory] = useState<ProposalHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchDetail = useCallback(async () => {
    if (!proposalId) { setChecklist([]); setHistory([]); return; }
    setIsLoading(true);
    try {
      const [checklistRes, historyRes] = await Promise.all([
        supabase.from('proposal_checklist').select('*').eq('proposal_id', proposalId).order('category').order('item_label'),
        supabase.from('proposal_history').select('*').eq('proposal_id', proposalId).order('created_at', { ascending: false }),
      ]);
      if (checklistRes.error) throw checklistRes.error;
      if (historyRes.error) throw historyRes.error;
      setChecklist((checklistRes.data || []) as unknown as ProposalChecklistItem[]);
      setHistory((historyRes.data || []) as unknown as ProposalHistoryEntry[]);
    } catch (error) {
      console.error('Error fetching detail:', error);
    } finally {
      setIsLoading(false);
    }
  }, [proposalId]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  const updateChecklistItem = useCallback(async (itemId: string, status: 'pendente' | 'conforme' | 'nao_se_aplica', observacao?: string) => {
    try {
      const { error } = await supabase.from('proposal_checklist').update({
        status,
        observacao: observacao ?? null,
        updated_by_user_id: profile?.id,
      } as any).eq('id', itemId);
      if (error) throw error;
      setChecklist(prev => prev.map(item => item.id === itemId ? { ...item, status, observacao: observacao ?? null } : item));
    } catch (error: any) {
      toast({ title: 'Erro ao atualizar checklist', description: error.message, variant: 'destructive' });
    }
  }, [profile, toast]);

  return { checklist, history, isLoading, updateChecklistItem, refetch: fetchDetail };
}
