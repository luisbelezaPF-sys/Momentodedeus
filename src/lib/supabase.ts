import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Fallback values para evitar erro durante build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Verificar se as variáveis estão configuradas corretamente
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'placeholder-key' &&
         supabaseUrl.includes('supabase.co')
}

// Função para criar cliente Supabase (compatível com as APIs)
export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Cliente Supabase padrão (mantido para compatibilidade)
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

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
      hinos_do_dia: {
        Row: {
          id: number
          data: string
          titulo: string
          artista: string
          ordem: number
        }
        Insert: {
          id?: number
          data: string
          titulo: string
          artista: string
          ordem: number
        }
        Update: {
          id?: number
          data?: string
          titulo?: string
          artista?: string
          ordem?: number
        }
      }
      planos_leitura: {
        Row: {
          id: number
          data: string
          titulo: string
          descricao: string
          leitura_manha: string
          leitura_tarde: string
          leitura_noite: string
        }
        Insert: {
          id?: number
          data: string
          titulo: string
          descricao: string
          leitura_manha: string
          leitura_tarde: string
          leitura_noite: string
        }
        Update: {
          id?: number
          data?: string
          titulo?: string
          descricao?: string
          leitura_manha?: string
          leitura_tarde?: string
          leitura_noite?: string
        }
      }
      pedidos_oracao_exemplo: {
        Row: {
          id: number
          data: string
          categoria: string
          pedido: string
        }
        Insert: {
          id?: number
          data: string
          categoria: string
          pedido: string
        }
        Update: {
          id?: number
          data?: string
          categoria?: string
          pedido?: string
        }
      }
    }
  }
}