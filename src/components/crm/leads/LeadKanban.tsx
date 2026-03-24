import { useMemo, useState } from 'react';
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent,
  MouseSensor, TouchSensor, useSensor, useSensors, closestCenter,
} from '@dnd-kit/core';
import { CrmLead, LeadSdrStage, LeadSalesStage, SDR_STAGE_CONFIG, SDR_STAGE_ORDER, SALES_STAGE_CONFIG, SALES_STAGE_ORDER } from '@/types/leads';
import { LeadColumn } from './LeadColumn';
import { LeadCard } from './LeadCard';

interface LeadKanbanProps {
  leads: CrmLead[];
  pipeline: 'sdr' | 'sales';
  onMoveSdr: (id: string, from: LeadSdrStage, to: LeadSdrStage) => void;
  onMoveSales: (id: string, from: LeadSalesStage, to: LeadSalesStage) => void;
  onCardClick: (lead: CrmLead) => void;
}

export function LeadKanban({ leads, pipeline, onMoveSdr, onMoveSales, onCardClick }: LeadKanbanProps) {
  const [activeLead, setActiveLead] = useState<CrmLead | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const stageOrder = pipeline === 'sdr' ? SDR_STAGE_ORDER : SALES_STAGE_ORDER;
  const stageConfig = pipeline === 'sdr' ? SDR_STAGE_CONFIG : SALES_STAGE_CONFIG;

  const byStage = useMemo(() => {
    const grouped: Record<string, CrmLead[]> = {};
    stageOrder.forEach(s => { grouped[s] = []; });

    leads.forEach(lead => {
      const stageKey = pipeline === 'sdr' ? lead.sdr_stage : lead.sales_stage;
      if (stageKey && grouped[stageKey]) grouped[stageKey].push(lead);
    });

    return grouped;
  }, [leads, pipeline, stageOrder]);

  const handleDragStart = (e: DragStartEvent) => {
    const l = leads.find(x => x.id === e.active.id);
    if (l) setActiveLead(l);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveLead(null);
    if (!e.over) return;
    const lead = leads.find(x => x.id === e.active.id);
    if (!lead) return;
    const toStage = e.over.id as string;
    if (pipeline === 'sdr') {
      if (lead.sdr_stage !== toStage) onMoveSdr(lead.id, lead.sdr_stage, toStage as LeadSdrStage);
    } else {
      if (lead.sales_stage !== toStage) onMoveSales(lead.id, lead.sales_stage!, toStage as LeadSalesStage);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 pb-4 overflow-x-auto" style={{ minHeight: 500 }}>
        {stageOrder.map(stage => {
          const cfg = (stageConfig as any)[stage];
          return (
            <LeadColumn
              key={stage}
              stageKey={stage}
              label={cfg.label}
              color={cfg.color}
              bgColor={cfg.bgColor}
              borderColor={cfg.borderColor}
              leads={byStage[stage] || []}
              onCardClick={onCardClick}
              pipeline={pipeline}
            />
          );
        })}
      </div>
      <DragOverlay>
        {activeLead ? (
          <div className="rotate-2 scale-105">
            <LeadCard lead={activeLead} onClick={() => {}} pipeline={pipeline} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
