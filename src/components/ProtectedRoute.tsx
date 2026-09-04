import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Clock, XCircle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isAdmin, isInternal, isLoading, rolesLoaded, rolesError, profile, signOut, refreshProfile } = useAuth();
  const location = useLocation();

  if (isLoading || (user && !rolesLoaded)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Contas de cliente do portal não acessam o sistema interno
  if (user.user_metadata?.portal_client === true) {
    return <Navigate to="/portal" replace />;
  }

  // Falha ao verificar as permissões: nunca rebaixar o usuário para o portal
  if (rolesError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="glass-card max-w-md w-full rounded-2xl p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gold/15 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7 text-gold" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Não foi possível verificar seu acesso
          </h1>
          <p className="text-muted-foreground">
            Houve uma falha de conexão ao confirmar suas permissões. Tente novamente.
          </p>
          <Button onClick={() => refreshProfile()} className="w-full">
            Tentar novamente
          </Button>
          <Button variant="outline" onClick={() => signOut()} className="w-full">
            Sair
          </Button>
        </div>
      </div>
    );
  }


  const status = profile?.approval_status;
  if (status === 'pending' || status === 'rejected') {
    const rejected = status === 'rejected';
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="glass-card max-w-md w-full rounded-2xl p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gold/15 flex items-center justify-center mx-auto">
            {rejected ? (
              <XCircle className="w-7 h-7 text-destructive" />
            ) : (
              <Clock className="w-7 h-7 text-gold" />
            )}
          </div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            {rejected ? 'Acesso recusado' : 'Cadastro em análise'}
          </h1>
          <p className="text-muted-foreground">
            {rejected
              ? 'Seu pedido de acesso foi recusado. Entre em contato com o administrador para mais informações.'
              : 'Sua conta foi criada e está aguardando a aprovação de um administrador. Você receberá acesso assim que for aprovado.'}
          </p>
          <Button variant="outline" onClick={() => signOut()} className="w-full">
            Sair
          </Button>
        </div>
      </div>
    );
  }

  // Sem papel interno no banco: mostra explicação em vez de jogar no portal do cliente
  if (!isInternal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="glass-card max-w-md w-full rounded-2xl p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gold/15 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7 text-gold" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Sem permissão para o criador de post
          </h1>
          <p className="text-muted-foreground">
            Sua conta está ativa, mas ainda não tem acesso liberado ao sistema interno. Peça a um
            administrador para liberar seu acesso.
          </p>
          <Button variant="outline" onClick={() => signOut()} className="w-full">
            Sair
          </Button>
        </div>
      </div>
    );
  }


  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
