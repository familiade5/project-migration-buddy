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
        flex flex-col min-w-[280px] max-w-[280px] bg-[#0d0d0d] rounded-xl
        border transition-all duration-200
        ${isOver ? 'border-[#3b82f6] ring-1 ring-[#3b82f6]/30' : 'border-[#1a1a1a]'}
      `}
    >
      {/* Column Header */}
      <div
        className="p-3 border-b border-[#1a1a1a] rounded-t-xl"
        style={{ backgroundColor: config.bgColor }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <h3 className="text-sm font-medium text-[#e0e0e0]">{config.label}</h3>
          </div>
          <span className="text-xs font-mono text-[#666] bg-[#1a1a1a] px-2 py-0.5 rounded">
            {properties.length}
          </span>
        </div>
        {totalValue > 0 && (
          <p className="text-[11px] text-[#666]">
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
          <div className="flex items-center justify-center h-24 text-[#444] text-xs">
            Nenhum imóvel
          </div>
        )}
      </div>
    </div>
  );
}
