import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CrmClient } from '@/types/client';
import { ClientDocumentsSection } from './ClientDocumentsSection';
import {
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Calendar,
  Edit,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientDetailModalProps {
  client: CrmClient | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (client: CrmClient) => void;
  onDelete: (client: CrmClient) => void;
}

export function ClientDetailModal({
  client,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: ClientDetailModalProps) {
  if (!client) return null;

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              {client.full_name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(client)}
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(client)}
                className="bg-white border-gray-300 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="dados" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 flex-shrink-0">
            <TabsTrigger value="dados" className="data-[state=active]:bg-white">
              Dados Pessoais
            </TabsTrigger>
            <TabsTrigger value="documentos" className="data-[state=active]:bg-white">
              Documentos
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="dados" className="mt-0 space-y-6">
              {/* Personal Data */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <User className="w-4 h-4" />
                  Identificação
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">CPF:</span>
                    <span className="ml-2 text-gray-900">{client.cpf || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">RG:</span>
                    <span className="ml-2 text-gray-900">{client.rg || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Nascimento:</span>
                    <span className="ml-2 text-gray-900">{formatDate(client.birth_date)}</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Phone className="w-4 h-4" />
                  Contato
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{client.email || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{client.phone || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-500" />
                    <span className="text-gray-900">{client.whatsapp || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <MapPin className="w-4 h-4" />
                  Endereço
                </h3>
                <div className="text-sm space-y-1">
                  <p className="text-gray-900">{client.address || '-'}</p>
                  <p className="text-gray-600">
                    {[client.neighborhood, client.city, client.state].filter(Boolean).join(', ') || '-'}
                  </p>
                  <p className="text-gray-500">CEP: {client.zip_code || '-'}</p>
                </div>
              </div>

              {/* Notes */}
              {client.notes && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 pb-2 border-b border-gray-200">
                    <FileText className="w-4 h-4" />
                    Observações
                  </h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{client.notes}</p>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Calendar className="w-3 h-3" />
                  Cadastrado em {format(new Date(client.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documentos" className="mt-0">
              <ClientDocumentsSection clientId={client.id} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
