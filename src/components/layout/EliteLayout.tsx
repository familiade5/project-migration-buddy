import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home,
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
import logoPatrimoniar from '@/assets/logo-patrimoniar.svg';

interface EliteLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Criar Post', href: '/elite', icon: Home },
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
    <div className="min-h-screen bg-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Premium Dark Theme */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-4 px-6 py-6 border-b border-gray-100">
            <img 
              src={logoPatrimoniar} 
              alt="Patrimoniar" 
              className="h-12 w-auto"
            />
            <div className="min-w-0 flex-1 lg:hidden">
              <h1 className="font-display text-lg font-semibold text-[#2D2B4D]">
                Patrimoniar
              </h1>
            </div>
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-700 flex-shrink-0 transition-colors"
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
                      ? 'bg-[#2D2B4D]/10 text-[#2D2B4D] border border-[#2D2B4D]/20' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#BA9E72]' : ''}`} />
                  {item.name}
                </Link>
              );
            })}

            {isAdmin && (
              <>
                <div className="pt-6 pb-2">
                  <p className="px-4 text-xs font-medium text-gray-400 uppercase tracking-widest">
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
                          ? 'bg-[#2D2B4D]/10 text-[#2D2B4D] border border-[#2D2B4D]/20' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
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
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50">
              <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-[#BA9E72]/30">
                <AvatarFallback className="bg-gradient-to-br from-[#BA9E72] to-[#2D2B4D] text-white text-sm font-semibold">
                  {profile?.full_name ? getInitials(profile.full_name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile?.full_name || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {profile?.email}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white border-gray-200">
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900">
                      <Settings className="w-4 h-4" />
                      Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-600 focus:text-red-700 cursor-pointer"
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
        <header className="sticky top-0 z-30 lg:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <img 
                src={logoPatrimoniar} 
                alt="Patrimoniar" 
                className="h-9 w-auto"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors" aria-label="Menu">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white border-gray-200">
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <Settings className="w-4 h-4" />
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-100" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-700 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
