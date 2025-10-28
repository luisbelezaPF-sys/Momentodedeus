import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Simular processamento do webhook do PagSeguro
    const { transaction } = body
    
    if (!transaction || !transaction.customer?.email) {
      return NextResponse.json(
        { error: 'Dados de transação inválidos' },
        { status: 400 }
      )
    }

    // Buscar usuário pelo email
    const { data: usuario, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', transaction.customer.email)
      .single()

    if (userError || !usuario) {
      console.error('Usuário não encontrado:', transaction.customer.email)
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Se pagamento foi aprovado, criar/atualizar assinatura
    if (transaction.status === 'paid') {
      const agora = new Date()
      const dataFim = new Date()
      dataFim.setMonth(dataFim.getMonth() + 1) // 1 mês de assinatura

      const { error: assinaturaError } = await supabase
        .from('assinaturas')
        .upsert([{
          user_id: usuario.id,
          status: 'ativa',
          metodo_pagamento: `pagseguro_${transaction.id}`,
          inicio: agora.toISOString(),
          validade: dataFim.toISOString()
        }])

      if (assinaturaError) {
        console.error('Erro ao criar assinatura:', assinaturaError)
        return NextResponse.json(
          { error: 'Erro ao processar assinatura' },
          { status: 500 }
        )
      }

      console.log(`Assinatura ativada para usuário: ${usuario.email}`)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Webhook processado com sucesso'
    })

  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}