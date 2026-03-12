// AM Admin - minimal admin panel with AMLayout (user management)
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AMLayout } from '@/components/layout/AMLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, UserPlus, Loader2, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  isAdmin: boolean;
}

export default function AMAdmin() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ email: '', full_name: '', password: '', isAdmin: false });
  const [creating, setCreating] = useState(false);

  if (!isAdmin) return <Navigate to="/apartamentos-manaus" replace />;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from('profiles').select('id, email, full_name, created_at').order('created_at', { ascending: false }),
        supabase.from('user_roles').select('user_id, role'),
      ]);

      const adminIds = new Set(
        (rolesRes.data || []).filter((r) => r.role === 'admin').map((r) => r.user_id)
      );

      setUsers(
        (profilesRes.data || []).map((p) => ({ ...p, isAdmin: adminIds.has(p.id) }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          email: newUser.email,
          full_name: newUser.full_name,
          password: newUser.password,
          is_admin: newUser.isAdmin,
        },
      });
      if (error) { toast.error('Erro ao criar usuário'); return; }
      toast.success('Usuário criado com sucesso!');
      setCreateOpen(false);
      setNewUser({ email: '', full_name: '', password: '', isAdmin: false });
      fetchUsers();
    } finally {
      setCreating(false);
    }
  };

  return (
    <AMLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl text-white" style={{ backgroundColor: '#F47920' }}>
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Administração</h1>
              <p className="text-sm text-gray-500">Gerenciar usuários e acessos</p>
            </div>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="text-white gap-2" style={{ backgroundColor: '#1B5EA6' }}>
                <UserPlus className="w-4 h-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-gray-200">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Criar Usuário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-sm text-gray-700">Nome completo</Label>
                  <Input
                    className="border-gray-300 bg-white text-gray-900"
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-gray-700">Email</Label>
                  <Input
                    type="email"
                    className="border-gray-300 bg-white text-gray-900"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-gray-700">Senha temporária</Label>
                  <Input
                    type="password"
                    className="border-gray-300 bg-white text-gray-900"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    checked={newUser.isAdmin}
                    onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                  />
                  <Label htmlFor="isAdmin" className="text-sm text-gray-700">Perfil de administrador</Label>
                </div>
                <Button
                  onClick={handleCreate}
                  disabled={creating || !newUser.email || !newUser.full_name || !newUser.password}
                  className="w-full text-white"
                  style={{ backgroundColor: '#1B5EA6' }}
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar Usuário'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Users table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-gray-900">Usuários ({users.length})</span>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100">
                  <TableHead className="text-gray-600">Nome</TableHead>
                  <TableHead className="text-gray-600">Email</TableHead>
                  <TableHead className="text-gray-600">Perfil</TableHead>
                  <TableHead className="text-gray-600">Criado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} className="border-gray-100">
                    <TableCell className="font-medium text-gray-900">{u.full_name}</TableCell>
                    <TableCell className="text-gray-500">{u.email}</TableCell>
                    <TableCell>
                      <Badge
                        className="text-white text-xs"
                        style={{ backgroundColor: u.isAdmin ? '#F47920' : '#1B5EA6' }}
                      >
                        {u.isAdmin ? 'Admin' : 'Usuário'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {new Date(u.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AMLayout>
  );
}
