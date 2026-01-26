import { PropertyStage } from './crm';

export interface StageCompletionRequirement {
  id: string;
  stage: PropertyStage;
  requires_document: boolean;
  document_label: string | null;
  requires_responsible_user: boolean;
  requires_notes: boolean;
  requires_value: boolean;
  is_critical_stage: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyCompletionStatus {
  propertyId: string;
  stage: PropertyStage;
  isComplete: boolean;
  isCriticalStage: boolean;
  missingItems: CompletionItem[];
  completedItems: CompletionItem[];
  completionPercentage: number;
}

export interface CompletionItem {
  key: 'document' | 'responsible_user' | 'notes' | 'value';
  label: string;
  isComplete: boolean;
  documentLabel?: string;
}

export interface IncompletePropertyView {
  propertyId: string;
  code: string;
  propertyType: string;
  neighborhood: string | null;
  city: string;
  state: string;
  stage: PropertyStage;
  stageLabel: string;
  responsibleUserName: string | null;
  daysInStage: number;
  hoursInStage: number;
  missingItems: string[];
  isCriticalStage: boolean;
  saleValue: number | null;
}
