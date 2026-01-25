import { PropertyStage } from './crm';

export interface StageReminderDefault {
  id: string;
  stage: PropertyStage;
  default_interval_hours: number;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyReminder {
  id: string;
  property_id: string;
  stage: PropertyStage;
  interval_hours: number;
  next_reminder_at: string;
  is_active: boolean;
  is_custom: boolean;
  created_by_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export type ReminderStatus = 'overdue' | 'due_soon' | 'upcoming' | 'none';

export const INTERVAL_OPTIONS = [
  { value: 12, label: '12 horas' },
  { value: 24, label: '24 horas' },
  { value: 48, label: '48 horas' },
  { value: 72, label: '3 dias' },
  { value: 168, label: '7 dias' },
];

export function getReminderStatus(nextReminderAt: string | null): ReminderStatus {
  if (!nextReminderAt) return 'none';
  
  const now = new Date();
  const reminderTime = new Date(nextReminderAt);
  const hoursUntil = (reminderTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursUntil < 0) return 'overdue';
  if (hoursUntil <= 2) return 'due_soon';
  return 'upcoming';
}

export function formatTimeUntil(nextReminderAt: string): string {
  const now = new Date();
  const reminderTime = new Date(nextReminderAt);
  const diffMs = reminderTime.getTime() - now.getTime();
  const diffHours = Math.abs(diffMs) / (1000 * 60 * 60);
  
  const isOverdue = diffMs < 0;
  const prefix = isOverdue ? 'há ' : 'em ';
  
  if (diffHours < 1) {
    const mins = Math.round(Math.abs(diffMs) / (1000 * 60));
    return `${prefix}${mins}min`;
  }
  if (diffHours < 24) {
    return `${prefix}${Math.round(diffHours)}h`;
  }
  const days = Math.round(diffHours / 24);
  return `${prefix}${days}d`;
}
