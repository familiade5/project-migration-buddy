import { Bell, BellOff, Clock } from 'lucide-react';
import { PropertyReminder, getReminderStatus, formatTimeUntil, INTERVAL_OPTIONS } from '@/types/reminder';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { PropertyStage } from '@/types/crm';

interface ReminderIndicatorProps {
  reminder: PropertyReminder | undefined;
  propertyId: string;
  currentStage: PropertyStage;
  onUpdateInterval: (propertyId: string, stage: PropertyStage, hours: number) => void;
  onSnooze: (reminderId: string, hours: number) => void;
}

export function ReminderIndicator({
  reminder,
  propertyId,
  currentStage,
  onUpdateInterval,
  onSnooze,
}: ReminderIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!reminder) {
    return (
      <div className="flex items-center gap-1 text-gray-400" title="Sem lembrete ativo">
        <BellOff className="w-3 h-3" />
      </div>
    );
  }

  const status = getReminderStatus(reminder.next_reminder_at);
  const timeLabel = formatTimeUntil(reminder.next_reminder_at);

  const statusConfig = {
    overdue: {
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      ringColor: 'ring-red-200',
      label: 'Atrasado',
    },
    due_soon: {
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-700',
      ringColor: 'ring-amber-200',
      label: 'Em breve',
    },
    upcoming: {
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
      ringColor: 'ring-gray-200',
      label: 'Agendado',
    },
    none: {
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-500',
      ringColor: 'ring-gray-200',
      label: 'Sem lembrete',
    },
  };

  const config = statusConfig[status];

  const handleIntervalChange = (value: string) => {
    onUpdateInterval(propertyId, currentStage, parseInt(value));
    setIsOpen(false);
  };

  const handleSnooze = (hours: number) => {
    onSnooze(reminder.id, hours);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className={`
            flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium
            transition-all duration-200 hover:ring-1
            ${config.bgColor} ${config.textColor} ${config.ringColor}
            ${status === 'overdue' ? 'animate-pulse' : ''}
          `}
          title={`${config.label}: ${timeLabel}`}
        >
          <Bell className="w-2.5 h-2.5" />
          <span>{timeLabel}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-3"
        align="start"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-3">
          <div className="text-xs font-medium text-gray-700">
            Configurar Lembrete
          </div>

          {/* Current status */}
          <div className={`text-xs p-2 rounded ${config.bgColor} ${config.textColor}`}>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>{config.label}: {timeLabel}</span>
            </div>
            {reminder.is_custom && (
              <span className="text-[10px] opacity-70 ml-4">
                (intervalo personalizado)
              </span>
            )}
          </div>

          {/* Interval selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-gray-500">
              Intervalo de repetição
            </label>
            <Select
              value={reminder.interval_hours.toString()}
              onValueChange={handleIntervalChange}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INTERVAL_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value.toString()}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Snooze buttons */}
          {status === 'overdue' && (
            <div className="space-y-1.5">
              <label className="text-[11px] text-gray-500">
                Adiar lembrete
              </label>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-7 text-xs"
                  onClick={() => handleSnooze(2)}
                >
                  2h
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-7 text-xs"
                  onClick={() => handleSnooze(24)}
                >
                  24h
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-7 text-xs"
                  onClick={() => handleSnooze(48)}
                >
                  48h
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
