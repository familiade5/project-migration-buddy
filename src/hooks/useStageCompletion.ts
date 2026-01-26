import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CrmProperty, PropertyStage, STAGE_CONFIG, PROPERTY_TYPE_LABELS } from '@/types/crm';
import {
  StageCompletionRequirement,
  PropertyCompletionStatus,
  CompletionItem,
  IncompletePropertyView,
} from '@/types/stageCompletion';
import { differenceInDays, differenceInHours } from 'date-fns';

export function useStageCompletionRequirements() {
  const [requirements, setRequirements] = useState<StageCompletionRequirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const { data, error } = await supabase
          .from('crm_stage_completion_requirements')
          .select('*')
          .order('stage');

        if (error) throw error;
        setRequirements(data || []);
      } catch (error) {
        console.error('Error fetching stage requirements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequirements();
  }, []);

  const getRequirementForStage = useCallback(
    (stage: PropertyStage): StageCompletionRequirement | undefined => {
      return requirements.find((r) => r.stage === stage);
    },
    [requirements]
  );

  return { requirements, isLoading, getRequirementForStage };
}

export function usePropertyDocuments(propertyId: string | null) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!propertyId) {
      setDocuments([]);
      return;
    }

    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('crm_property_documents')
          .select('*')
          .eq('property_id', propertyId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDocuments(data || []);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [propertyId]);

  return { documents, isLoading };
}

export function usePropertyCompletionStatus(
  property: CrmProperty | null,
  requirements: StageCompletionRequirement[],
  documents: any[]
): PropertyCompletionStatus | null {
  return useMemo(() => {
    if (!property) return null;

    const requirement = requirements.find((r) => r.stage === property.current_stage);
    if (!requirement) {
      return {
        propertyId: property.id,
        stage: property.current_stage,
        isComplete: true,
        isCriticalStage: false,
        missingItems: [],
        completedItems: [],
        completionPercentage: 100,
      };
    }

    const items: CompletionItem[] = [];

    // Check document requirement
    if (requirement.requires_document) {
      const hasDocument = documents.length > 0;
      items.push({
        key: 'document',
        label: requirement.document_label || 'Documento',
        isComplete: hasDocument,
        documentLabel: requirement.document_label || undefined,
      });
    }

    // Check responsible user requirement
    if (requirement.requires_responsible_user) {
      items.push({
        key: 'responsible_user',
        label: 'Responsável atribuído',
        isComplete: !!property.responsible_user_id,
      });
    }

    // Check notes requirement
    if (requirement.requires_notes) {
      items.push({
        key: 'notes',
        label: 'Observações preenchidas',
        isComplete: !!property.notes && property.notes.trim().length > 0,
      });
    }

    // Check value requirement
    if (requirement.requires_value) {
      items.push({
        key: 'value',
        label: 'Valor de venda definido',
        isComplete: !!property.sale_value && property.sale_value > 0,
      });
    }

    const completedItems = items.filter((i) => i.isComplete);
    const missingItems = items.filter((i) => !i.isComplete);
    const completionPercentage =
      items.length > 0 ? Math.round((completedItems.length / items.length) * 100) : 100;

    return {
      propertyId: property.id,
      stage: property.current_stage,
      isComplete: missingItems.length === 0,
      isCriticalStage: requirement.is_critical_stage,
      missingItems,
      completedItems,
      completionPercentage,
    };
  }, [property, requirements, documents]);
}

