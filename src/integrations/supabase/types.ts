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
      autentique_signature_links: {
        Row: {
          contract_id: string
          created_at: string
          document_id: string
          id: string
          public_id: string
          short_link: string | null
          signed_at: string | null
          signer_email: string | null
          signer_name: string | null
          updated_at: string
        }
        Insert: {
          contract_id: string
          created_at?: string
          document_id: string
          id?: string
          public_id: string
          short_link?: string | null
          signed_at?: string | null
          signer_email?: string | null
          signer_name?: string | null
          updated_at?: string
        }
        Update: {
          contract_id?: string
          created_at?: string
          document_id?: string
          id?: string
          public_id?: string
          short_link?: string | null
          signed_at?: string | null
          signer_email?: string | null
          signer_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "autentique_signature_links_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "rental_contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      auto_post_queue: {
        Row: {
          approved_by_user_id: string | null
          created_at: string
          generated_caption: string | null
          id: string
          photos: string[] | null
          property_data: Json
          published_at: string | null
          rejection_reason: string | null
          scraped_property_id: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_by_user_id?: string | null
          created_at?: string
          generated_caption?: string | null
          id?: string
          photos?: string[] | null
          property_data: Json
          published_at?: string | null
          rejection_reason?: string | null
          scraped_property_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          approved_by_user_id?: string | null
          created_at?: string
          generated_caption?: string | null
          id?: string
          photos?: string[] | null
          property_data?: Json
          published_at?: string | null
          rejection_reason?: string | null
          scraped_property_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "auto_post_queue_scraped_property_id_fkey"
            columns: ["scraped_property_id"]
            isOneToOne: false
            referencedRelation: "scraped_properties"
            referencedColumns: ["id"]
          },
        ]
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
      crm_client_searches: {
        Row: {
          accepts_financing: boolean | null
          cities: string[] | null
          client_id: string
          created_at: string
          id: string
          is_active: boolean
          max_value: number | null
          min_bedrooms: number | null
          min_value: number | null
          neighborhoods: string[] | null
          notes: string | null
          property_types: string[] | null
          updated_at: string
        }
        Insert: {
          accepts_financing?: boolean | null
          cities?: string[] | null
          client_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          max_value?: number | null
          min_bedrooms?: number | null
          min_value?: number | null
          neighborhoods?: string[] | null
          notes?: string | null
          property_types?: string[] | null
          updated_at?: string
        }
        Update: {
          accepts_financing?: boolean | null
          cities?: string[] | null
          client_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          max_value?: number | null
          min_bedrooms?: number | null
          min_value?: number | null
          neighborhoods?: string[] | null
          notes?: string | null
          property_types?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_client_searches_client_id_fkey"
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
      crm_lead_history: {
        Row: {
          action: string
          created_at: string
          from_sales_stage: string | null
          from_sdr_stage: string | null
          id: string
          lead_id: string
          moved_by_name: string | null
          moved_by_user_id: string | null
          notes: string | null
          to_sales_stage: string | null
          to_sdr_stage: string | null
        }
        Insert: {
          action: string
          created_at?: string
          from_sales_stage?: string | null
          from_sdr_stage?: string | null
          id?: string
          lead_id: string
          moved_by_name?: string | null
          moved_by_user_id?: string | null
          notes?: string | null
          to_sales_stage?: string | null
          to_sdr_stage?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          from_sales_stage?: string | null
          from_sdr_stage?: string | null
          id?: string
          lead_id?: string
          moved_by_name?: string | null
          moved_by_user_id?: string | null
          notes?: string | null
          to_sales_stage?: string | null
          to_sdr_stage?: string | null
        }
        Relationships: []
      }
      crm_lead_interactions: {
        Row: {
          created_at: string
          created_by_name: string | null
          created_by_user_id: string | null
          descricao: string
          id: string
          lead_id: string
          tipo: string
        }
        Insert: {
          created_at?: string
          created_by_name?: string | null
          created_by_user_id?: string | null
          descricao: string
          id?: string
          lead_id: string
          tipo?: string
        }
        Update: {
          created_at?: string
          created_by_name?: string | null
          created_by_user_id?: string | null
          descricao?: string
          id?: string
          lead_id?: string
          tipo?: string
        }
        Relationships: []
      }
      crm_leads: {
        Row: {
          anotacoes: string | null
          cidade: string | null
          classificacao: Database["public"]["Enums"]["lead_classificacao"]
          created_at: string
          created_by_user_id: string | null
          data_entrada: string
          id: string
          momento_compra: boolean | null
          nome: string
          objecoes: string | null
          origem_lead: string | null
          proposal_id: string | null
          sales_responsavel_id: string | null
          sales_responsavel_nome: string | null
          sales_stage: Database["public"]["Enums"]["lead_sales_stage"] | null
          sdr_responsavel_id: string | null
          sdr_responsavel_nome: string | null
          sdr_stage: Database["public"]["Enums"]["lead_sdr_stage"]
          stage_entered_at: string
          telefone: string
          tem_condicao_financeira: boolean | null
          tem_interesse: boolean | null
          ultima_interacao_at: string | null
          updated_at: string
          valor_estimado: number | null
        }
        Insert: {
          anotacoes?: string | null
          cidade?: string | null
          classificacao?: Database["public"]["Enums"]["lead_classificacao"]
          created_at?: string
          created_by_user_id?: string | null
          data_entrada?: string
          id?: string
          momento_compra?: boolean | null
          nome: string
          objecoes?: string | null
          origem_lead?: string | null
          proposal_id?: string | null
          sales_responsavel_id?: string | null
          sales_responsavel_nome?: string | null
          sales_stage?: Database["public"]["Enums"]["lead_sales_stage"] | null
          sdr_responsavel_id?: string | null
          sdr_responsavel_nome?: string | null
          sdr_stage?: Database["public"]["Enums"]["lead_sdr_stage"]
          stage_entered_at?: string
          telefone: string
          tem_condicao_financeira?: boolean | null
          tem_interesse?: boolean | null
          ultima_interacao_at?: string | null
          updated_at?: string
          valor_estimado?: number | null
        }
        Update: {
          anotacoes?: string | null
          cidade?: string | null
          classificacao?: Database["public"]["Enums"]["lead_classificacao"]
          created_at?: string
          created_by_user_id?: string | null
          data_entrada?: string
          id?: string
          momento_compra?: boolean | null
          nome?: string
          objecoes?: string | null
          origem_lead?: string | null
          proposal_id?: string | null
          sales_responsavel_id?: string | null
          sales_responsavel_nome?: string | null
          sales_stage?: Database["public"]["Enums"]["lead_sales_stage"] | null
          sdr_responsavel_id?: string | null
          sdr_responsavel_nome?: string | null
          sdr_stage?: Database["public"]["Enums"]["lead_sdr_stage"]
          stage_entered_at?: string
          telefone?: string
          tem_condicao_financeira?: boolean | null
          tem_interesse?: boolean | null
          ultima_interacao_at?: string | null
          updated_at?: string
          valor_estimado?: number | null
        }
        Relationships: []
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
      proposal_checklist: {
        Row: {
          category: string
          created_at: string
          id: string
          item_key: string
          item_label: string
          observacao: string | null
          proposal_id: string
          status: Database["public"]["Enums"]["checklist_status"]
          updated_at: string
          updated_by_user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          item_key: string
          item_label: string
          observacao?: string | null
          proposal_id: string
          status?: Database["public"]["Enums"]["checklist_status"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          item_key?: string
          item_label?: string
          observacao?: string | null
          proposal_id?: string
          status?: Database["public"]["Enums"]["checklist_status"]
          updated_at?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposal_checklist_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_history: {
        Row: {
          action: string
          created_at: string
          from_stage: Database["public"]["Enums"]["proposal_stage"] | null
          id: string
          moved_by_name: string | null
          moved_by_user_id: string | null
          notes: string | null
          proposal_id: string
          to_stage: Database["public"]["Enums"]["proposal_stage"] | null
        }
        Insert: {
          action: string
          created_at?: string
          from_stage?: Database["public"]["Enums"]["proposal_stage"] | null
          id?: string
          moved_by_name?: string | null
          moved_by_user_id?: string | null
          notes?: string | null
          proposal_id: string
          to_stage?: Database["public"]["Enums"]["proposal_stage"] | null
        }
        Update: {
          action?: string
          created_at?: string
          from_stage?: Database["public"]["Enums"]["proposal_stage"] | null
          id?: string
          moved_by_name?: string | null
          moved_by_user_id?: string | null
          notes?: string | null
          proposal_id?: string
          to_stage?: Database["public"]["Enums"]["proposal_stage"] | null
        }
        Relationships: [
          {
            foreignKeyName: "proposal_history_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          agencia: string | null
          banco: string | null
          cidade: string | null
          corretor: string | null
          cpf: string | null
          created_at: string
          created_by_user_id: string | null
          email: string | null
          id: string
          imovel: string | null
          matricula: string | null
          nome: string
          notas: string | null
          oficio: string | null
          produto: string | null
          responsible_user_id: string | null
          stage: Database["public"]["Enums"]["proposal_stage"]
          stage_entered_at: string
          status: string
          telefone: string | null
          updated_at: string
          valor_financiamento: number | null
        }
        Insert: {
          agencia?: string | null
          banco?: string | null
          cidade?: string | null
          corretor?: string | null
          cpf?: string | null
          created_at?: string
          created_by_user_id?: string | null
          email?: string | null
          id?: string
          imovel?: string | null
          matricula?: string | null
          nome: string
          notas?: string | null
          oficio?: string | null
          produto?: string | null
          responsible_user_id?: string | null
          stage?: Database["public"]["Enums"]["proposal_stage"]
          stage_entered_at?: string
          status?: string
          telefone?: string | null
          updated_at?: string
          valor_financiamento?: number | null
        }
        Update: {
          agencia?: string | null
          banco?: string | null
          cidade?: string | null
          corretor?: string | null
          cpf?: string | null
          created_at?: string
          created_by_user_id?: string | null
          email?: string | null
          id?: string
          imovel?: string | null
          matricula?: string | null
          nome?: string
          notas?: string | null
          oficio?: string | null
          produto?: string | null
          responsible_user_id?: string | null
          stage?: Database["public"]["Enums"]["proposal_stage"]
          stage_entered_at?: string
          status?: string
          telefone?: string | null
          updated_at?: string
          valor_financiamento?: number | null
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
          allowed_activity: string | null
          commercial_point_clause: boolean | null
          condominium_fee: number | null
          contract_document_url: string | null
          contract_type:
            | Database["public"]["Enums"]["rental_contract_type"]
            | null
          created_at: string
          created_by_user_id: string | null
          deposit_months: number | null
          deposit_value: number | null
          end_date: string
          guarantee_type: string | null
          guarantee_type_enum:
            | Database["public"]["Enums"]["rental_guarantee_type"]
            | null
          guarantor_id: string | null
          id: string
          insurance_company: string | null
          insurance_policy_number: string | null
          insurance_value: number | null
          iptu_value: number | null
          management_fee_percentage: number | null
          notes: string | null
          other_fees: number | null
          owner_bank_info: string | null
          owner_email: string | null
          owner_id: string | null
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
          renovation_terms: string | null
          rent_value: number
          rental_property_id: string | null
          responsible_user_id: string | null
          start_date: string
          status: Database["public"]["Enums"]["rental_contract_status"]
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          allowed_activity?: string | null
          commercial_point_clause?: boolean | null
          condominium_fee?: number | null
          contract_document_url?: string | null
          contract_type?:
            | Database["public"]["Enums"]["rental_contract_type"]
            | null
          created_at?: string
          created_by_user_id?: string | null
          deposit_months?: number | null
          deposit_value?: number | null
          end_date: string
          guarantee_type?: string | null
          guarantee_type_enum?:
            | Database["public"]["Enums"]["rental_guarantee_type"]
            | null
          guarantor_id?: string | null
          id?: string
          insurance_company?: string | null
          insurance_policy_number?: string | null
          insurance_value?: number | null
          iptu_value?: number | null
          management_fee_percentage?: number | null
          notes?: string | null
          other_fees?: number | null
          owner_bank_info?: string | null
          owner_email?: string | null
          owner_id?: string | null
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
          renovation_terms?: string | null
          rent_value: number
          rental_property_id?: string | null
          responsible_user_id?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["rental_contract_status"]
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          allowed_activity?: string | null
          commercial_point_clause?: boolean | null
          condominium_fee?: number | null
          contract_document_url?: string | null
          contract_type?:
            | Database["public"]["Enums"]["rental_contract_type"]
            | null
          created_at?: string
          created_by_user_id?: string | null
          deposit_months?: number | null
          deposit_value?: number | null
          end_date?: string
          guarantee_type?: string | null
          guarantee_type_enum?:
            | Database["public"]["Enums"]["rental_guarantee_type"]
            | null
          guarantor_id?: string | null
          id?: string
          insurance_company?: string | null
          insurance_policy_number?: string | null
          insurance_value?: number | null
          iptu_value?: number | null
          management_fee_percentage?: number | null
          notes?: string | null
          other_fees?: number | null
          owner_bank_info?: string | null
          owner_email?: string | null
          owner_id?: string | null
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
          renovation_terms?: string | null
          rent_value?: number
          rental_property_id?: string | null
          responsible_user_id?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["rental_contract_status"]
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rental_contracts_guarantor_id_fkey"
            columns: ["guarantor_id"]
            isOneToOne: false
            referencedRelation: "rental_guarantors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rental_contracts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "rental_owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rental_contracts_rental_property_id_fkey"
            columns: ["rental_property_id"]
            isOneToOne: false
            referencedRelation: "rental_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rental_contracts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "rental_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_guarantors: {
        Row: {
          address: string | null
          city: string | null
          cpf: string | null
          created_at: string
          created_by_user_id: string | null
          email: string | null
          full_name: string
          id: string
          monthly_income: number | null
          neighborhood: string | null
          notes: string | null
          phone: string | null
          profession: string | null
          property_address: string | null
          property_registration: string | null
          rg: string | null
          state: string | null
          updated_at: string
          whatsapp: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string
          created_by_user_id?: string | null
          email?: string | null
          full_name: string
          id?: string
          monthly_income?: number | null
          neighborhood?: string | null
          notes?: string | null
          phone?: string | null
          profession?: string | null
          property_address?: string | null
          property_registration?: string | null
          rg?: string | null
          state?: string | null
          updated_at?: string
          whatsapp?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string
          created_by_user_id?: string | null
          email?: string | null
          full_name?: string
          id?: string
          monthly_income?: number | null
          neighborhood?: string | null
          notes?: string | null
          phone?: string | null
          profession?: string | null
          property_address?: string | null
          property_registration?: string | null
          rg?: string | null
          state?: string | null
          updated_at?: string
          whatsapp?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      rental_owners: {
        Row: {
          address: string | null
          bank_account: string | null
          bank_agency: string | null
          bank_name: string | null
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
          pix_key: string | null
          rg: string | null
          state: string | null
          updated_at: string
          whatsapp: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          bank_account?: string | null
          bank_agency?: string | null
          bank_name?: string | null
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
          pix_key?: string | null
          rg?: string | null
          state?: string | null
          updated_at?: string
          whatsapp?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          bank_account?: string | null
          bank_agency?: string | null
          bank_name?: string | null
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
          pix_key?: string | null
          rg?: string | null
          state?: string | null
          updated_at?: string
          whatsapp?: string | null
          zip_code?: string | null
        }
        Relationships: []
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
      rental_properties: {
        Row: {
          accepts_pets: boolean | null
          address: string
          bathrooms: number | null
          bedrooms: number | null
          city: string
          code: string
          complement: string | null
          condominium_fee: number | null
          cover_image_url: string | null
          created_at: string
          created_by_user_id: string | null
          current_contract_id: string | null
          current_stage: Database["public"]["Enums"]["rental_property_stage"]
          description: string | null
          features: string[] | null
          garage_spaces: number | null
          has_doorman: boolean | null
          has_elevator: boolean | null
          has_gym: boolean | null
          has_pool: boolean | null
          id: string
          internal_notes: string | null
          iptu_registration: string | null
          iptu_value: number | null
          is_furnished: boolean | null
          neighborhood: string | null
          number: string | null
          other_fees: number | null
          owner_id: string | null
          photos: string[] | null
          property_type: string
          registration_number: string | null
          rent_value: number
          responsible_user_id: string | null
          stage_entered_at: string
          state: string
          suites: number | null
          total_area: number | null
          updated_at: string
          useful_area: number | null
          zip_code: string | null
        }
        Insert: {
          accepts_pets?: boolean | null
          address: string
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string
          code: string
          complement?: string | null
          condominium_fee?: number | null
          cover_image_url?: string | null
          created_at?: string
          created_by_user_id?: string | null
          current_contract_id?: string | null
          current_stage?: Database["public"]["Enums"]["rental_property_stage"]
          description?: string | null
          features?: string[] | null
          garage_spaces?: number | null
          has_doorman?: boolean | null
          has_elevator?: boolean | null
          has_gym?: boolean | null
          has_pool?: boolean | null
          id?: string
          internal_notes?: string | null
          iptu_registration?: string | null
          iptu_value?: number | null
          is_furnished?: boolean | null
          neighborhood?: string | null
          number?: string | null
          other_fees?: number | null
          owner_id?: string | null
          photos?: string[] | null
          property_type?: string
          registration_number?: string | null
          rent_value?: number
          responsible_user_id?: string | null
          stage_entered_at?: string
          state?: string
          suites?: number | null
          total_area?: number | null
          updated_at?: string
          useful_area?: number | null
          zip_code?: string | null
        }
        Update: {
          accepts_pets?: boolean | null
          address?: string
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string
          code?: string
          complement?: string | null
          condominium_fee?: number | null
          cover_image_url?: string | null
          created_at?: string
          created_by_user_id?: string | null
          current_contract_id?: string | null
          current_stage?: Database["public"]["Enums"]["rental_property_stage"]
          description?: string | null
          features?: string[] | null
          garage_spaces?: number | null
          has_doorman?: boolean | null
          has_elevator?: boolean | null
          has_gym?: boolean | null
          has_pool?: boolean | null
          id?: string
          internal_notes?: string | null
          iptu_registration?: string | null
          iptu_value?: number | null
          is_furnished?: boolean | null
          neighborhood?: string | null
          number?: string | null
          other_fees?: number | null
          owner_id?: string | null
          photos?: string[] | null
          property_type?: string
          registration_number?: string | null
          rent_value?: number
          responsible_user_id?: string | null
          stage_entered_at?: string
          state?: string
          suites?: number | null
          total_area?: number | null
          updated_at?: string
          useful_area?: number | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rental_properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "rental_owners"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_property_documents: {
        Row: {
          created_at: string
          document_type: string
          file_url: string
          id: string
          name: string
          property_id: string
          uploaded_by_user_id: string | null
        }
        Insert: {
          created_at?: string
          document_type?: string
          file_url: string
          id?: string
          name: string
          property_id: string
          uploaded_by_user_id?: string | null
        }
        Update: {
          created_at?: string
          document_type?: string
          file_url?: string
          id?: string
          name?: string
          property_id?: string
          uploaded_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rental_property_documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "rental_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_property_history: {
        Row: {
          created_at: string
          from_stage:
            | Database["public"]["Enums"]["rental_property_stage"]
            | null
          id: string
          moved_by_name: string | null
          moved_by_user_id: string | null
          notes: string | null
          property_id: string
          to_stage: Database["public"]["Enums"]["rental_property_stage"]
        }
        Insert: {
          created_at?: string
          from_stage?:
            | Database["public"]["Enums"]["rental_property_stage"]
            | null
          id?: string
          moved_by_name?: string | null
          moved_by_user_id?: string | null
          notes?: string | null
          property_id: string
          to_stage: Database["public"]["Enums"]["rental_property_stage"]
        }
        Update: {
          created_at?: string
          from_stage?:
            | Database["public"]["Enums"]["rental_property_stage"]
            | null
          id?: string
          moved_by_name?: string | null
          moved_by_user_id?: string | null
          notes?: string | null
          property_id?: string
          to_stage?: Database["public"]["Enums"]["rental_property_stage"]
        }
        Relationships: [
          {
            foreignKeyName: "rental_property_history_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "rental_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_tenants: {
        Row: {
          address: string | null
          birth_date: string | null
          city: string | null
          cpf: string | null
          created_at: string
          created_by_user_id: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string
          id: string
          monthly_income: number | null
          neighborhood: string | null
          notes: string | null
          phone: string | null
          profession: string | null
          rg: string | null
          state: string | null
          updated_at: string
          whatsapp: string | null
          workplace: string | null
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
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name: string
          id?: string
          monthly_income?: number | null
          neighborhood?: string | null
          notes?: string | null
          phone?: string | null
          profession?: string | null
          rg?: string | null
          state?: string | null
          updated_at?: string
          whatsapp?: string | null
          workplace?: string | null
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
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string
          id?: string
          monthly_income?: number | null
          neighborhood?: string | null
          notes?: string | null
          phone?: string | null
          profession?: string | null
          rg?: string | null
          state?: string | null
          updated_at?: string
          whatsapp?: string | null
          workplace?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      scraped_properties: {
        Row: {
          accepts_fgts: boolean | null
          accepts_financing: boolean | null
          address: string | null
          area_private: number | null
          area_terrain: number | null
          area_total: number | null
          bathrooms: number | null
          bedrooms: number | null
          city: string
          created_at: string
          discount_percentage: number | null
          external_id: string
          garage_spaces: number | null
          id: string
          neighborhood: string | null
          payment_method: string | null
          photo_urls: string[] | null
          price_evaluation: number | null
          price_minimum: number | null
          property_type: string | null
          raw_data: Json | null
          sale_modality: string
          source_url: string | null
          state: string
          status: string
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          accepts_fgts?: boolean | null
          accepts_financing?: boolean | null
          address?: string | null
          area_private?: number | null
          area_terrain?: number | null
          area_total?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city: string
          created_at?: string
          discount_percentage?: number | null
          external_id: string
          garage_spaces?: number | null
          id?: string
          neighborhood?: string | null
          payment_method?: string | null
          photo_urls?: string[] | null
          price_evaluation?: number | null
          price_minimum?: number | null
          property_type?: string | null
          raw_data?: Json | null
          sale_modality: string
          source_url?: string | null
          state: string
          status?: string
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          accepts_fgts?: boolean | null
          accepts_financing?: boolean | null
          address?: string | null
          area_private?: number | null
          area_terrain?: number | null
          area_total?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string
          created_at?: string
          discount_percentage?: number | null
          external_id?: string
          garage_spaces?: number | null
          id?: string
          neighborhood?: string | null
          payment_method?: string | null
          photo_urls?: string[] | null
          price_evaluation?: number | null
          price_minimum?: number | null
          property_type?: string | null
          raw_data?: Json | null
          sale_modality?: string
          source_url?: string | null
          state?: string
          status?: string
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
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
      vdh_ai_knowledge: {
        Row: {
          business_context: string
          common_questions: Json
          created_at: string
          id: string
          last_trained_at: string | null
          tone_guidelines: string | null
          trained_messages_count: number
          updated_at: string
        }
        Insert: {
          business_context?: string
          common_questions?: Json
          created_at?: string
          id?: string
          last_trained_at?: string | null
          tone_guidelines?: string | null
          trained_messages_count?: number
          updated_at?: string
        }
        Update: {
          business_context?: string
          common_questions?: Json
          created_at?: string
          id?: string
          last_trained_at?: string | null
          tone_guidelines?: string | null
          trained_messages_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      vdh_auto_reply_config: {
        Row: {
          business_days: number[]
          business_hour_end: number
          business_hour_start: number
          created_at: string
          id: string
          is_enabled: boolean
          model: string
          system_prompt: string
          timezone: string
          updated_at: string
        }
        Insert: {
          business_days?: number[]
          business_hour_end?: number
          business_hour_start?: number
          created_at?: string
          id?: string
          is_enabled?: boolean
          model?: string
          system_prompt?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          business_days?: number[]
          business_hour_end?: number
          business_hour_start?: number
          created_at?: string
          id?: string
          is_enabled?: boolean
          model?: string
          system_prompt?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      vdh_conversations: {
        Row: {
          assigned_to_name: string | null
          assigned_to_user_id: string | null
          created_at: string
          id: string
          ig_full_name: string | null
          ig_participant_id: string
          ig_profile_pic: string | null
          ig_username: string | null
          kanban_column_id: string | null
          last_message_at: string | null
          last_message_direction: string | null
          last_message_text: string | null
          lead_status: string
          notes: string | null
          status: string
          tags: string[] | null
          unread_count: number
          updated_at: string
        }
        Insert: {
          assigned_to_name?: string | null
          assigned_to_user_id?: string | null
          created_at?: string
          id?: string
          ig_full_name?: string | null
          ig_participant_id: string
          ig_profile_pic?: string | null
          ig_username?: string | null
          kanban_column_id?: string | null
          last_message_at?: string | null
          last_message_direction?: string | null
          last_message_text?: string | null
          lead_status?: string
          notes?: string | null
          status?: string
          tags?: string[] | null
          unread_count?: number
          updated_at?: string
        }
        Update: {
          assigned_to_name?: string | null
          assigned_to_user_id?: string | null
          created_at?: string
          id?: string
          ig_full_name?: string | null
          ig_participant_id?: string
          ig_profile_pic?: string | null
          ig_username?: string | null
          kanban_column_id?: string | null
          last_message_at?: string | null
          last_message_direction?: string | null
          last_message_text?: string | null
          lead_status?: string
          notes?: string | null
          status?: string
          tags?: string[] | null
          unread_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vdh_conversations_kanban_column_id_fkey"
            columns: ["kanban_column_id"]
            isOneToOne: false
            referencedRelation: "vdh_kanban_columns"
            referencedColumns: ["id"]
          },
        ]
      }
      vdh_inbox_access: {
        Row: {
          created_at: string
          granted_by_user_id: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_by_user_id?: string | null
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          granted_by_user_id?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      vdh_kanban_columns: {
        Row: {
          color: string
          created_at: string
          id: string
          is_default_for_new: boolean
          name: string
          position: number
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          is_default_for_new?: boolean
          name: string
          position?: number
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          is_default_for_new?: boolean
          name?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      vdh_messages: {
        Row: {
          attachment_type: string | null
          attachment_url: string | null
          conversation_id: string
          created_at: string
          direction: string
          id: string
          ig_message_id: string | null
          is_auto_reply: boolean
          is_echo: boolean
          raw_payload: Json | null
          reply_to_ig_message_id: string | null
          sent_by_name: string | null
          sent_by_user_id: string | null
          story_url: string | null
          text: string | null
        }
        Insert: {
          attachment_type?: string | null
          attachment_url?: string | null
          conversation_id: string
          created_at?: string
          direction: string
          id?: string
          ig_message_id?: string | null
          is_auto_reply?: boolean
          is_echo?: boolean
          raw_payload?: Json | null
          reply_to_ig_message_id?: string | null
          sent_by_name?: string | null
          sent_by_user_id?: string | null
          story_url?: string | null
          text?: string | null
        }
        Update: {
          attachment_type?: string | null
          attachment_url?: string | null
          conversation_id?: string
          created_at?: string
          direction?: string
          id?: string
          ig_message_id?: string | null
          is_auto_reply?: boolean
          is_echo?: boolean
          raw_payload?: Json | null
          reply_to_ig_message_id?: string | null
          sent_by_name?: string | null
          sent_by_user_id?: string | null
          story_url?: string | null
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vdh_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "vdh_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      vdh_quick_replies: {
        Row: {
          content: string
          created_at: string
          created_by_user_id: string | null
          id: string
          is_active: boolean
          keywords: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          is_active?: boolean
          keywords?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          is_active?: boolean
          keywords?: string
          title?: string
          updated_at?: string
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
      has_vdh_inbox_access: { Args: { _user_id: string }; Returns: boolean }
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
      checklist_status: "pendente" | "conforme" | "nao_se_aplica"
      lead_classificacao: "quente" | "morno" | "frio"
      lead_sales_stage:
        | "recebido_sdr"
        | "em_atendimento_venda"
        | "apresentacao_imoveis"
        | "negociacao"
        | "proposta_enviada"
        | "fechado"
        | "perdido"
      lead_sdr_stage:
        | "lead_recebido"
        | "em_atendimento"
        | "qualificando"
        | "qualificado"
        | "nao_qualificado"
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
      proposal_stage:
        | "proposta"
        | "em_analise"
        | "pendencia"
        | "aprovado"
        | "assinatura"
        | "registro"
        | "concluido"
      rental_contract_status:
        | "active"
        | "ending_soon"
        | "expired"
        | "terminated"
        | "renewed"
      rental_contract_type: "residencial" | "comercial"
      rental_guarantee_type: "fiador" | "caucao" | "seguro_fiador"
      rental_payment_status:
        | "pending"
        | "paid"
        | "overdue"
        | "partial"
        | "cancelled"
      rental_property_stage: "disponivel" | "reservado" | "ocupado" | "catalogo"
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
      checklist_status: ["pendente", "conforme", "nao_se_aplica"],
      lead_classificacao: ["quente", "morno", "frio"],
      lead_sales_stage: [
        "recebido_sdr",
        "em_atendimento_venda",
        "apresentacao_imoveis",
        "negociacao",
        "proposta_enviada",
        "fechado",
        "perdido",
      ],
      lead_sdr_stage: [
        "lead_recebido",
        "em_atendimento",
        "qualificando",
        "qualificado",
        "nao_qualificado",
      ],
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
      proposal_stage: [
        "proposta",
        "em_analise",
        "pendencia",
        "aprovado",
        "assinatura",
        "registro",
        "concluido",
      ],
      rental_contract_status: [
        "active",
        "ending_soon",
        "expired",
        "terminated",
        "renewed",
      ],
      rental_contract_type: ["residencial", "comercial"],
      rental_guarantee_type: ["fiador", "caucao", "seguro_fiador"],
      rental_payment_status: [
        "pending",
        "paid",
        "overdue",
        "partial",
        "cancelled",
      ],
      rental_property_stage: ["disponivel", "reservado", "ocupado", "catalogo"],
    },
  },
} as const
