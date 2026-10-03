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
    PostgrestVersion: "14.5"
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
      af_olx_listings: {
        Row: {
          accepts_fgts: boolean | null
          accepts_financing: boolean | null
          address: string
          address_number: string | null
          area: number | null
          bathrooms: number | null
          bedrooms: number | null
          broker_email: string | null
          broker_name: string
          broker_phone: string
          city: string
          code: string
          condominium_fee: number | null
          created_at: string
          created_by_user_id: string | null
          creci: string | null
          description: string | null
          floor: string | null
          furnished: boolean | null
          garage_spaces: number | null
          id: string
          iptu: number | null
          is_active: boolean
          neighborhood: string
          photos: string[]
          property_type: string
          rental_price: number | null
          sale_price: number | null
          state: string
          suites: number | null
          title: string
          transaction_type: Database["public"]["Enums"]["olx_transaction_type"]
          updated_at: string
          zip_code: string
        }
        Insert: {
          accepts_fgts?: boolean | null
          accepts_financing?: boolean | null
          address: string
          address_number?: string | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          broker_email?: string | null
          broker_name: string
          broker_phone: string
          city: string
          code: string
          condominium_fee?: number | null
          created_at?: string
          created_by_user_id?: string | null
          creci?: string | null
          description?: string | null
          floor?: string | null
          furnished?: boolean | null
          garage_spaces?: number | null
          id?: string
          iptu?: number | null
          is_active?: boolean
          neighborhood: string
          photos?: string[]
          property_type?: string
          rental_price?: number | null
          sale_price?: number | null
          state?: string
          suites?: number | null
          title: string
          transaction_type?: Database["public"]["Enums"]["olx_transaction_type"]
          updated_at?: string
          zip_code: string
        }
        Update: {
          accepts_fgts?: boolean | null
          accepts_financing?: boolean | null
          address?: string
          address_number?: string | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          broker_email?: string | null
          broker_name?: string
          broker_phone?: string
          city?: string
          code?: string
          condominium_fee?: number | null
          created_at?: string
          created_by_user_id?: string | null
          creci?: string | null
          description?: string | null
          floor?: string | null
          furnished?: boolean | null
          garage_spaces?: number | null
          id?: string
          iptu?: number | null
          is_active?: boolean
          neighborhood?: string
          photos?: string[]
          property_type?: string
          rental_price?: number | null
          sale_price?: number | null
          state?: string
          suites?: number | null
          title?: string
          transaction_type?: Database["public"]["Enums"]["olx_transaction_type"]
          updated_at?: string
          zip_code?: string
        }
        Relationships: []
      }
      am_landing_pages: {
        Row: {
          accent_color: string
          broker: Json
          code: string
          copy: Json
          created_at: string
          created_by: string | null
          data: Json
          id: string
          is_active: boolean
          photos: Json
          sections: Json
          slug: string
          updated_at: string
          view_count: number
          whatsapp_click_count: number
          whatsapp_message: string | null
        }
        Insert: {
          accent_color?: string
          broker?: Json
          code: string
          copy?: Json
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          is_active?: boolean
          photos?: Json
          sections?: Json
          slug: string
          updated_at?: string
          view_count?: number
          whatsapp_click_count?: number
          whatsapp_message?: string | null
        }
        Update: {
          accent_color?: string
          broker?: Json
          code?: string
          copy?: Json
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          is_active?: boolean
          photos?: Json
          sections?: Json
          slug?: string
          updated_at?: string
          view_count?: number
          whatsapp_click_count?: number
          whatsapp_message?: string | null
        }
        Relationships: []
      }
      am_olx_listings: {
        Row: {
          accepts_fgts: boolean | null
          accepts_financing: boolean | null
          address: string
          address_number: string | null
          area: number | null
          bathrooms: number | null
          bedrooms: number | null
          broker_email: string | null
          broker_name: string
          broker_phone: string
          city: string
          code: string
          condominium_fee: number | null
          created_at: string
          created_by_user_id: string | null
          creci: string | null
          description: string | null
          floor: string | null
          furnished: boolean | null
          garage_spaces: number | null
          id: string
          iptu: number | null
          is_active: boolean
          neighborhood: string
          photos: string[]
          property_type: string
          rental_price: number | null
          sale_price: number | null
          state: string
          suites: number | null
          title: string
          transaction_type: Database["public"]["Enums"]["olx_transaction_type"]
          updated_at: string
          zip_code: string
        }
        Insert: {
          accepts_fgts?: boolean | null
          accepts_financing?: boolean | null
          address: string
          address_number?: string | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          broker_email?: string | null
          broker_name: string
          broker_phone: string
          city: string
          code: string
          condominium_fee?: number | null
          created_at?: string
          created_by_user_id?: string | null
          creci?: string | null
          description?: string | null
          floor?: string | null
          furnished?: boolean | null
          garage_spaces?: number | null
          id?: string
          iptu?: number | null
          is_active?: boolean
          neighborhood: string
          photos?: string[]
          property_type?: string
          rental_price?: number | null
          sale_price?: number | null
          state?: string
          suites?: number | null
          title: string
          transaction_type?: Database["public"]["Enums"]["olx_transaction_type"]
          updated_at?: string
          zip_code: string
        }
        Update: {
          accepts_fgts?: boolean | null
          accepts_financing?: boolean | null
          address?: string
          address_number?: string | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          broker_email?: string | null
          broker_name?: string
          broker_phone?: string
          city?: string
          code?: string
          condominium_fee?: number | null
          created_at?: string
          created_by_user_id?: string | null
          creci?: string | null
          description?: string | null
          floor?: string | null
          furnished?: boolean | null
          garage_spaces?: number | null
          id?: string
          iptu?: number | null
          is_active?: boolean
          neighborhood?: string
          photos?: string[]
          property_type?: string
          rental_price?: number | null
          sale_price?: number | null
          state?: string
          suites?: number | null
          title?: string
          transaction_type?: Database["public"]["Enums"]["olx_transaction_type"]
          updated_at?: string
          zip_code?: string
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
      cx_audit_log: {
        Row: {
          action: string
          actor_name: string | null
          actor_user_id: string | null
          after_data: Json | null
          before_data: Json | null
          client_id: string | null
          created_at: string
          deal_id: string | null
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json
        }
        Insert: {
          action: string
          actor_name?: string | null
          actor_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          client_id?: string | null
          created_at?: string
          deal_id?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json
        }
        Update: {
          action?: string
          actor_name?: string | null
          actor_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          client_id?: string | null
          created_at?: string
          deal_id?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json
        }
        Relationships: []
      }
      cx_client_events: {
        Row: {
          actor_name: string | null
          actor_user_id: string | null
          client_id: string
          created_at: string
          description: string | null
          id: string
          kind: string
          metadata: Json
          title: string
        }
        Insert: {
          actor_name?: string | null
          actor_user_id?: string | null
          client_id: string
          created_at?: string
          description?: string | null
          id?: string
          kind?: string
          metadata?: Json
          title: string
        }
        Update: {
          actor_name?: string | null
          actor_user_id?: string | null
          client_id?: string
          created_at?: string
          description?: string | null
          id?: string
          kind?: string
          metadata?: Json
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "cx_client_events_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "cx_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      cx_clients: {
        Row: {
          address: string | null
          archived_at: string | null
          archived_by_user_id: string | null
          assigned_broker_name: string | null
          assigned_broker_user_id: string | null
          birth_date: string | null
          city: string | null
          cpf: string | null
          created_at: string
          created_by_user_id: string | null
          email: string | null
          employer: string | null
          extracted: Json
          family_income: number | null
          full_name: string
          id: string
          lead_source: string | null
          marital_status: string | null
          monthly_income: number | null
          mother_name: string | null
          neighborhood: string | null
          notes: string | null
          parent_client_id: string | null
          phone: string | null
          portal_token: string | null
          portal_user_id: string | null
          profession: string | null
          profile: Json
          profile_updated_at: string | null
          relationship: string | null
          review_notes: string | null
          reviewed_at: string | null
          rg: string | null
          state: string | null
          submission_status: string
          submitted_at: string | null
          updated_at: string
          whatsapp: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          archived_at?: string | null
          archived_by_user_id?: string | null
          assigned_broker_name?: string | null
          assigned_broker_user_id?: string | null
          birth_date?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string
          created_by_user_id?: string | null
          email?: string | null
          employer?: string | null
          extracted?: Json
          family_income?: number | null
          full_name: string
          id?: string
          lead_source?: string | null
          marital_status?: string | null
          monthly_income?: number | null
          mother_name?: string | null
          neighborhood?: string | null
          notes?: string | null
          parent_client_id?: string | null
          phone?: string | null
          portal_token?: string | null
          portal_user_id?: string | null
          profession?: string | null
          profile?: Json
          profile_updated_at?: string | null
          relationship?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          rg?: string | null
          state?: string | null
          submission_status?: string
          submitted_at?: string | null
          updated_at?: string
          whatsapp?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          archived_at?: string | null
          archived_by_user_id?: string | null
          assigned_broker_name?: string | null
          assigned_broker_user_id?: string | null
          birth_date?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string
          created_by_user_id?: string | null
          email?: string | null
          employer?: string | null
          extracted?: Json
          family_income?: number | null
          full_name?: string
          id?: string
          lead_source?: string | null
          marital_status?: string | null
          monthly_income?: number | null
          mother_name?: string | null
          neighborhood?: string | null
          notes?: string | null
          parent_client_id?: string | null
          phone?: string | null
          portal_token?: string | null
          portal_user_id?: string | null
          profession?: string | null
          profile?: Json
          profile_updated_at?: string | null
          relationship?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          rg?: string | null
          state?: string | null
          submission_status?: string
          submitted_at?: string | null
          updated_at?: string
          whatsapp?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cx_clients_parent_client_id_fkey"
            columns: ["parent_client_id"]
            isOneToOne: false
            referencedRelation: "cx_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      cx_contracts: {
        Row: {
          contract_number: string | null
          created_at: string
          deal_id: string
          document_id: string | null
          id: string
          notes: string | null
          pendencies: string | null
          prepared_at: string | null
          signed_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          contract_number?: string | null
          created_at?: string
          deal_id: string
          document_id?: string | null
          id?: string
          notes?: string | null
          pendencies?: string | null
          prepared_at?: string | null
          signed_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          contract_number?: string | null
          created_at?: string
          deal_id?: string
          document_id?: string | null
          id?: string
          notes?: string | null
          pendencies?: string | null
          prepared_at?: string | null
          signed_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cx_contracts_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "cx_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cx_contracts_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "cx_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      cx_credit_analyses: {
        Row: {
          amortization_system: string | null
          analysis_date: string
          analyst_name: string | null
          analyst_user_id: string | null
          analyzed_cpf: string | null
          analyzed_name: string | null
          appraisal_code: string | null
          approved_value: number | null
          client_id: string
          condition_category: string | null
          condition_reason: string | null
          correspondent_code: string | null
          created_at: string
          created_by_user_id: string | null
          credit_line: string | null
          deal_id: string
          error_message: string | null
          error_reference: string | null
          extracted_snapshot: Json
          financing_value: number | null
          funding_source: string | null
          id: string
          indexer: string | null
          installment_value: number | null
          margin_value: number | null
          mcmv_tier: string | null
          modality: string | null
          notes: string | null
          operator_name: string | null
          originating_system: string | null
          possible_installment: number | null
          product: string | null
          property_value: number | null
          proposal_code: string | null
          rating: string | null
          registration_protocol: string | null
          rejection_category: string | null
          rejection_reason: string | null
          relationship_agency: string | null
          result: string
          sequence_number: number
          source: string
          source_document_id: string | null
          term_months: number | null
          validity_end: string | null
          validity_start: string | null
        }
        Insert: {
          amortization_system?: string | null
          analysis_date?: string
          analyst_name?: string | null
          analyst_user_id?: string | null
          analyzed_cpf?: string | null
          analyzed_name?: string | null
          appraisal_code?: string | null
          approved_value?: number | null
          client_id: string
          condition_category?: string | null
          condition_reason?: string | null
          correspondent_code?: string | null
          created_at?: string
          created_by_user_id?: string | null
          credit_line?: string | null
          deal_id: string
          error_message?: string | null
          error_reference?: string | null
          extracted_snapshot?: Json
          financing_value?: number | null
          funding_source?: string | null
          id?: string
          indexer?: string | null
          installment_value?: number | null
          margin_value?: number | null
          mcmv_tier?: string | null
          modality?: string | null
          notes?: string | null
          operator_name?: string | null
          originating_system?: string | null
          possible_installment?: number | null
          product?: string | null
          property_value?: number | null
          proposal_code?: string | null
          rating?: string | null
          registration_protocol?: string | null
          rejection_category?: string | null
          rejection_reason?: string | null
          relationship_agency?: string | null
          result: string
          sequence_number: number
          source?: string
          source_document_id?: string | null
          term_months?: number | null
          validity_end?: string | null
          validity_start?: string | null
        }
        Update: {
          amortization_system?: string | null
          analysis_date?: string
          analyst_name?: string | null
          analyst_user_id?: string | null
          analyzed_cpf?: string | null
          analyzed_name?: string | null
          appraisal_code?: string | null
          approved_value?: number | null
          client_id?: string
          condition_category?: string | null
          condition_reason?: string | null
          correspondent_code?: string | null
          created_at?: string
          created_by_user_id?: string | null
          credit_line?: string | null
          deal_id?: string
          error_message?: string | null
          error_reference?: string | null
          extracted_snapshot?: Json
          financing_value?: number | null
          funding_source?: string | null
          id?: string
          indexer?: string | null
          installment_value?: number | null
          margin_value?: number | null
          mcmv_tier?: string | null
          modality?: string | null
          notes?: string | null
          operator_name?: string | null
          originating_system?: string | null
          possible_installment?: number | null
          product?: string | null
          property_value?: number | null
          proposal_code?: string | null
          rating?: string | null
          registration_protocol?: string | null
          rejection_category?: string | null
          rejection_reason?: string | null
          relationship_agency?: string | null
          result?: string
          sequence_number?: number
          source?: string
          source_document_id?: string | null
          term_months?: number | null
          validity_end?: string | null
          validity_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cx_credit_analyses_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "cx_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cx_credit_analyses_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "cx_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cx_credit_analyses_source_document_fk"
            columns: ["source_document_id"]
            isOneToOne: false
            referencedRelation: "cx_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      cx_deal_checks: {
        Row: {
          approved_value: number | null
          checked_at: string
          created_at: string
          created_by_name: string | null
          created_by_user_id: string | null
          deal_id: string
          id: string
          margin_value: number | null
          notes: string | null
          rating: string | null
          result: string | null
        }
        Insert: {
          approved_value?: number | null
          checked_at?: string
          created_at?: string
          created_by_name?: string | null
          created_by_user_id?: string | null
          deal_id: string
          id?: string
          margin_value?: number | null
          notes?: string | null
          rating?: string | null
          result?: string | null
        }
        Update: {
          approved_value?: number | null
          checked_at?: string
          created_at?: string
          created_by_name?: string | null
          created_by_user_id?: string | null
          deal_id?: string
          id?: string
          margin_value?: number | null
          notes?: string | null
          rating?: string | null
          result?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cx_deal_checks_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "cx_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      cx_deal_history: {
        Row: {
          created_at: string
          deal_id: string
          from_stage: string | null
          id: string
          moved_by_name: string | null
          moved_by_user_id: string | null
          notes: string | null
          to_stage: string
        }
        Insert: {
          created_at?: string
          deal_id: string
          from_stage?: string | null
          id?: string
          moved_by_name?: string | null
          moved_by_user_id?: string | null
          notes?: string | null
          to_stage: string
        }
        Update: {
          created_at?: string
          deal_id?: string
          from_stage?: string | null
          id?: string
          moved_by_name?: string | null
          moved_by_user_id?: string | null
          notes?: string | null
          to_stage?: string
        }
        Relationships: [
          {
            foreignKeyName: "cx_deal_history_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "cx_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      cx_deals: {
        Row: {
          approval_expires_at: string | null
          approved_value: number | null
          archived_at: string | null
          archived_by_user_id: string | null
          bank: string | null
          client_id: string
          closed_at: string | null
          created_at: string
          created_by_user_id: string | null
          credit_status: string | null
          down_payment: number | null
          fgts_value: number | null
          financing_value: number | null
          id: string
          installment_value: number | null
          lost_reason: string | null
          margin_value: number | null
          monthly_income: number | null
          next_action: string | null
          next_action_due_at: string | null
          next_action_responsible_id: string | null
          next_action_responsible_name: string | null
          next_review_at: string | null
          notes: string | null
          opened_at: string
          pendencies: string | null
          process_number: string | null
          process_status: string
          property_id: string | null
          property_value: number | null
          purchase_type: string | null
          rating: string | null
          rejection_notes: string | null
          rejection_reason:
            | Database["public"]["Enums"]["cx_rejection_reason"]
            | null
          responsible_name: string | null
          responsible_user_id: string | null
          review_interval_days: number
          stage: string
          stage_entered_at: string
          subsidy_value: number | null
          title: string | null
          updated_at: string
        }
        Insert: {
          approval_expires_at?: string | null
          approved_value?: number | null
          archived_at?: string | null
          archived_by_user_id?: string | null
          bank?: string | null
          client_id: string
          closed_at?: string | null
          created_at?: string
          created_by_user_id?: string | null
          credit_status?: string | null
          down_payment?: number | null
          fgts_value?: number | null
          financing_value?: number | null
          id?: string
          installment_value?: number | null
          lost_reason?: string | null
          margin_value?: number | null
          monthly_income?: number | null
          next_action?: string | null
          next_action_due_at?: string | null
          next_action_responsible_id?: string | null
          next_action_responsible_name?: string | null
          next_review_at?: string | null
          notes?: string | null
          opened_at?: string
          pendencies?: string | null
          process_number?: string | null
          process_status?: string
          property_id?: string | null
          property_value?: number | null
          purchase_type?: string | null
          rating?: string | null
          rejection_notes?: string | null
          rejection_reason?:
            | Database["public"]["Enums"]["cx_rejection_reason"]
            | null
          responsible_name?: string | null
          responsible_user_id?: string | null
          review_interval_days?: number
          stage?: string
          stage_entered_at?: string
          subsidy_value?: number | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          approval_expires_at?: string | null
          approved_value?: number | null
          archived_at?: string | null
          archived_by_user_id?: string | null
          bank?: string | null
          client_id?: string
          closed_at?: string | null
          created_at?: string
          created_by_user_id?: string | null
          credit_status?: string | null
          down_payment?: number | null
          fgts_value?: number | null
          financing_value?: number | null
          id?: string
          installment_value?: number | null
          lost_reason?: string | null
          margin_value?: number | null
          monthly_income?: number | null
          next_action?: string | null
          next_action_due_at?: string | null
          next_action_responsible_id?: string | null
          next_action_responsible_name?: string | null
          next_review_at?: string | null
          notes?: string | null
          opened_at?: string
          pendencies?: string | null
          process_number?: string | null
          process_status?: string
          property_id?: string | null
          property_value?: number | null
          purchase_type?: string | null
          rating?: string | null
          rejection_notes?: string | null
          rejection_reason?:
            | Database["public"]["Enums"]["cx_rejection_reason"]
            | null
          responsible_name?: string | null
          responsible_user_id?: string | null
          review_interval_days?: number
          stage?: string
          stage_entered_at?: string
          subsidy_value?: number | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cx_deals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "cx_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cx_deals_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "cx_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      cx_documents: {
        Row: {
          archived_at: string | null
          archived_by_user_id: string | null
          category: string
          checklist_status: string
          client_id: string | null
          created_at: string
          credit_analysis_id: string | null
          deal_id: string | null
          doc_type: string
          error_message: string | null
          extracted: Json
          file_name: string
          file_path: string
          id: string
          mime_type: string | null
          notes: string | null
          participant_id: string | null
          property_id: string | null
          replaces_document_id: string | null
          stage: string | null
          status: string
          updated_at: string
          uploaded_by_user_id: string | null
          version_number: number
        }
        Insert: {
          archived_at?: string | null
          archived_by_user_id?: string | null
          category?: string
          checklist_status?: string
          client_id?: string | null
          created_at?: string
          credit_analysis_id?: string | null
          deal_id?: string | null
          doc_type?: string
          error_message?: string | null
          extracted?: Json
          file_name: string
          file_path: string
          id?: string
          mime_type?: string | null
          notes?: string | null
          participant_id?: string | null
          property_id?: string | null
          replaces_document_id?: string | null
          stage?: string | null
          status?: string
          updated_at?: string
          uploaded_by_user_id?: string | null
          version_number?: number
        }
        Update: {
          archived_at?: string | null
          archived_by_user_id?: string | null
          category?: string
          checklist_status?: string
          client_id?: string | null
          created_at?: string
          credit_analysis_id?: string | null
          deal_id?: string | null
          doc_type?: string
          error_message?: string | null
          extracted?: Json
          file_name?: string
          file_path?: string
          id?: string
          mime_type?: string | null
          notes?: string | null
          participant_id?: string | null
          property_id?: string | null
          replaces_document_id?: string | null
          stage?: string | null
          status?: string
          updated_at?: string
          uploaded_by_user_id?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "cx_documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "cx_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cx_documents_credit_analysis_id_fkey"
            columns: ["credit_analysis_id"]
            isOneToOne: false
            referencedRelation: "cx_credit_analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cx_documents_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "cx_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cx_documents_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "cx_process_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cx_documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "cx_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cx_documents_replaces_document_id_fkey"
            columns: ["replaces_document_id"]
            isOneToOne: false
            referencedRelation: "cx_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      cx_engineering_inspections: {
        Row: {
          created_at: string
          deal_id: string
          due_at: string | null
          id: string
          inspection_at: string | null
          notes: string | null
          pendencies: string | null
          property_id: string | null
          report_document_id: string | null
          responsible_name: string | null
          responsible_user_id: string | null
          result: string | null
          scheduled_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deal_id: string
          due_at?: string | null
          id?: string
          inspection_at?: string | null
          notes?: string | null
          pendencies?: string | null
          property_id?: string | null
          report_document_id?: string | null
          responsible_name?: string | null
          responsible_user_id?: string | null
          result?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deal_id?: string
          due_at?: string | null
          id?: string
          inspection_at?: string | null
          notes?: string | null
          pendencies?: string | null
          property_id?: string | null
          report_document_id?: string | null
          responsible_name?: string | null
          responsible_user_id?: string | null
          result?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cx_engineering_inspections_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "cx_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cx_engineering_inspections_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "cx_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cx_engineering_inspections_report_document_id_fkey"
            columns: ["report_document_id"]
            isOneToOne: false
            referencedRelation: "cx_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      cx_key_handovers: {
        Row: {
          created_at: string
          deal_id: string
          delivered_at: string | null
          expected_at: string | null
          id: string
          notes: string | null
          receipt_document_id: string | null
          responsible_name: string | null
          responsible_user_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deal_id: string
          delivered_at?: string | null
          expected_at?: string | null
          id?: string
          notes?: string | null
          receipt_document_id?: string | null
          responsible_name?: string | null
          responsible_user_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deal_id?: string
          delivered_at?: string | null
          expected_at?: string | null
          id?: string
          notes?: string | null
          receipt_document_id?: string | null
          responsible_name?: string | null
          responsible_user_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cx_key_handovers_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: true
            referencedRelation: "cx_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cx_key_handovers_receipt_document_id_fkey"
            columns: ["receipt_document_id"]
            isOneToOne: false
            referencedRelation: "cx_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      cx_pipeline_stages: {
        Row: {
          bg: string
          border: string
          color: string
          created_at: string
          id: string
          is_active: boolean
          is_system: boolean
          key: string
          label: string
          position: number
          updated_at: string
        }
        Insert: {
          bg?: string
          border?: string
          color?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_system?: boolean
          key: string
          label: string
          position?: number
          updated_at?: string
        }
        Update: {
          bg?: string
          border?: string
          color?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_system?: boolean
          key?: string
          label?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      cx_process_checklist: {
        Row: {
          category: string
          created_at: string
          deal_id: string
          document_id: string | null
          due_at: string | null
          id: string
          item_name: string
          notes: string | null
          responsible_user_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          deal_id: string
          document_id?: string | null
          due_at?: string | null
          id?: string
          item_name: string
          notes?: string | null
          responsible_user_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          deal_id?: string
          document_id?: string | null
          due_at?: string | null
          id?: string
          item_name?: string
          notes?: string | null
          responsible_user_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cx_process_checklist_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "cx_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cx_process_checklist_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "cx_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      cx_process_participants: {
        Row: {
          birth_date: string | null
          client_id: string | null
          cpf: string | null
          created_at: string
          created_by_user_id: string | null
          deal_id: string
          email: string | null
          full_name: string
          id: string
          income_participation: number | null
          marital_status: string | null
          monthly_income: number | null
          notes: string | null
          phone: string | null
          profession: string | null
          role: string
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          client_id?: string | null
          cpf?: string | null
          created_at?: string
          created_by_user_id?: string | null
          deal_id: string
          email?: string | null
          full_name: string
          id?: string
          income_participation?: number | null
          marital_status?: string | null
          monthly_income?: number | null
          notes?: string | null
          phone?: string | null
          profession?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          client_id?: string | null
          cpf?: string | null
          created_at?: string
          created_by_user_id?: string | null
          deal_id?: string
          email?: string | null
          full_name?: string
          id?: string
          income_participation?: number | null
          marital_status?: string | null
          monthly_income?: number | null
          notes?: string | null
          phone?: string | null
          profession?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cx_process_participants_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "cx_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cx_process_participants_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "cx_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      cx_properties: {
        Row: {
          address: string | null
          city: string | null
          client_id: string | null
          created_at: string
          created_by_user_id: string | null
          deal_id: string | null
          id: string
          municipal_registration: string | null
          name: string
          notary_office: string | null
          notes: string | null
          occupancy_status: string | null
          property_type: string | null
          registration_number: string | null
          state: string | null
          status: string
          updated_at: string
          value: number | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          client_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          deal_id?: string | null
          id?: string
          municipal_registration?: string | null
          name: string
          notary_office?: string | null
          notes?: string | null
          occupancy_status?: string | null
          property_type?: string | null
          registration_number?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          value?: number | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          client_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          deal_id?: string | null
          id?: string
          municipal_registration?: string | null
          name?: string
          notary_office?: string | null
          notes?: string | null
          occupancy_status?: string | null
          property_type?: string | null
          registration_number?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          value?: number | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cx_properties_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "cx_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cx_properties_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "cx_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      cx_property_sellers: {
        Row: {
          cpf_cnpj: string | null
          created_at: string
          created_by_user_id: string | null
          deal_id: string | null
          email: string | null
          full_name: string
          id: string
          marital_status: string | null
          notes: string | null
          person_type: string
          phone: string | null
          property_id: string
          spouse_name: string | null
          updated_at: string
        }
        Insert: {
          cpf_cnpj?: string | null
          created_at?: string
          created_by_user_id?: string | null
          deal_id?: string | null
          email?: string | null
          full_name: string
          id?: string
          marital_status?: string | null
          notes?: string | null
          person_type?: string
          phone?: string | null
          property_id: string
          spouse_name?: string | null
          updated_at?: string
        }
        Update: {
          cpf_cnpj?: string | null
          created_at?: string
          created_by_user_id?: string | null
          deal_id?: string | null
          email?: string | null
          full_name?: string
          id?: string
          marital_status?: string | null
          notes?: string | null
          person_type?: string
          phone?: string | null
          property_id?: string
          spouse_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cx_property_sellers_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "cx_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cx_property_sellers_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "cx_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      cx_registry_records: {
        Row: {
          created_at: string
          deal_id: string
          document_id: string | null
          id: string
          itbi_issued_at: string | null
          itbi_paid_at: string | null
          itbi_value: number | null
          notes: string | null
          pendencies: string | null
          protocol_at: string | null
          protocol_number: string | null
          registered_at: string | null
          registry_office: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deal_id: string
          document_id?: string | null
          id?: string
          itbi_issued_at?: string | null
          itbi_paid_at?: string | null
          itbi_value?: number | null
          notes?: string | null
          pendencies?: string | null
          protocol_at?: string | null
          protocol_number?: string | null
          registered_at?: string | null
          registry_office?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deal_id?: string
          document_id?: string | null
          id?: string
          itbi_issued_at?: string | null
          itbi_paid_at?: string | null
          itbi_value?: number | null
          notes?: string | null
          pendencies?: string | null
          protocol_at?: string | null
          protocol_number?: string | null
          registered_at?: string | null
          registry_office?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cx_registry_records_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "cx_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cx_registry_records_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "cx_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      cx_tasks: {
        Row: {
          client_id: string | null
          completed_at: string | null
          created_at: string
          created_by_user_id: string | null
          deal_id: string
          description: string | null
          due_at: string | null
          id: string
          kind: string
          priority: string
          responsible_name: string | null
          responsible_user_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by_user_id?: string | null
          deal_id: string
          description?: string | null
          due_at?: string | null
          id?: string
          kind?: string
          priority?: string
          responsible_name?: string | null
          responsible_user_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by_user_id?: string | null
          deal_id?: string
          description?: string | null
          due_at?: string | null
          id?: string
          kind?: string
          priority?: string
          responsible_name?: string | null
          responsible_user_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cx_tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "cx_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cx_tasks_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "cx_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      cx_team_roles: {
        Row: {
          assigned_by_user_id: string | null
          created_at: string
          id: string
          is_active: boolean
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_by_user_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_by_user_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          approval_status: string
          approved_at: string | null
          approved_by: string | null
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
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
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
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
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
      vdh_cc_lead_history: {
        Row: {
          created_at: string
          from_stage: string | null
          id: string
          lead_id: string
          note: string | null
          to_stage: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          created_at?: string
          from_stage?: string | null
          id?: string
          lead_id: string
          note?: string | null
          to_stage?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          created_at?: string
          from_stage?: string | null
          id?: string
          lead_id?: string
          note?: string | null
          to_stage?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vdh_cc_lead_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "vdh_cc_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      vdh_cc_leads: {
        Row: {
          analyst_notes: string | null
          approved_value: number | null
          assigned_broker_id: string | null
          assigned_broker_name: string | null
          birth_date: string | null
          city: string | null
          coborrower_income: number | null
          coborrower_name: string | null
          consent_at: string | null
          cpf: string | null
          created_at: string
          documents: Json
          email: string | null
          full_name: string
          has_coborrower: boolean
          id: string
          income_type: string | null
          marital_status: string | null
          monthly_income: number
          phone: string
          property_code: string | null
          property_snapshot: Json | null
          rejection_reason: string | null
          stage: string
          uf: string | null
          updated_at: string
          uses_fgts: boolean
        }
        Insert: {
          analyst_notes?: string | null
          approved_value?: number | null
          assigned_broker_id?: string | null
          assigned_broker_name?: string | null
          birth_date?: string | null
          city?: string | null
          coborrower_income?: number | null
          coborrower_name?: string | null
          consent_at?: string | null
          cpf?: string | null
          created_at?: string
          documents?: Json
          email?: string | null
          full_name: string
          has_coborrower?: boolean
          id?: string
          income_type?: string | null
          marital_status?: string | null
          monthly_income?: number
          phone: string
          property_code?: string | null
          property_snapshot?: Json | null
          rejection_reason?: string | null
          stage?: string
          uf?: string | null
          updated_at?: string
          uses_fgts?: boolean
        }
        Update: {
          analyst_notes?: string | null
          approved_value?: number | null
          assigned_broker_id?: string | null
          assigned_broker_name?: string | null
          birth_date?: string | null
          city?: string | null
          coborrower_income?: number | null
          coborrower_name?: string | null
          consent_at?: string | null
          cpf?: string | null
          created_at?: string
          documents?: Json
          email?: string | null
          full_name?: string
          has_coborrower?: boolean
          id?: string
          income_type?: string | null
          marital_status?: string | null
          monthly_income?: number
          phone?: string
          property_code?: string | null
          property_snapshot?: Json | null
          rejection_reason?: string | null
          stage?: string
          uf?: string | null
          updated_at?: string
          uses_fgts?: boolean
        }
        Relationships: []
      }
      vdh_olx_listings: {
        Row: {
          accepts_fgts: boolean | null
          accepts_financing: boolean | null
          address: string
          address_number: string | null
          area: number | null
          bathrooms: number | null
          bedrooms: number | null
          broker_email: string | null
          broker_name: string
          broker_phone: string
          city: string
          code: string
          condominium_fee: number | null
          created_at: string
          created_by_user_id: string | null
          creci: string | null
          description: string | null
          floor: string | null
          furnished: boolean | null
          garage_spaces: number | null
          id: string
          iptu: number | null
          is_active: boolean
          neighborhood: string
          photos: string[]
          property_type: string
          rental_price: number | null
          sale_price: number | null
          state: string
          suites: number | null
          title: string
          transaction_type: Database["public"]["Enums"]["olx_transaction_type"]
          updated_at: string
          zip_code: string
        }
        Insert: {
          accepts_fgts?: boolean | null
          accepts_financing?: boolean | null
          address: string
          address_number?: string | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          broker_email?: string | null
          broker_name: string
          broker_phone: string
          city: string
          code: string
          condominium_fee?: number | null
          created_at?: string
          created_by_user_id?: string | null
          creci?: string | null
          description?: string | null
          floor?: string | null
          furnished?: boolean | null
          garage_spaces?: number | null
          id?: string
          iptu?: number | null
          is_active?: boolean
          neighborhood: string
          photos?: string[]
          property_type?: string
          rental_price?: number | null
          sale_price?: number | null
          state?: string
          suites?: number | null
          title: string
          transaction_type?: Database["public"]["Enums"]["olx_transaction_type"]
          updated_at?: string
          zip_code: string
        }
        Update: {
          accepts_fgts?: boolean | null
          accepts_financing?: boolean | null
          address?: string
          address_number?: string | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          broker_email?: string | null
          broker_name?: string
          broker_phone?: string
          city?: string
          code?: string
          condominium_fee?: number | null
          created_at?: string
          created_by_user_id?: string | null
          creci?: string | null
          description?: string | null
          floor?: string | null
          furnished?: boolean | null
          garage_spaces?: number | null
          id?: string
          iptu?: number | null
          is_active?: boolean
          neighborhood?: string
          photos?: string[]
          property_type?: string
          rental_price?: number | null
          sale_price?: number | null
          state?: string
          suites?: number | null
          title?: string
          transaction_type?: Database["public"]["Enums"]["olx_transaction_type"]
          updated_at?: string
          zip_code?: string
        }
        Relationships: []
      }
      vdh_site_properties: {
        Row: {
          accepts_financing: boolean
          address: string | null
          area: number | null
          bedrooms: number
          caixa_link: string | null
          city: string
          code: string
          countdown_ends_at: string | null
          description: string | null
          discount: number
          evaluation: number
          first_seen_at: string
          garage_spaces: number
          last_seen_at: string
          neighborhood: string | null
          photo_url: string | null
          price: number
          property_type: string | null
          sale_modality: string | null
          sold_at: string | null
          status: string
          uf: string
          updated_at: string
        }
        Insert: {
          accepts_financing?: boolean
          address?: string | null
          area?: number | null
          bedrooms?: number
          caixa_link?: string | null
          city: string
          code: string
          countdown_ends_at?: string | null
          description?: string | null
          discount?: number
          evaluation?: number
          first_seen_at?: string
          garage_spaces?: number
          last_seen_at?: string
          neighborhood?: string | null
          photo_url?: string | null
          price?: number
          property_type?: string | null
          sale_modality?: string | null
          sold_at?: string | null
          status?: string
          uf: string
          updated_at?: string
        }
        Update: {
          accepts_financing?: boolean
          address?: string | null
          area?: number | null
          bedrooms?: number
          caixa_link?: string | null
          city?: string
          code?: string
          countdown_ends_at?: string | null
          description?: string | null
          discount?: number
          evaluation?: number
          first_seen_at?: string
          garage_spaces?: number
          last_seen_at?: string
          neighborhood?: string | null
          photo_url?: string | null
          price?: number
          property_type?: string | null
          sale_modality?: string | null
          sold_at?: string | null
          status?: string
          uf?: string
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
      cx_can_access_client: {
        Args: { _client_id: string; _user_id: string }
        Returns: boolean
      }
      cx_claim_invite: { Args: { _token: string }; Returns: string }
      cx_invite_info: {
        Args: { _token: string }
        Returns: {
          claimed: boolean
          client_id: string
          full_name: string
        }[]
      }
      cx_is_admin: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_vdh_inbox_access: { Args: { _user_id: string }; Returns: boolean }
      increment_landing_metric: {
        Args: { _metric: string; _slug: string }
        Returns: undefined
      }
      is_approved_user: { Args: { _user_id: string }; Returns: boolean }
      is_internal_user: { Args: { _user_id: string }; Returns: boolean }
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
      cx_deal_stage:
        | "simulacao"
        | "documentacao"
        | "em_analise"
        | "condicionado"
        | "aprovado"
        | "contrato"
        | "reprovado"
      cx_rejection_reason: "rating" | "capacidade" | "outro"
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
      olx_transaction_type: "venda" | "aluguel" | "lancamento"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      cx_deal_stage: [
        "simulacao",
        "documentacao",
        "em_analise",
        "condicionado",
        "aprovado",
        "contrato",
        "reprovado",
      ],
      cx_rejection_reason: ["rating", "capacidade", "outro"],
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
      olx_transaction_type: ["venda", "aluguel", "lancamento"],
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
