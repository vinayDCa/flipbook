export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
          name: string
          logo: string | null
          website: string | null
          whatsapp: string | null
          primary_color: string | null
          secondary_color: string | null
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          logo?: string | null
          website?: string | null
          whatsapp?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          created_at?: string
          user_id?: string
        }
        Update: {
          id?: string
          name?: string
          logo?: string | null
          website?: string | null
          whatsapp?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          created_at?: string
          user_id?: string
        }
      }
      flipbooks: {
        Row: {
          id: string
          business_id: string
          title: string
          slug: string
          description: string | null
          pdf_url: string
          cover_url: string | null
          page_count: number
          status: string
          allow_download: boolean
          allow_share: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          title: string
          slug: string
          description?: string | null
          pdf_url: string
          cover_url?: string | null
          page_count?: number
          status?: string
          allow_download?: boolean
          allow_share?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          title?: string
          slug?: string
          description?: string | null
          pdf_url?: string
          cover_url?: string | null
          page_count?: number
          status?: string
          allow_download?: boolean
          allow_share?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      pages: {
        Row: {
          id: string
          flipbook_id: string
          page_number: number
          image_url: string
          thumbnail_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          flipbook_id: string
          page_number: number
          image_url: string
          thumbnail_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          flipbook_id?: string
          page_number?: number
          image_url?: string
          thumbnail_url?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          flipbook_id: string
          name: string
          product_code: string | null
          description: string | null
          price: number | null
          page_number: number
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          flipbook_id: string
          name: string
          product_code?: string | null
          description?: string | null
          price?: number | null
          page_number: number
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          flipbook_id?: string
          name?: string
          product_code?: string | null
          description?: string | null
          price?: number | null
          page_number?: number
          image_url?: string | null
          created_at?: string
        }
      }
      hotspots: {
        Row: {
          id: string
          flipbook_id: string
          page_number: number
          x: number
          y: number
          width: number
          height: number
          type: string
          target: string
          created_at: string
        }
        Insert: {
          id?: string
          flipbook_id: string
          page_number: number
          x: number
          y: number
          width: number
          height: number
          type: string
          target: string
          created_at?: string
        }
        Update: {
          id?: string
          flipbook_id?: string
          page_number?: number
          x?: number
          y?: number
          width?: number
          height?: number
          type?: string
          target?: string
          created_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          flipbook_id: string
          product_id: string | null
          name: string
          phone: string
          email: string | null
          message: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          flipbook_id: string
          product_id?: string | null
          name: string
          phone: string
          email?: string | null
          message?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          flipbook_id?: string
          product_id?: string | null
          name?: string
          phone?: string
          email?: string | null
          message?: string | null
          status?: string
          created_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          flipbook_id: string
          page_number: number | null
          event_type: string
          session_id: string
          device: string
          created_at: string
        }
        Insert: {
          id?: string
          flipbook_id: string
          page_number?: number | null
          event_type: string
          session_id: string
          device: string
          created_at?: string
        }
        Update: {
          id?: string
          flipbook_id?: string
          page_number?: number | null
          event_type?: string
          session_id?: string
          device?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
