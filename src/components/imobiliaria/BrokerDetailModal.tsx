import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, Briefcase, Target, FileText, Calendar, Percent, 
  Phone, Mail, MapPin, Award, TrendingUp, Edit2, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/formatCurrency';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BrokerProfile {
  id: string;
  user_id: string | null;
  commission_percentage: number;
  hired_at: string | null;
  status: 'active' | 'inactive' | 'pending';
  resume_url: string | null;
  creci_number: string | null;
  creci_state: string | null;
  specializations: string[] | null;
  created_at: string;
  profile?: {
    id: string;
    full_name: string;
    email: string;
    whatsapp: string | null;
    avatar_url: string | null;
  };
  questionnaire?: any;
}

interface BrokerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  broker: BrokerProfile | null;
  onEdit: () => void;
}

const specializationLabels: Record<string, string> = {
  residential: 'Residencial',
  commercial: 'Comercial',
  rural: 'Rural',
  luxury: 'Alto Padrão',
  rental: 'Locação',
};

export function BrokerDetailModal({ isOpen, onClose, broker, onEdit }: BrokerDetailModalProps) {
  // Fetch questionnaire if not loaded
  const { data: questionnaire } = useQuery({
    queryKey: ['broker-questionnaire', broker?.id],
    queryFn: async () => {
      if (!broker?.id) return null;
      const { data, error } = await supabase
        .from('broker_questionnaire')
        .select('*')
        .eq('broker_id', broker.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!broker?.id,
  });

  // Fetch sales performance
  const { data: performance } = useQuery({
    queryKey: ['broker-performance', broker?.user_id],
    queryFn: async () => {
      if (!broker?.user_id) return null;
      
      const { data: properties } = await supabase
        .from('crm_properties')
        .select('sale_value, current_stage, created_at')
        .eq('responsible_user_id', broker.user_id);

      const { data: commissions } = await supabase
        .from('crm_property_commissions')
        .select('value, is_paid')
        .eq('user_id', broker.user_id);

      const completedSales = (properties || []).filter(
        p => p.current_stage === 'pago' || p.current_stage === 'comissao_liberada'
      );

      return {
        totalProperties: properties?.length || 0,
        completedSales: completedSales.length,
        totalSalesValue: completedSales.reduce((sum, p) => sum + (p.sale_value || 0), 0),
        totalCommissions: (commissions || []).reduce((sum, c) => sum + (c.value || 0), 0),
        paidCommissions: (commissions || []).filter(c => c.is_paid).reduce((sum, c) => sum + (c.value || 0), 0),
        pendingCommissions: (commissions || []).filter(c => !c.is_paid).reduce((sum, c) => sum + (c.value || 0), 0),
      };
    },
    enabled: isOpen && !!broker?.user_id,
  });

  if (!broker) return null;

  const q = questionnaire || broker.questionnaire;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center overflow-hidden">
              {broker.profile?.avatar_url ? (
                <img 
                  src={broker.profile.avatar_url} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gold font-semibold text-2xl">
                  {broker.profile?.full_name?.charAt(0) || '?'}
                </span>
              )}
            </div>
            <div>
              <DialogTitle className="text-xl text-foreground flex items-center gap-2">
                {broker.profile?.full_name || 'Corretor'}
                {getStatusBadge(broker.status)}
              </DialogTitle>
              {broker.creci_number && (
                <p className="text-sm text-muted-foreground mt-1">
                  CRECI {broker.creci_number} {broker.creci_state}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="questionnaire">Questionário</TabsTrigger>
            <TabsTrigger value="performance">Desempenho</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Contact Info */}
            <div className="bg-surface p-4 rounded-lg border border-border">
              <h4 className="font-medium text-foreground flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-gold" />
                Informações de Contato
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {broker.profile?.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{broker.profile.email}</span>
                  </div>
                )}
                {broker.profile?.whatsapp && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{broker.profile.whatsapp}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Info */}
            <div className="bg-surface p-4 rounded-lg border border-border">
              <h4 className="font-medium text-foreground flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-gold" />
                Informações Profissionais
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Comissão</p>
                  <p className="font-medium text-foreground flex items-center gap-1">
                    <Percent className="w-4 h-4 text-gold" />
                    {broker.commission_percentage}% sobre vendas
                  </p>
                </div>
                {broker.hired_at && (
                  <div>
                    <p className="text-xs text-muted-foreground">Data de Contratação</p>
                    <p className="font-medium text-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gold" />
                      {format(new Date(broker.hired_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                )}
              </div>

              {broker.specializations && broker.specializations.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2">Especializações</p>
                  <div className="flex flex-wrap gap-2">
                    {broker.specializations.map(spec => (
                      <Badge key={spec} variant="outline" className="border-gold/50 text-gold">
                        {specializationLabels[spec] || spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Documents */}
            <div className="bg-surface p-4 rounded-lg border border-border">
              <h4 className="font-medium text-foreground flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-gold" />
                Documentos
              </h4>
              {broker.resume_url ? (
                <a
                  href={broker.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gold hover:underline"
                >
                  <FileText className="w-4 h-4" />
                  Ver Currículo
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum documento anexado</p>
              )}
            </div>
          </TabsContent>

          {/* Questionnaire Tab */}
          <TabsContent value="questionnaire" className="space-y-4 mt-4">
            {q ? (
              <div className="space-y-4">
                {q.motivation && (
                  <div className="bg-surface p-4 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Por que deseja trabalhar conosco?</p>
                    <p className="text-foreground">{q.motivation}</p>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  {q.experience_years !== null && (
                    <div className="bg-surface p-4 rounded-lg border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Anos de Experiência</p>
                      <p className="text-foreground font-medium">{q.experience_years} anos</p>
                    </div>
                  )}
                  {q.monthly_sales_goal && (
                    <div className="bg-surface p-4 rounded-lg border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Meta Mensal de Vendas</p>
                      <p className="text-foreground font-medium">{formatCurrency(q.monthly_sales_goal)}</p>
                    </div>
                  )}
                </div>

                {q.previous_experience && (
                  <div className="bg-surface p-4 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Experiência Anterior</p>
                    <p className="text-foreground">{q.previous_experience}</p>
                  </div>
                )}

                {q.career_goals && (
                  <div className="bg-surface p-4 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Objetivos de Carreira</p>
                    <p className="text-foreground">{q.career_goals}</p>
                  </div>
                )}

                {q.availability && (
                  <div className="bg-surface p-4 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Disponibilidade</p>
                    <p className="text-foreground">{q.availability}</p>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  {q.strengths && (
                    <div className="bg-surface p-4 rounded-lg border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Pontos Fortes</p>
                      <p className="text-foreground">{q.strengths}</p>
                    </div>
                  )}
                  {q.improvement_areas && (
                    <div className="bg-surface p-4 rounded-lg border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Áreas de Melhoria</p>
                      <p className="text-foreground">{q.improvement_areas}</p>
                    </div>
                  )}
                </div>

                {q.referral_source && (
                  <div className="bg-surface p-4 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Como Conheceu a Imobiliária</p>
                    <p className="text-foreground">{q.referral_source}</p>
                  </div>
                )}

                {q.additional_notes && (
                  <div className="bg-surface p-4 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Observações Adicionais</p>
                    <p className="text-foreground">{q.additional_notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Questionário não preenchido
              </div>
            )}
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4 mt-4">
            {performance ? (
              <>
                {/* Performance Stats */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="bg-surface p-4 rounded-lg border border-border text-center">
                    <TrendingUp className="w-6 h-6 text-gold mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{performance.completedSales}</p>
                    <p className="text-xs text-muted-foreground">Vendas Concluídas</p>
                  </div>
                  <div className="bg-surface p-4 rounded-lg border border-border text-center">
                    <Award className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(performance.totalSalesValue)}</p>
                    <p className="text-xs text-muted-foreground">Total em Vendas</p>
                  </div>
                  <div className="bg-surface p-4 rounded-lg border border-border text-center">
                    <Percent className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(performance.totalCommissions)}</p>
                    <p className="text-xs text-muted-foreground">Total em Comissões</p>
                  </div>
                </div>

                {/* Commission Breakdown */}
                <div className="bg-surface p-4 rounded-lg border border-border">
                  <h4 className="font-medium text-foreground mb-4">Detalhamento de Comissões</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-xs text-emerald-600 mb-1">Comissões Pagas</p>
                      <p className="text-xl font-bold text-emerald-700">{formatCurrency(performance.paidCommissions)}</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-xs text-amber-600 mb-1">Comissões Pendentes</p>
                      <p className="text-xl font-bold text-amber-700">{formatCurrency(performance.pendingCommissions)}</p>
                    </div>
                  </div>
                </div>

                {/* Expected Commission Rate */}
                <div className="bg-gradient-to-r from-gold/10 to-gold/5 p-4 rounded-lg border border-gold/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Taxa de Comissão Configurada</p>
                      <p className="text-2xl font-bold text-gold">{broker.commission_percentage}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Comissão Esperada (Próximas Vendas)</p>
                      <p className="text-sm text-foreground">
                        A cada R$ 100.000 em vendas = {formatCurrency(100000 * (broker.commission_percentage / 100))}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {broker.user_id 
                  ? 'Carregando dados de desempenho...'
                  : 'Este corretor não está vinculado a um usuário do sistema'
                }
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
