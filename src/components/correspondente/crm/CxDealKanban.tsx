import { useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { CxDeal, CxDealStage, CX_STAGE_ORDER } from '@/types/cxCrm';
import { CxDealColumn } from './CxDealColumn';
import { CxDealCard } from './CxDealCard';

interface Props {
  deals: CxDeal[];
  clientName: (id: string) => string;
  onMove: (id: string, from: CxDealStage, to: CxDealStage) => void;
  onCardClick: (deal: CxDeal) => void;
}

export function CxDealKanban({ deals, clientName, onMove, onCardClick }: Props) {
  const [active, setActive] = useState<CxDeal | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  const byStage = useMemo(() => {
    const grouped = {} as Record<CxDealStage, CxDeal[]>;
    CX_STAGE_ORDER.forEach((s) => {
      grouped[s] = [];
    });
    deals.forEach((d) => {
      if (grouped[d.stage]) grouped[d.stage].push(d);
    });
    return grouped;
  }, [deals]);

  const handleStart = (e: DragStartEvent) => {
    setActive(deals.find((d) => d.id === e.active.id) ?? null);
  };

  const handleEnd = (e: DragEndEvent) => {
    setActive(null);
    if (!e.over) return;
    const deal = deals.find((d) => d.id === e.active.id);
    if (!deal) return;
    const to = e.over.id as CxDealStage;
    if (deal.stage !== to) onMove(deal.id, deal.stage, to);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleStart} onDragEnd={handleEnd}>
      <div className="flex gap-3 pb-4 overflow-x-auto">
        {CX_STAGE_ORDER.map((stage) => (
          <CxDealColumn
            key={stage}
            stage={stage}
            deals={byStage[stage]}
            clientName={clientName}
            onCardClick={onCardClick}
          />
        ))}
      </div>
      <DragOverlay>
        {active ? (
          <div className="rotate-2 scale-105 w-[256px]">
            <CxDealCard deal={active} clientName={clientName(active.client_id)} onClick={() => {}} dragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
