import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const hoje = new Date().toISOString().split('T')[0]
    
    // Buscar devocional do dia
    const { data: devocional } = await supabase
      .from('devocionais')
      .select('*')
      .eq('data', hoje)
      .single()

    // Buscar hinos do dia
    const { data: hinos } = await supabase
      .from('hinos_do_dia')
      .select('*')
      .eq('data', hoje)
      .order('ordem')

    // Buscar plano de leitura
    const { data: planoLeitura } = await supabase
      .from('planos_leitura')
      .select('*')
      .eq('data', hoje)
      .single()

    // Buscar pedidos de oração exemplo
    const { data: pedidosOracao } = await supabase
      .from('pedidos_oracao_exemplo')
      .select('*')
      .eq('data', hoje)

    // Se não houver conteúdo para hoje, criar conteúdo padrão
    const conteudoPadrao = {
      devocional: devocional || {
        id: 1,
        tema: "Confiança em Deus",
        versiculo: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.",
        referencia: "Provérbios 3:5",
        introducao: "A confiança em Deus é fundamental para uma vida cristã plena.",
        reflexao_central: "Quando confiamos em Deus completamente, Ele dirige nossos passos e nos guia pelo caminho certo. Nossa sabedoria é limitada, mas a sabedoria de Deus é infinita.",
        aplicacao_pratica: "Hoje, em cada decisão que você tomar, pare e ore pedindo a direção de Deus. Confie que Ele tem o melhor plano para sua vida.",
        oracao_final: "Senhor, ajuda-me a confiar em Ti de todo o meu coração. Que eu não dependa apenas da minha própria compreensão, mas busque sempre Tua vontade. Amém."
      },
      hinos: hinos || [
        {
          id: 1,
          titulo: "Grande é o Senhor",
          artista: "Ministério Apascentar",
          ordem: 1
        }
      ],
      planoLeitura: planoLeitura || {
        id: 1,
        titulo: "Leitura Bíblica Diária",
        descricao: "Plano de leitura para crescimento espiritual",
        leitura_manha: "Salmos 23",
        leitura_tarde: "Provérbios 3:1-10",
        leitura_noite: "João 3:16-21"
      },
      pedidosOracao: pedidosOracao || [
        {
          id: 1,
          categoria: "Família",
          pedido: "Pela união e harmonia familiar"
        },
        {
          id: 2,
          categoria: "Saúde",
          pedido: "Pela cura e restauração"
        },
        {
          id: 3,
          categoria: "Trabalho",
          pedido: "Por oportunidades e provisão"
        }
      ]
    }

    return NextResponse.json(conteudoPadrao)
  } catch (error) {
    console.error('Erro ao buscar conteúdo:', error)
    return NextResponse.json(
      { error: 'Erro ao carregar conteúdo' },
      { status: 500 }
    )
  }
}