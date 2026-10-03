import { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle2, FileUp, Home, IdCard, Loader2, UserRound, Wallet } from 'lucide-react';
import { extractClientFile, saveCxFile } from '@/lib/cxDocFiles';
import { formatCpf, profileFromExtraction } from '@/lib/cxProfile';
import { CX_DOC_LABEL } from '@/types/correspondente';
import { logCxClientEvent } from '@/hooks/useCxClientEvents';

const BRAND = '#1a3a6b';
const FIELD = 'mt-1 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400';
const POPOVER = 'bg-white border-slate-200 text-slate-900';
const ITEM = 'text-slate-900 focus:bg-slate-100';

export type RegForm = Record<
  | 'full_name' | 'cpf' | 'rg' | 'birth_date' | 'mother_name' | 'marital_status'
  | 'email' | 'phone' | 'whatsapp' | 'lead_source'
  | 'zip_code' | 'address' | 'neighborhood' | 'city' | 'state'
  | 'profession' | 'employer' | 'monthly_income' | 'family_income' | 'assigned_broker_name' | 'notes',
  string
>;

const EMPTY: RegForm = {
  full_name: '', cpf: '', rg: '', birth_date: '', mother_name: '', marital_status: '',
  email: '', phone: '', whatsapp: '', lead_source: '',
  zip_code: '', address: '', neighborhood: '', city: '', state: '',
  profession: '', employer: '', monthly_income: '', family_income: '', assigned_broker_name: '', notes: '',
};

interface PendingFile { file: File; docType: string; extracted: unknown }

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  /** Chamado após salvar: o pai abre o caso no funil. */
  onCreated: (clientId: string, name: string) => void;
}

