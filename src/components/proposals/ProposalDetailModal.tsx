import { useState } from 'react';
import { Proposal, ProposalChecklistItem, ProposalHistoryEntry, STAGE_CONFIG, STAGE_ORDER, CHECKLIST_TEMPLATE } from '@/types/proposals';
import { useProposalDetail } from '@/hooks/useProposals';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/formatCurrency';
import { 
  User, MapPin, Phone, Mail, Building2, FileText, Hash, 
  CheckCircle2, Clock, AlertTriangle, MinusCircle, ChevronDown, History
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProposalDetailModalProps {
  proposal: Proposal | null;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Proposal>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

const statusIcons = {
  conforme: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  pendente: <AlertTriangle className="w-4 h-4 text-red-400" />,
  nao_se_aplica: <MinusCircle className="w-4 h-4 text-gray-300" />,
};

const statusColors = {
  conforme: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pendente: 'bg-red-50 text-red-600 border-red-200',
  nao_se_aplica: 'bg-gray-50 text-gray-400 border-gray-200',
};

export function ProposalDetailModal({ proposal, onClose, onUpdate, onDelete }: ProposalDetailModalProps) {
  const { checklist, history, isLoading, updateChecklistItem } = useProposalDetail(proposal?.id || null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [movingStage, setMovingStage] = useState(false);

  if (!proposal) return null;

  const cfg = STAGE_CONFIG[proposal.stage];

  // Group checklist by category
  const groupedChecklist = CHECKLIST_TEMPLATE.map(group => ({
    ...group,
    items: checklist.filter(item => item.category === group.category),
  }));

  const totalItems = checklist.length;
  const conformeItems = checklist.filter(i => i.status === 'conforme').length;
  const pendingItems = checklist.filter(i => i.status === 'pendente').length;

  const handleCycleStatus = async (item: ProposalChecklistItem) => {
    const cycle: Record<string, 'pendente' | 'conforme' | 'nao_se_aplica'> = {
      pendente: 'conforme',
      conforme: 'nao_se_aplica',
      nao_se_aplica: 'pendente',
    };
    await updateChecklistItem(item.id, cycle[item.status]);
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    await onDelete(proposal.id);
    onClose();
  };

  const stageIdx = STAGE_ORDER.indexOf(proposal.stage);
  const nextStage = stageIdx < STAGE_ORDER.length - 1 ? STAGE_ORDER[stageIdx + 1] : null;

  return (
    <Dialog open={!!proposal} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b" style={{ backgroundColor: cfg.bgColor }}>
          <DialogHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">{proposal.nome}</DialogTitle>
                {proposal.produto && <p className="text-sm text-gray-500 mt-0.5">{proposal.produto}</p>}
              </div>
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0"
                style={{ color: cfg.color, backgroundColor: cfg.bgColor, border: `1.5px solid ${cfg.borderColor}` }}
              >
                {cfg.label}
              </span>
            </div>
          </DialogHeader>

          {/* Checklist summary bar */}
          {totalItems > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Checklist: {conformeItems}/{totalItems} conforme</span>
                {pendingItems > 0 && (
                  <span className="text-red-500 font-medium">{pendingItems} pendente(s)</span>
                )}
              </div>
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${totalItems > 0 ? (conformeItems / totalItems) * 100 : 0}%`,
                    backgroundColor: pendingItems === 0 && totalItems > 0 ? '#10b981' : '#6366f1',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="dados" className="h-full">
            <div className="px-6 pt-3 border-b">
              <TabsList className="bg-gray-100">
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="checklist">
                  Checklist
                  {pendingItems > 0 && (
                    <span className="ml-1.5 text-[10px] bg-red-500 text-white rounded-full px-1.5">{pendingItems}</span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="historico">Histórico</TabsTrigger>
              </TabsList>
            </div>

            {/* DADOS TAB */}
            <TabsContent value="dados" className="p-6 space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <User className="w-4 h-4" />, label: 'Corretor', value: proposal.corretor },
                  { icon: <Building2 className="w-4 h-4" />, label: 'Agência', value: proposal.agencia },
                  { icon: <Hash className="w-4 h-4" />, label: 'CPF', value: proposal.cpf },
                  { icon: <MapPin className="w-4 h-4" />, label: 'Cidade', value: proposal.cidade },
                  { icon: <FileText className="w-4 h-4" />, label: 'Imóvel', value: proposal.imovel },
                  { icon: <FileText className="w-4 h-4" />, label: 'Matrícula', value: proposal.matricula },
                  { icon: <FileText className="w-4 h-4" />, label: 'Ofício', value: proposal.oficio },
                  { icon: <Building2 className="w-4 h-4" />, label: 'Banco', value: proposal.banco },
                  { icon: <Phone className="w-4 h-4" />, label: 'Telefone', value: proposal.telefone },
                  { icon: <Mail className="w-4 h-4" />, label: 'Email', value: proposal.email },
                ].map(({ icon, label, value }) => value ? (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-gray-400">{icon}</span>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
                      <p className="text-sm text-gray-800">{value}</p>
                    </div>
                  </div>
                ) : null)}

                {proposal.valor_financiamento && (
                  <div className="flex items-center gap-2 col-span-2">
                    <span className="text-gray-400"><FileText className="w-4 h-4" /></span>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Valor Financiamento</p>
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(proposal.valor_financiamento)}</p>
                    </div>
                  </div>
                )}
              </div>

              {proposal.notas && (
                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
                  <p className="text-xs text-yellow-700 font-medium mb-1">Observações</p>
                  <p className="text-sm text-yellow-900">{proposal.notas}</p>
                </div>
              )}

              {/* Stage advance button */}
              {nextStage && (
                <div className="pt-2 border-t">
                  <Button
                    size="sm"
                    className="w-full"
                    style={{ backgroundColor: STAGE_CONFIG[nextStage].color, color: 'white' }}
                    onClick={async () => {
                      setMovingStage(true);
                      await onUpdate(proposal.id, {
                        stage: nextStage,
                        stage_entered_at: new Date().toISOString(),
                      });
                      setMovingStage(false);
                      onClose();
                    }}
                    disabled={movingStage}
                  >
                    Avançar para: {STAGE_CONFIG[nextStage].label} →
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* CHECKLIST TAB */}
            <TabsContent value="checklist" className="p-6 space-y-4 mt-0">
              {isLoading ? (
                <p className="text-sm text-gray-400 text-center py-8">Carregando checklist…</p>
              ) : groupedChecklist.map(group => (
                group.items.length > 0 && (
                  <div key={group.category}>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                      {group.categoryLabel}
                    </h3>
                    <div className="space-y-1.5">
                      {group.items.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleCycleStatus(item)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all hover:opacity-80 ${statusColors[item.status]}`}
                        >
                          {statusIcons[item.status]}
                          <span className="text-sm flex-1">{item.item_label}</span>
                          <span className="text-[10px] font-medium capitalize">
                            {item.status === 'nao_se_aplica' ? 'N/A' : item.status === 'conforme' ? 'Conforme' : 'Pendente'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              ))}
              <p className="text-xs text-gray-400 text-center">Clique em um item para alternar o status</p>
            </TabsContent>

            {/* HISTÓRICO TAB */}
            <TabsContent value="historico" className="p-6 mt-0">
              {history.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Nenhum histórico registrado</p>
              ) : (
                <div className="space-y-3">
                  {history.map(entry => (
                    <div key={entry.id} className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 rounded-full bg-indigo-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800">{entry.action}</p>
                        {entry.from_stage && entry.to_stage && (
                          <p className="text-xs text-gray-500">
                            {STAGE_CONFIG[entry.from_stage]?.label} → {STAGE_CONFIG[entry.to_stage]?.label}
                          </p>
                        )}
                        {entry.moved_by_name && (
                          <p className="text-xs text-gray-400">{entry.moved_by_name}</p>
                        )}
                        <p className="text-[10px] text-gray-400">
                          {format(new Date(entry.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3 border-t flex items-center justify-between">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            {confirmDelete ? 'Confirmar exclusão?' : 'Excluir'}
          </Button>
          {confirmDelete && (
            <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
