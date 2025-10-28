import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    const hoje = new Date().toISOString().split('T')[0]
    
    // Gerar novo devocional
    const novoDevocional = {
      data: hoje,
      tema: "Esperança em Cristo",
      versiculo: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais.",
      referencia: "Jeremias 29:11",
      introducao: "Deus tem planos maravilhosos para cada um de nós.",
      reflexao_central: "Mesmo nos momentos difíceis, podemos ter certeza de que Deus está no controle. Seus planos são sempre para o nosso bem e para nos dar esperança e futuro.",
      aplicacao_pratica: "Confie nos planos de Deus para sua vida. Mesmo quando não entendemos o caminho, Ele está nos guiando para algo melhor.",
      oracao_final: "Pai celestial, obrigado por Teus planos perfeitos para minha vida. Ajuda-me a confiar em Ti em todos os momentos. Amém."
    }

    // Inserir ou atualizar devocional
    const { error: devocionalError } = await supabase
      .from('devocionais')
      .upsert([{
        data: hoje,
        dia_num: new Date().getDate(),
        texto_biblico_ref: novoDevocional.referencia,
        texto_biblico_full: novoDevocional.versiculo,
        reflexao: novoDevocional.reflexao_central,
        oracao: novoDevocional.oracao_final,
        imagem_fundo: 'default.jpg'
      }])

    // Gerar hinos do dia
    const novosHinos = [
      {
        data: hoje,
        titulo: "Quão Grande é o Meu Deus",
        artista: "Hillsong",
        ordem: 1
      },
      {
        data: hoje,
        titulo: "Reckless Love",
        artista: "Cory Asbury",
        ordem: 2
      }
    ]

    const { error: hinosError } = await supabase
      .from('hinos_do_dia')
      .upsert(novosHinos)

    // Gerar plano de leitura
    const novoPlano = {
      data: hoje,
      titulo: "Crescimento Espiritual",
      descricao: "Leituras para fortalecer sua fé",
      leitura_manha: "Salmos 91",
      leitura_tarde: "Provérbios 31:10-31",
      leitura_noite: "Filipenses 4:4-13"
    }

    const { error: planoError } = await supabase
      .from('planos_leitura')
      .upsert([novoPlano])

    // Gerar pedidos de oração exemplo
    const novosPedidos = [
      {
        data: hoje,
        categoria: "Família",
        pedido: "Pela proteção e bênção sobre as famílias"
      },
      {
        data: hoje,
        categoria: "Igreja",
        pedido: "Pelo crescimento e unidade da igreja"
      },
      {
        data: hoje,
        categoria: "Nação",
        pedido: "Pela paz e justiça em nossa nação"
      }
    ]

    const { error: pedidosError } = await supabase
      .from('pedidos_oracao_exemplo')
      .upsert(novosPedidos)

    if (devocionalError || hinosError || planoError || pedidosError) {
      console.error('Erros ao inserir:', { devocionalError, hinosError, planoError, pedidosError })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Novo conteúdo gerado com sucesso!' 
    })
  } catch (error) {
    console.error('Erro ao gerar conteúdo:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar novo conteúdo' },
      { status: 500 }
    )
  }
}