export function CxClientRegistrationDialog({ open, onOpenChange, onCreated }: Props) {
  const [form, setForm] = useState<RegForm>(EMPTY);
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [reading, setReading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [pickType, setPickType] = useState('rg');

  const set = (k: keyof RegForm, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const reset = () => {
    setForm(EMPTY);
    setPending([]);
  };

  const pick = (docType: string) => {
    setPickType(docType);
    setTimeout(() => fileRef.current?.click(), 0);
  };

  const handleFile = async (file: File) => {
    setReading(pickType);
    try {
      const extracted = await extractClientFile(file, pickType);
      const profile = profileFromExtraction(extracted) as Record<string, unknown>;
      let filled = 0;
      setForm((prev) => {
        const next = { ...prev };
        (Object.keys(EMPTY) as (keyof RegForm)[]).forEach((k) => {
          const v = profile[k];
          if (!next[k] && v !== null && v !== undefined && String(v).trim() !== '') {
            next[k] = k === 'cpf' ? formatCpf(String(v)) : String(v);
            filled += 1;
          }
        });
        return next;
      });
      setPending((p) => [...p, { file, docType: pickType, extracted }]);
      toast.success(`${CX_DOC_LABEL(pickType)} lido`, {
        description: filled ? `${filled} campo(s) preenchido(s). Confira abaixo.` : 'Documento guardado; nenhum campo novo encontrado.',
      });
    } catch (e) {
      toast.error('Não foi possível ler o documento', { description: e instanceof Error ? e.message : undefined });
    } finally {
      setReading(null);
    }
  };

  const save = async () => {
    if (!form.full_name.trim()) {
      toast.error('Informe o nome do cliente');
      return;
    }
    setSaving(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      const income = Number(form.monthly_income.replace(/[^\d,]/g, '').replace(',', '.'));
      const familyIncome = Number(form.family_income.replace(/[^\d,]/g, '').replace(',', '.'));
      const payload: Record<string, unknown> = {
        created_by_user_id: u.user?.id ?? null,
        profile_updated_at: new Date().toISOString(),
      };
      (Object.keys(EMPTY) as (keyof RegForm)[]).forEach((k) => {
        const v = form[k].trim();
        payload[k] = k === 'monthly_income' ? (Number.isFinite(income) && income > 0 ? income : null) : k === 'family_income' ? (Number.isFinite(familyIncome) && familyIncome > 0 ? familyIncome : null) : v || null;
      });
      const { data: client, error } = await supabase.from('cx_clients').insert(payload as never).select().single();
      if (error) throw new Error(error.message);
      const c = client as { id: string; full_name: string };
      for (const p of pending) {
        try {
          await saveCxFile({ clientId: c.id, file: p.file, docType: p.docType, extracted: p.extracted });
        } catch (e) {
          toast.error(`Falha ao salvar ${p.file.name}`);
        }
      }
      await logCxClientEvent(c.id, {
        kind: 'cliente',
        title: 'Cliente cadastrado',
        description: pending.length ? `${pending.length} documento(s) anexado(s) no cadastro.` : undefined,
      });
      toast.success('Cliente cadastrado');
      reset();
      onOpenChange(false);
      onCreated(c.id, c.full_name);
    } catch (e) {
      toast.error('Não foi possível cadastrar', { description: e instanceof Error ? e.message : undefined });
    } finally {
      setSaving(false);
    }
  };

  const field = (k: keyof RegForm, label: string, props: Record<string, unknown> = {}) => (
    <div>
      <Label className="text-xs font-semibold text-slate-600">{label}</Label>
      <Input value={form[k]} onChange={(e) => set(k, e.target.value)} className={FIELD} {...props} />
    </div>
  );

  const attach = (docs: { type: string; label: string }[]) => (
    <div className="flex flex-wrap gap-2">
      {docs.map((d) => {
        const count = pending.filter((p) => p.docType === d.type).length;
        return (
          <Button
            key={d.type}
            type="button"
            size="sm"
            variant="outline"
            disabled={!!reading}
            onClick={() => pick(d.type)}
            className="h-8 bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-slate-900 text-xs"
          >
            {reading === d.type ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : count ? <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> : <FileUp className="w-3.5 h-3.5 mr-1.5" />}
            {reading === d.type ? 'Lendo…' : `Anexar ${d.label}`}
            {count > 0 && reading !== d.type && <span className="ml-1 text-emerald-600">({count})</span>}
          </Button>
        );
      })}
    </div>
  );

  const section = (icon: any, title: string, docs: { type: string; label: string }[], children: React.ReactNode) => {
    const Icon = icon;
    return (
      <section className="rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: BRAND }}>
            <Icon className="w-4 h-4" /> {title}
          </h4>
          {attach(docs)}
        </div>
        {children}
      </section>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="bg-white border-slate-200 text-slate-900 sm:max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-900 flex items-center gap-2">
            <UserRound className="w-5 h-5" style={{ color: BRAND }} /> Cadastro do cliente
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Digite os dados ou anexe cada documento: as informações são lidas e preenchidas automaticamente. Os arquivos ficam salvos na ficha do cliente.
          </p>
        </DialogHeader>

        <input
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            if (f) handleFile(f);
          }}
        />

        <div className="space-y-4">
          {section(IdCard, 'Dados pessoais', [{ type: 'rg', label: 'RG/CNH' }, { type: 'certidao', label: 'certidão' }], (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">{field('full_name', 'Nome completo *')}</div>
              {field('cpf', 'CPF', { onBlur: () => form.cpf && set('cpf', formatCpf(form.cpf)) })}
              {field('rg', 'RG')}
              {field('birth_date', 'Data de nascimento', { placeholder: 'dd/mm/aaaa' })}
              <div>
                <Label className="text-xs font-semibold text-slate-600">Estado civil</Label>
                <Select value={form.marital_status} onValueChange={(v) => set('marital_status', v)}>
                  <SelectTrigger className={FIELD}><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent className={POPOVER}>
                    {['Solteiro(a)', 'Casado(a)', 'União estável', 'Divorciado(a)', 'Viúvo(a)'].map((o) => (
                      <SelectItem key={o} value={o} className={ITEM}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-3">{field('mother_name', 'Nome da mãe')}</div>
            </div>
          ))}

          {section(UserRound, 'Contato', [], (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {field('phone', 'Telefone', { placeholder: '(92) 99999-9999' })}
              {field('whatsapp', 'WhatsApp', { placeholder: '(92) 99999-9999' })}
              {field('email', 'E-mail', { placeholder: 'cliente@email.com' })}
              <div>
                <Label className="text-xs font-semibold text-slate-600">Origem do lead</Label>
                <Select value={form.lead_source} onValueChange={(v) => set('lead_source', v)}>
                  <SelectTrigger className={FIELD}><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent className={POPOVER}>
                    {['Instagram', 'Facebook', 'OLX', 'WhatsApp', 'Site', 'Indicação', 'Tráfego pago', 'Outro'].map((o) => (
                      <SelectItem key={o} value={o} className={ITEM}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}

          {section(Home, 'Endereço', [{ type: 'comprovante_residencia', label: 'comprovante' }], (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {field('zip_code', 'CEP')}
              <div className="sm:col-span-3">{field('address', 'Endereço (rua, número, complemento)')}</div>
              <div className="sm:col-span-2">{field('neighborhood', 'Bairro')}</div>
              {field('city', 'Cidade')}
              {field('state', 'UF', { maxLength: 2 })}
            </div>
          ))}

          {section(Wallet, 'Renda', [
            { type: 'contracheque', label: 'contracheque' },
            { type: 'extrato_bancario', label: 'extrato' },
            { type: 'imposto_renda', label: 'IR' },
            { type: 'ctps', label: 'CTPS' },
          ], (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {field('profession', 'Profissão / cargo')}
              {field('employer', 'Empresa')}
              {field('monthly_income', 'Renda mensal (R$)', { inputMode: 'decimal', placeholder: '0,00' })}
              {field('family_income', 'Renda familiar (R$)', { inputMode: 'decimal', placeholder: '0,00' })}
              {field('assigned_broker_name', 'Corretor responsável')}
            </div>
          ))}

          <div>
            <Label className="text-xs font-semibold text-slate-600">Observações</Label>
            <Textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={2} className={FIELD} />
          </div>

          {pending.length > 0 && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
              <strong>{pending.length} documento(s) prontos para salvar:</strong>{' '}
              {pending.map((p) => `${CX_DOC_LABEL(p.docType)} (${p.file.name})`).join(' · ')}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="text-white hover:opacity-90" style={{ backgroundColor: BRAND }} disabled={saving || !!reading || !form.full_name.trim()} onClick={save}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Cadastrar e seguir o fluxo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
