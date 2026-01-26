import { RentalContract } from '@/types/rental';
import { formatCurrency } from '@/lib/formatCurrency';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  FileText,
  DollarSign,
  Upload,
  Send,
  Pencil,
} from 'lucide-react';
import { RentalContractDocumentsSection } from './RentalContractDocumentsSection';
import { RentalContractGeneratorInline } from './RentalContractGeneratorInline';
import { Button } from '@/components/ui/button';

interface RentalContractDetailModalProps {
  contract: RentalContract | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (contract: RentalContract) => void;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: 'Ativo', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  ending_soon: { label: 'Vencendo', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  expired: { label: 'Vencido', color: 'bg-red-100 text-red-700 border-red-200' },
  terminated: { label: 'Rescindido', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  renewed: { label: 'Renovado', color: 'bg-blue-100 text-blue-700 border-blue-200' },
};

export function RentalContractDetailModal({ 
  contract, 
  isOpen, 
  onClose,
  onEdit,
}: RentalContractDetailModalProps) {
  if (!contract) return null;

  const status = statusLabels[contract.status] || statusLabels.active;
  const totalMonthly = (contract.rent_value || 0) + (contract.condominium_fee || 0) + 
    (contract.iptu_value || 0) + (contract.other_fees || 0);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-gray-700" />
                <span>{contract.property_code}</span>
                <Badge className={`${status.color} border`}>
                  {status.label}
                </Badge>
              </div>

              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
                  onClick={() => onEdit(contract)}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="info" className="mt-4">
            <TabsList className="bg-gray-100 border border-gray-200">
              <TabsTrigger 
                value="info" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Dados
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900"
              >
                <Upload className="w-4 h-4 mr-2" />
                Documentos
              </TabsTrigger>
              <TabsTrigger 
                value="contract" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900"
              >
                <Send className="w-4 h-4 mr-2" />
                Gerar Contrato
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[500px] mt-4 pr-4">
              {/* Info Tab */}
              <TabsContent value="info" className="mt-0 space-y-6">
                {/* Property Info */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Imóvel
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Tipo:</span>
                      <p className="font-medium">{contract.property_type}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Endereço:</span>
                      <p className="font-medium">{contract.property_address}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Bairro:</span>
                      <p className="font-medium">{contract.property_neighborhood || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Cidade/UF:</span>
                      <p className="font-medium">{contract.property_city}/{contract.property_state}</p>
                    </div>
                  </div>
                </div>

                {/* Owner & Tenant */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-semibold mb-3">Proprietário</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Nome:</span> {contract.owner_name}</p>
                      <p><span className="text-gray-500">Telefone:</span> {contract.owner_phone || '-'}</p>
                      <p><span className="text-gray-500">E-mail:</span> {contract.owner_email || '-'}</p>
                      <p><span className="text-gray-500">PIX:</span> {contract.owner_pix_key || '-'}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-semibold mb-3">Inquilino</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Nome:</span> {contract.tenant?.full_name || '-'}</p>
                      <p><span className="text-gray-500">CPF:</span> {contract.tenant?.cpf || '-'}</p>
                      <p><span className="text-gray-500">Telefone:</span> {contract.tenant?.phone || '-'}</p>
                      <p><span className="text-gray-500">E-mail:</span> {contract.tenant?.email || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Financial */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Financeiro
                  </h3>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Aluguel:</span>
                      <p className="font-medium">{formatCurrency(contract.rent_value)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Condomínio:</span>
                      <p className="font-medium">{formatCurrency(contract.condominium_fee || 0)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">IPTU:</span>
                      <p className="font-medium">{formatCurrency(contract.iptu_value || 0)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Outras Taxas:</span>
                      <p className="font-medium">{formatCurrency(contract.other_fees || 0)}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Total Mensal:</span>
                    <span className="text-xl font-bold text-emerald-600">
                      {formatCurrency(totalMonthly)}
                    </span>
                  </div>
                </div>

                {/* Contract Details */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Contrato
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Início:</span>
                      <p className="font-medium">
                        {new Date(contract.start_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Término:</span>
                      <p className="font-medium">
                        {new Date(contract.end_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Vencimento:</span>
                      <p className="font-medium">Dia {contract.payment_due_day}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Garantia:</span>
                      <p className="font-medium">{contract.guarantee_type || 'Caução'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Valor Caução:</span>
                      <p className="font-medium">{formatCurrency(contract.deposit_value || 0)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Taxa Adm.:</span>
                      <p className="font-medium">{contract.management_fee_percentage || 10}%</p>
                    </div>
                  </div>
                </div>

                {contract.notes && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-semibold mb-2">Observações</h3>
                    <p className="text-sm text-gray-600">{contract.notes}</p>
                  </div>
                )}
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="mt-0">
                <RentalContractDocumentsSection contract={contract} />
              </TabsContent>

              {/* Contract Generator Tab */}
              <TabsContent value="contract" className="mt-0">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Geração de Contrato</h3>
                    <p className="text-sm text-blue-700">
                      Gere o contrato de locação em PDF, imprima ou envie para assinatura digital via Autentique.
                      O documento assinado será arquivado automaticamente.
                    </p>
                  </div>

                  <RentalContractGeneratorInline contract={contract} />
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
