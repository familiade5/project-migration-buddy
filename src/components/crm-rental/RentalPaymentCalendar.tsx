import { useState, useMemo } from 'react';
import { RentalPayment, RentalContract, getPaymentTotal, paymentStatusLabels, monthNames } from '@/types/rental';
import { formatCurrency } from '@/lib/formatCurrency';
import { 
  ChevronLeft, 
  ChevronRight,
  Check,
  Clock,
  AlertTriangle,
  X,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RentalPaymentCalendarProps {
  payments: RentalPayment[];
  contracts: RentalContract[];
  onPaymentClick?: (payment: RentalPayment) => void;
  onMarkAsPaid?: (payment: RentalPayment) => void;
}

export function RentalPaymentCalendar({
  payments,
  contracts,
  onPaymentClick,
  onMarkAsPaid,
}: RentalPaymentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthPayments = useMemo(() => {
    return payments
      .filter(p => p.reference_month === currentMonth && p.reference_year === currentYear)
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
  }, [payments, currentMonth, currentYear]);

  const getContract = (contractId: string) => {
    return contracts.find(c => c.id === contractId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <Check className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4" />;
      case 'partial': return <FileText className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'partial': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Summary stats
  const stats = useMemo(() => {
    const paid = monthPayments.filter(p => p.status === 'paid');
    const pending = monthPayments.filter(p => p.status === 'pending');
    const overdue = monthPayments.filter(p => p.status === 'overdue');

    return {
      paidCount: paid.length,
      paidValue: paid.reduce((sum, p) => sum + (p.paid_amount || getPaymentTotal(p)), 0),
      pendingCount: pending.length,
      pendingValue: pending.reduce((sum, p) => sum + getPaymentTotal(p), 0),
      overdueCount: overdue.length,
      overdueValue: overdue.reduce((sum, p) => sum + getPaymentTotal(p), 0),
    };
  }, [monthPayments]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Calendário de Pagamentos</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevMonth}
              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-white font-medium min-w-[140px] text-center">
              {monthNames[currentMonth - 1]} {currentYear}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">Pagos</span>
            </div>
            <p className="text-lg font-bold text-white">{stats.paidCount}</p>
            <p className="text-xs text-gray-400">{formatCurrency(stats.paidValue)}</p>
          </div>
          <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-400 font-medium">Pendentes</span>
            </div>
            <p className="text-lg font-bold text-white">{stats.pendingCount}</p>
            <p className="text-xs text-gray-400">{formatCurrency(stats.pendingValue)}</p>
          </div>
          <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-400 font-medium">Atrasados</span>
            </div>
            <p className="text-lg font-bold text-white">{stats.overdueCount}</p>
            <p className="text-xs text-gray-400">{formatCurrency(stats.overdueValue)}</p>
          </div>
        </div>
      </div>

      {/* Payment list */}
      <div className="max-h-[500px] overflow-y-auto">
        {monthPayments.length === 0 ? (
          <div className="p-8 text-center">
            <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Nenhum pagamento para este mês</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {monthPayments.map((payment) => {
              const contract = getContract(payment.contract_id);
              const total = getPaymentTotal(payment);

              return (
                <div
                  key={payment.id}
                  onClick={() => onPaymentClick?.(payment)}
                  className={cn(
                    "p-4 hover:bg-gray-800/50 transition-colors cursor-pointer",
                    "flex items-center justify-between gap-4"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                      getStatusColor(payment.status)
                    )}>
                      {getStatusIcon(payment.status)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">
                        {contract?.property_code || 'Contrato'}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        {contract?.tenant?.full_name || 'Inquilino não definido'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-white font-medium">{formatCurrency(total)}</p>
                      <p className="text-xs text-gray-500">
                        Vence: {new Date(payment.due_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge className={cn("text-xs border", getStatusColor(payment.status))}>
                      {paymentStatusLabels[payment.status]}
                    </Badge>
                    {(payment.status === 'pending' || payment.status === 'overdue') && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsPaid?.(payment);
                        }}
                        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Pagar
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
