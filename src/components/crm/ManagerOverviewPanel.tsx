import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IncompletePropertyView } from '@/types/stageCompletion';
import { CrmProperty, STAGE_CONFIG } from '@/types/crm';
import { formatCurrency } from '@/lib/formatCurrency';
import {
  BarChart3,
  AlertTriangle,
  Clock,
  User,
  MapPin,
  FileWarning,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from 'lucide-react';

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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
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
        className="w-full sm:max-w-2xl lg:max-w-4xl bg-white border-gray-200 text-gray-900 p-0"
      >
        <SheetHeader className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-gray-900 text-lg font-semibold flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              Controle Gerencial
            </SheetTitle>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider">Total</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-2xl font-bold text-emerald-600">{stats.complete}</div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider">Completos</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-2xl font-bold text-amber-600">{stats.incomplete}</div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider">Pendentes</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-red-200">
              <div className="text-2xl font-bold text-red-600">{stats.criticalIncomplete}</div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider">Críticos</div>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)]">
          {incompleteProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tudo em ordem
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-md">
                Todos os imóveis em etapas críticas estão com as informações completas.
              </p>
            </div>
          ) : (
            <div className="px-4 py-4">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 hover:bg-transparent">
                    <TableHead className="text-gray-500 text-[11px] uppercase tracking-wider font-medium">
                      Imóvel
                    </TableHead>
                    <TableHead className="text-gray-500 text-[11px] uppercase tracking-wider font-medium">
                      Etapa
                    </TableHead>
                    <TableHead className="text-gray-500 text-[11px] uppercase tracking-wider font-medium">
                      Tempo
                    </TableHead>
                    <TableHead className="text-gray-500 text-[11px] uppercase tracking-wider font-medium">
                      Responsável
                    </TableHead>
                    <TableHead className="text-gray-500 text-[11px] uppercase tracking-wider font-medium">
                      Pendências
                    </TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incompleteProperties.map((property) => (
                    <TableRow
                      key={property.propertyId}
                      className="border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handlePropertyClick(property.propertyId)}
                    >
                      <TableCell className="py-3">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                              {property.code}
                            </span>
                            {property.isCriticalStage && (
                              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>
                              {property.neighborhood || property.city}/{property.state}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-3">
                        <span
                          className="text-xs px-2 py-1 rounded font-medium"
                          style={{
                            backgroundColor: `${STAGE_CONFIG[property.stage].color}15`,
                            color: STAGE_CONFIG[property.stage].color,
                          }}
                        >
                          {property.stageLabel}
                        </span>
                      </TableCell>

                      <TableCell className="py-3">
                        <div
                          className={`flex items-center gap-1.5 text-sm font-medium ${getUrgencyColor(
                            property.daysInStage,
                            property.isCriticalStage
                          )}`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          {formatTimeInStage(property.daysInStage, property.hoursInStage)}
                        </div>
                      </TableCell>

                      <TableCell className="py-3">
                        {property.responsibleUserName ? (
                          <div className="flex items-center gap-1.5 text-sm text-gray-700">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            <span className="truncate max-w-[100px]">
                              {property.responsibleUserName.split(' ')[0]}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-sm text-red-600">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Não atribuído</span>
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {property.missingItems.slice(0, 2).map((item, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200"
                            >
                              <FileWarning className="w-3 h-3" />
                              {item}
                            </span>
                          ))}
                          {property.missingItems.length > 2 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                              +{property.missingItems.length - 2}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="py-3">
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
