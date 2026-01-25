import { useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { CrmProperty, PropertyStage, STAGE_ORDER } from '@/types/crm';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { useState } from 'react';

interface KanbanBoardProps {
  properties: CrmProperty[];
  onMoveProperty: (propertyId: string, fromStage: PropertyStage, toStage: PropertyStage) => void;
  onCardClick: (property: CrmProperty) => void;
  onShowCover?: (imageUrl: string) => void;
  onShowProposal?: (propertyId: string) => void;
}

export function KanbanBoard({ 
  properties, 
  onMoveProperty, 
  onCardClick,
  onShowCover,
  onShowProposal,
}: KanbanBoardProps) {
  const [activeProperty, setActiveProperty] = useState<CrmProperty | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const propertiesByStage = useMemo(() => {
    const grouped: Record<PropertyStage, CrmProperty[]> = {} as any;
    
    STAGE_ORDER.forEach((stage) => {
      grouped[stage] = [];
    });

    properties.forEach((property) => {
      if (grouped[property.current_stage]) {
        grouped[property.current_stage].push(property);
      }
    });

    return grouped;
  }, [properties]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const property = properties.find((p) => p.id === active.id);
    if (property) {
      setActiveProperty(property);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveProperty(null);

    if (!over) return;

    const propertyId = active.id as string;
    const property = properties.find((p) => p.id === propertyId);
    if (!property) return;

    const toStage = over.id as PropertyStage;
    if (property.current_stage !== toStage) {
      onMoveProperty(propertyId, property.current_stage, toStage);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 pb-4 overflow-x-auto min-h-[500px]">
        {STAGE_ORDER.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            properties={propertiesByStage[stage]}
            onCardClick={onCardClick}
            onShowCover={onShowCover}
            onShowProposal={onShowProposal}
          />
        ))}
      </div>

      <DragOverlay>
        {activeProperty ? (
          <div className="rotate-3 scale-105">
            <KanbanCard property={activeProperty} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
