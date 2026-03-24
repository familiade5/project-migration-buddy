import { useMemo, useState } from 'react';
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent,
  MouseSensor, TouchSensor, useSensor, useSensors, closestCenter,
} from '@dnd-kit/core';
import { Proposal, ProposalStage, STAGE_ORDER } from '@/types/proposals';
import { ProposalColumn } from './ProposalColumn';
import { ProposalCard } from './ProposalCard';

interface ProposalKanbanProps {
  proposals: Proposal[];
  onMove: (id: string, from: ProposalStage, to: ProposalStage) => void;
  onCardClick: (proposal: Proposal) => void;
  checklistSummaries?: Record<string, { total: number; conforme: number; pendente: number }>;
}

export function ProposalKanban({ proposals, onMove, onCardClick, checklistSummaries = {} }: ProposalKanbanProps) {
  const [activeProposal, setActiveProposal] = useState<Proposal | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const byStage = useMemo(() => {
    const grouped: Record<ProposalStage, Proposal[]> = {} as any;
    STAGE_ORDER.forEach(s => { grouped[s] = []; });
    proposals.forEach(p => { if (grouped[p.stage]) grouped[p.stage].push(p); });
    return grouped;
  }, [proposals]);

  const handleDragStart = (e: DragStartEvent) => {
    const p = proposals.find(x => x.id === e.active.id);
    if (p) setActiveProposal(p);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveProposal(null);
    if (!e.over) return;
    const p = proposals.find(x => x.id === e.active.id);
    if (!p) return;
    const toStage = e.over.id as ProposalStage;
    if (p.stage !== toStage) onMove(p.id, p.stage, toStage);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 pb-4 overflow-x-auto" style={{ minHeight: 500 }}>
        {STAGE_ORDER.map(stage => (
          <ProposalColumn
            key={stage}
            stage={stage}
            proposals={byStage[stage]}
            onCardClick={onCardClick}
            checklistSummaries={checklistSummaries}
          />
        ))}
      </div>
      <DragOverlay>
        {activeProposal ? (
          <div className="rotate-2 scale-105">
            <ProposalCard proposal={activeProposal} onClick={() => {}} checklistSummary={checklistSummaries[activeProposal.id]} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
