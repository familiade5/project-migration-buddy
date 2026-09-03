import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Landmark, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const BRAND = '#1a3a6b';

export default function PortalAuth() {
  const navigate = useNavigate();
  const { token } = useParams<{ token?: string }>();
  const hasInvite = Boolean(token);
  const [mode, setMode] = useState<'login' | 'signup'>(hasInvite ? 'signup' : 'login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      // Só entra direto se for uma conta de cliente do portal.
      // Sessões da equipe (sem o flag portal_client) veem a tela de login/cadastro.
      if (session?.user?.user_metadata?.portal_client === true) {
        if (token) {
          supabase.rpc('cx_claim_invite', { _token: token }).then(() => {
            navigate('/portal', { replace: true });
          });
        } else {
          navigate('/portal', { replace: true });
        }
      }
    });
  }, [navigate, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || password.length < 6) {
      toast.error('Informe um e-mail válido e uma senha com pelo menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signup') {
        if (!fullName.trim()) {
          toast.error('Informe seu nome completo');
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: fullName.trim(), portal_client: true },
          },
        });
        if (error) throw error;
        if (!data.session) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
          if (signInError) throw signInError;
        }
        if (token) {
          const { error: claimError } = await supabase.rpc('cx_claim_invite', { _token: token });
          if (claimError) throw claimError;
        }
        navigate('/portal', { replace: true });

      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        if (token) {
          const { error: claimError } = await supabase.rpc('cx_claim_invite', { _token: token });
          if (claimError) throw claimError;
        }
        navigate('/portal', { replace: true });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao autenticar';
      toast.error(
        message.includes('Invalid login')
          ? 'E-mail ou senha incorretos'
          : message.includes('already registered')
            ? 'Este e-mail já possui conta. Faça login.'
            : message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3" style={{ backgroundColor: BRAND }}>
            <Landmark className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Portal do Cliente</h1>
          <p className="text-sm text-slate-500 mt-1">
            {hasInvite
              ? 'Crie seu acesso exclusivo e envie sua documentação com segurança'
              : 'Entre ou crie sua conta para enviar sua documentação com segurança'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4"
        >
          <div className="flex bg-slate-100 rounded-lg p-1">
            {(hasInvite ? (['signup', 'login'] as const) : (['login', 'signup'] as const)).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 text-sm font-semibold py-2 rounded-md transition-colors ${
                  mode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                {m === 'signup' ? 'Criar conta' : 'Entrar'}
              </button>
            ))}
          </div>


          {mode === 'signup' && (
            <div>
              <Label className="text-xs font-semibold text-slate-600">Nome completo</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome completo"
                className="mt-1 bg-white border-slate-200 text-slate-900"
              />
            </div>
          )}

          <div>
            <Label className="text-xs font-semibold text-slate-600">E-mail</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="mt-1 bg-white border-slate-200 text-slate-900"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-slate-600">Senha</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="mt-1 bg-white border-slate-200 text-slate-900"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full text-white hover:opacity-90"
            style={{ backgroundColor: BRAND }}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {mode === 'signup' ? 'Criar minha conta' : 'Entrar no portal'}
          </Button>

          <p className="text-[11px] text-slate-400 flex items-start gap-1.5 leading-relaxed">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-500" />
            Seus documentos ficam armazenados de forma privada e são acessados apenas pela equipe
            responsável pela sua análise de crédito.
          </p>
        </form>
      </div>
    </div>
  );
}
