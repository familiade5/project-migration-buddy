import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CrmLead, CLASSIFICACAO_CONFIG, ORIGEM_OPTIONS } from '@/types/leads';

interface LeadFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<CrmLead>) => Promise<string | null>;
}

export function LeadFormModal({ open, onClose, onSubmit }: LeadFormModalProps) {
  const [form, setForm] = useState<Partial<CrmLead>>({ classificacao: 'morno' });
  const [loading, setLoading] = useState(false);

  const set = (k: keyof CrmLead, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.telefone) return;
    setLoading(true);
    const id = await onSubmit(form);
    setLoading(false);
    if (id) {
      setForm({ classificacao: 'morno' });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Novo Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-gray-700">Nome *</Label>
              <Input
                value={form.nome || ''}
                onChange={e => set('nome', e.target.value)}
                placeholder="Nome do lead"
                required
                className="bg-white text-gray-900"
              />
            </div>
            <div>
              <Label className="text-gray-700">Telefone/WhatsApp *</Label>
              <Input
                value={form.telefone || ''}
                onChange={e => set('telefone', e.target.value)}
                placeholder="(67) 99999-9999"
                required
                className="bg-white text-gray-900"
              />
            </div>
            <div>
              <Label className="text-gray-700">Cidade</Label>
              <Input
                value={form.cidade || ''}
                onChange={e => set('cidade', e.target.value)}
                placeholder="Cidade"
                className="bg-white text-gray-900"
              />
            </div>
            <div>
              <Label className="text-gray-700">Origem do Lead</Label>
              <Select value={form.origem_lead || ''} onValueChange={v => set('origem_lead', v)}>
                <SelectTrigger className="bg-white text-gray-900">
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent>
                  {ORIGEM_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-700">Classificação</Label>
              <Select value={form.classificacao || 'morno'} onValueChange={v => set('classificacao', v)}>
                <SelectTrigger className="bg-white text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CLASSIFICACAO_CONFIG).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.emoji} {v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-700">SDR Responsável</Label>
              <Input
                value={form.sdr_responsavel_nome || ''}
                onChange={e => set('sdr_responsavel_nome', e.target.value)}
                placeholder="Nome do SDR"
                className="bg-white text-gray-900"
              />
            </div>
            <div>
              <Label className="text-gray-700">Valor Estimado</Label>
              <Input
                type="number"
                value={form.valor_estimado || ''}
                onChange={e => set('valor_estimado', Number(e.target.value))}
                placeholder="R$ 0,00"
                className="bg-white text-gray-900"
              />
            </div>
            <div className="col-span-2">
              <Label className="text-gray-700">Anotações</Label>
              <Textarea
                value={form.anotacoes || ''}
                onChange={e => set('anotacoes', e.target.value)}
                placeholder="Observações sobre o lead..."
                rows={3}
                className="bg-white text-gray-900"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="text-gray-700">Cancelar</Button>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {loading ? 'Salvando...' : 'Criar Lead'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
