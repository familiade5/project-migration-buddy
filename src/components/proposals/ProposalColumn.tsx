import { useDroppable } from '@dnd-kit/core';
import { Proposal, ProposalStage, STAGE_CONFIG } from '@/types/proposals';
import { ProposalCard } from './ProposalCard';

interface ProposalColumnProps {
  stage: ProposalStage;
  proposals: Proposal[];
  onCardClick: (proposal: Proposal) => void;
  checklistSummaries?: Record<string, { total: number; conforme: number; pendente: number }>;
}

export function ProposalColumn({ stage, proposals, onCardClick, checklistSummaries = {} }: ProposalColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const cfg = STAGE_CONFIG[stage];

  const pendingCount = proposals.filter(p => {
    const s = checklistSummaries[p.id];
    return s && s.pendente > 0;
  }).length;

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-64 rounded-2xl flex flex-col transition-all duration-200 ${
        isOver ? 'ring-2 ring-offset-1' : ''
      }`}
      style={{
        ringColor: cfg.color,
        backgroundColor: isOver ? cfg.bgColor : '#F8FAFC',
        border: `1px solid ${isOver ? cfg.borderColor : '#E2E8F0'}`,
        minHeight: 500,
      }}
    >
      {/* Column Header */}
      <div className="px-3 py-3 rounded-t-2xl" style={{ backgroundColor: cfg.bgColor, borderBottom: `1px solid ${cfg.borderColor}` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
            <span className="text-sm font-semibold" style={{ color: cfg.color }}>
              {cfg.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {pendingCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
              </span>
            )}
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ backgroundColor: cfg.color + '22', color: cfg.color }}
            >
              {proposals.length}
            </span>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
        {proposals.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-xs text-gray-400 italic">
            Nenhuma proposta
          </div>
        ) : (
          proposals.map(p => (
            <ProposalCard
              key={p.id}
              proposal={p}
              onClick={() => onCardClick(p)}
              checklistSummary={checklistSummaries[p.id]}
            />
          ))
        )}
      </div>
    </div>
  );
}
