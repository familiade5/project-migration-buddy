import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { CrmProperty, PROPERTY_TYPE_LABELS } from '@/types/crm';
import { formatCurrency } from '@/lib/formatCurrency';
import { Image, FileText, MapPin, User, Calendar } from 'lucide-react';
import { differenceInDays } from 'date-fns';

interface KanbanCardProps {
  property: CrmProperty;
  onClick: () => void;
}

export function KanbanCard({ property, onClick }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: property.id,
    data: { property },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  const daysInStage = differenceInDays(new Date(), new Date(property.stage_entered_at));

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`
        bg-white border border-gray-200 rounded-lg p-3 cursor-grab active:cursor-grabbing
        hover:border-gray-300 hover:shadow-md transition-all duration-200 shadow-sm
        ${isDragging ? 'opacity-50 shadow-2xl scale-105 z-50' : ''}
      `}
    >
      {/* Header: Code & Type */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
          {property.code}
        </span>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">
          {PROPERTY_TYPE_LABELS[property.property_type]}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-start gap-1.5 mb-2">
        <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm text-gray-900 truncate">
            {property.neighborhood || property.city}
          </p>
          <p className="text-[11px] text-gray-500">
            {property.city}/{property.state}
          </p>
        </div>
      </div>

      {/* Value */}
      {property.sale_value && (
        <div className="mb-2">
          <p className="text-sm font-semibold text-gray-900">
            {formatCurrency(property.sale_value)}
          </p>
        </div>
      )}

      {/* Footer: Responsible & Icons */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {property.responsible_user_name ? (
            <>
              <User className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="text-[11px] text-gray-600 truncate">
                {property.responsible_user_name.split(' ')[0]}
              </span>
            </>
          ) : (
            <span className="text-[11px] text-gray-400 italic">Sem responsável</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Status Icons */}
          {property.has_creatives && (
            <span title="Tem criativos">
              <Image className="w-3.5 h-3.5 text-gray-600" />
            </span>
          )}
          {property.has_proposal && (
            <span title="Tem proposta">
              <FileText className="w-3.5 h-3.5 text-gray-700" />
            </span>
          )}

          {/* Days in stage */}
          <div className="flex items-center gap-0.5" title={`${daysInStage} dias nesta etapa`}>
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className={`text-[10px] ${daysInStage > 7 ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
              {daysInStage}d
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
