import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CrmProperty, STAGE_CONFIG, PROPERTY_TYPE_LABELS, CrmPropertyHistory } from '@/types/crm';
import { useCrmPropertyHistory } from '@/hooks/useCrmProperties';
import { formatCurrency } from '@/lib/formatCurrency';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  MapPin,
  User,
  Calendar,
  Clock,
  Image,
  FileText,
  DollarSign,
  ArrowRight,
  Pencil,
  Trash2,
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: CrmProperty | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (property: CrmProperty) => void;
  onDelete: (property: CrmProperty) => void;
}

export function PropertyDetailModal({
  property,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: PropertyDetailModalProps) {
  const { history, isLoading: historyLoading } = useCrmPropertyHistory(property?.id || null);

  if (!property) return null;

  const stageConfig = STAGE_CONFIG[property.current_stage];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#0d0d0d] border-[#1a1a1a] text-[#e0e0e0] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-[#1a1a1a] pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold text-[#e0e0e0] flex items-center gap-3">
                <span className="font-mono text-[#888] bg-[#1a1a1a] px-2 py-1 rounded text-sm">
                  {property.code}
                </span>
                <span>{PROPERTY_TYPE_LABELS[property.property_type]}</span>
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <div
                  className="px-2 py-0.5 rounded text-xs font-medium"
                  style={{
                    backgroundColor: stageConfig.bgColor,
                    color: stageConfig.color,
                  }}
                >
                  {stageConfig.label}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(property)}
                className="bg-transparent border-[#2a2a2a] text-[#888] hover:bg-[#1a1a1a] hover:text-[#e0e0e0]"
              >
                <Pencil className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(property)}
                className="bg-transparent border-[#2a2a2a] text-red-400 hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Excluir
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="bg-[#1a1a1a] border-[#2a2a2a]">
            <TabsTrigger
              value="info"
              className="data-[state=active]:bg-[#2a2a2a] text-[#888] data-[state=active]:text-[#e0e0e0]"
            >
              Informações
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-[#2a2a2a] text-[#888] data-[state=active]:text-[#e0e0e0]"
            >
              Histórico
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-[#2a2a2a] text-[#888] data-[state=active]:text-[#e0e0e0]"
            >
              Documentos
            </TabsTrigger>
            <TabsTrigger
              value="commissions"
              className="data-[state=active]:bg-[#2a2a2a] text-[#888] data-[state=active]:text-[#e0e0e0]"
            >
              Comissões
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4 space-y-4">
            {/* Location */}
            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-[#555]" />
                <h4 className="text-sm font-medium text-[#888]">Localização</h4>
              </div>
              <div className="space-y-1">
                {property.address && (
                  <p className="text-sm text-[#e0e0e0]">{property.address}</p>
                )}
                <p className="text-sm text-[#888]">
                  {property.neighborhood && `${property.neighborhood}, `}
                  {property.city}/{property.state}
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-[#22c55e]" />
                  <h4 className="text-sm font-medium text-[#888]">Valor de Venda</h4>
                </div>
                <p className="text-lg font-semibold text-[#22c55e]">
                  {property.sale_value ? formatCurrency(property.sale_value) : '-'}
                </p>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-[#f59e0b]" />
                  <h4 className="text-sm font-medium text-[#888]">Comissão</h4>
                </div>
                <p className="text-lg font-semibold text-[#f59e0b]">
                  {property.commission_value ? formatCurrency(property.commission_value) : '-'}
                  {property.commission_percentage && (
                    <span className="text-xs text-[#666] ml-2">
                      ({property.commission_percentage}%)
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Responsible & Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-[#555]" />
                  <h4 className="text-sm font-medium text-[#888]">Responsável</h4>
                </div>
                <p className="text-sm text-[#e0e0e0]">
                  {property.responsible_user_name || 'Não atribuído'}
                </p>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-[#555]" />
                  <h4 className="text-sm font-medium text-[#888]">Entrada</h4>
                </div>
                <p className="text-sm text-[#e0e0e0]">
                  {format(new Date(property.created_at), "dd 'de' MMM, yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>

            {/* Status Icons */}
            <div className="flex gap-4">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  property.has_creatives
                    ? 'bg-[#8b5cf6]/10 text-[#8b5cf6]'
                    : 'bg-[#1a1a1a] text-[#555]'
                }`}
              >
                <Image className="w-4 h-4" />
                <span className="text-xs">
                  {property.has_creatives ? 'Tem criativos' : 'Sem criativos'}
                </span>
              </div>
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  property.has_proposal
                    ? 'bg-[#f59e0b]/10 text-[#f59e0b]'
                    : 'bg-[#1a1a1a] text-[#555]'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="text-xs">
                  {property.has_proposal ? 'Tem proposta' : 'Sem proposta'}
                </span>
              </div>
            </div>

            {/* Notes */}
            {property.notes && (
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h4 className="text-sm font-medium text-[#888] mb-2">Observações</h4>
                <p className="text-sm text-[#e0e0e0] whitespace-pre-wrap">{property.notes}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            {historyLoading ? (
              <div className="text-center py-8 text-[#666]">Carregando...</div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-[#666]">Nenhum histórico</div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#1a1a1a] rounded-lg p-4 flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <Clock className="w-4 h-4 text-[#555]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {item.from_stage && (
                          <>
                            <span
                              className="text-xs px-2 py-0.5 rounded"
                              style={{
                                backgroundColor: STAGE_CONFIG[item.from_stage].bgColor,
                                color: STAGE_CONFIG[item.from_stage].color,
                              }}
                            >
                              {STAGE_CONFIG[item.from_stage].label}
                            </span>
                            <ArrowRight className="w-3 h-3 text-[#555]" />
                          </>
                        )}
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: STAGE_CONFIG[item.to_stage].bgColor,
                            color: STAGE_CONFIG[item.to_stage].color,
                          }}
                        >
                          {STAGE_CONFIG[item.to_stage].label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-[11px] text-[#666]">
                        <span>
                          {format(new Date(item.created_at), "dd/MM/yyyy 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </span>
                        {item.moved_by_name && (
                          <>
                            <span>•</span>
                            <span>por {item.moved_by_name}</span>
                          </>
                        )}
                      </div>
                      {item.notes && (
                        <p className="text-xs text-[#888] mt-2">{item.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <div className="text-center py-8 text-[#666]">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Documentos em breve</p>
            </div>
          </TabsContent>

          <TabsContent value="commissions" className="mt-4">
            <div className="text-center py-8 text-[#666]">
              <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Comissões em breve</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
