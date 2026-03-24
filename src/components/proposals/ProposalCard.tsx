import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Proposal, STAGE_CONFIG } from '@/types/proposals';
import { formatCurrency } from '@/lib/formatCurrency';
import { MapPin, User, Calendar, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { differenceInDays } from 'date-fns';

interface ProposalCardProps {
  proposal: Proposal;
  onClick: () => void;
  checklistSummary?: { total: number; conforme: number; pendente: number };
}

export function ProposalCard({ proposal, onClick, checklistSummary }: ProposalCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: proposal.id,
    data: { proposal },
  });

  const style = { transform: CSS.Transform.toString(transform) };
  const daysInStage = differenceInDays(new Date(), new Date(proposal.stage_entered_at));
  const isStale = daysInStage > 7;
  const cfg = STAGE_CONFIG[proposal.stage];

  const allConforme = checklistSummary && checklistSummary.total > 0 && checklistSummary.pendente === 0;
  const hasPendencia = checklistSummary && checklistSummary.pendente > 0;

  const cardBorder = hasPendencia
    ? 'border-red-200 bg-red-50/30'
    : allConforme
    ? 'border-emerald-200 bg-emerald-50/30'
    : 'border-gray-200 bg-white';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`
        rounded-xl p-3 cursor-grab active:cursor-grabbing border shadow-sm
        hover:shadow-md transition-all duration-200 select-none
        ${cardBorder}
        ${isDragging ? 'opacity-50 shadow-2xl scale-105 z-50' : ''}
        ${isStale ? 'ring-1 ring-amber-300' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 truncate">{proposal.nome}</p>
          {proposal.produto && (
            <p className="text-xs text-gray-500 truncate">{proposal.produto}</p>
          )}
        </div>
        {isStale && (
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
        )}
      </div>

      {/* Corretor */}
      {proposal.corretor && (
        <div className="flex items-center gap-1.5 mb-1.5">
          <User className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-600 truncate">{proposal.corretor}</span>
        </div>
      )}

      {/* Cidade */}
      {proposal.cidade && (
        <div className="flex items-center gap-1.5 mb-1.5">
          <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-500 truncate">{proposal.cidade}</span>
        </div>
      )}

      {/* Valor */}
      {proposal.valor_financiamento && (
        <p className="text-sm font-semibold text-gray-900 mb-2">
          {formatCurrency(proposal.valor_financiamento)}
        </p>
      )}

      {/* Checklist progress */}
      {checklistSummary && checklistSummary.total > 0 && (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-500">Checklist</span>
            <span className="text-[10px] text-gray-500">
              {checklistSummary.conforme}/{checklistSummary.total}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(checklistSummary.conforme / checklistSummary.total) * 100}%`,
                backgroundColor: allConforme ? '#10b981' : hasPendencia ? '#ef4444' : '#6366f1',
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          {allConforme ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          ) : hasPendencia ? (
            <AlertTriangle className="w-3 h-3 text-red-400" />
          ) : null}
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
            style={{ color: cfg.color, backgroundColor: cfg.bgColor, border: `1px solid ${cfg.borderColor}` }}
          >
            {allConforme ? 'Conforme' : hasPendencia ? `${checklistSummary!.pendente} pendente(s)` : 'Em andamento'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Clock className="w-3 h-3" />
          <span className={`text-[10px] ${isStale ? 'text-amber-600 font-semibold' : 'text-gray-400'}`}>
            {daysInStage}d
          </span>
        </div>
      </div>
    </div>
  );
}
