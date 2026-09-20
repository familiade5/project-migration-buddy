import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CxDeal, CxDealStage, CX_BANKS, CX_STAGE_CONFIG, CX_STAGE_ORDER } from '@/types/cxCrm';
import { CxClient, CxProperty } from '@/types/correspondente';

const BRAND = '#1a3a6b';
const NONE = '__none__';

interface Props {
  open: boolean;
  onClose: () => void;
  clients: CxClient[];
  properties: CxProperty[];
  deal?: CxDeal | null;
  defaultClientId?: string | null;
  onSubmit: (data: Partial<CxDeal> & { client_id: string }) => Promise<unknown>;
}

const empty = {
  client_id: '',
  property_id: '',
  title: '',
  stage: 'simulacao' as CxDealStage,
  bank: '',
  property_value: '',
  financing_value: '',
  down_payment: '',
  fgts_value: '',
  subsidy_value: '',
  monthly_income: '',
  installment_value: '',
  responsible_name: '',
  pendencies: '',
  notes: '',
};

export function CxDealFormModal({ open, onClose, clients, properties, deal, defaultClientId, onSubmit }: Props) {
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (deal) {
      setForm({
        client_id: deal.client_id,
        property_id: deal.property_id || '',
        title: deal.title || '',
        stage: deal.stage,
        bank: deal.bank || '',
        property_value: deal.property_value?.toString() || '',
        financing_value: deal.financing_value?.toString() || '',
        down_payment: deal.down_payment?.toString() || '',
        fgts_value: deal.fgts_value?.toString() || '',
        subsidy_value: deal.subsidy_value?.toString() || '',
        monthly_income: deal.monthly_income?.toString() || '',
        installment_value: deal.installment_value?.toString() || '',
        responsible_name: deal.responsible_name || '',
        pendencies: deal.pendencies || '',
        notes: deal.notes || '',
      });
    } else {
      setForm({ ...empty, client_id: defaultClientId || '' });
    }
  }, [open, deal, defaultClientId]);

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const num = (v: string) => (v.trim() === '' ? null : Number(v));

  const handleSubmit = async () => {
    if (!form.client_id) return;
    setSaving(true);
    await onSubmit({
      client_id: form.client_id,
      property_id: form.property_id || null,
      title: form.title.trim() || null,
      stage: form.stage,
      bank: form.bank || null,
      property_value: num(form.property_value),
      financing_value: num(form.financing_value),
      down_payment: num(form.down_payment),
      fgts_value: num(form.fgts_value),
      subsidy_value: num(form.subsidy_value),
      monthly_income: num(form.monthly_income),
      installment_value: num(form.installment_value),
      responsible_name: form.responsible_name.trim() || null,
      pendencies: form.pendencies.trim() || null,
      notes: form.notes.trim() || null,
    });
    setSaving(false);
    onClose();
  };

  const clientProperties = properties.filter((p) => !p.client_id || p.client_id === form.client_id);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl bg-white text-slate-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle style={{ color: BRAND }}>{deal ? 'Editar caso' : 'Novo caso de financiamento'}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <Label className="text-slate-600">Cliente *</Label>
            <Select value={form.client_id} onValueChange={(v) => set('client_id', v)}>
              <SelectTrigger className="bg-white"><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-600">Imóvel vinculado</Label>
            <Select value={form.property_id || NONE} onValueChange={(v) => set('property_id', v === NONE ? '' : v)}>
              <SelectTrigger className="bg-white"><SelectValue placeholder="Nenhum" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Nenhum</SelectItem>
                {clientProperties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-600">Etapa</Label>
            <Select value={form.stage} onValueChange={(v) => set('stage', v)}>
              <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CX_STAGE_ORDER.map((s) => (
                  <SelectItem key={s} value={s}>{CX_STAGE_CONFIG[s].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2">
            <Label className="text-slate-600">Identificação do caso</Label>
            <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Ex.: Apto Aldeota — MCMV" className="bg-white" />
          </div>

          <div>
            <Label className="text-slate-600">Banco</Label>
            <Select value={form.bank || NONE} onValueChange={(v) => set('bank', v === NONE ? '' : v)}>
              <SelectTrigger className="bg-white"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Não definido</SelectItem>
                {CX_BANKS.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-600">Responsável</Label>
            <Input value={form.responsible_name} onChange={(e) => set('responsible_name', e.target.value)} placeholder="Nome do analista" className="bg-white" />
          </div>

          {([
            ['property_value', 'Valor do imóvel'],
            ['financing_value', 'Valor financiado'],
            ['down_payment', 'Entrada'],
            ['fgts_value', 'FGTS'],
            ['subsidy_value', 'Subsídio'],
            ['monthly_income', 'Renda mensal'],
            ['installment_value', 'Parcela estimada'],
          ] as const).map(([key, label]) => (
            <div key={key}>
              <Label className="text-slate-600">{label} (R$)</Label>
              <Input
                type="number"
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder="0"
                className="bg-white"
              />
            </div>
          ))}

          <div className="sm:col-span-2">
            <Label className="text-slate-600">Pendências</Label>
            <Textarea value={form.pendencies} onChange={(e) => set('pendencies', e.target.value)} rows={2} placeholder="O que falta para avançar…" className="bg-white" />
          </div>

          <div className="sm:col-span-2">
            <Label className="text-slate-600">Anotações</Label>
            <Textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={3} className="bg-white" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            disabled={!form.client_id || saving}
            className="text-white hover:opacity-90"
            style={{ backgroundColor: BRAND }}
            onClick={handleSubmit}
          >
            {saving ? 'Salvando…' : deal ? 'Salvar' : 'Criar caso'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
