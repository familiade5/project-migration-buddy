import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useCrmProperties } from '@/hooks/useCrmProperties';
import { KanbanBoard } from '@/components/crm/KanbanBoard';
import { CrmMetrics } from '@/components/crm/CrmMetrics';
import { CrmFilters } from '@/components/crm/CrmFilters';
import { PropertyDetailModal } from '@/components/crm/PropertyDetailModal';
import { PropertyFormModal } from '@/components/crm/PropertyFormModal';
import { CrmProperty, PropertyStage } from '@/types/crm';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, LayoutDashboard } from 'lucide-react';
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
  const {
    properties,
    isLoading,
    moveProperty,
    createProperty,
    updateProperty,
    deleteProperty,
  } = useCrmProperties();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<PropertyStage | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState('');

  // Modals
  const [selectedProperty, setSelectedProperty] = useState<CrmProperty | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<CrmProperty | null>(null);
  const [deleteConfirmProperty, setDeleteConfirmProperty] = useState<CrmProperty | null>(null);

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

      // User filter
      if (selectedUser && selectedUser !== 'all' && property.responsible_user_id !== selectedUser) {
        return false;
      }

      return true;
    });
  }, [properties, searchQuery, selectedStage, selectedUser]);

  const handleCardClick = (property: CrmProperty) => {
    setSelectedProperty(property);
    setIsDetailOpen(true);
  };

  const handleAddProperty = () => {
    setEditingProperty(null);
    setIsFormOpen(true);
  };

  const handleEditProperty = (property: CrmProperty) => {
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
      <div className="p-6 min-h-screen bg-[#080808]">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <LayoutDashboard className="w-6 h-6 text-[#3b82f6]" />
            <h1 className="text-2xl font-semibold text-[#e0e0e0]">CRM Imóveis</h1>
          </div>
          <p className="text-sm text-[#666]">
            Controle operacional de imóveis e comissões
          </p>
        </div>

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
          onAddProperty={handleAddProperty}
        />

        {/* Kanban Board */}
        <KanbanBoard
          properties={filteredProperties}
          onMoveProperty={moveProperty}
          onCardClick={handleCardClick}
        />

        {/* Detail Modal */}
        <PropertyDetailModal
          property={selectedProperty}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onEdit={handleEditProperty}
          onDelete={handleDeleteProperty}
        />

        {/* Form Modal */}
        <PropertyFormModal
          property={editingProperty}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveProperty}
        />

        {/* Delete Confirmation */}
        <AlertDialog
          open={!!deleteConfirmProperty}
          onOpenChange={() => setDeleteConfirmProperty(null)}
        >
          <AlertDialogContent className="bg-[#0d0d0d] border-[#1a1a1a]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#e0e0e0]">
                Excluir imóvel?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#888]">
                Tem certeza que deseja excluir o imóvel{' '}
                <strong className="text-[#e0e0e0]">{deleteConfirmProperty?.code}</strong>?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-[#2a2a2a] text-[#888] hover:bg-[#1a1a1a] hover:text-[#e0e0e0]">
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
