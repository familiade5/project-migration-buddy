import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import logoCC from '@/assets/logo-correspondente-caixa.png';
import logoVDH from '@/assets/logo-vdh.jpg';
import logoAM from '@/assets/logo-apartamentos-manaus.png';
import logoAF from '@/assets/logo-apartamentos-fortaleza.png';
import { LogOut, ArrowLeft } from 'lucide-react';

const BRAND = '#1a3a6b';

interface Props {
  children: ReactNode;
  right?: ReactNode;
}

export function CxShell({ children, right }: Props) {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  const shortcuts = [
    { to: '/', logo: logoVDH, label: 'Venda Direta Hoje' },
    { to: '/apartamentos-manaus', logo: logoAM, label: 'Apartamentos Manaus' },
    { to: '/apartamentos-fortaleza', logo: logoAF, label: 'Apartamentos Fortaleza' },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-[1800px] px-4 lg:px-6 h-16 flex items-center gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img src={logoCC} alt="Correspondente Caixa" className="h-10 w-10 object-contain" />
            <div className="min-w-0">
              <p className="text-[15px] font-bold leading-tight truncate" style={{ color: BRAND }}>
                Correspondente Caixa
              </p>
              <p className="text-[11px] text-slate-500 leading-tight truncate hidden sm:block">
                Análise de documentação e renda para o SICAQ
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {right}
            <div className="hidden md:flex items-center gap-1 pl-2 ml-1 border-l border-slate-200">
              {shortcuts.map((s) => (
                <Link
                  key={s.to}
                  to={s.to}
                  title={s.label}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <img src={s.logo} alt={s.label} className="h-7 w-7 object-contain rounded" />
                </Link>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-slate-900 md:hidden"
              onClick={() => navigate('/')}
              title="Voltar ao criador de post"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-red-600"
              onClick={() => signOut()}
              title={profile?.full_name || 'Sair'}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1800px] px-4 lg:px-6 py-5">{children}</main>
    </div>
  );
}
