import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CrmProperty, STAGE_CONFIG, PROPERTY_TYPE_LABELS } from '@/types/crm';
import { useCrmPropertyHistory } from '@/hooks/useCrmProperties';
import { useCrmPermissions } from '@/hooks/useCrmPermissions';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/formatCurrency';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CommissionsTab } from './CommissionsTab';
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
  const { canEditProperty } = useCrmPermissions();
  const { isAdmin } = useAuth();

  if (!property) return null;

  const stageConfig = STAGE_CONFIG[property.current_stage];
  const canEdit = isAdmin || canEditProperty(property.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white border-gray-200 text-gray-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              {/* Cover Image */}
              {(property as any).cover_image_url && (
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                  <img
                    src={(property as any).cover_image_url}
                    alt={property.code}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                  <span className="font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded text-sm">
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
            </div>
            <div className="flex gap-2">
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(property)}
                  className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Editar
                </Button>
              )}
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(property)}
                  className="bg-white border-gray-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Excluir
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="bg-gray-100 border-gray-200">
            <TabsTrigger
              value="info"
              className="data-[state=active]:bg-white text-gray-500 data-[state=active]:text-gray-900"
            >
              Informações
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-white text-gray-500 data-[state=active]:text-gray-900"
            >
              Histórico
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-white text-gray-500 data-[state=active]:text-gray-900"
            >
              Documentos
            </TabsTrigger>
            <TabsTrigger
              value="commissions"
              className="data-[state=active]:bg-white text-gray-500 data-[state=active]:text-gray-900"
            >
              Comissões
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4 space-y-4">
            {/* Location */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <h4 className="text-sm font-medium text-gray-500">Localização</h4>
              </div>
              <div className="space-y-1">
                {property.address && (
                  <p className="text-sm text-gray-900">{property.address}</p>
                )}
                <p className="text-sm text-gray-600">
                  {property.neighborhood && `${property.neighborhood}, `}
                  {property.city}/{property.state}
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <h4 className="text-sm font-medium text-gray-500">Valor de Venda</h4>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {property.sale_value ? formatCurrency(property.sale_value) : '-'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <h4 className="text-sm font-medium text-gray-500">Comissão Total (5%)</h4>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {property.sale_value ? formatCurrency(property.sale_value * 0.05) : '-'}
                </p>
              </div>
            </div>

            {/* Responsible & Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <h4 className="text-sm font-medium text-gray-500">Responsável</h4>
                </div>
                <p className="text-sm text-gray-900">
                  {property.responsible_user_name || 'Não atribuído'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <h4 className="text-sm font-medium text-gray-500">Entrada</h4>
                </div>
                <p className="text-sm text-gray-900">
                  {format(new Date(property.created_at), "dd 'de' MMM, yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>

            {/* Status Icons */}
            <div className="flex gap-4">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                  property.has_creatives
                    ? 'bg-gray-100 text-gray-700 border-gray-200'
                    : 'bg-gray-50 text-gray-400 border-gray-100'
                }`}
              >
                <Image className="w-4 h-4" />
                <span className="text-xs">
                  {property.has_creatives ? 'Tem criativos' : 'Sem criativos'}
                </span>
              </div>
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                  property.has_proposal
                    ? 'bg-gray-100 text-gray-700 border-gray-200'
                    : 'bg-gray-50 text-gray-400 border-gray-100'
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
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Observações</h4>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{property.notes}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            {historyLoading ? (
              <div className="text-center py-8 text-gray-500">Carregando...</div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Nenhum histórico</div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 rounded-lg p-4 flex items-start gap-4 border border-gray-100"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <Clock className="w-4 h-4 text-gray-400" />
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
                            <ArrowRight className="w-3 h-3 text-gray-400" />
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
                      <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500">
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
                        <p className="text-xs text-gray-600 mt-2">{item.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Documentos em breve</p>
            </div>
          </TabsContent>

          <TabsContent value="commissions" className="mt-4">
            <CommissionsTab property={property} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
