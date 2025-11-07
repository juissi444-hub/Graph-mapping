import { createClient } from '@supabase/supabase-js'

// @ts-ignore - Vite env types
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || ''
// @ts-ignore - Vite env types
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (will be auto-generated from Supabase later)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          created_at?: string
        }
      }
      graphs: {
        Row: {
          id: string
          name: string
          description: string | null
          nodes: any
          edges: any
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          nodes: any
          edges: any
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          nodes?: any
          edges?: any
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          graph_id: string
          user_id: string
          rating: number
          created_at: string
        }
        Insert: {
          id?: string
          graph_id: string
          user_id: string
          rating: number
          created_at?: string
        }
        Update: {
          id?: string
          graph_id?: string
          user_id?: string
          rating?: number
          created_at?: string
        }
      }
    }
  }
}
