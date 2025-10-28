import { createClient } from '@supabase/supabase-js'

// Fallback values para evitar erro durante build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          nome: string
          email: string
          avatar_url?: string
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          email: string
          avatar_url?: string
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string
          avatar_url?: string
          created_at?: string
        }
      }
      devocionais: {
        Row: {
          id: number
          dia_num: number
          data: string
          texto_biblico_ref: string
          texto_biblico_full: string
          reflexao: string
          oracao: string
          imagem_fundo: string
        }
        Insert: {
          id?: number
          dia_num: number
          data: string
          texto_biblico_ref: string
          texto_biblico_full: string
          reflexao: string
          oracao: string
          imagem_fundo: string
        }
        Update: {
          id?: number
          dia_num?: number
          data?: string
          texto_biblico_ref?: string
          texto_biblico_full?: string
          reflexao?: string
          oracao?: string
          imagem_fundo?: string
        }
      }
      devocionais_status: {
        Row: {
          user_id: string
          devocional_id: number
          lido_boolean: boolean
          lido_at?: string
        }
        Insert: {
          user_id: string
          devocional_id: number
          lido_boolean: boolean
          lido_at?: string
        }
        Update: {
          user_id?: string
          devocional_id?: number
          lido_boolean?: boolean
          lido_at?: string
        }
      }
      versiculos: {
        Row: {
          id: number
          dia_num: number
          referencia: string
          texto: string
        }
        Insert: {
          id?: number
          dia_num: number
          referencia: string
          texto: string
        }
        Update: {
          id?: number
          dia_num?: number
          referencia?: string
          texto?: string
        }
      }
      pedidos_oracao: {
        Row: {
          id: number
          user_id: string
          titulo: string
          descricao: string
          publico_boolean: boolean
          prioridade: 'baixa' | 'media' | 'alta'
          respondido_boolean: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          titulo: string
          descricao: string
          publico_boolean: boolean
          prioridade: 'baixa' | 'media' | 'alta'
          respondido_boolean?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          titulo?: string
          descricao?: string
          publico_boolean?: boolean
          prioridade?: 'baixa' | 'media' | 'alta'
          respondido_boolean?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      musicas: {
        Row: {
          id: number
          dia_num: number
          titulo: string
          artista: string
          plataforma_link: string
        }
        Insert: {
          id?: number
          dia_num: number
          titulo: string
          artista: string
          plataforma_link: string
        }
        Update: {
          id?: number
          dia_num?: number
          titulo?: string
          artista?: string
          plataforma_link?: string
        }
      }
      assinaturas: {
        Row: {
          user_id: string
          status: 'ativa' | 'inativa' | 'cancelada'
          metodo_pagamento: string
          inicio: string
          validade: string
        }
        Insert: {
          user_id: string
          status: 'ativa' | 'inativa' | 'cancelada'
          metodo_pagamento: string
          inicio: string
          validade: string
        }
        Update: {
          user_id?: string
          status?: 'ativa' | 'inativa' | 'cancelada'
          metodo_pagamento?: string
          inicio?: string
          validade?: string
        }
      }
    }
  }
}