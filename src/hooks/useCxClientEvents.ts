import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CxClientEvent {
  id: string;
  client_id: string;
  kind: string;
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
  actor_user_id: string | null;
  actor_name: string | null;
  created_at: string;
}

export interface CxEventInput {
  kind: string;
  title: string;
  description?: string | null;
  metadata?: Record<string, unknown>;
}

/** Registra um acontecimento no histórico do cliente. */
export async function logCxClientEvent(clientId: string, input: CxEventInput) {
  const { data: userData } = await supabase.auth.getUser();
  const actorName =
    (userData.user?.user_metadata?.full_name as string | undefined) || userData.user?.email || null;
  await supabase.from('cx_client_events').insert({
    client_id: clientId,
    kind: input.kind,
    title: input.title,
    description: input.description ?? null,
    metadata: (input.metadata ?? {}) as never,
    actor_user_id: userData.user?.id ?? null,
    actor_name: actorName,
  });
}

export function useCxClientEvents(clientId: string | null) {
  const [events, setEvents] = useState<CxClientEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    if (!clientId) {
      setEvents([]);
      return;
    }
    setIsLoading(true);
    const { data } = await supabase
      .from('cx_client_events')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    setEvents((data || []) as unknown as CxClientEvent[]);
    setIsLoading(false);
  }, [clientId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const addEvent = useCallback(
    async (input: CxEventInput) => {
      if (!clientId) return;
      await logCxClientEvent(clientId, input);
      await fetchEvents();
    },
    [clientId, fetchEvents],
  );

  return { events, isLoading, fetchEvents, addEvent };
}
