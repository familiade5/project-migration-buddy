import { useMemo, useState } from 'react';
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
import { RentalProperty, RentalPropertyStage, RENTAL_PROPERTY_STAGE_ORDER } from '@/types/rentalProperty';
import { RentalPropertyKanbanColumn } from './RentalPropertyKanbanColumn';
import { RentalPropertyKanbanCard } from './RentalPropertyKanbanCard';

interface RentalPropertyKanbanBoardProps {
  properties: RentalProperty[];
  onMoveProperty: (propertyId: string, fromStage: RentalPropertyStage, toStage: RentalPropertyStage) => void;
  onCardClick: (property: RentalProperty) => void;
}

export function RentalPropertyKanbanBoard({ 
  properties, 
  onMoveProperty, 
  onCardClick,
}: RentalPropertyKanbanBoardProps) {
  const [activeProperty, setActiveProperty] = useState<RentalProperty | null>(null);

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
    const grouped: Record<RentalPropertyStage, RentalProperty[]> = {} as any;
    
    RENTAL_PROPERTY_STAGE_ORDER.forEach((stage) => {
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

    const toStage = over.id as RentalPropertyStage;
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
        {RENTAL_PROPERTY_STAGE_ORDER.map((stage) => (
          <RentalPropertyKanbanColumn
            key={stage}
            stage={stage}
            properties={propertiesByStage[stage]}
            onCardClick={onCardClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeProperty ? (
          <div className="rotate-3 scale-105">
            <RentalPropertyKanbanCard property={activeProperty} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
