import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AutoPostQueueItem {
  id: string;
  scraped_property_id: string;
  property_data: any;
  photos: string[];
  generated_caption: string | null;
  status: string;
  rejection_reason: string | null;
  published_at: string | null;
  approved_by_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export function useAutoPostQueue(statusFilter: string = 'pending') {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['auto-post-queue', statusFilter],
    queryFn: async () => {
      // O servidor devolve no máximo 1000 linhas por vez: busca em páginas
      const PAGE = 1000;
      const all: AutoPostQueueItem[] = [];
      for (let from = 0; from < 20000; from += PAGE) {
        let q = supabase
          .from('auto_post_queue')
          .select('*')
          .order('created_at', { ascending: false })
          .order('id', { ascending: true })
          .range(from, from + PAGE - 1);
        if (statusFilter !== 'all') q = q.eq('status', statusFilter);
        const { data, error } = await q;
        if (error) throw error;
        all.push(...((data || []) as AutoPostQueueItem[]));
        if (!data || data.length < PAGE) break;
      }
      return all;
    },
  });

  const approve = useMutation({
    mutationFn: async ({ id, caption }: { id: string; caption: string }) => {
      const { error } = await supabase
        .from('auto_post_queue')
        .update({
          status: 'approved',
          generated_caption: caption,
          approved_by_user_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auto-post-queue'] }),
  });

  const reject = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const { error } = await supabase
        .from('auto_post_queue')
        .update({
          status: 'rejected',
          rejection_reason: reason || null,
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auto-post-queue'] }),
  });

  const markPublished = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('auto_post_queue')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auto-post-queue'] }),
  });

  return { ...query, approve, reject, markPublished };
}
