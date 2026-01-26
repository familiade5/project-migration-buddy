export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          resource_id: string | null
          resource_type: string | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          resource_id?: string | null
          resource_type?: string | null
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          resource_id?: string | null
          resource_type?: string | null
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      broker_documents: {
        Row: {
          broker_id: string
          created_at: string
          document_type: string
          file_url: string
          id: string
          name: string
          uploaded_by_user_id: string | null
        }
        Insert: {
          broker_id: string
          created_at?: string
          document_type: string
          file_url: string
          id?: string
          name: string
          uploaded_by_user_id?: string | null
        }
        Update: {
          broker_id?: string
          created_at?: string
          document_type?: string
          file_url?: string
          id?: string
          name?: string
          uploaded_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "broker_documents_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "broker_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      broker_profiles: {
        Row: {
          agency_id: string | null
          bank_account: string | null
          bank_agency: string | null
          bank_name: string | null
          birth_date: string | null
          commission_percentage: number
          contract_url: string | null
          cpf: string | null
          created_at: string
          creci_number: string | null
          creci_state: string | null
          hired_at: string | null
          id: string
          job_title: string
          personal_email: string | null
          personal_phone: string | null
          photo_url: string | null
          pix_key: string | null
          resume_url: string | null
          rg: string | null
          specializations: string[] | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          agency_id?: string | null
          bank_account?: string | null
          bank_agency?: string | null
          bank_name?: string | null
          birth_date?: string | null
          commission_percentage?: number
          contract_url?: string | null
          cpf?: string | null
          created_at?: string
          creci_number?: string | null
          creci_state?: string | null
          hired_at?: string | null
          id?: string
          job_title?: string
          personal_email?: string | null
          personal_phone?: string | null
          photo_url?: string | null
          pix_key?: string | null
          resume_url?: string | null
          rg?: string | null
          specializations?: string[] | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          agency_id?: string | null
          bank_account?: string | null
          bank_agency?: string | null
          bank_name?: string | null
          birth_date?: string | null
          commission_percentage?: number
          contract_url?: string | null
          cpf?: string | null
          created_at?: string
          creci_number?: string | null
          creci_state?: string | null
          hired_at?: string | null
          id?: string
          job_title?: string
          personal_email?: string | null
          personal_phone?: string | null
          photo_url?: string | null
          pix_key?: string | null
          resume_url?: string | null
          rg?: string | null
          specializations?: string[] | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "broker_profiles_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "real_estate_agency"
            referencedColumns: ["id"]
          },
        ]
      }
      broker_questionnaire: {
        Row: {
          additional_notes: string | null
          availability: string | null
          broker_id: string
          career_goals: string | null
          created_at: string
          experience_years: number | null
          id: string
          improvement_areas: string | null
          monthly_sales_goal: number | null
          motivation: string | null
          previous_experience: string | null
          referral_source: string | null
          strengths: string | null
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          availability?: string | null
          broker_id: string
          career_goals?: string | null
          created_at?: string
          experience_years?: number | null
          id?: string
          improvement_areas?: string | null
          monthly_sales_goal?: number | null
          motivation?: string | null
          previous_experience?: string | null
          referral_source?: string | null
          strengths?: string | null
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          availability?: string | null
          broker_id?: string
          career_goals?: string | null
          created_at?: string
          experience_years?: number | null
          id?: string
          improvement_areas?: string | null
          monthly_sales_goal?: number | null
          motivation?: string | null
          previous_experience?: string | null
          referral_source?: string | null
          strengths?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "broker_questionnaire_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "broker_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creatives: {
        Row: {
          created_at: string | null
          exported_images: string[] | null
          format: string | null
          id: string
          photos: string[] | null
          property_data: Json
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          exported_images?: string[] | null
          format?: string | null
          id?: string
          photos?: string[] | null
          property_data: Json
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          exported_images?: string[] | null
          format?: string | null
          id?: string
          photos?: string[] | null
          property_data?: Json
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      crecis: {
        Row: {
          agency_id: string
          created_at: string
          creci_number: string
          id: string
          is_active: boolean
          is_default: boolean
          name: string | null
          state: string
          updated_at: string
        }
        Insert: {
          agency_id: string
          created_at?: string
          creci_number: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          name?: string | null
          state?: string
          updated_at?: string
        }
        Update: {
          agency_id?: string
          created_at?: string
          creci_number?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          name?: string | null
          state?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crecis_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "real_estate_agency"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_client_documents: {
        Row: {
          client_id: string
          created_at: string
          document_type: string
          file_url: string
          id: string
          name: string
          uploaded_by_user_id: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          document_type?: string
          file_url: string
          id?: string
          name: string
          uploaded_by_user_id?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          document_type?: string
          file_url?: string
          id?: string
          name?: string
          uploaded_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_client_documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_clients: {
        Row: {
          address: string | null
          birth_date: string | null
          city: string | null
          cpf: string | null
          created_at: string
          created_by_user_id: string | null
          email: string | null
          full_name: string
          id: string
          neighborhood: string | null
          notes: string | null
          phone: string | null
          rg: string | null
          state: string | null
          updated_at: string
          whatsapp: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string
          created_by_user_id?: string | null
          email?: string | null
          full_name: string
          id?: string
          neighborhood?: string | null
          notes?: string | null
          phone?: string | null
          rg?: string | null
          state?: string | null
          updated_at?: string
          whatsapp?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string
          created_by_user_id?: string | null
          email?: string | null
          full_name?: string
          id?: string
          neighborhood?: string | null
          notes?: string | null
          phone?: string | null
          rg?: string | null
          state?: string | null
          updated_at?: string
          whatsapp?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      crm_edit_permissions: {
        Row: {
          granted_at: string
          granted_by_user_id: string
          id: string
          property_id: string | null
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by_user_id: string
          id?: string
          property_id?: string | null
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by_user_id?: string
          id?: string
          property_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_edit_permissions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "crm_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_properties: {
        Row: {
          address: string | null
          city: string
          client_id: string | null
          code: string
          commission_percentage: number | null
          commission_value: number | null
          cover_image_url: string | null
          created_at: string
          created_by_user_id: string | null
          current_stage: Database["public"]["Enums"]["property_stage"]
          expected_payment_date: string | null
          has_creatives: boolean
          has_proposal: boolean
          id: string
          neighborhood: string | null
          notes: string | null
          property_type: Database["public"]["Enums"]["property_type"]
          responsible_user_id: string | null
          sale_value: number | null
          source_creative_id: string | null
          stage_entered_at: string
          state: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          city: string
          client_id?: string | null
          code: string
          commission_percentage?: number | null
          commission_value?: number | null
          cover_image_url?: string | null
          created_at?: string
          created_by_user_id?: string | null
          current_stage?: Database["public"]["Enums"]["property_stage"]
          expected_payment_date?: string | null
          has_creatives?: boolean
          has_proposal?: boolean
          id?: string
          neighborhood?: string | null
          notes?: string | null
          property_type?: Database["public"]["Enums"]["property_type"]
          responsible_user_id?: string | null
          sale_value?: number | null
          source_creative_id?: string | null
          stage_entered_at?: string
          state?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string
          client_id?: string | null
          code?: string
          commission_percentage?: number | null
          commission_value?: number | null
          cover_image_url?: string | null
          created_at?: string
          created_by_user_id?: string | null
          current_stage?: Database["public"]["Enums"]["property_stage"]
          expected_payment_date?: string | null
          has_creatives?: boolean
          has_proposal?: boolean
          id?: string
          neighborhood?: string | null
          notes?: string | null
          property_type?: Database["public"]["Enums"]["property_type"]
          responsible_user_id?: string | null
          sale_value?: number | null
          source_creative_id?: string | null
          stage_entered_at?: string
          state?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_properties_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_property_commissions: {
        Row: {
          created_at: string
          id: string
          is_paid: boolean
          paid_at: string | null
          payment_method: string | null
          payment_proof_url: string | null
          percentage: number
          property_id: string
          user_id: string | null
          user_name: string
          value: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_paid?: boolean
          paid_at?: string | null
          payment_method?: string | null
          payment_proof_url?: string | null
          percentage: number
          property_id: string
          user_id?: string | null
          user_name: string
          value?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          is_paid?: boolean
          paid_at?: string | null
          payment_method?: string | null
          payment_proof_url?: string | null
          percentage?: number
          property_id?: string
          user_id?: string | null
          user_name?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_property_commissions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "crm_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_property_documents: {
        Row: {
          created_at: string
          file_url: string
          id: string
          name: string
          property_id: string
          uploaded_by_user_id: string | null
        }
        Insert: {
          created_at?: string
          file_url: string
          id?: string
          name: string
          property_id: string
          uploaded_by_user_id?: string | null
        }
        Update: {
          created_at?: string
          file_url?: string
          id?: string
          name?: string
          property_id?: string
          uploaded_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_property_documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "crm_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_property_history: {
        Row: {
          created_at: string
          from_stage: Database["public"]["Enums"]["property_stage"] | null
          id: string
          moved_by_name: string | null
          moved_by_user_id: string | null
          notes: string | null
          property_id: string
          to_stage: Database["public"]["Enums"]["property_stage"]
        }
        Insert: {
          created_at?: string
          from_stage?: Database["public"]["Enums"]["property_stage"] | null
          id?: string
          moved_by_name?: string | null
          moved_by_user_id?: string | null
          notes?: string | null
          property_id: string
          to_stage: Database["public"]["Enums"]["property_stage"]
        }
        Update: {
          created_at?: string
          from_stage?: Database["public"]["Enums"]["property_stage"] | null
          id?: string
          moved_by_name?: string | null
          moved_by_user_id?: string | null
          notes?: string | null
          property_id?: string
          to_stage?: Database["public"]["Enums"]["property_stage"]
        }
        Relationships: [
          {
            foreignKeyName: "crm_property_history_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "crm_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_property_reminders: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          id: string
          interval_hours: number
          is_active: boolean
          is_custom: boolean
          next_reminder_at: string
          property_id: string
          stage: Database["public"]["Enums"]["property_stage"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          interval_hours?: number
          is_active?: boolean
          is_custom?: boolean
          next_reminder_at: string
          property_id: string
          stage: Database["public"]["Enums"]["property_stage"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          interval_hours?: number
          is_active?: boolean
          is_custom?: boolean
          next_reminder_at?: string
          property_id?: string
          stage?: Database["public"]["Enums"]["property_stage"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_property_reminders_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "crm_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_stage_completion_requirements: {
        Row: {
          created_at: string
          document_label: string | null
          id: string
          is_critical_stage: boolean
          requires_document: boolean
          requires_notes: boolean
          requires_responsible_user: boolean
          requires_value: boolean
          stage: Database["public"]["Enums"]["property_stage"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_label?: string | null
          id?: string
          is_critical_stage?: boolean
          requires_document?: boolean
          requires_notes?: boolean
          requires_responsible_user?: boolean
          requires_value?: boolean
          stage: Database["public"]["Enums"]["property_stage"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_label?: string | null
          id?: string
          is_critical_stage?: boolean
          requires_document?: boolean
          requires_notes?: boolean
          requires_responsible_user?: boolean
          requires_value?: boolean
          stage?: Database["public"]["Enums"]["property_stage"]
          updated_at?: string
        }
        Relationships: []
      }
      crm_stage_reminder_defaults: {
        Row: {
          created_at: string
          default_interval_hours: number
          id: string
          is_enabled: boolean
          stage: Database["public"]["Enums"]["property_stage"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_interval_hours?: number
          id?: string
          is_enabled?: boolean
          stage: Database["public"]["Enums"]["property_stage"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_interval_hours?: number
          id?: string
          is_enabled?: boolean
          stage?: Database["public"]["Enums"]["property_stage"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          temp_password: boolean | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          temp_password?: boolean | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          temp_password?: boolean | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      real_estate_agency: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      rental_alert_configs: {
        Row: {
          alert_type: string
          created_at: string
          days_offset: number
          id: string
          is_enabled: boolean
          message_template: string | null
          updated_at: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          days_offset: number
          id?: string
          is_enabled?: boolean
          message_template?: string | null
          updated_at?: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          days_offset?: number
          id?: string
          is_enabled?: boolean
          message_template?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rental_contract_documents: {
        Row: {
          contract_id: string
          created_at: string
          document_type: string
          file_url: string
          id: string
          name: string
          uploaded_by_user_id: string | null
        }
        Insert: {
          contract_id: string
          created_at?: string
          document_type?: string
          file_url: string
          id?: string
          name: string
          uploaded_by_user_id?: string | null
        }
        Update: {
          contract_id?: string
          created_at?: string
          document_type?: string
          file_url?: string
          id?: string
          name?: string
          uploaded_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rental_contract_documents_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "rental_contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_contracts: {
        Row: {
          condominium_fee: number | null
          contract_document_url: string | null
          created_at: string
          created_by_user_id: string | null
          deposit_months: number | null
          deposit_value: number | null
          end_date: string
          guarantee_type: string | null
          id: string
          iptu_value: number | null
          management_fee_percentage: number | null
          notes: string | null
          other_fees: number | null
          owner_bank_info: string | null
          owner_email: string | null
          owner_name: string
          owner_phone: string | null
          owner_pix_key: string | null
          payment_due_day: number
          property_address: string
          property_city: string
          property_code: string
          property_neighborhood: string | null
          property_state: string
          property_type: string
          rent_value: number
          responsible_user_id: string | null
          start_date: string
          status: Database["public"]["Enums"]["rental_contract_status"]
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          condominium_fee?: number | null
          contract_document_url?: string | null
          created_at?: string
          created_by_user_id?: string | null
          deposit_months?: number | null
          deposit_value?: number | null
          end_date: string
          guarantee_type?: string | null
          id?: string
          iptu_value?: number | null
          management_fee_percentage?: number | null
          notes?: string | null
          other_fees?: number | null
          owner_bank_info?: string | null
          owner_email?: string | null
          owner_name: string
          owner_phone?: string | null
          owner_pix_key?: string | null
          payment_due_day?: number
          property_address: string
          property_city?: string
          property_code: string
          property_neighborhood?: string | null
          property_state?: string
          property_type?: string
          rent_value: number
          responsible_user_id?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["rental_contract_status"]
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          condominium_fee?: number | null
          contract_document_url?: string | null
          created_at?: string
          created_by_user_id?: string | null
          deposit_months?: number | null
          deposit_value?: number | null
          end_date?: string
          guarantee_type?: string | null
          id?: string
          iptu_value?: number | null
          management_fee_percentage?: number | null
          notes?: string | null
          other_fees?: number | null
          owner_bank_info?: string | null
          owner_email?: string | null
          owner_name?: string
          owner_phone?: string | null
          owner_pix_key?: string | null
          payment_due_day?: number
          property_address?: string
          property_city?: string
          property_code?: string
          property_neighborhood?: string | null
          property_state?: string
          property_type?: string
          rent_value?: number
          responsible_user_id?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["rental_contract_status"]
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rental_contracts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_payments: {
        Row: {
          condominium_fee: number | null
          contract_id: string
          created_at: string
          discount: number | null
          due_date: string
          external_payment_id: string | null
          external_payment_url: string | null
          id: string
          iptu_value: number | null
          late_fee: number | null
          notes: string | null
          other_fees: number | null
          paid_amount: number | null
          paid_at: string | null
          payment_method: string | null
          payment_proof_url: string | null
          reference_month: number
          reference_year: number
          rent_value: number
          status: Database["public"]["Enums"]["rental_payment_status"]
          updated_at: string
        }
        Insert: {
          condominium_fee?: number | null
          contract_id: string
          created_at?: string
          discount?: number | null
          due_date: string
          external_payment_id?: string | null
          external_payment_url?: string | null
          id?: string
          iptu_value?: number | null
          late_fee?: number | null
          notes?: string | null
          other_fees?: number | null
          paid_amount?: number | null
          paid_at?: string | null
          payment_method?: string | null
          payment_proof_url?: string | null
          reference_month: number
          reference_year: number
          rent_value: number
          status?: Database["public"]["Enums"]["rental_payment_status"]
          updated_at?: string
        }
        Update: {
          condominium_fee?: number | null
          contract_id?: string
          created_at?: string
          discount?: number | null
          due_date?: string
          external_payment_id?: string | null
          external_payment_url?: string | null
          id?: string
          iptu_value?: number | null
          late_fee?: number | null
          notes?: string | null
          other_fees?: number | null
          paid_amount?: number | null
          paid_at?: string | null
          payment_method?: string | null
          payment_proof_url?: string | null
          reference_month?: number
          reference_year?: number
          rent_value?: number
          status?: Database["public"]["Enums"]["rental_payment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rental_payments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "rental_contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_edit_crm_property: {
        Args: { _property_id: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_user_activity: {
        Args: {
          p_action: string
          p_details?: Json
          p_resource_id?: string
          p_resource_type?: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "user"
      property_stage:
        | "novo_imovel"
        | "em_anuncio"
        | "proposta_recebida"
        | "proposta_aceita"
        | "documentacao_enviada"
        | "registro_em_andamento"
        | "registro_concluido"
        | "aguardando_pagamento"
        | "pago"
        | "comissao_liberada"
      property_type:
        | "casa"
        | "apartamento"
        | "terreno"
        | "comercial"
        | "rural"
        | "outro"
      rental_contract_status:
        | "active"
        | "ending_soon"
        | "expired"
        | "terminated"
        | "renewed"
      rental_payment_status:
        | "pending"
        | "paid"
        | "overdue"
        | "partial"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      property_stage: [
        "novo_imovel",
        "em_anuncio",
        "proposta_recebida",
        "proposta_aceita",
        "documentacao_enviada",
        "registro_em_andamento",
        "registro_concluido",
        "aguardando_pagamento",
        "pago",
        "comissao_liberada",
      ],
      property_type: [
        "casa",
        "apartamento",
        "terreno",
        "comercial",
        "rural",
        "outro",
      ],
      rental_contract_status: [
        "active",
        "ending_soon",
        "expired",
        "terminated",
        "renewed",
      ],
      rental_payment_status: [
        "pending",
        "paid",
        "overdue",
        "partial",
        "cancelled",
      ],
    },
  },
} as const
