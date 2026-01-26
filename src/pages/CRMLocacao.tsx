import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useRentalContracts } from '@/hooks/useRentalContracts';
import { useRentalPayments } from '@/hooks/useRentalPayments';
import { useRentalAlerts } from '@/hooks/useRentalAlerts';
import { useRentalMetrics } from '@/hooks/useRentalMetrics';
import { useRentalProperties } from '@/hooks/useRentalProperties';
import { useRentalOwners } from '@/hooks/useRentalOwners';
import { useRentalTenants } from '@/hooks/useRentalTenants';
import { useAuth } from '@/contexts/AuthContext';
import { useModuleActivity } from '@/hooks/useModuleActivity';
import { RentalContract, RentalPayment } from '@/types/rental';
import { RentalProperty, RentalPropertyStage } from '@/types/rentalProperty';

import { RentalDashboardMetrics } from '@/components/crm-rental/RentalDashboardMetrics';
import { RentalContractCard } from '@/components/crm-rental/RentalContractCard';
import { RentalPaymentCalendar } from '@/components/crm-rental/RentalPaymentCalendar';
import { RentalAlertsPanel } from '@/components/crm-rental/RentalAlertsPanel';
import { RentalContractFormModal } from '@/components/crm-rental/RentalContractFormModal';
import { RentalContractDetailModal } from '@/components/crm-rental/RentalContractDetailModal';
import { RentalPaymentModal } from '@/components/crm-rental/RentalPaymentModal';
import { RentalManagerOverview } from '@/components/crm-rental/RentalManagerOverview';
import { RentalPropertyKanbanBoard } from '@/components/crm-rental/RentalPropertyKanbanBoard';
import { RentalPropertyFormModal } from '@/components/crm-rental/RentalPropertyFormModal';
import { RentalOwnerFormModal } from '@/components/crm-rental/RentalOwnerFormModal';
import { RentalTenantFormModal } from '@/components/crm-rental/RentalTenantFormModal';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Building2, 
  Plus, 
  Search, 
  Calendar,
  LayoutGrid,
  Users,
  Loader2,
  Filter,
  Home,
  UserCircle,
  FileText,
  Pencil,
  Trash2,
  Phone,
  Mail,
} from 'lucide-react';