export function useAllPropertiesCompletionStatus(
  properties: CrmProperty[],
  requirements: StageCompletionRequirement[]
) {
  const [documentCounts, setDocumentCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocumentCounts = async () => {
      if (properties.length === 0) {
        setDocumentCounts({});
        setIsLoading(false);
        return;
      }

      try {
        const propertyIds = properties.map((p) => p.id);
        const { data, error } = await supabase
          .from('crm_property_documents')
          .select('property_id')
          .in('property_id', propertyIds);

        if (error) throw error;

        const counts: Record<string, number> = {};
        (data || []).forEach((doc) => {
          counts[doc.property_id] = (counts[doc.property_id] || 0) + 1;
        });
        setDocumentCounts(counts);
      } catch (error) {
        console.error('Error fetching document counts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentCounts();
  }, [properties]);

  const getCompletionStatus = useCallback(
    (property: CrmProperty): PropertyCompletionStatus => {
      const requirement = requirements.find((r) => r.stage === property.current_stage);
      if (!requirement) {
        return {
          propertyId: property.id,
          stage: property.current_stage,
          isComplete: true,
          isCriticalStage: false,
          missingItems: [],
          completedItems: [],
          completionPercentage: 100,
        };
      }

      const items: CompletionItem[] = [];
      const docCount = documentCounts[property.id] || 0;

      if (requirement.requires_document) {
        items.push({
          key: 'document',
          label: requirement.document_label || 'Documento',
          isComplete: docCount > 0,
          documentLabel: requirement.document_label || undefined,
        });
      }

      if (requirement.requires_responsible_user) {
        items.push({
          key: 'responsible_user',
          label: 'Responsável',
          isComplete: !!property.responsible_user_id,
        });
      }

      if (requirement.requires_notes) {
        items.push({
          key: 'notes',
          label: 'Observações',
          isComplete: !!property.notes && property.notes.trim().length > 0,
        });
      }

      if (requirement.requires_value) {
        items.push({
          key: 'value',
          label: 'Valor',
          isComplete: !!property.sale_value && property.sale_value > 0,
        });
      }

      const completedItems = items.filter((i) => i.isComplete);
      const missingItems = items.filter((i) => !i.isComplete);
      const completionPercentage =
        items.length > 0 ? Math.round((completedItems.length / items.length) * 100) : 100;

      return {
        propertyId: property.id,
        stage: property.current_stage,
        isComplete: missingItems.length === 0,
        isCriticalStage: requirement.is_critical_stage,
        missingItems,
        completedItems,
        completionPercentage,
      };
    },
    [requirements, documentCounts]
  );

  const incompleteProperties: IncompletePropertyView[] = useMemo(() => {
    if (isLoading) return [];

    return properties
      .map((property) => {
        const status = getCompletionStatus(property);
        if (status.isComplete) return null;

        const now = new Date();
        const stageEnteredAt = new Date(property.stage_entered_at);

        return {
          propertyId: property.id,
          code: property.code,
          propertyType: PROPERTY_TYPE_LABELS[property.property_type],
          neighborhood: property.neighborhood,
          city: property.city,
          state: property.state,
          stage: property.current_stage,
          stageLabel: STAGE_CONFIG[property.current_stage].label,
          responsibleUserName: property.responsible_user_name || null,
          daysInStage: differenceInDays(now, stageEnteredAt),
          hoursInStage: differenceInHours(now, stageEnteredAt),
          missingItems: status.missingItems.map((i) => i.label),
          isCriticalStage: status.isCriticalStage,
          saleValue: property.sale_value,
        };
      })
      .filter((p): p is IncompletePropertyView => p !== null)
      .sort((a, b) => {
        // Sort by: critical first, then by days in stage (descending)
        if (a.isCriticalStage !== b.isCriticalStage) {
          return a.isCriticalStage ? -1 : 1;
        }
        return b.daysInStage - a.daysInStage;
      });
  }, [properties, getCompletionStatus, isLoading]);

  const stats = useMemo(() => {
    const total = properties.length;
    const incomplete = incompleteProperties.length;
    const complete = total - incomplete;
    const criticalIncomplete = incompleteProperties.filter((p) => p.isCriticalStage).length;

    return { total, incomplete, complete, criticalIncomplete };
  }, [properties, incompleteProperties]);

  return {
    isLoading,
    getCompletionStatus,
    incompleteProperties,
    stats,
  };
}
