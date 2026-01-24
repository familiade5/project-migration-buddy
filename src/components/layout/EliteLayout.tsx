import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Crown,
  Calendar, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Shield,
  Building2,
  MoreVertical,
  ArrowLeft
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import logoElite from '@/assets/logo-elite.png';

interface EliteLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Criar Post', href: '/elite', icon: Crown },
  { name: 'Biblioteca', href: '/library', icon: Calendar },
];

const adminNavigation = [
  { name: 'VDH - Venda Direta', href: '/', icon: Building2 },
  { name: 'Imobiliária', href: '/imobiliaria', icon: Building2 },
  { name: 'Admin', href: '/admin', icon: Shield },
];

export function EliteLayout({ children }: EliteLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Premium Dark Theme */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#0f0f14] to-[#0a0a0f] border-r border-amber-500/10 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-4 px-6 py-6 border-b border-amber-500/10">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-0.5">
              <div className="w-full h-full rounded-[10px] bg-[#0f0f14] flex items-center justify-center">
                <Crown className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-xl font-semibold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                Élite Imóveis
              </h1>
              <p className="text-xs text-amber-500/60">Alto Padrão</p>
            </div>
            <button 
              className="lg:hidden text-amber-500/60 hover:text-amber-400 flex-shrink-0 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white/90'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-amber-400' : ''}`} />
                  {item.name}
                </Link>
              );
            })}

            {isAdmin && (
              <>
                <div className="pt-6 pb-2">
                  <p className="px-4 text-xs font-medium text-amber-500/40 uppercase tracking-widest">
                    Outros Projetos
                  </p>
                </div>
                {adminNavigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200
                        ${isActive 
                          ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-400 border border-amber-500/30' 
                          : 'text-white/40 hover:bg-white/5 hover:text-white/70'
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {item.name}
                    </Link>
                  );
                })}
              </>
            )}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-amber-500/10">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
              <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-amber-500/30">
                <AvatarFallback className="bg-gradient-to-br from-amber-400 to-yellow-500 text-amber-950 text-sm font-semibold">
                  {profile?.full_name ? getInitials(profile.full_name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {profile?.full_name || 'Usuário'}
                </p>
                <p className="text-xs text-amber-500/60 truncate">
                  {profile?.email}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0">
                    <MoreVertical className="w-4 h-4 text-amber-500/60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-[#0f0f14] border-amber-500/20">
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white">
                      <Settings className="w-4 h-4" />
                      Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-amber-500/10" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-400 focus:text-red-300 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72 min-h-screen flex flex-col">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 lg:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-amber-500/10">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-amber-500/60 hover:text-amber-400 transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-0.5">
                <div className="w-full h-full rounded-[6px] bg-[#0a0a0f] flex items-center justify-center">
                  <Crown className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <span className="font-display font-semibold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                Élite Imóveis
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-amber-500/60 hover:text-amber-400 transition-colors" aria-label="Menu">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[#0f0f14] border-amber-500/20">
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2 cursor-pointer text-white/80">
                    <Settings className="w-4 h-4" />
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-amber-500/10" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-400 focus:text-red-300 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden bg-[#0a0a0f]">
          {children}
        </main>
      </div>
    </div>
  );
}
