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
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'warning': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'info': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
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
              ? "text-red-600 hover:text-red-700 hover:bg-red-50" 
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
      <SheetContent className="bg-white border-gray-200 text-gray-900 w-[420px]">
        <SheetHeader>
          <SheetTitle className="text-gray-900 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Alertas de Vencimento
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)] mt-4 -mx-6 px-6">
          {totalAlerts === 0 ? (
            <div className="py-12 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nenhum alerta no momento</p>
              <p className="text-sm text-gray-400 mt-1">
                Todos os pagamentos estão em dia
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Critical */}
              {alertsByType.critical.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <h4 className="text-sm font-semibold text-red-600 uppercase tracking-wider">
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
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <h4 className="text-sm font-semibold text-amber-600 uppercase tracking-wider">
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
                    <Info className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
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
      case 'critical': return 'bg-red-50 border-red-200 hover:bg-red-100';
      case 'warning': return 'bg-amber-50 border-amber-200 hover:bg-amber-100';
      case 'info': return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      default: return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-amber-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
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
          <p className="text-gray-900 font-medium truncate">
            {alert.contract.property_code}
          </p>
          <p className="text-sm text-gray-500 truncate">
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
          <p className="text-gray-900 font-medium">{formatCurrency(total)}</p>
          <p className="text-xs text-gray-500">
            {format(alert.dueDate, "dd 'de' MMM", { locale: ptBR })}
          </p>
        </div>
      </div>
    </button>
  );
}
