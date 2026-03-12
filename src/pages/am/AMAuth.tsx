import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Loader2, Eye, EyeOff, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { AMLogoSVG } from '@/components/apartamentos-manaus/AMLogo';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export default function AMAauth() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/apartamentos-manaus';

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const result = loginSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        return;
      }

      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        toast({
          title: 'Erro ao entrar',
          description: error.message === 'Invalid login credentials'
            ? 'Email ou senha incorretos'
            : error.message,
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Bem-vindo!', description: 'Login realizado com sucesso.' });
      }
    } catch {
      toast({ title: 'Erro', description: 'Ocorreu um erro inesperado.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5F7FA' }}>
      {/* Left branding panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #1B5EA6 0%, #0D3D73 100%)' }}
      >
        <div>
          <AMLogoSVG width={220} variant="white" />
        </div>

        <div className="space-y-6 text-white">
          <h2 className="text-4xl font-bold leading-tight">
            Gerador de Posts<br />
            <span style={{ color: '#F47920' }}>Profissionais</span>
          </h2>
          <p className="text-lg opacity-80">
            Crie criativos para Instagram, Stories e muito mais para os imóveis da Apartamentos Manaus.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl p-4 border border-white/20" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <div className="text-3xl font-bold" style={{ color: '#F47920' }}>Feed</div>
              <div className="text-sm opacity-70 mt-1">Carrossel completo</div>
            </div>
            <div className="rounded-2xl p-4 border border-white/20" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <div className="text-3xl font-bold" style={{ color: '#F47920' }}>Story</div>
              <div className="text-sm opacity-70 mt-1">Formato vertical 9:16</div>
            </div>
          </div>
        </div>

        <p className="text-sm opacity-50 text-white">
          © 2025 Apartamentos Manaus Imobiliária
        </p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <AMLogoSVG width={200} variant="color" />
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold" style={{ color: '#1B5EA6' }}>
              Bem-vindo de volta
            </h2>
            <p className="mt-2 text-gray-500">
              Entre com suas credenciais para acessar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 bg-white"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 bg-white"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-semibold text-white text-base"
              style={{ backgroundColor: '#1B5EA6' }}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400">
            Acesso restrito. Entre em contato com o administrador.
          </p>
        </div>
      </div>
    </div>
  );
}
