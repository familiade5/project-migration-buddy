import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CrmLead, CrmLeadHistory, CrmLeadInteraction, CLASSIFICACAO_CONFIG, SDR_STAGE_CONFIG, SALES_STAGE_CONFIG, ORIGEM_OPTIONS } from '@/types/leads';
import { Phone, MapPin, User, MessageSquare, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LeadDetailModalProps {
  lead: CrmLead | null;
  history: CrmLeadHistory[];
  interactions: CrmLeadInteraction[];
  onClose: () => void;
  onUpdate: (id: string, data: Partial<CrmLead>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onAddInteraction: (tipo: string, descricao: string) => Promise<boolean>;
  onAssignSales: (leadId: string, responsavel: string) => void;
}

const INTERACTION_TYPES = [
  'Ligação', 'WhatsApp', 'Reunião', 'E-mail', 'Visita', 'Anotação',
];

export function LeadDetailModal({
  lead, history, interactions, onClose, onUpdate, onDelete, onAddInteraction, onAssignSales,
}: LeadDetailModalProps) {
  const [interactionText, setInteractionText] = useState('');
  const [interactionTipo, setInteractionTipo] = useState('Anotação');
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Partial<CrmLead>>({});
  const [salesResponsavel, setSalesResponsavel] = useState('');
  const [saving, setSaving] = useState(false);

  if (!lead) return null;

  const cfg = SDR_STAGE_CONFIG[lead.sdr_stage];
  const salesCfg = lead.sales_stage ? SALES_STAGE_CONFIG[lead.sales_stage] : null;
  const classCfg = CLASSIFICACAO_CONFIG[lead.classificacao];

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(lead.id, form);
    setSaving(false);
    setEditMode(false);
    setForm({});
  };

  const handleAddInteraction = async () => {
    if (!interactionText.trim()) return;
    const ok = await onAddInteraction(interactionTipo, interactionText);
    if (ok) setInteractionText('');
  };

  const handleQualificationUpdate = async (field: keyof CrmLead, value: boolean) => {
    await onUpdate(lead.id, { [field]: value });
  };

  const handleAssignSales = () => {
    if (!salesResponsavel.trim()) return;
    onAssignSales(lead.id, salesResponsavel);
    setSalesResponsavel('');
  };

  const set = (k: keyof CrmLead, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <Dialog open={!!lead} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 bg-white text-gray-900 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b flex-shrink-0" style={{ backgroundColor: cfg.bgColor, borderBottomColor: cfg.borderColor }}>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">{lead.nome}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge style={{ backgroundColor: cfg.color, color: 'white' }}>{cfg.label}</Badge>
            <Badge style={{ backgroundColor: classCfg.color, color: 'white' }}>{classCfg.emoji} {classCfg.label}</Badge>
            {salesCfg && (
              <Badge style={{ backgroundColor: salesCfg.color, color: 'white' }}>Vendas: {salesCfg.label}</Badge>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="dados" className="h-full">
            <TabsList className="w-full rounded-none border-b bg-gray-50 justify-start px-4">
              <TabsTrigger value="dados" className="text-gray-700 data-[state=active]:text-gray-900">Dados</TabsTrigger>
              <TabsTrigger value="qualificacao" className="text-gray-700 data-[state=active]:text-gray-900">Qualificação</TabsTrigger>
              <TabsTrigger value="interacoes" className="text-gray-700 data-[state=active]:text-gray-900">
                Interações {interactions.length > 0 && `(${interactions.length})`}
              </TabsTrigger>
              <TabsTrigger value="historico" className="text-gray-700 data-[state=active]:text-gray-900">Histórico</TabsTrigger>
            </TabsList>

            {/* DADOS */}
            <TabsContent value="dados" className="p-5 space-y-4 bg-white mt-0">
              {!editMode ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Telefone', value: lead.telefone, icon: Phone },
                      { label: 'Cidade', value: lead.cidade, icon: MapPin },
                      { label: 'Origem', value: lead.origem_lead },
                      { label: 'SDR', value: lead.sdr_responsavel_nome, icon: User },
                      { label: 'Responsável Vendas', value: lead.sales_responsavel_nome },
                      { label: 'Valor Estimado', value: lead.valor_estimado ? `R$ ${lead.valor_estimado.toLocaleString('pt-BR')}` : null },
                      { label: 'Data de Entrada', value: format(new Date(lead.data_entrada), 'dd/MM/yyyy HH:mm', { locale: ptBR }) },
                    ].map(({ label, value, icon: Icon }) => value ? (
                      <div key={label}>
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">{label}</p>
                        <p className="text-sm text-gray-900 font-medium flex items-center gap-1">
                          {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
                          {value}
                        </p>
                      </div>
                    ) : null)}
                  </div>
                  {lead.anotacoes && (
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Anotações</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{lead.anotacoes}</p>
                    </div>
                  )}
                  {lead.objecoes && (
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Objeções</p>
                      <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{lead.objecoes}</p>
                    </div>
                  )}
                  {/* Assign sales */}
                  {lead.sdr_stage === 'qualificado' && !lead.sales_responsavel_nome && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-green-800 mb-2">✅ Lead qualificado — atribuir corretor</p>
                      <div className="flex gap-2">
                        <Input
                          value={salesResponsavel}
                          onChange={e => setSalesResponsavel(e.target.value)}
                          placeholder="Nome do corretor"
                          className="bg-white text-gray-900 text-sm"
                        />
                        <Button size="sm" onClick={handleAssignSales} className="bg-green-600 hover:bg-green-700 text-white">
                          Atribuir
                        </Button>
                      </div>
                    </div>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setEditMode(true)} className="text-gray-700">
                    Editar dados
                  </Button>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-gray-700">Nome</Label>
                      <Input defaultValue={lead.nome} onChange={e => set('nome', e.target.value)} className="bg-white text-gray-900" />
                    </div>
                    <div>
                      <Label className="text-gray-700">Telefone</Label>
                      <Input defaultValue={lead.telefone} onChange={e => set('telefone', e.target.value)} className="bg-white text-gray-900" />
                    </div>
                    <div>
                      <Label className="text-gray-700">Cidade</Label>
                      <Input defaultValue={lead.cidade || ''} onChange={e => set('cidade', e.target.value)} className="bg-white text-gray-900" />
                    </div>
                    <div>
                      <Label className="text-gray-700">Origem</Label>
                      <Select defaultValue={lead.origem_lead || ''} onValueChange={v => set('origem_lead', v)}>
                        <SelectTrigger className="bg-white text-gray-900"><SelectValue /></SelectTrigger>
                        <SelectContent>{ORIGEM_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-700">Classificação</Label>
                      <Select defaultValue={lead.classificacao} onValueChange={v => set('classificacao', v)}>
                        <SelectTrigger className="bg-white text-gray-900"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(CLASSIFICACAO_CONFIG).map(([k, v]) => (
                            <SelectItem key={k} value={k}>{v.emoji} {v.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-700">Valor Estimado</Label>
                      <Input type="number" defaultValue={lead.valor_estimado || ''} onChange={e => set('valor_estimado', Number(e.target.value))} className="bg-white text-gray-900" />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-gray-700">Anotações</Label>
                      <Textarea defaultValue={lead.anotacoes || ''} onChange={e => set('anotacoes', e.target.value)} rows={2} className="bg-white text-gray-900" />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-gray-700">Objeções do cliente</Label>
                      <Textarea defaultValue={lead.objecoes || ''} onChange={e => set('objecoes', e.target.value)} rows={2} className="bg-white text-gray-900" />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => setEditMode(false)} className="text-gray-700">Cancelar</Button>
                    <Button size="sm" disabled={saving} onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      {saving ? 'Salvando...' : 'Salvar'}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* QUALIFICAÇÃO */}
            <TabsContent value="qualificacao" className="p-5 bg-white mt-0">
              <p className="text-sm text-gray-500 mb-4">Marque os critérios de qualificação. Quando todos estiverem marcados, o lead pode ser movido para "Qualificado".</p>
              <div className="space-y-3">
                {[
                  { key: 'tem_interesse' as keyof CrmLead, label: 'Tem interesse real', desc: 'Cliente demonstrou interesse genuíno no produto' },
                  { key: 'tem_condicao_financeira' as keyof CrmLead, label: 'Possui condição financeira', desc: 'Tem entrada ou capacidade de financiamento' },
                  { key: 'momento_compra' as keyof CrmLead, label: 'Está no momento de compra', desc: 'Pronto para fechar em breve' },
                ].map(({ key, label, desc }) => {
                  const isChecked = lead[key] as boolean;
                  return (
                    <div
                      key={key}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${isChecked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                      onClick={() => handleQualificationUpdate(key, !isChecked)}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isChecked ? 'bg-green-500' : 'bg-gray-200'}`}>
                        {isChecked
                          ? <CheckCircle className="w-4 h-4 text-white" />
                          : <XCircle className="w-4 h-4 text-gray-400" />
                        }
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${isChecked ? 'text-green-800' : 'text-gray-700'}`}>{label}</p>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={`mt-4 p-3 rounded-xl text-sm font-semibold text-center ${lead.tem_interesse && lead.tem_condicao_financeira && lead.momento_compra ? 'bg-green-100 text-green-800' : 'bg-amber-50 text-amber-700'}`}>
                {lead.tem_interesse && lead.tem_condicao_financeira && lead.momento_compra
                  ? '✅ Lead pronto para qualificação!'
                  : '⚠️ Critérios incompletos — continue qualificando'}
              </div>
            </TabsContent>

            {/* INTERAÇÕES */}
            <TabsContent value="interacoes" className="p-5 bg-white mt-0 space-y-4">
              <div className="flex gap-2">
                <Select value={interactionTipo} onValueChange={setInteractionTipo}>
                  <SelectTrigger className="w-32 bg-white text-gray-900 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERACTION_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input
                  value={interactionText}
                  onChange={e => setInteractionText(e.target.value)}
                  placeholder="Descreva a interação..."
                  className="flex-1 bg-white text-gray-900"
                  onKeyDown={e => e.key === 'Enter' && handleAddInteraction()}
                />
                <Button size="sm" onClick={handleAddInteraction} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {interactions.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Nenhuma interação registrada</p>
                ) : interactions.map(i => (
                  <div key={i.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="shrink-0 w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{i.tipo}</span>
                        <span className="text-[10px] text-gray-400">
                          {formatDistanceToNow(new Date(i.created_at), { addSuffix: true, locale: ptBR })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 mt-1">{i.descricao}</p>
                      {i.created_by_name && (
                        <p className="text-[10px] text-gray-400 mt-0.5">por {i.created_by_name}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* HISTÓRICO */}
            <TabsContent value="historico" className="p-5 bg-white mt-0">
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Sem histórico</p>
                ) : history.map(h => (
                  <div key={h.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{h.action}</p>
                      {(h.from_sdr_stage || h.to_sdr_stage) && (
                        <p className="text-xs text-gray-500">SDR: {h.from_sdr_stage} → {h.to_sdr_stage}</p>
                      )}
                      {(h.from_sales_stage || h.to_sales_stage) && (
                        <p className="text-xs text-gray-500">Vendas: {h.from_sales_stage} → {h.to_sales_stage}</p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5">
                        {h.moved_by_name && <span className="text-[10px] text-gray-400">{h.moved_by_name}</span>}
                        <span className="text-[10px] text-gray-400">
                          {formatDistanceToNow(new Date(h.created_at), { addSuffix: true, locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t bg-gray-50 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={async () => { const ok = await onDelete(lead.id); if (ok) onClose(); }}
          >
            Excluir lead
          </Button>
          <Button variant="outline" size="sm" onClick={onClose} className="text-gray-700">Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
