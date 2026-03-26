import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, LogOut, Menu, X, MoreVertical, Shield, Home, BookOpen } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AFLogoSVG } from '@/components/apartamentos-fortaleza/AFLogo';
import logoVDH from '@/assets/logo-vdh.jpg';

interface AFLayoutProps { children: React.ReactNode; }

const PRIMARY = '#0C7B8E';
const ACCENT = '#E8562A';

const navigation = [
  { name: 'Criar Post', href: '/apartamentos-fortaleza', icon: Home },
];

const adminNavigation = [
  { name: 'Admin', href: '/apartamentos-fortaleza/admin', icon: Shield },
];

export function AFLayout({ children }: AFLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => { await signOut(); navigate('/af/auth'); };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F7FA' }}>
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#E5E7EB' }}>
            <AFLogoSVG width={220} variant="color" />
            <button className="lg:hidden text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 py-3 border-b" style={{ borderColor: '#E5E7EB' }}>
            <Link to="/" onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl border transition-all hover:opacity-90"
              style={{ backgroundColor: '#F5F0E8', borderColor: '#E0CFA0' }}>
              <img src={logoVDH} alt="Venda Direta Hoje" className="h-6 w-auto object-contain rounded" />
              <span className="text-xs font-semibold truncate" style={{ color: '#1a3a6b' }}>Venda Direta Hoje</span>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map(item => (
              <Link key={item.name} to={item.href} onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={isActive(item.href) ? { backgroundColor: '#E5F5F7', color: PRIMARY, border: `1px solid #B8DEE4` } : { color: '#6B7280' }}>
                <item.icon className="w-5 h-5 flex-shrink-0" />{item.name}
              </Link>
            ))}
            {isAdmin && (
              <>
                <div className="pt-4 pb-2">
                  <p className="px-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Administração</p>
                </div>
                {adminNavigation.map(item => (
                  <Link key={item.name} to={item.href} onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    style={isActive(item.href) ? { backgroundColor: '#FFF0EB', color: ACCENT, border: `1px solid #F5C6B3` } : { color: '#6B7280' }}>
                    <item.icon className="w-5 h-5 flex-shrink-0" />{item.name}
                  </Link>
                ))}
              </>
            )}
          </nav>

          <div className="p-4 border-t" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ backgroundColor: '#F3F4F6' }}>
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarFallback style={{ backgroundColor: PRIMARY, color: '#FFFFFF' }} className="text-sm">
                  {profile?.full_name ? getInitials(profile.full_name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: '#111827' }}>{profile?.full_name || 'Usuário'}</p>
                <p className="text-xs truncate" style={{ color: '#9CA3AF' }}>{profile?.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors flex-shrink-0">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white border-gray-200">
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center gap-2 cursor-pointer text-gray-700">
                      <Settings className="w-4 h-4" />Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 lg:hidden border-b" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-500 hover:text-gray-700">
              <Menu className="w-6 h-6" />
            </button>
            <AFLogoSVG width={180} variant="color" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-gray-500 hover:text-gray-700"><MoreVertical className="w-5 h-5" /></button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white border-gray-200">
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
