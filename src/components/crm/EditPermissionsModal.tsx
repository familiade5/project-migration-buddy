import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useCrmPermissions } from '@/hooks/useCrmPermissions';
import { Shield, UserPlus, Trash2, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Profile {
  id: string;
  full_name: string;
}

interface EditPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditPermissionsModal({ isOpen, onClose }: EditPermissionsModalProps) {
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { permissions, grantPermission, revokePermission } = useCrmPermissions();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name');
      if (data) setUsers(data);
    };
    fetchUsers();
  }, []);

  // Filter out users who already have global permissions
  const globalPermissionUserIds = permissions
    .filter(p => p.property_id === null)
    .map(p => p.user_id);
  
  const availableUsers = users.filter(
    u => !globalPermissionUserIds.includes(u.id)
  );

  const handleGrant = async () => {
    if (!selectedUser) return;
    setIsLoading(true);
    const success = await grantPermission(selectedUser, null);
    if (success) setSelectedUser('');
    setIsLoading(false);
  };

  const handleRevoke = async (permissionId: string) => {
    setIsLoading(true);
    await revokePermission(permissionId);
    setIsLoading(false);
  };

  // Only show global permissions (property_id === null)
  const globalPermissions = permissions.filter(p => p.property_id === null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border-gray-200 text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Permissões de Edição
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Add new permission */}
          <div className="space-y-3">
            <Label className="text-gray-600">Autorizar usuário a editar</Label>
            <div className="flex gap-2">
              <Select
                value={selectedUser}
                onValueChange={setSelectedUser}
              >
                <SelectTrigger className="flex-1 bg-white border-gray-200 text-gray-900">
                  <SelectValue placeholder="Selecione um usuário..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {availableUsers.map((user) => (
                    <SelectItem
                      key={user.id}
                      value={user.id}
                      className="text-gray-900 focus:bg-gray-100"
                    >
                      {user.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleGrant}
                disabled={!selectedUser || isLoading}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Usuários autorizados podem editar informações de qualquer imóvel no CRM
            </p>
          </div>

          {/* List of permissions */}
          <div className="space-y-3">
            <Label className="text-gray-600">Usuários autorizados</Label>
            {globalPermissions.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-100">
                <User className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Nenhum usuário com permissão extra
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Apenas administradores podem editar
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {globalPermissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-100"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {permission.user_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Desde {format(new Date(permission.granted_at), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRevoke(permission.id)}
                      disabled={isLoading}
                      className="border-gray-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
