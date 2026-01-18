import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Activity, 
  UserPlus, 
  Loader2, 
  Search,
  Trash2,
  Shield,
  ShieldOff,
  Clock,
  Mail,
  Lock,
  User,
  Copy,
  Check,
  BarChart3,
  MoreVertical,
  KeyRound,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  temp_password: boolean | null;
  created_at: string;
}

interface UserWithRole extends Profile {
  role: 'admin' | 'user';
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

const newUserSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
});

// Password is now generated server-side and returned in response

export default function Admin() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState<string | null>(null);
  const [newUserData, setNewUserData] = useState({ fullName: '', email: '' });
  const [userCreated, setUserCreated] = useState(false);
  const [createdUserPassword, setCreatedUserPassword] = useState<string | null>(null);
  const [resetPasswordValue, setResetPasswordValue] = useState<string | null>(null);
  
  // User action states
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchLogs();
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (rolesError) throw rolesError;

      const usersWithRoles = (profiles || []).map(profile => {
        const userRole = roles?.find(r => r.user_id === profile.id);
        return {
          ...profile,
          role: (userRole?.role || 'user') as 'admin' | 'user',
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const currentUserEmail = currentUser?.email;
      const isSuperAdmin = currentUserEmail === 'neto@vendadiretahoje.com.br';
      
      // Get admin user IDs to filter their activities for non-super admins
      const { data: adminRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');
      
      const adminUserIds = (adminRoles || []).map(r => r.user_id);
      
      let query = supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (isSuperAdmin) {
        // Super admin (neto) sees ALL activities including other admins
        // No filters needed
      } else {
        // Regular admins: filter out activities from admin users (except their own)
        // Also filter out neto's activities
        query = query.neq('user_email', 'neto@vendadiretahoje.com.br');
        
        // Filter out other admin activities
        const otherAdminIds = adminUserIds.filter(id => id !== currentUser?.id);
        if (otherAdminIds.length > 0) {
          query = query.not('user_id', 'in', `(${otherAdminIds.join(',')})`);
        }
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setLogs((data || []) as ActivityLog[]);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const createUser = async () => {
    const result = newUserSchema.safeParse(newUserData);
    if (!result.success) {
      toast({
        title: 'Erro de validação',
        description: result.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setIsAddingUser(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          email: newUserData.email,
          fullName: newUserData.fullName,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Store the server-generated password for one-time display
      setCreatedUserPassword(data.tempPassword);
      setUserCreated(true);
      toast({
        title: 'Usuário criado!',
        description: 'O funcionário pode fazer login com a senha temporária.',
      });

      setTimeout(() => {
        fetchUsers();
      }, 1000);

    } catch (error: unknown) {
      const err = error as Error;
      toast({
        title: 'Erro ao criar usuário',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsAddingUser(false);
    }
  };

  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    setCopiedPassword(password);
    setTimeout(() => setCopiedPassword(null), 2000);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-user', {
        body: { action: 'delete', userId: selectedUser.id },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast({
        title: 'Usuário excluído',
        description: `${selectedUser.full_name} foi removido do sistema.`,
      });

      fetchUsers();
    } catch (error: unknown) {
      const err = error as Error;
      toast({
        title: 'Erro ao excluir usuário',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;
    
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-user', {
        body: { action: 'reset-password', userId: selectedUser.id },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Store the new password for display
      setResetPasswordValue(data.tempPassword);
      toast({
        title: 'Senha resetada',
        description: `A nova senha temporária de ${selectedUser.full_name} foi gerada.`,
      });

      fetchUsers();
    } catch (error: unknown) {
      const err = error as Error;
      toast({
        title: 'Erro ao resetar senha',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setPasswordDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleToggleRole = async (user: UserWithRole) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-user', {
        body: { action: 'set-role', userId: user.id, role: newRole },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast({
        title: 'Permissão atualizada',
        description: newRole === 'admin' 
          ? `${user.full_name} agora é administrador.`
          : `${user.full_name} agora é usuário comum.`,
      });

      fetchUsers();
    } catch (error: unknown) {
      const err = error as Error;
      toast({
        title: 'Erro ao alterar permissão',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalUsers: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    todayLogins: logs.filter(l => 
      l.action === 'login' && 
      new Date(l.created_at).toDateString() === new Date().toDateString()
    ).length,
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      login: 'Login',
      logout: 'Logout',
      create_creative: 'Criou post',
      delete_creative: 'Excluiu post',
      update_creative: 'Atualizou post',
    };
    return labels[action] || action;
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      login: 'bg-green-500/20 text-green-400',
      logout: 'bg-gray-500/20 text-gray-400',
      create_creative: 'bg-blue-500/20 text-blue-400',
      delete_creative: 'bg-red-500/20 text-red-400',
      update_creative: 'bg-yellow-500/20 text-yellow-400',
    };
    return colors[action] || 'bg-gray-500/20 text-gray-400';
  };

  const isCurrentUser = (userId: string) => currentUser?.id === userId;

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">Painel Admin</h1>
            <p className="text-muted-foreground">
              Gerencie usuários e acompanhe atividades
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{stats.totalUsers}</p>
                <p className="text-sm text-muted-foreground">Usuários</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{stats.admins}</p>
                <p className="text-sm text-muted-foreground">Admins</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{stats.todayLogins}</p>
                <p className="text-sm text-muted-foreground">Logins hoje</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-surface">
            <TabsTrigger value="users" className="data-[state=active]:bg-gold data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-gold data-[state=active]:text-primary-foreground">
              <Activity className="w-4 h-4 mr-2" />
              Atividades
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuários..."
                  className="pl-9 input-premium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gold hover:bg-gold-dark text-primary-foreground">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Novo Funcionário
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="font-display text-xl">
                      Cadastrar Funcionário
                    </DialogTitle>
                    <DialogDescription>
                      Crie uma conta para um novo funcionário
                    </DialogDescription>
                  </DialogHeader>
                  
                  {userCreated && createdUserPassword ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <p className="text-sm text-green-400 mb-3">
                          Usuário criado com sucesso! A senha temporária é:
                        </p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-3 py-2 bg-surface rounded-lg text-foreground font-mono text-sm break-all">
                            {createdUserPassword}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyPassword(createdUserPassword)}
                          >
                            {copiedPassword === createdUserPassword ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          ⚠️ Copie esta senha agora! Ela não será exibida novamente.
                        </p>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => {
                          setUserCreated(false);
                          setCreatedUserPassword(null);
                          setNewUserData({ fullName: '', email: '' });
                          setAddDialogOpen(false);
                        }}
                      >
                        Fechar
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="newFullName">Nome completo</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="newFullName"
                            placeholder="Nome do funcionário"
                            className="pl-9 input-premium"
                            value={newUserData.fullName}
                            onChange={(e) => setNewUserData({ ...newUserData, fullName: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newEmail">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="newEmail"
                            type="email"
                            placeholder="email@empresa.com"
                            className="pl-9 input-premium"
                            value={newUserData.email}
                            onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="p-3 bg-surface/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          Uma senha temporária segura será gerada automaticamente.
                          O funcionário poderá alterar a senha após o primeiro login.
                        </p>
                      </div>
                      <Button
                        className="w-full bg-gold hover:bg-gold-dark text-primary-foreground"
                        onClick={createUser}
                        disabled={isAddingUser}
                      >
                        {isAddingUser ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <UserPlus className="w-4 h-4 mr-2" />
                        )}
                        Criar Usuário
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            {isLoadingUsers ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
              </div>
            ) : (
              <div className="glass-card rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Nome</TableHead>
                      <TableHead className="text-muted-foreground">Email</TableHead>
                      <TableHead className="text-muted-foreground">Função</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Cadastro</TableHead>
                      <TableHead className="text-muted-foreground w-[60px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-border">
                        <TableCell className="font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            {user.full_name}
                            {isCurrentUser(user.id) && (
                              <Badge variant="outline" className="text-xs border-muted-foreground text-muted-foreground">
                                Você
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={user.role === 'admin' 
                              ? 'border-gold text-gold' 
                              : 'border-muted-foreground text-muted-foreground'
                            }
                          >
                            {user.role === 'admin' ? 'Admin' : 'Usuário'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.temp_password ? (
                            <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                              Senha temporária
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-green-500 text-green-500">
                              Ativo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(user.created_at), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-card border-border">
                              {/* Since passwords are now randomly generated, users with temp_password need to reset */}
                              {user.temp_password && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setPasswordDialogOpen(true);
                                  }}
                                  className="cursor-pointer text-yellow-500"
                                >
                                  <Lock className="w-4 h-4 mr-2" />
                                  Gerar nova senha
                                </DropdownMenuItem>
                              )}
                              
                              {/* Reset password */}
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setPasswordDialogOpen(true);
                                }}
                                className="cursor-pointer"
                                disabled={isCurrentUser(user.id)}
                              >
                                <KeyRound className="w-4 h-4 mr-2" />
                                Resetar senha
                              </DropdownMenuItem>

                              {/* Toggle role */}
                              <DropdownMenuItem
                                onClick={() => handleToggleRole(user)}
                                className="cursor-pointer"
                                disabled={isCurrentUser(user.id) || isProcessing}
                              >
                                {user.role === 'admin' ? (
                                  <>
                                    <ShieldOff className="w-4 h-4 mr-2" />
                                    Remover admin
                                  </>
                                ) : (
                                  <>
                                    <Shield className="w-4 h-4 mr-2" />
                                    Tornar admin
                                  </>
                                )}
                              </DropdownMenuItem>

                              <DropdownMenuSeparator className="bg-border" />

                              {/* Delete user */}
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setDeleteDialogOpen(true);
                                }}
                                className="cursor-pointer text-destructive focus:text-destructive"
                                disabled={isCurrentUser(user.id)}
                              >
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

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            {isLoadingLogs ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
              </div>
            ) : logs.length === 0 ? (
              <div className="glass-card rounded-xl p-12 text-center">
                <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nenhuma atividade registrada
                </h3>
                <p className="text-muted-foreground">
                  As atividades dos usuários aparecerão aqui
                </p>
              </div>
            ) : (
              <div className="glass-card rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Usuário</TableHead>
                      <TableHead className="text-muted-foreground">Ação</TableHead>
                      <TableHead className="text-muted-foreground">Data/Hora</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id} className="border-border">
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{log.user_name || 'Usuário'}</p>
                            <p className="text-sm text-muted-foreground">{log.user_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getActionColor(log.action)}>
                            {getActionLabel(log.action)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {format(new Date(log.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{selectedUser?.full_name}</strong>? 
              Esta ação não pode ser desfeita e todos os dados do usuário serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isProcessing}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Dialog */}
      <AlertDialog open={passwordDialogOpen} onOpenChange={(open) => {
        setPasswordDialogOpen(open);
        if (!open) setResetPasswordValue(null);
      }}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {resetPasswordValue ? 'Nova senha gerada' : 'Resetar senha'}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              {resetPasswordValue ? (
                <div className="space-y-3">
                  <p>A nova senha temporária de <strong>{selectedUser?.full_name}</strong> é:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-surface rounded-lg text-foreground font-mono text-sm break-all">
                      {resetPasswordValue}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyPassword(resetPasswordValue)}
                    >
                      {copiedPassword === resetPasswordValue ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-yellow-500">
                    ⚠️ Copie esta senha agora! Ela não será exibida novamente.
                  </p>
                </div>
              ) : (
                <p>
                  Uma nova senha temporária segura será gerada para <strong>{selectedUser?.full_name}</strong>.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {resetPasswordValue ? (
              <AlertDialogAction
                onClick={() => {
                  setPasswordDialogOpen(false);
                  setResetPasswordValue(null);
                  setSelectedUser(null);
                }}
                className="bg-gold hover:bg-gold-dark"
              >
                Fechar
              </AlertDialogAction>
            ) : (
              <>
                <AlertDialogCancel disabled={isProcessing}>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetPassword}
                  disabled={isProcessing}
                  className="bg-gold hover:bg-gold-dark"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <KeyRound className="w-4 h-4 mr-2" />
                  )}
                  Gerar nova senha
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
