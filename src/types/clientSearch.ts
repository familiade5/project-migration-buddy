import { PropertyType } from '@/types/crm';

export interface CrmClientSearch {
  id: string;
  client_id: string;
  property_types: string[] | null;
  min_value: number | null;
  max_value: number | null;
  cities: string[] | null;
  neighborhoods: string[] | null;
  accepts_financing: boolean | null;
  min_bedrooms: number | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClientSearchFormData {
  property_types: string[];
  min_value: string;
  max_value: string;
  cities: string;
  neighborhoods: string;
  accepts_financing: 'yes' | 'no' | 'any';
  min_bedrooms: string;
  notes: string;
  is_active: boolean;
}

export interface ClientMatch {
  client_id: string;
  client_name: string;
  client_phone: string | null;
  client_whatsapp: string | null;
  search: CrmClientSearch;
  match_score: number; // 0-100
  matched_criteria: string[];
}
