import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CrmClient } from '@/types/client';
import { useCrmClients } from '@/hooks/useCrmClients';
import { ClientFormModal } from './ClientFormModal';
import { ClientDetailModal } from './ClientDetailModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Users,
  Plus,
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  Loader2,
} from 'lucide-react';

export function ClientsTab() {
  const { clients, isLoading, createClient, updateClient, deleteClient } = useCrmClients();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<CrmClient | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<CrmClient | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<CrmClient | null>(null);

  const filteredClients = clients.filter(client => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      client.full_name.toLowerCase().includes(query) ||
      client.cpf?.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query) ||
      client.phone?.toLowerCase().includes(query) ||
      client.city?.toLowerCase().includes(query)
    );
  });

  const handleClientClick = (client: CrmClient) => {
    setSelectedClient(client);
    setIsDetailOpen(true);
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setIsFormOpen(true);
  };

  const handleEditClient = (client: CrmClient) => {
    setIsDetailOpen(false);
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleDeleteClient = (client: CrmClient) => {
    setIsDetailOpen(false);
    setDeleteConfirm(client);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      await deleteClient(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const handleSaveClient = async (data: Partial<CrmClient>) => {
    if (editingClient) {
      return await updateClient(editingClient.id, data);
    } else {
      const newClient = await createClient(data);
      // After creating, open the detail modal so user can add documents
      if (newClient) {
        setIsFormOpen(false);
        setSelectedClient(newClient);
        setIsDetailOpen(true);
      }
      return newClient;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Clientes</h2>
          <span className="text-sm text-gray-500">({clients.length})</span>
        </div>
        <Button
          onClick={handleAddClient}
          className="bg-gray-900 text-white hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por nome, CPF, e-mail, telefone ou cidade..."
          className="pl-10 bg-white border-gray-300 text-gray-900"
        />
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchQuery ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
          </p>
          {!searchQuery && (
            <Button
              onClick={handleAddClient}
              variant="outline"
              className="mt-4 bg-white border-gray-300 text-gray-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar primeiro cliente
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              onClick={() => handleClientClick(client)}
              className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-gray-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-900 truncate">
                    {client.full_name}
                  </h3>
                  {client.cpf && (
                    <p className="text-sm text-gray-500">CPF: {client.cpf}</p>
                  )}
                </div>
              </div>

              <div className="mt-3 space-y-1.5">
                {client.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{client.phone}</span>
                  </div>
                )}
                {client.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.city && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{client.city}/{client.state}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <ClientDetailModal
        client={selectedClient}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
      />

      {/* Form Modal */}
      <ClientFormModal
        client={editingClient}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveClient}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-white border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Excluir cliente?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Tem certeza que deseja excluir <strong className="text-gray-900">{deleteConfirm?.full_name}</strong>?
              Todos os documentos do cliente também serão excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
