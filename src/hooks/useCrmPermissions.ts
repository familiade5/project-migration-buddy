import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CrmEditPermission {
  id: string;
  property_id: string | null;
  user_id: string;
  granted_by_user_id: string;
  granted_at: string;
  user_name?: string;
}

export function useCrmPermissions() {
  const [permissions, setPermissions] = useState<CrmEditPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile, isAdmin } = useAuth();
  const { toast } = useToast();

  const fetchPermissions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('crm_edit_permissions')
        .select('*')
        .order('granted_at', { ascending: false });

      if (error) throw error;

      // Fetch user names
      const userIds = [...new Set((data || []).map(p => p.user_id))];
      let userMap: Record<string, string> = {};
      
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        if (profilesData) {
          userMap = profilesData.reduce((acc, p) => {
            acc[p.id] = p.full_name;
            return acc;
          }, {} as Record<string, string>);
        }
      }

      const permissionsWithNames = (data || []).map(p => ({
        ...p,
        user_name: userMap[p.user_id] || 'Usuário desconhecido',
      }));

      setPermissions(permissionsWithNames);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const canEditProperty = useCallback(
    (propertyId: string) => {
      if (isAdmin) return true;
      return permissions.some(
        p => p.property_id === propertyId && p.user_id === profile?.id
      ) || permissions.some(
        p => p.property_id === null && p.user_id === profile?.id
      );
    },
    [isAdmin, permissions, profile?.id]
  );

  const grantPermission = useCallback(
    async (userId: string, propertyId: string | null = null) => {
      if (!profile?.id) return false;

      try {
        const { error } = await supabase.from('crm_edit_permissions').insert({
          user_id: userId,
          property_id: propertyId,
          granted_by_user_id: profile.id,
        });

        if (error) throw error;

        toast({
          title: 'Permissão concedida',
          description: 'O usuário agora pode editar imóveis no CRM',
        });

        fetchPermissions();
        return true;
      } catch (error: any) {
        console.error('Error granting permission:', error);
        toast({
          title: 'Erro',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }
    },
    [profile?.id, toast, fetchPermissions]
  );

  const revokePermission = useCallback(
    async (permissionId: string) => {
      try {
        const { error } = await supabase
          .from('crm_edit_permissions')
          .delete()
          .eq('id', permissionId);

        if (error) throw error;

        toast({
          title: 'Permissão revogada',
          description: 'O usuário não pode mais editar imóveis',
        });

        fetchPermissions();
        return true;
      } catch (error: any) {
        console.error('Error revoking permission:', error);
        toast({
          title: 'Erro',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }
    },
    [toast, fetchPermissions]
  );

  return {
    permissions,
    isLoading,
    canEditProperty,
    grantPermission,
    revokePermission,
    refetch: fetchPermissions,
  };
}
