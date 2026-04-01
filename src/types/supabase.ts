export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          deleted_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      attachments: {
        Row: {
          created_at: string
          external_url: string | null
          file_name: string
          id: string
          message_id: string
          mime_type: string | null
          size_bytes: number | null
          storage_uri: string | null
        }
        Insert: {
          created_at?: string
          external_url?: string | null
          file_name: string
          id?: string
          message_id: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_uri?: string | null
        }
        Update: {
          created_at?: string
          external_url?: string | null
          file_name?: string
          id?: string
          message_id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_uri?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'attachments_message_id_fkey'
            columns: ['message_id']
            isOneToOne: false
            referencedRelation: 'messages'
            referencedColumns: ['id']
          },
        ]
      }
      clients: {
        Row: {
          activity: string | null
          address: string | null
          auth_user_id: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          email: string
          first_name: string | null
          fts: unknown
          id: string
          last_name: string | null
          notes: string | null
          phone: string | null
          siret: string | null
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          activity?: string | null
          address?: string | null
          auth_user_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          email: string
          first_name?: string | null
          fts?: unknown
          id?: string
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          siret?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          activity?: string | null
          address?: string | null
          auth_user_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          email?: string
          first_name?: string | null
          fts?: unknown
          id?: string
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          siret?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_page_revisions: {
        Row: {
          author_id: string | null
          created_at: string
          id: string
          label: string | null
          page_id: string
          snapshot: Json
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          id?: string
          label?: string | null
          page_id: string
          snapshot: Json
        }
        Update: {
          author_id?: string | null
          created_at?: string
          id?: string
          label?: string | null
          page_id?: string
          snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: 'cms_page_revisions_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'admin_users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'cms_page_revisions_page_id_fkey'
            columns: ['page_id']
            isOneToOne: false
            referencedRelation: 'cms_pages'
            referencedColumns: ['id']
          },
        ]
      }
      cms_pages: {
        Row: {
          author_id: string | null
          canonical_url: string | null
          created_at: string
          excerpt: string | null
          fts_en: unknown
          fts_fr: unknown
          galerie: Json
          hero_image: Json | null
          id: string
          lang: string
          menu_order: number
          meta_description: string | null
          og_image: Json | null
          og_title: string | null
          parent_id: string | null
          published: boolean
          published_at: string | null
          resume: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          robots: string
          schema_markup: Json | null
          sections: Json
          show_in_menu: boolean
          slug: string
          template: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          canonical_url?: string | null
          created_at?: string
          excerpt?: string | null
          fts_en?: unknown
          fts_fr?: unknown
          galerie?: Json
          hero_image?: Json | null
          id?: string
          lang?: string
          menu_order?: number
          meta_description?: string | null
          og_image?: Json | null
          og_title?: string | null
          parent_id?: string | null
          published?: boolean
          published_at?: string | null
          resume?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          robots?: string
          schema_markup?: Json | null
          sections?: Json
          show_in_menu?: boolean
          slug: string
          template?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          canonical_url?: string | null
          created_at?: string
          excerpt?: string | null
          fts_en?: unknown
          fts_fr?: unknown
          galerie?: Json
          hero_image?: Json | null
          id?: string
          lang?: string
          menu_order?: number
          meta_description?: string | null
          og_image?: Json | null
          og_title?: string | null
          parent_id?: string | null
          published?: boolean
          published_at?: string | null
          resume?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          robots?: string
          schema_markup?: Json | null
          sections?: Json
          show_in_menu?: boolean
          slug?: string
          template?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'cms_pages_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'admin_users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'cms_pages_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'cms_pages'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'cms_pages_reviewed_by_fkey'
            columns: ['reviewed_by']
            isOneToOne: false
            referencedRelation: 'admin_users'
            referencedColumns: ['id']
          },
        ]
      }
      consents: {
        Row: {
          accepted_at: string
          id: string
          ip_address: string | null
          type: string
          user_agent: string | null
          user_id: string
          version: string
        }
        Insert: {
          accepted_at?: string
          id?: string
          ip_address?: string | null
          type: string
          user_agent?: string | null
          user_id: string
          version: string
        }
        Update: {
          accepted_at?: string
          id?: string
          ip_address?: string | null
          type?: string
          user_agent?: string | null
          user_id?: string
          version?: string
        }
        Relationships: []
      }
      invoice_lines: {
        Row: {
          description: string
          id: string
          invoice_id: string
          order_index: number
          quantity: number
          tva_rate: number
          unit_price: number
        }
        Insert: {
          description: string
          id?: string
          invoice_id: string
          order_index?: number
          quantity?: number
          tva_rate?: number
          unit_price: number
        }
        Update: {
          description?: string
          id?: string
          invoice_id?: string
          order_index?: number
          quantity?: number
          tva_rate?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: 'invoice_lines_invoice_id_fkey'
            columns: ['invoice_id']
            isOneToOne: false
            referencedRelation: 'invoices'
            referencedColumns: ['id']
          },
        ]
      }
      invoices: {
        Row: {
          amount_ht: number
          created_at: string
          deleted_at: string | null
          due_at: string | null
          fts: unknown
          id: string
          issued_at: string
          notes: string | null
          number: string
          project_id: string
          quote_id: string | null
          status: string
          tva_rate: number
          updated_at: string
        }
        Insert: {
          amount_ht: number
          created_at?: string
          deleted_at?: string | null
          due_at?: string | null
          fts?: unknown
          id?: string
          issued_at: string
          notes?: string | null
          number: string
          project_id: string
          quote_id?: string | null
          status?: string
          tva_rate?: number
          updated_at?: string
        }
        Update: {
          amount_ht?: number
          created_at?: string
          deleted_at?: string | null
          due_at?: string | null
          fts?: unknown
          id?: string
          issued_at?: string
          notes?: string | null
          number?: string
          project_id?: string
          quote_id?: string | null
          status?: string
          tva_rate?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'invoices_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'invoices_quote_id_fkey'
            columns: ['quote_id']
            isOneToOne: false
            referencedRelation: 'quotes'
            referencedColumns: ['id']
          },
        ]
      }
      message_reads: {
        Row: {
          message_id: string
          read_at: string
          user_id: string
          user_type: string
        }
        Insert: {
          message_id: string
          read_at?: string
          user_id: string
          user_type: string
        }
        Update: {
          message_id?: string
          read_at?: string
          user_id?: string
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'message_reads_message_id_fkey'
            columns: ['message_id']
            isOneToOne: false
            referencedRelation: 'messages'
            referencedColumns: ['id']
          },
        ]
      }
      messages: {
        Row: {
          author_id: string
          author_type: string
          content: string
          created_at: string
          id: string
          project_id: string
        }
        Insert: {
          author_id: string
          author_type: string
          content: string
          created_at?: string
          id?: string
          project_id: string
        }
        Update: {
          author_id?: string
          author_type?: string
          content?: string
          created_at?: string
          id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'messages_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      numbering_counters: {
        Row: {
          counter: number
          doc_type: string
          year: number
        }
        Insert: {
          counter?: number
          doc_type: string
          year: number
        }
        Update: {
          counter?: number
          doc_type?: string
          year?: number
        }
        Relationships: []
      }
      pages_linked: {
        Row: {
          linked_page_id: string
          order_index: number
          page_id: string
        }
        Insert: {
          linked_page_id: string
          order_index?: number
          page_id: string
        }
        Update: {
          linked_page_id?: string
          order_index?: number
          page_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'pages_linked_linked_page_id_fkey'
            columns: ['linked_page_id']
            isOneToOne: false
            referencedRelation: 'cms_pages'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pages_linked_page_id_fkey'
            columns: ['page_id']
            isOneToOne: false
            referencedRelation: 'cms_pages'
            referencedColumns: ['id']
          },
        ]
      }
      pages_tags: {
        Row: {
          page_id: string
          tag_id: string
        }
        Insert: {
          page_id: string
          tag_id: string
        }
        Update: {
          page_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'pages_tags_page_id_fkey'
            columns: ['page_id']
            isOneToOne: false
            referencedRelation: 'cms_pages'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pages_tags_tag_id_fkey'
            columns: ['tag_id']
            isOneToOne: false
            referencedRelation: 'tags'
            referencedColumns: ['id']
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          method: string
          notes: string | null
          paid_at: string
          stripe_id: string | null
          type: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id: string
          method: string
          notes?: string | null
          paid_at: string
          stripe_id?: string | null
          type: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          method?: string
          notes?: string | null
          paid_at?: string
          stripe_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'payments_invoice_id_fkey'
            columns: ['invoice_id']
            isOneToOne: false
            referencedRelation: 'invoices'
            referencedColumns: ['id']
          },
        ]
      }
      project_images: {
        Row: {
          alt: string
          created_at: string
          external_url: string | null
          id: string
          order_index: number
          project_id: string
          storage_uri: string | null
        }
        Insert: {
          alt?: string
          created_at?: string
          external_url?: string | null
          id?: string
          order_index?: number
          project_id: string
          storage_uri?: string | null
        }
        Update: {
          alt?: string
          created_at?: string
          external_url?: string | null
          id?: string
          order_index?: number
          project_id?: string
          storage_uri?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'project_images_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      projects: {
        Row: {
          client_id: string
          created_at: string
          deleted_at: string | null
          description: string | null
          end_date: string | null
          fts: unknown
          id: string
          specifications_tiptap: string | null
          specifications_updated_at: string | null
          start_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          end_date?: string | null
          fts?: unknown
          id?: string
          specifications_tiptap?: string | null
          specifications_updated_at?: string | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          end_date?: string | null
          fts?: unknown
          id?: string
          specifications_tiptap?: string | null
          specifications_updated_at?: string | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'projects_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'clients'
            referencedColumns: ['id']
          },
        ]
      }
      quote_lines: {
        Row: {
          description: string
          id: string
          order_index: number
          quantity: number
          quote_id: string
          tva_rate: number
          unit_price: number
        }
        Insert: {
          description: string
          id?: string
          order_index?: number
          quantity?: number
          quote_id: string
          tva_rate?: number
          unit_price: number
        }
        Update: {
          description?: string
          id?: string
          order_index?: number
          quantity?: number
          quote_id?: string
          tva_rate?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: 'quote_lines_quote_id_fkey'
            columns: ['quote_id']
            isOneToOne: false
            referencedRelation: 'quotes'
            referencedColumns: ['id']
          },
        ]
      }
      quotes: {
        Row: {
          amount_ht: number
          created_at: string
          deleted_at: string | null
          fts: unknown
          id: string
          issued_at: string
          notes: string | null
          number: string
          project_id: string
          status: string
          tva_rate: number
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          amount_ht: number
          created_at?: string
          deleted_at?: string | null
          fts?: unknown
          id?: string
          issued_at: string
          notes?: string | null
          number: string
          project_id: string
          status?: string
          tva_rate?: number
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          amount_ht?: number
          created_at?: string
          deleted_at?: string | null
          fts?: unknown
          id?: string
          issued_at?: string
          notes?: string | null
          number?: string
          project_id?: string
          status?: string
          tva_rate?: number
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'quotes_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      generate_document_number: {
        Args: { p_doc_type: string }
        Returns: string
      }
      is_admin: { Args: never; Returns: boolean }
      is_admin_or_editor: { Args: never; Returns: boolean }
      search_cms_pages: {
        Args: { lang?: string; query: string }
        Returns: {
          author_id: string | null
          canonical_url: string | null
          created_at: string
          excerpt: string | null
          fts_en: unknown
          fts_fr: unknown
          galerie: Json
          hero_image: Json | null
          id: string
          lang: string
          menu_order: number
          meta_description: string | null
          og_image: Json | null
          og_title: string | null
          parent_id: string | null
          published: boolean
          published_at: string | null
          resume: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          robots: string
          schema_markup: Json | null
          sections: Json
          show_in_menu: boolean
          slug: string
          template: string
          title: string
          updated_at: string
        }[]
        SetofOptions: {
          from: '*'
          to: 'cms_pages'
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
