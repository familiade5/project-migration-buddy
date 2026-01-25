import { Bell, ChevronRight, Clock } from 'lucide-react';
import { PropertyReminder, getReminderStatus, formatTimeUntil } from '@/types/reminder';
import { CrmProperty, STAGE_CONFIG } from '@/types/crm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

interface RemindersPanelProps {
  reminders: PropertyReminder[];
  properties: CrmProperty[];
  onPropertyClick: (property: CrmProperty) => void;
  onSnooze: (reminderId: string, hours: number) => void;
}

export function RemindersPanel({
  reminders,
  properties,
  onPropertyClick,
  onSnooze,
}: RemindersPanelProps) {
  const activeReminders = reminders.filter((r) => r.is_active);
  const overdueCount = activeReminders.filter(
    (r) => getReminderStatus(r.next_reminder_at) === 'overdue'
  ).length;

  const sortedReminders = [...activeReminders].sort((a, b) => {
    const statusOrder = { overdue: 0, due_soon: 1, upcoming: 2, none: 3 };
    const statusA = getReminderStatus(a.next_reminder_at);
    const statusB = getReminderStatus(b.next_reminder_at);
    return statusOrder[statusA] - statusOrder[statusB];
  });

  const getPropertyForReminder = (reminder: PropertyReminder) => {
    return properties.find((p) => p.id === reminder.property_id);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative gap-2 text-gray-600 hover:text-gray-900"
        >
          <Bell className="w-4 h-4" />
          <span className="hidden sm:inline">Lembretes</span>
          {overdueCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
              {overdueCount}
            </span>
          )}
          {overdueCount === 0 && activeReminders.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
              {activeReminders.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[380px] sm:w-[420px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Lembretes Pendentes
            {overdueCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {overdueCount} atrasado{overdueCount > 1 ? 's' : ''}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)] mt-4 pr-4">
          {sortedReminders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <Bell className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm">Nenhum lembrete ativo</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedReminders.map((reminder) => {
                const property = getPropertyForReminder(reminder);
                if (!property) return null;

                const status = getReminderStatus(reminder.next_reminder_at);
                const timeLabel = formatTimeUntil(reminder.next_reminder_at);
                const stageConfig = STAGE_CONFIG[reminder.stage];

                const statusStyles = {
                  overdue: 'border-red-200 bg-red-50',
                  due_soon: 'border-amber-200 bg-amber-50',
                  upcoming: 'border-gray-200 bg-white',
                  none: 'border-gray-200 bg-white',
                };

                return (
                  <div
                    key={reminder.id}
                    className={`
                      p-3 rounded-lg border cursor-pointer
                      transition-all duration-200 hover:shadow-md
                      ${statusStyles[status]}
                    `}
                    onClick={() => onPropertyClick(property)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                            {property.code}
                          </span>
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: stageConfig.bgColor,
                              color: stageConfig.color,
                            }}
                          >
                            {stageConfig.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 truncate">
                          {property.neighborhood || property.city}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <div
                          className={`
                            flex items-center gap-1 text-xs font-medium
                            ${status === 'overdue' ? 'text-red-600' : ''}
                            ${status === 'due_soon' ? 'text-amber-600' : ''}
                            ${status === 'upcoming' ? 'text-gray-500' : ''}
                          `}
                        >
                          <Clock className="w-3 h-3" />
                          {timeLabel}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {status === 'overdue' && (
                      <div className="flex gap-1 mt-2 pt-2 border-t border-red-200">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex-1 h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSnooze(reminder.id, 2);
                          }}
                        >
                          +2h
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex-1 h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSnooze(reminder.id, 24);
                          }}
                        >
                          +24h
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex-1 h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSnooze(reminder.id, 48);
                          }}
                        >
                          +48h
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
