import { useState } from 'react';
import { RentalContract, getTotalMonthly, getDaysUntilEnd, contractStatusLabels } from '@/types/rental';
import { formatCurrency } from '@/lib/formatCurrency';
import { 
  Building2, 
  User, 
  Calendar, 
  MapPin, 
  Phone,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RentalContractCardProps {
  contract: RentalContract;
  overdueCount?: number;
  pendingCount?: number;
  onClick?: () => void;
}

export function RentalContractCard({ 
  contract, 
  overdueCount = 0,
  pendingCount = 0,
  onClick 
}: RentalContractCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const daysUntilEnd = getDaysUntilEnd(contract);
  const totalMonthly = getTotalMonthly(contract);
  
  const getStatusColor = () => {
    switch (contract.status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'ending_soon': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'expired': return 'bg-red-100 text-red-700 border-red-200';
      case 'terminated': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'renewed': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const hasIssues = overdueCount > 0;

  return (
    <div 
      className={cn(
        "bg-white border rounded-xl overflow-hidden transition-all duration-200 shadow-sm",
        hasIssues ? "border-red-200 hover:border-red-300" : "border-gray-200 hover:border-gray-300",
        "cursor-pointer"
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              hasIssues ? "bg-red-50" : "bg-gray-100"
            )}>
              <Building2 className={cn(
                "w-5 h-5",
                hasIssues ? "text-red-600" : "text-gray-500"
              )} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{contract.property_code}</h3>
              <p className="text-sm text-gray-500">{contract.property_type}</p>
            </div>
          </div>
          <Badge className={cn("text-xs border", getStatusColor())}>
            {contractStatusLabels[contract.status]}
          </Badge>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-sm text-gray-500">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{contract.property_address}</span>
        </div>

        {/* Tenant */}
        {contract.tenant && (
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">{contract.tenant.full_name}</span>
            {contract.tenant.phone && (
              <>
                <span className="text-gray-300">•</span>
                <Phone className="w-3 h-3 text-gray-400" />
                <span className="text-gray-500">{contract.tenant.phone}</span>
              </>
            )}
          </div>
        )}

        {/* Financial */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Mensal</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(totalMonthly)}</p>
          </div>
          
          <div className="flex items-center gap-3">
            {overdueCount > 0 && (
              <div className="flex items-center gap-1 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{overdueCount} atraso</span>
              </div>
            )}
            {pendingCount > 0 && overdueCount === 0 && (
              <div className="flex items-center gap-1 text-amber-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{pendingCount} pendente</span>
              </div>
            )}
            {pendingCount === 0 && overdueCount === 0 && (
              <div className="flex items-center gap-1 text-emerald-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Em dia</span>
              </div>
            )}
          </div>
        </div>

        {/* Contract period */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              {new Date(contract.start_date).toLocaleDateString('pt-BR')} - {new Date(contract.end_date).toLocaleDateString('pt-BR')}
            </span>
          </div>
          {daysUntilEnd > 0 && daysUntilEnd <= 90 && (
            <span className={cn(
              "font-medium",
              daysUntilEnd <= 30 ? "text-red-600" : daysUntilEnd <= 60 ? "text-amber-600" : "text-gray-500"
            )}>
              {daysUntilEnd} dias restantes
            </span>
          )}
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center gap-1 text-xs text-gray-500"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Menos detalhes
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            Mais detalhes
          </>
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
          {/* Owner info */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Proprietário</p>
            <p className="text-sm text-gray-900">{contract.owner_name}</p>
            {contract.owner_phone && (
              <p className="text-xs text-gray-500">{contract.owner_phone}</p>
            )}
          </div>

          {/* Financial breakdown */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Composição</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Aluguel:</span>
                <span className="text-gray-900">{formatCurrency(contract.rent_value)}</span>
              </div>
              {contract.condominium_fee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Condomínio:</span>
                  <span className="text-gray-900">{formatCurrency(contract.condominium_fee)}</span>
                </div>
              )}
              {contract.iptu_value > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">IPTU:</span>
                  <span className="text-gray-900">{formatCurrency(contract.iptu_value)}</span>
                </div>
              )}
              {contract.other_fees > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Outras taxas:</span>
                  <span className="text-gray-900">{formatCurrency(contract.other_fees)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Management */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Taxa de administração:</span>
            <span className="text-gray-900">{contract.management_fee_percentage}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
