import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type CxChecklistItem = {
  id: string; deal_id: string; category: string; item_name: string; status: string;
  document_id: string | null; notes: string | null; due_at: string | null;
};

export type CxTask = {
  id: string; deal_id: string; client_id: string | null; title: string; description: string | null;
  kind: string; priority: string; status: string; responsible_name: string | null; due_at: string | null;
};

export type CxOperationalRecord = Record<string, unknown> & { id?: string; deal_id: string };

const TABLE_BY_STAGE = {
  engenharia: 'cx_engineering_inspections',
  pendencia_engenharia: 'cx_engineering_inspections',
  contrato: 'cx_contracts',
  itbi_registro: 'cx_registry_records',
  entrega_chaves: 'cx_key_handovers',
} as const;

export function useCxOperations(dealId: string) {
  const [checklist, setChecklist] = useState<CxChecklistItem[]>([]);
  const [tasks, setTasks] = useState<CxTask[]>([]);
  const [records, setRecords] = useState<Record<string, CxOperationalRecord | null>>({});
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    const [check, task, engineering, contract, registry, handover] = await Promise.all([
      supabase.from('cx_process_checklist').select('*').eq('deal_id', dealId).order('created_at'),
      supabase.from('cx_tasks').select('*').eq('deal_id', dealId).neq('status', 'cancelada').order('due_at'),
      supabase.from('cx_engineering_inspections').select('*').eq('deal_id', dealId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('cx_contracts').select('*').eq('deal_id', dealId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('cx_registry_records').select('*').eq('deal_id', dealId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('cx_key_handovers').select('*').eq('deal_id', dealId).maybeSingle(),
    ]);
    setChecklist((check.data || []) as unknown as CxChecklistItem[]);
    setTasks((task.data || []) as unknown as CxTask[]);
    setRecords({
      engenharia: engineering.data as unknown as CxOperationalRecord | null,
      contrato: contract.data as unknown as CxOperationalRecord | null,
      itbi_registro: registry.data as unknown as CxOperationalRecord | null,
      entrega_chaves: handover.data as unknown as CxOperationalRecord | null,
    });
    setLoading(false);
  }, [dealId]);

  useEffect(() => { refetch(); }, [refetch]);

  const seedChecklist = useCallback(async () => {
    if (checklist.length) return;
    const defaults = [
      ['cliente', 'Documentos pessoais e estado civil'],
      ['cliente', 'Comprovantes de renda atualizados'],
      ['imovel', 'Matrícula atualizada'],
      ['imovel', 'Certidões e situação fiscal'],
      ['vendedor', 'Documentação dos vendedores'],
    ];
    const { error } = await supabase.from('cx_process_checklist').insert(defaults.map(([category, item_name]) => ({ deal_id: dealId, category, item_name })) as never);
    if (error) toast.error('Erro ao preparar checklist', { description: error.message });
    else await refetch();
  }, [checklist.length, dealId, refetch]);

  const updateChecklist = useCallback(async (id: string, patch: Partial<CxChecklistItem>) => {
    const { error } = await supabase.from('cx_process_checklist').update(patch as never).eq('id', id);
    if (error) { toast.error('Erro ao atualizar documento', { description: error.message }); return false; }
    setChecklist((prev) => prev.map((item) => item.id === id ? { ...item, ...patch } : item));
    return true;
  }, []);

  const addChecklist = useCallback(async (itemName: string, category: string) => {
    const { error } = await supabase.from('cx_process_checklist').insert({ deal_id: dealId, item_name: itemName, category } as never);
    if (error) toast.error('Erro ao adicionar item', { description: error.message });
    else await refetch();
  }, [dealId, refetch]);

  const saveRecord = useCallback(async (stage: keyof typeof TABLE_BY_STAGE, patch: Record<string, unknown>) => {
    const canonical = stage === 'pendencia_engenharia' ? 'engenharia' : stage;
    const table = TABLE_BY_STAGE[stage];
    const current = records[canonical];
    const query = current?.id
      ? supabase.from(table).update(patch as never).eq('id', current.id)
      : supabase.from(table).insert({ ...patch, deal_id: dealId } as never);
    const { error } = await query;
    if (error) { toast.error('Erro ao salvar etapa', { description: error.message }); return false; }
    toast.success('Etapa salva');
    await refetch();
    return true;
  }, [dealId, records, refetch]);

  const addTask = useCallback(async (input: Pick<CxTask, 'title' | 'kind' | 'priority' | 'due_at'> & { client_id: string }) => {
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase.from('cx_tasks').insert({ ...input, deal_id: dealId, created_by_user_id: auth.user?.id ?? null } as never);
    if (error) toast.error('Erro ao criar pendência', { description: error.message });
    else await refetch();
  }, [dealId, refetch]);

  const completeTask = useCallback(async (id: string, done: boolean) => {
    const patch = { status: done ? 'concluida' : 'aberta', completed_at: done ? new Date().toISOString() : null };
    const { error } = await supabase.from('cx_tasks').update(patch as never).eq('id', id);
    if (error) toast.error('Erro ao atualizar pendência', { description: error.message });
    else await refetch();
  }, [refetch]);

  return { checklist, tasks, records, loading, seedChecklist, updateChecklist, addChecklist, saveRecord, addTask, completeTask };
}