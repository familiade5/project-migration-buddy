import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CrmProperty } from '@/types/crm';
import { CrmClientSearch, ClientMatch } from '@/types/clientSearch';
import { CrmClient } from '@/types/client';

/** Returns how many clients are waiting for a given property */
export function usePropertyMatches(property: CrmProperty | null) {
  const [matches, setMatches] = useState<ClientMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMatches = useCallback(async () => {
    if (!property) { setMatches([]); return; }
    setIsLoading(true);
    try {
      // Fetch all active client searches
      const { data: searches, error } = await supabase
        .from('crm_client_searches')
        .select('*, crm_clients(id, full_name, phone, whatsapp)')
        .eq('is_active', true);

      if (error) throw error;

      const result: ClientMatch[] = [];
      for (const row of (searches || [])) {
        const s = row as any;
        const matchResult = matchPropertyToSearch(property, s as CrmClientSearch);
        if (matchResult.score > 0) {
          result.push({
            client_id: s.client_id,
            client_name: s.crm_clients?.full_name || 'Cliente',
            client_phone: s.crm_clients?.phone || null,
            client_whatsapp: s.crm_clients?.whatsapp || null,
            search: s as CrmClientSearch,
            match_score: matchResult.score,
            matched_criteria: matchResult.criteria,
          });
        }
      }
      result.sort((a, b) => b.match_score - a.match_score);
      setMatches(result);
    } catch (error) {
      console.error('Error fetching property matches:', error);
    } finally {
      setIsLoading(false);
    }
  }, [property?.id]);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  return { matches, isLoading };
}

/** Returns compatible properties for a client search profile */
export function useClientCompatibleProperties(search: CrmClientSearch | null, properties: CrmProperty[]) {
  if (!search) return [];
  return properties
    .map(p => ({ property: p, ...matchPropertyToSearch(p, search) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

/** Core matching logic */
function matchPropertyToSearch(
  property: CrmProperty,
  search: CrmClientSearch
): { score: number; criteria: string[] } {
  const criteria: string[] = [];
  let total = 0;
  let matched = 0;

  // Type match
  if (search.property_types && search.property_types.length > 0) {
    total++;
    if (search.property_types.includes(property.property_type)) {
      matched++;
      criteria.push('Tipo de imóvel');
    }
  }

  // Value range
  if (search.min_value !== null || search.max_value !== null) {
    total++;
    if (property.sale_value !== null) {
      const aboveMin = search.min_value === null || property.sale_value >= search.min_value;
      const belowMax = search.max_value === null || property.sale_value <= search.max_value;
      if (aboveMin && belowMax) {
        matched++;
        criteria.push('Faixa de valor');
      }
    }
  }

  // City match
  if (search.cities && search.cities.length > 0) {
    total++;
    const propertyCity = property.city?.toLowerCase().trim();
    if (search.cities.some(c => c.toLowerCase().trim() === propertyCity)) {
      matched++;
      criteria.push('Cidade');
    }
  }

  // Neighborhood match
  if (search.neighborhoods && search.neighborhoods.length > 0) {
    total++;
    const propertyNeighborhood = property.neighborhood?.toLowerCase().trim();
    if (propertyNeighborhood && search.neighborhoods.some(n => n.toLowerCase().trim() === propertyNeighborhood)) {
      matched++;
      criteria.push('Bairro');
    }
  }

  // Financing — only strict if client requires it
  if (search.accepts_financing === true) {
    total++;
    // We check property notes for "financiamento" as a proxy (property type doesn't have this field)
    // We'll use a flag we pass from property data if available
    // For now, this criterion won't auto-match unless specifically stored
    // This is left as a soft check — score 0 if not satisfied
  }

  if (total === 0) return { score: 0, criteria: [] };
  const score = Math.round((matched / total) * 100);
  return { score, criteria };
}

/** Summary count for kanban badge */
export function useAllPropertyMatchCounts(properties: CrmProperty[]) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    if (properties.length === 0) return;
    setIsLoading(true);
    try {
      const { data: searches, error } = await supabase
        .from('crm_client_searches')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      const result: Record<string, number> = {};
      for (const property of properties) {
        let count = 0;
        for (const s of (searches || [])) {
          const { score } = matchPropertyToSearch(property, s as CrmClientSearch);
          if (score > 0) count++;
        }
        if (count > 0) result[property.id] = count;
      }
      setCounts(result);
    } catch (error) {
      console.error('Error computing match counts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [properties]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { counts, isLoading };
}
