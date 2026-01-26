import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { CrmProperty, PROPERTY_TYPE_LABELS, PropertyStage } from '@/types/crm';
import { PropertyCompletionStatus } from '@/types/stageCompletion';
import { formatCurrency } from '@/lib/formatCurrency';
import { Image, FileText, MapPin, User, Calendar } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { PropertyReminder } from '@/types/reminder';
import { ReminderIndicator } from './ReminderIndicator';
import { StageCompletionIndicator } from './StageCompletionIndicator';

interface KanbanCardProps {
  property: CrmProperty;
  onClick: () => void;
  onShowCover?: (imageUrl: string) => void;
  onShowProposal?: (propertyId: string) => void;
  reminder?: PropertyReminder;
  onUpdateReminderInterval?: (propertyId: string, stage: PropertyStage, hours: number) => void;
  onSnoozeReminder?: (reminderId: string, hours: number) => void;
  completionStatus?: PropertyCompletionStatus;
}

export function KanbanCard({ 
  property, 
  onClick, 
  onShowCover, 
  onShowProposal,
  reminder,
  onUpdateReminderInterval,
  onSnoozeReminder,
  completionStatus,
}: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: property.id,
    data: { property },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  const daysInStage = differenceInDays(new Date(), new Date(property.stage_entered_at));

  const handleBadgeClick = (e: React.MouseEvent, type: 'cover' | 'proposal') => {
    e.stopPropagation();
    if (type === 'cover' && property.cover_image_url && onShowCover) {
      onShowCover(property.cover_image_url);
    } else if (type === 'proposal' && property.has_proposal && onShowProposal) {
      onShowProposal(property.id);
    }
  };

  // Determine card background based on completion status
  const getCardStyles = () => {
    if (!completionStatus || !completionStatus.isCriticalStage) {
      return 'bg-white border-gray-200 hover:border-gray-300';
    }
    
    if (completionStatus.isComplete) {
      // Complete critical stage - subtle green
      return 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300';
    }
    
    // Incomplete critical stage - subtle red
    return 'bg-red-50/50 border-red-200 hover:border-red-300';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`
        ${getCardStyles()} rounded-lg p-3 cursor-grab active:cursor-grabbing
        hover:shadow-md transition-all duration-200 shadow-sm border
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

      {/* Clickable Status Badges */}
      <div className="flex items-center gap-2 mb-2">
        {property.has_creatives && property.cover_image_url ? (
          <button
            onClick={(e) => handleBadgeClick(e, 'cover')}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium hover:bg-emerald-100 transition-colors cursor-pointer"
            title="Ver capa do imóvel"
          >
            <Image className="w-3 h-3" />
            Tem capa
          </button>
        ) : property.has_creatives ? (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium">
            <Image className="w-3 h-3" />
            Tem criativo
          </span>
        ) : null}

        {property.has_proposal ? (
          <button
            onClick={(e) => handleBadgeClick(e, 'proposal')}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-medium hover:bg-blue-100 transition-colors cursor-pointer"
            title="Ver proposta"
          >
            <FileText className="w-3 h-3" />
            Tem proposta
          </button>
        ) : (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium">
            <FileText className="w-3 h-3" />
            Sem proposta
          </span>
        )}
      </div>

      {/* Footer: Responsible & Days & Reminder */}
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
          {/* Stage completion indicator */}
          <StageCompletionIndicator status={completionStatus || null} variant="minimal" />

          {/* Reminder indicator */}
          {onUpdateReminderInterval && onSnoozeReminder && (
            <ReminderIndicator
              reminder={reminder}
              propertyId={property.id}
              currentStage={property.current_stage}
              onUpdateInterval={onUpdateReminderInterval}
              onSnooze={onSnoozeReminder}
            />
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
