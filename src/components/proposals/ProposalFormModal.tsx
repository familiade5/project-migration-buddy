import { useState } from 'react';
import { Proposal } from '@/types/proposals';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProposalFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Proposal>) => Promise<string | null>;
}

const EMPTY: Partial<Proposal> = {
  nome: '', corretor: '', agencia: '', cpf: '', produto: '',
  imovel: '', matricula: '', oficio: '', cidade: '',
  telefone: '', email: '', valor_financiamento: undefined, banco: '', notas: '',
};

export function ProposalFormModal({ open, onClose, onSubmit }: ProposalFormModalProps) {
  const [form, setForm] = useState<Partial<Proposal>>(EMPTY);
  const [isLoading, setIsLoading] = useState(false);

  const set = (key: keyof Proposal, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome?.trim()) return;
    setIsLoading(true);
    const id = await onSubmit(form);
    setIsLoading(false);
    if (id) {
      setForm(EMPTY);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Proposta</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bloco 1: Dados do cliente */}
            <div className="col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Dados do Cliente</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input id="nome" value={form.nome || ''} onChange={e => set('nome', e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" value={form.cpf || ''} onChange={e => set('cpf', e.target.value)} placeholder="000.000.000-00" />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" value={form.telefone || ''} onChange={e => set('telefone', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Bloco 2: Dados do corretor */}
            <div className="col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Corretor / Agência</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="corretor">Corretor</Label>
                  <Input id="corretor" value={form.corretor || ''} onChange={e => set('corretor', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="agencia">Agência</Label>
                  <Input id="agencia" value={form.agencia || ''} onChange={e => set('agencia', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Bloco 3: Imóvel */}
            <div className="col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Imóvel / Produto</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="produto">Produto</Label>
                  <Input id="produto" value={form.produto || ''} onChange={e => set('produto', e.target.value)} placeholder="Ex: Casa Própria MCMV" />
                </div>
                <div>
                  <Label htmlFor="imovel">Imóvel</Label>
                  <Input id="imovel" value={form.imovel || ''} onChange={e => set('imovel', e.target.value)} placeholder="Endereço / código" />
                </div>
                <div>
                  <Label htmlFor="matricula">Matrícula</Label>
                  <Input id="matricula" value={form.matricula || ''} onChange={e => set('matricula', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="oficio">Ofício</Label>
                  <Input id="oficio" value={form.oficio || ''} onChange={e => set('oficio', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input id="cidade" value={form.cidade || ''} onChange={e => set('cidade', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Bloco 4: Financeiro */}
            <div className="col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Financiamento</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="banco">Banco</Label>
                  <Input id="banco" value={form.banco || ''} onChange={e => set('banco', e.target.value)} placeholder="Ex: Caixa Econômica" />
                </div>
                <div>
                  <Label htmlFor="valor">Valor (R$)</Label>
                  <Input
                    id="valor"
                    type="number"
                    value={form.valor_financiamento || ''}
                    onChange={e => set('valor_financiamento', parseFloat(e.target.value) || undefined)}
                  />
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="col-span-2">
              <Label htmlFor="notas">Observações</Label>
              <Textarea id="notas" value={form.notas || ''} onChange={e => set('notas', e.target.value)} rows={3} />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isLoading || !form.nome?.trim()}>
              {isLoading ? 'Criando…' : 'Criar Proposta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
