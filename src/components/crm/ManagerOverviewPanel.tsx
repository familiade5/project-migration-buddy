import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IncompletePropertyView } from '@/types/stageCompletion';
import { STAGE_CONFIG } from '@/types/crm';
import {
  BarChart3,
  AlertTriangle,
  Clock,
  User,
  MapPin,
  FileWarning,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  ShieldAlert,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ManagerOverviewPanelProps {
  incompleteProperties: IncompletePropertyView[];
  stats: {
    total: number;
    incomplete: number;
    complete: number;
    criticalIncomplete: number;
  };
  onPropertyClick: (propertyId: string) => void;
}

export function ManagerOverviewPanel({
  incompleteProperties,
  stats,
  onPropertyClick,
}: ManagerOverviewPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin } = useAuth();

  const handlePropertyClick = (propertyId: string) => {
    onPropertyClick(propertyId);
    setIsOpen(false);
  };

  const formatTimeInStage = (days: number, hours: number) => {
    if (days === 0) {
      return `${hours}h`;
    }
    return `${days}d`;
  };

  const getUrgencyColor = (days: number, isCritical: boolean) => {
    if (isCritical && days > 3) return 'text-red-600';
    if (days > 7) return 'text-amber-600';
    if (days > 3) return 'text-gray-700';
    return 'text-gray-500';
  };

  const completionRate = stats.total > 0 ? Math.round((stats.complete / stats.total) * 100) : 0;
  const pendingRate = stats.total > 0 ? Math.round((stats.incomplete / stats.total) * 100) : 0;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm"
        >
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Controle Gerencial</span>
          {stats.criticalIncomplete > 0 && (
            <Badge
              variant="destructive"
              className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0 min-w-[18px] h-[18px]"
            >
              {stats.criticalIncomplete}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-3xl lg:max-w-5xl bg-gray-50 border-gray-200 text-gray-900 p-0"
      >
        {/* Access Denied for non-admins */}
        {!isAdmin ? (
          <div className="flex flex-col items-center justify-center h-full px-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Acesso Restrito
              </h3>
              <p className="text-gray-500 mb-4">
                O Controle Gerencial é uma ferramenta exclusiva para administradores. 
                Entre em contato com seu gestor para solicitar acesso.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <ShieldAlert className="w-4 h-4" />
                <span>Requer autorização de administrador</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Header with gradient */}
            <SheetHeader className="px-6 py-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <SheetTitle className="text-white text-xl font-bold flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    Controle Gerencial
                  </SheetTitle>
                  <p className="text-gray-300 text-sm">
                    Visão consolidada de performance e pendências operacionais
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                  <Activity className="w-4 h-4" />
                  <span>Atualizado em tempo real</span>
                </div>
              </div>
            </SheetHeader>

            {/* KPIs Dashboard */}
            <div className="px-6 py-4 bg-white border-b border-gray-200">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Portfolio */}
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                          Carteira Total
                        </p>
                        <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                        <p className="text-xs text-gray-400 mt-1">imóveis ativos</p>
                      </div>
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Compliance Rate */}
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                          Taxa de Conformidade
                        </p>
                        <p className="text-3xl font-bold text-emerald-600">{completionRate}%</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-emerald-500" />
                          <span className="text-xs text-emerald-600">{stats.complete} completos</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pending Items */}
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                          Pendências
                        </p>
                        <p className="text-3xl font-bold text-amber-600">{stats.incomplete}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingDown className="w-3 h-3 text-amber-500" />
                          <span className="text-xs text-amber-600">{pendingRate}% do total</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                        <FileWarning className="w-5 h-5 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Critical Alerts */}
                <Card className={`shadow-sm ${stats.criticalIncomplete > 0 ? 'border-red-200 bg-red-50/30' : 'border-gray-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                          Alertas Críticos
                        </p>
                        <p className={`text-3xl font-bold ${stats.criticalIncomplete > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                          {stats.criticalIncomplete}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {stats.criticalIncomplete > 0 ? 'requerem ação imediata' : 'nenhum alerta'}
                        </p>
                      </div>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stats.criticalIncomplete > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
                        <AlertTriangle className={`w-5 h-5 ${stats.criticalIncomplete > 0 ? 'text-red-600' : 'text-gray-400'}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Section Title */}
            <div className="px-6 py-3 bg-gray-100 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Imóveis com Pendências em Etapas Críticas
              </h3>
            </div>

            {/* Main Content */}
            <ScrollArea className="h-[calc(100vh-380px)]">
              {incompleteProperties.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Excelente! Tudo em ordem
                  </h3>
                  <p className="text-sm text-gray-500 text-center max-w-md">
                    Todos os imóveis em etapas críticas estão com documentação e informações completas.
                    Continue monitorando para manter a conformidade.
                  </p>
                </div>
              ) : (
                <div className="px-4 py-4">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 border-gray-200 hover:bg-gray-50">
                          <TableHead className="text-gray-600 text-[11px] uppercase tracking-wider font-semibold py-3">
                            Imóvel
                          </TableHead>
                          <TableHead className="text-gray-600 text-[11px] uppercase tracking-wider font-semibold py-3">
                            Etapa Atual
                          </TableHead>
                          <TableHead className="text-gray-600 text-[11px] uppercase tracking-wider font-semibold py-3">
                            Tempo na Etapa
                          </TableHead>
                          <TableHead className="text-gray-600 text-[11px] uppercase tracking-wider font-semibold py-3">
                            Responsável
                          </TableHead>
                          <TableHead className="text-gray-600 text-[11px] uppercase tracking-wider font-semibold py-3">
                            Itens Pendentes
                          </TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {incompleteProperties.map((property, index) => (
                          <TableRow
                            key={property.propertyId}
                            className={`border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                            }`}
                            onClick={() => handlePropertyClick(property.propertyId)}
                          >
                            <TableCell className="py-4">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-sm font-semibold text-gray-800 bg-gray-100 px-2.5 py-1 rounded">
                                    {property.code}
                                  </span>
                                  {property.isCriticalStage && (
                                    <span className="flex items-center gap-1 text-[10px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                      <AlertTriangle className="w-3 h-3" />
                                      CRÍTICO
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <MapPin className="w-3 h-3" />
                                  <span>
                                    {property.neighborhood ? `${property.neighborhood}, ` : ''}{property.city}/{property.state}
                                  </span>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="py-4">
                              <span
                                className="inline-flex items-center text-xs px-3 py-1.5 rounded-full font-medium"
                                style={{
                                  backgroundColor: `${STAGE_CONFIG[property.stage].color}15`,
                                  color: STAGE_CONFIG[property.stage].color,
                                }}
                              >
                                {property.stageLabel}
                              </span>
                            </TableCell>

                            <TableCell className="py-4">
                              <div
                                className={`flex items-center gap-2 font-semibold ${getUrgencyColor(
                                  property.daysInStage,
                                  property.isCriticalStage
                                )}`}
                              >
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">
                                  {formatTimeInStage(property.daysInStage, property.hoursInStage)}
                                </span>
                                {property.daysInStage > 3 && property.isCriticalStage && (
                                  <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                                    ATRASADO
                                  </span>
                                )}
                              </div>
                            </TableCell>

                            <TableCell className="py-4">
                              {property.responsibleUserName ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-gray-600" />
                                  </div>
                                  <span className="text-sm text-gray-700 font-medium truncate max-w-[100px]">
                                    {property.responsibleUserName.split(' ')[0]}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-red-500" />
                                  </div>
                                  <span className="text-sm text-red-600 font-medium">Não atribuído</span>
                                </div>
                              )}
                            </TableCell>

                            <TableCell className="py-4">
                              <div className="flex flex-wrap gap-1.5">
                                {property.missingItems.slice(0, 2).map((item, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200"
                                  >
                                    <FileWarning className="w-3 h-3" />
                                    {item}
                                  </span>
                                ))}
                                {property.missingItems.length > 2 && (
                                  <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                    +{property.missingItems.length - 2} mais
                                  </span>
                                )}
                              </div>
                            </TableCell>

                            <TableCell className="py-4">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-white border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  Exibindo {incompleteProperties.length} {incompleteProperties.length === 1 ? 'imóvel' : 'imóveis'} com pendências
                </span>
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  Dados sincronizados em tempo real
                </span>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