export default function CRMLocacao() {
  // Log module access
  useModuleActivity('CRM Locação');
  
  const { isAdmin } = useAuth();
  const { 
    contracts, 
    isLoading: contractsLoading, 
    createContract, 
    updateContract, 
    deleteContract 
  } = useRentalContracts();
  
  const { 
    payments, 
    isLoading: paymentsLoading, 
    generatePaymentsForContract,
    updatePayment,
    markAsPaid,
  } = useRentalPayments();

  const {
    properties,
    isLoading: propertiesLoading,
    moveProperty,
  } = useRentalProperties();

  const { owners, isLoading: ownersLoading, deleteOwner } = useRentalOwners();
  const { tenants, isLoading: tenantsLoading, deleteTenant } = useRentalTenants();

  const { alerts, alertsByType } = useRentalAlerts(payments, contracts);
  const metrics = useRentalMetrics(contracts, payments);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [isContractFormOpen, setIsContractFormOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<RentalContract | null>(null);
  const [viewingContract, setViewingContract] = useState<RentalContract | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<RentalPayment | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [deleteConfirmContract, setDeleteConfirmContract] = useState<RentalContract | null>(null);
  
  // Property modals
  const [isPropertyFormOpen, setIsPropertyFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<RentalProperty | null>(null);
  
  // Owner/Tenant modals
  const [isOwnerFormOpen, setIsOwnerFormOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<any>(null);
  const [isTenantFormOpen, setIsTenantFormOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<any>(null);

  // Filter contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter((contract) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          contract.property_code.toLowerCase().includes(query) ||
          contract.property_address.toLowerCase().includes(query) ||
          contract.owner_name.toLowerCase().includes(query) ||
          contract.tenant?.full_name?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      if (statusFilter !== 'all' && contract.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [contracts, searchQuery, statusFilter]);

  // Get payment stats for each contract
  const getContractPaymentStats = (contractId: string) => {
    const contractPayments = payments.filter(p => p.contract_id === contractId);
    return {
      overdueCount: contractPayments.filter(p => p.status === 'overdue').length,
      pendingCount: contractPayments.filter(p => p.status === 'pending').length,
    };
  };

  // Handlers
  const handleAddContract = () => {
    setEditingContract(null);
    setIsContractFormOpen(true);
  };

  const handleViewContract = (contract: RentalContract) => {
    setViewingContract(contract);
    setIsDetailModalOpen(true);
  };

  const handleSaveContract = async (data: Partial<RentalContract>) => {
    if (editingContract) {
      await updateContract(editingContract.id, data);
    } else {
      const newContract = await createContract(data);
      if (newContract) {
        await generatePaymentsForContract(newContract as RentalContract);
      }
    }
    return true;
  };

  const confirmDelete = async () => {
    if (deleteConfirmContract) {
      await deleteContract(deleteConfirmContract.id);
      setDeleteConfirmContract(null);
    }
  };

  const handlePaymentClick = (payment: RentalPayment) => {
    setSelectedPayment(payment);
    setIsPaymentModalOpen(true);
  };

  const handleMarkAsPaid = async (payment: RentalPayment) => {
    setSelectedPayment(payment);
    setIsPaymentModalOpen(true);
  };

  const handleAlertClick = (alert: any) => {
    setSelectedPayment(alert.payment);
    setIsPaymentModalOpen(true);
  };

  const handleMoveProperty = (propertyId: string, fromStage: RentalPropertyStage, toStage: RentalPropertyStage) => {
    moveProperty.mutate({ propertyId, fromStage, toStage });
  };

  const handlePropertyClick = (property: RentalProperty) => {
    setEditingProperty(property);
    setIsPropertyFormOpen(true);
  };

  const handleAddProperty = () => {
    setEditingProperty(null);
    setIsPropertyFormOpen(true);
  };

  const isLoading = contractsLoading || paymentsLoading || propertiesLoading || ownersLoading || tenantsLoading;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh] bg-white">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-white p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Building2 className="w-6 h-6 text-gray-800" />
              <h1 className="text-2xl font-semibold text-gray-900">CRM Locação</h1>
            </div>
            <p className="text-sm text-gray-500">
              Gestão completa de imóveis, contratos e pagamentos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RentalAlertsPanel
              alerts={alerts}
              alertsByType={alertsByType}
              onAlertClick={handleAlertClick}
            />
          </div>
        </div>

        {/* Metrics Dashboard */}
        <RentalDashboardMetrics metrics={metrics} />

        {/* Main Tabs */}
        <Tabs defaultValue="imoveis" className="mt-6">
          <TabsList className="bg-gray-100 border border-gray-200">
            <TabsTrigger 
              value="imoveis" 
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Imóveis
            </TabsTrigger>
            <TabsTrigger 
              value="contracts" 
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Contratos
            </TabsTrigger>
            <TabsTrigger 
              value="calendar" 
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Calendário
            </TabsTrigger>
            <TabsTrigger 
              value="cadastros" 
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Cadastros
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger 
                value="manager" 
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
                Gerencial
              </TabsTrigger>
            )}
          </TabsList>

          {/* Properties/Imóveis Tab - Kanban */}
          <TabsContent value="imoveis" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Kanban de Imóveis</h2>
              {isAdmin && (
                <Button onClick={handleAddProperty} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Novo Imóvel
                </Button>
              )}
            </div>
            
            <RentalPropertyKanbanBoard
              properties={properties}
              onMoveProperty={handleMoveProperty}
              onCardClick={handlePropertyClick}
            />
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="mt-4 space-y-4">
            {/* Filters */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 flex-wrap flex-1">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por código, endereço, proprietário..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="ending_soon">Vencendo</SelectItem>
                    <SelectItem value="expired">Vencidos</SelectItem>
                    <SelectItem value="terminated">Encerrados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {isAdmin && (
                <Button onClick={handleAddContract} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Novo Contrato
                </Button>
              )}
            </div>

            {/* Contracts Grid */}
            {filteredContracts.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Nenhum contrato encontrado
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Tente ajustar os filtros'
                    : 'Comece cadastrando seu primeiro contrato de locação'}
                </p>
                {isAdmin && !searchQuery && statusFilter === 'all' && (
                  <Button onClick={handleAddContract} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Novo Contrato
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContracts.map((contract) => {
                  const stats = getContractPaymentStats(contract.id);
                  return (
                    <RentalContractCard
                      key={contract.id}
                      contract={contract}
                      overdueCount={stats.overdueCount}
                      pendingCount={stats.pendingCount}
                      onClick={() => handleViewContract(contract)}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="mt-4">
            <RentalPaymentCalendar
              payments={payments}
              contracts={contracts}
              onPaymentClick={handlePaymentClick}
              onMarkAsPaid={handleMarkAsPaid}
            />
          </TabsContent>

          {/* Cadastros Tab */}
          <TabsContent value="cadastros" className="mt-4 space-y-6">
            {/* Proprietários */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCircle className="w-5 h-5" />
                  Proprietários
                </CardTitle>
                {isAdmin && (
                  <Button size="sm" onClick={() => { setEditingOwner(null); setIsOwnerFormOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {owners.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhum proprietário cadastrado
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>CPF/CNPJ</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>PIX</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {owners.map((owner) => (
                        <TableRow key={owner.id}>
                          <TableCell className="font-medium">{owner.full_name}</TableCell>
                          <TableCell>{owner.cpf || '-'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {owner.phone && <Phone className="w-3 h-3" />}
                              {owner.email && <Mail className="w-3 h-3" />}
                              {owner.phone || owner.email || '-'}
                            </div>
                          </TableCell>
                          <TableCell>{owner.pix_key || '-'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => { setEditingOwner(owner); setIsOwnerFormOpen(true); }}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              {isAdmin && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteOwner.mutate(owner.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Inquilinos */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Inquilinos
                </CardTitle>
                {isAdmin && (
                  <Button size="sm" onClick={() => { setEditingTenant(null); setIsTenantFormOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {tenants.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhum inquilino cadastrado
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>CPF</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Profissão</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tenants.map((tenant) => (
                        <TableRow key={tenant.id}>
                          <TableCell className="font-medium">{tenant.full_name}</TableCell>
                          <TableCell>{tenant.cpf || '-'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {tenant.phone && <Phone className="w-3 h-3" />}
                              {tenant.email && <Mail className="w-3 h-3" />}
                              {tenant.phone || tenant.email || '-'}
                            </div>
                          </TableCell>
                          <TableCell>{tenant.profession || '-'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => { setEditingTenant(tenant); setIsTenantFormOpen(true); }}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              {isAdmin && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteTenant.mutate(tenant.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manager Tab */}
          {isAdmin && (
            <TabsContent value="manager" className="mt-4">
              <RentalManagerOverview metrics={metrics} />
            </TabsContent>
          )}
        </Tabs>

        {/* Modals */}
        <RentalContractDetailModal
          contract={viewingContract}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setViewingContract(null);
          }}
        />

        <RentalContractFormModal
          contract={editingContract}
          isOpen={isContractFormOpen}
          onClose={() => setIsContractFormOpen(false)}
          onSave={handleSaveContract}
        />

        <RentalPaymentModal
          payment={selectedPayment}
          propertyCode={contracts.find(c => c.id === selectedPayment?.contract_id)?.property_code}
          tenantName={contracts.find(c => c.id === selectedPayment?.contract_id)?.tenant?.full_name}
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedPayment(null);
          }}
          onSave={async (id, data) => {
            await updatePayment(id, data);
          }}
          onMarkAsPaid={async (id, amount, method, proofUrl) => {
            await markAsPaid(id, amount, method, proofUrl);
          }}
        />

        <RentalPropertyFormModal
          open={isPropertyFormOpen}
          onOpenChange={setIsPropertyFormOpen}
          property={editingProperty}
        />

        <RentalOwnerFormModal
          open={isOwnerFormOpen}
          onOpenChange={setIsOwnerFormOpen}
          owner={editingOwner}
        />

        <RentalTenantFormModal
          open={isTenantFormOpen}
          onOpenChange={setIsTenantFormOpen}
          tenant={editingTenant}
        />

        {/* Delete Confirmation */}
        <AlertDialog
          open={!!deleteConfirmContract}
          onOpenChange={() => setDeleteConfirmContract(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir contrato?</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o contrato{' '}
                <strong>{deleteConfirmContract?.property_code}</strong>?
                Todos os pagamentos vinculados também serão excluídos.
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
