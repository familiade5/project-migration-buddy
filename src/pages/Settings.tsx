import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  User, 
  AlertTriangle,
  Check
} from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

const passwordSchema = z.object({
  newPassword: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

const profileSchema = z.object({
  fullName: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
});

export default function Settings() {
  const { profile, updatePassword, refreshProfile } = useAuth();
  const { toast } = useToast();
  
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [profileData, setProfileData] = useState({
    fullName: profile?.full_name || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = passwordSchema.safeParse(passwordData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsUpdatingPassword(true);
    
    const { error } = await updatePassword(passwordData.newPassword);
    
    if (error) {
      toast({
        title: 'Erro ao atualizar senha',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Senha atualizada!',
        description: 'Sua senha foi alterada com sucesso.',
      });
      setPasswordData({ newPassword: '', confirmPassword: '' });
    }
    
    setIsUpdatingPassword(false);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = profileSchema.safeParse(profileData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsUpdatingProfile(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: profileData.fullName })
        .eq('id', profile?.id);
      
      if (error) throw error;
      
      await refreshProfile();
      
      toast({
        title: 'Perfil atualizado!',
        description: 'Suas informações foram salvas.',
      });
    } catch (error: unknown) {
      const err = error as Error;
      toast({
        title: 'Erro ao atualizar perfil',
        description: err.message,
        variant: 'destructive',
      });
    }
    
    setIsUpdatingProfile(false);
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-2xl space-y-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Gerencie sua conta e preferências</p>
        </div>

        {/* Temp password warning */}
        {profile?.temp_password && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-500">Altere sua senha temporária</p>
              <p className="text-sm text-yellow-500/80">
                Você está usando uma senha temporária. Por segurança, altere-a agora.
              </p>
            </div>
          </div>
        )}

        {/* Profile Section */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Perfil</h2>
              <p className="text-sm text-muted-foreground">Suas informações pessoais</p>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <Input
                id="fullName"
                type="text"
                className="input-premium"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                className="input-premium"
                value={profile?.email || ''}
                disabled
              />
              <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
            </div>

            <Button
              type="submit"
              className="bg-gold hover:bg-gold-dark text-primary-foreground"
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Salvar alterações
            </Button>
          </form>
        </div>

        {/* Password Section */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Senha</h2>
              <p className="text-sm text-muted-foreground">Altere sua senha de acesso</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-9 pr-10 input-premium"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-destructive">{errors.newPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-9 input-premium"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              className="bg-gold hover:bg-gold-dark text-primary-foreground"
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Lock className="w-4 h-4 mr-2" />
              )}
              Alterar senha
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
