import { useDroppable } from '@dnd-kit/core';
import { CrmProperty, PropertyStage, STAGE_CONFIG } from '@/types/crm';
import { KanbanCard } from './KanbanCard';
import { formatCurrency } from '@/lib/formatCurrency';

interface KanbanColumnProps {
  stage: PropertyStage;
  properties: CrmProperty[];
  onCardClick: (property: CrmProperty) => void;
}

export function KanbanColumn({ stage, properties, onCardClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
  });

  const config = STAGE_CONFIG[stage];
  const totalValue = properties.reduce((sum, p) => sum + (p.sale_value || 0), 0);

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col min-w-[280px] max-w-[280px] bg-gray-50 rounded-xl
        border transition-all duration-200 shadow-sm
        ${isOver ? 'border-gray-400 ring-1 ring-gray-400/30' : 'border-gray-200'}
      `}
    >
      {/* Column Header */}
      <div
        className="p-3 border-b border-gray-200 rounded-t-xl"
        style={{ backgroundColor: config.bgColor }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <h3 className="text-sm font-medium text-gray-800">{config.label}</h3>
          </div>
          <span className="text-xs font-mono text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200">
            {properties.length}
          </span>
        </div>
        {totalValue > 0 && (
          <p className="text-[11px] text-gray-500">
            Total: {formatCurrency(totalValue)}
          </p>
        )}
      </div>

      {/* Cards Container */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-thin">
        {properties.map((property) => (
          <KanbanCard
            key={property.id}
            property={property}
            onClick={() => onCardClick(property)}
          />
        ))}

        {properties.length === 0 && (
          <div className="flex items-center justify-center h-24 text-gray-400 text-xs">
            Nenhum imóvel
          </div>
        )}
      </div>
    </div>
  );
}
