import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { CxDeal } from '@/types/cxCrm';

const FIELD = 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400';
type Person = { id: string; full_name: string; role: string; cpf: string | null; monthly_income: number | null };

export function CxStakeholders({ deal }: { deal: CxDeal }) {
  const [people, setPeople] = useState<Person[]>([]);
  const [form, setForm] = useState({ full_name: '', role: 'coproponente', cpf: '', monthly_income: '' });

  const load = useCallback(async () => {
    const { data } = await supabase.from('cx_process_participants').select('id,full_name,role,cpf,monthly_income').eq('deal_id', deal.id).order('created_at');
    setPeople((data || []) as unknown as Person[]);
  }, [deal.id]);
  useEffect(() => { load(); }, [load]);

  const add = async () => {
    const { data: auth } = await supabase.auth.getUser();
    const income = Number(form.monthly_income.replace(/\./g, '').replace(',', '.'));
    const { error } = await supabase.from('cx_process_participants').insert({
      deal_id: deal.id, full_name: form.full_name.trim(), role: form.role, cpf: form.cpf || null,
      monthly_income: Number.isFinite(income) && income > 0 ? income : null, created_by_user_id: auth.user?.id ?? null,
    } as never);
    if (error) toast.error('Erro ao adicionar participante', { description: error.message });
    else { setForm({ full_name: '', role: 'coproponente', cpf: '', monthly_income: '' }); await load(); }
  };

  const roleLabel: Record<string,string> = { principal: 'Proponente principal', conjuge: 'Cônjuge', coproponente: 'Coproponente', grupo_familiar: 'Grupo familiar', outro: 'Outro' };
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
      <div><h4 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Users className="w-4 h-4 text-blue-700" />Participantes do processo</h4><p className="text-xs text-slate-500">Cadastre quem compõe renda ou participa da compra.</p></div>
      {people.length > 0 && <div className="grid sm:grid-cols-2 gap-2">{people.map((p) => <div key={p.id} className="rounded-md border border-slate-200 p-2"><p className="text-sm font-semibold text-slate-800">{p.full_name}</p><p className="text-xs text-slate-500">{roleLabel[p.role] || p.role}{p.monthly_income ? ` · ${p.monthly_income.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}` : ''}</p></div>)}</div>}
      <div className="grid sm:grid-cols-4 gap-2">
        <div><Label className="text-xs text-slate-600">Nome</Label><Input className={FIELD} value={form.full_name} onChange={(e) => setForm((p) => ({...p, full_name:e.target.value}))} /></div>
        <div><Label className="text-xs text-slate-600">Papel</Label><Select value={form.role} onValueChange={(role) => setForm((p) => ({...p, role}))}><SelectTrigger className={FIELD}><SelectValue /></SelectTrigger><SelectContent className="bg-white"><SelectItem value="conjuge">Cônjuge</SelectItem><SelectItem value="coproponente">Coproponente</SelectItem><SelectItem value="grupo_familiar">Grupo familiar</SelectItem><SelectItem value="outro">Outro</SelectItem></SelectContent></Select></div>
        <div><Label className="text-xs text-slate-600">CPF</Label><Input className={FIELD} value={form.cpf} onChange={(e) => setForm((p) => ({...p, cpf:e.target.value}))} /></div>
        <div><Label className="text-xs text-slate-600">Renda mensal</Label><Input className={FIELD} inputMode="decimal" value={form.monthly_income} onChange={(e) => setForm((p) => ({...p, monthly_income:e.target.value}))} /></div>
      </div>
      <Button variant="outline" disabled={!form.full_name.trim()} onClick={add}><UserPlus className="w-4 h-4 mr-1.5" />Adicionar participante</Button>
    </section>
  );
}