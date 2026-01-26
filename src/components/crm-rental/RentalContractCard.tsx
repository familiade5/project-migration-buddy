import { useState } from 'react';
import { RentalContract, getTotalMonthly, getDaysUntilEnd, contractStatusLabels, propertyTypes } from '@/types/rental';
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
import { Button } from '@/components/ui/button';
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
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'ending_soon': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'expired': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'terminated': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'renewed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const hasIssues = overdueCount > 0;

  return (
    <div 
      className={cn(
        "bg-gray-900 border rounded-xl overflow-hidden transition-all duration-200",
        hasIssues ? "border-red-500/30 hover:border-red-500/50" : "border-gray-800 hover:border-gray-700",
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
              hasIssues ? "bg-red-500/20" : "bg-gray-800"
            )}>
              <Building2 className={cn(
                "w-5 h-5",
                hasIssues ? "text-red-400" : "text-gray-400"
              )} />
            </div>
            <div>
              <h3 className="font-semibold text-white">{contract.property_code}</h3>
              <p className="text-sm text-gray-400">{contract.property_type}</p>
            </div>
          </div>
          <Badge className={cn("text-xs border", getStatusColor())}>
            {contractStatusLabels[contract.status]}
          </Badge>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-sm text-gray-400">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{contract.property_address}</span>
        </div>

        {/* Tenant */}
        {contract.tenant && (
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-white">{contract.tenant.full_name}</span>
            {contract.tenant.phone && (
              <>
                <span className="text-gray-600">•</span>
                <Phone className="w-3 h-3 text-gray-500" />
                <span className="text-gray-400">{contract.tenant.phone}</span>
              </>
            )}
          </div>
        )}

        {/* Financial */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Mensal</p>
            <p className="text-lg font-bold text-white">{formatCurrency(totalMonthly)}</p>
          </div>
          
          <div className="flex items-center gap-3">
            {overdueCount > 0 && (
              <div className="flex items-center gap-1 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{overdueCount} atraso</span>
              </div>
            )}
            {pendingCount > 0 && overdueCount === 0 && (
              <div className="flex items-center gap-1 text-amber-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{pendingCount} pendente</span>
              </div>
            )}
            {pendingCount === 0 && overdueCount === 0 && (
              <div className="flex items-center gap-1 text-emerald-400">
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
              daysUntilEnd <= 30 ? "text-red-400" : daysUntilEnd <= 60 ? "text-amber-400" : "text-gray-400"
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
        className="w-full px-4 py-2 bg-gray-800/50 hover:bg-gray-800 transition-colors flex items-center justify-center gap-1 text-xs text-gray-400"
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
        <div className="px-4 pb-4 space-y-3 border-t border-gray-800 pt-3">
          {/* Owner info */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Proprietário</p>
            <p className="text-sm text-white">{contract.owner_name}</p>
            {contract.owner_phone && (
              <p className="text-xs text-gray-400">{contract.owner_phone}</p>
            )}
          </div>

          {/* Financial breakdown */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Composição</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Aluguel:</span>
                <span className="text-white">{formatCurrency(contract.rent_value)}</span>
              </div>
              {contract.condominium_fee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Condomínio:</span>
                  <span className="text-white">{formatCurrency(contract.condominium_fee)}</span>
                </div>
              )}
              {contract.iptu_value > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">IPTU:</span>
                  <span className="text-white">{formatCurrency(contract.iptu_value)}</span>
                </div>
              )}
              {contract.other_fees > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Outras taxas:</span>
                  <span className="text-white">{formatCurrency(contract.other_fees)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Management */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Taxa de administração:</span>
            <span className="text-white">{contract.management_fee_percentage}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
