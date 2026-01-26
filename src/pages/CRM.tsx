import { useState, useMemo, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useCrmProperties } from '@/hooks/useCrmProperties';
import { useCrmPermissions } from '@/hooks/useCrmPermissions';
import { useCrmReminders } from '@/hooks/useCrmReminders';
import {
  useStageCompletionRequirements,
  useAllPropertiesCompletionStatus,
} from '@/hooks/useStageCompletion';
import { KanbanBoard } from '@/components/crm/KanbanBoard';
import { CrmMetrics } from '@/components/crm/CrmMetrics';
import { CrmFilters } from '@/components/crm/CrmFilters';
import { AccountingModal } from '@/components/crm/AccountingModal';
import { PropertyDetailModal } from '@/components/crm/PropertyDetailModal';
import { PropertyFormModal } from '@/components/crm/PropertyFormModal';
import { EditPermissionsModal } from '@/components/crm/EditPermissionsModal';
import { ImagePreviewModal } from '@/components/crm/ImagePreviewModal';
import { RemindersPanel } from '@/components/crm/RemindersPanel';
import { ManagerOverviewPanel } from '@/components/crm/ManagerOverviewPanel';
import { ClientsTab } from '@/components/crm/clients/ClientsTab';
import { CrmProperty, PropertyStage } from '@/types/crm';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, LayoutDashboard, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export default function CRM() {
  const { isAdmin } = useAuth();
  const { canEditProperty } = useCrmPermissions();
  const {
    properties,
    isLoading,
    moveProperty,
    createProperty,
    updateProperty,
    deleteProperty,
  } = useCrmProperties();

  const {
    reminders,
    getReminderForProperty,
    handleStageChange,
    updateReminderInterval,
    snoozeReminder,
  } = useCrmReminders();

  // Stage completion system
  const { requirements } = useStageCompletionRequirements();
  const {
    getCompletionStatus,
    incompleteProperties,
    stats: completionStats,
  } = useAllPropertiesCompletionStatus(properties, requirements);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<PropertyStage | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedState, setSelectedState] = useState('');

  // Modals
  const [selectedProperty, setSelectedProperty] = useState<CrmProperty | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<CrmProperty | null>(null);
  const [deleteConfirmProperty, setDeleteConfirmProperty] = useState<CrmProperty | null>(null);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);

  // Image preview modal
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [isCoverPreviewOpen, setIsCoverPreviewOpen] = useState(false);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          property.code.toLowerCase().includes(query) ||
          property.city.toLowerCase().includes(query) ||
          property.neighborhood?.toLowerCase().includes(query) ||
          property.address?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Stage filter
      if (selectedStage !== 'all' && property.current_stage !== selectedStage) {
        return false;
      }

      // State filter
      if (selectedState && selectedState !== 'all' && property.state !== selectedState) {
        return false;
      }

      // User filter
      if (selectedUser && selectedUser !== 'all' && property.responsible_user_id !== selectedUser) {
        return false;
      }

      return true;
    });
  }, [properties, searchQuery, selectedStage, selectedUser, selectedState]);

  // Handle property move with reminder management
  const handleMoveProperty = useCallback(
    async (propertyId: string, fromStage: PropertyStage, toStage: PropertyStage) => {
      await moveProperty(propertyId, fromStage, toStage);
      // Handle reminder changes for the new stage
      await handleStageChange(propertyId, toStage);
    },
    [moveProperty, handleStageChange]
  );

  const handleCardClick = (property: CrmProperty) => {
    setSelectedProperty(property);
    setIsDetailOpen(true);
  };

  const handleAddProperty = () => {
    setEditingProperty(null);
    setIsFormOpen(true);
  };

  const handleEditProperty = (property: CrmProperty) => {
    // Check if user can edit
    if (!isAdmin && !canEditProperty(property.id)) {
      return; // Silently prevent edit if no permission
    }
    setIsDetailOpen(false);
    setEditingProperty(property);
    setIsFormOpen(true);
  };

  const handleDeleteProperty = (property: CrmProperty) => {
    setIsDetailOpen(false);
    setDeleteConfirmProperty(property);
  };

  const confirmDelete = async () => {
    if (deleteConfirmProperty) {
      await deleteProperty(deleteConfirmProperty.id);
      setDeleteConfirmProperty(null);
    }
  };

  const handleSaveProperty = async (data: Partial<CrmProperty>) => {
    if (editingProperty) {
      return await updateProperty(editingProperty.id, data);
    } else {
      return await createProperty(data);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#555]" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 min-h-screen bg-white">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <LayoutDashboard className="w-6 h-6 text-gray-700" />
              <h1 className="text-2xl font-semibold text-gray-900">CRM Imóveis</h1>
            </div>
            <p className="text-sm text-gray-500">
              Controle operacional de imóveis e comissões
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Manager Overview Panel */}
            {isAdmin && (
              <ManagerOverviewPanel
                incompleteProperties={incompleteProperties}
                stats={completionStats}
                onPropertyClick={(propertyId) => {
                  const prop = properties.find((p) => p.id === propertyId);
                  if (prop) {
                    setSelectedProperty(prop);
                    setIsDetailOpen(true);
                  }
                }}
              />
            )}

            {/* Reminders Panel */}
            <RemindersPanel
              reminders={reminders}
              properties={properties}
              onPropertyClick={handleCardClick}
              onSnooze={snoozeReminder}
            />

            {/* Accounting Modal */}
            <AccountingModal properties={properties} />
            
            {isAdmin && (
              <Button
                variant="outline"
                onClick={() => setIsPermissionsOpen(true)}
                className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <Shield className="w-4 h-4 mr-2" />
                Permissões
              </Button>
            )}
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="kanban" className="space-y-4">
          <TabsList className="bg-gray-100 border border-gray-200">
            <TabsTrigger 
              value="kanban" 
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 hover:bg-gray-200"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Kanban
            </TabsTrigger>
            <TabsTrigger 
              value="clientes" 
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 hover:bg-gray-200"
            >
              <Users className="w-4 h-4 mr-2" />
              Clientes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="space-y-4 mt-0">
            {/* Metrics Dashboard */}
            <CrmMetrics properties={properties} />

            {/* Filters */}
            <CrmFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedStage={selectedStage}
              onStageChange={setSelectedStage}
              selectedUser={selectedUser}
              onUserChange={setSelectedUser}
              selectedState={selectedState}
              onStateChange={setSelectedState}
              onAddProperty={handleAddProperty}
            />

            {/* Kanban Board */}
            <KanbanBoard
              properties={filteredProperties}
              onMoveProperty={handleMoveProperty}
              onCardClick={handleCardClick}
              onShowCover={(url) => {
                setCoverPreviewUrl(url);
                setIsCoverPreviewOpen(true);
              }}
              onShowProposal={(propertyId) => {
                const prop = properties.find(p => p.id === propertyId);
                if (prop) {
                  setSelectedProperty(prop);
                  setIsDetailOpen(true);
                }
              }}
              getReminderForProperty={getReminderForProperty}
              onUpdateReminderInterval={updateReminderInterval}
              onSnoozeReminder={snoozeReminder}
              getCompletionStatus={getCompletionStatus}
            />
          </TabsContent>

          <TabsContent value="clientes" className="mt-0">
            <ClientsTab />
          </TabsContent>
        </Tabs>

        {/* Detail Modal */}
        <PropertyDetailModal
          property={selectedProperty}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onEdit={handleEditProperty}
          onDelete={handleDeleteProperty}
          requirements={requirements}
        />

        {/* Form Modal */}
        <PropertyFormModal
          property={editingProperty}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveProperty}
        />

        {/* Edit Permissions Modal */}
        <EditPermissionsModal
          isOpen={isPermissionsOpen}
          onClose={() => setIsPermissionsOpen(false)}
        />

        {/* Image Preview Modal */}
        <ImagePreviewModal
          isOpen={isCoverPreviewOpen}
          onClose={() => setIsCoverPreviewOpen(false)}
          imageUrl={coverPreviewUrl}
          title="Capa do Imóvel"
        />

        {/* Delete Confirmation */}
        <AlertDialog
          open={!!deleteConfirmProperty}
          onOpenChange={() => setDeleteConfirmProperty(null)}
        >
          <AlertDialogContent className="bg-white border-gray-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900">
                Excluir imóvel?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Tem certeza que deseja excluir o imóvel{' '}
                <strong className="text-gray-900">{deleteConfirmProperty?.code}</strong>?
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
