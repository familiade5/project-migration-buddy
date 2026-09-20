import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CxStage, cxStageKeyFromLabel } from '@/types/cxCrm';

export function useCxStages() {
  const [stages, setStages] = useState<CxStage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStages = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('cx_pipeline_stages')
      .select('*')
      .eq('is_active', true)
      .order('position', { ascending: true });
    if (error) {
      toast.error('Erro ao carregar as etapas do funil', { description: error.message });
    } else {
      setStages((data || []) as unknown as CxStage[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchStages();
  }, [fetchStages]);

  const createStage = useCallback(
    async (input: { label: string; color: string; bg: string; border: string }) => {
      const label = input.label.trim();
      if (!label) return null;
      let key = cxStageKeyFromLabel(label);
      if (!key) key = `etapa_${Date.now()}`;
      if (stages.some((s) => s.key === key)) key = `${key}_${Date.now().toString().slice(-4)}`;
      const position = (stages.length ? Math.max(...stages.map((s) => s.position)) : 0) + 10;
      const { data, error } = await supabase
        .from('cx_pipeline_stages')
        .insert({ key, label, color: input.color, bg: input.bg, border: input.border, position } as never)
        .select()
        .single();
      if (error) {
        toast.error('Erro ao criar a etapa', { description: error.message });
        return null;
      }
      toast.success('Etapa criada');
      await fetchStages();
      return data as unknown as CxStage;
    },
    [stages, fetchStages],
  );

  const updateStage = useCallback(
    async (id: string, patch: Partial<CxStage>) => {
      const { error } = await supabase.from('cx_pipeline_stages').update(patch as never).eq('id', id);
      if (error) {
        toast.error('Erro ao salvar a etapa', { description: error.message });
        return false;
      }
      setStages((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...patch } : s)).sort((a, b) => a.position - b.position),
      );
      return true;
    },
    [],
  );

  const deleteStage = useCallback(async (stage: CxStage) => {
    if (stage.is_system) {
      toast.error('Esta etapa é fixa do sistema e não pode ser removida');
      return false;
    }
    const { count } = await supabase
      .from('cx_deals')
      .select('id', { count: 'exact', head: true })
      .eq('stage', stage.key as never);
    if ((count || 0) > 0) {
      toast.error('Mova os casos desta etapa antes de excluí-la', {
        description: `${count} caso(s) ainda estão em "${stage.label}".`,
      });
      return false;
    }
    const { error } = await supabase.from('cx_pipeline_stages').delete().eq('id', stage.id);
    if (error) {
      toast.error('Erro ao excluir a etapa', { description: error.message });
      return false;
    }
    toast.success('Etapa excluída');
    setStages((prev) => prev.filter((s) => s.id !== stage.id));
    return true;
  }, []);

  const moveStage = useCallback(
    async (id: string, direction: -1 | 1) => {
      const ordered = [...stages].sort((a, b) => a.position - b.position);
      const index = ordered.findIndex((s) => s.id === id);
      const target = ordered[index + direction];
      if (index < 0 || !target) return;
      const current = ordered[index];
      await Promise.all([
        supabase.from('cx_pipeline_stages').update({ position: target.position } as never).eq('id', current.id),
        supabase.from('cx_pipeline_stages').update({ position: current.position } as never).eq('id', target.id),
      ]);
      await fetchStages();
    },
    [stages, fetchStages],
  );

  return { stages, isLoading, fetchStages, createStage, updateStage, deleteStage, moveStage };
}
