import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Users, Plus, Search, UserCheck, UserX, Clock, 
  Percent, FileText, Eye, Trash2, Edit2, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/formatCurrency';
import { BrokerFormModal } from './BrokerFormModal';
import { BrokerDetailModal } from './BrokerDetailModal';

interface BrokerProfile {
  id: string;
  user_id: string | null;
  agency_id: string | null;
  commission_percentage: number;
  hired_at: string | null;
  status: 'active' | 'inactive' | 'pending';
  resume_url: string | null;
  contract_url: string | null;
  photo_url: string | null;
  creci_number: string | null;
  creci_state: string | null;
  specializations: string[] | null;
  created_at: string;
  updated_at: string;
  // Joined data
  profile?: {
    id: string;
    full_name: string;
    email: string;
    whatsapp: string | null;
    avatar_url: string | null;
  };
  questionnaire?: {
    motivation: string | null;
    experience_years: number | null;
    previous_experience: string | null;
    career_goals: string | null;
    monthly_sales_goal: number | null;
  };
}

export function BrokerManagement() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<BrokerProfile | null>(null);
  const [editingBroker, setEditingBroker] = useState<BrokerProfile | null>(null);

  // Fetch brokers with profiles
  const { data: brokers = [], isLoading } = useQuery({
    queryKey: ['broker-profiles'],
    queryFn: async () => {
      const { data: brokerData, error } = await supabase
        .from('broker_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Fetch related profiles
      const userIds = brokerData?.filter(b => b.user_id).map(b => b.user_id) || [];
      
      let profiles: any[] = [];
      if (userIds.length > 0) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, full_name, email, whatsapp, avatar_url')
          .in('id', userIds);
        profiles = profileData || [];
      }

      // Fetch questionnaires
      const brokerIds = brokerData?.map(b => b.id) || [];
      let questionnaires: any[] = [];
      if (brokerIds.length > 0) {
        const { data: questionnaireData } = await supabase
          .from('broker_questionnaire')
          .select('*')
          .in('broker_id', brokerIds);
        questionnaires = questionnaireData || [];
      }

      return (brokerData || []).map(broker => ({
        ...broker,
        profile: profiles.find(p => p.id === broker.user_id),
        questionnaire: questionnaires.find(q => q.broker_id === broker.id),
      })) as BrokerProfile[];
    },
  });

  // Fetch sales stats for each broker
  const { data: salesStats = {} } = useQuery({
    queryKey: ['broker-sales-stats'],
    queryFn: async () => {
      const { data: properties } = await supabase
        .from('crm_properties')
        .select('responsible_user_id, sale_value, current_stage')
        .in('current_stage', ['pago', 'comissao_liberada']);

      const stats: Record<string, { totalSales: number; count: number }> = {};
      (properties || []).forEach(p => {
        if (p.responsible_user_id) {
          if (!stats[p.responsible_user_id]) {
            stats[p.responsible_user_id] = { totalSales: 0, count: 0 };
          }
          stats[p.responsible_user_id].totalSales += p.sale_value || 0;
          stats[p.responsible_user_id].count++;
        }
      });
      return stats;
    },
  });

  // Delete broker mutation
  const deleteMutation = useMutation({
    mutationFn: async (brokerId: string) => {
      const { error } = await supabase
        .from('broker_profiles')
        .delete()
        .eq('id', brokerId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broker-profiles'] });
      toast.success('Corretor removido com sucesso');
    },
    onError: () => {
      toast.error('Erro ao remover corretor');
    },
  });

  const filteredBrokers = brokers.filter(broker => {
    const matchesSearch = 
      broker.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      broker.profile?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      broker.creci_number?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || broker.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-600 border-gray-200">Inativo</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Pendente</Badge>;
      default:
        return null;
    }
  };

  const handleOpenDetail = (broker: BrokerProfile) => {
    setSelectedBroker(broker);
    setIsDetailOpen(true);
  };

  const handleEdit = (broker: BrokerProfile) => {
    setEditingBroker(broker);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingBroker(null);
    setIsFormOpen(true);
  };

  const statsCount = {
    total: brokers.length,
    active: brokers.filter(b => b.status === 'active').length,
    inactive: brokers.filter(b => b.status === 'inactive').length,
    pending: brokers.filter(b => b.status === 'pending').length,
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-gold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Corretores Cadastrados
          </CardTitle>
          <Button size="sm" className="bg-gold hover:bg-gold-dark" onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Corretor
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setStatusFilter('all')}
            className={`p-3 rounded-lg border transition-all ${
              statusFilter === 'all' 
                ? 'bg-gold/10 border-gold/30' 
                : 'bg-surface border-border hover:border-gold/30'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-gold" />
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{statsCount.total}</p>
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`p-3 rounded-lg border transition-all ${
              statusFilter === 'active' 
                ? 'bg-emerald-50 border-emerald-300' 
                : 'bg-surface border-border hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs text-muted-foreground">Ativos</span>
            </div>
            <p className="text-lg font-semibold text-emerald-600">{statsCount.active}</p>
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`p-3 rounded-lg border transition-all ${
              statusFilter === 'pending' 
                ? 'bg-amber-50 border-amber-300' 
                : 'bg-surface border-border hover:border-amber-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-xs text-muted-foreground">Pendentes</span>
            </div>
            <p className="text-lg font-semibold text-amber-600">{statsCount.pending}</p>
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`p-3 rounded-lg border transition-all ${
              statusFilter === 'inactive' 
                ? 'bg-gray-100 border-gray-300' 
                : 'bg-surface border-border hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <UserX className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-muted-foreground">Inativos</span>
            </div>
            <p className="text-lg font-semibold text-gray-500">{statsCount.inactive}</p>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou CRECI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 input-premium"
          />
        </div>

        {/* Broker List */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-6 w-6 border-2 border-gold border-t-transparent rounded-full" />
          </div>
        ) : filteredBrokers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery || statusFilter !== 'all' 
              ? 'Nenhum corretor encontrado com os filtros aplicados'
              : 'Nenhum corretor cadastrado ainda'
            }
          </div>
        ) : (
          <div className="space-y-2">
            {filteredBrokers.map((broker) => {
              const stats = broker.user_id ? salesStats[broker.user_id] : null;
              
              return (
                <div
                  key={broker.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-surface border border-border hover:border-gold/30 transition-all group"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {broker.photo_url || broker.profile?.avatar_url ? (
                        <img 
                          src={broker.photo_url || broker.profile?.avatar_url || ''} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gold font-semibold text-lg">
                          {broker.profile?.full_name?.charAt(0) || '?'}
                        </span>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-foreground truncate">
                          {broker.profile?.full_name || 'Corretor sem usuário vinculado'}
                        </h3>
                        {getStatusBadge(broker.status)}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                        {broker.creci_number && (
                          <span>CRECI {broker.creci_number} {broker.creci_state}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Percent className="w-3 h-3" />
                          {broker.commission_percentage}% comissão
                        </span>
                        {stats && (
                          <span className="text-emerald-600 font-medium">
                            {stats.count} vendas • {formatCurrency(stats.totalSales)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {broker.resume_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(broker.resume_url!, '_blank')}
                        className="text-muted-foreground hover:text-gold"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDetail(broker)}
                      className="text-muted-foreground hover:text-gold"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(broker)}
                      className="text-muted-foreground hover:text-gold"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm('Tem certeza que deseja remover este corretor?')) {
                          deleteMutation.mutate(broker.id);
                        }
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Form Modal */}
        <BrokerFormModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingBroker(null);
          }}
          broker={editingBroker}
        />

        {/* Detail Modal */}
        <BrokerDetailModal
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedBroker(null);
          }}
          broker={selectedBroker}
          onEdit={() => {
            setIsDetailOpen(false);
            if (selectedBroker) {
              handleEdit(selectedBroker);
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
