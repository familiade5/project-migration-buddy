import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useActivityLog } from '@/hooks/useActivityLog';
import { AppLayout } from '@/components/layout/AppLayout';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Calendar as CalendarIcon, 
  Grid3X3, 
  Search, 
  Loader2,
  Building2,
  Trash2,
  Eye,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  CheckSquare,
  Square
} from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { PropertyData } from '@/types/property';

interface Creative {
  id: string;
  title: string;
  property_data: PropertyData;
  photos: string[];
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  creator_name?: string;
  exported_images?: string[];
  format?: string;
}

export default function Library() {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedCreative, setSelectedCreative] = useState<Creative | null>(null);
  const [viewingPhotos, setViewingPhotos] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const { user, isAdmin } = useAuth();
  const { logActivity } = useActivityLog();
  
  // Multi-select state
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCreatives();
    }
  }, [user]);

  // Exit selection mode when no items selected
  useEffect(() => {
    if (selectionMode && selectedIds.size === 0) {
      // Keep selection mode active even with 0 selected
    }
  }, [selectedIds, selectionMode]);

  const fetchCreatives = async () => {
    try {
      const { data, error } = await supabase
        .from('creatives')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Fetch creator names from profiles
      const userIds = [...new Set((data || []).map(item => item.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);
      
      const profileMap = (profiles || []).reduce((acc, p) => {
        acc[p.id] = p.full_name;
        return acc;
      }, {} as Record<string, string>);
      
      // Type assertion with proper handling
      const typedData = (data || []).map(item => ({
        ...item,
        property_data: item.property_data as unknown as PropertyData,
        photos: item.photos || [],
        creator_name: profileMap[item.user_id] || 'Usuário desconhecido',
        exported_images: (item as any).exported_images || [],
        format: (item as any).format || 'feed',
      })) as Creative[];
      
      setCreatives(typedData);
    } catch (error) {
      console.error('Error fetching creatives:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCreative = async (id: string) => {
    try {
      const creativeToDelete = selectedCreative;
      
      // Delete from storage first (exported images)
      if (creativeToDelete?.exported_images && creativeToDelete.exported_images.length > 0) {
        const filesToDelete = creativeToDelete.exported_images.map(url => {
          const parts = url.split('/exported-creatives/');
          return parts[1] || '';
        }).filter(Boolean);
        
        if (filesToDelete.length > 0) {
          await supabase.storage
            .from('exported-creatives')
            .remove(filesToDelete);
        }
      }
      
      // Delete from database
      const { error, count } = await supabase
        .from('creatives')
        .delete()
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Delete error:', error);
        toast.error(`Erro ao excluir: ${error.message}`);
        return;
      }
      
      await logActivity('delete_creative', 'creative', id, { title: creativeToDelete?.title });
      
      // Update local state
      setCreatives(prev => prev.filter(c => c.id !== id));
      setSelectedCreative(null);
      toast.success('Criativo excluído com sucesso!');
      
    } catch (error: any) {
      console.error('Error deleting creative:', error);
      toast.error(`Erro ao excluir criativo: ${error.message || 'Tente novamente'}`);
    }
  };

  const deleteMultipleCreatives = async () => {
    if (selectedIds.size === 0) return;
    
    setIsDeleting(true);
    const idsToDelete = Array.from(selectedIds);
    const creativesToDelete = creatives.filter(c => idsToDelete.includes(c.id));
    
    try {
      // Collect all files to delete from storage
      const allFilesToDelete: string[] = [];
      creativesToDelete.forEach(creative => {
        if (creative.exported_images && creative.exported_images.length > 0) {
          creative.exported_images.forEach(url => {
            const parts = url.split('/exported-creatives/');
            if (parts[1]) {
              allFilesToDelete.push(parts[1]);
            }
          });
        }
      });
      
      // Delete from storage
      if (allFilesToDelete.length > 0) {
        await supabase.storage
          .from('exported-creatives')
          .remove(allFilesToDelete);
      }
      
      // Delete from database
      const { error } = await supabase
        .from('creatives')
        .delete()
        .in('id', idsToDelete);
      
      if (error) {
        console.error('Delete error:', error);
        toast.error(`Erro ao excluir: ${error.message}`);
        return;
      }
      
      // Log activity for each deletion
      for (const creative of creativesToDelete) {
        await logActivity('delete_creative', 'creative', creative.id, { title: creative.title, bulk_delete: true });
      }
      
      // Update local state
      setCreatives(prev => prev.filter(c => !idsToDelete.includes(c.id)));
      setSelectedIds(new Set());
      setSelectionMode(false);
      toast.success(`${idsToDelete.length} criativos excluídos com sucesso!`);
      
    } catch (error: any) {
      console.error('Error deleting creatives:', error);
      toast.error(`Erro ao excluir criativos: ${error.message || 'Tente novamente'}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredCreatives.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCreatives.map(c => c.id)));
    }
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const filteredCreatives = creatives.filter(creative => {
    const matchesSearch = creative.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creative.property_data?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creative.property_data?.neighborhood?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = selectedDate 
      ? isSameDay(new Date(creative.created_at), selectedDate)
      : true;
    
    return matchesSearch && matchesDate;
  });

  const creativesOnDates = creatives.reduce((acc, creative) => {
    const dateKey = format(new Date(creative.created_at), 'yyyy-MM-dd');
    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">Biblioteca</h1>
            <p className="text-muted-foreground">
              {creatives.length} criativos salvos
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Selection mode controls */}
            {isAdmin && (
              <>
                {selectionMode ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleSelectAll}
                      className="text-muted-foreground"
                    >
                      {selectedIds.size === filteredCreatives.length ? (
                        <CheckSquare className="w-4 h-4 mr-2" />
                      ) : (
                        <Square className="w-4 h-4 mr-2" />
                      )}
                      {selectedIds.size === filteredCreatives.length ? 'Desmarcar todos' : 'Selecionar todos'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={selectedIds.size === 0}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir ({selectedIds.size})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exitSelectionMode}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectionMode(true)}
                  >
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Selecionar
                  </Button>
                )}
              </>
            )}
            
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                className="pl-9 input-premium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex rounded-lg bg-surface p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-gold text-primary-foreground' : ''}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('calendar')}
                className={viewMode === 'calendar' ? 'bg-gold text-primary-foreground' : ''}
              >
                <CalendarIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : viewMode === 'calendar' ? (
          <div className="grid lg:grid-cols-[300px_1fr] gap-6">
            {/* Calendar */}
            <div className="glass-card rounded-2xl p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                className="w-full"
                modifiers={{
                  hasCreatives: (date) => {
                    const dateKey = format(date, 'yyyy-MM-dd');
                    return !!creativesOnDates[dateKey];
                  },
                }}
                modifiersClassNames={{
                  hasCreatives: 'bg-gold/20 text-gold font-semibold',
                }}
              />
              {selectedDate && (
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setSelectedDate(undefined)}
                >
                  Limpar filtro
                </Button>
              )}
            </div>

            {/* Creatives list */}
            <div className="space-y-4">
              {filteredCreatives.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Nenhum criativo encontrado
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedDate 
                      ? `Nenhum criativo em ${format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}`
                      : 'Comece criando seu primeiro post'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredCreatives.map((creative) => (
                    <CreativeCard
                      key={creative.id}
                      creative={creative}
                      onClick={() => !selectionMode && setSelectedCreative(creative)}
                      selectionMode={selectionMode}
                      isSelected={selectedIds.has(creative.id)}
                      onToggleSelect={() => toggleSelection(creative.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCreatives.length === 0 ? (
              <div className="col-span-full glass-card rounded-2xl p-12 text-center">
                <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nenhum criativo salvo
                </h3>
                <p className="text-muted-foreground">
                  Crie seu primeiro post para vê-lo aqui
                </p>
              </div>
            ) : (
              filteredCreatives.map((creative) => (
                <CreativeCard
                  key={creative.id}
                  creative={creative}
                  onClick={() => !selectionMode && setSelectedCreative(creative)}
                  selectionMode={selectionMode}
                  isSelected={selectedIds.has(creative.id)}
                  onToggleSelect={() => toggleSelection(creative.id)}
                />
              ))
            )}
          </div>
        )}

        {/* Creative Detail Modal */}
        <Dialog open={!!selectedCreative && !viewingPhotos} onOpenChange={() => setSelectedCreative(null)}>
          <DialogContent className="max-w-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                {selectedCreative?.title}
              </DialogTitle>
            </DialogHeader>
            
            {selectedCreative && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tipo:</span>
                    <span className="ml-2 text-foreground">{selectedCreative.property_data.type}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cidade:</span>
                    <span className="ml-2 text-foreground">{selectedCreative.property_data.city}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Bairro:</span>
                    <span className="ml-2 text-foreground">{selectedCreative.property_data.neighborhood}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valor:</span>
                    <span className="ml-2 text-foreground">{selectedCreative.property_data.minimumValue}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  Criado por: <span className="text-foreground font-medium">{selectedCreative.creator_name}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Criado em {format(new Date(selectedCreative.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => {
                      setCurrentPhotoIndex(0);
                      setViewingPhotos(true);
                    }}
                    disabled={!selectedCreative.exported_images || selectedCreative.exported_images.length === 0}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Posts ({selectedCreative.exported_images?.length || 0})
                  </Button>
                  {isAdmin && (
                    <Button 
                      variant="destructive" 
                      onClick={() => deleteCreative(selectedCreative.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Photo Viewer Modal - Shows Exported Posts */}
        <Dialog open={viewingPhotos} onOpenChange={() => setViewingPhotos(false)}>
          <DialogContent className="max-w-4xl w-[95vw] sm:w-full bg-black/95 border-border p-0 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="relative flex flex-col flex-1 overflow-hidden pt-12">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={() => setViewingPhotos(false)}
              >
                <X className="w-6 h-6" />
              </Button>
              
              {/* Header with format info */}
              {selectedCreative?.exported_images && selectedCreative.exported_images.length > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                  Post {currentPhotoIndex + 1} de {selectedCreative.exported_images.length}
                  {selectedCreative.format && ` • ${selectedCreative.format === 'both' ? 'Feed + Story' : selectedCreative.format.toUpperCase()}`}
                </div>
              )}
              
              {selectedCreative?.exported_images && selectedCreative.exported_images.length > 0 && (
                <div className="relative flex items-center justify-center flex-1 px-2 sm:px-8 py-4">
                  <img
                    src={selectedCreative.exported_images[currentPhotoIndex]}
                    alt={`Post exportado ${currentPhotoIndex + 1}`}
                    className="max-w-full max-h-[60vh] sm:max-h-[70vh] object-contain rounded-lg shadow-2xl"
                  />
                  
                  {selectedCreative.exported_images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-1 sm:left-4 text-white hover:bg-white/20 h-10 w-10 sm:h-12 sm:w-12"
                        onClick={() => setCurrentPhotoIndex(prev => 
                          prev === 0 ? selectedCreative.exported_images!.length - 1 : prev - 1
                        )}
                      >
                        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 sm:right-4 text-white hover:bg-white/20 h-10 w-10 sm:h-12 sm:w-12"
                        onClick={() => setCurrentPhotoIndex(prev => 
                          prev === selectedCreative.exported_images!.length - 1 ? 0 : prev + 1
                        )}
                      >
                        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                      </Button>
                    </>
                  )}
                </div>
              )}
              
              {/* Thumbnail navigation */}
              {selectedCreative?.exported_images && selectedCreative.exported_images.length > 1 && (
                <div className="flex justify-center gap-2 pb-4 overflow-x-auto px-4">
                  {selectedCreative.exported_images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
                        index === currentPhotoIndex ? 'border-gold scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Bulk Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão em massa</AlertDialogTitle>
              <AlertDialogDescription>
                Você está prestes a excluir <strong>{selectedIds.size}</strong> criativos. 
                Esta ação não pode ser desfeita. Todos os posts exportados também serão removidos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteMultipleCreatives}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir {selectedIds.size} criativos
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}

interface CreativeCardProps {
  creative: Creative;
  onClick: () => void;
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

function CreativeCard({ creative, onClick, selectionMode, isSelected, onToggleSelect }: CreativeCardProps) {
  // Use exported image as thumbnail, fallback to thumbnail_url, then original photos
  const thumbnailSrc = creative.exported_images?.[0] || creative.thumbnail_url || creative.photos?.[0];
  const exportCount = creative.exported_images?.length || 0;
  
  const handleClick = () => {
    if (selectionMode && onToggleSelect) {
      onToggleSelect();
    } else {
      onClick();
    }
  };
  
  return (
    <button
      onClick={handleClick}
      className={`glass-card rounded-xl p-4 text-left hover:border-gold/30 transition-all group relative ${
        isSelected ? 'ring-2 ring-gold border-gold/50' : ''
      }`}
    >
      {/* Selection checkbox */}
      {selectionMode && (
        <div 
          className="absolute top-2 left-2 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect?.();
          }}
        >
          <Checkbox 
            checked={isSelected} 
            className="h-5 w-5 border-2 bg-background/80 backdrop-blur-sm"
          />
        </div>
      )}
      
      <div className="aspect-square bg-surface rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
        {thumbnailSrc ? (
          <>
            <img 
              src={thumbnailSrc} 
              alt={creative.title}
              className="w-full h-full object-cover"
            />
            {exportCount > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                {exportCount} posts
              </div>
            )}
          </>
        ) : (
          <Building2 className="w-10 h-10 text-muted-foreground" />
        )}
      </div>
      <h3 className="font-medium text-foreground truncate group-hover:text-gold transition-colors">
        {creative.title}
      </h3>
      <p className="text-sm text-muted-foreground">
        {creative.property_data.city} - {creative.property_data.neighborhood}
      </p>
      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
        <User className="w-3 h-3" />
        <span className="truncate">{creative.creator_name}</span>
      </div>
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-muted-foreground">
          {format(new Date(creative.created_at), 'dd/MM/yyyy')}
        </p>
        {creative.format && (
          <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full">
            {creative.format === 'both' ? 'Feed + Story' : creative.format}
          </span>
        )}
      </div>
    </button>
  );
}
