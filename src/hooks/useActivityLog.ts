import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Json } from '@/integrations/supabase/types';

export function useActivityLog() {
  const { user, profile } = useAuth();

  const logActivity = async (
    action: string,
    resourceType?: string,
    resourceId?: string,
    details?: Record<string, unknown>
  ) => {
    if (!user) return;

    try {
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        user_email: profile?.email || user.email || null,
        user_name: profile?.full_name || 'Usuário',
        action,
        resource_type: resourceType || null,
        resource_id: resourceId || null,
        details: (details as Json) || null,
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  return { logActivity };
}
