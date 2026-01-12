import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useActivityLog } from '@/hooks/useActivityLog';
import { AppLayout } from '@/components/layout/AppLayout';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Calendar as CalendarIcon, 
  Grid3X3, 
  List, 
  Search, 
  Loader2,
  Building2,
  Trash2,
  Eye,
  Clock
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
}

export default function Library() {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedCreative, setSelectedCreative] = useState<Creative | null>(null);
  const { user } = useAuth();
  const { logActivity } = useActivityLog();

  useEffect(() => {
    if (user) {
      fetchCreatives();
    }
  }, [user]);

  const fetchCreatives = async () => {
    try {
      const { data, error } = await supabase
        .from('creatives')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Type assertion with proper handling
      const typedData = (data || []).map(item => ({
        ...item,
        property_data: item.property_data as unknown as PropertyData,
        photos: item.photos || [],
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
      const { error } = await supabase
        .from('creatives')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await logActivity('delete_creative', 'creative', id, { title: selectedCreative?.title });
      setCreatives(creatives.filter(c => c.id !== id));
      setSelectedCreative(null);
    } catch (error) {
      console.error('Error deleting creative:', error);
    }
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
                      onClick={() => setSelectedCreative(creative)}
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
                  onClick={() => setSelectedCreative(creative)}
                />
              ))
            )}
          </div>
        )}

        {/* Creative Detail Modal */}
        <Dialog open={!!selectedCreative} onOpenChange={() => setSelectedCreative(null)}>
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
                  <Clock className="w-4 h-4" />
                  Criado em {format(new Date(selectedCreative.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedCreative(null)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => deleteCreative(selectedCreative.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

function CreativeCard({ creative, onClick }: { creative: Creative; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="glass-card rounded-xl p-4 text-left hover:border-gold/30 transition-all group"
    >
      <div className="aspect-square bg-surface rounded-lg mb-3 flex items-center justify-center overflow-hidden">
        {creative.thumbnail_url ? (
          <img 
            src={creative.thumbnail_url} 
            alt={creative.title}
            className="w-full h-full object-cover"
          />
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
      <p className="text-xs text-muted-foreground mt-1">
        {format(new Date(creative.created_at), 'dd/MM/yyyy')}
      </p>
    </button>
  );
}
