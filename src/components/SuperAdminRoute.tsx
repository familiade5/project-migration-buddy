import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface SuperAdminRouteProps {
  children: React.ReactNode;
}

const SUPER_ADMIN_EMAIL = 'neto@vendadiretahoje.com.br';

export function SuperAdminRoute({ children }: SuperAdminRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
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

  // Only allow super admin access
  if (user.email !== SUPER_ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
