import { RentalAlert } from '@/hooks/useRentalAlerts';
import { formatCurrency } from '@/lib/formatCurrency';
import { getPaymentTotal, monthNames } from '@/types/rental';
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  Info,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RentalAlertsPanelProps {
  alerts: RentalAlert[];
  alertsByType: {
    critical: RentalAlert[];
    warning: RentalAlert[];
    info: RentalAlert[];
  };
  onAlertClick?: (alert: RentalAlert) => void;
}

export function RentalAlertsPanel({ 
  alerts, 
  alertsByType,
  onAlertClick 
}: RentalAlertsPanelProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'info': return <Info className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const totalAlerts = alerts.length;
  const criticalCount = alertsByType.critical.length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "relative",
            criticalCount > 0 
              ? "text-red-400 hover:text-red-300 hover:bg-red-500/10" 
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          )}
        >
          <Bell className="w-4 h-4 mr-2" />
          Alertas
          {totalAlerts > 0 && (
            <Badge 
              className={cn(
                "ml-2 text-xs",
                criticalCount > 0 
                  ? "bg-red-500 text-white" 
                  : "bg-amber-500 text-white"
              )}
            >
              {totalAlerts}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-gray-900 border-gray-800 text-white w-[420px]">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Alertas de Vencimento
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)] mt-4 -mx-6 px-6">
          {totalAlerts === 0 ? (
            <div className="py-12 text-center">
              <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Nenhum alerta no momento</p>
              <p className="text-sm text-gray-500 mt-1">
                Todos os pagamentos estão em dia
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Critical */}
              {alertsByType.critical.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wider">
                      Críticos ({alertsByType.critical.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {alertsByType.critical.map((alert) => (
                      <AlertItem 
                        key={alert.id} 
                        alert={alert} 
                        onClick={() => onAlertClick?.(alert)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Warning */}
              {alertsByType.warning.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
                      Atenção ({alertsByType.warning.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {alertsByType.warning.map((alert) => (
                      <AlertItem 
                        key={alert.id} 
                        alert={alert} 
                        onClick={() => onAlertClick?.(alert)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Info */}
              {alertsByType.info.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-blue-400" />
                    <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                      Próximos ({alertsByType.info.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {alertsByType.info.map((alert) => (
                      <AlertItem 
                        key={alert.id} 
                        alert={alert} 
                        onClick={() => onAlertClick?.(alert)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function AlertItem({ alert, onClick }: { alert: RentalAlert; onClick?: () => void }) {
  const total = getPaymentTotal(alert.payment);
  const daysText = alert.daysOffset === 0 
    ? 'Vence hoje'
    : alert.daysOffset > 0
      ? `Vence em ${alert.daysOffset} dias`
      : `${Math.abs(alert.daysOffset)} dias em atraso`;

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20';
      case 'warning': return 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20';
      case 'info': return 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20';
      default: return 'bg-gray-800 border-gray-700 hover:bg-gray-800';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400';
      case 'warning': return 'text-amber-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-3 rounded-lg border transition-colors text-left",
        getSeverityBg(alert.severity)
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-white font-medium truncate">
            {alert.contract.property_code}
          </p>
          <p className="text-sm text-gray-400 truncate">
            {alert.contract.tenant?.full_name || 'Inquilino'}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Clock className={cn("w-3 h-3", getSeverityText(alert.severity))} />
            <span className={cn("text-xs", getSeverityText(alert.severity))}>
              {daysText}
            </span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-white font-medium">{formatCurrency(total)}</p>
          <p className="text-xs text-gray-500">
            {format(alert.dueDate, "dd 'de' MMM", { locale: ptBR })}
          </p>
        </div>
      </div>
    </button>
  );
}
