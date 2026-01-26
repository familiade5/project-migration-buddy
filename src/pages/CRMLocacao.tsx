import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useRentalContracts } from '@/hooks/useRentalContracts';
import { useRentalPayments } from '@/hooks/useRentalPayments';
import { useRentalAlerts } from '@/hooks/useRentalAlerts';
import { useRentalMetrics } from '@/hooks/useRentalMetrics';
import { useAuth } from '@/contexts/AuthContext';
import { useModuleActivity } from '@/hooks/useModuleActivity';
import { RentalContract, RentalPayment } from '@/types/rental';

import { RentalDashboardMetrics } from '@/components/crm-rental/RentalDashboardMetrics';
import { RentalContractCard } from '@/components/crm-rental/RentalContractCard';
import { RentalPaymentCalendar } from '@/components/crm-rental/RentalPaymentCalendar';
import { RentalAlertsPanel } from '@/components/crm-rental/RentalAlertsPanel';
import { RentalContractFormModal } from '@/components/crm-rental/RentalContractFormModal';
import { RentalPaymentModal } from '@/components/crm-rental/RentalPaymentModal';
import { RentalManagerOverview } from '@/components/crm-rental/RentalManagerOverview';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Settings,
  Filter,
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

  const { alerts, alertsByType } = useRentalAlerts(payments, contracts);
  const metrics = useRentalMetrics(contracts, payments);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [isContractFormOpen, setIsContractFormOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<RentalContract | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<RentalPayment | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [deleteConfirmContract, setDeleteConfirmContract] = useState<RentalContract | null>(null);

  // Filter contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter((contract) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          contract.property_code.toLowerCase().includes(query) ||
          contract.property_address.toLowerCase().includes(query) ||
          contract.owner_name.toLowerCase().includes(query) ||
          contract.tenant?.full_name?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Status filter
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

  const handleEditContract = (contract: RentalContract) => {
    setEditingContract(contract);
    setIsContractFormOpen(true);
  };

  const handleSaveContract = async (data: Partial<RentalContract>) => {
    if (editingContract) {
      await updateContract(editingContract.id, data);
    } else {
      const newContract = await createContract(data);
      // Generate payments for new contract
      if (newContract) {
        await generatePaymentsForContract(newContract as RentalContract);
      }
    }
    return true;
  };

  const handleDeleteContract = (contract: RentalContract) => {
    setDeleteConfirmContract(contract);
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

  const isLoading = contractsLoading || paymentsLoading;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh] bg-white">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
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
              <Building2 className="w-6 h-6 text-gray-700" />
              <h1 className="text-2xl font-semibold text-gray-900">CRM Locação</h1>
            </div>
            <p className="text-sm text-gray-500">
              Gestão de contratos, pagamentos e inadimplência
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RentalAlertsPanel
              alerts={alerts}
              alertsByType={alertsByType}
              onAlertClick={handleAlertClick}
            />
            
            {isAdmin && (
              <Button
                onClick={handleAddContract}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Contrato
              </Button>
            )}
          </div>
        </div>

        {/* Metrics Dashboard */}
        <RentalDashboardMetrics metrics={metrics} />

        {/* Main Tabs */}
        <Tabs defaultValue="contracts" className="mt-6">
          <TabsList className="bg-gray-100 border border-gray-200">
            <TabsTrigger 
              value="contracts" 
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 hover:bg-gray-200"
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Contratos
            </TabsTrigger>
            <TabsTrigger 
              value="calendar" 
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 hover:bg-gray-200"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Calendário
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger 
                value="manager" 
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 hover:bg-gray-200"
              >
                <Users className="w-4 h-4 mr-2" />
                Gerencial
              </TabsTrigger>
            )}
          </TabsList>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="mt-4 space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por código, endereço, proprietário..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-white border-gray-200 text-gray-900">
                  <Filter className="w-4 h-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="ending_soon">Vencendo</SelectItem>
                  <SelectItem value="expired">Vencidos</SelectItem>
                  <SelectItem value="terminated">Encerrados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contracts Grid */}
            {filteredContracts.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum contrato encontrado
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Tente ajustar os filtros'
                    : 'Comece cadastrando seu primeiro contrato de locação'}
                </p>
                {isAdmin && !searchQuery && statusFilter === 'all' && (
                  <Button
                    onClick={handleAddContract}
                    className="bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
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
                      onClick={() => handleEditContract(contract)}
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

          {/* Manager Tab */}
          {isAdmin && (
            <TabsContent value="manager" className="mt-4">
              <RentalManagerOverview metrics={metrics} />
            </TabsContent>
          )}
        </Tabs>

        {/* Contract Form Modal */}
        <RentalContractFormModal
          contract={editingContract}
          isOpen={isContractFormOpen}
          onClose={() => setIsContractFormOpen(false)}
          onSave={handleSaveContract}
        />

        {/* Payment Modal */}
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

        {/* Delete Confirmation */}
        <AlertDialog
          open={!!deleteConfirmContract}
          onOpenChange={() => setDeleteConfirmContract(null)}
        >
          <AlertDialogContent className="bg-white border-gray-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900">
                Excluir contrato?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Tem certeza que deseja excluir o contrato{' '}
                <strong className="text-gray-900">{deleteConfirmContract?.property_code}</strong>?
                Todos os pagamentos vinculados também serão excluídos.
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900">
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
    </AppLayout>
  );
}
