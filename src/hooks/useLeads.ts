import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CrmLead, CrmLeadHistory, CrmLeadInteraction, LeadSdrStage, LeadSalesStage } from '@/types/leads';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useLeads() {
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchLeads = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('crm_leads')
        .select('*')
        .order('data_entrada', { ascending: false });
      if (error) throw error;
      setLeads((data || []) as unknown as CrmLead[]);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      toast({ title: 'Erro ao carregar leads', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLeads();
    const channel = supabase
      .channel('crm_leads_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'crm_leads' }, fetchLeads)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchLeads]);

  const createLead = useCallback(async (data: Partial<CrmLead>) => {
    try {
      const { data: inserted, error } = await supabase
        .from('crm_leads')
        .insert({
          nome: data.nome!,
          telefone: data.telefone!,
          cidade: data.cidade,
          origem_lead: data.origem_lead,
          classificacao: data.classificacao || 'morno',
          anotacoes: data.anotacoes,
          sdr_responsavel_nome: data.sdr_responsavel_nome || profile?.full_name,
          created_by_user_id: profile?.id,
        } as any)
        .select()
        .single();

      if (error) throw error;

      // Log history
      await supabase.from('crm_lead_history').insert({
        lead_id: (inserted as any).id,
        action: 'Lead criado',
        to_sdr_stage: 'lead_recebido',
        moved_by_user_id: profile?.id,
        moved_by_name: profile?.full_name,
      } as any);

      toast({ title: 'Lead criado', description: `${data.nome} adicionado ao pipeline` });
      return (inserted as any).id;
    } catch (error: any) {
      toast({ title: 'Erro ao criar lead', description: error.message, variant: 'destructive' });
      return null;
    }
  }, [profile, toast]);

  const updateLead = useCallback(async (id: string, data: Partial<CrmLead>) => {
    try {
      const { error } = await supabase
        .from('crm_leads')
        .update({ ...data, ultima_interacao_at: new Date().toISOString() } as any)
        .eq('id', id);
      if (error) throw error;
      toast({ title: 'Lead atualizado' });
      return true;
    } catch (error: any) {
      toast({ title: 'Erro ao atualizar lead', description: error.message, variant: 'destructive' });
      return false;
    }
  }, [toast]);

  const moveSdrStage = useCallback(async (leadId: string, fromStage: LeadSdrStage, toStage: LeadSdrStage) => {
    if (fromStage === toStage) return;

    // Validation: to move to 'qualificado' all criteria must be met
    if (toStage === 'qualificado') {
      const lead = leads.find(l => l.id === leadId);
      if (lead && (!lead.tem_interesse || !lead.tem_condicao_financeira || !lead.momento_compra)) {
        toast({
          title: 'Critérios não atendidos',
          description: 'Para qualificar, o lead precisa ter interesse, condição financeira e estar no momento de compra.',
          variant: 'destructive',
        });
        return;
      }
    }

    try {
      const updateData: any = {
        sdr_stage: toStage,
        stage_entered_at: new Date().toISOString(),
        ultima_interacao_at: new Date().toISOString(),
      };

      // Auto-populate sales pipeline when qualified
      if (toStage === 'qualificado') {
        updateData.sales_stage = 'recebido_sdr';
      }

      const { error } = await supabase.from('crm_leads').update(updateData).eq('id', leadId);
      if (error) throw error;

      await supabase.from('crm_lead_history').insert({
        lead_id: leadId,
        action: 'Etapa SDR alterada',
        from_sdr_stage: fromStage,
        to_sdr_stage: toStage,
        moved_by_user_id: profile?.id,
        moved_by_name: profile?.full_name,
      } as any);

      if (toStage === 'qualificado') {
        toast({ title: '🎉 Lead qualificado!', description: 'Movido automaticamente para pipeline de vendas.' });
      } else {
        toast({ title: 'Lead movido' });
      }
    } catch (error: any) {
      toast({ title: 'Erro ao mover lead', description: error.message, variant: 'destructive' });
      fetchLeads();
    }
  }, [leads, profile, toast, fetchLeads]);

  const moveSalesStage = useCallback(async (leadId: string, fromStage: LeadSalesStage, toStage: LeadSalesStage) => {
    if (fromStage === toStage) return;
    try {
      const updateData: any = {
        sales_stage: toStage,
        stage_entered_at: new Date().toISOString(),
        ultima_interacao_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('crm_leads').update(updateData).eq('id', leadId);
      if (error) throw error;

      await supabase.from('crm_lead_history').insert({
        lead_id: leadId,
        action: 'Etapa Vendas alterada',
        from_sales_stage: fromStage,
        to_sales_stage: toStage,
        moved_by_user_id: profile?.id,
        moved_by_name: profile?.full_name,
      } as any);

      toast({ title: 'Lead movido no pipeline de vendas' });
    } catch (error: any) {
      toast({ title: 'Erro ao mover lead', description: error.message, variant: 'destructive' });
      fetchLeads();
    }
  }, [profile, toast, fetchLeads]);

  const deleteLead = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('crm_leads').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Lead excluído' });
      return true;
    } catch (error: any) {
      toast({ title: 'Erro ao excluir lead', description: error.message, variant: 'destructive' });
      return false;
    }
  }, [toast]);

  return { leads, isLoading, createLead, updateLead, moveSdrStage, moveSalesStage, deleteLead, refetch: fetchLeads };
}

export function useLeadDetail(leadId: string | null) {
  const [history, setHistory] = useState<CrmLeadHistory[]>([]);
  const [interactions, setInteractions] = useState<CrmLeadInteraction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchDetail = useCallback(async () => {
    if (!leadId) { setHistory([]); setInteractions([]); return; }
    setIsLoading(true);
    try {
      const [histRes, intRes] = await Promise.all([
        supabase.from('crm_lead_history').select('*').eq('lead_id', leadId).order('created_at', { ascending: false }),
        supabase.from('crm_lead_interactions').select('*').eq('lead_id', leadId).order('created_at', { ascending: false }),
      ]);
      if (histRes.error) throw histRes.error;
      if (intRes.error) throw intRes.error;
      setHistory((histRes.data || []) as unknown as CrmLeadHistory[]);
      setInteractions((intRes.data || []) as unknown as CrmLeadInteraction[]);
    } catch (error) {
      console.error('Error fetching lead detail:', error);
    } finally {
      setIsLoading(false);
    }
  }, [leadId]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  const addInteraction = useCallback(async (tipo: string, descricao: string) => {
    if (!leadId) return false;
    try {
      const { error } = await supabase.from('crm_lead_interactions').insert({
        lead_id: leadId,
        tipo,
        descricao,
        created_by_user_id: profile?.id,
        created_by_name: profile?.full_name,
      } as any);
      if (error) throw error;
      // Update ultima_interacao_at
      await supabase.from('crm_leads').update({ ultima_interacao_at: new Date().toISOString() } as any).eq('id', leadId);
      setInteractions(prev => [{
        id: crypto.randomUUID(), lead_id: leadId, tipo, descricao,
        created_by_user_id: profile?.id || null,
        created_by_name: profile?.full_name || null,
        created_at: new Date().toISOString(),
      }, ...prev]);
      return true;
    } catch (error: any) {
      toast({ title: 'Erro ao registrar interação', description: error.message, variant: 'destructive' });
      return false;
    }
  }, [leadId, profile, toast]);

  return { history, interactions, isLoading, addInteraction, refetch: fetchDetail };
}
