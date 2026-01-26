import { useDroppable } from '@dnd-kit/core';
import { RentalProperty, RentalPropertyStage, RENTAL_PROPERTY_STAGE_LABELS, RENTAL_PROPERTY_STAGE_COLORS } from '@/types/rentalProperty';
import { RentalPropertyKanbanCard } from './RentalPropertyKanbanCard';
import { cn } from '@/lib/utils';

interface RentalPropertyKanbanColumnProps {
  stage: RentalPropertyStage;
  properties: RentalProperty[];
  onCardClick: (property: RentalProperty) => void;
}

export function RentalPropertyKanbanColumn({
  stage,
  properties,
  onCardClick,
}: RentalPropertyKanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col min-w-[280px] w-[280px] bg-gray-50 rounded-lg',
        isOver && 'ring-2 ring-blue-400 bg-blue-50'
      )}
    >
      {/* Header */}
      <div className="p-3 border-b bg-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn('w-3 h-3 rounded-full', RENTAL_PROPERTY_STAGE_COLORS[stage])} />
            <span className="font-medium text-sm text-gray-700">
              {RENTAL_PROPERTY_STAGE_LABELS[stage]}
            </span>
          </div>
          <span className="text-xs bg-gray-200 px-2 py-1 rounded-full font-medium">
            {properties.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-300px)]">
        {properties.map((property) => (
          <RentalPropertyKanbanCard
            key={property.id}
            property={property}
            onClick={() => onCardClick(property)}
          />
        ))}

        {properties.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            Nenhum imóvel
          </div>
        )}
      </div>
    </div>
  );
}
