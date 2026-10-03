import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ClipboardCheck, Loader2, Plus, Save, Wrench } from 'lucide-react';
import { CxDeal } from '@/types/cxCrm';
import { CxOperationalRecord, useCxOperations } from '@/hooks/useCxOperations';

const FIELD = 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400';
const ITEM = 'text-slate-700 focus:bg-slate-100 focus:text-slate-900';
const ACTIVE_STAGES = ['documentacao', 'engenharia', 'pendencia_engenharia', 'contrato', 'itbi_registro', 'entrega_chaves'];
const CHECK_STATUS = [
  ['pendente', 'Pendente'], ['recebido', 'Recebido'], ['em_analise', 'Em análise'],
  ['aprovado', 'Aprovado'], ['com_pendencia', 'Com pendência'], ['nao_aplicavel', 'Não aplicável'],
];

export function CxOperationalWorkspace({ deal }: { deal: CxDeal }) {
  const ops = useCxOperations(deal.id);
  const [form, setForm] = useState<Record<string, string>>({});
  const [newItem, setNewItem] = useState('');
  const [task, setTask] = useState({ title: '', due_at: '', priority: 'media' });
  const canonical = deal.stage === 'pendencia_engenharia' ? 'engenharia' : deal.stage;
  const record = ops.records[canonical];

  useEffect(() => {
    const next: Record<string, string> = {};
    Object.entries(record || {}).forEach(([key, value]) => { next[key] = value == null ? '' : String(value).slice(0, key.endsWith('_at') ? 16 : undefined); });
    setForm(next);
  }, [record?.id, deal.stage]);

  useEffect(() => {
    if (deal.stage === 'documentacao' && !ops.loading && !ops.checklist.length) ops.seedChecklist();
  }, [deal.stage, ops.loading, ops.checklist.length, ops.seedChecklist]);

  if (!ACTIVE_STAGES.includes(deal.stage)) return null;
  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const input = (key: string, label: string, type = 'text') => (
    <div className="space-y-1"><Label className="text-xs text-slate-600">{label}</Label><Input type={type} className={FIELD} value={form[key] || ''} onChange={(e) => set(key, e.target.value)} /></div>
  );
  const save = () => ops.saveRecord(deal.stage as 'engenharia' | 'pendencia_engenharia' | 'contrato' | 'itbi_registro' | 'entrega_chaves', form);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
      <div className="flex items-center gap-2"><Wrench className="w-4 h-4 text-blue-700" /><h4 className="font-bold text-sm text-slate-900">Controle operacional da etapa</h4></div>
      {ops.loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-400" /> : deal.stage === 'documentacao' ? (
        <div className="space-y-3">
          {ops.checklist.map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr_150px] gap-2 items-center border-b border-slate-100 pb-2">
              <div><p className="text-sm font-semibold text-slate-800">{item.item_name}</p><p className="text-[11px] uppercase text-slate-400">{item.category}</p></div>
              <Select value={item.status} onValueChange={(status) => ops.updateChecklist(item.id, { status })}><SelectTrigger className={FIELD}><SelectValue /></SelectTrigger><SelectContent className="bg-white">{CHECK_STATUS.map(([value, label]) => <SelectItem className={ITEM} key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select>
            </div>
          ))}
          <div className="flex gap-2"><Input className={FIELD} placeholder="Adicionar documento ou conferência" value={newItem} onChange={(e) => setNewItem(e.target.value)} /><Button variant="outline" disabled={!newItem.trim()} onClick={() => { ops.addChecklist(newItem.trim(), 'outro'); setNewItem(''); }}><Plus className="w-4 h-4 mr-1" />Adicionar</Button></div>
        </div>
      ) : (
        <div className="space-y-3">
          {canonical === 'engenharia' && <><div className="grid sm:grid-cols-3 gap-3"><Status value={form.status || 'aguardando'} onChange={(v) => set('status', v)} options={[['aguardando','Aguardando'],['agendada','Agendada'],['em_vistoria','Em vistoria'],['pendencia','Pendência'],['aprovada','Aprovada'],['reprovada','Reprovada']]} />{input('scheduled_at','Vistoria agendada','datetime-local')}{input('inspection_at','Vistoria realizada','datetime-local')}</div><div className="grid sm:grid-cols-2 gap-3">{input('responsible_name','Responsável')}{input('due_at','Prazo','datetime-local')}</div></>}
          {canonical === 'contrato' && <><div className="grid sm:grid-cols-3 gap-3"><Status value={form.status || 'preparacao'} onChange={(v) => set('status', v)} options={[['preparacao','Preparação'],['aguardando_assinaturas','Aguardando assinaturas'],['pendencia','Pendência'],['assinado','Assinado'],['concluido','Concluído']]} />{input('contract_number','Número do contrato')}{input('signed_at','Assinado em','datetime-local')}</div></>}
          {canonical === 'itbi_registro' && <><div className="grid sm:grid-cols-3 gap-3"><Status value={form.status || 'pendente'} onChange={(v) => set('status', v)} options={[['pendente','Pendente'],['itbi_emitido','ITBI emitido'],['itbi_pago','ITBI pago'],['protocolado','Protocolado'],['registrado','Registrado'],['com_pendencia','Com pendência']]} />{input('itbi_value','Valor do ITBI','number')}{input('itbi_paid_at','Pagamento do ITBI','date')}</div><div className="grid sm:grid-cols-3 gap-3">{input('protocol_number','Protocolo')}{input('protocol_at','Data do protocolo','date')}{input('registry_office','Cartório')}</div>{input('registered_at','Registro concluído','date')}</>}
          {canonical === 'entrega_chaves' && <div className="grid sm:grid-cols-3 gap-3">{input('expected_at','Previsão da entrega','date')}{input('delivered_at','Entrega realizada','datetime-local')}{input('responsible_name','Responsável pela entrega')}</div>}
          {canonical !== 'entrega_chaves' && <div className="space-y-1"><Label className="text-xs text-slate-600">Pendências da etapa</Label><Textarea className={FIELD} value={form.pendencies || ''} onChange={(e) => set('pendencies', e.target.value)} /></div>}
          <div className="space-y-1"><Label className="text-xs text-slate-600">Observações</Label><Textarea className={FIELD} value={form.notes || ''} onChange={(e) => set('notes', e.target.value)} /></div>
          <Button className="bg-primary text-primary-foreground" onClick={save}><Save className="w-4 h-4 mr-1.5" />Salvar controle da etapa</Button>
        </div>
      )}

      <div className="border-t border-slate-200 pt-4 space-y-3">
        <h5 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5"><ClipboardCheck className="w-4 h-4" />Tarefas e pendências</h5>
        {ops.tasks.map((item) => <div key={item.id} className="flex items-center gap-2 text-sm"><Checkbox checked={item.status === 'concluida'} onCheckedChange={(v) => ops.completeTask(item.id, v === true)} /><span className={item.status === 'concluida' ? 'line-through text-slate-400' : 'text-slate-700'}>{item.title}</span>{item.due_at && <span className="ml-auto text-xs text-slate-400">{new Date(item.due_at).toLocaleDateString('pt-BR')}</span>}</div>)}
        <div className="grid sm:grid-cols-[1fr_145px_120px_auto] gap-2"><Input className={FIELD} placeholder="Nova tarefa ou pendência" value={task.title} onChange={(e) => setTask((p) => ({ ...p, title: e.target.value }))} /><Input type="date" className={FIELD} value={task.due_at} onChange={(e) => setTask((p) => ({ ...p, due_at: e.target.value }))} /><Select value={task.priority} onValueChange={(priority) => setTask((p) => ({ ...p, priority }))}><SelectTrigger className={FIELD}><SelectValue /></SelectTrigger><SelectContent className="bg-white"><SelectItem value="baixa">Baixa</SelectItem><SelectItem value="media">Média</SelectItem><SelectItem value="alta">Alta</SelectItem><SelectItem value="urgente">Urgente</SelectItem></SelectContent></Select><Button variant="outline" disabled={!task.title.trim()} onClick={() => { ops.addTask({ title: task.title.trim(), kind: 'tarefa', priority: task.priority, due_at: task.due_at || null, client_id: deal.client_id }); setTask({ title: '', due_at: '', priority: 'media' }); }}><Plus className="w-4 h-4" /></Button></div>
      </div>
    </section>
  );
}

function Status({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[][] }) {
  return <div className="space-y-1"><Label className="text-xs text-slate-600">Situação</Label><Select value={value} onValueChange={onChange}><SelectTrigger className={FIELD}><SelectValue /></SelectTrigger><SelectContent className="bg-white">{options.map(([v,l]) => <SelectItem className={ITEM} key={v} value={v}>{l}</SelectItem>)}</SelectContent></Select></div>;
}