import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AMLayout } from '@/components/layout/AMLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Shield, ShieldOff, UserPlus, Loader2, Trash2, Users, Activity,
  Clock, Search, MoreVertical, KeyRound, Lock, Copy, Check, BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AM_ORANGE = '#F47920';
const AM_BLUE = '#1B5EA6';
const MASTER_ADMINS = ['neto@vendadiretahoje.com.br', 'rosiene@vendadiretahoje.com.br'];

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  temp_password: boolean | null;
  created_at: string;
  isAdmin: boolean;
}

interface ActivityLog {
  id: string;
  user_id: string | null;
  user_email: string | null;
  user_name: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export default function AMAdmin() {
  const { user: currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Create user dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', full_name: '', password: '', isAdmin: false });
  const [creating, setCreating] = useState(false);
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // User actions
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetPassword, setResetPassword] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const isMasterAdmin = MASTER_ADMINS.includes(currentUser?.email ?? '');

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from('profiles').select('id, email, full_name, temp_password, created_at').order('created_at', { ascending: false }),
        supabase.from('user_roles').select('user_id, role'),
      ]);
      const adminIds = new Set((rolesRes.data || []).filter(r => r.role === 'admin').map(r => r.user_id));
      setUsers((profilesRes.data || []).map(p => ({ ...p, isAdmin: adminIds.has(p.id) })));
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchLogs = async () => {
    if (!currentUser) return;
    setLoadingLogs(true);
    try {
      let query = supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (!isMasterAdmin) {
        // Non-master admins only see non-admin activity
        const { data: adminRoles } = await supabase
          .from('user_roles').select('user_id').eq('role', 'admin');
        const adminIds = (adminRoles || []).map(r => r.user_id).filter(id => id !== currentUser.id);
        if (adminIds.length > 0) {
          query = query.not('user_id', 'in', `(${adminIds.join(',')})`);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      setLogs((data || []) as ActivityLog[]);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);
  useEffect(() => { if (currentUser) fetchLogs(); }, [currentUser]);

  // ── Create user ──────────────────────────────────────────
  const handleCreate = async () => {
    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          email: newUser.email,
          full_name: newUser.full_name,
          password: newUser.password || undefined,
          is_admin: newUser.isAdmin,
        },
      });
      if (error) { toast.error('Erro ao criar usuário'); return; }
      const tempPwd = data?.tempPassword || newUser.password;
      setCreatedPassword(tempPwd || null);
      toast.success('Usuário criado com sucesso!');
      fetchUsers();
    } finally {
      setCreating(false);
    }
  };

  const copyPassword = (pwd: string) => {
    navigator.clipboard.writeText(pwd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Delete user ──────────────────────────────────────────
  const handleDelete = async () => {
    if (!selectedUser) return;
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-user', {
        body: { action: 'delete', userId: selectedUser.id },
      });
      if (error || data?.error) { toast.error('Erro ao excluir usuário'); return; }
      toast.success(`${selectedUser.full_name} foi removido.`);
      fetchUsers();
    } finally {
      setProcessing(false);
      setDeleteOpen(false);
      setSelectedUser(null);
    }
  };

  // ── Reset password ────────────────────────────────────────
  const handleResetPassword = async () => {
    if (!selectedUser) return;
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-user', {
        body: { action: 'reset-password', userId: selectedUser.id },
      });
      if (error || data?.error) { toast.error('Erro ao resetar senha'); return; }
      setResetPassword(data.tempPassword);
      toast.success('Senha resetada com sucesso!');
      fetchUsers();
    } finally {
      setProcessing(false);
    }
  };

  // ── Toggle admin ──────────────────────────────────────────
  const handleToggleRole = async (u: UserProfile) => {
    const newRole = u.isAdmin ? 'user' : 'admin';
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-user', {
        body: { action: 'set-role', userId: u.id, role: newRole },
      });
      if (error || data?.error) { toast.error('Erro ao alterar permissão'); return; }
      toast.success(newRole === 'admin' ? `${u.full_name} agora é admin.` : `${u.full_name} agora é usuário.`);
      fetchUsers();
    } finally {
      setProcessing(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────
  const getActionLabel = (action: string) => ({
    login: 'Login',
    logout: 'Logout',
    create_creative: 'Criou post',
    delete_creative: 'Excluiu post',
    update_creative: 'Atualizou post',
    module_access: 'Acessou módulo',
    financing_simulation: 'Simulou financiamento',
  }[action] || action);

  const getActionColor = (action: string) => ({
    login: 'bg-green-100 text-green-700',
    logout: 'bg-gray-100 text-gray-600',
    create_creative: 'bg-blue-100 text-blue-700',
    delete_creative: 'bg-red-100 text-red-700',
    update_creative: 'bg-yellow-100 text-yellow-700',
    module_access: 'bg-purple-100 text-purple-700',
    financing_simulation: 'bg-cyan-100 text-cyan-700',
  }[action] || 'bg-gray-100 text-gray-600');

  const getModule = (log: ActivityLog) =>
    log.details && typeof log.details === 'object' && 'module' in log.details
      ? (log.details.module as string)
      : null;

  const filteredUsers = users.filter(u =>
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayLogins = logs.filter(l =>
    l.action === 'login' && new Date(l.created_at).toDateString() === new Date().toDateString()
  ).length;

  return (
    <AMLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl text-white" style={{ backgroundColor: AM_ORANGE }}>
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Administração</h1>
            <p className="text-sm text-gray-500">Gerenciar usuários e acompanhar atividades</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EBF2FF' }}>
              <Users className="w-5 h-5" style={{ color: AM_BLUE }} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{users.length}</p>
              <p className="text-xs text-gray-500">Usuários</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFF3E8' }}>
              <Shield className="w-5 h-5" style={{ color: AM_ORANGE }} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{users.filter(u => u.isAdmin).length}</p>
              <p className="text-xs text-gray-500">Admins</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-100">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{todayLogins}</p>
              <p className="text-xs text-gray-500">Logins hoje</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="users" className="data-[state=active]:text-white" style={{ ['--active-bg' as string]: AM_BLUE }}>
              <Users className="w-4 h-4 mr-1.5" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="logs">
              <Activity className="w-4 h-4 mr-1.5" />
              Atividades
            </TabsTrigger>
          </TabsList>

          {/* ── USERS TAB ─────────────────────────────────── */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar usuários..."
                  className="pl-9 border-gray-200"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <Dialog open={createOpen} onOpenChange={open => {
                setCreateOpen(open);
                if (!open) { setCreatedPassword(null); setNewUser({ email: '', full_name: '', password: '', isAdmin: false }); }
              }}>
                <DialogTrigger asChild>
                  <Button className="text-white gap-2" style={{ backgroundColor: AM_BLUE }}>
                    <UserPlus className="w-4 h-4" />
                    Novo Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white border-gray-200">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900">Criar Usuário</DialogTitle>
                  </DialogHeader>

                  {createdPassword ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                        <p className="text-sm text-green-700 mb-3">Usuário criado! Senha temporária:</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 font-mono text-sm break-all">
                            {createdPassword}
                          </code>
                          <Button size="sm" variant="outline" onClick={() => copyPassword(createdPassword)}>
                            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">⚠️ Copie agora! Não será exibida novamente.</p>
                      </div>
                      <Button className="w-full" onClick={() => { setCreateOpen(false); setCreatedPassword(null); }}>
                        Fechar
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label className="text-sm text-gray-700">Nome completo</Label>
                        <Input className="border-gray-300 bg-white text-gray-900" value={newUser.full_name}
                          onChange={e => setNewUser({ ...newUser, full_name: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-gray-700">Email</Label>
                        <Input type="email" className="border-gray-300 bg-white text-gray-900" value={newUser.email}
                          onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-gray-700">Senha temporária (opcional)</Label>
                        <Input type="password" className="border-gray-300 bg-white text-gray-900" value={newUser.password}
                          onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                          placeholder="Deixe em branco para gerar automaticamente" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="isAdmin" checked={newUser.isAdmin}
                          onChange={e => setNewUser({ ...newUser, isAdmin: e.target.checked })} />
                        <Label htmlFor="isAdmin" className="text-sm text-gray-700">Perfil de administrador</Label>
                      </div>
                      <Button onClick={handleCreate} disabled={creating || !newUser.email || !newUser.full_name}
                        className="w-full text-white" style={{ backgroundColor: AM_BLUE }}>
                        {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar Usuário'}
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            {loadingUsers ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-100">
                      <TableHead className="text-gray-600">Nome</TableHead>
                      <TableHead className="text-gray-600">Email</TableHead>
                      <TableHead className="text-gray-600">Perfil</TableHead>
                      <TableHead className="text-gray-600">Status</TableHead>
                      <TableHead className="text-gray-600">Cadastro</TableHead>
                      <TableHead className="text-gray-600 w-[60px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(u => (
                      <TableRow key={u.id} className="border-gray-100">
                        <TableCell className="font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            {u.full_name}
                            {currentUser?.id === u.id && (
                              <Badge variant="outline" className="text-xs text-gray-400 border-gray-300">Você</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500">{u.email}</TableCell>
                        <TableCell>
                          <Badge className="text-white text-xs"
                            style={{ backgroundColor: u.isAdmin ? AM_ORANGE : AM_BLUE }}>
                            {u.isAdmin ? 'Admin' : 'Usuário'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {u.temp_password ? (
                            <Badge variant="outline" className="border-yellow-400 text-yellow-600 text-xs">Senha temporária</Badge>
                          ) : (
                            <Badge variant="outline" className="border-green-400 text-green-600 text-xs">Ativo</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm">
                          {format(new Date(u.created_at), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border-gray-200">
                              <DropdownMenuItem className="cursor-pointer"
                                onClick={() => { setSelectedUser(u); setResetOpen(true); }}
                                disabled={currentUser?.id === u.id}>
                                <KeyRound className="w-4 h-4 mr-2" />
                                Resetar senha
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer"
                                onClick={() => handleToggleRole(u)}
                                disabled={currentUser?.id === u.id || processing}>
                                {u.isAdmin
                                  ? <><ShieldOff className="w-4 h-4 mr-2" />Remover admin</>
                                  : <><Shield className="w-4 h-4 mr-2" />Tornar admin</>}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600"
                                onClick={() => { setSelectedUser(u); setDeleteOpen(true); }}
                                disabled={currentUser?.id === u.id}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir usuário
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* ── LOGS TAB ──────────────────────────────────── */}
          <TabsContent value="logs" className="space-y-4">
            {loadingLogs ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : logs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <Activity className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Nenhuma atividade registrada</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-100">
                      <TableHead className="text-gray-600">Usuário</TableHead>
                      <TableHead className="text-gray-600">Ação</TableHead>
                      <TableHead className="text-gray-600">Módulo / Detalhe</TableHead>
                      <TableHead className="text-gray-600">Data/Hora</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map(log => {
                      const mod = getModule(log);
                      return (
                        <TableRow key={log.id} className="border-gray-100">
                          <TableCell>
                            <p className="font-medium text-gray-900">{log.user_name || 'Usuário'}</p>
                            <p className="text-xs text-gray-400">{log.user_email}</p>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${getActionColor(log.action)}`}>
                              {getActionLabel(log.action)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {mod ? (
                              <span className="text-sm text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">{mod}</span>
                            ) : log.details && typeof log.details === 'object' && 'title' in log.details ? (
                              <span className="text-sm text-gray-600">{log.details.title as string}</span>
                            ) : (
                              <span className="text-sm text-gray-400">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-gray-400 text-sm">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {format(new Date(log.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-white border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{selectedUser?.full_name}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={processing} className="bg-red-600 hover:bg-red-700">
              {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset password dialog */}
      <AlertDialog open={resetOpen} onOpenChange={open => { setResetOpen(open); if (!open) setResetPassword(null); }}>
        <AlertDialogContent className="bg-white border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle>{resetPassword ? 'Nova senha gerada' : 'Resetar senha'}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              {resetPassword ? (
                <div className="space-y-3">
                  <p>Nova senha temporária de <strong>{selectedUser?.full_name}</strong>:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm break-all text-gray-900">
                      {resetPassword}
                    </code>
                    <Button size="sm" variant="outline" onClick={() => copyPassword(resetPassword)}>
                      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">⚠️ Copie agora! Não será exibida novamente.</p>
                </div>
              ) : (
                <span>Gerar nova senha temporária para <strong>{selectedUser?.full_name}</strong>?</span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {resetPassword ? (
              <AlertDialogAction onClick={() => { setResetOpen(false); setSelectedUser(null); }}>Fechar</AlertDialogAction>
            ) : (
              <>
                <AlertDialogCancel disabled={processing}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetPassword} disabled={processing}
                  style={{ backgroundColor: AM_BLUE }}>
                  {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                  Resetar
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AMLayout>
  );
}
